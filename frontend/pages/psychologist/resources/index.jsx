// pages/psychologist/resources/index.jsx
// Educational resources management page

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PsychologistLayout from '../../../components/psychologist/layout/PsychologistLayout';
import ProtectedRoute from '../../../components/psychologist/common/ProtectedRoute';
import { resourcesAPI } from '../../../services/psychologistApi';
import toast from 'react-hot-toast';
import styles from '../../../styles/psychologist/ContentManager.module.css';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await resourcesAPI.getMyResources({
        category: categoryFilter,
        resourceType: typeFilter,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.data) {
        setResources(response.data.resources || []);
        setCategoryCounts(response.data.categoryCounts || []);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Unable to load resources');
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, typeFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDeleteResource = async (resourceId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      await resourcesAPI.deleteResource(resourceId);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  const getResourceIconClass = (type) => {
    switch (type) {
      case 'document':
      case 'worksheet':
        return styles.resourceIconPdf;
      case 'video':
        return styles.resourceIconVideo;
      case 'presentation':
        return styles.resourceIconDoc;
      case 'image':
      case 'infographic':
        return styles.resourceIconImage;
      default:
        return styles.resourceIconOther;
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'document':
      case 'worksheet':
        return (
          <svg className={styles.resourceIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className={styles.resourceIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'presentation':
        return (
          <svg className={styles.resourceIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case 'image':
      case 'infographic':
        return (
          <svg className={styles.resourceIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className={styles.resourceIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const resourceCategories = [
    'Cognitive Development',
    'Emotional Regulation',
    'Social Skills',
    'Learning Strategies',
    'Behavioral Management',
    'Parent Resources',
    'Teacher Resources',
    'Assessment Tools',
    'Therapy Activities',
    'Mindfulness & Relaxation',
    'Communication Skills',
    'Study Skills',
    'ADHD Resources',
    'Anxiety Management',
    'Self-Esteem',
    'Coping Strategies'
  ];

  const resourceTypes = [
    { value: 'document', label: 'Document' },
    { value: 'worksheet', label: 'Worksheet' },
    { value: 'video', label: 'Video' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'infographic', label: 'Infographic' },
    { value: 'template', label: 'Template' },
    { value: 'guide', label: 'Guide' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'activity', label: 'Activity' }
  ];

  return (
    <>
      <Head>
        <title>Resources - Psychologist Dashboard</title>
        <meta name="description" content="Manage educational resources and materials" />
      </Head>

      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.managerPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderContent}>
                <div className={styles.headerText}>
                  <h1>Educational Resources</h1>
                  <p>Upload and manage learning materials for students and parents</p>
                </div>
                <div className={styles.headerActions}>
                  <Link href="/psychologist/resources/new" className={`${styles.btn} ${styles.btnPrimary}`}>
                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Resource
                  </Link>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
              {/* Filters */}
              <div className={styles.filtersCard} style={{ marginBottom: '2rem' }}>
                <div className={styles.filtersRow}>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="">All Categories</option>
                    {resourceCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="">All Types</option>
                    {resourceTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resources Grid */}
              {isLoading ? (
                <div className={styles.contentGrid}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.skeletonCard}></div>
                  ))}
                </div>
              ) : resources.length > 0 ? (
                <div className={styles.contentGrid}>
                  {resources.map((resource) => (
                    <div key={resource._id} className={styles.resourceCard}>
                      <div className={styles.resourceCardHeader}>
                        <div className={`${styles.resourceIcon} ${getResourceIconClass(resource.resourceType)}`}>
                          {getResourceIcon(resource.resourceType)}
                        </div>
                        <div className={styles.resourceInfo}>
                          <h3 className={styles.resourceTitle}>{resource.title}</h3>
                          <span className={styles.resourceType}>
                            {resource.resourceType} • {resource.category}
                          </span>
                        </div>
                      </div>

                      <div className={styles.resourceCardBody}>
                        <p className={styles.resourceDescription}>
                          {resource.description || 'No description provided'}
                        </p>

                        <div className={styles.resourceMeta}>
                          <span className={styles.resourceMetaItem}>
                            <svg className={styles.resourceMetaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {resource.metrics?.views || 0}
                          </span>
                          <span className={styles.resourceMetaItem}>
                            <svg className={styles.resourceMetaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {resource.metrics?.downloads || 0}
                          </span>
                          <span className={styles.resourceMetaItem}>
                            <svg className={styles.resourceMetaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {resource.metrics?.avgRating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.resourceCardFooter}>
                        <div className={styles.resourceTags}>
                          {resource.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className={styles.resourceTag}>{tag}</span>
                          ))}
                        </div>
                        <div className={styles.resourceActions}>
                          <Link
                            href={`/psychologist/resources/${resource._id}/edit`}
                            className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                          >
                            <svg className={styles.iconBtnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                            onClick={(e) => handleDeleteResource(resource._id, e)}
                          >
                            <svg className={styles.iconBtnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg className={styles.emptyStateIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyStateTitle}>No Resources Yet</h3>
                  <p className={styles.emptyStateText}>
                    Upload educational materials to share with students and parents.
                  </p>
                  <Link href="/psychologist/resources/new" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Upload Your First Resource
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationBtn}
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </button>
                  <span className={styles.paginationInfo}>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    className={styles.paginationBtn}
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    </>
  );
}
