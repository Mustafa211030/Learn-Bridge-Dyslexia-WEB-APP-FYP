import React, { useState, useEffect } from 'react';
import styles from './GameCard.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaPlay, FaHeart, FaStar, FaDownload, FaUsers, FaBrain, FaClock, FaGamepad, FaTimes, FaBook, FaLanguage, FaGraduationCap, FaChartLine, FaGamepad as FaGamepadSolid } from 'react-icons/fa';

const GameCard = () => {
  const [games, setGames] = useState([
    {
      id: 1,
      title: "Math Quest Adventure",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Embark on a mathematical journey through enchanted lands. Solve puzzles, defeat monsters with math equations, and collect treasures while mastering addition, subtraction, and number recognition.",
      longDescription: "Math Quest Adventure is an immersive game designed specifically for dyslexic learners. It uses visual-spatial learning techniques to make math concepts more accessible. The game features adaptive difficulty, voice-guided instructions, and multi-sensory feedback to reinforce learning.",
      isLiked: false,
      rating: 4,
      difficulty: "Beginner",
      players: "Single Player",
      skills: ["Math", "Problem Solving", "Logic"],
      duration: "15-20 min",
      category: "Educational",
      learningObjectives: [
        "Master basic arithmetic operations",
        "Develop number sense and recognition",
        "Improve problem-solving skills",
        "Build confidence in mathematical thinking"
      ],
      features: [
        "Voice-guided instructions",
        "Visual number representations",
        "Adaptive difficulty levels",
        "Progress tracking",
        "Reward system"
      ],
      ageGroup: "6-10 years",
      specialFeatures: "Color-coded numbers, Audio feedback for correct answers"
    },
    {
      id: 2,
      title: "Letter Tracing Galaxy",
      image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Navigate through space while tracing letters and shapes. Improve handwriting, letter recognition, and muscle memory with interactive cosmic feedback and visual rewards.",
      longDescription: "Letter Tracing Galaxy uses space-themed visuals to make letter formation engaging. The game provides real-time feedback on stroke order and shape, helping dyslexic learners develop proper writing habits through repetition and positive reinforcement.",
      isLiked: true,
      rating: 5,
      difficulty: "Beginner",
      players: "Single Player",
      skills: ["Writing", "Motor Skills", "Recognition"],
      duration: "10-15 min",
      category: "Motor Skills",
      learningObjectives: [
        "Improve letter recognition",
        "Develop fine motor skills",
        "Master proper stroke order",
        "Build muscle memory"
      ],
      features: [
        "Real-time stroke feedback",
        "Progressive difficulty",
        "Visual and audio rewards",
        "Customizable tracing paths",
        "Progress reports"
      ],
      ageGroup: "4-8 years",
      specialFeatures: "Haptic feedback, Letter size adjustment"
    },
    {
      id: 3,
      title: "Phoneme Explorer",
      image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Dive into an underwater world where sounds become sea creatures. Match phonemes, create words, and strengthen phonological awareness through immersive auditory challenges.",
      longDescription: "Phoneme Explorer transforms phonological training into an underwater adventure. Each sound is represented by a unique sea creature, helping dyslexic learners visualize and remember phoneme-grapheme relationships in a memorable, engaging way.",
      isLiked: false,
      rating: 4,
      difficulty: "Intermediate",
      players: "Multiplayer",
      skills: ["Phonics", "Auditory", "Language"],
      duration: "20-25 min",
      category: "Language",
      learningObjectives: [
        "Identify individual phonemes",
        "Match sounds to letters",
        "Blend sounds into words",
        "Segment words into sounds"
      ],
      features: [
        "Multi-sensory approach",
        "Voice recognition",
        "Collaborative gameplay",
        "Phoneme visualization",
        "Adaptive learning paths"
      ],
      ageGroup: "7-12 years",
      specialFeatures: "Multiplayer mode, Voice-controlled interactions"
    },
    {
      id: 4,
      title: "Word Builder Factory",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
      description: "Build words on an assembly line of letters. Drag syllables, create vocabulary, and watch words come to life in this dynamic factory-themed spelling adventure.",
      longDescription: "Word Builder Factory uses industrial metaphors to make spelling engaging. Letters and syllables move along conveyor belts, encouraging players to build words systematically while understanding syllable structure and word formation patterns.",
      isLiked: false,
      rating: 4,
      difficulty: "Intermediate",
      players: "Single Player",
      skills: ["Spelling", "Vocabulary", "Reading"],
      duration: "15-20 min",
      category: "Language",
      learningObjectives: [
        "Improve spelling accuracy",
        "Expand vocabulary",
        "Understand syllable structure",
        "Recognize word families"
      ],
      features: [
        "Word family grouping",
        "Syllable segmentation",
        "Contextual vocabulary",
        "Factory-themed animations",
        "Performance analytics"
      ],
      ageGroup: "8-14 years",
      specialFeatures: "Contextual word usage, Multi-syllable word builder"
    },
    {
      id: 5,
      title: "Memory Matrix",
      image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Train your memory with pattern recognition games. Match cards, remember sequences, and solve puzzles to boost cognitive skills and concentration.",
      longDescription: "Memory Matrix is designed to improve working memory and executive function skills. The game uses color-coded patterns and spatial memory tasks that are particularly effective for dyslexic learners who often have strong visual-spatial abilities.",
      isLiked: true,
      rating: 5,
      difficulty: "Advanced",
      players: "Multiplayer",
      skills: ["Memory", "Focus", "Patterns"],
      duration: "10-15 min",
      category: "Cognitive",
      learningObjectives: [
        "Enhance working memory",
        "Improve concentration",
        "Develop pattern recognition",
        "Strengthen visual-spatial skills"
      ],
      features: [
        "Progressive memory challenges",
        "Visual pattern recognition",
        "Multiplayer competition",
        "Brain training metrics",
        "Cognitive load adjustment"
      ],
      ageGroup: "10+ years",
      specialFeatures: "Competitive multiplayer, Advanced pattern recognition"
    },
    {
      id: 6,
      title: "Reading Race",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Speed through reading challenges in a race against time. Improve reading fluency, comprehension, and speed with interactive stories and timed exercises.",
      longDescription: "Reading Race uses gamified reading exercises to build fluency. The game adapts text complexity based on performance, providing just-right challenges that build confidence and reading stamina without overwhelming the learner.",
      isLiked: false,
      rating: 4,
      difficulty: "Intermediate",
      players: "Single Player",
      skills: ["Reading", "Speed", "Comprehension"],
      duration: "20-25 min",
      category: "Reading",
      learningObjectives: [
        "Increase reading fluency",
        "Improve comprehension",
        "Build reading stamina",
        "Develop speed reading skills"
      ],
      features: [
        "Adaptive text complexity",
        "Timed reading exercises",
        "Comprehension questions",
        "Fluency tracking",
        "Progress visualization"
      ],
      ageGroup: "8-16 years",
      specialFeatures: "Dyslexia-friendly fonts, Text-to-speech support"
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Educational', 'Language', 'Motor Skills', 'Cognitive', 'Reading'];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100
    });
  }, []);

  const toggleLike = (id) => {
    setGames(games.map(game => 
      game.id === id ? {...game, isLiked: !game.isLiked} : game
    ));
  };

  const rateGame = (id, rating) => {
    setGames(games.map(game => 
      game.id === id ? {...game, rating} : game
    ));
  };

  const openGameDetails = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGameDetails = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
    document.body.style.overflow = 'unset';
  };

  const filteredGames = activeFilter === 'All' 
    ? games 
    : games.filter(game => game.category === activeFilter);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Educational': return <FaGraduationCap />;
      case 'Language': return <FaLanguage />;
      case 'Motor Skills': return <FaGamepadSolid />;
      case 'Cognitive': return <FaBrain />;
      case 'Reading': return <FaBook />;
      default: return <FaGamepad />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent} data-aos="fade-up">
            <div className={styles.heroHeader}>
              <div className={styles.heroIconContainer} data-aos="zoom-in" data-aos-delay="200">
                <FaGamepad className={styles.heroIcon} />
              </div>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle} data-aos="fade-up" data-aos-delay="300">
                  Learning <span className={styles.gradientText}>Games</span>
                </h1>
                <p className={styles.heroSubtitle} data-aos="fade-up" data-aos-delay="400">
                  Interactive games designed by experts to support dyslexic learners through play-based education
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35,6.36,119.13-6.25C947.34,22.87,1081.92,6.69,1200,41.8V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.filterWrapper} data-aos="fade-up">
            <div className={styles.filterHeader}>
              <FaBrain className={styles.filterIcon} />
              <h3 className={styles.filterTitle}>Browse by Category</h3>
            </div>
            <div className={styles.filterGrid}>
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`${styles.filterButton} ${activeFilter === category ? styles.active : ''}`}
                  onClick={() => setActiveFilter(category)}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className={styles.gamesSection}>
        <div className={styles.container}>
          <div className={styles.gamesGrid}>
            {filteredGames.map((game, index) => (
              <div 
                key={game.id}
                className={styles.gameCard}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Game Image with Overlay */}
                <div className={styles.imageContainer}>
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className={styles.gameImage}
                  />
                  <div className={styles.imageOverlay}></div>
                  <div className={styles.gameBadge}>
                    <span className={styles.badgeText}>{game.category}</span>
                  </div>
                  <div className={styles.difficultyBadge}>
                    <span className={styles.difficultyText}>{game.difficulty}</span>
                  </div>
                </div>

                {/* Game Content */}
                <div className={styles.gameContent}>
                  <div className={styles.gameHeader}>
                    <h3 className={styles.gameTitle}>{game.title}</h3>
                    <button 
                      className={`${styles.likeButton} ${game.isLiked ? styles.liked : ''}`}
                      onClick={() => toggleLike(game.id)}
                      aria-label={game.isLiked ? "Remove from favorites" : "Add to favorites"}
                    >
                      <FaHeart />
                    </button>
                  </div>

                  <p className={styles.gameDescription}>{game.description}</p>

                  {/* Game Stats */}
                  <div className={styles.gameStats}>
                    <div className={styles.stat}>
                      <FaUsers className={styles.statIcon} />
                      <span className={styles.statLabel}>{game.players}</span>
                    </div>
                    <div className={styles.stat}>
                      <FaClock className={styles.statIcon} />
                      <span className={styles.statLabel}>{game.duration}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className={styles.skillsContainer}>
                    {game.skills.map((skill, idx) => (
                      <span key={idx} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>

                  {/* Rating and Actions */}
                  <div className={styles.gameFooter}>
                    <div className={styles.ratingSection}>
                      <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            className={`${styles.starButton} ${star <= game.rating ? styles.active : ''}`}
                            onClick={() => rateGame(game.id, star)}
                            aria-label={`Rate ${star} stars`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                      <span className={styles.ratingText}>{game.rating}.0</span>
                    </div>
                    
                    <div className={styles.actionSection}>
                      <button className={styles.playButton}>
                        <FaPlay />
                        <span>Play Now</span>
                      </button>
                      <button 
                        className={styles.detailsButton}
                        onClick={() => openGameDetails(game)}
                      >
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Glow */}
                <div className={styles.cardGlow}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard} data-aos="zoom-in">
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Start Learning?</h2>
              <p className={styles.ctaText}>
                Access all premium games and track your child's progress with our comprehensive dashboard
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.ctaButtonPrimary}>
                  <FaDownload />
                  <span>Get Started for Free</span>
                </button>
                <button className={styles.ctaButtonSecondary}>
                  <span>View All Games</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Details Modal */}
      {isModalOpen && selectedGame && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <span className={styles.modalCategoryIcon}>
                  {getCategoryIcon(selectedGame.category)}
                </span>
                {selectedGame.title}
              </h2>
              <button 
                className={styles.modalCloseButton}
                onClick={closeGameDetails}
                aria-label="Close details"
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalImageContainer}>
                <img 
                  src={selectedGame.image} 
                  alt={selectedGame.title}
                  className={styles.modalImage}
                />
                <div className={styles.modalBadges}>
                  <span className={styles.modalBadge}>{selectedGame.category}</span>
                  <span className={styles.modalBadge}>{selectedGame.difficulty}</span>
                  <span className={styles.modalBadge}>{selectedGame.ageGroup}</span>
                </div>
              </div>

              <div className={styles.modalInfo}>
                <div className={styles.modalStats}>
                  <div className={styles.modalStat}>
                    <FaUsers />
                    <span>{selectedGame.players}</span>
                  </div>
                  <div className={styles.modalStat}>
                    <FaClock />
                    <span>{selectedGame.duration}</span>
                  </div>
                  <div className={styles.modalStat}>
                    <FaStar />
                    <span>{selectedGame.rating}.0 Rating</span>
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Game Description</h3>
                  <p className={styles.modalDescription}>{selectedGame.longDescription}</p>
                </div>

                <div className={styles.modalColumns}>
                  <div className={styles.modalColumn}>
                    <h3 className={styles.modalSectionTitle}>
                      <FaGraduationCap />
                      Learning Objectives
                    </h3>
                    <ul className={styles.modalList}>
                      {selectedGame.learningObjectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.modalColumn}>
                    <h3 className={styles.modalSectionTitle}>
                      <FaChartLine />
                      Key Features
                    </h3>
                    <ul className={styles.modalList}>
                      {selectedGame.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Special Features for Dyslexic Learners</h3>
                  <div className={styles.specialFeatures}>
                    <span className={styles.featureTag}>{selectedGame.specialFeatures}</span>
                  </div>
                </div>

                <div className={styles.modalSkills}>
                  <h3 className={styles.modalSectionTitle}>Skills Developed</h3>
                  <div className={styles.modalSkillTags}>
                    {selectedGame.skills.map((skill, index) => (
                      <span key={index} className={styles.modalSkillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalRating}>
                <div className={styles.modalStars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar 
                      key={star}
                      className={`${styles.modalStar} ${star <= selectedGame.rating ? styles.active : ''}`}
                    />
                  ))}
                </div>
                <span className={styles.modalRatingText}>Rate this game:</span>
                <div className={styles.modalRatingButtons}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`${styles.modalRateButton} ${star <= selectedGame.rating ? styles.active : ''}`}
                      onClick={() => rateGame(selectedGame.id, star)}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.modalActions}>
                <button 
                  className={styles.modalLikeButton}
                  onClick={() => toggleLike(selectedGame.id)}
                >
                  <FaHeart className={selectedGame.isLiked ? styles.liked : ''} />
                  {selectedGame.isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button className={styles.modalPlayButton}>
                  <FaPlay />
                  Play Game Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;