import Link from 'next/link';
import './Sidebar.css';

export default function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">{role.charAt(0).toUpperCase() + role.slice(1)} Menu</h2>
      <nav className="sidebar-nav">
        {role === 'user' && (
          <>
            <Link href="/user/dashboard" className="sidebar-link">Dashboard</Link>
            <Link href="/user/profile" className="sidebar-link">Profile</Link>
            <Link href="/user/games" className="sidebar-link">Games</Link>
            <Link href="/blogs" className="sidebar-link">Blogs</Link>
          </>
        )}
        {role === 'psychologist' && (
          <>
            <Link href="/psychologist/dashboard" className="sidebar-link">Dashboard</Link>
            <Link href="/psychologist/credentials" className="sidebar-link">Credentials</Link>
            <Link href="/psychologist/progress" className="sidebar-link">User Progress</Link>
            <Link href="/psychologist/blogs" className="sidebar-link">Blogs</Link>
          </>
        )}
        {role === 'admin' && (
          <>
            <Link href="/admin/dashboard" className="sidebar-link">Dashboard</Link>
            <Link href="/admin/users" className="sidebar-link">Users</Link>
            <Link href="/admin/games" className="sidebar-link">Games</Link>
          </>
        )}
      </nav>
    </aside>
  );
}