import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ContributePage } from '../pages/ContributePage';
import { ExplorePage } from '../pages/ExplorePage';
import { ProfilePage } from '../pages/ProfilePage';
import { SavedPage } from '../pages/SavedPage';
import { ServiceProfilePage } from '../pages/ServiceProfilePage';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/services/:providerId" element={<ServiceProfilePage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AppShell>
  );
}
