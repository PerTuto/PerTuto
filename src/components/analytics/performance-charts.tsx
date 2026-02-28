"use client";

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceTrend, SubjectStrength } from '@/lib/types';

interface ChartProps {
  data: any[];
  title: string;
  subtitle?: string;
}

export function PerformanceLineChart({ data, title }: ChartProps) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/10" />
            <XAxis 
              dataKey="date" 
              stroke="currentColor" 
              className="text-slate-400 dark:text-slate-500" 
              fontSize={12} 
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              stroke="currentColor" 
              className="text-slate-400 dark:text-slate-500" 
              fontSize={12} 
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))', 
                borderRadius: '12px',
                color: 'hsl(var(--foreground))'
              }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="hsl(var(--primary))" 
              strokeWidth={4} 
              dot={{ fill: 'hsl(var(--primary))', r: 4 }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="currentColor" 
              className="text-slate-300 dark:text-white/20"
              strokeDasharray="5 5" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SubjectRadarChart({ data, title }: ChartProps) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-white/10" />
            <PolarAngleAxis 
              dataKey="subject" 
              stroke="currentColor" 
              className="text-slate-500 dark:text-slate-400" 
              fontSize={10} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              stroke="currentColor" 
              className="text-slate-300 dark:text-white/20" 
            />
            <Radar
              name="Student"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
