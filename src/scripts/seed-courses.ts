import 'dotenv/config';
import { firestore, auth } from '@/lib/firebase/client-app';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SUPER_USER_EMAIL = 'super@pertuto.com';
const SUPER_USER_PASSWORD = 'password';
const TENANT_ID = 'test-tenant-001';

const courses = [
    {
        title: 'Piano Basics',
        description: 'Learn the fundamentals of piano playing, from reading sheet music to playing simple melodies.',
        instructor: 'Ms. Sarah Johnson',
        duration: '8 Weeks',
        status: 'active',
    },
    {
        title: 'Advanced Guitar',
        description: 'Take your guitar skills to the next level with advanced techniques and music theory.',
        instructor: 'Mr. David Chen',
        duration: '12 Weeks',
        status: 'active',
    },
    {
        title: 'Vocal Training',
        description: 'Develop your singing voice with breathing exercises, pitch control, and performance techniques.',
        instructor: 'Ms. Emily Roberts',
        duration: '10 Weeks',
        status: 'active',
    },
    {
        title: 'Music Theory 101',
        description: 'Understanding the building blocks of music: scales, chords, rhythm, and composition.',
        instructor: 'Dr. Michael Brown',
        duration: '6 Weeks',
        status: 'draft',
    },
];

async function seedCourses() {
    console.log('🎵 Starting Course Seed...');
    console.log(`Target Tenant: ${TENANT_ID}`);

    try {
        // Login as Super User
        console.log('🔑 Logging in as Super User...');
        await signInWithEmailAndPassword(auth, SUPER_USER_EMAIL, SUPER_USER_PASSWORD);

        // Seed courses
        console.log(`📚 Seeding ${courses.length} courses...`);
        for (const course of courses) {
            const courseRef = doc(collection(firestore, `tenants/${TENANT_ID}/courses`));
            await setDoc(courseRef, {
                ...course,
                image: `https://picsum.photos/seed/${course.title.replace(/\s/g, '')}/600/400`,
                studentIds: [],
                createdAt: Timestamp.now(),
            });
            console.log(`   ✅ Added: ${course.title} (${course.status})`);
        }

        console.log('');
        console.log('🎉 Course Seed Complete!');
        console.log(`   Total courses added: ${courses.length}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedCourses();
