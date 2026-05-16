import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <LayoutDashboard />
          Dashboard
        </div>
        <button onClick={logout} className="btn-outline">
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      <div className="dashboard-content" style={{ marginTop: '2rem' }}>
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || 'User'}!</h1>
          <p>Here is your secure profile information.</p>
        </div>

        <div className="profile-card">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h2>{user?.name || 'No Name Provided'}</h2>
            <p>
              <User size={16} />
              {user?.role ? `Role: ${user.role}` : 'Role: User'}
            </p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              Email: {user?.email || 'No email provided'}
            </p>
            {user?.createdAt && (
              <p style={{ fontSize: '0.875rem' }}>
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
