// // pages/login.jsx - Professional Login Page
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import Head from 'next/head';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import styles from '../styles/Auth.module.css';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   const { login, isAuthenticated, loading, error, clearError, user } = useAuth();
//   const router = useRouter();

//   const getRedirectPath = (role) => {
//     if (!role) return '/';
//     const normalizedRole = role.toLowerCase();
//     const roleMap = {
//       'admin': '/admin/dashboard',
//       'psychologist': '/psychologist/dashboard',
//       'student': '/student/dashboard'
//     };
//     return roleMap[normalizedRole] || '/';
//   };

//   useEffect(() => {
//     if (isAuthenticated && user?.role && !loading && !isSubmitting) {
//       const redirectPath = getRedirectPath(user.role);
//       router.replace(redirectPath).catch((err) => {
//         console.error('Navigation failed:', err);
//         if (typeof window !== 'undefined') {
//           window.location.href = redirectPath;
//         }
//       });
//     }
//   }, [isAuthenticated, user?.role, loading, isSubmitting, router]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       clearError();
//     }
//   }, [error, clearError]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);

//     try {
//       const result = await login(formData.email, formData.password);
      
//       if (result?.success) {
//         const userName = result.data?.user?.firstName || 
//                         result.data?.firstName || 
//                         result.user?.firstName || 
//                         'User';
        
//         toast.success(`Welcome back, ${userName}!`);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error(error.message || 'An error occurred during login.');
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>Sign In - LearnBridge</title>
//         <meta name="description" content="Sign in to your LearnBridge account" />
//       </Head>

//       <div className={styles.authContainer}>
//         {/* Animated Background */}
//         <div className={styles.backgroundAnimation}>
//           <div className={styles.blob1}></div>
//           <div className={styles.blob2}></div>
//           <div className={styles.blob3}></div>
//         </div>

//         {/* Left Side - Branding */}
//         <div className={styles.brandingSide}>
//           <div className={styles.brandingContent}>
//             <div className={styles.logo}>
//               <div className={styles.logoIcon}>
//                 <span>LB</span>
//               </div>
//               <h1 className={styles.logoText}>LearnBridge</h1>
//             </div>
            
//             <h2 className={styles.brandingTitle}>
//               Welcome Back to Your Learning Journey
//             </h2>
            
//             <p className={styles.brandingSubtitle}>
//               Continue your path to better mental wellness and cognitive development with personalized learning experiences.
//             </p>

//             <div className={styles.features}>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>✓</div>
//                 <span>Personalized Learning Experience</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>✓</div>
//                 <span>Track Your Progress</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>✓</div>
//                 <span>Expert Support Available</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className={styles.formSide}>
//           <div className={styles.formContainer}>
//             <div className={styles.formHeader}>
//               <h2 className={styles.formTitle}>Sign In</h2>
//               <p className={styles.formSubtitle}>Enter your credentials to access your account</p>
//             </div>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               {/* Email Field */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="email" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                   </svg>
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={loading || isSubmitting}
//                 />
//                 {errors.email && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="password" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                   Password
//                 </label>
//                 <div className={styles.passwordWrapper}>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     required
//                     className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   <button
//                     type="button"
//                     className={styles.passwordToggle}
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     ) : (
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className={styles.formOptions}>
//                 <label className={styles.checkbox}>
//                   <input type="checkbox" />
//                   <span>Remember me</span>
//                 </label>
//                 <Link href="/forgot-password" className={styles.forgotLink}>
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading || isSubmitting}
//                 className={styles.submitButton}
//               >
//                 {loading || isSubmitting ? (
//                   <>
//                     <span className={styles.spinner}></span>
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     Sign In
//                     <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Sign Up Link */}
//             <div className={styles.formFooter}>
//               <p>
//                 Don't have an account?{' '}
//                 <Link href="/signup" className={styles.signupLink}>
//                   Create one now
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }






































// // pages/login.jsx
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import Head from 'next/head';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import styles from '../styles/Auth.module.css';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   const { login, isAuthenticated, loading, error, clearError, user } = useAuth();
//   const router = useRouter();

//   const getRedirectPath = (role) => {
//     if (!role) return '/';
//     const normalizedRole = role.toLowerCase();
//     const roleMap = {
//       'admin': '/admin/dashboard',
//       'psychologist': '/psychologist/dashboard',
//       'student': '/student/dashboard'
//     };
//     return roleMap[normalizedRole] || '/';
//   };

//   useEffect(() => {
//     if (isAuthenticated && user?.role && !loading && !isSubmitting) {
//       const redirectPath = getRedirectPath(user.role);
//       router.replace(redirectPath).catch((err) => {
//         console.error('Navigation failed:', err);
//         if (typeof window !== 'undefined') {
//           window.location.href = redirectPath;
//         }
//       });
//     }
//   }, [isAuthenticated, user?.role, loading, isSubmitting, router]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       clearError();
//     }
//   }, [error, clearError]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);

