// // // import { useState, useEffect } from 'react';
// // // import { useRouter } from 'next/router';
// // // import Link from 'next/link';
// // // import Head from 'next/head';
// // // import { useAuth } from '../contexts/AuthContext';
// // // import toast from 'react-hot-toast';

// // // export default function Register() {
// // //   const [formData, setFormData] = useState({
// // //     firstName: '',
// // //     lastName: '',
// // //     username: '',
// // //     email: '',
// // //     password: '',
// // //     confirmPassword: '',
// // //     role: 'Student'
// // //   });
// // //   const [errors, setErrors] = useState({});
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
  
// // //   const { register, isAuthenticated, loading, error, clearError, user } = useAuth();
// // //   const router = useRouter();

// // //   // Function to get redirect path based on role
// // //   const getRedirectPath = (role) => {
// // //     if (!role) return '/';
// // //     const normalizedRole = role.toLowerCase();
// // //     const roleMap = {
// // //       'admin': '/admin/dashboard',
// // //       'psychologist': '/psychologist/dashboard',
// // //       'student': '/student/dashboard'
// // //     };
// // //     return roleMap[normalizedRole] || '/';
// // //   };

// // //   // Handle redirect after authentication
// // //   useEffect(() => {
// // //     if (isAuthenticated && user?.role && !loading && !isSubmitting) {
// // //       const redirectPath = getRedirectPath(user.role);
// // //       console.log('🎯 Redirecting new user to:', redirectPath);
      
// // //       router.replace(redirectPath).catch((err) => {
// // //         console.error('❌ Navigation failed:', err);
// // //         if (typeof window !== 'undefined') {
// // //           window.location.href = redirectPath;
// // //         }
// // //       });
// // //     }
// // //   }, [isAuthenticated, user?.role, loading, isSubmitting]);

// // //   useEffect(() => {
// // //     if (error) {
// // //       toast.error(error);
// // //       clearError();
// // //     }
// // //   }, [error, clearError]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [name]: value
// // //     }));
    
// // //     if (errors[name]) {
// // //       setErrors(prev => ({
// // //         ...prev,
// // //         [name]: ''
// // //       }));
// // //     }
// // //   };

// // //   const validateForm = () => {
// // //     const newErrors = {};
    
// // //     if (!formData.firstName.trim()) {
// // //       newErrors.firstName = 'First name is required';
// // //     } else if (formData.firstName.trim().length < 2) {
// // //       newErrors.firstName = 'First name must be at least 2 characters';
// // //     }
    
// // //     if (!formData.lastName.trim()) {
// // //       newErrors.lastName = 'Last name is required';
// // //     } else if (formData.lastName.trim().length < 2) {
// // //       newErrors.lastName = 'Last name must be at least 2 characters';
// // //     }
    
// // //     if (!formData.username.trim()) {
// // //       newErrors.username = 'Username is required';
// // //     } else if (formData.username.length < 3) {
// // //       newErrors.username = 'Username must be at least 3 characters';
// // //     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
// // //       newErrors.username = 'Username can only contain letters, numbers, and underscores';
// // //     }
    
// // //     if (!formData.email) {
// // //       newErrors.email = 'Email is required';
// // //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// // //       newErrors.email = 'Please enter a valid email address';
// // //     }
    
// // //     if (!formData.password) {
// // //       newErrors.password = 'Password is required';
// // //     } else if (formData.password.length < 6) {
// // //       newErrors.password = 'Password must be at least 6 characters';
// // //     } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
// // //       newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
// // //     }
    
// // //     if (!formData.confirmPassword) {
// // //       newErrors.confirmPassword = 'Please confirm your password';
// // //     } else if (formData.password !== formData.confirmPassword) {
// // //       newErrors.confirmPassword = 'Passwords do not match';
// // //     }
    
// // //     if (!['Student', 'Admin', 'Psychologist'].includes(formData.role)) {
// // //       newErrors.role = 'Please select a valid role';
// // //     }
    
// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
    
// // //     if (!validateForm()) return;

// // //     setIsSubmitting(true);

// // //     try {
// // //       const { confirmPassword, ...registrationData } = formData;
      
// // //       console.log('📝 Starting registration...');
// // //       const result = await register(registrationData);
      
// // //       if (result?.success) {
// // //         const userName = result.data?.user?.firstName || result.data?.firstName || 'User';
// // //         toast.success(`Welcome, ${userName}! Your account has been created.`);
// // //       }
// // //     } catch (error) {
// // //       console.error('💥 Registration error:', error);
// // //       toast.error(error.message || 'Registration failed. Please try again.');
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <Head>
// // //         <title>Register - MindWell Pro</title>
// // //         <meta name="description" content="Create your MindWell Pro account" />
// // //       </Head>

// // //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
// // //         {/* Animated background elements */}
// // //         <div className="absolute inset-0 overflow-hidden">
// // //           <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
// // //           <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
// // //           <div className="absolute top-40 left-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
// // //         </div>

// // //         <div className="max-w-lg w-full space-y-8 z-10">
// // //           {/* Header Section */}
// // //           <div className="text-center">
// // //             <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
// // //               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
// // //               </svg>
// // //             </div>
// // //             <h2 className="mt-6 text-4xl font-extrabold text-gray-900 font-poppins">
// // //               Join MindWell Pro
// // //             </h2>
// // //             <p className="mt-3 text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
// // //               Create your account and start your journey to better mental wellness
// // //             </p>
// // //           </div>

