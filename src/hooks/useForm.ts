import { useState, ChangeEvent } from 'react';
import { z } from 'zod';

export function useForm<T extends z.ZodType>(
  initialValues: z.infer<T>, 
  schema: T
) {
  const [values, setValues] = useState<z.infer<T>>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  const validate = () => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap = error.flatten().fieldErrors;
        const mappedErrors = Object.keys(errorMap).reduce((acc, key) => {
          acc[key] = errorMap[key]?.[0] || '';
          return acc;
        }, {} as { [key: string]: string });
        
        setErrors(mappedErrors);
      }
      return false;
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    reset,
    setValues
  };
}
