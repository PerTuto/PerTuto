import { firestore, auth } from './client-app';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const SUPER_USER_EMAIL = 'super@pertuto.com';
const SUPER_USER_PASSWORD = 'password';

export async function seedMultiTenant() {
    console.log('🌱 Starting Multi-Tenant Seed...');

    try {
        // Step 1: Create or login as Super User
        console.log('👤 Setting up Super User...');
        let superUserId: string;

        try {
            const cred = await createUserWithEmailAndPassword(auth, SUPER_USER_EMAIL, SUPER_USER_PASSWORD);
            superUserId = cred.user.uid;
        } catch (e: any) {
            if (e.code === 'auth/email-already-in-use') {
                const cred = await signInWithEmailAndPassword(auth, SUPER_USER_EMAIL, SUPER_USER_PASSWORD);
                superUserId = cred.user.uid;
            } else {
                throw e;
            }
        }

        // Helper to restore Super User session
        const restoreSuperUser = async () => {
            console.log('   🔄 Restoring Super User session...');
            await signInWithEmailAndPassword(auth, SUPER_USER_EMAIL, SUPER_USER_PASSWORD);
        };

        // Step 2: Create Super User Profile
        await setDoc(doc(firestore, 'users', superUserId), {
            fullName: 'Super User Admin',
            email: SUPER_USER_EMAIL,
            role: 'super',
            createdAt: Timestamp.now(),
        });

        // Step 3: Create a Test Tenant
        console.log('🏢 Creating Test Tenant...');
        const tenantId = 'test-tenant-001';
        await setDoc(doc(firestore, 'tenants', tenantId), {
            name: 'Demo School',
            plan: 'pro',
            ownerId: superUserId,
            createdAt: Timestamp.now(),
        });

        // Step 4: Create Admin User for the tenant
        console.log('👤 Creating Tenant Admin...');
        let adminUid = 'admin-placeholder';
        try {
            const adminCred = await createUserWithEmailAndPassword(auth, 'admin@demoschool.com', 'password123');
            adminUid = adminCred.user.uid;
        } catch (e: any) {
            if (e.code !== 'auth/email-already-in-use') throw e;
            try {
                // If exists, try pass 'password123'
                const loginCred = await signInWithEmailAndPassword(auth, 'admin@demoschool.com', 'password123');
                adminUid = loginCred.user.uid;
            } catch {
                console.log('   Could not login as admin (wrong pass?), skipping...');
                // If we can't login, we can't get UID. But in emulator reset content, this shouldn't happen unless re-running.
            }
        }

        // IMPORTANT: Restore Super User before writing to Firestore
        await restoreSuperUser();

        if (adminUid !== 'admin-placeholder') {
            await setDoc(doc(firestore, `tenants/${tenantId}/users`, adminUid), {
                email: 'admin@demoschool.com',
                fullName: 'Admin User',
                role: 'admin',
                createdAt: Timestamp.now(),
            });

            await setDoc(doc(firestore, 'users', adminUid), {
                email: 'admin@demoschool.com',
                fullName: 'Admin User',
                role: 'admin',
                tenantId: tenantId,
            });
        }

        // Step 5: Create Teacher User for the tenant
        console.log('👨‍🏫 Creating Teacher...');
        let teacherUid = 'teacher-placeholder';
        try {
            const teacherCred = await createUserWithEmailAndPassword(auth, 'teacher@demoschool.com', 'password123');
            teacherUid = teacherCred.user.uid;
        } catch (e: any) {
            if (e.code !== 'auth/email-already-in-use') throw e;
            try {
                const loginCred = await signInWithEmailAndPassword(auth, 'teacher@demoschool.com', 'password123');
                teacherUid = loginCred.user.uid;
            } catch {
                console.log('   Could not login as teacher, skipping...');
            }
        }

        // IMPORTANT: Restore Super User before writing to Firestore
        await restoreSuperUser();

        if (teacherUid !== 'teacher-placeholder') {
            await setDoc(doc(firestore, `tenants/${tenantId}/users`, teacherUid), {
                email: 'teacher@demoschool.com',
                fullName: 'Jane Teacher',
                role: 'teacher',
                createdAt: Timestamp.now(),
            });

            await setDoc(doc(firestore, 'users', teacherUid), {
                email: 'teacher@demoschool.com',
                fullName: 'Jane Teacher',
                role: 'teacher',
                tenantId: tenantId,
            });

            // Step 7: Create availability slots for the teacher (moved inside teacher block to access teacherUid)
            console.log('📅 Creating Availability...');
            const slots = [
                { dayOfWeek: 1, startTime: '09:00', endTime: '12:00', status: 'available' },
                { dayOfWeek: 1, startTime: '14:00', endTime: '17:00', status: 'available' },
                { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', status: 'available' },
                { dayOfWeek: 3, startTime: '10:00', endTime: '15:00', status: 'available' },
            ];

            for (const slot of slots) {
                const slotRef = doc(collection(firestore, `tenants/${tenantId}/availability`));
                await setDoc(slotRef, {
                    ...slot,
                    userId: teacherUid,
                    tenantId: tenantId,
                });
            }
        }

        // Step 6: Create some students within the tenant (Super User can write)
        console.log('📚 Creating Students...');
        const students = [
            { name: 'Alice Student', email: 'alice@demoschool.com' },
            { name: 'Bob Student', email: 'bob@demoschool.com' },
        ];

        for (const s of students) {
            const studentRef = doc(collection(firestore, `tenants/${tenantId}/students`));
            await setDoc(studentRef, {
                ...s,
                status: 'Active',
                progress: 0,
                enrolledDate: Timestamp.now(),
                courses: [],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`
            });
        }

        console.log('✅ Multi-Tenant Seed Complete!');
        console.log('');
        console.log('📋 Credentials:');
        console.log('   Super:   super@pertuto.com / password');
        console.log('   Admin:   admin@demoschool.com / password123');
        console.log('   Teacher: teacher@demoschool.com / password123');
        console.log('   Tenant:  test-tenant-001 (Demo School)');
        console.log('');
        console.log('   Super User UID:', superUserId);

        return { success: true, superUserId };

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}

export { seedMultiTenant as seed };