// // //           {/* Registration Form */}
// // //           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
// // //             <form onSubmit={handleSubmit} className="space-y-6">
// // //               {/* Name Fields - Grid Layout */}
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                 {/* First Name */}
// // //                 <div className="space-y-2">
// // //                   <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
// // //                     First Name
// // //                   </label>
// // //                   <div className="relative">
// // //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // //                       </svg>
// // //                     </div>
// // //                     <input
// // //                       id="firstName"
// // //                       name="firstName"
// // //                       type="text"
// // //                       required
// // //                       className={`block w-full pl-10 pr-4 py-3 text-lg border-0 ring-2 ring-gray-200 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 ${
// // //                         errors.firstName ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-green-500'
// // //                       }`}
// // //                       placeholder="John"
// // //                       value={formData.firstName}
// // //                       onChange={handleChange}
// // //                       disabled={loading || isSubmitting}
// // //                     />
// // //                   </div>
// // //                   {errors.firstName && (
// // //                     <p className="text-red-500 text-sm font-medium flex items-center mt-1 animate-fadeIn">
// // //                       <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// // //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// // //                       </svg>
// // //                       {errors.firstName}
// // //                     </p>
// // //                   )}
// // //                 </div>

// // //                 {/* Last Name */}
// // //                 <div className="space-y-2">
// // //                   <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
// // //                     Last Name
// // //                   </label>
// // //                   <div className="relative">
// // //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // //                       </svg>
// // //                     </div>
// // //                     <input
// // //                       id="lastName"
// // //                       name="lastName"
// // //                       type="text"
// // //                       required
// // //                       className={`block w-full pl-10 pr-4 py-3 text-lg border-0 ring-2 ring-gray-200 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 ${
// // //                         errors.lastName ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-green-500'
// // //                       }`}
// // //                       placeholder="Doe"
// // //                       value={formData.lastName}
// // //                       onChange={handleChange}
// // //                       disabled={loading || isSubmitting}
// // //                     />
// // //                   </div>
// // //                   {errors.lastName && (
// // //                     <p className="text-red-500 text-sm font-medium flex items-center mt-1 animate-fadeIn">
// // //                       <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// // //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// // //                       </svg>
// // //                       {errors.lastName}
// // //                     </p>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Username Field */}
// // //               <div className="space-y-2">
// // //                 <label htmlFor="username" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
// // //                   Username
// // //                 </label>
// // //                 <div className="relative">
// // //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // //                     </svg>
// // //                   </div>
// // //                   <input
// // //                     id="username"
// // //                     name="username"
// // //                     type="text"
// // //                     required
// // //                     className={`block w-full pl-10 pr-4 py-3 text-lg border-0 ring-2 ring-gray-200 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 ${
// // //                       errors.username ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-green-500'
// // //                     }`}
// // //                     placeholder="johndoe123"
// // //                     value={formData.username}
// // //                     onChange={handleChange}
// // //                     disabled={loading || isSubmitting}
// // //                   />
// // //                 </div>
// // //                 {errors.username && (
// // //                   <p className="text-red-500 text-sm font-medium flex items-center mt-1 animate-fadeIn">
// // //                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// // //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// // //                     </svg>
// // //                     {errors.username}
// // //                   </p>
// // //                 )}
// // //               </div>

// // //               {/* Email Field */}
// // //               <div className="space-y-2">
// // //                 <label htmlFor="email" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
// // //                   Email Address
// // //                 </label>
// // //                 <div className="relative">
// // //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
// // //                     </svg>
// // //                   </div>
// // //                   <input
// // //                     id="email"
// // //                     name="email"
// // //                     type="email"
// // //                     autoComplete="email"
// // //                     required
// // //                     className={`block w-full pl-10 pr-4 py-3 text-lg border-0 ring-2 ring-gray-200 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 ${
// // //                       errors.email ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-green-500'
// // //                     }`}
// // //                     placeholder="your.email@example.com"
// // //                     value={formData.email}
// // //                     onChange={handleChange}
// // //                     disabled={loading || isSubmitting}
// // //                   />
// // //                 </div>
// // //                 {errors.email && (
// // //                   <p className="text-red-500 text-sm font-medium flex items-center mt-1 animate-fadeIn">
// // //                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// // //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// // //                     </svg>
// // //                     {errors.email}
// // //                   </p>
// // //                 )}
// // //               </div>

// // //               {/* Role Selection */}
// // //               <div className="space-y-2">
// // //                 <label htmlFor="role" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
// // //                   I am a
// // //                 </label>
// // //                 <div className="relative">
// // //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
// // //                     </svg>
// // //                   </div>
// // //                   <select
// // //                     id="role"
// // //                     name="role"
// // //                     required
// // //                     className="block w-full pl-10 pr-4 py-3 text-lg border-0 ring-2 ring-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 appearance-none"
// // //                     value={formData.role}
// // //                     onChange={handleChange}
// // //                     disabled={loading || isSubmitting}
// // //                   >
// // //                     <option value="Student">Student</option>
// // //                     <option value="Psychologist">Psychologist</option>
// // //                     <option value="Admin">Administrator</option>
// // //                   </select>
// // //                   <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
// // //                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// // //                     </svg>
// // //                   </div>
// // //                 </div>
// // //                 {errors.role && (
// // //                   <p className="text-red-500 text-sm font-medium flex items-center mt-1 animate-fadeIn">
// // //                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// // //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// // //                     </svg>
// // //                     {errors.role}
// // //                   </p>
// // //                 )}
// // //               </div>

