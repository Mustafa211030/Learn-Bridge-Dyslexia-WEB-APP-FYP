import React, { useEffect } from 'react';
import styles from './Footer.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { color } from 'framer-motion';

const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-quad',
      offset: 120
    });
  }, []);

  return (
    <footer className={styles.footer}>
      <div 
        className={styles.footerTop}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className={styles.footerBrand}>
          <div 
            className={styles.logo}
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <img 
              src="/logo/logo_w.jpg"  // Updated path assuming logo is in public/logo directory
              alt="Dyslexia_logo" 
              className={styles.logoImage}
            />
          </div>
          <p 
            className={styles.tagline}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Built for innovation and success
          </p>
        </div>
      </div>

    
      <div 
        className={styles.footerBottom}
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <p>© 2024 – LearnBridge Dyslexia</p>
        <div className={styles.socialIcons}>
          <a 
            href="#" 
            data-aos="zoom-in" 
            data-aos-delay="550"
          >
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/linkedin.svg" alt="LinkedIn" />
          </a>
          <a 
            href="#" 
            data-aos="zoom-in" 
            data-aos-delay="600"
          >
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg" alt="Facebook" />
          </a>
          <a 
            href="#" 
            data-aos="zoom-in" 
            data-aos-delay="650"
          >
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/instagram.svg" alt="Instagram" />
          </a>
          <a 
            href="#" 
            data-aos="zoom-in" 
            data-aos-delay="700"
          >
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/tiktok.svg" alt="TikTok" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;