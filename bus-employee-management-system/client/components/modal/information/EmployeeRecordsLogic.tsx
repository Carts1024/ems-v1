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

export interface GovernmentID {
  idType: string;
  idNumber: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
}

export interface GovIdErrors {
  idNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  status?: string;
}

interface Deduction {
  reason: string;
  frequency: string;
  type: 'fixed' | 'percentage';
  amount: string;
  effectiveDate: string;
  endDate: string;
  status: string;
}

interface Benefit {
  benefit: string;
  frequency: string;
  amount: string;
  effectiveDate: string;
  endDate: string;
  status: string;
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
  const [tempGovId, setTempGovId] = useState<GovernmentID>({ idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: '' });
  const [govIdError, setGovIdError] = useState<{
    idNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
    status?: string;
  }>({});


  // Deduction
  const [deductionList, setDeductionList] = useState<Deduction[]>([]);
  const [editingDeductIndex, setEditingDeductIndex] = useState<number | null>(null);
  const [tempDeduct, setTempDeduct] = useState<Deduction>({
    reason: '', frequency:'', type: 'fixed', amount: '', effectiveDate: '', endDate: '', status: ''
  });
  const [deductFieldError, setDeductFieldError] = useState<{
    reason?: string;
    frequency?: string;
    type?: string;
    amount?: string;
    effectiveDate?: string;
    endDate?: string;
    status?: string;
  }>({});

  // Benefit
  const [benefitList, setBenefitList] = useState<Benefit[]>([]);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState<number | null>(null);
  const [tempBenefit, setTempBenefit] = useState<Benefit>({
    benefit: '', frequency:'', amount: '', effectiveDate: '', endDate: '', status: ''
  });
  const [benefitFieldError, setBenefitFieldError] = useState<{
    benefit?: string;
    frequency?: string;
    amount?: string;
    effectiveDate?: string;
    endDate?: string;
    status?: string;
  }>({});

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
  const isTempWorkValid = Boolean(
    tempWork.company.trim() &&
    tempWork.position.trim() &&
    tempWork.from &&
    tempWork.to &&
    isDateValid(tempWork.from) &&
    isDateValid(tempWork.to)
  );

  const isTempEducValid = Boolean(
    tempEduc.institute.trim() &&
    tempEduc.degree.trim() &&
    tempEduc.specialization.trim() &&
    tempEduc.completionDate &&
    isDateValid(tempEduc.completionDate)
  );

  const isTempDeductValid = Boolean(
    tempDeduct.reason.trim() &&
    tempDeduct.amount.trim() &&
    tempDeduct.effectiveDate &&
    isDateValid(tempDeduct.effectiveDate)
  );

