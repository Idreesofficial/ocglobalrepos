import { Admin } from '../models/admin.js';
import { validateAdminData } from '../utils/validation.js';

export const addAdmin = async (req, res) => {
  try {
    const validationErrors = validateAdminData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const admin = new Admin(req.body);
    const savedAdmin = await admin.save();
    
    // Remove password from response
    const adminResponse = savedAdmin.toObject();
    delete adminResponse.password;
    
    res.status(201).json(adminResponse);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating admin',
      error: error.message
    });
  }
};

export const verifyAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    res.json(adminResponse);
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying admin',
      error: error.message
    });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password').lean();
    res.json(admins);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching admins',
      error: error.message
    });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    if (req.body.password) {
      admin.password = req.body.password;
    }
    
    const updatedAdmin = await admin.save();
    const adminResponse = updatedAdmin.toObject();
    delete adminResponse.password;
    
    res.json(adminResponse);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating admin',
      error: error.message
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    if (admin.role === 'super') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }
    
    await admin.deleteOne();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting admin',
      error: error.message
    });
  }
};