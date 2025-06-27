import { useState } from 'react';
import { showConfirmation, showSuccess } from '@/app/utils/swal';

// Types
interface WorkExperience {
  company: string;
  position: string;
  from: string;
  to: string;
  description: string;
}

interface Education {
  institute: string;
  degree: string;
  specialization: string;
  completionDate: string;
}

export const useCandidateRecords = () => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
        "company": "DLTB Co.",
        "position": "Driver",
        "from": "2024-04-15",
        "to": "2024-05-15",
        "description": ""
    }
  ]);
  const [educationList, setEducationList] = useState<Education[]>([
    {
        "institute": "TESDA",
        "degree": "NC III",
        "specialization": "Driving",
        "completionDate": "2023-06-25"
    }
  ]);

  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [editingEducIndex, setEditingEducIndex] = useState<number | null>(null);

  const [tempWork, setTempWork] = useState<WorkExperience>({ company: '', position: '', from: '', to: '', description: '' });
  const [tempEduc, setTempEduc] = useState<Education>({ institute: '', degree: '', specialization: '', completionDate: '' });

  const [workDateError, setWorkDateError] = useState<{ from?: string; to?: string }>({});
  const [educDateError, setEducDateError] = useState('');

  const isDateValid = (dateStr: string) => {
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today;
  };

  const validateWorkDates = (from: string, to: string) => {
    const errors: { from?: string; to?: string } = {};

    if (from && !isDateValid(from)) {
      errors.from = 'From date cannot be in the future.';
    }

    if (to && !isDateValid(to)) {
      errors.to = 'To date cannot be in the future.';
    }

    if (from && to && from === to) {
      errors.to = 'To date cannot be the same as From date.';
    }

    if (from && to && new Date(to) < new Date(from)) {
      errors.to = 'To date cannot be earlier than From date.';
    }

    setWorkDateError(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEducDate = () => {
    if (tempEduc.completionDate && !isDateValid(tempEduc.completionDate)) {
      setEducDateError('Date cannot be in the future.');
      return false;
    }
    setEducDateError('');
    return true;
  };

  const isTempWorkValid =
    tempWork.company.trim() &&
    tempWork.position.trim() &&
    tempWork.from &&
    tempWork.to &&
    isDateValid(tempWork.from) &&
    isDateValid(tempWork.to);

  const isTempEducValid =
    tempEduc.institute.trim() &&
    tempEduc.degree.trim() &&
    tempEduc.specialization.trim() &&
    tempEduc.completionDate &&
    isDateValid(tempEduc.completionDate);

  const addWork = () => {
    setEditingWorkIndex(workExperiences.length);
    setTempWork({ company: '', position: '', from: '', to: '', description: '' });
  };

  const saveWork = () => {
    if (!validateWorkDates(tempWork.from, tempWork.to)) return;

    const updated = [...workExperiences];
    if (editingWorkIndex === workExperiences.length) updated.push(tempWork);
    else updated[editingWorkIndex!] = tempWork;
    setWorkExperiences(updated);
    setEditingWorkIndex(null);
    showSuccess('Success', 'Record added successfully');
  };

  const editWork = (index: number) => {
    setEditingWorkIndex(index);
    setTempWork(workExperiences[index]);
  };

  const cancelWorkEdit = () => {
    setEditingWorkIndex(null);
  };

  const deleteWork = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this record?');
    if (result.isConfirmed) {
      setWorkExperiences(prev => prev.filter((_, i) => i !== index));
      showSuccess('Success', 'Record deleted successfully');
    }
  };

  const addEducation = () => {
    setEditingEducIndex(educationList.length);
    setTempEduc({ institute: '', degree: '', specialization: '', completionDate: '' });
  };

  const saveEducation = async () => {
    if (!validateEducDate()) return;

    const isEditing = editingEducIndex !== educationList.length;

    if (isEditing) {
      const result = await showConfirmation('Are you sure you want to update this education record?');
      if (!result.isConfirmed) return;
    }

    const updated = [...educationList];
    if (editingEducIndex === educationList.length) {
      updated.push(tempEduc);
      showSuccess('Success', 'Record added successfully');
    } else {
      updated[editingEducIndex!] = tempEduc;
      showSuccess('Success', 'Record updated successfully');
    }

    setEducationList(updated);
    setEditingEducIndex(null);
  };

  const editEducation = (index: number) => {
    setEditingEducIndex(index);
    setTempEduc(educationList[index]);
  };

  const cancelEducationEdit = () => {
    setEditingEducIndex(null);
  };

  const deleteEducation = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this record?');
    if (result.isConfirmed) {
      setEducationList(prev => prev.filter((_, i) => i !== index));
      showSuccess('Success', 'Record deleted successfully');
    }
  };

  return {
    workExperiences,
    tempWork,
    editingWorkIndex,
    setTempWork,
    addWork,
    saveWork,
    editWork,
    cancelWorkEdit,
    deleteWork,
    isTempWorkValid,
    workDateError,
    setWorkDateError,
    validateWorkDates,

    educationList,
    tempEduc,
    editingEducIndex,
    setTempEduc,
    addEducation,
    saveEducation,
    editEducation,
    cancelEducationEdit,
    deleteEducation,
    isTempEducValid,
    educDateError,
    setEducDateError,
  };
};