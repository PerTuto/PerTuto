
import 'dotenv/config';
import { firestore, auth } from '@/lib/firebase/client-app';
import { doc, setDoc, deleteDoc, getDocs, query, collection, where, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const ANKUR_EMAIL = 'ankur@pertuto.com';
const ANKUR_PASSWORD = 'password';
const SUPER_EMAIL = 'super@pertuto.com'; // Adjust if super email is different in your seed
const SUPER_PASSWORD = 'password';

const TENANT_ID = 'pertuto-tenant';
const USER_NAME = 'Ankur';

async function linkAdmin() {
    console.log(`🔗 Linking Auth User '${ANKUR_EMAIL}' to Tenant '${TENANT_ID}'...`);

    try {
        // 1. Login as Ankur to get UID
        console.log('🔑 Logging in as Ankur to get UID...');
        const userCredential = await signInWithEmailAndPassword(auth, ANKUR_EMAIL, ANKUR_PASSWORD);
        const ankurUid = userCredential.user.uid;
        console.log(`✅ Got UID: ${ankurUid}`);

        await signOut(auth);
        console.log('🔒 Signed out Ankur.');

        // 2. Login as Super User to Perform Writes
        console.log('🔑 Logging in as Super User...');
        await signInWithEmailAndPassword(auth, SUPER_EMAIL, SUPER_PASSWORD);
        console.log('✅ Logged in as Super User!');

        // 3. Create Root User Profile (Privileged Write)
        console.log('📝 Creating Root User Profile...');
        await setDoc(doc(firestore, 'users', ankurUid), {
            email: ANKUR_EMAIL,
            fullName: USER_NAME,
            role: 'admin',
            tenantId: TENANT_ID,
            createdAt: Timestamp.now(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${USER_NAME}`,
        }, { merge: true });

        // 4. Update Tenant User Profile
        // Check for placeholder
        const tenantUsersRef = collection(firestore, `tenants/${TENANT_ID}/users`);
        const q = query(tenantUsersRef, where('email', '==', ANKUR_EMAIL));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log(`Found ${snapshot.size} existing placeholder profile(s). cleanup...`);
            for (const d of snapshot.docs) {
                if (d.id !== ankurUid) {
                    console.log(`   - Deleting placeholder doc: ${d.id}`);
                    await deleteDoc(d.ref);
                }
            }
        }

        // Create/Update the real tenant-user doc
        console.log('📝 Creating Tenant User Profile (Linked to UID)...');
        await setDoc(doc(firestore, `tenants/${TENANT_ID}/users`, ankurUid), {
            email: ANKUR_EMAIL,
            fullName: USER_NAME,
            role: 'admin',
            tenantId: TENANT_ID,
            status: 'Active',
            createdAt: Timestamp.now(),
        }, { merge: true });

        console.log('✅ Success! User is now linked.');
        console.log('👉 Refresh the application page to access the dashboard.');
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Failed:', error.message);
        process.exit(1);
    }
}

linkAdmin();
