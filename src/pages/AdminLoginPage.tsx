import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { ClayButton } from '../components/ClayButton';
import { ClayInput } from '../components/ClayInput';
import { SEOHead } from '../components/SEOHead';

export const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/leads';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("Login Error Full Object:", err);
            console.error("Login Error Code:", err.code);
            console.error("Login Error Message:", err.message);

            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Email/Password login is not enabled in Firebase Console.');
            } else {
                setError(`Login failed: ${err.message} (${err.code})`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEOHead title="Admin Login | PerTuto" description="Restricted Access" />
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <ClayInput
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                        />
                        <ClayInput
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <ClayButton
                            variant="primary"
                            className="w-full justify-center"
                            type="submit"
                            isLoading={loading}
                        >
                            {loading ? 'Authenticating...' : 'Login'}
                        </ClayButton>
                    </form>
                </div>
            </div>
        </>
    );
};
