import 'dotenv/config';
import { firestore, auth } from '../lib/firebase/client-app';
import { collection, doc, setDoc, getDocs, query, where, addDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const SUPER_USER_EMAIL = 'super@pertuto.com'; // Reuse existing super or this one if it exists
const SUPER_USER_PASSWORD = 'password';

// Tenant Details
const TENANT_NAME = 'Pertuto';
const TENANT_ID = 'pertuto-tenant'; // ID derived from name
const ADMIN_EMAIL = 'ankur@pertuto.com';
const ADMIN_NAME = 'Ankur';
const DEFAULT_PASSWORD = 'password123';

// Instructor
const INSTRUCTOR_EMAIL = 'teacher@pertuto.com';
const INSTRUCTOR_NAME = 'Ms. Teacher';

const studentsData = [
    // --- Science & General ---
    { name: 'Sara', email: 'sara@pertuto.com', timezone: 'IST', curriculum: 'CBSE', grade: '6', courses: ["CBSE Science", "CBSE Computer Science"] },
    { name: 'Vihaan', email: 'vihaan@pertuto.com', timezone: 'Asia/Singapore', curriculum: 'IGCSE', grade: '7', courses: ["IGCSE Science"] },

    // --- Math & Competitions ---
    { name: 'Aaryavier', email: 'aaryavier@pertuto.com', timezone: 'EST', curriculum: 'AM 8', grade: '7', courses: ["AMC 8"] },
    { name: 'Aarya', email: 'aarya@pertuto.com', timezone: 'Asia/Bangkok', curriculum: 'IB DP', grade: '', courses: ["IB DP Physics"] },

    // --- Specialized Science ---
    { name: 'Arinjay', email: 'arinjay@pertuto.com', timezone: 'IST', curriculum: 'IGCSE', grade: '9', courses: ["IGCSE Biology", "IGCSE Chemistry"] },
    { name: 'Biraj', email: 'biraj@pertuto.com', timezone: 'Asia/Jakarta', curriculum: 'AP', grade: '', courses: ["AP Physics"] },

    // --- IB MYP 5 ---
    { name: 'Swara', email: 'swara@pertuto.com', timezone: 'Asia/Jakarta', curriculum: 'IB MYP 5', grade: 'MYP 5', courses: ["IB MYP 5 Mathematics", "IB MYP 5 Biology", "IB MYP 5 Computer Science"] },
    { name: 'Katya', email: 'katya@pertuto.com', timezone: 'GMT', curriculum: 'IB MYP 5', grade: 'MYP 5', courses: ["IB MYP 5 Mathematics", "IB MYP 5 Chemistry", "IB MYP 5 Physics"] },

    // --- High School Math (EST) ---
    { name: 'Anusree', email: 'anusree@pertuto.com', timezone: 'EST', curriculum: 'Algebra 1', grade: 'Algebra 1', courses: ["Algebra 1"] },
    { name: 'Kanika', email: 'kanika@pertuto.com', timezone: 'Asia/Singapore', curriculum: 'IB DP', grade: 'DP', courses: ["IB DP Mathematics AA"] },
    { name: 'Inba', email: 'inba@pertuto.com', timezone: 'EST', curriculum: 'AP Precalculus', grade: 'AP Precalculus', courses: ["AP Precalculus"] },
    { name: 'Sayan', email: 'sayan@pertuto.com', timezone: 'EST', curriculum: 'Geometry', grade: 'Geometry', courses: ["Geometry"] },
    { name: 'Mahek', email: 'mahek@pertuto.com', timezone: 'EST', curriculum: 'Algebra 2', grade: 'Algebra 2', courses: ["Algebra 2"] },
    { name: 'Aahana', email: 'aahana@pertuto.com', timezone: 'EST', curriculum: 'AP Precalculus', grade: 'AP Precalculus', courses: ["AP Precalculus"] },
    { name: 'Arvin', email: 'arvin@pertuto.com', timezone: 'EST', curriculum: 'AP Precalculus', grade: 'AP Precalculus', courses: ["AP Precalculus"] },
    { name: 'Sahana', email: 'sahana@pertuto.com', timezone: 'EST', curriculum: 'AP Precalculus', grade: 'AP Precalculus', courses: ["AP Precalculus"] },

    // --- Computer Science ---
    { name: 'Jahnvi', email: 'jahnvi@pertuto.com', timezone: 'EST', curriculum: 'AP CSP', grade: 'AP CSP', courses: ["AP Computer Science Principles"] },

    // --- Python / Microbit (PST) ---
    { name: 'Raunak', email: 'raunak@pertuto.com', timezone: 'PST', curriculum: 'Python', grade: 'Python', courses: ["Microbit"] },
    { name: 'Meera', email: 'meera@pertuto.com', timezone: 'PST', curriculum: 'Python', grade: 'Python', courses: ["Microbit"] },
    { name: 'Anaya', email: 'anaya@pertuto.com', timezone: 'PST', curriculum: 'Python', grade: 'Python', courses: ["Microbit"] },
    { name: 'Akira', email: 'akira@pertuto.com', timezone: 'PST', curriculum: 'Python', grade: 'Python', courses: ["Microbit"] },
    { name: 'Veena', email: 'veena@pertuto.com', timezone: 'PST', curriculum: 'Python', grade: 'Python', courses: ["Microbit"] },

    // --- Others ---
    { name: 'Isiah', email: 'isiah@pertuto.com', timezone: 'EST', curriculum: 'Math', grade: '', courses: ["General Mathematics"] },
    { name: 'Rutu', email: 'rutu@pertuto.com', timezone: 'EST', curriculum: 'Math', grade: '', courses: ["General Mathematics"] }, // Restored
];

async function seedPertuto() {
    console.log('🚀 Starting "Pertuto" Tenant Onboarding...');

    try {
        // 1. Auth as Super User (client SDK needs auth to write if rules require it)
        // Ensure you have a super user or adjust seeding to bypass rules if using admin SDK (not available here easily without certs)
        try {
            await signInWithEmailAndPassword(auth, SUPER_USER_EMAIL, SUPER_USER_PASSWORD);
            console.log('✅ Logged in as Super User');
        } catch (e) {
            console.log('⚠️ Could not login as super user. Trying anonymous or proceeding if rules allow...');
        }

        // 2. Create Tenant
        const tenantRef = doc(firestore, 'tenants', TENANT_ID);
        await setDoc(tenantRef, {
            name: TENANT_NAME,
            plan: 'pro',
            ownerId: 'manual-seed',
            createdAt: Timestamp.now(),
        }, { merge: true });
        console.log(`✅ Tenant '${TENANT_NAME}' created/updated (ID: ${TENANT_ID})`);

        // 2.5 Clean up existing data for clean slate
        console.log('🧹 Clearing existing Courses and Students...');
        const existingCourses = await getDocs(collection(firestore, `tenants/${TENANT_ID}/courses`));
        const deletePromises: any[] = [];
        existingCourses.forEach(d => deletePromises.push(deleteDoc(d.ref)));

        const existingStudents = await getDocs(collection(firestore, `tenants/${TENANT_ID}/students`));
        existingStudents.forEach(d => deletePromises.push(deleteDoc(d.ref)));

        await Promise.all(deletePromises);
        console.log('✨ Cleaned up old data.');

        // 3. Create Admin User Profile

        // 3. Create Admin User Profile (Linking to an Auth ID would involve Admin SDK, here we just create the Profile)
        // For actual login, the user needs to sign up or we create them via Admin SDK.
        // Since this is a client script, we'll just create the FIRESTORE profile.
        // Note: Real Auth user creation requires Admin SDK or manual sign-up. We will simulate the existence.
        const adminUserRef = doc(collection(firestore, `tenants/${TENANT_ID}/users`));
        await setDoc(adminUserRef, {
            email: ADMIN_EMAIL,
            fullName: ADMIN_NAME,
            role: 'admin',
            createdAt: Timestamp.now(),
            tenantId: TENANT_ID,
        });
        console.log(`✅ Admin Profile created: ${ADMIN_EMAIL}`);

        // 4. Create Instructor Profile
        const instructorRef = doc(collection(firestore, `tenants/${TENANT_ID}/users`));
        await setDoc(instructorRef, {
            email: INSTRUCTOR_EMAIL,
            fullName: INSTRUCTOR_NAME,
            role: 'teacher',
            createdAt: Timestamp.now(),
            tenantId: TENANT_ID,
        });
        const instructorId = instructorRef.id;
        console.log(`✅ Instructor Profile created: ${INSTRUCTOR_EMAIL} (ID: ${instructorId})`);


        // 5. Deduplicate and Create Courses
        const distinctCourses = new Set<string>();
        studentsData.forEach(s => s.courses.forEach(c => c && distinctCourses.add(c)));

        const courseIdMap = new Map<string, string>(); // Name -> ID

        console.log(`📚 Found ${distinctCourses.size} unique courses to create...`);
        for (const courseTitle of distinctCourses) {
            const courseRef = doc(collection(firestore, `tenants/${TENANT_ID}/courses`));
            await setDoc(courseRef, {
                title: courseTitle,
                description: `${courseTitle} Curriculum`,
                instructor: INSTRUCTOR_NAME,
                instructorId: instructorId,
                duration: 'Ongoing',
                status: 'active',
                image: `https://picsum.photos/seed/${courseTitle.replace(/\s/g, '')}/600/400`,
                studentIds: [], // Will populate next
                createdAt: Timestamp.now(),
            });
            courseIdMap.set(courseTitle, courseRef.id);
            console.log(`   + Course created: ${courseTitle}`);
        }

        // 6. Create Students and Enroll
        console.log(`🎓 Creating ${studentsData.length} students...`);
        for (const s of studentsData) {
            const studentRef = doc(collection(firestore, `tenants/${TENANT_ID}/students`));

            // Map course names to IDs
            const courseIds = s.courses.map(name => courseIdMap.get(name)).filter(id => id !== undefined) as string[];

            await setDoc(studentRef, {
                name: s.name,
                email: s.email,
                timezone: s.timezone,
                curriculum: s.curriculum,
                grade: s.grade,
                courses: courseIds, // Store simplified list if needed by type
                status: 'Active',
                enrolledDate: Timestamp.now(),
                progress: 0,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`,
            });

            // Update Course studentIds (Reverse link)
            for (const cId of courseIds) {
                // Note: In a real app we'd use arrayUnion but setDoc/merge is fine here for single-threaded seed
                // We need to read the course first to append, or strictly use update.
                // For simplicity in seed, let's just do a quick read/update or skip optimization
                // Actually, let's just create the student first.
                // Updating the course doc for every student is operations-heavy.
            }
            console.log(`   + Student created: ${s.name}`);
        }

        // 7. Bulk Update Courses with Enrolled Students
        console.log('🔄 updating course enrollments...');
        for (const [courseTitle, courseId] of courseIdMap.entries()) {
            const enrolledStudents = studentsData.filter(s => s.courses.includes(courseTitle));
            // We need the IDs of these students.
            // Since we didn't store them in a map, let's query them or just accept we might miss this optimization.
            // Better: Let's query all students we just made? Or just fetch them.

            const studentsDescSnapshot = await getDocs(query(collection(firestore, `tenants/${TENANT_ID}/students`), where('courses', 'array-contains', courseId)));
            const studentIds = studentsDescSnapshot.docs.map(d => d.id);

            if (studentIds.length > 0) {
                await setDoc(doc(firestore, `tenants/${TENANT_ID}/courses`, courseId), {
                    studentIds: studentIds
                }, { merge: true });
                console.log(`   + Enrolled ${studentIds.length} students in ${courseTitle}`);
            }
        }

        console.log(`\n🎉 "Pertuto" Onboarding Complete!`);
        console.log(`   URL: http://localhost:3000 (Local) or Production URL`);
        console.log(`   Admin Login: ${ADMIN_EMAIL} / ${DEFAULT_PASSWORD} (Note: Account needs to be created in Auth first if not exists)`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Onboarding Failed:', error);
        process.exit(1);
    }
}

seedPertuto();
