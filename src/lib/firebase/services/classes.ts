import { collection, doc, getDocs, query, where, addDoc, deleteDoc, writeBatch, setDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../client-app';
import { type Class } from '../../types';

/**
 * Fetches all classes for a tenant.
 */
export async function getClasses(tenantId: string): Promise<any[]> {
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const querySnapshot = await getDocs(classesRef);

  const classes: any[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const start = data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start);
    let end = data.end instanceof Timestamp ? data.end.toDate() : (data.end ? new Date(data.end) : null);

    if (!end && data.duration) {
      end = new Date(start.getTime() + data.duration * 60000);
    } else if (!end) {
      end = new Date(start.getTime() + 60 * 60000);
    }

    classes.push({
      id: doc.id,
      ...data,
      start,
      end
    });
  });
  return classes;
}

export async function addClass(tenantId: string, classData: any): Promise<Class> {
  if (!tenantId) throw new Error("tenantId is required for addClass");
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const docRef = await addDoc(classesRef, classData);
  return { id: docRef.id, ...classData } as Class;
}

export async function batchAddClasses(tenantId: string, classesData: any[]): Promise<void> {
  if (!tenantId) throw new Error("tenantId is required for batchAddClasses");
  const batch = writeBatch(firestore);
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);

  classesData.forEach(data => {
    const docRef = doc(classesRef);
    batch.set(docRef, data);
  });

  await batch.commit();
}

export async function deleteClass(tenantId: string, classId: string): Promise<void> {
  if (!tenantId) throw new Error("tenantId is required for deleteClass");
  await deleteDoc(doc(firestore, `tenants/${tenantId}/classes`, classId));
}

export async function updateClass(tenantId: string, classId: string, classData: any): Promise<void> {
  if (!tenantId) throw new Error("tenantId is required for updateClass");
  const classRef = doc(firestore, `tenants/${tenantId}/classes`, classId);
  await setDoc(classRef, classData, { merge: true });
}

/**
 * Adds a series of recurring classes with a shared recurrenceGroupId.
 */
export async function addRecurringClassSeries(
  tenantId: string,
  baseClassData: any,
  recurrence: { frequency: 'weekly'; endDate: Date }
): Promise<void> {
  if (!tenantId) throw new Error("tenantId is required for addRecurringClassSeries");
  const batch = writeBatch(firestore);
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);

  // Generate a shared group ID for the series
  const recurrenceGroupId = doc(classesRef).id;

  let currentDate = new Date(baseClassData.start);
  const endDate = recurrence.endDate;
  const endThreshold = new Date(endDate);
  endThreshold.setHours(23, 59, 59, 999);

  while (currentDate <= endThreshold) {
    const docRef = doc(classesRef);
    const classData = {
      ...baseClassData,
      start: new Date(currentDate),
      end: new Date(currentDate.getTime() + (baseClassData.end.getTime() - baseClassData.start.getTime())),
      recurrenceGroupId,
      recurrencePattern: recurrence.frequency,
    };
    batch.set(docRef, classData);

    // Increment by 7 days
    currentDate.setDate(currentDate.getDate() + 7);
  }

  await batch.commit();
}

/**
 * Updates all future classes in a recurring series from a given date.
 * Uses strict hour/minute assignments to prevent Daylight Saving Time drift.
 */
export async function updateFutureClassesInSeries(
  tenantId: string,
  recurrenceGroupId: string,
  fromDate: Date,
  updates: { startHour: number; startMinute: number; durationMins: number; timezone?: string },
  otherUpdates?: Partial<any>
): Promise<void> {
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const q = query(
    classesRef,
    where('recurrenceGroupId', '==', recurrenceGroupId),
    where('start', '>=', Timestamp.fromDate(fromDate))
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  // Helper to set time in specific timezone without external libs
  const setTzTime = (baseDate: Date, h: number, m: number, tz?: string) => {
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    if (!tz) return d;
    
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', hour12: false });
    let offsetMs = 0;
    for (let i = 0; i < 2; i++) {
        const parts = formatter.formatToParts(new Date(d.getTime() - offsetMs));
        let curH = 0, curM = 0;
        for (const p of parts) {
            if (p.type === 'hour') curH = parseInt(p.value, 10);
            if (p.type === 'minute') curM = parseInt(p.value, 10);
        }
        if (curH === 24) curH = 0;
        offsetMs += ((curH * 60 + curM) - (h * 60 + m)) * 60000;
    }
    return new Date(d.getTime() - offsetMs);
  };

  const batch = writeBatch(firestore);
  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data();
    const oldStart = data.start.toDate();
    
    const newStart = setTzTime(oldStart, updates.startHour, updates.startMinute, updates.timezone);
    const newEnd = new Date(newStart.getTime() + updates.durationMins * 60000);

    batch.update(docSnap.ref, {
      ...(otherUpdates || {}),
      start: Timestamp.fromDate(newStart),
      end: Timestamp.fromDate(newEnd),
    });
  });

  await batch.commit();
}

/**
 * Updates a single class and detaches it from its recurring series.
 * Used for "Only This Event" flow.
 */
export async function updateSingleClassDetached(
  tenantId: string,
  classId: string,
  updates: Partial<any>,
): Promise<void> {
  const classRef = doc(firestore, `tenants/${tenantId}/classes`, classId);
  await setDoc(classRef, {
    ...updates,
    recurrenceGroupId: null, // Detach from series
    recurrencePattern: null,
  }, { merge: true });
}

/**
 * Fetches classes owned by a specific teacher for the current week.
 */
export async function getClassesForTeacher(tenantId: string, userId: string): Promise<Class[]> {
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  const q = query(classesRef, where("ownerId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      start: data.start?.toDate ? data.start.toDate() : new Date(data.start),
      end: data.end?.toDate ? data.end.toDate() : new Date(data.end),
    } as Class;
  });
}
