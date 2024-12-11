import React from 'react';
import { ValidationError } from '../utils/validation';

interface FormErrorProps {
  error?: ValidationError;
}

export const FormError: React.FC<FormErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <p className="mt-1 text-sm text-red-600">
      {error.message}
    </p>
  );
};