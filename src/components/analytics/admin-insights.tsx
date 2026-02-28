"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { getTenantKpis } from '@/lib/firebase/services';
import { TenantKpis } from '@/lib/types';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PerformanceLineChart } from './performance-charts';

export function AdminInsights() {
    const { userProfile } = useAuth();
    const [kpis, setKpis] = useState<TenantKpis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchKpis() {
            if (!userProfile?.tenantId) return;
            const data = await getTenantKpis(userProfile.tenantId);
            setKpis(data);
            setLoading(false);
        }
        fetchKpis();
    }, [userProfile?.tenantId]);

    if (loading || !kpis) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard 
                    title="Total Revenue" 
                    value={`$${kpis.revenue?.toLocaleString() ?? 0}`} 
                    icon={<DollarSign className="h-5 w-5" />} 
                    trend={+12.4} 
                />
                <KPICard 
                    title="Active Students" 
                    value={kpis.totalStudents.toString()} 
                    icon={<Users className="h-5 w-5" />} 
                    trend={+8.2} 
                />
                <KPICard 
                    title="Attendance Rate" 
                    value={`${kpis.attendanceRate}%`} 
                    icon={<Calendar className="h-5 w-5" />} 
                    trend={-1.5} 
                />
                <KPICard 
                    title="Growth" 
                    value={`${kpis.growthPercentage}%`} 
                    icon={<TrendingUp className="h-5 w-5" />} 
                    trend={+2.3} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PerformanceLineChart 
                        title="Institutional Growth Trend" 
                        data={[
                            { date: 'Jan', score: 32000, average: 30000 },
                            { date: 'Feb', score: 35000, average: 31000 },
                            { date: 'Mar', score: 45000, average: 32000 },
                        ]} 
                    />
                </div>
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">Recent Milestone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MilestoneItem title="Batch 2026-A Success" description="92% students scored above A grade in Mock Exams." />
                        <MilestoneItem title="Center Expansion" description="New center launched in South City (120 new leads)." />
                        <MilestoneItem title="Revenue High" description="March marks the highest revenue in last 12 months." />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: number }) {
    return (
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-teal-600/10 dark:text-teal-400/10 group-hover:scale-125 transition-transform group-hover:text-teal-600/20">
                {icon}
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-3">
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
                    <div className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {trend > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function MilestoneItem({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex gap-4 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 text-xs font-black">
                M
            </div>
            <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
