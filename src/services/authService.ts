import {
    getAuth,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import app from './firebase';

export const auth = getAuth(app);

export const authService = {
    login: async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    },

    logout: async () => {
        return firebaseSignOut(auth);
    },

    subscribe: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    }
};
