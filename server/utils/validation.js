export const validateApplication = (data) => {
  const errors = [];

  if (!data.formData) {
    errors.push('Form data is required');
  }

  if (!data.eligibilityResult) {
    errors.push('Eligibility result is required');
  }

  return errors;
};