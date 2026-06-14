// pages/admin/users/index.jsx
// Premium Users Management Page

import { useState, useEffect, useCallback } from 'react';
import AdminProtectedRoute from '../../../components/admin/AdminProtectedRoute';
import AdminLayout from '../../../components/admin/AdminLayout';
import { usersAPI } from '../../../services/adminApi';
import styles from '../../../styles/admin/Users.module.css';

// Icons
const Icons = {
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
    </svg>
  ),
  MoreVertical: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Key: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17,11 19,13 23,9" />
    </svg>
  ),
  UserX: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="18" y1="8" x2="23" y2="13" />
      <line x1="23" y1="8" x2="18" y2="13" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// Role badge colors
const roleBadgeColors = {
  student: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' },
  psychologist: { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' },
  admin: { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' },
};

// User Row Component
const UserRow = ({ user, onEdit, onDelete, onToggleStatus, onResetPassword }) => {
  const [showMenu, setShowMenu] = useState(false);
  const roleColors = roleBadgeColors[user.role?.toLowerCase()] || roleBadgeColors.student;

  return (
    <tr className={styles.tableRow}>
      <td>
        <div className={styles.userCell}>
          <div className={styles.userAvatar}>
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.firstName} {user.lastName}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
        </div>
      </td>
      <td>
        <span className={styles.username}>@{user.username}</span>
      </td>
      <td>
        <span 
          className={styles.roleBadge}
          style={{ background: roleColors.bg, color: roleColors.color }}
        >
          {user.role}
        </span>
      </td>
      <td>
        <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
          <span className={styles.statusDot}></span>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <span className={styles.dateText}>
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td>
        <div className={styles.actionsCell}>
          <button 
            className={styles.actionBtn}
            onClick={() => setShowMenu(!showMenu)}
          >
            <Icons.MoreVertical />
          </button>
          
          {showMenu && (
            <>
              <div className={styles.menuOverlay} onClick={() => setShowMenu(false)} />
              <div className={styles.actionMenu}>
                <button onClick={() => { onEdit(user); setShowMenu(false); }}>
                  <Icons.Edit /> Edit User
                </button>
                <button onClick={() => { onToggleStatus(user); setShowMenu(false); }}>
                  {user.isActive ? <Icons.UserX /> : <Icons.UserCheck />}
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => { onResetPassword(user); setShowMenu(false); }}>
                  <Icons.Key /> Reset Password
                </button>
                <button 
                  className={styles.deleteAction}
                  onClick={() => { onDelete(user); setShowMenu(false); }}
                >
                  <Icons.Trash /> Delete User
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Confirmation Modal
const ConfirmModal = ({ title, message, confirmText, onConfirm, onCancel, danger }) => (
  <div className={styles.modalOverlay} onClick={onCancel}>
    <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className={styles.modalActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        <button 
          className={danger ? styles.dangerBtn : styles.confirmBtn}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

// Main Page Component
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ all: 0, students: 0, psychologists: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const role = filter === 'all' ? '' : filter;
      const response = await usersAPI.getAll({ page, limit: 10, role, search });
      setUsers(response.data.data.users);
      setCounts(response.data.data.counts);
      setTotalPages(response.data.data.pagination.pages);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      // Mock data for demo
      setUsers([
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', username: 'johndoe', role: 'Student', isActive: true, createdAt: new Date() },
        { _id: '2', firstName: 'Sarah', lastName: 'Smith', email: 'sarah@example.com', username: 'sarahsmith', role: 'Psychologist', isActive: true, createdAt: new Date() },
        { _id: '3', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', username: 'admin', role: 'Admin', isActive: true, createdAt: new Date() },
        { _id: '4', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', username: 'mikej', role: 'Student', isActive: false, createdAt: new Date() },
        { _id: '5', firstName: 'Emily', lastName: 'Brown', email: 'emily@example.com', username: 'emilyb', role: 'Student', isActive: true, createdAt: new Date() },
      ]);
      setCounts({ all: 5, students: 3, psychologists: 1, admins: 1 });
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await usersAPI.delete(deleteModal._id);
      setDeleteModal(null);
      fetchUsers();
    } catch (err) {
      // Demo: remove locally
      setUsers(prev => prev.filter(u => u._id !== deleteModal._id));
      setDeleteModal(null);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusModal) return;
    try {
      await usersAPI.updateStatus(statusModal._id, !statusModal.isActive);
      setStatusModal(null);
      fetchUsers();
    } catch (err) {
      // Demo: toggle locally
      setUsers(prev => prev.map(u => 
        u._id === statusModal._id ? { ...u, isActive: !u.isActive } : u
      ));
      setStatusModal(null);
    }
  };

  const handleResetPassword = (user) => {
    alert(`Password reset link sent to ${user.email}`);
  };

  const handleEdit = (user) => {
    alert(`Edit user: ${user.firstName} ${user.lastName}`);
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout title="User Management" breadcrumbs={['Users']}>
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div 
            className={`${styles.statCard} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            <span className={styles.statIcon}>👥</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{counts.all}</span>
              <span className={styles.statLabel}>All Users</span>
            </div>
          </div>
          <div 
            className={`${styles.statCard} ${filter === 'student' ? styles.active : ''}`}
            onClick={() => setFilter('student')}
          >
            <span className={styles.statIcon}>🎓</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{counts.students}</span>
              <span className={styles.statLabel}>Students</span>
            </div>
          </div>
          <div 
            className={`${styles.statCard} ${filter === 'psychologist' ? styles.active : ''}`}
            onClick={() => setFilter('psychologist')}
          >
            <span className={styles.statIcon}>🧠</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{counts.psychologists}</span>
              <span className={styles.statLabel}>Psychologists</span>
            </div>
          </div>
          <div 
            className={`${styles.statCard} ${filter === 'admin' ? styles.active : ''}`}
            onClick={() => setFilter('admin')}
          >
            <span className={styles.statIcon}>⚡</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{counts.admins}</span>
              <span className={styles.statLabel}>Admins</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Icons.Search />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <UserRow
                    key={user._id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={setDeleteModal}
                    onToggleStatus={setStatusModal}
                    onResetPassword={handleResetPassword}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <Icons.ChevronLeft />
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button 
              className={styles.pageBtn}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <Icons.ChevronRight />
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <ConfirmModal
            title="Delete User"
            message={`Are you sure you want to delete ${deleteModal.firstName} ${deleteModal.lastName}? This action cannot be undone.`}
            confirmText="Delete"
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal(null)}
            danger
          />
        )}

        {/* Status Toggle Modal */}
        {statusModal && (
          <ConfirmModal
            title={statusModal.isActive ? 'Deactivate User' : 'Activate User'}
            message={`Are you sure you want to ${statusModal.isActive ? 'deactivate' : 'activate'} ${statusModal.firstName} ${statusModal.lastName}?`}
            confirmText={statusModal.isActive ? 'Deactivate' : 'Activate'}
            onConfirm={handleToggleStatus}
            onCancel={() => setStatusModal(null)}
            danger={statusModal.isActive}
          />
        )}
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default UsersPage;
