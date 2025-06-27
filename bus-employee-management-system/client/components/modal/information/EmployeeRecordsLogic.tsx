import { useState, useCallback } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';
import { WorkExperience, Education, GovernmentID, Deduction, Benefit } from '@/types/employee';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types for API data
interface DeductionData {
  deductionTypeId: number | null;
  frequency: string;
  type: string;
  value: number;
  effectiveDate: string;
  endDate: string;
  isActive: boolean;
}

interface ApiDeduction {
  id: number;
  deductionType?: { name: string };
  frequency: string;
  type: string;
  value: number;
  effectiveDate: string;
  endDate: string;
  isActive: boolean;
}

interface BenefitData {
  benefitTypeId: number | null;
  frequency: string;
  value: number;
  effectiveDate: string;
  endDate: string | null;
  isActive: boolean;
}

interface ApiBenefit {
  id: number;
  benefitType?: { name: string };
  frequency: string;
  value: number;
  effectiveDate: string;
  endDate: string;
  isActive: boolean;
}

// API functions for deductions
const fetchDeductionTypes = async () => {
  try {
    const response = await fetch(`${API_URL}/deduction/types`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch deduction types');
    return await response.json();
  } catch (error) {
    console.error('Error fetching deduction types:', error);
    return [];
  }
};

const fetchEmployeeDeductions = async (employeeId: string) => {
  try {
    const response = await fetch(`${API_URL}/employees/${employeeId}/deductions`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch deductions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching deductions:', error);
    return [];
  }
};

const createEmployeeDeduction = async (employeeId: string, deductionData: DeductionData) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/deductions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deductionData),
  });
  if (!response.ok) throw new Error('Failed to create deduction');
  return await response.json();
};

const updateEmployeeDeduction = async (employeeId: string, deductionId: number, deductionData: DeductionData) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/deductions/${deductionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deductionData),
  });
  if (!response.ok) throw new Error('Failed to update deduction');
  return await response.json();
};

const deleteEmployeeDeduction = async (employeeId: string, deductionId: number) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/deductions/${deductionId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete deduction');
  return await response.json();
};

const updateEmployeeBasicRate = async (employeeId: string, basicRate: number) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ basicRate }),
  });
  if (!response.ok) throw new Error('Failed to update basic rate');
  return await response.json();
};

// API functions for benefits
const fetchBenefitTypes = async () => {
  try {
    const response = await fetch(`${API_URL}/benefit/types`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch benefit types');
    return await response.json();
  } catch (error) {
    console.error('Error fetching benefit types:', error);
    return [];
  }
};

const fetchEmployeeBenefits = async (employeeId: string) => {
  try {
    const response = await fetch(`${API_URL}/employees/${employeeId}/benefits`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch benefits');
    return await response.json();
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return [];
  }
};

const createEmployeeBenefit = async (employeeId: string, benefitData: BenefitData) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/benefits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(benefitData),
  });
  if (!response.ok) throw new Error('Failed to create benefit');
  return await response.json();
};

const updateEmployeeBenefit = async (employeeId: string, benefitId: number, benefitData: BenefitData) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/benefits/${benefitId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(benefitData),
  });
  if (!response.ok) throw new Error('Failed to update benefit');
  return await response.json();
};

const deleteEmployeeBenefit = async (employeeId: string, benefitId: number) => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/benefits/${benefitId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete benefit');
  return await response.json();
};

