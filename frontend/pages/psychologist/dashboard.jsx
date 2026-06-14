// pages/psychologist/dashboard.jsx
// Dashboard page route for psychologist

import Head from 'next/head';
import PsychologistLayout from '../../components/psychologist/layout/PsychologistLayout';
import PsychologistDashboard from '../../components/psychologist/dashboard/PsychologistDashboard';
import ProtectedRoute from '../../components/psychologist/common/ProtectedRoute';

export default function PsychologistDashboardPage() {
  return (
    <>
      <Head>
        <title>Psychologist Dashboard - LearnBridge</title>
        <meta name="description" content="Professional psychologist dashboard for student assessment and management" />
      </Head>
      
      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <PsychologistDashboard />
        </PsychologistLayout>
      </ProtectedRoute>
    </>
  );
}
