import { Settings } from '../models/settings.js';

export const updateLogo = async (req, res) => {
  try {
    const { logo } = req.body;
    
    await Settings.findOneAndUpdate(
      { key: 'logo' },
      { key: 'logo', value: logo },
      { upsert: true }
    );
    
    res.json({ message: 'Logo updated successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating logo',
      error: error.message
    });
  }
};

export const getLogo = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'logo' });
    res.json({ logo: setting?.value || null });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching logo',
      error: error.message
    });
  }
};