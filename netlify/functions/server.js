import express from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Admin } from '../../server/models/admin.js';
import { Application } from '../../server/models/application.js';
import { Settings } from '../../server/models/settings.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB connection state check
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Connect to MongoDB and create default admin
const connectDB = async () => {
  try {
    if (isConnected()) {
      console.log('MongoDB is already connected');
      return;
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB Connected');
    
    // Create default super admin if it doesn't exist
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        name: 'Super Admin',
        role: 'super'
      });
      console.log('Default super admin account created');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Initialize database connection
connectDB();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = isConnected() ? 'connected' : 'disconnected';
    const adminCount = await Admin.countDocuments();
    const applicationCount = await Application.countDocuments();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        stats: {
          admins: adminCount,
          applications: applicationCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Admin verification with detailed error logging
app.post('/api/admins/verify', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database connection not available' });
    }

    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Successful login for email:', email);
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    res.json(adminResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error verifying admin', 
      error: error.message 
    });
  }
});

// Application routes
app.get('/api/applications', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database connection not available' });
    }
    const applications = await Application.find().sort({ timestamp: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database connection not available' });
    }
    const application = new Application(req.body);
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error saving application', error: error.message });
  }
});

// Settings routes
app.get('/api/settings/logo', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database connection not available' });
    }
    const setting = await Settings.findOne({ key: 'logo' });
    res.json({ logo: setting?.value || null });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logo', error: error.message });
  }
});

app.put('/api/settings/logo', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database connection not available' });
    }
    const { logo } = req.body;
    await Settings.findOneAndUpdate(
      { key: 'logo' },
      { key: 'logo', value: logo },
      { upsert: true }
    );
    res.json({ message: 'Logo updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating logo', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export const handler = serverless(app);