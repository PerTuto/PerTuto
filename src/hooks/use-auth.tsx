
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase/client-app';
import type { UserProfile } from '@/lib/firebase/services';
import { getUserProfile } from '@/lib/firebase/services';

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  tenantId: string | null;
  loading: boolean;
  signup: (email: string, pass: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const SUPER_USER_EMAIL = process.env.NEXT_PUBLIC_SUPER_USER_EMAIL || 'super@pertuto.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // SUPER USER BYPASS - check by email
        if (user.email === SUPER_USER_EMAIL) {
          console.log("Platform Super User detected.");
          setUserProfile({
            fullName: "Super User Admin",
            email: user.email!,
            role: "super", // Platform Super role
            tenantId: "pertuto-default", // Super user accesses the default tenant
          });
          setLoading(false);
          return;
        }

        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signup = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const logout = () => {
    return signOut(auth);
  }

  const tenantId = userProfile?.tenantId || null;
  const value = { user, userProfile, tenantId, loading, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