export const useEmployeeRecords = (
  initialGovernmentIds: GovernmentID[] = [], 
  employeeId?: string,
  governmentIdTypes: { id: number, name: string }[] = []
) => {
  // Work Experience
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      companyName: "DLTB Co.",
      position: "Driver",
      from: "2024-04-15",
      to: "2024-05-15",
      description: ""
    }
  ]);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [tempWork, setTempWork] = useState<WorkExperience>({
    companyName: '', position: '', from: '', to: '', description: '',
  });
  const [workDateError, setWorkDateError] = useState<{ from?: string; to?: string }>({});

  // Education
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [editingEducIndex, setEditingEducIndex] = useState<number | null>(null);
  const [tempEduc, setTempEduc] = useState<Education>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    endDate: ''
  });
  const [educDateError, setEducDateError] = useState('');


  // Government ID
  const [governmentIds, setGovernmentIds] = useState<GovernmentID[]>(initialGovernmentIds);
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
  const [deductionTypes, setDeductionTypes] = useState<{ id: number, name: string }[]>([]);
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
  const [benefitTypes, setBenefitTypes] = useState<{ id: number, name: string }[]>([]);
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
  }>({});

  // Utility
  const isDateValid = (dateStr: string) => {
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today;
  };

  // Utility function to calculate benefit/deduction status based on dates
  const calculateStatus = (effectiveDate: string, endDate: string) => {
    if (!effectiveDate) return 'Pending';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const effective = new Date(effectiveDate);
    effective.setHours(0, 0, 0, 0);
    
    // If no end date, it's active if effective date has passed
    if (!endDate) {
      return effective <= today ? 'Active' : 'Pending';
    }
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    // Check date ranges
    if (today < effective) {
      return 'Pending'; // Not started yet
    } else if (today >= effective && today <= end) {
      return 'Active'; // Currently active
    } else {
      return 'Expired'; // Past end date
    }
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
    if (tempEduc.endDate && !isDateValid(tempEduc.endDate)) {
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
      case 'PAG-IBIG':
        return /^\d{4}-\d{4}-\d{4}$/.test(number) ? null : 'Pag-IBIG must be in ####-####-#### format.';
      case 'PHILHEALTH':
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
    tempWork.companyName.trim() &&
    tempWork.position.trim() &&
    tempWork.from &&
    tempWork.to &&
    isDateValid(tempWork.from) &&
    isDateValid(tempWork.to)
  );

  const isTempEducValid = Boolean(
    tempEduc.institution.trim() &&
    tempEduc.degree.trim() &&
    tempEduc.fieldOfStudy.trim() &&
    tempEduc.endDate &&
    isDateValid(tempEduc.endDate)
  );

  const isTempDeductValid = Boolean(
    tempDeduct.reason.trim() &&
    tempDeduct.amount.trim() &&
    tempDeduct.effectiveDate &&
    isDateValid(tempDeduct.effectiveDate)
  );

  const isTempBenefitValid = Boolean(
    tempBenefit.benefit.trim() &&
    tempBenefit.frequency.trim() &&
    tempBenefit.amount.trim() &&
    tempBenefit.effectiveDate &&
    isDateValid(tempBenefit.effectiveDate)
  );

  // Work logic
  const addWork = () => {
    setEditingWorkIndex(workExperiences.length);
    setTempWork({ companyName: '', position: '', from: '', to: '', description: '' });
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
    setTempEduc({ institution: '', degree: '', fieldOfStudy: '', endDate: '' });
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
    setTempEduc({ institution: '', degree: '', fieldOfStudy: '', endDate: '' });
  };

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

  // Auto-calculate status based on dates
  const calculateIdStatus = (issuedDate: string, expiryDate: string): string => {
    if (!issuedDate || !expiryDate) return 'Pending';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const issued = new Date(issuedDate);
    const expiry = new Date(expiryDate);
    
    if (issued > today) {
      return 'Pending';
    } else if (expiry < today) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };

  const addGovernmentID = () => {
    setEditingGovIdIndex(governmentIds.length);
    setTempGovId({ idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: '' });
  };

  const saveGovernmentID = async () => {
    const formatError = validateGovIdFormat(tempGovId.idType, tempGovId.idNumber);

    const errors: {
      idNumber?: string;
      issuedDate?: string;
      expiryDate?: string;
      status?: string;
    } = {};

    if (!tempGovId.idType) errors.idNumber = 'ID Type is required';
    if (!tempGovId.idNumber) errors.idNumber = 'ID Number is required';
    if (!tempGovId.issuedDate) errors.issuedDate = 'Required';
    if (!tempGovId.expiryDate) errors.expiryDate = 'Required';

    // Date logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const issued = new Date(tempGovId.issuedDate);
    const expiry = new Date(tempGovId.expiryDate);

    if (tempGovId.issuedDate && issued > today) {
      errors.issuedDate = 'Issued date cannot be in the future.';
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
      setGovIdError(errors);
      return;
    }

    setGovIdError({}); // Clear errors

    // Auto-calculate status based on dates
    const calculatedStatus = calculateIdStatus(tempGovId.issuedDate, tempGovId.expiryDate);
    const govIdWithStatus = { ...tempGovId, status: calculatedStatus };

    // For new employees (no employeeId), just update local state
    if (!employeeId) {
      const updated = [...governmentIds];
      if (editingGovIdIndex === governmentIds.length) {
        updated.push(govIdWithStatus);
      } else {
        updated[editingGovIdIndex!] = govIdWithStatus;
      }
      setGovernmentIds(updated);
      setEditingGovIdIndex(null);
      setTempGovId({ idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: '' });
      showSuccess('Success', 'Government ID saved locally');
      return;
    }

    // For existing employees, save to backend
    try {
      // Find the government ID type to get its ID
      const govIdType = governmentIdTypes.find(type => type.name === tempGovId.idType);
      if (!govIdType) {
        showError('Error', 'Invalid government ID type selected');
        return;
      }

      const govIdData = {
        employeeId: employeeId,
        typeId: govIdType.id,
        idNumber: tempGovId.idNumber,
        issuedDate: tempGovId.issuedDate,
        expiryDate: tempGovId.expiryDate,
        isActive: calculatedStatus === 'Active',
      };

      let response;
      if (editingGovIdIndex === governmentIds.length) {
        // Add new government ID
        response = await fetch(`${API_URL}/government-id`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(govIdData),
        });
      } else {
        // Update existing government ID
        const govId = governmentIds[editingGovIdIndex!];
        const govIdId = govId.id; // Remove type assertion since id should be properly typed
        
        if (!govIdId) {
          showError('Error', 'Government ID does not have a valid ID for updating');
          return;
        }
        
        response = await fetch(`${API_URL}/government-id/${govIdId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(govIdData),
        });
      }

      if (!response.ok) throw new Error('Failed to save government ID');
      
      const savedGovId = await response.json();
      
      // Update local state with calculated status
      const updatedGovId = { ...savedGovId, status: calculatedStatus };
      const updated = [...governmentIds];
      if (editingGovIdIndex === governmentIds.length) {
        updated.push(updatedGovId);
      } else {
        updated[editingGovIdIndex!] = updatedGovId;
      }
      setGovernmentIds(updated);
      setEditingGovIdIndex(null);
      setTempGovId({ idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: '' });
      showSuccess('Success', 'Government ID saved');
    } catch (error) {
      showError('Error', 'Failed to save government ID: ' + (error as Error).message);
    }
  };

  const editGovernmentID = (index: number) => {
    setEditingGovIdIndex(index);
    const govId = governmentIds[index];
    // Ensure we have the correct data structure for editing
    setTempGovId({
      ...govId,
      idType: govId.idType || '', // Make sure idType is populated
      idNumber: govId.idNumber || '',
      issuedDate: govId.issuedDate || '',
      expiryDate: govId.expiryDate || '',
      status: govId.status || ''
    });
  };

  const cancelGovernmentIDEdit = () => {
    setEditingGovIdIndex(null);
    setTempGovId({ idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: '' });
  };

  const deleteGovernmentID = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this ID?');
    if (result.isConfirmed) {
      // For new employees (no employeeId), just update local state
      if (!employeeId) {
        setGovernmentIds(prev => prev.filter((_, i) => i !== index));
        showSuccess('Deleted!', 'ID record removed.');
        return;
      }

      // For existing employees, delete from backend
      try {
        const govId = governmentIds[index];
        const govIdId = govId.id;
        
        if (!govIdId) {
          showError('Error', 'Government ID does not have a valid ID for deletion');
          return;
        }
        
        const response = await fetch(`${API_URL}/government-id/${govIdId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete government ID');
        
        // Update local state
        setGovernmentIds(prev => prev.filter((_, i) => i !== index));
        showSuccess('Deleted!', 'ID record removed.');
      } catch (error) {
        showError('Error', 'Failed to delete government ID: ' + (error as Error).message);
      }
    }
  };

  // Load deduction types
  const loadDeductionTypes = useCallback(async () => {
    try {
      const types = await fetchDeductionTypes();
      setDeductionTypes(types || []);
    } catch (error) {
      console.error('Error loading deduction types:', error);
      setDeductionTypes([]);
    }
  }, []);

  // Load employee deductions
  const loadEmployeeDeductions = useCallback(async () => {
    if (!employeeId) return;
    
    try {
      const deductions = await fetchEmployeeDeductions(employeeId);
      // Transform backend data to frontend format
      const transformedDeductions = (deductions || []).map((d: ApiDeduction) => ({
        id: d.id,
        reason: d.deductionType?.name || '',
        frequency: d.frequency || '',
        type: d.type || 'fixed',
        amount: d.value?.toString() || '',
        effectiveDate: d.effectiveDate ? new Date(d.effectiveDate).toISOString().split('T')[0] : '',
        endDate: d.endDate ? new Date(d.endDate).toISOString().split('T')[0] : '',
        status: d.isActive ? 'Active' : 'Inactive'
      }));
      setDeductionList(transformedDeductions);
    } catch (error) {
      console.error('Error loading employee deductions:', error);
      setDeductionList([]);
    }
  }, [employeeId]);

  // Load benefit types
  const loadBenefitTypes = useCallback(async () => {
    try {
      const types = await fetchBenefitTypes();
      setBenefitTypes(types || []);
    } catch (error) {
      console.error('Error loading benefit types:', error);
      setBenefitTypes([]);
    }
  }, []);

  // Load employee benefits
  const loadEmployeeBenefits = useCallback(async () => {
    if (!employeeId) return;
    
    try {
      const benefits = await fetchEmployeeBenefits(employeeId);
      // Transform backend data to frontend format
      const transformedBenefits = (benefits || []).map((b: ApiBenefit) => {
        const effectiveDate = b.effectiveDate ? new Date(b.effectiveDate).toISOString().split('T')[0] : '';
        const endDate = b.endDate ? new Date(b.endDate).toISOString().split('T')[0] : '';
        // Auto-calculate status based on dates rather than using backend isActive
        const calculatedStatus = calculateStatus(effectiveDate, endDate);
        
        return {
          id: b.id,
          benefit: b.benefitType?.name || '',
          frequency: b.frequency || '',
          amount: b.value?.toString() || '',
          effectiveDate,
          endDate,
          status: calculatedStatus
        };
      });
      setBenefitList(transformedBenefits);
    } catch (error) {
      console.error('Error loading employee benefits:', error);
      setBenefitList([]);
    }
  }, [employeeId]);

  // Update basic rate
  const updateBasicRate = async (newBasicRate: number) => {
    if (!employeeId) {
      showError('Error', 'No employee ID provided');
      return false;
    }

    try {
      await updateEmployeeBasicRate(employeeId, newBasicRate);
      showSuccess('Success', 'Basic rate updated successfully');
      return true;
    } catch (error) {
      showError('Error', 'Failed to update basic rate: ' + (error as Error).message);
      return false;
    }
  };

  // Deduction logic
    const addDeduction = () => {
    setEditingDeductIndex(deductionList.length);
    setTempDeduct({ reason: '', frequency: '', type: 'fixed', amount: '', effectiveDate: '', endDate: '', status: '' });
  };

  const saveDeduction = async () => {
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
        errors.endDate = 'End date cannot be same as effective date.';
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

    try {
      if (!employeeId) {
        showError('Error', 'No employee ID provided');
        return;
      }

      // Find deduction type ID by name
      const deductionType = deductionTypes.find(dt => dt.name === reason);
      const deductionTypeId = deductionType ? deductionType.id : null;

      const deductionData = {
        deductionTypeId,
        frequency,
        type,
        value: parseFloat(amount),
        effectiveDate,
        endDate,
        isActive: status === 'Active'
      };

      if (editingDeductIndex === deductionList.length) {
        // Create new deduction
        const newDeduction = await createEmployeeDeduction(employeeId, deductionData);
        const formattedDeduction = {
          id: newDeduction.id,
          reason,
          frequency,
          type,
          amount,
          effectiveDate,
          endDate,
          status
        };
        setDeductionList(prev => [...prev, formattedDeduction]);
        showSuccess('Success', 'Deduction added');
      } else {
        // Update existing deduction
        const currentDeduction = deductionList[editingDeductIndex!];
        await updateEmployeeDeduction(employeeId, currentDeduction.id as number, deductionData);
        const updated = [...deductionList];
        updated[editingDeductIndex!] = { ...tempDeduct, id: currentDeduction.id };
        setDeductionList(updated);
        showSuccess('Success', 'Deduction updated');
      }

      setEditingDeductIndex(null);
    } catch (error) {
      showError('Error', 'Failed to save deduction: ' + (error as Error).message);
    }
  };

  const editDeduction = (index: number) => {
    setEditingDeductIndex(index);
    setTempDeduct(deductionList[index]);
  };

  const cancelDeductionEdit = () => setEditingDeductIndex(null);

  const deleteDeduction = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this deduction?');
    if (result.isConfirmed) {
      try {
        if (!employeeId) {
          showError('Error', 'No employee ID provided');
          return;
        }

        const deduction = deductionList[index];
        if (deduction.id) {
          await deleteEmployeeDeduction(employeeId, deduction.id);
        }
        
        setDeductionList(prev => prev.filter((_, i) => i !== index));
        showSuccess('Deleted!', 'Deduction removed.');
      } catch (error) {
        showError('Error', 'Failed to delete deduction: ' + (error as Error).message);
      }
    }
  };

  // Benefit logic
    const addBenefit = () => {
    setEditingBenefitIndex(benefitList.length);
    setTempBenefit({ benefit: '', frequency: '', amount: '', effectiveDate: '', endDate: '', status: '' });
  };

  const saveBenefit = async () => {
    const errors: {
      benefit?: string;
      frequency?: string;
      amount?: string;
      effectiveDate?: string;
      endDate?: string;
    } = {};

    const { benefit, frequency, amount, effectiveDate, endDate } = tempBenefit;

    // Required fields
    if (!benefit) errors.benefit = 'Required';
    if (!frequency) errors.frequency = 'Required';
    if (!amount) errors.amount = 'Required';
    if (!effectiveDate) errors.effectiveDate = 'Required';
    // Note: endDate is optional - if not provided, benefit is automatically active

    const amt = parseFloat(amount);
    if (!amount) {
      errors.amount = 'Required';
    } else if (isNaN(amt) || amt < 0) {
      errors.amount = 'Must be a non-negative number.';
    }

    const effDate = new Date(effectiveDate);
    let expDate: Date | null = null;

    // Date comparisons (only if both dates are provided)
    if (effectiveDate && endDate) {
      expDate = new Date(endDate);
      
      if (effectiveDate === endDate) {
        errors.endDate = 'End date cannot be same as effective date.';
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

    try {
      if (!employeeId) {
        showError('Error', 'No employee ID provided');
        return;
      }

      // Find benefit type ID by name
      const benefitType = benefitTypes.find(bt => bt.name === benefit);
      const benefitTypeId = benefitType ? benefitType.id : null;

      // Calculate status automatically based on dates
      const calculatedStatus = calculateStatus(effectiveDate, endDate || '');

      const benefitData = {
        benefitTypeId,
        frequency,
        value: parseFloat(amount),
        effectiveDate,
        endDate: endDate || null, // Send null if endDate is empty
        isActive: calculatedStatus === 'Active'
      };

      if (editingBenefitIndex === benefitList.length) {
        // Create new benefit
        const newBenefit = await createEmployeeBenefit(employeeId, benefitData);
        const formattedBenefit = {
          id: newBenefit.id,
          benefit,
          frequency,
          amount,
          effectiveDate,
          endDate: endDate || '',
          status: calculatedStatus
        };
        setBenefitList(prev => [...prev, formattedBenefit]);
        showSuccess('Success', 'Benefit added');
      } else {
        // Update existing benefit
        const currentBenefit = benefitList[editingBenefitIndex!];
        await updateEmployeeBenefit(employeeId, currentBenefit.id as number, benefitData);
        const updated = [...benefitList];
        updated[editingBenefitIndex!] = { 
          ...tempBenefit, 
          id: currentBenefit.id,
          endDate: endDate || '',
          status: calculatedStatus 
        };
        setBenefitList(updated);
        showSuccess('Success', 'Benefit updated');
      }

      setEditingBenefitIndex(null);
      setTempBenefit({ benefit: '', frequency: '', amount: '', effectiveDate: '', endDate: '', status: '' });
    } catch (error) {
      showError('Error', 'Failed to save benefit: ' + (error as Error).message);
    }
  };

  const editBenefit = (index: number) => {
    setEditingBenefitIndex(index);
    setTempBenefit(benefitList[index]);
    setBenefitFieldError({}); // Clear any previous errors
  };

  const cancelBenefitEdit = () => setEditingBenefitIndex(null);

  const deleteBenefit = async (index: number) => {
    const result = await showConfirmation('Are you sure you want to delete this benefit?');
    if (result.isConfirmed) {
      try {
        if (!employeeId) {
          showError('Error', 'No employee ID provided');
          return;
        }

        const benefit = benefitList[index];
        console.log('Deleting benefit at index:', index, 'Benefit:', benefit);
        console.log('Current benefit list length:', benefitList.length);
        
        // Call backend API first
        if (benefit.id) {
          await deleteEmployeeBenefit(employeeId, benefit.id);
        }
        
        // Clear editing state if we're editing the item being deleted
        if (editingBenefitIndex === index) {
          setEditingBenefitIndex(null);
          setTempBenefit({ benefit: '', frequency: '', amount: '', effectiveDate: '', endDate: '', status: '' });
        }
        
        // Force state update with explicit callback
        setBenefitList(currentList => {
          const newList = currentList.filter((_, i) => i !== index);
          console.log('New benefit list length:', newList.length);
          return newList;
        });
        
        showSuccess('Deleted!', 'Benefit removed.');
      } catch (error) {
        showError('Error', 'Failed to delete benefit: ' + (error as Error).message);
      }
    }
  };

  // Work Details Update function
  const updateWorkDetails = async (workDetails: {
    status?: string;
    dateHired?: string;
    employeeType?: string;
    employeeClassification?: string;
    department?: string;
    position?: string;
  }) => {
    if (!employeeId) {
      showError('Error', 'Cannot update work details for new employee');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/employees/${employeeId}/work-details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workDetails),
      });

      if (!response.ok) throw new Error('Failed to update work details');
      
      showSuccess('Success', 'Work details updated successfully');
    } catch (error) {
      showError('Error', 'Failed to update work details: ' + (error as Error).message);
    }
  };

  // Fetch government IDs for an employee
  const fetchGovernmentIds = useCallback(async (empId: string) => {
    try {
      const response = await fetch(`${API_URL}/government-id?employeeId=${empId}`);
      if (!response.ok) throw new Error('Failed to fetch government IDs');
      
      const data = await response.json();
      
      // Helper function to format dates for input fields
      const formatDateForInput = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${month}-${day}`;
      };
      
      // Update status for each government ID based on dates and transform data structure
      const updatedData = (data || []).map((govId: GovernmentID & { type?: { name: string } }) => ({
        ...govId,
        idType: govId.type?.name || govId.idType || '', // Map type.name to idType for frontend
        issuedDate: formatDateForInput(govId.issuedDate),
        expiryDate: formatDateForInput(govId.expiryDate),
        status: calculateIdStatus(govId.issuedDate, govId.expiryDate)
      }));
      setGovernmentIds(updatedData);
    } catch (error) {
      showError('Error', 'Failed to fetch government IDs: ' + (error as Error).message);
      setGovernmentIds([]);
    }
  }, []);

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
    deductionTypes,
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
    loadDeductionTypes,
    loadEmployeeDeductions,
    updateBasicRate,

    // Benefit
    benefitList,
    benefitTypes,
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
    setBenefitFieldError,
    loadBenefitTypes,
    loadEmployeeBenefits,

    // Work Details
    updateWorkDetails,

    // Fetch Government IDs
    fetchGovernmentIds,
  };
};