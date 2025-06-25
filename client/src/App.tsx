import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotificationPage from "./pages/NotificationPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import Onboarding from "./pages/Onboarding";
import { Toaster } from "sonner";
import useAuthUser from "./hook/useAuthUser";
import Layout from "./components/Layout";
import NotificationsPage from "./pages/NotificationPage";

function App() {
  const { isLoading, authUser } = useAuthUser();

  const authicated = Boolean(authUser);
  const isBoarding = authUser?.isOnboarded;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            authicated && isBoarding ? (
              <Layout showSidebar={true}>
                <Home />
              </Layout>
            ) : (
              <Navigate to={!authicated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !authicated ? (
              <Signup />
            ) : (
              <Navigate to={isBoarding ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authicated ? (
              <Login />
            ) : (
              <Navigate to={isBoarding ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authicated && isBoarding ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!authicated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            authicated && isBoarding ? (
              <CallPage />
            ) : (
              <Navigate to={!authicated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            authicated && isBoarding ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!authicated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            authicated ? (
              !isBoarding ? (
                <Onboarding />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster richColors />
    </div>
  );
}

export default App;
