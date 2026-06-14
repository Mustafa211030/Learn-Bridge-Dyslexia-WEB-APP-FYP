// components/PsychologistSupport.jsx - Professional Mental Health Support Component

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from './PsychologistSupport.module.css';

const PsychologistSupport = () => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const handleViewBlogs = () => {
    router.push('/psychologist/blogs');
  };

  const features = [
    {
      title: 'Comprehensive Mental Health Assessment',
      description: 'Our licensed psychologists conduct thorough evaluations using evidence-based assessment tools to understand each student\'s unique psychological profile. Through detailed interviews, standardized testing, and behavioral observations, we create a complete picture of cognitive, emotional, and social functioning.',
      image: '/images/psychologist/assessment.jpg',
      stats: {
        label: 'Assessment Tools',
        value: '15+'
      }
    },
    {
      title: 'Personalized Intervention Strategies',
      description: 'Based on comprehensive assessments, our team develops tailored intervention plans that address specific learning difficulties, emotional challenges, and behavioral concerns. Each strategy is designed to support the student\'s developmental needs while fostering resilience and promoting positive mental health outcomes.',
      image: '/images/psychologist/intervention.jpg',
      stats: {
        label: 'Success Rate',
        value: '92%'
      }
    },
    {
      title: 'Continuous Progress Monitoring',
      description: 'We implement systematic tracking methods to measure student progress over time. Regular check-ins, data-driven assessments, and collaborative reviews with educators and families ensure that interventions remain effective and adjustments are made as needed to optimize outcomes.',
      image: '/images/psychologist/monitoring.jpg',
      stats: {
        label: 'Monthly Reviews',
        value: '100%'
      }
    },
    {
      title: 'Family Collaboration & Support',
      description: 'Recognizing that family involvement is crucial to student success, we provide comprehensive support to parents and guardians. Through regular consultations, educational workshops, and resource sharing, we empower families to reinforce therapeutic strategies at home and create supportive environments.',
      image: '/images/psychologist/family.jpg',
      stats: {
        label: 'Family Sessions',
        value: '200+'
      }
    },
    {
      title: 'Evidence-Based Therapeutic Approaches',
      description: 'Our psychologists utilize scientifically validated therapeutic modalities including Cognitive Behavioral Therapy, Play Therapy, Mindfulness-Based Interventions, and Social-Emotional Learning frameworks. Each approach is carefully selected based on the individual student\'s needs and developmental stage.',
      image: '/images/psychologist/therapy.jpg',
      stats: {
        label: 'Therapy Methods',
        value: '10+'
      }
    },
    {
      title: 'Crisis Intervention & Support',
      description: 'When immediate psychological support is needed, our team provides timely crisis intervention services. With established protocols and rapid response systems, we ensure that students experiencing acute distress receive immediate professional attention and appropriate care coordination.',
      image: '/images/psychologist/crisis.jpg',
      stats: {
        label: 'Response Time',
        value: '<24hrs'
      }
    }
  ];

  const specializations = [
    {
      area: 'Learning Disabilities',
      description: 'Specialized assessment and intervention for dyslexia, dyscalculia, dysgraphia, and other specific learning disorders affecting academic performance.',
      expertise: 'Advanced'
    },
    {
      area: 'Anxiety & Stress Management',
      description: 'Comprehensive support for students experiencing test anxiety, social anxiety, generalized anxiety, and stress-related difficulties impacting school performance.',
      expertise: 'Expert'
    },
    {
      area: 'Behavioral Interventions',
      description: 'Evidence-based strategies for addressing challenging behaviors, improving self-regulation, and developing positive behavioral patterns in academic settings.',
      expertise: 'Advanced'
    },
    {
      area: 'Emotional Regulation',
      description: 'Teaching practical skills for managing emotions, building resilience, and developing healthy coping mechanisms to navigate academic and social challenges.',
      expertise: 'Expert'
    },
    {
      area: 'Social Skills Development',
      description: 'Targeted interventions to enhance peer relationships, communication skills, conflict resolution abilities, and overall social-emotional competence.',
      expertise: 'Advanced'
    },
    {
      area: 'Academic Motivation',
      description: 'Addressing motivational challenges, building growth mindset, fostering intrinsic motivation, and developing effective study habits and learning strategies.',
      expertise: 'Expert'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'The journey begins with a comprehensive intake session where we gather background information, discuss concerns, and establish collaborative goals. This initial meeting sets the foundation for a trusting therapeutic relationship.'
    },
    {
      step: '02',
      title: 'Comprehensive Assessment',
      description: 'Using standardized tests, clinical interviews, and observational methods, we conduct a thorough evaluation of cognitive abilities, emotional functioning, behavioral patterns, and learning styles to create a complete diagnostic picture.'
    },
    {
      step: '03',
      title: 'Treatment Planning',
      description: 'Based on assessment findings, we develop an individualized treatment plan with specific, measurable goals. This plan incorporates evidence-based interventions tailored to the student\'s unique needs and family preferences.'
    },
    {
      step: '04',
      title: 'Active Intervention',
      description: 'Regular therapy sessions implement the treatment plan through structured activities, skill-building exercises, and therapeutic conversations. We maintain flexibility to adapt approaches based on the student\'s progress and emerging needs.'
    },
    {
      step: '05',
      title: 'Progress Review',
      description: 'Periodic evaluations assess treatment effectiveness, measure goal attainment, and identify areas requiring adjustment. These reviews involve collaboration with students, families, and educators to ensure comprehensive support.'
    },
    {
      step: '06',
      title: 'Transition & Maintenance',
      description: 'As students achieve their goals, we gradually transition to maintenance phase with reduced frequency of sessions. We provide strategies for sustaining progress and preventing relapse while ensuring continued support availability.'
    }
  ];

  return (
    <section className={styles.supportSection}>
      {/* Hero Section */}
      <div className={styles.heroContainer}>
        <div className={styles.heroContent} data-aos="fade-up">
          <h1 className={styles.heroTitle}>
            Professional Psychological Support
            <span className={styles.heroTitleAccent}> for Every Student</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Empowering students to overcome challenges, build resilience, and achieve their full potential through comprehensive, evidence-based psychological services delivered by licensed professionals dedicated to mental health and academic success.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem} data-aos="fade-up" data-aos-delay="100">
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Students Supported</div>
            </div>
            <div className={styles.statItem} data-aos="fade-up" data-aos-delay="200">
              <div className={styles.statNumber}>15+</div>
              <div className={styles.statLabel}>Licensed Psychologists</div>
            </div>
            <div className={styles.statItem} data-aos="fade-up" data-aos-delay="300">
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className={styles.missionSection} data-aos="fade-up">
        <div className={styles.container}>
          <div className={styles.missionContent}>
            <h2 className={styles.sectionTitle}>Our Commitment to Student Wellness</h2>
            <p className={styles.missionText}>
              At the heart of academic success lies emotional and psychological well-being. Our dedicated team of licensed psychologists works tirelessly to create a supportive environment where every student can thrive. We believe that addressing mental health concerns early and comprehensively paves the way for lifelong success, resilience, and fulfillment.
            </p>
            <p className={styles.missionText}>
              Through individualized care, evidence-based interventions, and collaborative partnerships with families and educators, we help students navigate challenges, develop coping strategies, and build the emotional intelligence necessary for academic achievement and personal growth.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <h2 className={styles.sectionTitle}>Comprehensive Support Services</h2>
            <p className={styles.sectionSubtitle}>
              A holistic approach to student mental health and academic success
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={styles.featureCard}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={styles.featureImage}>
                  <div className={styles.imagePlaceholder}>
                    <div className={styles.placeholderIcon}></div>
                  </div>
                  <div className={styles.featureStats}>
                    <div className={styles.statsValue}>{feature.stats.value}</div>
                    <div className={styles.statsLabel}>{feature.stats.label}</div>
                  </div>
                </div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className={styles.specializationsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <h2 className={styles.sectionTitle}>Areas of Expertise</h2>
            <p className={styles.sectionSubtitle}>
              Specialized interventions tailored to diverse student needs
            </p>
          </div>

          <div className={styles.specializationsGrid}>
            {specializations.map((spec, index) => (
              <div 
                key={index} 
                className={styles.specializationCard}
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className={styles.specializationHeader}>
                  <h3 className={styles.specializationTitle}>{spec.area}</h3>
                  <span className={styles.expertiseBadge}>{spec.expertise}</span>
                </div>
                <p className={styles.specializationDescription}>{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <h2 className={styles.sectionTitle}>Our Therapeutic Process</h2>
            <p className={styles.sectionSubtitle}>
              A structured, collaborative approach to student mental health
            </p>
          </div>

          <div className={styles.processTimeline}>
            {processSteps.map((process, index) => (
              <div 
                key={index} 
                className={styles.processStep}
                data-aos="fade-right"
                data-aos-delay={index * 100}
              >
                <div className={styles.stepNumber}>{process.step}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{process.title}</h3>
                  <p className={styles.stepDescription}>{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog CTA Section */}
      <div className={styles.blogSection} data-aos="fade-up">
        <div className={styles.container}>
          <div className={styles.blogCta}>
            <div className={styles.blogContent}>
              <h2 className={styles.blogTitle}>Insights from Our Psychologists</h2>
              <p className={styles.blogDescription}>
                Stay informed with the latest research, expert advice, and practical strategies for supporting student mental health. Our psychologists regularly share valuable insights on topics ranging from anxiety management to learning optimization.
              </p>
              <button onClick={handleViewBlogs} className={styles.blogButton}>
                <span>View Recent Publications</span>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            <div className={styles.blogImageContainer}>
              <div className={styles.blogImagePlaceholder}>
                <div className={styles.placeholderIcon}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem} data-aos="zoom-in" data-aos-delay="0">
              <h3 className={styles.trustNumber}>100%</h3>
              <p className={styles.trustLabel}>Licensed Professionals</p>
            </div>
            <div className={styles.trustItem} data-aos="zoom-in" data-aos-delay="100">
              <h3 className={styles.trustNumber}>10+</h3>
              <p className={styles.trustLabel}>Years Experience</p>
            </div>
            <div className={styles.trustItem} data-aos="zoom-in" data-aos-delay="200">
              <h3 className={styles.trustNumber}>24/7</h3>
              <p className={styles.trustLabel}>Crisis Support</p>
            </div>
            <div className={styles.trustItem} data-aos="zoom-in" data-aos-delay="300">
              <h3 className={styles.trustNumber}>Confidential</h3>
              <p className={styles.trustLabel}>All Sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className={styles.contactSection} data-aos="fade-up">
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <h2 className={styles.contactTitle}>Ready to Support Your Student?</h2>
            <p className={styles.contactDescription}>
              Our team is here to help. Schedule a consultation with one of our licensed psychologists to discuss how we can support your student's mental health and academic success.
            </p>
            <div className={styles.contactButtons}>
              <button className={styles.primaryButton}>
                Schedule Consultation
              </button>
              <button className={styles.secondaryButton}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PsychologistSupport;