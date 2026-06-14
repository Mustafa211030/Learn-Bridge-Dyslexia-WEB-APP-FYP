import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './AboutUsPage.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutUsPage = () => {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 1000,
      easing: 'ease-out-cubic',
      offset: 100,
      delay: 200
    });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Educational Psychologist',
      expertise: 'Dyslexia Specialist',
      image: 'https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bio: '15+ years experience in neurodiverse education'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Game Developer',
      expertise: 'EdTech Innovation',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bio: 'Creating engaging learning experiences through gamification'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Speech Therapist',
      expertise: 'Language Processing',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b786d4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bio: 'Specialized in multisensory teaching methods'
    },
    {
      id: 4,
      name: 'David Park',
      role: 'UX Researcher',
      expertise: 'Accessibility Design',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bio: 'Focus on creating inclusive digital experiences'
    }
  ];

  const features = [
    {
      icon: '🎮',
      title: 'Interactive Games',
      description: 'Engaging games designed to improve reading, spelling, and cognitive skills through play.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Detailed analytics to monitor improvement and customize learning paths.'
    },
    {
      icon: '🎯',
      title: 'Personalized Learning',
      description: 'AI-powered adaptation to each learner\'s unique strengths and challenges.'
    },
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'Connect with parents, educators, and specialists in our supportive community.'
    }
  ];

  const stats = [
    { value: '95%', label: 'User Satisfaction', description: 'Parents report improved engagement' },
    { value: '3x', label: 'Faster Progress', description: 'Compared to traditional methods' },
    { value: '10K+', label: 'Active Users', description: 'Across 50+ countries' },
    { value: '100+', label: 'Learning Games', description: 'Continuously expanding library' }
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Back Button - Only in About Us Page */}
      <div className={styles.backButtonContainer}>
        <button 
          onClick={() => router.back()}
          className={styles.backButton}
          data-aos="fade-right"
        >
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className={styles.backButtonText}>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent} data-aos="fade-up">
          <h1 className={styles.heroTitle}>
            <span className={styles.gradientText}>LearnBridge</span> Dyslexia
          </h1>
          <p className={styles.heroSubtitle} data-aos="fade-up" data-aos-delay="200">
            Transforming dyslexia from challenge to superpower through innovative technology
          </p>
        </div>
        <div className={styles.heroPattern}></div>
      </section>

      {/* Mission Statement */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionCard} data-aos="zoom-in">
            <div className={styles.missionIcon}>🎯</div>
            <h2 className={styles.missionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              To create an inclusive digital ecosystem where every dyslexic learner can discover their 
              unique strengths, build confidence, and achieve academic success through personalized, 
              engaging, and scientifically-backed learning experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <span className={styles.sectionLabel}>Our Journey</span>
            <h2 className={styles.sectionTitle}>Building Bridges Since 2018</h2>
          </div>
          
          <div className={styles.storyGrid}>
            <div className={styles.storyContent} data-aos="fade-right">
              <h3>The Beginning</h3>
              <p>
                LearnBridge was founded by a team of educators, psychologists, and technologists 
                who saw firsthand the struggles dyslexic students faced in traditional classrooms. 
                We witnessed brilliant minds being labeled as "slow" simply because they processed 
                information differently.
              </p>
              <p>
                Our journey began with a simple question: What if we could create tools that 
                celebrate neurodiversity instead of treating it as a deficit?
              </p>
            </div>
            <div className={styles.storyImage} data-aos="fade-left" data-aos-delay="200">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Learning journey" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <span className={styles.sectionLabel}>Our Approach</span>
            <h2 className={styles.sectionTitle}>Innovative Learning Solutions</h2>
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={styles.featureCard}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <span className={styles.sectionLabel}>Meet Our Experts</span>
            <h2 className={styles.sectionTitle}>The Minds Behind LearnBridge</h2>
          </div>
          
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div 
                key={member.id} 
                className={styles.teamCard}
                data-aos="flip-up"
                data-aos-delay={index * 150}
              >
                <div className={styles.teamImage}>
                  <img src={member.image} alt={member.name} />
                  <div className={styles.teamOverlay}></div>
                </div>
                <div className={styles.teamInfo}>
                  <h3>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <p className={styles.teamExpertise}>{member.expertise}</p>
                  <p className={styles.teamBio}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={styles.statCard}
                data-aos="zoom-in"
                data-aos-delay={index * 200}
              >
                <div className={styles.statValue}>{stat.value}</div>
                <h3 className={styles.statLabel}>{stat.label}</h3>
                <p className={styles.statDescription}>{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard} data-aos="fade-up">
            <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
            <p className={styles.ctaText}>
              Join thousands of families who have discovered the joy of learning with LearnBridge
            </p>
            <div className={styles.ctaButtons}>
              <Link href="./signup" className={styles.ctaButtonPrimary}>
                Start Free Trial
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/games" className={styles.ctaButtonSecondary}>
                Explore Games
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className={styles.scrollTopButton}
          data-aos="fade-up"
        >
          <svg className={styles.scrollTopIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AboutUsPage;