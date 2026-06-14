// import { createContext, useContext, useReducer, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { authAPI } from '../services/api';

// const AuthContext = createContext();

// // Auth reducer
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN_START':
//       return { ...state, loading: true, error: null };
//     case 'LOGIN_SUCCESS':
//       return { 
//         ...state, 
//         loading: false, 
//         user: action.payload.user, 
//         token: action.payload.token,
//         isAuthenticated: true,
//         error: null 
//       };
//     case 'LOGIN_FAILURE':
//       return { 
//         ...state, 
//         loading: false, 
//         error: action.payload, 
//         isAuthenticated: false,
//         user: null,
//         token: null
//       };
//     case 'LOGOUT':
//       return { 
//         ...state, 
//         user: null, 
//         token: null, 
//         isAuthenticated: false, 
//         loading: false,
//         error: null 
//       };
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     case 'SET_USER':
//       return { 
//         ...state, 
//         user: action.payload, 
//         isAuthenticated: true,
//         loading: false 
//       };
//     case 'CLEAR_ERROR':
//       return { ...state, error: null };
//     default:
//       return state;
//   }
// };

// // Initial state
// const initialState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   loading: true,
//   error: null
// };

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Check for existing token on app load
//   useEffect(() => {
//     const token = Cookies.get('auth_token');
//     console.log('🔍 Checking for existing token:', token ? 'Found' : 'Not found');
    
//     if (token) {
//       // Verify token and get user info
//       authAPI.getProfile()
//         .then(response => {
//           console.log(' Token verified, user:', response.data);
          
//           // Handle different response formats
//           const userData = response.data?.user || response.data?.data?.user || response.data;
          
//           dispatch({
//             type: 'SET_USER',
//             payload: userData
//           });
//         })
//         .catch(error => {
//           console.error(' Token verification failed:', error);
//           Cookies.remove('auth_token');
//           dispatch({ type: 'LOGOUT' });
//         });
//     } else {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   }, []);

//   // Login function
//   const login = async (email, password) => {
//     console.log('🔐 AuthContext: Starting login for', email);
//     dispatch({ type: 'LOGIN_START' });
    
//     try {
//       const response = await authAPI.login(email, password);
      
//       // 🔍 DEBUG: Log the ENTIRE response structure
//       console.log(' RAW API Response:', response);
//       console.log(' Response.data:', response.data);
//       console.log(' Response.data type:', typeof response.data);
//       console.log(' Response.data keys:', Object.keys(response.data || {}));
      
//       // Try multiple possible response structures
//       let user = null;
//       let token = null;
      
//       // Structure 1: { data: { user, token } }
//       if (response.data?.data?.user && response.data?.data?.token) {
//         user = response.data.data.user;
//         token = response.data.data.token;
//         console.log(' Format 1: data.data.user/token');
//       }
//       // Structure 2: { data: { user, token } }
//       else if (response.data?.user && response.data?.token) {
//         user = response.data.user;
//         token = response.data.token;
//         console.log(' Format 2: data.user/token');
//       }
//       // Structure 3: { user, token } (top level)
//       else if (response.user && response.token) {
//         user = response.user;
//         token = response.token;
//         console.log(' Format 3: user/token (top level)');
//       }
//       // Structure 4: Nested deeper
//       else if (response.data?.data) {
//         user = response.data.data;
//         token = response.data.token || response.data.data.token;
//         console.log(' Format 4: Complex nested structure');
//       }
      
//       console.log(' Extracted User:', user);
//       console.log(' Extracted Token:', token);
      
//       if (!user) {
//         console.error(' Could not find user in response');
//         console.error('Response structure:', JSON.stringify(response.data, null, 2));
//         throw new Error('Invalid response from server: user data not found');
//       }
      
//       if (!token) {
//         console.error(' Could not find token in response');
//         console.error('Response structure:', JSON.stringify(response.data, null, 2));
//         throw new Error('Invalid response from server: token not found');
//       }
      
