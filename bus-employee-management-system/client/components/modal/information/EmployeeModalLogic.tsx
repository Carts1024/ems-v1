/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';

export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthdate: string;
  email: string;
  contact: string;
  houseStreetBarangay: string;
  city: string;
  stateProvinceRegion: string;
  country: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactNo: string;
  status: string;
  dateHired: string;
  employeeType: string;
  employeeClassification: string,
  department: string;
  position: string;
  basicPay: string;
  govtIdType: string;
  govtIdNo: string;
  licenseType: string;
  licenseNo: string;
  restrictionCodes: string[];
  expireDate: string;
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
const isValidDateHired = (date: string) => new Date(date) <= new Date();
const isPastDate = (date: string) => new Date(date) < new Date();

export const useEmployeeModal = (
  isEdit: boolean,
  defaultValue: Employee | undefined,
  existingEmployees: Employee[],
  onSubmit: (employee: Employee) => void,
  onClose: () => void
) => {
  const [employee, setEmployee] = useState<Employee>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthdate: '',
    email: '',
    contact: '',
    houseStreetBarangay: '',
    city: '',
    stateProvinceRegion: '',
    country: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactNo: '',
    status: '',
    dateHired: '',
    employeeType: '',
    employeeClassification: '',
    department: '',
    position: '',
    basicPay: '',
    govtIdType: '',
    govtIdNo: '',
    licenseType: 'professional',
    licenseNo: '',
    restrictionCodes: [],
    expireDate: '',
    ...defaultValue,
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof Employee]?: string }>({});

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num)
      ? ''
      : num.toLocaleString('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 2,
        });
  };

  const validateInput = () => {
    const errors: typeof fieldErrors = {};
    if (!employee.firstName.trim()) errors.firstName = 'Required';
    if (!employee.lastName.trim()) errors.lastName = 'Required';
    if (!employee.birthdate || !isAtLeast18(employee.birthdate)) errors.birthdate = 'Must be at least 18 years old.';
    if (!employee.email || !isValidEmail(employee.email)) errors.email = 'Invalid email format.';
    if (!isValidContact(employee.contact) || !isValidPhilippineContact(employee.contact)) errors.contact = 'Invalid format.';
    if (!employee.houseStreetBarangay) errors.houseStreetBarangay = 'Required';
    if (!employee.city) errors.city = 'Required';
    if (!employee.stateProvinceRegion) errors.stateProvinceRegion = 'Required';
    if (!employee.country) errors.country = 'Required';
    if (!employee.zipCode) errors.zipCode = 'Required';
    if (!employee.emergencyContactName) errors.emergencyContactName = 'Required';
    if (!employee.emergencyContactNo || !/^(09)\d{9}$/.test(employee.emergencyContactNo)) errors.emergencyContactNo = 'Invalid format.';
    if (!employee.status) errors.status = 'Required';
    if (!employee.dateHired || !isValidDateHired(employee.dateHired)) errors.dateHired = 'Date Hired cannot be a future date.';
    if (!employee.employeeType) errors.employeeType = 'Required';
    if (!employee.employeeClassification) errors.employeeClassification = 'Required';
    if (!employee.department) errors.department = 'Required';
    if (!employee.position.trim()) errors.position = 'Required';

    const pay = parseFloat(employee.basicPay);
    if (!employee.basicPay || isNaN(pay) || pay < 0) {
      errors.basicPay = 'Required and must be a non-negative number.';
    } else {
      employee.basicPay = pay.toFixed(2); // always store formatted decimal string
    }

    if (!employee.licenseNo && employee.position.toLowerCase() === 'driver') errors.licenseNo = 'Required';
    if (employee.position.toLowerCase() === 'driver') {
      if (!employee.licenseNo) {
        errors.licenseNo = 'Required for drivers';
      }

      if (
        employee.position.toLowerCase() === 'driver' &&
        !employee.restrictionCodes.includes('D : Passenger Bus (M3)')
      ) {
        errors.restrictionCodes = 'Restriction Code D is required to operate a passenger bus';
      }

      if (employee.expireDate && isPastDate(employee.expireDate)) {
        errors.expireDate = 'Expiry date cannot be in the past.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isDuplicateEmployee = () => {
    return existingEmployees.some(emp =>
      `${emp.firstName}${emp.middleName}${emp.lastName}`.toLowerCase() ===
      `${employee.firstName}${employee.middleName}${employee.lastName}`.toLowerCase() &&
      (!isEdit ||
        `${emp.firstName}${emp.middleName}${emp.lastName}`.toLowerCase() !==
        `${defaultValue?.firstName}${defaultValue?.middleName}${defaultValue?.lastName}`.toLowerCase())
    );
  };

  const handleChange = (field: keyof Employee, value: string | string[]) => {
    setEmployee(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const isValid = validateInput();
    if (!isValid) {
      showError('Error', 'Please correct the highlighted errors.');
      return;
    }
    if (isDuplicateEmployee()) {
      showError('Oops!', 'Employee already exists.');
      return;
    }
    onSubmit(employee);
    showSuccess('Success', 'Employee added successfully.');
    onClose();
  };

  const handleUpdateConfirm = async () => {
    const isValid = validateInput();
    if (!isValid) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }
    if (isDuplicateEmployee()) {
      showError('Oops!', 'Employee already exists.');
      return;
    }
    onSubmit(employee);
    showSuccess('Success', 'Employee updated successfully.');
    onClose();
  };

  return {
    employee,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
    formatCurrency
  };
};