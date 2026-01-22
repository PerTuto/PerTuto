import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { initGA, logPageView } from './services/analytics';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { IGCSETutoringPage } from './pages/IGCSETutoringPage';
import { IBTutoringPage } from './pages/IBTutoringPage';
import { CBSETutoringPage } from './pages/CBSETutoringPage';
import { ALevelTutoringPage } from './pages/ALevelTutoringPage';
import { GradeCalculatorPage } from './pages/GradeCalculatorPage';
import { IBMathPage } from './pages/subjects/IBMathPage';
import { IBPhysicsPage } from './pages/subjects/IBPhysicsPage';
import { IBChemistryPage } from './pages/subjects/IBChemistryPage';
import { IGCSEMathPage } from './pages/subjects/IGCSEMathPage';
import { IGCSEPhysicsPage } from './pages/subjects/IGCSEPhysicsPage';
import { IGCSEChemistryPage } from './pages/subjects/IGCSEChemistryPage';
import { ALevelMathPage } from './pages/subjects/ALevelMathPage';
import { ALevelPhysicsPage } from './pages/subjects/ALevelPhysicsPage';
import { CBSEMathPage } from './pages/subjects/CBSEMathPage';
import { CBSEPhysicsPage } from './pages/subjects/CBSEPhysicsPage';
import { VerifiedTutorsPage } from './pages/VerifiedTutorsPage';
import { SmallGroupPage } from './pages/SmallGroupPage';
import { ExecutivePage } from './pages/ExecutivePage';
import { KineticDidacticPage } from './pages/design/KineticDidacticPage';
import { ImmersiveVoidPage } from './pages/design/ImmersiveVoidPage';
import { CinematicGlassPage } from './pages/design/CinematicGlassPage';
import { LeadsPage } from './pages/LeadsPage';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLoginPage } from './pages/AdminLoginPage';

function App() {
  const [viewMode, setViewMode] = useState<'school' | 'pro'>('school');

  useEffect(() => {
    initGA();
  }, []);

  const LocationAwareScroll = () => {
    const location = useLocation();

    useEffect(() => {
      logPageView();
      window.scrollTo(0, 0);
    }, [location]);

    return null;
  };

  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="pertuto-ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <LocationAwareScroll />
            <Routes>
              <Route path="/" element={<MainLayout viewMode={viewMode} setViewMode={setViewMode} />}>
                <Route index element={<HomePage />} />
                <Route path="igcse-tutoring" element={<IGCSETutoringPage />} />
                <Route path="ib-tutoring" element={<IBTutoringPage />} />
                <Route path="cbse-tutoring" element={<CBSETutoringPage />} />
                <Route path="a-level-tutoring" element={<ALevelTutoringPage />} />
                <Route path="grade-calculator" element={<GradeCalculatorPage />} />
                <Route path="leads" element={
                  <ProtectedRoute>
                    <LeadsPage />
                  </ProtectedRoute>
                } />
                <Route path="admin/login" element={<AdminLoginPage />} />
                <Route path="verified-tutors" element={<VerifiedTutorsPage />} />
                <Route path="small-group-tutoring" element={<SmallGroupPage />} />
                <Route path="executive" element={<ExecutivePage />} />

                {/* Design Concepts */}
                <Route path="design/kinetic" element={<KineticDidacticPage />} />
                <Route path="design/void" element={<ImmersiveVoidPage />} />
                <Route path="design/cinematic" element={<CinematicGlassPage />} />

                {/* Subject Pillars */}
                <Route path="subjects/ib-math-aa-hl" element={<IBMathPage />} />
                <Route path="subjects/ib-physics-hl" element={<IBPhysicsPage />} />
                <Route path="subjects/ib-chemistry-hl" element={<IBChemistryPage />} />
                <Route path="subjects/igcse-math" element={<IGCSEMathPage />} />
                <Route path="subjects/igcse-physics" element={<IGCSEPhysicsPage />} />
                <Route path="subjects/igcse-chemistry" element={<IGCSEChemistryPage />} />
                <Route path="subjects/a-level-math" element={<ALevelMathPage />} />
                <Route path="subjects/a-level-physics" element={<ALevelPhysicsPage />} />
                <Route path="subjects/cbse-math" element={<CBSEMathPage />} />
                <Route path="subjects/cbse-physics" element={<CBSEPhysicsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
