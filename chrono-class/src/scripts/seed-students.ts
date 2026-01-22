import 'dotenv/config';
import { firestore, auth } from '@/lib/firebase/client-app';
import { collection, doc, setDoc, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SUPER_USER_EMAIL = 'super@pertuto.com';
const SUPER_USER_PASSWORD = 'password';
const TENANT_ID = 'test-tenant-001';

const students = [
    { name: 'Sara', timezone: 'IST' },
    { name: 'Vihaan', timezone: 'SGT' },
    { name: 'Aaryavier', timezone: 'EST' },
    { name: 'Aarya', timezone: 'Asia/Bangkok' },
    { name: 'Arinjay', timezone: 'IST' },
    { name: 'Biraj', timezone: 'Asia/Jakarta' },
    { name: 'Swara', timezone: 'Asia/Jakarta' },
    { name: 'Katya', timezone: 'Africa/Dakar' },
    { name: 'Anusree', timezone: 'EST' },
    { name: 'Kanika', timezone: 'SGT' },
    { name: 'Inba', timezone: 'EST' },
    { name: 'Sayan', timezone: 'EST' },
    { name: 'Mahek', timezone: 'EST' },
    { name: 'Aahana', timezone: 'EST' },
    { name: 'Aavin', timezone: 'EST' },
    { name: 'Jahnvi', timezone: 'EST' },
    { name: 'Sahana', timezone: 'EST' },
    { name: 'Raunak', timezone: 'PST' },
    { name: 'Meera', timezone: 'PST' },
    { name: 'Anaya', timezone: 'PST' },
    { name: 'Akira', timezone: 'PST' },
    { name: 'Veena', timezone: 'PST' },
    { name: 'Isiah', timezone: 'EST' },
];

async function seedStudents() {
    console.log('🎓 Starting Student Seed (Updated Names)...');
    console.log(`Target Tenant: ${TENANT_ID}`);

    try {
        // Login as Super User
        console.log('🔑 Logging in as Super User...');
        await signInWithEmailAndPassword(auth, SUPER_USER_EMAIL, SUPER_USER_PASSWORD);

        // Clear existing students first
        console.log('🗑️ Clearing existing students...');
        const studentsRef = collection(firestore, `tenants/${TENANT_ID}/students`);
        const existingStudents = await getDocs(studentsRef);
        for (const doc of existingStudents.docs) {
            await deleteDoc(doc.ref);
        }
        console.log(`   Deleted ${existingStudents.size} existing students.`);

        // Seed students with corrected data
        console.log(`📚 Seeding ${students.length} students...`);
        for (const student of students) {
            const email = `${student.name.toLowerCase()}@pertuto.com`;
            const studentRef = doc(collection(firestore, `tenants/${TENANT_ID}/students`));
            await setDoc(studentRef, {
                name: student.name,
                email: email,
                status: 'Active',
                progress: 0,
                enrolledDate: Timestamp.now(),
                courses: [],
                timezone: student.timezone,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
            });
            console.log(`   ✅ ${student.name} → ${email} (${student.timezone})`);
        }

        console.log('');
        console.log('🎉 Student Seed Complete!');
        console.log(`   Total students: ${students.length}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedStudents();