// // //               {/* Password Fields - Grid Layout */}
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                 {/* Password */}
// // //                 <div className="space-y-2">
// // //                   <label htmlFor="password" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
// // //                     Password
// // //                   </label>
// // //                   <div className="relative">
// // //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// // //                       </svg>
// // //                     </div>
// // //                     <input
// // //                       id="password"
// // //                       name="password"
// // //                       type="password"
// // //                       autoComplete="new-password"
// // //                       required
// // //                       className={`block w-full pl-10 pr-4 py-3 text-lg border-0 ring-2 ring-gray-200 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 ${
// // //                         errors.password ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-green-500'
// // //                       }`}
// // //                       placeholder="Create password"
// // //                       value={formData.password}
// // //                       onChange={handleChange}
// // //                       disabled={loading || isSubmitting}
// // //                     />
// // //                   </div>
// // //                   {errors.password && (
// // //                     <p className="text-red-500 text-sm font-medium flex items-center mt-1 animate-fadeIn">
// // //                       <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// // //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// // //                       </svg>
// // //                       {errors.password}
// // //                     </p>
// // //                   )}
// // //                 </div>

// // //                 {/* Confirm Password */}
// // //                 <div className="space-y-2">
// // //                   <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
// // //                     Confirm Password
// // //                   </label>
// // //                   <div className="relative">
// // //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
// // //                       </svg>
// // //                     </div>
// // //                     <input
// // //                       id="confirmPassword"
// // //                       name="confirmPassword"
// // //                       type="password"
// // //                       autoComplete="new-password"
// // //                       required
// // //                       className={`block w-full pl-10 pr-4 py-3 text-lg border-0 ring-2 ring-gray-200 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 ${
// // //                         errors.confirmPassword ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-green-500'
// // //                       }`}
// // //                       placeholder="Confirm password"
// // //                       value={formData.confirmPassword}
// // //                       onChange={handleChange}
// // //                       disabled={loading || isSubmitting}
// // //                     />
// // //                   </div>
// // //                   {errors.confirmPassword && (
// // //                     <p className="text-red-500 text-sm font-medium flex items-center mt-1 animate-fadeIn">
// // //                       <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
// // //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// // //                       </svg>
// // //                       {errors.confirmPassword}
// // //                     </p>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Password Requirements */}
// // //               <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
// // //                 <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
// // //                 <ul className="text-xs text-blue-700 space-y-1">
// // //                   <li className="flex items-center">
// // //                     <svg className={`w-4 h-4 mr-2 ${formData.password.length >= 6 ? 'text-green-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={formData.password.length >= 6 ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
// // //                     </svg>
// // //                     At least 6 characters
// // //                   </li>
// // //                   <li className="flex items-center">
// // //                     <svg className={`w-4 h-4 mr-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/(?=.*[a-z])/.test(formData.password) ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
// // //                     </svg>
// // //                     One lowercase letter
// // //                   </li>
// // //                   <li className="flex items-center">
// // //                     <svg className={`w-4 h-4 mr-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/(?=.*[A-Z])/.test(formData.password) ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
// // //                     </svg>
// // //                     One uppercase letter
// // //                   </li>
// // //                   <li className="flex items-center">
// // //                     <svg className={`w-4 h-4 mr-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/(?=.*\d)/.test(formData.password) ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
// // //                     </svg>
// // //                     One number
// // //                   </li>
// // //                 </ul>
// // //               </div>

// // //               {/* Submit Button */}
// // //               <button
// // //                 type="submit"
// // //                 disabled={loading || isSubmitting}
// // //                 className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-green-200 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
// // //               >
// // //                 {loading || isSubmitting ? (
// // //                   <div className="flex items-center">
// // //                     <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-3"></div>
// // //                     Creating your account...
// // //                   </div>
// // //                 ) : (
// // //                   <div className="flex items-center">
// // //                     <span>Create Your Account</span>
// // //                     <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
// // //                     </svg>
// // //                   </div>
// // //                 )}
// // //               </button>
// // //             </form>

