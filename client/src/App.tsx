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

function App() {
  const { isLoading, authUser } = useAuthUser();

  const authicated = Boolean(authUser);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={authicated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authicated ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authicated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={!authicated ? <NotificationPage /> : <Navigate to="/" />}
        />
        <Route
          path="/call"
          element={!authicated ? <CallPage /> : <Navigate to="/" />}
        />
        <Route
          path="/chat"
          element={!authicated ? <ChatPage /> : <Navigate to="/" />}
        />
        <Route
          path="/onboarding"
          element={!authicated ? <Onboarding /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster richColors />
    </div>
  );
}

export default App;
