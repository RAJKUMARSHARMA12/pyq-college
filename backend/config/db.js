import mongoose from 'mongoose';
import User from '../models/User.js';

let isConnectedToMongo = false;

/**
 * Ensures a default Admin account exists on new deployments
 */
export const ensureDefaultAdminExists = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@prores.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminPassword123';
    const adminName = process.env.ADMIN_NAME || 'System Admin';

    if (isConnectedToMongo) {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (!existingAdmin) {
        await User.create({
          name: adminName,
          email: adminEmail.toLowerCase(),
          password: adminPassword,
          role: 'admin',
        });
        console.log(`✅ Default Admin auto-created for new deployment: ${adminEmail}`);
      }
    }
  } catch (error) {
    console.warn('ℹ️ Default Admin check:', error.message);
  }
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/pro_res_db',
      {
        serverSelectionTimeoutMS: 2500, // Quick timeout for fallback
      }
    );
    isConnectedToMongo = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-create default admin account on new deployment
    await ensureDefaultAdminExists();
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.log(`ℹ️ Falling back to In-Memory store for full functionality without requiring local MongoDB.`);
  }
};

export const isMongoConnected = () => isConnectedToMongo;
