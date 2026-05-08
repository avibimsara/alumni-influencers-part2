import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResetPassword from "./pages/ResetPAssword.jsx";
import Dashboard       from "./pages/Dashboard.jsx";
import AdminApiKeys from "./pages/AdminApiKeys.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Trends from './pages/Trends.jsx';
import ViewAlumni    from './pages/ViewAlumni.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';




// Dashboard placeholder
// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Logged in as: {user?.email}</p>
//       <button onClick={() => navigate('/admin/api-keys')}>
//         Manage API Keys
//       </button>
//       <button onClick={() => { logout(); navigate('/login'); }}>
//         Logout
//       </button>
//     </div>
//   );
// };

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard"        element={<Dashboard />} />
        <Route path="/dashboard/trends" element={<Trends />} />
        <Route path="/dashboard/alumni" element={<ViewAlumni />} />
        <Route path="/dashboard/admin"  element={<AdminApiKeys />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

    // useEffect(() => {
    //   axios.get('/api/health')
    //     .then(response => setHealth(response.data))
    //     .catch(err => console.error('Health check failed:', err));
    // }, []);
  );
}

export default App;
