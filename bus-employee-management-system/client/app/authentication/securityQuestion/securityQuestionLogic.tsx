// C:\Users\clari\OneDrive\School\GitHub\Auth.Agila-Bus-Corp\client\app\authentication\securityquestionLogic.tsx
import { useState } from 'react';
import { showSuccess, showError } from '@/app/utils/swal'; // Assuming swal utilities are available

interface FieldErrors {
  selectedQuestion?: string;
  answer?: string;
}

interface ServerMessage {
  type: 'success' | 'error' | '';
  text: string;
}

export const useSecurityQuestionLogic = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState<ServerMessage>({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Predefined list of security questions
  const questions: string[] = [
    "What was your childhood nickname?",
    "What is the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is the name of your favorite book?",
    "What was the make and model of your first car?",
    "What is your favorite movie?",
    "What is the name of your elementary school?",
  ];

  const handleChangeQuestion = (value: string) => {
    setSelectedQuestion(value);
    setFieldErrors(prev => ({ ...prev, selectedQuestion: undefined })); // Clear error on change
    setServerMessage({ type: '', text: '' }); // Clear server message
  };

  const handleChangeAnswer = (value: string) => {
    setAnswer(value);
    setFieldErrors(prev => ({ ...prev, answer: undefined })); // Clear error on change
    setServerMessage({ type: '', text: '' }); // Clear server message
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    if (!selectedQuestion) {
      errors.selectedQuestion = 'Please select a security question.';
      isValid = false;
    }

    if (!answer.trim()) {
      errors.answer = 'Please provide an answer.';
      isValid = false;
    } else if (answer.trim().length < 3) {
      errors.answer = 'Answer must be at least 3 characters long.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    setServerMessage({ type: '', text: '' });
    if (!validateForm()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call to save the security question and answer
      // In a real application, you would send this data to your backend
      // Example: await fetch('/api/user/security-question', { method: 'POST', body: JSON.stringify({ question: selectedQuestion, answer }) });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      showSuccess('Success', 'Security question saved successfully!');
      setServerMessage({ type: 'success', text: 'Security question saved!' });
      // Optionally clear the form or redirect
      // setSelectedQuestion('');
      // setAnswer('');
    } catch (error) {
      console.error('Failed to save security question:', error);
      showError('Error', 'Failed to save security question. Please try again.');
      setServerMessage({ type: 'error', text: 'Failed to save security question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    questions,
    selectedQuestion,
    answer,
    fieldErrors,
    serverMessage,
    isSubmitting,
    handleChangeQuestion,
    handleChangeAnswer,
    handleSubmit,
  };
};
