import React, { useEffect } from 'react';
import styles from './Team.module.css';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Team = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Talha Hassan",
      role: "Game Developer",
      image: "/Team/talha.jpeg",
      expertise: ["Next", "MERN", "Game Design"],
      social: {
        twitter: "#",
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      id: 2,
      name: "Mustafa Saeed",
      role: "Web Developer AI/ML",
      image: "/Team/mustafa.jpeg",
      expertise: ["Next", "Python", "TensorFlow"],
      social: {
        twitter: "#",
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      id: 3,
      name: "Sara Ghaury",
      role: "Frontend Developer",
      image: "/Team/ghoury.jpeg",
      expertise: ["React", "TypeScript", "UI/UX"],
      social: {
        twitter: "#",
        facebook: "#",
        instagram: "#",
        linkedin: "#",
        github: "#"
      }
    }
  ];

  return (
    <section id="team" className={styles.team}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header} data-aos="fade-down">
          <div className={styles.titleWrapper}>
            <h1 className={styles.titleMain}>MEET OUR TEAM</h1>
            <div className={styles.titleSubtitle}>
              <span className={styles.subtitleText}>CREATIVE MINDS</span>
              <div className={styles.titleLine}></div>
            </div>
          </div>
          
          <div className={styles.description} data-aos="fade-up" data-aos-delay="100">
            <p className={styles.descText}>
              A team of passionate, goal-oriented innovators who came together 
              to transform ideas into reality with expertise and enthusiasm.
            </p>
          </div>
        </div>

        {/* Team Cards */}
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div 
              key={member.id} 
              className={styles.card}
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              {/* Image Container */}
              <div className={styles.imageWrapper}>
                <div className={styles.imageOverlay}></div>
                <img 
                  src={member.image} 
                  alt={member.name}
                  className={styles.memberImage}
                  loading="lazy"
                />
                <div className={styles.imageGlow}></div>
                
                {/* Expertise Tags */}
                <div className={styles.expertiseTags}>
                  {member.expertise.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className={styles.tag}
                      data-aos="fade-up"
                      data-aos-delay={400 + (skillIndex * 100)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Member Info */}
              <div className={styles.memberInfo}>
                <div className={styles.nameRole}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <div className={styles.roleContainer}>
                    <span className={styles.memberRole}>{member.role}</span>
                    <div className={styles.roleLine}></div>
                  </div>
                </div>

                {/* Social Links */}
                <div className={styles.socialLinks}>
                  <div className={styles.socialContainer}>
                    <a 
                      href={member.social.twitter} 
                      className={styles.socialLink}
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <FaTwitter className={styles.socialIcon} />
                    </a>
                    <a 
                      href={member.social.facebook} 
                      className={styles.socialLink}
                      aria-label={`${member.name}'s Facebook`}
                    >
                      <FaFacebook className={styles.socialIcon} />
                    </a>
                    <a 
                      href={member.social.instagram} 
                      className={styles.socialLink}
                      aria-label={`${member.name}'s Instagram`}
                    >
                      <FaInstagram className={styles.socialIcon} />
                    </a>
                    <a 
                      href={member.social.linkedin} 
                      className={styles.socialLink}
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <FaLinkedin className={styles.socialIcon} />
                    </a>
                    <a 
                      href={member.social.github} 
                      className={styles.socialLink}
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <FaGithub className={styles.socialIcon} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className={styles.cardBorder}></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={styles.stats} data-aos="fade-up" data-aos-delay="500">
          <div className={styles.statItem}>
            <span className={styles.statNumber}>3+</span>
            <span className={styles.statLabel}>Experts</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>15+</span>
            <span className={styles.statLabel}>Skills</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Dedication</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;