import { useState } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';

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

interface GovernmentID {
  idType: string;
  idNumber: string;
}

interface Deduction {
  institute: string;
  amount: string;
  deductionDate: string;
}

export const useEmployeeRecords = () => {
  // Work Experience
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      company: "DLTB Co.",
      position: "Driver",
      from: "2024-04-15",
      to: "2024-05-15",
      description: ""
    }
  ]);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [tempWork, setTempWork] = useState<WorkExperience>({
    company: '', position: '', from: '', to: '', description: '',
  });
  const [workDateError, setWorkDateError] = useState<{ from?: string; to?: string }>({});

  // Education
  const [educationList, setEducationList] = useState<Education[]>([
    {
      institute: "TESDA",
      degree: "NC III",
      specialization: "Driving",
      completionDate: "2023-06-25"
    }
  ]);
  const [editingEducIndex, setEditingEducIndex] = useState<number | null>(null);
  const [tempEduc, setTempEduc] = useState<Education>({
    institute: '', degree: '', specialization: '', completionDate: '',
  });
  const [educDateError, setEducDateError] = useState('');

  // Government ID
  const [governmentIds, setGovernmentIds] = useState<GovernmentID[]>([]);
  const [editingGovIdIndex, setEditingGovIdIndex] = useState<number | null>(null);
  const [tempGovId, setTempGovId] = useState<GovernmentID>({ idType: '', idNumber: '' });
  const [govIdError, setGovIdError] = useState('');

  // Deduction
  const [deductionList, setDeductionList] = useState<Deduction[]>([]);
  const [editingDeductIndex, setEditingDeductIndex] = useState<number | null>(null);
  const [tempDeduct, setTempDeduct] = useState<Deduction>({
    institute: '', amount: '', deductionDate: '',
  });
  const [deductDateError, setDeductDateError] = useState('');

  // Utility
  const isDateValid = (dateStr: string) => {
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today;
  };

  // Work validation
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

  const validateDeductionDate = () => {
    if (tempDeduct.deductionDate && !isDateValid(tempDeduct.deductionDate)) {
      setDeductDateError('Date cannot be in the future.');
      return false;
    }
    setDeductDateError('');
    return true;
  };

  const validateGovIdFormat = (type: string, number: string): string | null => {
    switch (type) {
      case 'SSS':
        return /^\d{2}-\d{7}-\d{1}$/.test(number) ? null : 'SSS must be in ##-#######-# format.';
      case 'Pag-IBIG':
        return /^\d{4}-\d{4}-\d{4}$/.test(number) ? null : 'Pag-IBIG must be in ####-####-#### format.';
      case 'PhilHealth':
        return /^\d{2}-\d{9}-\d{1}$/.test(number) ? null : 'PhilHealth must be in ##-#########-# format.';
      case 'TIN':
        return /^\d{9,12}$/.test(number) ? null : 'TIN must be 9 to 12 digits (no dashes).';
      case 'UMID':
        return /^[A-Za-z0-9]+$/.test(number) ? null : 'UMID must be alphanumeric.';
      default:
        return 'Required';
    }
  };

  // Boolean flags for form button enabling
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

  const isTempDeductValid =
    tempDeduct.institute.trim() &&
    tempDeduct.amount.trim() &&
    tempDeduct.deductionDate &&
    isDateValid(tempDeduct.deductionDate);

  // Work logic
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

  const cancelWorkEdit = () => setEditingWorkIndex(null);

  const deleteWork = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this record?');
    if (result.isConfirmed) {
      setWorkExperiences(prev => prev.filter((_, i) => i !== index));
      showSuccess('Success', 'Record deleted successfully');
    }
  };

  // Education logic
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

  const cancelEducationEdit = () => setEditingEducIndex(null);

  const deleteEducation = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this record?');
    if (result.isConfirmed) {
      setEducationList(prev => prev.filter((_, i) => i !== index));
      showSuccess('Success', 'Record deleted successfully');
    }
  };

  // Government ID logic
  const validateGovernmentIds = () => {
    if (governmentIds.length === 0) {
      showError('Validation Error', 'At least one Government ID is required.');
      return false;
    }
    return true;
  };

  const addGovernmentID = () => {
    setEditingGovIdIndex(governmentIds.length);
    setTempGovId({ idType: '', idNumber: '' });
  };

  const saveGovernmentID = () => {
    const formatError = validateGovIdFormat(tempGovId.idType, tempGovId.idNumber);
    if (formatError) {
      setGovIdError(formatError);
      return;
    }
    setGovIdError('');

    const updated = [...governmentIds];
    if (editingGovIdIndex === governmentIds.length) {
      updated.push(tempGovId);
    } else {
      updated[editingGovIdIndex!] = tempGovId;
    }
    setGovernmentIds(updated);
    setEditingGovIdIndex(null);
    showSuccess('Success', 'Government ID saved');
  };

  const editGovernmentID = (index: number) => {
    setEditingGovIdIndex(index);
    setTempGovId(governmentIds[index]);
  };

  const cancelGovernmentIDEdit = () => setEditingGovIdIndex(null);

  const deleteGovernmentID = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this ID?');
    if (result.isConfirmed) {
      setGovernmentIds(prev => prev.filter((_, i) => i !== index));
      showSuccess('Deleted!', 'ID record removed.');
    }
  };

  // Deduction logic
  const addDeduction = () => {
    setEditingDeductIndex(deductionList.length);
    setTempDeduct({ institute: '', amount: '', deductionDate: '' });
  };

  const saveDeduction = () => {
    if (!validateDeductionDate()) return;

    const updated = [...deductionList];
    if (editingDeductIndex === deductionList.length) {
      updated.push(tempDeduct);
      showSuccess('Success', 'Deduction added');
    } else {
      updated[editingDeductIndex!] = tempDeduct;
      showSuccess('Success', 'Deduction updated');
    }
    setDeductionList(updated);
    setEditingDeductIndex(null);
  };

  const editDeduction = (index: number) => {
    setEditingDeductIndex(index);
    setTempDeduct(deductionList[index]);
  };

  const cancelDeductionEdit = () => setEditingDeductIndex(null);

  const deleteDeduction = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this deduction?');
    if (result.isConfirmed) {
      setDeductionList(prev => prev.filter((_, i) => i !== index));
      showSuccess('Deleted!', 'Deduction removed.');
    }
  };

  return {
    // Work
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

    // Education
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

    // Government ID
    governmentIds,
    tempGovId,
    editingGovIdIndex,
    setTempGovId,
    validateGovernmentIds,
    addGovernmentID,
    saveGovernmentID,
    editGovernmentID,
    cancelGovernmentIDEdit,
    deleteGovernmentID,
    govIdError,

    // Deduction
    deductionList,
    tempDeduct,
    editingDeductIndex,
    setTempDeduct,
    addDeduction,
    saveDeduction,
    editDeduction,
    cancelDeductionEdit,
    deleteDeduction,
    isTempDeductValid,
    deductDateError,
    setDeductDateError,
  };
};