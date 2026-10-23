import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ExplorePage } from '../pages/ExplorePage';
import { ContributePage } from '../pages/ContributePage';
import { SavedPage } from '../pages/SavedPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ComparePage } from '../pages/ComparePage';
import { ModerationPage, ModeratorDetailPage } from '../pages/ModerationPage';
import { OfficialVsCommunityPage, ProviderDashboardPage } from '../pages/ProviderDashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { ImageReviewPage } from '../pages/ImageReviewPage';
import { CommunityIntelligencePage } from '../pages/CommunityIntelligencePage';
import { ContributionSuccessPage } from '../pages/ContributionSuccessPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/image-review"
        element={import.meta.env.DEV ? <ImageReviewPage /> : <Navigate to="/explore" replace />}
      />
      <Route
        path="/*"
        element={
          <AppShell>
            <Routes>
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/services/:providerId/community-intelligence" element={<CommunityIntelligencePage />} />
              <Route path="/services/:providerId" element={<ExplorePage />} />
              <Route path="/contribute" element={<ContributePage />} />
              <Route path="/contribute/success" element={<ContributionSuccessPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/moderation" element={<ModerationPage />} />
              <Route path="/moderation/:reportId" element={<ModeratorDetailPage />} />
              <Route path="/provider" element={<ProviderDashboardPage />} />
              <Route path="/provider/official-vs-community" element={<OfficialVsCommunityPage />} />
              <Route path="*" element={<Navigate to="/explore" replace />} />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
  );
}
