
import 'dotenv/config';
import { firestore, auth } from '../lib/firebase/client-app';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

async function run() {
    console.log('Logging in as super user...');
    try {
        await signInWithEmailAndPassword(auth, 'super@pertuto.com', 'password');
        console.log('Logged in!');

        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', 'ankur@pertuto.com'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('No user found with email ankur@pertuto.com.');
            process.exit(0);
        }

        for (const userDoc of snapshot.docs) {
            console.log('Updating user doc:', userDoc.id);
            await updateDoc(doc(firestore, 'users', userDoc.id), {
                role: ['admin', 'teacher']
            });
        }

        console.log('✅ Success! Roles updated.');
        process.exit(0);
    } catch (e) {
        console.error('Failed:', e);
        process.exit(1);
    }
}

run();
