// pages/student/games/index.jsx
// Student Games Hub - Uses StudentGamesHub component with inline game playing
// FIXED: Now uses environment variable for API URL

import Head from 'next/head';
import { useAuth } from '../../../contexts/AuthContext';
import StudentLayout from '../../../components/student/StudentLayout';
import StudentGamesHub from '../../../components/student/StudentGamesHub';

// CRITICAL: Use environment variable to point to Express backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function GamesPage() {
  const { user } = useAuth();

  return (
    <StudentLayout title="Games Hub">
      <Head>
        <title>Games Hub | LearnBridge</title>
      </Head>
      <StudentGamesHub 
        userId={user?._id || user?.id} 
        apiBaseUrl={API_BASE_URL}
      />
    </StudentLayout>
  );
}