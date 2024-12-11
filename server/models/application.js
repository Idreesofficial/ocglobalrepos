import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  dateOfBirth: { type: String, required: true }
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  university: { type: String, required: true },
  graduationYear: { type: String, required: true },
  gradeType: { type: String, enum: ['cgpa', 'percentage'], required: true },
  grade: { type: Number, required: true }
});

const workExperienceSchema = new mongoose.Schema({
  hasExperience: { type: Boolean, default: false },
  years: { type: Number },
  details: { type: String }
});

const preferencesSchema = new mongoose.Schema({
  targetCountries: [{ type: String }]
});

const formDataSchema = new mongoose.Schema({
  personalInfo: { type: personalInfoSchema, required: true },
  previousEducationLevel: { 
    type: String, 
    enum: ['fsc', 'alevel', 'bachelors', 'masters'],
    required: true 
  },
  futureEducationLevel: { 
    type: String,
    enum: ['bachelors', 'masters', 'phd'],
    required: true 
  },
  previousEducation: { type: educationSchema, required: true },
  preferences: { type: preferencesSchema, required: true },
  workExperience: { type: workExperienceSchema }
});

const eligibilityResultSchema = new mongoose.Schema({
  eligible: { type: Boolean, required: true },
  type: String,
  chance: String,
  countries: [String],
  message: String
});

const applicationSchema = new mongoose.Schema({
  applicationCode: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  formData: {
    type: formDataSchema,
    required: true
  },
  eligibilityResult: {
    type: eligibilityResultSchema,
    required: true
  }
});

export const Application = mongoose.model('Application', applicationSchema);