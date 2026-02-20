import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { ClayCard } from '../components/ClayCard';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/SEOHead';
import type { Lead } from '../services/leadService';

// Extended Lead type to include Firestore metadata if needed, 
// though for now we just cast the data.
interface LeadWithId extends Lead {
    id: string;
    createdAt?: Timestamp;
}

export const LeadsPage = () => {
    const [leads, setLeads] = useState<LeadWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                // Ensure we're accessing the 'leads' collection
                const leadsRef = collection(db, 'leads');
                // Sort by createdAt descending (newest first)
                const q = query(leadsRef, orderBy('createdAt', 'desc'));

                const querySnapshot = await getDocs(q);
                const leadsData: LeadWithId[] = [];

                querySnapshot.forEach((doc) => {
                    leadsData.push({ id: doc.id, ...doc.data() } as LeadWithId);
                });

                setLeads(leadsData);
            } catch (err) {
                console.error("Error fetching leads:", err);
                setError("Failed to load leads from Firestore. Ensure you are logged in.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const formatDate = (timestamp?: Timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    return (
        <>
            <SEOHead title="Leads Dashboard | PerTuto" description="Internal Dashboard" />

            <div className="min-h-screen bg-black text-white pt-32 pb-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">
                                🚀 Lead Tracker
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Logged in as {user?.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors font-bold text-sm"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => authService.logout()}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors font-bold text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <ClayCard className="overflow-hidden bg-white/5 border-white/10">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400">Loading leads...</div>
                        ) : error ? (
                            <div className="p-12 text-center text-red-400">{error}</div>
                        ) : leads.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No leads found yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                                            <th className="p-4 font-mono">Date</th>
                                            <th className="p-4 font-mono">Name</th>
                                            <th className="p-4 font-mono">Email</th>
                                            <th className="p-4 font-mono">Curriculum</th>
                                            <th className="p-4 font-mono">Grade/Role</th>
                                            <th className="p-4 font-mono">Subject</th>
                                            <th className="p-4 font-mono">Goals</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {leads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-white/5 transition-colors text-sm">
                                                <td className="p-4 whitespace-nowrap text-gray-400">
                                                    {formatDate(lead.createdAt)}
                                                </td>
                                                <td className="p-4 font-bold text-white">
                                                    {lead.name}
                                                </td>
                                                <td className="p-4 text-blue-400">
                                                    <a href={`mailto:${lead.email}`} className="hover:underline">
                                                        {lead.email}
                                                    </a>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 rounded bg-white/10 text-xs">
                                                        {lead.curriculum || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-300">
                                                    {lead.studentGrade}
                                                </td>
                                                <td className="p-4 text-[#7C3AED] font-medium">
                                                    {lead.subject}
                                                </td>
                                                <td className="p-4 text-gray-400 max-w-xs truncate" title={lead.goals}>
                                                    {lead.goals}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </ClayCard>
                </div>
            </div>
        </>
    );
};
