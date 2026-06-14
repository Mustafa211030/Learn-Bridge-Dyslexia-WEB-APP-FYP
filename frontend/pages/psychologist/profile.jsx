// pages/psychologist/profile.jsx
// Psychologist profile management page

import { useState, useEffect } from 'react';
import Head from 'next/head';
import PsychologistLayout from '../../components/psychologist/layout/PsychologistLayout';
import ProtectedRoute from '../../components/psychologist/common/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../services/psychologistApi';
import toast from 'react-hot-toast';
import styles from '../../styles/psychologist/ContentManager.module.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Form state
  const [formData, setFormData] = useState({
    biography: '',
    shortBio: '',
    yearsOfExperience: 0,
    specializations: [],
    languages: ['English'],
    credentials: {
      degree: 'PhD',
      licenseNumber: '',
      licenseState: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileAPI.getProfile();
      
      if (response.data?.profile) {
        setProfile(response.data.profile);
        setFormData({
          biography: response.data.profile.biography || '',
          shortBio: response.data.profile.shortBio || '',
          yearsOfExperience: response.data.profile.yearsOfExperience || 0,
          specializations: response.data.profile.specializations || [],
          languages: response.data.profile.languages || ['English'],
          credentials: response.data.profile.credentials || {
            degree: 'PhD',
            licenseNumber: '',
            licenseState: ''
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Unable to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('credentials.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        credentials: {
          ...prev.credentials,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSpecializationToggle = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      await profileAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const specializations = [
    'Child Psychology',
    'Adolescent Psychology',
    'Educational Psychology',
    'Cognitive Behavioral Therapy',
    'Play Therapy',
    'Learning Disabilities',
    'ADHD',
    'Autism Spectrum',
    'Anxiety Disorders',
    'Depression',
    'Behavioral Issues',
    'Developmental Psychology',
    'Neuropsychology',
    'School Psychology',
    'Family Therapy'
  ];

  const degrees = ['PhD', 'PsyD', 'EdD', 'MA', 'MS', 'MD', 'Other'];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading profile...</p>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    );
  }

  return (
    <>
      <Head>
        <title>My Profile - Psychologist Dashboard</title>
        <meta name="description" content="Manage your professional profile" />
      </Head>

      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.managerPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderContent}>
                <div className={styles.headerText}>
                  <h1>My Profile</h1>
                  <p>Manage your professional information and credentials</p>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
              {/* Profile Card */}
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatar}>
                    {user?.profilePhoto ? (
                      <img src={user.profilePhoto} alt="" />
                    ) : (
                      getInitials(user?.firstName, user?.lastName)
                    )}
                  </div>
                  <div className={styles.profileInfo}>
                    <h2>Dr. {user?.firstName} {user?.lastName}</h2>
                    <p>{user?.email}</p>
                    {profile?.statistics && (
                      <div className={styles.profileStats}>
                        <span>{profile.statistics.totalStudents} Students</span>
                        <span>{profile.statistics.totalAssessments} Assessments</span>
                        <span>{profile.statistics.blogsPublished} Blogs</span>
                        <span>{profile.statistics.resourcesUploaded} Resources</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className={styles.tabsNav}>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'info' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Personal Info
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'credentials' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('credentials')}
                >
                  Credentials
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'specializations' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('specializations')}
                >
                  Specializations
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className={styles.formCard}>
                {activeTab === 'info' && (
                  <div className={styles.formSection}>
                    <h3 className={styles.formSectionTitle}>Personal Information</h3>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Short Bio</label>
                      <input
                        type="text"
                        name="shortBio"
                        value={formData.shortBio}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="A brief one-liner about yourself"
                        maxLength={300}
                      />
                      <span className={styles.formHint}>{formData.shortBio.length}/300 characters</span>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Full Biography</label>
                      <textarea
                        name="biography"
                        value={formData.biography}
                        onChange={handleInputChange}
                        className={`${styles.formInput} ${styles.formTextarea}`}
                        placeholder="Tell your story, your approach, and what makes you unique..."
                        rows={6}
                        maxLength={2000}
                      />
                      <span className={styles.formHint}>{formData.biography.length}/2000 characters</span>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Years of Experience</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        min={0}
                        max={50}
                        style={{ maxWidth: '150px' }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'credentials' && (
                  <div className={styles.formSection}>
                    <h3 className={styles.formSectionTitle}>Professional Credentials</h3>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Degree</label>
                        <select
                          name="credentials.degree"
                          value={formData.credentials.degree}
                          onChange={handleInputChange}
                          className={styles.formSelect}
                        >
                          {degrees.map(deg => (
                            <option key={deg} value={deg}>{deg}</option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>License Number</label>
                        <input
                          type="text"
                          name="credentials.licenseNumber"
                          value={formData.credentials.licenseNumber}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="Your license number"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>License State/Region</label>
                      <input
                        type="text"
                        name="credentials.licenseState"
                        value={formData.credentials.licenseState}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="e.g., California, New York"
                        style={{ maxWidth: '300px' }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'specializations' && (
                  <div className={styles.formSection}>
                    <h3 className={styles.formSectionTitle}>Areas of Specialization</h3>
                    <p className={styles.formHint} style={{ marginBottom: '1rem' }}>
                      Select all that apply to your practice
                    </p>

                    <div className={styles.specializationsGrid}>
                      {specializations.map(spec => (
                        <label key={spec} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={formData.specializations.includes(spec)}
                            onChange={() => handleSpecializationToggle(spec)}
                            className={styles.checkbox}
                          />
                          <span className={styles.checkboxText}>{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    </>
  );
}
