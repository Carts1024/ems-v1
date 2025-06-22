'use client';

import { useState } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';

export interface Candidate {
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  email: string;
  contact: string;
  address: string;
  applicationDate: string;
  sourceOfHire: string;
  department: string;
  position: string;
  applicationStatus: string;
  interviewStatus: string;
  feedback?: string;
}

const isAtLeast18 = (birthdate: string) => {
  const birth = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  return age > 18 || (age === 18 && m >= 0);
};

const isValidEmail = (email: string) => /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
const isValidContact = (contact: string) => /^\d{11}$/.test(contact);
const isValidPhilippineContact = (contact: string) => /^(09)\d{9}$/.test(contact);
const isValidapplicationDate = (date: string) => new Date(date) <= new Date();

export const useCandidateModal = (
  isEdit: boolean,
  defaultValue: Candidate | undefined,
  existingCandidates: Candidate[],
  onSubmit: (candidate: Candidate) => void,
  onClose: () => void
) => {
  const [candidate, setCandidate] = useState<Candidate>({
    firstName: '', middleName: '', lastName: '', birthdate: '',
    email: '', contact: '', address: '', applicationStatus: '', applicationDate: '',
    interviewStatus: '', sourceOfHire: '',department: '', position: '', ...defaultValue,
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof Candidate]?: string }>({});

  const validateInput = () => {
    const errors: typeof fieldErrors = {};
    if (!candidate.firstName.trim()) errors.firstName = 'Required';
    if (!candidate.lastName.trim()) errors.lastName = 'Required';
    if (!candidate.birthdate || !isAtLeast18(candidate.birthdate)) errors.birthdate = 'Must be atleast 18 years old.';
    if (!candidate.email || !isValidEmail(candidate.email)) errors.email = 'Invalid email format.';
    if (!isValidContact(candidate.contact) || !isValidPhilippineContact(candidate.contact)) errors.contact = 'Invalid format.';
    if (!candidate.address) errors.address = 'Required';
    if (!candidate.applicationStatus) errors.applicationStatus = 'Required';
    if (!candidate.applicationDate || !isValidapplicationDate(candidate.applicationDate)) errors.applicationDate = 'Application Date cannot be a future date.';
    if (!candidate.sourceOfHire) errors.sourceOfHire = 'Required';
    if (!candidate.department) errors.department = 'Required';
    if (!candidate.position.trim()) errors.position = 'Required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isDuplicateCandidate = () => {
    return existingCandidates.some(emp =>
      `${emp.firstName}${emp.middleName}${emp.lastName}`.toLowerCase() ===
      `${candidate.firstName}${candidate.middleName}${candidate.lastName}`.toLowerCase() &&
      (!isEdit ||
        `${emp.firstName}${emp.middleName}${emp.lastName}`.toLowerCase() !==
        `${defaultValue?.firstName}${defaultValue?.middleName}${defaultValue?.lastName}`.toLowerCase())
    );
  };

  const handleChange = (field: keyof Candidate, value: string) => {
    setCandidate(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    if (isDuplicateCandidate()) {
      showError('Oops!', 'Candidate already exists.');
      return;
    }
    onSubmit(candidate);
    showSuccess('Success', isEdit ? 'Candidate updated successfully.' : 'Candidate added successfully.');
    onClose();
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) return;
    if (isDuplicateCandidate()) {
      showError('Oops!', 'Candidate already exists.');
      return;
    }
    const result = await showConfirmation('Are you sure you want to update this candidate?');
    if (result.isConfirmed) {
      onSubmit(candidate);
      showSuccess('Success', 'Candidate updated successfully.');
      onClose();
    }
  };

  return {
    candidate,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm
  };
};