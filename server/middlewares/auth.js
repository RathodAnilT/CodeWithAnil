const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('firebase-admin');
const crypto = require('crypto');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    // Check if we have service account credentials in environment variables
    if (process.env.FIREBASE_PROJECT_ID) {
      // Initialize with environment variables
      let credential = {};
      
      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        credential = {
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
          })
        };
      }
      
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        ...credential
      });
      console.log('Firebase Admin SDK initialized with project ID:', process.env.FIREBASE_PROJECT_ID);
    } else {
      // Minimal initialization if no environment variables
      admin.initializeApp({
        projectId: 'codewithanil-bd709',
      });
      console.log('Firebase Admin SDK initialized with default config');
      console.warn('WARNING: Using default Firebase config. Set FIREBASE_PROJECT_ID for full functionality');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

// Helper function to verify Firebase token
const verifyFirebaseToken = async (token) => {
  try {
    console.log('Attempting to verify Firebase token');
    
    // Check token format
    if (!token || typeof token !== 'string' || token.length < 50) {
      console.warn('Invalid token format:', token?.substring(0, 10) + '...');
      return { valid: false, error: 'Invalid token format' };
    }
    
    // Verify with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Log successful verification (sanitize output for security)
    console.log('Firebase token verified successfully:', {
      uid: decodedToken.uid,
      email: decodedToken.email ? decodedToken.email.substring(0, 3) + '...' : 'No email', 
      provider: decodedToken.firebase?.sign_in_provider,
      exp: new Date(decodedToken.exp * 1000).toISOString()
    });
    
    return { 
      valid: true, 
      uid: decodedToken.uid, 
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0],
      picture: decodedToken.picture
    };
  } catch (error) {
    // Specific error messages for different verification failures
    if (error.code === 'auth/id-token-expired') {
      console.error('Firebase token expired:', error.message);
      return { valid: false, error: 'Token expired' };
    } else if (error.code === 'auth/id-token-revoked') {
      console.error('Firebase token revoked:', error.message);
      return { valid: false, error: 'Token revoked' };
    } else if (error.code === 'auth/argument-error') {
      console.error('Firebase token argument error:', error.message);
      return { valid: false, error: 'Invalid token format' };
    } else {
      console.error('Firebase token verification error:', error);
      return { valid: false, error: error.message };
    }
  }
};

// Middleware for protecting routes
exports.protect = async (req, res, next) => {
  let token;
  console.log('Protect middleware called for route:', req.originalUrl);

  try {
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    } 
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token found in cookies');
    }

    // If no token found, return unauthorized
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Login required',
        authError: true
      });
    }

    // First try to verify as Firebase token
    const firebaseVerification = await verifyFirebaseToken(token);
    
    if (firebaseVerification.valid) {
      console.log('Firebase verification successful');
      // Find user by Firebase UID or email
      let user = await User.findOne({
        $or: [
          { firebaseUid: firebaseVerification.uid },
          { email: firebaseVerification.email }
        ]
      });

      // If user doesn't exist but we have email, create new user
      if (!user && firebaseVerification.email) {
        console.log('Creating new user from Firebase credentials');
        user = await User.create({
          name: firebaseVerification.name,
          email: firebaseVerification.email,
          firebaseUid: firebaseVerification.uid,
          password: crypto.randomBytes(20).toString('hex') // Random secure password
        });
      } 
      // If user exists but doesn't have firebaseUid, update it
      else if (user && !user.firebaseUid) {
        console.log('Updating existing user with Firebase UID');
        user.firebaseUid = firebaseVerification.uid;
        await user.save();
      }

      if (!user) {
        console.error('Could not find or create user from Firebase token');
        return res.status(401).json({
          success: false,
          error: 'User not found or could not be created',
          authError: true
        });
      }

      req.user = user;
      return next();
    } 
    // If not a valid Firebase token, try JWT
    else {
      console.log('Firebase verification failed, trying JWT:', firebaseVerification.error);
      
      // Verify token with JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID
      const user = await User.findById(decoded.id);
      
      if (!user) {
        console.error('JWT verification successful but user not found');
        return res.status(401).json({
          success: false,
          error: 'User no longer exists',
          authError: true
        });
      }
      
      req.user = user;
      return next();
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Authentication error: ' + error.message,
      authError: true
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
}; 