//       // Store token in cookie
//       Cookies.set('auth_token', token, { 
//         expires: 1, // 1 day
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict'
//       });
      
//       console.log(' Dispatching LOGIN_SUCCESS with user:', user);
//       dispatch({
//         type: 'LOGIN_SUCCESS',
//         payload: { user, token }
//       });
      
//       // Return data in the format expected by login page
//       return { 
//         success: true, 
//         data: { user, token }
//       };
//     } catch (error) {
//       console.error(' Login error:', error);
//       console.error('Error details:', error.response?.data);
      
//       const errorMessage = error.response?.data?.message || error.message || 'Login failed';
//       dispatch({
//         type: 'LOGIN_FAILURE',
//         payload: errorMessage
//       });
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     console.log(' AuthContext: Starting registration');
//     dispatch({ type: 'LOGIN_START' });
    
//     try {
//       const response = await authAPI.register(userData);
//       console.log(' Registration response:', response);
      
//       // Use same extraction logic as login
//       let user = null;
//       let token = null;
      
//       if (response.data?.data?.user && response.data?.data?.token) {
//         user = response.data.data.user;
//         token = response.data.data.token;
//       } else if (response.data?.user && response.data?.token) {
//         user = response.data.user;
//         token = response.data.token;
//       } else if (response.user && response.token) {
//         user = response.user;
//         token = response.token;
//       }
      
//       if (!user || !token) {
//         throw new Error('Invalid response from server');
//       }
      
//       // Store token in cookie
//       Cookies.set('auth_token', token, { 
//         expires: 1, // 1 day
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict'
//       });
      
//       console.log(' Dispatching LOGIN_SUCCESS for registration');
//       dispatch({
//         type: 'LOGIN_SUCCESS',
//         payload: { user, token }
//       });
      
//       return { 
//         success: true, 
//         data: { user, token }
//       };
//     } catch (error) {
//       console.error(' Registration error:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
//       dispatch({
//         type: 'LOGIN_FAILURE',
//         payload: errorMessage
//       });
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     console.log(' Logging out...');
//     try {
//       await authAPI.logout();
//     } catch (error) {
//       console.error('Logout API call failed:', error);
//     } finally {
//       Cookies.remove('auth_token');
//       dispatch({ type: 'LOGOUT' });
//       console.log(' Logged out successfully');
//     }
//   };

//   // Clear error function
//   const clearError = () => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   };

//   const value = {
//     ...state,
//     login,
//     register,
//     logout,
//     clearError
//   };

//   // Debug log whenever state changes
//   useEffect(() => {
//     console.log('🔄 Auth State Updated:', {
//       isAuthenticated: state.isAuthenticated,
//       hasUser: !!state.user,
//       userRole: state.user?.role,
//       loading: state.loading
//     });
//   }, [state]);

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };







import { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false,
        error: null 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true,
        loading: false 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter(); //  ADDED

  //  NEW HELPER FUNCTION - Role-based redirection
  const redirectBasedOnRole = (role) => {
    if (!role) {
      router.push('/');
      return;
    }

    const normalizedRole = role.toLowerCase();
    
    const roleMap = {
      'student': '/student/dashboard',
      'psychologist': '/psychologist/dashboard',
      'admin': '/admin/dashboard'
    };

    const redirectPath = roleMap[normalizedRole] || '/';
    
    console.log(` Redirecting ${role} to:`, redirectPath);
    
    router.push(redirectPath).catch((err) => {
      console.error('Navigation failed:', err);
      // Fallback to window.location if router.push fails
      if (typeof window !== 'undefined') {
        window.location.href = redirectPath;
      }
    });
  };

  // Check for existing token on app load
  useEffect(() => {
    const token = Cookies.get('auth_token');
    console.log('🔍 Checking for existing token:', token ? 'Found' : 'Not found');
    
    if (token) {
      // Verify token and get user info
      authAPI.getProfile()
        .then(response => {
          console.log('Token verified, user:', response.data);
          
          // Handle different response formats
          const userData = response.data?.user || response.data?.data?.user || response.data;
          
          dispatch({
            type: 'SET_USER',
            payload: userData
          });
        })
        .catch(error => {
          console.error(' Token verification failed:', error);
          Cookies.remove('auth_token');
          dispatch({ type: 'LOGOUT' });
        });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Login function - UPDATED WITH REDIRECTION
  const login = async (email, password) => {
    console.log('AuthContext: Starting login for', email);
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login(email, password);
      
      // 🔍 DEBUG: Log the ENTIRE response structure
      console.log(' RAW API Response:', response);
      console.log(' Response.data:', response.data);
      console.log(' Response.data type:', typeof response.data);
      console.log(' Response.data keys:', Object.keys(response.data || {}));
      
      // Try multiple possible response structures
      let user = null;
      let token = null;
      
      // Structure 1: { data: { user, token } }
      if (response.data?.data?.user && response.data?.data?.token) {
        user = response.data.data.user;
        token = response.data.data.token;
        console.log(' Format 1: data.data.user/token');
      }
      // Structure 2: { data: { user, token } }
      else if (response.data?.user && response.data?.token) {
        user = response.data.user;
        token = response.data.token;
        console.log(' Format 2: data.user/token');
      }
      // Structure 3: { user, token } (top level)
      else if (response.user && response.token) {
        user = response.user;
        token = response.token;
        console.log(' Format 3: user/token (top level)');
      }
      // Structure 4: Nested deeper
      else if (response.data?.data) {
        user = response.data.data;
        token = response.data.token || response.data.data.token;
        console.log(' Format 4: Complex nested structure');
      }
      
      console.log(' Extracted User:', user);
      console.log(' Extracted Token:', token);
      
      if (!user) {
        console.error(' Could not find user in response');
        console.error('Response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response from server: user data not found');
      }
      
      if (!token) {
        console.error(' Could not find token in response');
        console.error('Response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response from server: token not found');
      }
      
      // Store token in cookie
      Cookies.set('auth_token', token, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      console.log(' Dispatching LOGIN_SUCCESS with user:', user);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      //  TRIGGER ROLE-BASED REDIRECTION
      redirectBasedOnRole(user.role);
      
      // Return data in the format expected by login page
      return { 
        success: true, 
        data: { user, token }
      };
    } catch (error) {
      console.error(' Login error:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function -  UPDATED WITH REDIRECTION
  const register = async (userData) => {
    console.log(' AuthContext: Starting registration');
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.register(userData);
      console.log(' Registration response:', response);
      
      // Use same extraction logic as login
      let user = null;
      let token = null;
      
      if (response.data?.data?.user && response.data?.data?.token) {
        user = response.data.data.user;
        token = response.data.data.token;
      } else if (response.data?.user && response.data?.token) {
        user = response.data.user;
        token = response.data.token;
      } else if (response.user && response.token) {
        user = response.user;
        token = response.token;
      }
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }
      
      // Store token in cookie
      Cookies.set('auth_token', token, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      console.log(' Dispatching LOGIN_SUCCESS for registration');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      //  TRIGGER ROLE-BASED REDIRECTION
      redirectBasedOnRole(user.role);
      
      return { 
        success: true, 
        data: { user, token }
      };
    } catch (error) {
      console.error(' Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    console.log(' Logging out...');
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      Cookies.remove('auth_token');
      dispatch({ type: 'LOGOUT' });
      router.push('/login'); //  REDIRECT TO LOGIN
      console.log(' Logged out successfully');
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  // Debug log whenever state changes
  useEffect(() => {
    console.log('🔄 Auth State Updated:', {
      isAuthenticated: state.isAuthenticated,
      hasUser: !!state.user,
      userRole: state.user?.role,
      loading: state.loading
    });
  }, [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};