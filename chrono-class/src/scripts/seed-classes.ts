
import 'dotenv/config';
import { firestore, auth } from '../lib/firebase/client-app';
import { collection, doc, writeBatch, getDocs, Timestamp, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SUPER_USER_EMAIL = 'super@pertuto.com';
const SUPER_USER_PASSWORD = 'password';

const TENANT_ID = 'pertuto-tenant';
const TIMEZONE_OFFSET = -5; // EST (Standard Time) - adjust if DST. Actually better to use ISO strings or libraries, but fixed offset -5 is fine for MVP EST.

// Schedule Configuration (EST)
const SCHEDULE = [
    // Monday
    { day: 1, time: '17:00', sessionTitle: "Rutu's Math", courseName: "General Mathematics", duration: 60 },
    { day: 1, time: '18:00', sessionTitle: "Sayan's Geometry", courseName: "Geometry", duration: 60 },
    { day: 1, time: '19:30', sessionTitle: "Aahana's Pre-Calc", courseName: "AP Precalculus", duration: 60 },
    { day: 1, time: '20:30', sessionTitle: "Jahnvi's CSP", courseName: "AP Computer Science Principles", duration: 60 },
    { day: 1, time: '21:30', sessionTitle: "Inba's Pre-Calc", courseName: "AP Precalculus", duration: 60 },
    { day: 1, time: '13:00', sessionTitle: "Katya's Math", courseName: "IB MYP 5 Mathematics", duration: 90 },

    // Tuesday
    { day: 2, time: '18:00', sessionTitle: "Arvin's Pre-Calc", courseName: "AP Precalculus", duration: 60 },
    { day: 2, time: '19:30', sessionTitle: "Anushree's Algebra", courseName: "Algebra 1", duration: 60 },
    { day: 2, time: '20:30', sessionTitle: "Mahek's Algebra 2", courseName: "Algebra 2", duration: 60 },
    { day: 2, time: '21:30', sessionTitle: "Sahana's Pre-Calc", courseName: "AP Precalculus", duration: 60 },
    { day: 2, time: '16:00', sessionTitle: "Isiah's Math", courseName: "General Mathematics", duration: 60 },
    { day: 2, time: '13:00', sessionTitle: "Katya's Math", courseName: "IB MYP 5 Mathematics", duration: 90 },
    { day: 2, time: '05:00', sessionTitle: "Swara's Math", courseName: "IB MYP 5 Mathematics", duration: 60 },
    { day: 2, time: '07:30', sessionTitle: "Arinjay's Sci", courseName: "IGCSE Biology", duration: 60 },

    // Wednesday
    { day: 3, time: '17:00', sessionTitle: "Raunak's Microbit", courseName: "Microbit", duration: 60 },
    { day: 3, time: '18:00', sessionTitle: "Sayan's Geometry", courseName: "Geometry", duration: 60 },
    { day: 3, time: '20:30', sessionTitle: "Rutu's Math", courseName: "General Mathematics", duration: 60 },
    { day: 3, time: '21:30', sessionTitle: "Sahana's Pre-Calc", courseName: "AP Precalculus", duration: 60 },
    { day: 3, time: '13:00', sessionTitle: "Katya's Math", courseName: "IB MYP 5 Mathematics", duration: 90 },

    // Thursday
    { day: 4, time: '18:00', sessionTitle: "Arvin's Pre-Calc", courseName: "AP Precalculus", duration: 60 },
    { day: 4, time: '19:30', sessionTitle: "Aahana's Pre-Calc", courseName: "AP Precalculus", duration: 60 },
    { day: 4, time: '20:30', sessionTitle: "Rutu's Math", courseName: "General Mathematics", duration: 60 },
    { day: 4, time: '21:30', sessionTitle: "Akira's Microbit", courseName: "Microbit", duration: 60 },
    { day: 4, time: '05:00', sessionTitle: "Swara's Math", courseName: "IB MYP 5 Mathematics", duration: 60 },
    { day: 4, time: '07:30', sessionTitle: "Arinjay's Sci", courseName: "IGCSE Biology", duration: 60 },

    // Friday
    { day: 5, time: '19:30', sessionTitle: "Rutu's Math", courseName: "General Mathematics", duration: 60 },
    { day: 5, time: '20:30', sessionTitle: "Mahek's Algebra 2", courseName: "Algebra 2", duration: 60 },
    { day: 5, time: '13:00', sessionTitle: "Katya's Math", courseName: "IB MYP 5 Mathematics", duration: 90 },

    // Saturday
    { day: 6, time: '11:00', sessionTitle: "Isiah's Math", courseName: "General Mathematics", duration: 60 },
    { day: 6, time: '07:30', sessionTitle: "Arinjay's Sci", courseName: "IGCSE Biology", duration: 60 },

    // Sunday
    { day: 0, time: '19:30', sessionTitle: "Anushree's Algebra", courseName: "Algebra 1", duration: 60 },
    { day: 0, time: '20:30', sessionTitle: "Mahek's Algebra 2", courseName: "Algebra 2", duration: 60 },

    // Monday (Additional)
    { day: 1, time: '13:00', sessionTitle: "Katya's Math", courseName: "IB MYP 5 Mathematics", duration: 90 },
];

function getNextDate(dayIndex: number, timeStr: string): Date {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Find the correct day of week locally first
    if (date.getDay() === dayIndex && date > now) {
        // It's today and future (locally)
    } else {
        // Calculate days to add to get to next dayIndex
        const daysToAdd = (dayIndex + 7 - date.getDay()) % 7;
        date.setDate(date.getDate() + daysToAdd);
        // If it's today but time passed, or if calculation resulted in today but time passed
        if (date <= now) {
            date.setDate(date.getDate() + 7);
        }
    }

    // Now 'date' has the correct Year/Month/Day.
    // Construct the EST timestamp using these components + timeStr + Offset.
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(hours).padStart(2, '0');
    const min = String(minutes).padStart(2, '0');

    // EST is UTC-05:00
    const isoString = `${yyyy}-${mm}-${dd}T${hh}:${min}:00-05:00`;
    return new Date(isoString);
}

async function seedClasses() {
    console.log('Logging in...');
    await signInWithEmailAndPassword(auth, SUPER_USER_EMAIL, SUPER_USER_PASSWORD);
    console.log('Logged in!');

    console.log('🧹 Cleaning up existing classes...');
    const existingClasses = await getDocs(collection(firestore, `tenants/${TENANT_ID}/classes`));
    const deleteBatch = writeBatch(firestore);
    existingClasses.forEach(doc => {
        deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log(`Deleted ${existingClasses.size} existing classes.`);

    console.log('🗓️ Scheduling Classes...');

    // 1. Get Courses
    const coursesSnapshot = await getDocs(collection(firestore, `tenants/${TENANT_ID}/courses`));
    const courseMap = new Map<string, { id: string, studentIds: string[] }>(); // Title -> Data
    coursesSnapshot.forEach(doc => {
        const data = doc.data();
        courseMap.set(data.title, {
            id: doc.id,
            studentIds: data.studentIds || []
        });
    });

    // 1.5 Get Students for mapping
    const studentsSnapshot = await getDocs(collection(firestore, `tenants/${TENANT_ID}/students`));
    const studentMap = new Map<string, string>(); // Name -> ID
    studentsSnapshot.forEach(doc => {
        const data = doc.data();
        studentMap.set(data.name, doc.id);
    });
    console.log(`FOUND ${studentsSnapshot.size} students for mapping.`);

    const batch = writeBatch(firestore);
    const classesRef = collection(firestore, `tenants/${TENANT_ID}/classes`);

    const END_DATE = new Date();
    END_DATE.setDate(END_DATE.getDate() + 90); // 3 months roughly

    let count = 0;

    for (const item of SCHEDULE) {
        const courseData = courseMap.get(item.courseName);
        if (!courseData) {
            console.warn(`⚠️ Course not found for name: ${item.courseName}`);
            continue;
        }

        // Try to find specific student from title (e.g. "Rutu's Math" -> "Rutu")
        let assignedStudentIds: string[] = [];
        const titleParts = item.sessionTitle.split("'");
        if (titleParts.length > 0) {
            const potentialName = titleParts[0];
            const studentId = studentMap.get(potentialName);
            if (studentId) {
                assignedStudentIds.push(studentId);
            }
        }

        // Fallback for known multi-student classes or exact matches
        if (assignedStudentIds.length === 0) {
            // Direct name match lookup (e.g. "Isiah" if title was just "Isiah") - rarely case here
        }

        // Determine First Start Date
        let currentDate = getNextDate(item.day, item.time);

        while (currentDate <= END_DATE) {
            const docRef = doc(classesRef);

            const start = new Date(currentDate);
            const end = new Date(currentDate);
            end.setMinutes(end.getMinutes() + item.duration);

            batch.set(docRef, {
                ownerId: 'manual-seed', // Should be instructor ID ideally
                tenantId: TENANT_ID,
                title: item.sessionTitle,
                courseId: courseData.id,
                start: start,
                end: end,
                status: 'scheduled',
                students: assignedStudentIds
            });

            // Move to next week
            currentDate.setDate(currentDate.getDate() + 7);
            count++;
        }
    }

    console.log(`Committing ${count} class sessions...`);
    await batch.commit();
    console.log('✅ Schedule Created!');
    process.exit(0);
}

seedClasses().catch(e => console.error(e));