  const isTempBenefitValid = Boolean(
    tempBenefit.benefit.trim() &&
    tempBenefit.amount.trim() &&
    tempBenefit.effectiveDate &&
    isDateValid(tempBenefit.effectiveDate)
  );

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
    setTempGovId({ idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: '' });
  };

  const saveGovernmentID = () => {
    const formatError = validateGovIdFormat(tempGovId.idType, tempGovId.idNumber);

    const errors: {
      idNumber?: string;
      issuedDate?: string;
      expiryDate?: string;
      status?: string;
    } = {};

    if (!tempGovId.issuedDate) errors.issuedDate = 'Required';
    if (!tempGovId.expiryDate) errors.expiryDate = 'Required';
    if (!tempGovId.status) errors.status = 'Required';

    // Date logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const issued = new Date(tempGovId.issuedDate);
    const expiry = new Date(tempGovId.expiryDate);

    if (tempGovId.issuedDate && issued > today) {
      errors.issuedDate = 'Issued date cannot be in the future.';
    }

    if (tempGovId.expiryDate && expiry < today) {
      errors.expiryDate = 'Expiration date cannot be in the past.';
    }

    if (tempGovId.issuedDate && tempGovId.expiryDate && tempGovId.issuedDate === tempGovId.expiryDate) {
      errors.expiryDate = 'Expiration date cannot be the same as issued date.';
    }

    if (tempGovId.issuedDate && tempGovId.expiryDate && expiry < issued) {
      errors.expiryDate = 'Expiration date cannot be earlier than issued date.';
    }

    if (formatError) {
      errors.idNumber = formatError;
    }

    if (Object.keys(errors).length > 0) {
      setGovIdError(errors); // Make sure govIdError is an object state
      return;
    }

    setGovIdError({}); // Clear errors

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
    setTempDeduct({ reason: '', frequency: '', type: 'fixed', amount: '', effectiveDate: '', endDate: '', status: '' });
  };

  const saveDeduction = () => {
    const errors: {
      reason?: string;
      frequency?: string;
      type?: string;
      amount?: string;
      effectiveDate?: string;
      endDate?: string;
      status?: string;
    } = {};

    const { reason, frequency, type, amount, effectiveDate, endDate, status } = tempDeduct;

    // Required fields
    if (!reason) errors.reason = 'Required';
    if (!frequency) errors.frequency = 'Required';
    if (!type) errors.type = 'Required';

    const amt = parseFloat(amount);
    if (!amount) {
      errors.amount = 'Required';
    } else if (type === 'fixed' && (isNaN(amt) || amt < 0)) {
      errors.amount = 'Must be a non-negative number.';
    } else if (type === 'percentage' && (isNaN(amt) || amt < 1 || amt > 50)) {
      errors.amount = 'Must be between 1 and 50.';
    }

    if (!effectiveDate) errors.effectiveDate = 'Required';
    if (!endDate) errors.endDate = 'Required';
    if (!status) errors.status = 'Required';

    const effDate = new Date(effectiveDate);
    const expDate = new Date(endDate);

    // Date comparisons
    if (effectiveDate && endDate) {
      if (effectiveDate === endDate) {
        errors.endDate = 'End date cannot be the same as effective date.';
      }
      if (expDate < effDate) {
        errors.endDate = 'End date cannot be earlier than effective date.';
      }
      if (effDate > expDate) {
        errors.effectiveDate = 'Effective date cannot be later than end date.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setDeductFieldError(errors);
      return;
    }

    setDeductFieldError({});

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

  // Benefit logic
    const addBenefit = () => {
    setEditingBenefitIndex(benefitList.length);
    setTempBenefit({ benefit: '', frequency: '', amount: '', effectiveDate: '', endDate: '', status: '' });
  };

  const saveBenefit = () => {
    const errors: {
      benefit?: string;
      frequency?: string;
      amount?: string;
      effectiveDate?: string;
      endDate?: string;
      status?: string;
    } = {};

    const { benefit, frequency, amount, effectiveDate, endDate, status } = tempBenefit;

    // Required fields
    if (!benefit) errors.benefit = 'Required';
    if (!frequency) errors.frequency = 'Required';
    if (!amount) errors.amount = 'Required';
    if (!effectiveDate) errors.effectiveDate = 'Required';
    if (!endDate) errors.endDate = 'Required';
    if (!status) errors.status = 'Required';

    const effDate = new Date(effectiveDate);
    const expDate = new Date(endDate);

    // Date comparisons
    if (effectiveDate && endDate) {
      if (effectiveDate === endDate) {
        errors.endDate = 'End date cannot be the same as effective date.';
      }
      if (expDate < effDate) {
        errors.endDate = 'End date cannot be earlier than effective date.';
      }
      if (effDate > expDate) {
        errors.effectiveDate = 'Effective date cannot be later than end date.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setBenefitFieldError(errors);
      return;
    }

    setBenefitFieldError({});

    const updated = [...benefitList];
    if (editingBenefitIndex === benefitList.length) {
      updated.push(tempBenefit);
      showSuccess('Success', 'Benefit added');
    } else {
      updated[editingBenefitIndex!] = tempBenefit;
      showSuccess('Success', 'Benefit updated');
    }

    setBenefitList(updated);
    setEditingBenefitIndex(null);
  };

  const editBenefit = (index: number) => {
    setEditingBenefitIndex(index);
    setTempBenefit(benefitList[index]);
  };

  const cancelBenefitEdit = () => setEditingBenefitIndex(null);

  const deleteBenefit = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this benefit?');
    if (result.isConfirmed) {
      setBenefitList(prev => prev.filter((_, i) => i !== index));
      showSuccess('Deleted!', 'Benefit removed.');
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
    deductFieldError,
    setDeductFieldError,

    // Benefit
    benefitList,
    tempBenefit,
    editingBenefitIndex,
    setTempBenefit,
    addBenefit,
    saveBenefit,
    editBenefit,
    cancelBenefitEdit,
    deleteBenefit,
    isTempBenefitValid,
    benefitFieldError,
    setBenefitFieldError
  };
};