// // //             {/* Additional Links */}
// // //             <div className="mt-8 pt-6 border-t border-gray-200">
// // //               <div className="text-center">
// // //                 <p className="text-gray-600">
// // //                   Already have an account?{' '}
// // //                   <Link href="/login" className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-300 underline-offset-2 hover:underline">
// // //                     Sign in here
// // //                   </Link>
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Debug panel in development */}
// // //           {process.env.NODE_ENV === 'development' && (
// // //             <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
// // //               <h4 className="font-bold mb-3 text-gray-700 flex items-center text-sm uppercase tracking-wide">
// // //                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
// // //                 </svg>
// // //                 Debug Information
// // //               </h4>
// // //               <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
// // //                 <div><strong>Authenticated:</strong> {String(isAuthenticated)}</div>
// // //                 <div><strong>Loading:</strong> {String(loading)}</div>
// // //                 <div><strong>Submitting:</strong> {String(isSubmitting)}</div>
// // //                 <div><strong>User Role:</strong> {user?.role || 'No role'}</div>
// // //                 <div className="col-span-2"><strong>Expected Path:</strong> {user?.role ? getRedirectPath(user.role) : 'N/A'}</div>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       <style jsx global>{`
// // //         @keyframes blob {
// // //           0% { transform: translate(0px, 0px) scale(1); }
// // //           33% { transform: translate(30px, -50px) scale(1.1); }
// // //           66% { transform: translate(-20px, 20px) scale(0.9); }
// // //           100% { transform: translate(0px, 0px) scale(1); }
// // //         }
// // //         @keyframes fadeIn {
// // //           from { opacity: 0; transform: translateY(-5px); }
// // //           to { opacity: 1; transform: translateY(0); }
// // //         }
// // //         .animate-blob {
// // //           animation: blob 7s infinite;
// // //         }
// // //         .animation-delay-2000 {
// // //           animation-delay: 2s;
// // //         }
// // //         .animation-delay-4000 {
// // //           animation-delay: 4s;
// // //         }
// // //         .animate-fadeIn {
// // //           animation: fadeIn 0.3s ease-out;
// // //         }
// // //       `}</style>
// // //     </>
// // //   );
// // // }















// // // pages/signup.jsx
// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/router';
// // import Link from 'next/link';
// // import Head from 'next/head';
// // import { useAuth } from '../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import styles from '../styles/Auth.module.css';

// // export default function Signup() {
// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     username: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: '',
// //     role: 'Student'
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
// //   const { register, isAuthenticated, loading, error, clearError, user } = useAuth();
// //   const router = useRouter();

// //   const getRedirectPath = (role) => {
// //     if (!role) return '/';
// //     const normalizedRole = role.toLowerCase();
// //     const roleMap = {
// //       'admin': '/admin/dashboard',
// //       'psychologist': '/psychologist/dashboard',
// //       'student': '/student/dashboard'
// //     };
// //     return roleMap[normalizedRole] || '/';
// //   };

// //   useEffect(() => {
// //     if (isAuthenticated && user?.role && !loading && !isSubmitting) {
// //       const redirectPath = getRedirectPath(user.role);
// //       router.replace(redirectPath).catch((err) => {
// //         console.error('Navigation failed:', err);
// //         if (typeof window !== 'undefined') {
// //           window.location.href = redirectPath;
// //         }
// //       });
// //     }
// //   }, [isAuthenticated, user?.role, loading, isSubmitting, router]);

// //   useEffect(() => {
// //     if (error) {
// //       toast.error(error);
// //       clearError();
// //     }
// //   }, [error, clearError]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
    
// //     if (errors[name]) {
// //       setErrors(prev => ({
// //         ...prev,
// //         [name]: ''
// //       }));
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
    
// //     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
// //     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
// //     if (!formData.username.trim()) newErrors.username = 'Username is required';
// //     if (!formData.email) newErrors.email = 'Email is required';
// //     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    
// //     if (!formData.password) newErrors.password = 'Password is required';
// //     else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
// //     if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Passwords do not match';
// //     }
    
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!validateForm()) return;

// //     setIsSubmitting(true);

// //     try {
// //       const { confirmPassword, ...registrationData } = formData;
// //       const result = await register(registrationData);
      
