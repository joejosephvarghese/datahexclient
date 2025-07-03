import { useState } from 'react';

export default function useFormValidation(validators) {
  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const newErrors = {};
    Object.keys(validators).forEach((key) => {
      const error = validators[key](values[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };

  return { errors, validate };
}