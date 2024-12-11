import { Application } from '../models/application.js';
import { validateApplication } from '../utils/validation.js';
import { nanoid } from 'nanoid';

export const saveApplication = async (req, res) => {
  try {
    const validationErrors = validateApplication(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors 
      });
    }

    const application = new Application({
      ...req.body,
      applicationCode: nanoid(10).toUpperCase(),
      timestamp: Date.now()
    });
    
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error saving application',
      error: error.message 
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ timestamp: -1 })
      .lean();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching applications',
      error: error.message 
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    await application.deleteOne();
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting application',
      error: error.message 
    });
  }
};