// //       if (result?.success) {
// //         const userName = result.data?.user?.firstName || 'User';
// //         toast.success(`Welcome, ${userName}!`);
// //       }
// //     } catch (error) {
// //       console.error('Registration error:', error);
// //       toast.error(error.message || 'Registration failed.');
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const getPasswordStrength = () => {
// //     const password = formData.password;
// //     if (!password) return { strength: 0, label: '', color: '' };
    
// //     let strength = 0;
// //     if (password.length >= 6) strength++;
// //     if (password.length >= 10) strength++;
// //     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
// //     if (/\d/.test(password)) strength++;
// //     if (/[^a-zA-Z\d]/.test(password)) strength++;
    
// //     const levels = [
// //       { strength: 0, label: '', color: '' },
// //       { strength: 1, label: 'Weak', color: '#ef4444' },
// //       { strength: 2, label: 'Fair', color: '#f59e0b' },
// //       { strength: 3, label: 'Good', color: '#10b981' },
// //       { strength: 4, label: 'Strong', color: '#059669' },
// //       { strength: 5, label: 'Very Strong', color: '#047857' },
// //     ];
    
// //     return levels[strength];
// //   };

// //   const passwordStrength = getPasswordStrength();

// //   return (
// //     <>
// //       <Head>
// //         <title>Create Account - LearnBridge</title>
// //         <meta name="description" content="Create your LearnBridge account" />
// //       </Head>

// //       <div className={styles.authContainer}>
// //         {/* Animated Background */}
// //         <div className={styles.backgroundAnimation}>
// //           <div className={styles.blob1}></div>
// //           <div className={styles.blob2}></div>
// //           <div className={styles.blob3}></div>
// //         </div>

// //         {/* Left Side - Branding */}
// //         <div className={styles.brandingSide}>
// //           <div className={styles.brandingContent}>
// //             <div className={styles.logo}>
// //               <div className={styles.logoIcon}>
// //                 <span>LB</span>
// //               </div>
// //               <h1 className={styles.logoText}>LearnBridge</h1>
// //             </div>
            
// //             <h2 className={styles.brandingTitle}>
// //               Start Your Learning Journey Today
// //             </h2>
            
// //             <p className={styles.brandingSubtitle}>
// //               Join thousands of learners improving their cognitive abilities and mental wellness
// //             </p>

// //             <div className={styles.features}>
// //               <div className={styles.feature}>
// //                 <div className={styles.featureIcon}>🎯</div>
// //                 <span>Personalized Learning Paths</span>
// //               </div>
// //               <div className={styles.feature}>
// //                 <div className={styles.featureIcon}>📊</div>
// //                 <span>Track Your Progress</span>
// //               </div>
// //               <div className={styles.feature}>
// //                 <div className={styles.featureIcon}>👥</div>
// //                 <span>Expert Psychologist Support</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Right Side - Signup Form */}
// //         <div className={styles.formSide}>
// //           <div className={styles.formContainer}>
// //             <div className={styles.formHeader}>
// //               <h2 className={styles.formTitle}>Create Account</h2>
// //               <p className={styles.formSubtitle}>Fill in your details to get started</p>
// //             </div>

// //             <form onSubmit={handleSubmit} className={styles.form}>
// //               {/* Name Fields */}
// //               <div className={styles.formRow}>
// //                 <div className={styles.formGroup}>
// //                   <label htmlFor="firstName" className={styles.label}>First Name</label>
// //                   <input
// //                     id="firstName"
// //                     name="firstName"
// //                     type="text"
// //                     required
// //                     className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
// //                     placeholder="John"
// //                     value={formData.firstName}
// //                     onChange={handleChange}
// //                     disabled={loading || isSubmitting}
// //                   />
// //                   {errors.firstName && (
// //                     <p className={styles.errorMessage}>
// //                       <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
// //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                       </svg>
// //                       {errors.firstName}
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div className={styles.formGroup}>
// //                   <label htmlFor="lastName" className={styles.label}>Last Name</label>
// //                   <input
// //                     id="lastName"
// //                     name="lastName"
// //                     type="text"
// //                     required
// //                     className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
// //                     placeholder="Doe"
// //                     value={formData.lastName}
// //                     onChange={handleChange}
// //                     disabled={loading || isSubmitting}
// //                   />
// //                   {errors.lastName && (
// //                     <p className={styles.errorMessage}>
// //                       <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
// //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                       </svg>
// //                       {errors.lastName}
// //                     </p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Username */}
// //               <div className={styles.formGroup}>
// //                 <label htmlFor="username" className={styles.label}>
// //                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// //                   </svg>
// //                   Username
// //                 </label>
// //                 <input
// //                   id="username"
// //                   name="username"
// //                   type="text"
// //                   required
// //                   className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
// //                   placeholder="johndoe"
// //                   value={formData.username}
// //                   onChange={handleChange}
// //                   disabled={loading || isSubmitting}
// //                 />
// //                 {errors.username && (
// //                   <p className={styles.errorMessage}>
// //                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                     </svg>
// //                     {errors.username}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Email */}
// //               <div className={styles.formGroup}>
// //                 <label htmlFor="email" className={styles.label}>
// //                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
// //                   </svg>
// //                   Email Address
// //                 </label>
// //                 <input
// //                   id="email"
// //                   name="email"
// //                   type="email"
// //                   required
// //                   className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
// //                   placeholder="you@example.com"
// //                   value={formData.email}
// //                   onChange={handleChange}
// //                   disabled={loading || isSubmitting}
// //                 />
// //                 {errors.email && (
// //                   <p className={styles.errorMessage}>
// //                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                     </svg>
// //                     {errors.email}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Role */}
// //               <div className={styles.formGroup}>
// //                 <label htmlFor="role" className={styles.label}>
// //                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// //                   </svg>
// //                   I am a
// //                 </label>
// //                 <select
// //                   id="role"
// //                   name="role"
// //                   className={styles.select}
// //                   value={formData.role}
// //                   onChange={handleChange}
// //                   disabled={loading || isSubmitting}
// //                 >
// //                   <option value="Student">Student</option>
// //                   <option value="Psychologist">Psychologist</option>
// //                   <option value="Admin">Administrator</option>
// //                 </select>
// //               </div>

// //               {/* Password */}
// //               <div className={styles.formGroup}>
// //                 <label htmlFor="password" className={styles.label}>
// //                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// //                   </svg>
// //                   Password
// //                 </label>
// //                 <div className={styles.passwordWrapper}>
// //                   <input
// //                     id="password"
// //                     name="password"
// //                     type={showPassword ? "text" : "password"}
// //                     required
// //                     className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
// //                     placeholder="Create a strong password"
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     disabled={loading || isSubmitting}
// //                   />
// //                   <button
// //                     type="button"
// //                     className={styles.passwordToggle}
// //                     onClick={() => setShowPassword(!showPassword)}
// //                   >
// //                     {showPassword ? (
// //                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
// //                       </svg>
// //                     ) : (
// //                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                       </svg>
// //                     )}
// //                   </button>
// //                 </div>
// //                 {formData.password && (
// //                   <div className={styles.passwordStrength}>
// //                     <div className={styles.strengthBar}>
// //                       <div 
// //                         className={styles.strengthFill}
// //                         style={{ 
// //                           width: `${(passwordStrength.strength / 5) * 100}%`,
// //                           backgroundColor: passwordStrength.color
// //                         }}
// //                       ></div>
// //                     </div>
// //                     <span style={{ color: passwordStrength.color }}>
// //                       {passwordStrength.label}
// //                     </span>
// //                   </div>
// //                 )}
// //                 {errors.password && (
// //                   <p className={styles.errorMessage}>
// //                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                     </svg>
// //                     {errors.password}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Confirm Password */}
// //               <div className={styles.formGroup}>
// //                 <label htmlFor="confirmPassword" className={styles.label}>
// //                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
// //                   </svg>
// //                   Confirm Password
// //                 </label>
// //                 <div className={styles.passwordWrapper}>
// //                   <input
// //                     id="confirmPassword"
// //                     name="confirmPassword"
// //                     type={showConfirmPassword ? "text" : "password"}
// //                     required
// //                     className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
// //                     placeholder="Confirm your password"
// //                     value={formData.confirmPassword}
// //                     onChange={handleChange}
// //                     disabled={loading || isSubmitting}
// //                   />
// //                   <button
// //                     type="button"
// //                     className={styles.passwordToggle}
// //                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                   >
// //                     {showConfirmPassword ? (
// //                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
// //                       </svg>
// //                     ) : (
// //                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                       </svg>
// //                     )}
// //                   </button>
// //                 </div>
// //                 {errors.confirmPassword && (
// //                   <p className={styles.errorMessage}>
// //                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                     </svg>
// //                     {errors.confirmPassword}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Submit Button */}
// //               <button
// //                 type="submit"
// //                 disabled={loading || isSubmitting}
// //                 className={styles.submitButton}
// //               >
// //                 {loading || isSubmitting ? (
// //                   <>
// //                     <span className={styles.spinner}></span>
// //                     Creating account...
// //                   </>
// //                 ) : (
// //                   <>
// //                     Create Account
// //                     <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
// //                     </svg>
// //                   </>
// //                 )}
// //               </button>
// //             </form>

// //             {/* Sign In Link */}
// //             <div className={styles.formFooter}>
// //               <p>
// //                 Already have an account?{' '}
// //                 <Link href="/login" className={styles.signupLink}>
// //                   Sign in instead
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }




























































































































































