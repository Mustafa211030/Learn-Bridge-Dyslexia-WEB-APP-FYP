import { useEffect } from 'react';
import Head from 'next/head';
import styles from './HeroSection.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';

const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100,
      mirror: false
    });
  }, []);

  const features = [
    {
      icon: '🧠',
      title: 'Dyslexia-Friendly',
      description: 'Specialized fonts and layouts'
    },
    {
      icon: '🎮',
      title: 'Game-Based',
      description: 'Engaging learning games'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor improvements'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Parent Tools',
      description: 'Support learning journey'
    }
  ];

  const successStories = [
    {
      name: 'Emma, 8',
      improvement: '+2 reading levels',
      avatar: '👧'
    },
    {
      name: 'Noah, 10',
      improvement: '70% more confident',
      avatar: '👦'
    }
  ];

  const ageGroups = [
    {
      range: '6-8 Years',
      skills: 'Phonics • Letters • Words'
    },
    {
      range: '9-10 Years',
      skills: 'Reading • Comprehension'
    },
    {
      range: '11-12 Years',
      skills: 'Advanced • Writing'
    }
  ];

  return (
    <>
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      
      <section className={styles.hero}>
        {/* Background Elements */}
        <div className={styles.backgroundElements}>
          <div className={styles.gradientOrb}></div>
        </div>

        {/* Main Content */}
        <div className={styles.heroContainer}>
          {/* Text Content */}
          <div className={styles.heroContent}>
            <div 
              className={styles.badge}
              data-aos="fade-down"
              data-aos-delay="100"
            >
              🏆 5,000+ Families
            </div>
            
            <h1 
              className={styles.heroTitle}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              LearnBridge
              <span className={styles.gradientText}> Dyslexia</span>
            </h1>
            
            <p 
              className={styles.heroSubtitle}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Gaming platform for children with dyslexia
            </p>
            
            <p 
              className={styles.heroDescription}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Transform reading challenges into exciting gaming adventures. 
              Evidence-based games build confidence and literacy skills.
            </p>

            {/* Key Benefits */}
            <div 
              className={styles.benefits}
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className={styles.benefitItem}>
                <span className={styles.checkmark}>✓</span>
                Multi-sensory learning
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.checkmark}>✓</span>
                Phonics-focused
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.checkmark}>✓</span>
                Adaptive levels
              </div>
            </div>

            {/* CTA Buttons */}
            <div 
              className={styles.ctaContainer}
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <Link href="/login" className={styles.primaryBtn}>
                Start Free Trial
              </Link>
              <a href="#" className={styles.secondaryBtn}>
                View Demo
              </a>
            </div>
          </div>

          {/* Cards Container */}
          <div className={styles.cardsContainer}>
            {/* Main Game Card */}
            <div 
              className={styles.mainCard}
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Word Adventure</div>
                <div className={styles.cardLevel}>Level 1</div>
              </div>
              <div className={styles.gameContent}>
                <div className={styles.wordDisplay}>CAT</div>
                <div className={styles.choices}>
                  <button className={styles.choice}>🐱</button>
                  <button className={styles.choice}>🐶</button>
                  <button className={styles.choice}>🐦</button>
                </div>
              </div>
              <div className={styles.progress}>
                <div className={styles.progressText}>Progress: 75%</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
              </div>
            </div>

            {/* Success Cards */}
            <div className={styles.sideCards}>
              {successStories.map((story, index) => (
                <div 
                  key={index}
                  className={styles.sideCard}
                  data-aos="fade-up"
                  data-aos-delay={400 + (index * 100)}
                >
                  <div className={styles.sideAvatar}>{story.avatar}</div>
                  <div className={styles.sideContent}>
                    <div className={styles.sideName}>{story.name}</div>
                    <div className={styles.sideImprovement}>{story.improvement}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div 
          className={styles.trustSection}
          data-aos="fade-up"
          data-aos-delay="700"
        >
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🔒</div>
              <div className={styles.trustText}>Child-Safe</div>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🏅</div>
              <div className={styles.trustText}>Expert-Endorsed</div>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>⭐</div>
              <div className={styles.trustText}>4.9/5 Rating</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 
              className={styles.sectionTitle}
              data-aos="fade-up"
            >
              Designed for Dyslexic Learners
            </h2>
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

        {/* Age Groups */}
        <div className={styles.ageSection}>
          <div className={styles.sectionHeader}>
            <h2 
              className={styles.sectionTitle}
              data-aos="fade-up"
            >
              Ages 6-12
            </h2>
          </div>
          <div className={styles.ageGrid}>
            {ageGroups.map((age, index) => (
              <div 
                key={index}
                className={styles.ageCard}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className={styles.ageRange}>{age.range}</div>
                <div className={styles.ageSkills}>{age.skills}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;