//     try {
//       const result = await login(formData.email, formData.password);
      
//       if (result?.success) {
//         const userName = result.data?.user?.firstName || 
//                         result.data?.firstName || 
//                         result.user?.firstName || 
//                         'User';
        
//         toast.success(`Welcome back, ${userName}!`);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error(error.message || 'An error occurred during login.');
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>Sign In - LearnBridge</title>
//         <meta name="description" content="Sign in to your LearnBridge account" />
//       </Head>

//       <div className={styles.authContainer}>
//         {/* Animated Background */}
//         <div className={styles.backgroundAnimation}>
//           <div className={styles.blob1}></div>
//           <div className={styles.blob2}></div>
//           <div className={styles.blob3}></div>
//         </div>

//         {/* Left Side - Branding */}
//         <div className={styles.brandingSide}>
//           <div className={styles.brandingContent}>
//             <div className={styles.logo}>
//               <div className={styles.logoIcon}>
//                 <span>LB</span>
//               </div>
//               <h1 className={styles.logoText}>LearnBridge</h1>
//             </div>
            
//             <h2 className={styles.brandingTitle}>
//               Welcome Back to Your Learning Journey
//             </h2>
            
//             <p className={styles.brandingSubtitle}>
//               Continue your path to better mental wellness and cognitive development
//             </p>

//             <div className={styles.features}>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>✓</div>
//                 <span>Personalized Learning Experience</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>✓</div>
//                 <span>Track Your Progress</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>✓</div>
//                 <span>Expert Support Available</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className={styles.formSide}>
//           <div className={styles.formContainer}>
//             <div className={styles.formHeader}>
//               <h2 className={styles.formTitle}>Sign In</h2>
//               <p className={styles.formSubtitle}>Enter your credentials to access your account</p>
//             </div>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               {/* Email Field */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="email" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                   </svg>
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={loading || isSubmitting}
//                 />
//                 {errors.email && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="password" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                   Password
//                 </label>
//                 <div className={styles.passwordWrapper}>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     required
//                     className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   <button
//                     type="button"
//                     className={styles.passwordToggle}
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     ) : (
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className={styles.formOptions}>
//                 <label className={styles.checkbox}>
//                   <input type="checkbox" />
//                   <span>Remember me</span>
//                 </label>
//                 <Link href="/forgot-password" className={styles.forgotLink}>
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading || isSubmitting}
//                 className={styles.submitButton}
//               >
//                 {loading || isSubmitting ? (
//                   <>
//                     <span className={styles.spinner}></span>
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     Sign In
//                     <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Sign Up Link */}
//             <div className={styles.formFooter}>
//               <p>Dont have an account?{' '}
//                 <Link href="/signup" className={styles.signupLink}>
//                   Create one now
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }












































































// pages/login.jsx - FIXED VERSION (No Conflicting Redirects)
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  //  REMOVED: Conflicting redirect useEffect - AuthContext handles this!

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      console.log('🔐 Login page: Submitting credentials');
      const result = await login(formData.email, formData.password);
      
      if (result?.success) {
        const userName = result.data?.user?.firstName || 'User';
        toast.success(`Welcome back, ${userName}!`);
        console.log('✅ Login page: Login successful, AuthContext will handle redirect');
        // ✅ AuthContext.login() function now handles redirect automatically
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('❌ Login page error:', error);
      toast.error(error.message || 'An error occurred during login.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - LearnBridge</title>
        <meta name="description" content="Sign in to your LearnBridge account" />
      </Head>

      <div className={styles.authContainer}>
        {/* Animated Background */}
        <div className={styles.backgroundAnimation}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
          <div className={styles.blob3}></div>
        </div>

        {/* Left Side - Branding */}
        <div className={styles.brandingSide}>
          <div className={styles.brandingContent}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <span>LB</span>
              </div>
              <h1 className={styles.logoText}>LearnBridge</h1>
            </div>
            
            <h2 className={styles.brandingTitle}>
              Welcome Back to Your Learning Journey
            </h2>
            
            <p className={styles.brandingSubtitle}>
              Continue your path to better mental wellness and cognitive development
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Personalized Learning Experience</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Track Your Progress</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <span>Expert Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Sign In</h2>
              <p className={styles.formSubtitle}>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                />
                {errors.email && (
                  <p className={styles.errorMessage}>
                    <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={styles.errorMessage}>
                    <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className={styles.formOptions}>
                <label className={styles.checkbox}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={styles.submitButton}
              >
                {loading || isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className={styles.formFooter}>
              <p>
                Don't have an account?{' '}
                <Link href="/signup" className={styles.signupLink}>
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
