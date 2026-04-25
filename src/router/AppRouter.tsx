import { Route, Routes } from "react-router-dom";

import { Homepage } from "../pages/homePage";
import { RegistrationPage } from "../pages/registerPage";
import { LoginPage } from "../pages/loginPage";
import { ROUTES } from "../constants";
import { GoogleAuthSuccess } from "../pages/googleAuthSuccess";
import { WelcomePage } from "../pages/welcomePage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProtectedLayout } from "../layouts/ProtectedLayout";
import { VerifyEmailPage } from "../pages/verifyEmailPage";
import { ForgotPasswordPage } from "../pages/forgotPasswordPage";
import { ResetPasswordPage } from "../pages/resetPasswordPage";
import { AdminPage } from "../pages/adminPage";
import { TwoFactorVerifyPage } from "../pages/twoFactorVerifyPage";
import { ProfilePage } from "../pages/profilePage";
import { GenerateSentencesPage } from "../pages/generateSentencesPage";
import { SavedSentencesPage } from "../pages/savedSentencesPage";
import { TranslateWordPage } from "../pages/translateWordPage";
import { TranslateTextPage } from "../pages/translateTextPage";
import { SavedWordsPage } from "../pages/savedWordsPage";
import { VocabularyQuizPage } from "../pages/vocabularyQuizPage";
import { TensesOverviewPage, TenseDetailPage } from "../pages/tensesPage";
import { TensesQuizPage } from "../pages/tensesQuizPage";
import { TensePracticePage } from "../pages/tensePracticePage";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.Home} element={<Homepage />} />
      <Route path={ROUTES.Register} element={<RegistrationPage />} />
      <Route path={ROUTES.Login} element={<LoginPage />} />
      <Route path={ROUTES.GoogleAuthSuccess} element={<GoogleAuthSuccess />} />
      <Route path={ROUTES.VerifyEmail} element={<VerifyEmailPage />} />
      <Route path={ROUTES.PasswordRecovery} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.ResetPassword} element={<ResetPasswordPage />} />
      <Route path={ROUTES.TwoFactorVerify} element={<TwoFactorVerifyPage />} />

      {/* Protected routes — shared layout (left sidebar + right sidebar) */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.Welcome} element={<WelcomePage />} />
        <Route path={ROUTES.Profile} element={<ProfilePage />} />
        <Route path={ROUTES.GenerateSentences} element={<GenerateSentencesPage />} />
        <Route path={ROUTES.SavedSentences} element={<SavedSentencesPage />} />
        <Route path={ROUTES.SavedWords} element={<SavedWordsPage />} />
        <Route path={ROUTES.VocabularyQuiz} element={<VocabularyQuizPage />} />
        <Route path={ROUTES.TranslateWord} element={<TranslateWordPage />} />
        <Route path={ROUTES.TranslateText} element={<TranslateTextPage />} />
        <Route path={ROUTES.Tenses} element={<TensesOverviewPage />} />
        <Route path={ROUTES.TenseDetail} element={<TenseDetailPage />} />
        <Route path={ROUTES.TensesQuiz} element={<TensesQuizPage />} />
        <Route path={ROUTES.TensePractice} element={<TensePracticePage />} />
      </Route>

      {/* Admin route */}
      <Route
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.AdminPanel} element={<AdminPage />} />
      </Route>
    </Routes>
  );
};
