import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../client-app';
import { GamificationProfile, Badge, LeaderboardEntry } from '../../types';

/**
 * Initializes or fetches a student's gamification profile.
 */
export async function getGamificationProfile(tenantId: string, studentId: string): Promise<GamificationProfile> {
  const profileRef = doc(firestore, `tenants/${tenantId}/gamification`, studentId);
  const docSnap = await getDoc(profileRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      lastActivityDate: data.lastActivityDate?.toDate() || new Date(),
      badges: (data.badges || []).map((b: any) => ({
        ...b,
        unlockedAt: b.unlockedAt?.toDate() || new Date()
      }))
    } as GamificationProfile;
  }

  // Initial profile
  const initialProfile: GamificationProfile = {
    studentId,
    xp: 0,
    level: 1,
    streakCount: 0,
    lastActivityDate: new Date(),
    badges: [],
    totalQuizzesCompleted: 0,
    totalClassesAttended: 0
  };

  await setDoc(profileRef, {
    ...initialProfile,
    lastActivityDate: Timestamp.now(),
  });

  return initialProfile;
}

/**
 * Updates XP and handles leveling logic.
 */
export async function updateXp(tenantId: string, studentId: string, amount: number, reason: string): Promise<{ xp: number, level: number, leveledUp: boolean }> {
  const profileRef = doc(firestore, `tenants/${tenantId}/gamification`, studentId);
  const profile = await getGamificationProfile(tenantId, studentId);
  
  const newXp = profile.xp + amount;
  const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1; // Simple level formula: Level = sqrt(XP/100) + 1
  const leveledUp = newLevel > profile.level;

  await updateDoc(profileRef, {
    xp: increment(amount),
    level: newLevel,
    lastActivityDate: Timestamp.now()
  });

  return { xp: newXp, level: newLevel, leveledUp };
}

/**
 * Logic to increment or reset daily streaks.
 */
export async function updateStreak(tenantId: string, studentId: string): Promise<number> {
  const profileRef = doc(firestore, `tenants/${tenantId}/gamification`, studentId);
  const profile = await getGamificationProfile(tenantId, studentId);
  
  const now = new Date();
  const lastActivity = profile.lastActivityDate;
  
  // Set times to midnight for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
  
  const diffInMs = today.getTime() - lastDay.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 3600 * 24));

  let newStreak = profile.streakCount;
  if (diffInDays === 1) {
    newStreak += 1;
  } else if (diffInDays > 1) {
    newStreak = 1; // Reset if they missed a day
  } else if (diffInDays === 0 && profile.streakCount === 0) {
    newStreak = 1; // First activity ever
  }
  // If diffInDays === 0 and streakCount > 0, we just keep the current streak

  await updateDoc(profileRef, {
    streakCount: newStreak,
    lastActivityDate: Timestamp.now()
  });

  return newStreak;
}

/**
 * Fetches the leaderboard.
 */
export async function getLeaderboard(tenantId: string, limitCount: number = 10): Promise<LeaderboardEntry[]> {
  const gamificationRef = collection(firestore, `tenants/${tenantId}/gamification`);
  const q = query(gamificationRef, orderBy('xp', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);
  const leaderboard: LeaderboardEntry[] = [];

  for (const docSnap of snapshot.docs) {
    const gamificationData = docSnap.data();
    const studentSnap = await getDoc(doc(studentsRef, docSnap.id));
    const studentData = studentSnap.exists() ? studentSnap.data() : { name: 'Unknown Student' };
    
    leaderboard.push({
      studentId: docSnap.id,
      name: studentData.name,
      avatar: studentData.avatar,
      xp: gamificationData.xp,
      level: gamificationData.level,
    });
  }

  return leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/**
 * Awards a badge.
 */
export async function awardBadge(tenantId: string, studentId: string, badge: Omit<Badge, 'unlockedAt'>): Promise<void> {
  const profileRef = doc(firestore, `tenants/${tenantId}/gamification`, studentId);
  const badgeWithDate = {
    ...badge,
    unlockedAt: Timestamp.now()
  };

  const profile = await getGamificationProfile(tenantId, studentId);
  const alreadyHas = profile.badges.some(b => b.id === badge.id);
  
  if (!alreadyHas) {
    await updateDoc(profileRef, {
      badges: [...profile.badges.map(b => ({ ...b, unlockedAt: Timestamp.fromDate(b.unlockedAt) })), badgeWithDate]
    });
  }
}