// // pages/signup.jsx - Professional Signup Page
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import Head from 'next/head';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import styles from '../styles/Auth.module.css';

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'Student'
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
//   const { register, isAuthenticated, loading, error, clearError, user } = useAuth();
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
    
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     } else if (formData.firstName.trim().length < 2) {
//       newErrors.firstName = 'First name must be at least 2 characters';
//     }
    
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     } else if (formData.lastName.trim().length < 2) {
//       newErrors.lastName = 'Last name must be at least 2 characters';
//     }
    
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//       newErrors.username = 'Username can only contain letters, numbers, and underscores';
//     }
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
//     }
    
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     if (!['Student', 'Admin', 'Psychologist'].includes(formData.role)) {
//       newErrors.role = 'Please select a valid role';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     try {
//       const { confirmPassword, ...registrationData } = formData;
//       const result = await register(registrationData);
      
//       if (result?.success) {
//         const userName = result.data?.user?.firstName || result.data?.firstName || 'User';
//         toast.success(`Welcome, ${userName}! Your account has been created.`);
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       toast.error(error.message || 'Registration failed. Please try again.');
//       setIsSubmitting(false);
//     }
//   };

//   const getPasswordStrength = () => {
//     const password = formData.password;
//     if (!password) return { strength: 0, label: '', color: '' };
    
//     let strength = 0;
//     if (password.length >= 6) strength++;
//     if (password.length >= 10) strength++;
//     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
//     if (/\d/.test(password)) strength++;
//     if (/[^a-zA-Z\d]/.test(password)) strength++;
    
//     const levels = [
//       { strength: 0, label: '', color: '' },
//       { strength: 1, label: 'Weak', color: '#ef4444' },
//       { strength: 2, label: 'Fair', color: '#f59e0b' },
//       { strength: 3, label: 'Good', color: '#10b981' },
//       { strength: 4, label: 'Strong', color: '#059669' },
//       { strength: 5, label: 'Very Strong', color: '#047857' },
//     ];
    
//     return levels[strength];
//   };

//   const passwordStrength = getPasswordStrength();

//   return (
//     <>
//       <Head>
//         <title>Create Account - LearnBridge</title>
//         <meta name="description" content="Create your LearnBridge account" />
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
//               Start Your Learning Journey Today
//             </h2>
            
//             <p className={styles.brandingSubtitle}>
//               Join thousands of learners improving their cognitive abilities and mental wellness through personalized education.
//             </p>

//             <div className={styles.features}>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>🎯</div>
//                 <span>Personalized Learning Paths</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>📊</div>
//                 <span>Track Your Progress</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>👥</div>
//                 <span>Expert Psychologist Support</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Signup Form */}
//         <div className={styles.formSide}>
//           <div className={styles.formContainer}>
//             <div className={styles.formHeader}>
//               <h2 className={styles.formTitle}>Create Account</h2>
//               <p className={styles.formSubtitle}>Fill in your details to get started</p>
//             </div>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               {/* Name Fields */}
//               <div className={styles.formRow}>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="firstName" className={styles.label}>First Name</label>
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     required
//                     className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
//                     placeholder="Mustafa"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   {errors.firstName && (
//                     <p className={styles.errorMessage}>
//                       <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                       {errors.firstName}
//                     </p>
//                   )}
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label htmlFor="lastName" className={styles.label}>Last Name</label>
//                   <input
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     required
//                     className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
//                     placeholder="Saeed"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   {errors.lastName && (
//                     <p className={styles.errorMessage}>
//                       <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                       {errors.lastName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Username */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="username" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   required
//                   className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
//                   placeholder="Mustafa"
//                   value={formData.username}
//                   onChange={handleChange}
//                   disabled={loading || isSubmitting}
//                 />
//                 {errors.username && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.username}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
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

//               {/* Role */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="role" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                   I am a
//                 </label>
//                 <select
//                   id="role"
//                   name="role"
//                   className={styles.select}
//                   value={formData.role}
//                   onChange={handleChange}
//                   disabled={loading || isSubmitting}
//                 >
//                   <option value="Student">Student</option>
//                   <option value="Psychologist">Psychologist</option>
//                   <option value="Admin">Administrator</option>
//                 </select>
//               </div>

//               {/* Password */}
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
//                     required
//                     className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
//                     placeholder="Create a strong password"
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
//                 {formData.password && (
//                   <div className={styles.passwordStrength}>
//                     <div className={styles.strengthBar}>
//                       <div 
//                         className={styles.strengthFill}
//                         style={{ 
//                           width: `${(passwordStrength.strength / 5) * 100}%`,
//                           backgroundColor: passwordStrength.color
//                         }}
//                       ></div>
//                     </div>
//                     <span style={{ color: passwordStrength.color }}>
//                       {passwordStrength.label}
//                     </span>
//                   </div>
//                 )}
//                 {errors.password && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="confirmPassword" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                   Confirm Password
//                 </label>
//                 <div className={styles.passwordWrapper}>
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     required
//                     className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   <button
//                     type="button"
//                     className={styles.passwordToggle}
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? (
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
//                 {errors.confirmPassword && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.confirmPassword}
//                   </p>
//                 )}
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
//                     Creating account...
//                   </>
//                 ) : (
//                   <>
//                     Create Account
//                     <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Sign In Link */}
//             <div className={styles.formFooter}>
//               <p>
//                 Already have an account?{' '}
//                 <Link href="/login" className={styles.signupLink}>
//                   Sign in instead
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }































































































// // pages/signup.jsx
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import Head from 'next/head';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import styles from '../styles/Auth.module.css';

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'Student'
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
//   const { register, isAuthenticated, loading, error, clearError, user } = useAuth();
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
    
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    
//     if (!formData.password) newErrors.password = 'Password is required';
//     else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     try {
//       const { confirmPassword, ...registrationData } = formData;
//       const result = await register(registrationData);
      
//       if (result?.success) {
//         const userName = result.data?.user?.firstName || 'User';
//         toast.success(`Welcome, ${userName}!`);
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       toast.error(error.message || 'Registration failed.');
//       setIsSubmitting(false);
//     }
//   };

//   const getPasswordStrength = () => {
//     const password = formData.password;
//     if (!password) return { strength: 0, label: '', color: '' };
    
//     let strength = 0;
//     if (password.length >= 6) strength++;
//     if (password.length >= 10) strength++;
//     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
//     if (/\d/.test(password)) strength++;
//     if (/[^a-zA-Z\d]/.test(password)) strength++;
    
//     const levels = [
//       { strength: 0, label: '', color: '' },
//       { strength: 1, label: 'Weak', color: '#ef4444' },
//       { strength: 2, label: 'Fair', color: '#f59e0b' },
//       { strength: 3, label: 'Good', color: '#10b981' },
//       { strength: 4, label: 'Strong', color: '#059669' },
//       { strength: 5, label: 'Very Strong', color: '#047857' },
//     ];
    
//     return levels[strength];
//   };

//   const passwordStrength = getPasswordStrength();

//   return (
//     <>
//       <Head>
//         <title>Create Account - LearnBridge</title>
//         <meta name="description" content="Create your LearnBridge account" />
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
//               Start Your Learning Journey Today
//             </h2>
            
//             <p className={styles.brandingSubtitle}>
//               Join thousands of learners improving their cognitive abilities and mental wellness
//             </p>

//             <div className={styles.features}>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>🎯</div>
//                 <span>Personalized Learning Paths</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>📊</div>
//                 <span>Track Your Progress</span>
//               </div>
//               <div className={styles.feature}>
//                 <div className={styles.featureIcon}>👥</div>
//                 <span>Expert Psychologist Support</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Signup Form */}
//         <div className={styles.formSide}>
//           <div className={styles.formContainer}>
//             <div className={styles.formHeader}>
//               <h2 className={styles.formTitle}>Create Account</h2>
//               <p className={styles.formSubtitle}>Fill in your details to get started</p>
//             </div>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               {/* Name Fields */}
//               <div className={styles.formRow}>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="firstName" className={styles.label}>First Name</label>
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     required
//                     className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
//                     placeholder="John"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   {errors.firstName && (
//                     <p className={styles.errorMessage}>
//                       <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                       {errors.firstName}
//                     </p>
//                   )}
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label htmlFor="lastName" className={styles.label}>Last Name</label>
//                   <input
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     required
//                     className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
//                     placeholder="Doe"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   {errors.lastName && (
//                     <p className={styles.errorMessage}>
//                       <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                       {errors.lastName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Username */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="username" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   required
//                   className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
//                   placeholder="johndoe"
//                   value={formData.username}
//                   onChange={handleChange}
//                   disabled={loading || isSubmitting}
//                 />
//                 {errors.username && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.username}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
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

//               {/* Role */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="role" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                   I am a
//                 </label>
//                 <select
//                   id="role"
//                   name="role"
//                   className={styles.select}
//                   value={formData.role}
//                   onChange={handleChange}
//                   disabled={loading || isSubmitting}
//                 >
//                   <option value="Student">Student</option>
//                   <option value="Psychologist">Psychologist</option>
//                   <option value="Admin">Administrator</option>
//                 </select>
//               </div>

//               {/* Password */}
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
//                     required
//                     className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
//                     placeholder="Create a strong password"
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
//                 {formData.password && (
//                   <div className={styles.passwordStrength}>
//                     <div className={styles.strengthBar}>
//                       <div 
//                         className={styles.strengthFill}
//                         style={{ 
//                           width: `${(passwordStrength.strength / 5) * 100}%`,
//                           backgroundColor: passwordStrength.color
//                         }}
//                       ></div>
//                     </div>
//                     <span style={{ color: passwordStrength.color }}>
//                       {passwordStrength.label}
//                     </span>
//                   </div>
//                 )}
//                 {errors.password && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div className={styles.formGroup}>
//                 <label htmlFor="confirmPassword" className={styles.label}>
//                   <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                   Confirm Password
//                 </label>
//                 <div className={styles.passwordWrapper}>
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     required
//                     className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     disabled={loading || isSubmitting}
//                   />
//                   <button
//                     type="button"
//                     className={styles.passwordToggle}
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? (
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
//                 {errors.confirmPassword && (
//                   <p className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.confirmPassword}
//                   </p>
//                 )}
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
//                     Creating account...
//                   </>
//                 ) : (
//                   <>
//                     Create Account
//                     <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Sign In Link */}
//             <div className={styles.formFooter}>
//               <p>
//                 Already have an account?{' '}
//                 <Link href="/login" className={styles.signupLink}>
//                   Sign in instead
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }












































// pages/signup.jsx - FIXED VERSION (No Conflicting Redirects)
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import styles from '../styles/Auth.module.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isAuthenticated, loading, error, clearError } = useAuth();

  // ❌ REMOVED: Conflicting redirect useEffect - AuthContext handles this!

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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('📝 Signup page: Submitting registration');
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result?.success) {
        const userName = result.data?.user?.firstName || 'User';
        toast.success(`Welcome, ${userName}!`);
        console.log('✅ Signup page: Registration successful, AuthContext will handle redirect');
        // ✅ AuthContext.register() function now handles redirect automatically
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('❌ Signup page error:', error);
      toast.error(error.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Weak', color: '#ef4444' },
      { strength: 2, label: 'Fair', color: '#f59e0b' },
      { strength: 3, label: 'Good', color: '#10b981' },
      { strength: 4, label: 'Strong', color: '#059669' },
      { strength: 5, label: 'Very Strong', color: '#047857' },
    ];
    
    return levels[strength];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <>
      <Head>
        <title>Create Account - LearnBridge</title>
        <meta name="description" content="Create your LearnBridge account" />
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
              Start Your Learning Journey Today
            </h2>
            
            <p className={styles.brandingSubtitle}>
              Join thousands of learners improving their cognitive abilities and mental wellness
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎯</div>
                <span>Personalized Learning Paths</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📊</div>
                <span>Track Your Progress</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>👥</div>
                <span>Expert Psychologist Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSubtitle}>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Name Fields */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                  />
                  {errors.firstName && (
                    <p className={styles.errorMessage}>
                      <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                  />
                  {errors.lastName && (
                    <p className={styles.errorMessage}>
                      <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                />
                {errors.username && (
                  <p className={styles.errorMessage}>
                    <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
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

              {/* Role */}
              <div className={styles.formGroup}>
                <label htmlFor="role" className={styles.label}>
                  <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  I am a
                </label>
                <select
                  id="role"
                  name="role"
                  className={styles.select}
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  <option value="Student">Student</option>
                  <option value="Psychologist">Psychologist</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              {/* Password */}
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
                    required
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Create a strong password"
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
                {formData.password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div 
                        className={styles.strengthFill}
                        style={{ 
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p className={styles.errorMessage}>
                    <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Confirm Password
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading || isSubmitting}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p className={styles.errorMessage}>
                    <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className={styles.formFooter}>
              <p>
                Already have an account?{' '}
                <Link href="/login" className={styles.signupLink}>
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}