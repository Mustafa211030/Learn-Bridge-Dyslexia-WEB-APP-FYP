import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './GamePage.module.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FaArrowLeft, FaPlay, FaStar, FaCalendarAlt, FaGamepad, FaGraduationCap, FaLanguage, FaBrain, FaHandPointer, FaBook, FaUsers, FaClock, FaDownload } from 'react-icons/fa';

const GamePage = () => {
    const router = useRouter();
    const modalRef = useRef(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Game details with comprehensive information
    const games = [
        {
            id: 1,
            title: "Math Quest Adventure",
            subtitle: "Adventures in Numbers",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Embark on a mathematical journey through enchanted lands. Solve puzzles, defeat monsters with math equations, and collect treasures while mastering addition, subtraction, and number recognition.",
            longDescription: "Math Quest Adventure is an immersive game designed specifically for dyslexic learners. It uses visual-spatial learning techniques to make math concepts more accessible. The game features adaptive difficulty, voice-guided instructions, and multi-sensory feedback to reinforce learning.",
            rating: 4.5,
            releaseDate: "May 19, 2025",
            category: "Educational",
            playerCount: "Single Player",
            duration: "15-20 min",
            ageGroup: "6-10 years",
            skills: ["Mathematics", "Problem Solving", "Logical Thinking", "Number Recognition"],
            features: [
                "Voice-guided instructions",
                "Visual number representations",
                "Adaptive difficulty levels",
                "Progress tracking system",
                "Reward-based motivation"
            ],
            learningObjectives: [
                "Master basic arithmetic operations",
                "Develop number sense and recognition",
                "Improve problem-solving skills",
                "Build confidence in mathematical thinking"
            ],
            developer: "LearnBridge Interactive",
            publisher: "LearnBridge EdTech",
            platforms: "Web, Android (Tablet Preferred)",
            gameModes: "Single-player (Story + Practice Mode)"
        },
        {
            id: 2,
            title: "Letter Tracing Galaxy",
            subtitle: "Shapes & Letters Mastery",
            image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Navigate through space while tracing letters and shapes. Improve handwriting, letter recognition, and muscle memory with interactive cosmic feedback and visual rewards.",
            longDescription: "Letter Tracing Galaxy uses space-themed visuals to make letter formation engaging. The game provides real-time feedback on stroke order and shape, helping dyslexic learners develop proper writing habits through repetition and positive reinforcement.",
            rating: 4.8,
            releaseDate: "April 15, 2025",
            category: "Motor Skills",
            playerCount: "Single Player",
            duration: "10-15 min",
            ageGroup: "4-8 years",
            skills: ["Writing", "Fine Motor Skills", "Letter Recognition", "Handwriting"],
            features: [
                "Real-time stroke feedback",
                "Progressive difficulty levels",
                "Visual and audio rewards",
                "Customizable tracing paths",
                "Progress analytics"
            ],
            learningObjectives: [
                "Improve letter recognition",
                "Develop fine motor skills",
                "Master proper stroke order",
                "Build muscle memory for writing"
            ],
            developer: "LearnBridge Interactive",
            publisher: "LearnBridge EdTech",
            platforms: "Web, Android Tablets",
            gameModes: "Single-player (Practice & Free Tracing Mode)"
        },
        {
            id: 3,
            title: "Phoneme Explorer",
            subtitle: "Sound It Out!",
            image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Dive into an underwater world where sounds become sea creatures. Match phonemes, create words, and strengthen phonological awareness through immersive auditory challenges.",
            longDescription: "Phoneme Explorer transforms phonological training into an underwater adventure. Each sound is represented by a unique sea creature, helping dyslexic learners visualize and remember phoneme-grapheme relationships in a memorable, engaging way.",
            rating: 4.3,
            releaseDate: "June 30, 2025",
            category: "Language",
            playerCount: "Multiplayer",
            duration: "20-25 min",
            ageGroup: "7-12 years",
            skills: ["Phonics", "Auditory Processing", "Language Development", "Sound Recognition"],
            features: [
                "Multi-sensory approach",
                "Voice recognition technology",
                "Collaborative gameplay",
                "Phoneme visualization",
                "Adaptive learning paths"
            ],
            learningObjectives: [
                "Identify individual phonemes",
                "Match sounds to letters",
                "Blend sounds into words",
                "Segment words into sounds"
            ],
            developer: "LearnBridge Interactive",
            publisher: "LearnBridge EdTech",
            platforms: "Web, Android Tablets",
            gameModes: "Multiplayer & Single-player modes"
        },
        {
            id: 4,
            title: "Word Builder Factory",
            subtitle: "Build the Word!",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
            description: "Build words on an assembly line of letters. Drag syllables, create vocabulary, and watch words come to life in this dynamic factory-themed spelling adventure.",
            longDescription: "Word Builder Factory uses industrial metaphors to make spelling engaging. Letters and syllables move along conveyor belts, encouraging players to build words systematically while understanding syllable structure and word formation patterns.",
            rating: 4.6,
            releaseDate: "March 22, 2025",
            category: "Language",
            playerCount: "Single Player",
            duration: "15-20 min",
            ageGroup: "8-14 years",
            skills: ["Spelling", "Vocabulary", "Reading Comprehension", "Word Formation"],
            features: [
                "Word family grouping",
                "Syllable segmentation",
                "Contextual vocabulary",
                "Factory-themed animations",
                "Performance analytics"
            ],
            learningObjectives: [
                "Improve spelling accuracy",
                "Expand vocabulary",
                "Understand syllable structure",
                "Recognize word families"
            ],
            developer: "LearnBridge Interactive",
            publisher: "LearnBridge EdTech",
            platforms: "Web, Android Tablets",
            gameModes: "Single-player (Practice, Puzzle, Challenge Modes)"
        }
    ];

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
            offset: 100
        });
    }, []);

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

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Educational': return <FaGraduationCap />;
            case 'Language': return <FaLanguage />;
            case 'Motor Skills': return <FaHandPointer />;
            case 'Cognitive': return <FaBrain />;
            case 'Reading': return <FaBook />;
            default: return <FaGamepad />;
        }
    };

    const getCategoryColor = (category) => {
        switch(category) {
            case 'Educational': return '#3b82f6';
            case 'Language': return '#10b981';
            case 'Motor Skills': return '#f59e0b';
            case 'Cognitive': return '#8b5cf6';
            case 'Reading': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Back Navigation Button */}
            <button 
                onClick={() => router.back()}
                className={styles.backButton}
                data-aos="fade-right"
            >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
            </button>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent} data-aos="fade-up">
                    <h1 className={styles.heroTitle}>
                        <span className={styles.heroTitleMain}>Learning</span>
                        <span className={styles.heroTitleGradient}>Games</span>
                    </h1>
                    <p className={styles.heroSubtitle} data-aos="fade-up" data-aos-delay="200">
                        Interactive educational games designed to support dyslexic learners through engaging, multi-sensory experiences
                    </p>
                </div>
                <div className={styles.heroWave}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" opacity=".25"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35,6.36,119.13-6.25C947.34,22.87,1081.92,6.69,1200,41.8V0Z" opacity=".5"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
                    </svg>
                </div>
            </section>

            {/* Games Grid Section */}
            <section className={styles.gamesSection}>
                <div className={styles.container}>
                    <div className={styles.gamesGrid}>
                        {games.map((game, index) => (
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
                                    <div 
                                        className={styles.categoryBadge}
                                        style={{ backgroundColor: getCategoryColor(game.category) }}
                                    >
                                        {getCategoryIcon(game.category)}
                                        <span>{game.category}</span>
                                    </div>
                                    <div className={styles.ratingBadge}>
                                        <FaStar />
                                        <span>{game.rating}</span>
                                    </div>
                                </div>

                                {/* Game Content */}
                                <div className={styles.gameContent}>
                                    <div className={styles.gameHeader}>
                                        <h3 className={styles.gameTitle}>{game.title}</h3>
                                        <div className={styles.gameSubtitle}>{game.subtitle}</div>
                                    </div>

                                    <p className={styles.gameDescription}>{game.description}</p>

                                    {/* Game Stats */}
                                    <div className={styles.gameStats}>
                                        <div className={styles.gameStat}>
                                            <FaCalendarAlt />
                                            <span>{game.releaseDate}</span>
                                        </div>
                                        <div className={styles.gameStat}>
                                            <FaUsers />
                                            <span>{game.playerCount}</span>
                                        </div>
                                        <div className={styles.gameStat}>
                                            <FaClock />
                                            <span>{game.duration}</span>
                                        </div>
                                    </div>

                                    {/* Skills Tags */}
                                    <div className={styles.skillsContainer}>
                                        {game.skills.slice(0, 3).map((skill, idx) => (
                                            <span 
                                                key={idx} 
                                                className={styles.skillTag}
                                                style={{ borderColor: getCategoryColor(game.category) }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {game.skills.length > 3 && (
                                            <span className={styles.moreSkills}>+{game.skills.length - 3} more</span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className={styles.actionButtons}>
                                        <button 
                                            className={styles.playButton}
                                            onClick={() => alert(`Launching ${game.title}...`)}
                                        >
                                            <FaPlay />
                                            <span>Play Now</span>
                                        </button>
                                        <button 
                                            className={styles.detailsButton}
                                            onClick={() => openGameDetails(game)}
                                            style={{ color: getCategoryColor(game.category) }}
                                        >
                                            <span>View Details</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div 
                                    className={styles.cardGlow}
                                    style={{ background: `radial-gradient(circle at center, ${getCategoryColor(game.category)}20, transparent 70%)` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.ctaCard} data-aos="zoom-in">
                        <h2 className={styles.ctaTitle}>Discover More Learning Games</h2>
                        <p className={styles.ctaText}>
                            Access our full library of educational games designed specifically for dyslexic learners
                        </p>
                        <div className={styles.ctaButtons}>
                            <button className={styles.ctaButtonPrimary}>
                                <FaDownload />
                                <span>Download Full Catalog</span>
                            </button>
                            <button className={styles.ctaButtonSecondary}>
                                <span>Browse All Games</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Game Details Modal */}
            {isModalOpen && selectedGame && (
                <div className={styles.modalOverlay} onClick={closeGameDetails}>
                    <div 
                        className={styles.modalContainer} 
                        onClick={(e) => e.stopPropagation()}
                        data-aos="zoom-in"
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleContainer}>
                                <div className={styles.modalCategoryIcon} style={{ color: getCategoryColor(selectedGame.category) }}>
                                    {getCategoryIcon(selectedGame.category)}
                                </div>
                                <div>
                                    <h2 className={styles.modalTitle}>{selectedGame.title}</h2>
                                    <div className={styles.modalSubtitle}>{selectedGame.subtitle}</div>
                                </div>
                            </div>
                            <button 
                                className={styles.modalCloseButton}
                                onClick={closeGameDetails}
                                aria-label="Close details"
                            >
                                &times;
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* Game Image */}
                            <div className={styles.modalImageContainer}>
                                <img 
                                    src={selectedGame.image} 
                                    alt={selectedGame.title}
                                    className={styles.modalImage}
                                />
                                <div className={styles.modalImageOverlay}></div>
                            </div>

                            {/* Game Details */}
                            <div className={styles.modalDetails}>
                                <div className={styles.modalStats}>
                                    <div className={styles.modalStat}>
                                        <FaCalendarAlt />
                                        <div>
                                            <span className={styles.statLabel}>Released</span>
                                            <span className={styles.statValue}>{selectedGame.releaseDate}</span>
                                        </div>
                                    </div>
                                    <div className={styles.modalStat}>
                                        <FaUsers />
                                        <div>
                                            <span className={styles.statLabel}>Players</span>
                                            <span className={styles.statValue}>{selectedGame.playerCount}</span>
                                        </div>
                                    </div>
                                    <div className={styles.modalStat}>
                                        <FaClock />
                                        <div>
                                            <span className={styles.statLabel}>Duration</span>
                                            <span className={styles.statValue}>{selectedGame.duration}</span>
                                        </div>
                                    </div>
                                    <div className={styles.modalStat}>
                                        <FaStar />
                                        <div>
                                            <span className={styles.statLabel}>Rating</span>
                                            <span className={styles.statValue}>{selectedGame.rating}/5.0</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Game Description */}
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>About This Game</h3>
                                    <p className={styles.modalDescription}>{selectedGame.longDescription}</p>
                                </div>

                                {/* Learning Objectives & Features */}
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
                                            <FaGamepad />
                                            Key Features
                                        </h3>
                                        <ul className={styles.modalList}>
                                            {selectedGame.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Game Info */}
                                <div className={styles.modalInfo}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Developer:</span>
                                        <span className={styles.infoValue}>{selectedGame.developer}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Publisher:</span>
                                        <span className={styles.infoValue}>{selectedGame.publisher}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Platforms:</span>
                                        <span className={styles.infoValue}>{selectedGame.platforms}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Game Modes:</span>
                                        <span className={styles.infoValue}>{selectedGame.gameModes}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Age Group:</span>
                                        <span className={styles.infoValue}>{selectedGame.ageGroup}</span>
                                    </div>
                                </div>

                                {/* Skills Developed */}
                                <div className={styles.modalSkills}>
                                    <h3 className={styles.modalSectionTitle}>Skills Developed</h3>
                                    <div className={styles.modalSkillTags}>
                                        {selectedGame.skills.map((skill, index) => (
                                            <span 
                                                key={index} 
                                                className={styles.modalSkillTag}
                                                style={{ backgroundColor: `${getCategoryColor(selectedGame.category)}20`, color: getCategoryColor(selectedGame.category) }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer with Actions */}
                        <div className={styles.modalFooter}>
                            <div className={styles.modalRating}>
                                <div className={styles.ratingDisplay}>
                                    <FaStar />
                                    <span className={styles.ratingValue}>{selectedGame.rating}</span>
                                    <span className={styles.ratingText}>out of 5</span>
                                </div>
                                <div className={styles.ratingStars}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <FaStar 
                                            key={star}
                                            className={`${styles.ratingStar} ${star <= Math.floor(selectedGame.rating) ? styles.active : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button 
                                    className={styles.modalPlayButton}
                                    onClick={() => {
                                        closeGameDetails();
                                        alert(`Launching ${selectedGame.title}...`);
                                    }}
                                >
                                    <FaPlay />
                                    <span>Play Game</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamePage;