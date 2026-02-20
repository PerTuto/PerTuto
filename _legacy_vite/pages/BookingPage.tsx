import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { WeeklyCalendar } from '../features/scheduling/WeeklyCalendar';
import { AddClassDialog } from '../features/scheduling/AddClassDialog';
import { ClayButton } from '../components/ClayButton';
import { Plus } from 'lucide-react';

export const BookingPage = () => {
    const [isAddClassOpen, setIsAddClassOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleClassAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            <Helmet>
                <title>Schedule Classes | PerTuto Admin</title>
            </Helmet>

            <div className="pb-20 min-h-screen">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-black mb-2">Class Schedule</h1>
                            <p className="text-gray-400">Manage upcoming sessions and availability.</p>
                        </div>
                        <ClayButton
                            variant="primary"
                            onClick={() => setIsAddClassOpen(true)}
                            className="gap-2"
                        >
                            <Plus size={18} />
                            Schedule Class
                        </ClayButton>
                    </div>

                    <WeeklyCalendar refreshTrigger={refreshTrigger} />

                    <AddClassDialog
                        isOpen={isAddClassOpen}
                        onClose={() => setIsAddClassOpen(false)}
                        onClassAdded={handleClassAdded}
                    />
                </div>
            </div>
        </>
    );
};
