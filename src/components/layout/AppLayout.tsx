import { NavLink, Outlet } from 'react-router-dom';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">RSVP Reader</div>
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/reader">Reader</NavLink>
          <NavLink to="/library">Library</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}
