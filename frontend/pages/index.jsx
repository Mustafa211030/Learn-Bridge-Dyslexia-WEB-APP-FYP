// // // pages/index.js
// // 'use client';
// // import Navbar from '@/components/Navbar';
// // import Team from '@/components/Team';
// // import HeroSection from '@/components/HeroSection';
// // import GameCard from '@/components/GameCard';
// // import Footer from '@/components/Footer';
// // import AboutUsPage from '@/components/AboutUsPage';
// // import PsychologistSupport from '@/components/PsychologistSupport';

// // export default function Home() {
// //   return (
// //     <div>
// //       <Navbar />
// //       <HeroSection />
// //       <GameCard />
// //       <Team />
// //       <PsychologistSupport/>
// //       <AboutUsPage />
// //       <Footer />
// //     </div>
// //   );
// // }











// import Link from 'next/link';
// import Navbar from '../components/Navbar';
// import './Home.css';
// import HeroSection from '@/components/HeroSection';
// import GameCard from '@/components/GameCard';
// import Footer from '@/components/Footer';
// import Team from '@/components/Team';
// import PsychologistSupport from '@/components/PsychologistSupport';
// import AboutUsPage from '@/components/AboutUsPage';
// import UserDashboard from './UserDashboard';
// import UserGames from './UserGames';
// import UserProfile from './UserProfile';
// import PsychologistBlogs from './PsychologistBlogs';
// import PsychologistCredentials from './PsychologistCredentials';
// import PsychologistProgress from './PsychologistProgress';
// import PsychologistDashboard from './PsychologistDashBoard';

// export default function Home() {
//   return (
//     <div className="home-container">
//       <Navbar />
//       <Link href="/login" className="home-button login">
//             Login
//           </Link>
//           <Link href="/signup" className="home-button signup">
//             Sign Up
//          </Link>
//          <HeroSection />
// //       <GameCard />
// //       <Team />
// //       <PsychologistSupport/>
// //       <AboutUsPage />
//          <UserDashboard />
//          <UserGames />
//          <UserProfile />
//          <PsychologistBlogs />
//          <PsychologistCredentials />
//          <PsychologistProgress />
//          <PsychologistDashboard />
//         </div>
      
//   );
// }












// // pages/index.jsx - CORRECTED VERSION (Remove PsychologistDashboard)

// import HeroSection from '@/components/HeroSection';
// import GameCard from '@/components/GameCard';
// import Team from '@/components/Team';
// import PsychologistSupport from '@/components/PsychologistSupport';
// import AboutUsPage from '@/components/AboutUsPage';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import LoadingScreen from '../components/LoadingScreen';
// import { MathQuest } from '@/components/games/MathQuest';
// import PerformanceAnalytics from '@/components/analytics/PerformanceAnalytics';
// import PhonemeGame from '../components/games/PhonemeGame';
// import PerformanceDashboard from '../components/games/PerformanceDashboard';
// import phonemeGame from '../components/games/PhonemeGame';
// import performanceDashboard from '../components/games/PerformanceDashboard';
// import LetterTracingGame from '../components/games/LetterTracingGame';
// import LetterTracingPerformance from '../components/games/LetterTracingPerformance';
// import letterTracingGame from '../components/games/LetterTracingGame';
// import letterTracingPerformance from '../components/games/LetterTracingPerformance';
// import EbookHome from '@/components/ebook/EbookHome';
// import ebookHome from '@/components/ebook/EbookHome'; 
// import AboutPage from '../components/AboutPage';
// import EnhancedDyslexiaChatbot from '@/components/chatbot/EnhancedDyslexiaChatbot';

// export default function Home() {
//   return (
//     <div className="home-container">
//       <LoadingScreen />
//       <Navbar />
//       <HeroSection />
//       <AboutPage />
//       <GameCard />
//       <Team />
//       <PsychologistSupport />
//       <AboutUsPage />
//       <MathQuest />
//       <PerformanceAnalytics />
//       <PhonemeGame />
//       <PerformanceDashboard />
//       <LetterTracingGame /> 
//       <LetterTracingPerformance /> 
//       <EbookHome /> 
//       <EnhancedDyslexiaChatbot />
//       <Footer />
//     </div>
//   );
// }

























// pages/index.jsx
// LearnBridge Dyslexia Platform - Home Page
// Clean, error-free version with proper component structure

// Layout Components
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Page Sections
import HeroSection from '@/components/HeroSection';
import AboutPage from '@/components/AboutPage';
import GameCard from '@/components/GameCard';
import Team from '@/components/Team';
import PsychologistSupport from '@/components/PsychologistSupport';
import AboutUsPage from '@/components/AboutUsPage';
import LoadingScreen from '../components/LoadingScreen';
import EnhancedDyslexiaChatbot from '@/components/chatbot/EnhancedDyslexiaChatbot';

export default function Home() {
  return (
    <div className="home-container">
      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <LoadingScreen />
        <HeroSection />
        <AboutPage />
        <GameCard />
        <Team />
        <PsychologistSupport />
        <AboutUsPage />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chatbot - Always visible, positioned fixed */}
      <EnhancedDyslexiaChatbot />
    </div>
  );
}