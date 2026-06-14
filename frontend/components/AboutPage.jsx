import React, { useEffect } from 'react';
import styles from './AboutPage.module.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FaGamepad, FaMicrophoneAlt, FaBookOpen, FaChartLine, FaLanguage, FaUsers } from 'react-icons/fa';

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100
    });
  }, []);

  const features = [
    {
      icon: <FaGamepad className={styles.featureIcon} />,
      title: 'Interactive Game-Based Learning',
      description: 'Engaging games designed to improve reading, writing, and comprehension in a playful and adaptive environment.',
      color: '#3b82f6'
    },
    {
      icon: <FaMicrophoneAlt className={styles.featureIcon} />,
      title: 'Text-to-Speech & Speech Recognition',
      description: 'Real-time audio support and pronunciation correction to enhance verbal learning and confidence.',
      color: '#10b981'
    },
    {
      icon: <FaBookOpen className={styles.featureIcon} />,
      title: 'Customizable E-Book Platform',
      description: 'Adjust fonts, colors, and spacing for stress-free reading with narration options for each book.',
      color: '#8b5cf6'
    },
    {
      icon: <FaChartLine className={styles.featureIcon} />,
      title: 'Progress Monitoring Dashboard',
      description: 'Track your child\'s learning journey with real-time analytics and personalized performance insights.',
      color: '#f59e0b'
    },
    {
      icon: <FaLanguage className={styles.featureIcon} />,
      title: 'Multilingual Language Support',
      description: 'Seamless bilingual experience in English and Urdu to accommodate diverse learners across regions.',
      color: '#ef4444'
    },
    {
      icon: <FaUsers className={styles.featureIcon} />,
      title: 'Parental & Educator Involvement',
      description: 'Parents and teachers can collaborate, track performance, and provide ongoing support through the dashboard.',
      color: '#06b6d4'
    }
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent} data-aos="fade-up">
            <h1 className={styles.heroTitle}>
              About <span className={styles.highlight}>LearnBridge</span> Dyslexia
            </h1>
            <p className={styles.heroSubtitle}>
              Bridging learning gaps through technology, empathy, and innovation
            </p>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Introduction Section */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.introContent} data-aos="fade-right">
              <h2 className={styles.sectionTitle}>
                Welcome to <span className={styles.gradientText}>LearnBridge</span>
              </h2>
              <p className={styles.introText}>
                A comprehensive platform crafted to support children with dyslexia through interactive tools, 
                bilingual support, and intelligent monitoring systems. We aim to remove educational barriers 
                and foster growth in both English and Urdu-speaking environments.
              </p>
              <div className={styles.stats}>
                <div className={styles.statItem} data-aos="zoom-in" data-aos-delay="100">
                  <span className={styles.statNumber}>10,000+</span>
                  <span className={styles.statLabel}>Children Helped</span>
                </div>
                <div className={styles.statItem} data-aos="zoom-in" data-aos-delay="200">
                  <span className={styles.statNumber}>95%</span>
                  <span className={styles.statLabel}>Parent Satisfaction</span>
                </div>
                <div className={styles.statItem} data-aos="zoom-in" data-aos-delay="300">
                  <span className={styles.statNumber}>100+</span>
                  <span className={styles.statLabel}>Learning Games</span>
                </div>
              </div>
            </div>
            <div className={styles.introImage} data-aos="fade-left" data-aos-delay="200">
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Children learning together"
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <h2 className={styles.sectionTitle}>Our Innovative Features</h2>
            <p className={styles.sectionSubtitle}>
              Designed to make learning accessible, engaging, and effective for dyslexic learners
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={styles.featureCard}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                style={{ '--card-color': feature.color }}
              >
                <div className={styles.featureIconWrapper}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.featureLine}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionContent} data-aos="fade-up">
            <div className={styles.missionIcon}>🎯</div>
            <h2 className={styles.sectionTitle}>Our Mission & Vision</h2>
            <p className={styles.missionText}>
              LearnBridge is dedicated to transforming how children with dyslexia experience learning. 
              We believe every child deserves a chance to thrive, and with the right support, they can. 
              We incorporate AI-powered tools, real-time voice interaction, and parent-friendly analytics 
              to deliver personalized learning paths for every user.
            </p>
            <div className={styles.missionHighlight}>
              <p>
                Our platform is more than just a tool — it's a bridge to brighter futures for dyslexic learners. 
                Together, we create a space that celebrates differences and promotes success through creativity, 
                accessibility, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard} data-aos="fade-up" data-aos-delay="100">
              <div className={styles.valueNumber}>01</div>
              <h3>Inclusivity</h3>
              <p>Creating tools that work for everyone, regardless of learning differences</p>
            </div>
            <div className={styles.valueCard} data-aos="fade-up" data-aos-delay="200">
              <div className={styles.valueNumber}>02</div>
              <h3>Innovation</h3>
              <p>Continuously evolving with the latest educational technology</p>
            </div>
            <div className={styles.valueCard} data-aos="fade-up" data-aos-delay="300">
              <div className={styles.valueNumber}>03</div>
              <h3>Empathy</h3>
              <p>Understanding and addressing the real challenges faced by dyslexic learners</p>
            </div>
            <div className={styles.valueCard} data-aos="fade-up" data-aos-delay="400">
              <div className={styles.valueNumber}>04</div>
              <h3>Collaboration</h3>
              <p>Working with educators, parents, and experts to improve our platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard} data-aos="zoom-in">
            <h2 className={styles.ctaTitle}>Ready to Begin the Journey?</h2>
            <p className={styles.ctaText}>
              Join thousands of families who have discovered the joy of learning with LearnBridge
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaButtonPrimary}>
                Start Free Trial
              </button>
              <button className={styles.ctaButtonSecondary}>
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;