import { useState, useEffect } from 'react';
import { getClasses, type Class } from '../../services/schedulingService';
import { ClayButton } from '../../components/ClayButton';
import { ChevronLeft, ChevronRight, Clock, Video } from 'lucide-react';
import { clsx } from 'clsx';
import { cn } from '../../lib/utils';
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';

interface WeeklyCalendarProps {
    onClassClick?: (classItem: Class) => void;
    refreshTrigger?: number; // Prop to force refresh
}

const COURSE_COLORS = [
    'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:border-blue-500/50',
    'bg-green-500/10 border-green-500/30 text-green-300 hover:border-green-500/50',
    'bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:border-yellow-500/50',
    'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:border-purple-500/50',
    'bg-pink-500/10 border-pink-500/30 text-pink-300 hover:border-pink-500/50',
];

export function WeeklyCalendar({ onClassClick, refreshTrigger }: WeeklyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const classesData = await getClasses();
                setClasses(classesData);
            } catch (error) {
                console.error("Failed to fetch schedule data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [refreshTrigger]);

    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
    const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });

    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    const handlePrevWeek = () => setCurrentDate(prev => addDays(prev, -7));
    const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));
    const handleToday = () => setCurrentDate(new Date());

    const weekClasses = classes.filter(c => c.start >= startDate && c.start <= endDate);

    return (
        <div className="flex flex-col h-full min-h-[600px]">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-headline text-white">
                        {format(startDate, 'MMMM yyyy')}
                    </h2>
                    <p className="text-gray-400">
                        Week of {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ClayButton variant="secondary" onClick={handleToday} className="h-9 px-4 text-xs font-bold">Today</ClayButton>
                    <button onClick={handlePrevWeek} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={handleNextWeek} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 flex-1">
                {days.map((day) => {
                    const dayClasses = weekClasses
                        .filter(c => isSameDay(c.start, day))
                        .sort((a, b) => a.start.getTime() - b.start.getTime());

                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={day.toISOString()} className={clsx("bg-black/40 backdrop-blur-sm p-3 flex flex-col gap-3 min-h-[120px] md:min-h-[auto]", isToday && "bg-white/[0.03]")}>
                            <div className="text-center">
                                <p className={clsx("text-xs font-bold tracking-wider mb-1", isToday ? "text-[#7C3AED]" : "text-gray-500")}>
                                    {format(day, 'EEE').toUpperCase()}
                                </p>
                                <p className={clsx("text-xl font-bold", isToday ? "text-white" : "text-gray-300")}>
                                    {format(day, 'd')}
                                </p>
                            </div>

                            <div className="space-y-2 flex-1">
                                {loading ? (
                                    <div className="h-16 rounded-lg bg-white/5 animate-pulse" />
                                ) : dayClasses.length > 0 ? (
                                    dayClasses.map(c => {
                                        let colorIndex = 0;
                                        if (c.title) {
                                            let hash = 0;
                                            for (let i = 0; i < c.title.length; i++) hash = c.title.charCodeAt(i) + ((hash << 5) - hash);
                                            colorIndex = Math.abs(hash) % COURSE_COLORS.length;
                                        }
                                        const colorClass = COURSE_COLORS[colorIndex];

                                        return (
                                            <div
                                                key={c.id}
                                                onClick={() => onClassClick?.(c)}
                                                className={cn(
                                                    "p-2 rounded-lg border text-xs cursor-pointer transition-all group relative",
                                                    colorClass
                                                )}
                                            >
                                                <p className="font-bold truncate text-white mb-1 group-hover:text-white/90">{c.title}</p>
                                                <p className="text-[10px] truncate flex items-center gap-1.5 opacity-80">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{format(c.start, 'HH:mm')} - {format(c.end, 'HH:mm')}</span>
                                                </p>
                                                {c.meetLink && (
                                                    <div className="absolute top-2 right-2 opacity-50">
                                                        <Video className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="hidden md:flex flex-1 items-center justify-center min-h-[60px]">
                                        <span className="text-[10px] text-gray-700">No classes</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
