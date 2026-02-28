
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { firestore } from '../client-app';
import { PerformanceTrend, SubjectStrength, TenantKpis, Evaluation, Student } from '../../types';

/**
 * Fetches performance trends for a specific student.
 */
export async function getStudentPerformanceTrends(tenantId: string, studentId: string): Promise<PerformanceTrend[]> {
  const evaluationsRef = collection(firestore, `tenants/${tenantId}/evaluations`);
  const q = query(
    evaluationsRef, 
    where("studentId", "==", studentId),
    orderBy("createdAt", "asc")
  );
  
  const querySnapshot = await getDocs(q);
  const trends: PerformanceTrend[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data() as Evaluation;
    
    // Fetch all evaluations for this test to calculate average
    const testEvalsQuery = query(evaluationsRef, where("testId", "==", data.testId));
    const testEvalsSnap = await getDocs(testEvalsQuery);
    
    let totalBatchScore = 0;
    let count = 0;
    testEvalsSnap.forEach(eSnap => {
      totalBatchScore += (eSnap.data() as Evaluation).totalScore || 0;
      count++;
    });

    const average = count > 0 ? Math.round(totalBatchScore / count) : 0;

    trends.push({
      date: (data.createdAt as any)?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
      score: data.totalScore,
      average: average
    });
  }

  return trends;
}

/**
 * Fetches subject-wise strengths for a student.
 */
export async function getStudentSubjectStrengths(tenantId: string, studentId: string): Promise<SubjectStrength[]> {
  const evaluationsRef = collection(firestore, `tenants/${tenantId}/evaluations`);
  const q = query(evaluationsRef, where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  
  const subjectMap: Record<string, { total: number; count: number; max: number }> = {};
  
  querySnapshot.docs.forEach(doc => {
    const data = doc.data() as Evaluation;
    if (!subjectMap[data.subject]) {
      subjectMap[data.subject] = { total: 0, count: 0, max: 0 };
    }
    subjectMap[data.subject].total += data.totalScore;
    subjectMap[data.subject].max += data.maxScore;
    subjectMap[data.subject].count += 1;
  });
  
  return Object.entries(subjectMap).map(([subject, stats]) => ({
    subject,
    score: Math.round(stats.total / stats.count),
    fullMark: stats.max / stats.count,
    grade: stats.total / stats.max > 0.9 ? 'A+' : stats.total / stats.max > 0.8 ? 'A' : 'B'
  }));
}

/**
 * Fetches high-level KPIs for a tenant.
 */
export async function getTenantKpis(tenantId: string): Promise<TenantKpis> {
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);
  const batchesRef = collection(firestore, `tenants/${tenantId}/batches`);
  const attendanceRef = collection(firestore, `tenants/${tenantId}/attendance`);
  const paymentsRef = collection(firestore, `tenants/${tenantId}/payments`);
  
  const [studentsSnap, batchesSnap, attendanceSnap, paymentsSnap] = await Promise.all([
    getDocs(studentsRef),
    getDocs(batchesRef),
    getDocs(attendanceRef),
    getDocs(paymentsRef)
  ]);
  
  let totalPresent = 0;
  let totalRecords = 0;
  attendanceSnap.docs.forEach(doc => {
    const records = doc.data().records || [];
    records.forEach((r: any) => {
      totalRecords++;
      if (r.present) totalPresent++;
    });
  });
  
  const attendanceRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

  let revenue = 0;
  paymentsSnap.docs.forEach(doc => {
    const amount = doc.data().amount || 0;
    if (amount > 0) {
      revenue += amount;
    }
  });
  
  return {
    totalStudents: studentsSnap.size,
    activeBatches: batchesSnap.size,
    attendanceRate,
    revenue,
    growthPercentage: 12.5 // Hard to calculate historically without snapshots, keeping static for now
  };
}

/**
 * Fetches legacy dashboard stats for backward compatibility.
 */
export async function getDashboardStats(tenantId: string) {
  const studentsRef = collection(firestore, `tenants/${tenantId}/students`);
  const leadsRef = collection(firestore, `tenants/${tenantId}/leads`);
  const classesRef = collection(firestore, `tenants/${tenantId}/classes`);
  
  const [studentsSnap, leadsSnap, classesSnap] = await Promise.all([
    getDocs(studentsRef),
    getDocs(leadsRef),
    getDocs(classesRef)
  ]);
  
  return {
    activeStudents: studentsSnap.size,
    activeLeads: leadsSnap.size,
    upcomingClassesThisWeek: classesSnap.size
  };
}
