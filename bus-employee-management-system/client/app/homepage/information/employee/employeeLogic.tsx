/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { showSuccess, showConfirmation, showError } from '@/app/utils/swal';
import { Employee } from '@/components/modal/information/EmployeeModalLogic';
import { Education } from '@/types/employee';
import { FilterSection } from '@/components/ui/filterDropdown';

// --------- EmployeeLogic.tsx ---------
export const EmployeeLogic = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false); // For create/update/delete operations
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  
  // ---- Department and Position States ----
  const [departments, setDepartments] = useState<{ id: number, departmentName: string }[]>([]);
  const [positions, setPositions] = useState<{ id: number, positionName: string, departmentId: number }[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [filteredPositions, setFilteredPositions] = useState<{ id: number, positionName: string, departmentId: number }[]>([]);

  // ---- Government ID Types State ----
  const [governmentIdTypes, setGovernmentIdTypes] = useState<{ id: number, name: string }[]>([]);

  // ---- Work Experience States ----
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [tempWork, setTempWork] = useState<any>({
          companyName: '', position: '', from: '', to: '', description: ''
  });
  const [isTempWorkValid, setIsTempWorkValid] = useState(true);
  const [workDateError, setWorkDateError] = useState<{ from?: string; to?: string }>({ from: '', to: '' });

  const validateWorkDates = (from: string, to: string) => {
    if (!from || !to) {
      setWorkDateError({ from: !from ? 'Required' : '', to: !to ? 'Required' : '' });
      setIsTempWorkValid(false);
      return false;
    }
    if (new Date(from) > new Date(to)) {
      setWorkDateError({ from: 'From date is after To date', to: '' });
      setIsTempWorkValid(false);
      return false;
    }
    setWorkDateError({ from: '', to: '' });
    setIsTempWorkValid(true);
    return true;
  };

  // ---- Education States ----
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [editingEducIndex, setEditingEducIndex] = useState<number | null>(null);
  const [tempEduc, setTempEduc] = useState<Education>({
    institution: '', degree: '', fieldOfStudy: '', endDate: ''
  });
  const [isTempEducValid, setIsTempEducValid] = useState(true);
  const [educDateError, setEducDateError] = useState<string>('');

  const validateEducDates = (endDate: string) => {
    if (!endDate) {
      setEducDateError('End date is required');
      setIsTempEducValid(false);
      return false;
    }
    setEducDateError('');
    setIsTempEducValid(true);
    return true;
  };

  const addEducation = () => {
    setEditingEducIndex(educationList.length);
    setTempEduc({ institution: '', degree: '', fieldOfStudy: '', endDate: '' });
  };

  const editEducation = (index: number) => {
    setEditingEducIndex(index);
    const selectedEducation = educationList[index];
    setTempEduc({
      institution: selectedEducation?.institution || '',
      degree: selectedEducation?.degree || '',
      fieldOfStudy: selectedEducation?.fieldOfStudy || '',
      endDate: selectedEducation?.endDate || '',
      id: selectedEducation?.id
    });
  };

  const cancelEducationEdit = () => {
    setEditingEducIndex(null);
    setTempEduc({ institution: '', degree: '', fieldOfStudy: '', endDate: '' });
  };

  const saveEducation = async () => {
    if (!validateEducDates(tempEduc.endDate)) return;
    
    // For new employees (no id yet), just update local state
    if (!selectedEmployee || !selectedEmployee.id) {
      // Add or update in local array only
      let newEducArr = [...educationList];
      if (editingEducIndex === educationList.length) {
        newEducArr.push(tempEduc);
      } else if (editingEducIndex !== null) {
        newEducArr[editingEducIndex] = tempEduc;
      }
      setEducationList(newEducArr);
      setEditingEducIndex(null);
      setTempEduc({ institution: '', degree: '', fieldOfStudy: '', endDate: '' });
      showSuccess('Success', 'Education saved locally.');
      return;
    }

    // Prepare education data for API
    const educDto = {
      ...tempEduc,
      employeeId: selectedEmployee.id,
    };

    try {
      let newEducation: any;
      if (editingEducIndex === educationList.length) {
        // ADD
        const res = await fetch(`${API_URL}/education`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(educDto),
        });
        if (!res.ok) throw new Error('Failed to add education');
        newEducation = await res.json();
        setEducationList([...educationList, newEducation]);
        showSuccess('Success', 'Education added.');
      } else {
        // UPDATE
        const id = educationList[editingEducIndex!].id;
        const res = await fetch(`${API_URL}/education/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(educDto),
        });
        if (!res.ok) throw new Error('Failed to update education');
        newEducation = await res.json();
        const updated = educationList.map((edu, idx) =>
          idx === editingEducIndex ? newEducation : edu
        );
        setEducationList(updated);
        showSuccess('Success', 'Education updated.');
      }
      setEditingEducIndex(null);
      setTempEduc({ institution: '', degree: '', fieldOfStudy: '', endDate: '' });
    } catch (err) {
      showError('Error', (err as any).message || 'Failed to save education');
    }
  };

  const deleteEducation = async (index: number) => {
    try {
      const id = educationList[index].id;
      if (id) {
        const res = await fetch(`${API_URL}/education/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete education');
        showSuccess('Success', 'Education deleted.');
      }
      setEducationList(educationList.filter((_, i) => i !== index));
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete education');
    }
  };
  
  // ---- API URL ----
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ---- Fetch Employees Function ----
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/employees`);
      if (!res.ok) throw new Error('Network error');
      
      const data = await res.json();
      const mapped = data.map((emp: any) => ({
        ...emp,
        positionName: emp.position?.positionName || '',
        departmentName: emp.position?.department?.departmentName || '',
      }));
      
      setEmployees(mapped);
      setFilteredEmployees(mapped);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
      throw err; // Re-throw for error handling in calling functions
    }
  }, [API_URL]);

  // ---- Fetch Employees on Mount ----
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ---- Fetch Departments, Positions & Government ID Types ----
  useEffect(() => {
    fetch(`${API_URL}/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => setDepartments([]));
    fetch(`${API_URL}/positions`)
      .then(res => res.json())
      .then(data => setPositions(data))
      .catch(() => setPositions([]));
    fetch(`${API_URL}/government-id-type`)
      .then(res => res.json())
      .then(data => setGovernmentIdTypes(data))
      .catch(() => setGovernmentIdTypes([]));
  }, [API_URL]);

  // ---- Dynamic Position Filtering ----

  // Filter positions based on selected department
  useEffect(() => {
    if (selectedDepartmentId) {
      const filtered = positions.filter(pos => pos.departmentId === selectedDepartmentId);
      setFilteredPositions(filtered);
    } else {
      setFilteredPositions([]);
    }
  }, [selectedDepartmentId, positions]);

  // Handle department change
  const handleDepartmentChange = (departmentId: number) => {
    // If departmentId is 0 or less, reset to null
    if (departmentId <= 0) {
      setSelectedDepartmentId(null);
    } else {
      setSelectedDepartmentId(departmentId);
    }
    
    // Reset position when department changes
    if (selectedEmployee) {
      // Clear position when department changes
      // You can implement this based on your employee update logic
    }
  };

  // ---- Filter logic ----
  const departmentOptions = departments.map(dept => ({
    id: String(dept.id),
    label: dept.departmentName,
  }));
  const positionOptions = positions.map(pos => ({
    id: String(pos.id),
    label: pos.positionName,
  }));

  const uniqueDepartments = Array.from(
    new Set(employees.map(emp => emp.departmentName).filter((d): d is string => d && d.trim() !== ''))
  );
  const uniquePositions = Array.from(
    new Set(employees.map(emp => emp.positionName).filter((p): p is string => p && p.trim() !== ''))
  );

  const filterSections: FilterSection[] = [
    {
      id: "dateHiredRange",
      title: "Date Range",
      type: "dateRange",
      defaultValue: { from: "", to: "" }
    },
    {
      id: "department",
      title: "Department",
      type: "checkbox",
      options: uniqueDepartments.map(dept => ({ id: dept.toLowerCase(), label: dept }))
    },
    {
      id: "position",
      title: "Position",
      type: "checkbox",
      options: uniquePositions.map(pos => ({ id: pos.toLowerCase(), label: pos }))
    },
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "name", label: "Name" },
        { id: "date", label: "Date Hired" }
      ],
      defaultValue: "name"
    },
    {
      id: "order",
      title: "Order",
      type: "radio",
      options: [
        { id: "asc", label: "Ascending" },
        { id: "desc", label: "Descending" }
      ],
      defaultValue: "asc"
    }
  ];

  const handleApplyFilters = (filterValues: Record<string, any>) => {
    let newData = [...employees];
    if (filterValues.department && filterValues.department.length > 0) {
      newData = newData.filter(item => filterValues.department.includes(item.departmentName.toLowerCase()));
    }
    if (filterValues.position && filterValues.position.length > 0) {
      newData = newData.filter(item => filterValues.position.includes(item.positionName.toLowerCase()));
    }
    const fromDate = filterValues.dateHiredRange?.from ? new Date(filterValues.dateHiredRange.from) : null;
    const toDate = filterValues.dateHiredRange?.to ? new Date(filterValues.dateHiredRange.to) : null;
    if (fromDate || toDate) {
      newData = newData.filter(item => {
        const hiredDate = new Date(item.dateHired);
        return (!fromDate || hiredDate >= fromDate) && (!toDate || hiredDate <= toDate);
      });
    }
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) => `${a.lastName}, ${a.firstName}`.localeCompare(`${b.lastName}, ${b.firstName}`) * sortOrder);
    } else if (sortBy === 'date') {
      newData.sort((a, b) => (new Date(a.dateHired).getTime() - new Date(b.dateHired).getTime()) * sortOrder);
    }
    setFilteredEmployees(newData);
  };

  const filteredByText = filteredEmployees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.middleName || ''} ${emp.lastName}`.toLowerCase();
    return (
      (!statusFilter || emp.status === statusFilter) &&
      (!departmentFilter || emp.departmentName === departmentFilter) &&
      (!positionFilter || emp.positionName === positionFilter) &&
      (!searchTerm || fullName.includes(searchTerm.toLowerCase()))
    );
  });

  // ---- Pagination ----
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  // ---- WORK EXPERIENCE: Backend CRUD ----
  function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
  }
  // Fetch all work experiences for the selected employee
  const fetchWorkExperiences = async (employeeId: string) => {
    try {
      const res = await fetch(`${API_URL}/work-experience?employeeId=${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch work experiences');
      const data = await res.json();
      // Normalize data shape here
      const normalized = (data || []).map((w: any) => ({
        id: w.id || w._id,
        companyName: w.companyName || '',
        position: w.position || '',
        from: w.startDate ? formatDate(w.startDate) : '',
        to: w.endDate ? formatDate(w.endDate) : '',
        description: w.description || '',
      }));
      setWorkExperiences(normalized);
    } catch (err) {
      showError('Error', (err as Error).message || 'Could not load work experiences');
      setWorkExperiences([]);
    }
  };

  // Add work experience row (UI only, for new record)
  const addWork = () => {
    setEditingWorkIndex(workExperiences.length);
    setTempWork({ companyName: '', position: '', from: '', to: '', description: '' });
  };

  // Edit work experience row (UI)
  const editWork = (index: number) => {
    setEditingWorkIndex(index);
    setTempWork(workExperiences[index]);
  };

  // Cancel add/edit (UI)
  const cancelWorkEdit = () => setEditingWorkIndex(null);

  const saveWork = async () => {
    // For new employees (no id yet), just update local state
    if (!selectedEmployee || !selectedEmployee.id) {
      // Add or update in local array only
      let newWorkArr = [...workExperiences];
      if (editingWorkIndex === workExperiences.length) {
        newWorkArr.push(tempWork);
      } else if (editingWorkIndex !== null) {
        newWorkArr[editingWorkIndex] = tempWork;
      }
      setWorkExperiences(newWorkArr);
      setEditingWorkIndex(null);
      showSuccess('Success', 'Work Experience saved locally.');
      return;
    }

  // Always map from/to to startDate/endDate
  const { from, to, ...restWork } = tempWork;
  const workDto = {
    ...restWork,
    startDate: from,
    endDate: to,
    employeeId: selectedEmployee.id,
  };

  try {
    let newWorkExp: any;
    if (editingWorkIndex === workExperiences.length) {
      // ADD
      const res = await fetch(`${API_URL}/work-experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workDto),
      });
      if (!res.ok) throw new Error('Failed to add');
      newWorkExp = await res.json();
      setWorkExperiences([...workExperiences, newWorkExp]); // <-- this ensures newWorkExp has id
      showSuccess('Success', 'Work Experience added.');
    } else {
      // UPDATE
      const id = workExperiences[editingWorkIndex!].id;
      const res = await fetch(`${API_URL}/work-experience/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workDto),
      });
      if (!res.ok) throw new Error('Failed to update');
      newWorkExp = await res.json();
      const updated = workExperiences.map((exp, idx) =>
        idx === editingWorkIndex ? newWorkExp : exp
      );
      setWorkExperiences(updated);
      showSuccess('Success', 'Work Experience updated.');
    }
    setEditingWorkIndex(null);
  } catch (err) {
    showError('Error', (err as any).message || 'Failed to save');
  }
};
  // Delete a work experience row in backend
  const deleteWork = async (index: number) => {
    try {
      const id = workExperiences[index].id;
      const res = await fetch(`${API_URL}/work-experience/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setWorkExperiences(workExperiences.filter((_, i) => i !== index));
      showSuccess('Success', 'Work Experience deleted.');
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete');
    }
  };

  // ---- Add/Edit/Delete Employee ----
  const handleAdd = async (newEmployee: Employee) => {
    if (operationLoading) return; // Prevent multiple submissions
    
    try {
      setOperationLoading(true);
      
      console.log('handleAdd called with:', newEmployee);
      console.log('Available governmentIdTypes:', governmentIdTypes);
      
      // Validate that positionId is present
      if (!newEmployee.positionId) {
        showError('Error', 'Please select a valid position before saving.');
        return;
      }

      // Validate that governmentIDs array is not empty and has valid data
      if (!newEmployee.governmentIdList || newEmployee.governmentIdList.length === 0) {
        showError('Error', 'At least one Government ID is required to create an employee.');
        return;
      }

      // Validate that each government ID has required data
      const invalidGovIds = newEmployee.governmentIdList.filter(govId => {
        // Check for type ID - support multiple field names and ensure it's not just whitespace
        const typeValue = govId.typeId || govId.governmentIdTypeId || govId.idType;
        const hasValidType = typeValue && typeof typeValue === 'string' && typeValue.trim() !== '';
        
        // Check for ID number - support multiple field names and ensure it's not just whitespace
        const idNumberValue = govId.idNumber || govId.govtIdNo;
        const hasValidIdNumber = idNumberValue && typeof idNumberValue === 'string' && idNumberValue.trim() !== '';
        
        console.log('Government ID validation:', {
          govId,
          typeValue,
          hasValidType,
          idNumberValue,
          hasValidIdNumber
        });
        
        return !hasValidType || !hasValidIdNumber;
      });
      
      if (invalidGovIds.length > 0) {
        console.log('Invalid Government IDs found:', invalidGovIds);
        console.log('All Government IDs:', newEmployee.governmentIdList);
        showError('Error', 'All Government IDs must have a valid type and ID number.');
        return;
      }

      // Transform employee data for backend - new structure
      const transformedEmployee: any = {
        firstName: newEmployee.firstName,
        middleName: newEmployee.middleName,
        lastName: newEmployee.lastName,
        suffix: newEmployee.suffix,
        email: newEmployee.email,
        birthdate: newEmployee.birthdate,
        hiredate: newEmployee.dateHired,
        phone: newEmployee.contact,
        streetAddress: newEmployee.houseStreet,
        barangay: newEmployee.barangay,
        city: newEmployee.city,
        province: newEmployee.stateProvinceRegion,
        zipCode: newEmployee.zipCode,
        country: newEmployee.country,
        emergencyContactName: newEmployee.emergencyContactName,
        emergencyContactNo: newEmployee.emergencyContactNo,
        basicRate: newEmployee.basicRate || "0",
        licenseType: newEmployee.licenseType,
        licenseNo: newEmployee.licenseNo,
        restrictionCodes: newEmployee.restrictionCodes,
        expireDate: newEmployee.expireDate ? new Date(newEmployee.expireDate).toISOString() : null,
        employeeStatus: newEmployee.status.toLowerCase(),
        employeeType: newEmployee.employeeType.toLowerCase(),
        employeeClassification: newEmployee.employeeClassification.toLowerCase(),
        positionId: parseInt(newEmployee.positionId.toString()),
        
        // Government IDs are required and must contain data
        governmentIDs: {
          create: newEmployee.governmentIdList.map(govId => {
            // Find the numeric typeId from the government ID types
            let typeId = govId.typeId || govId.governmentIdTypeId || govId.idType;
            
            console.log('Processing government ID:', { govId, originalTypeId: typeId, governmentIdTypes });
            
            // If typeId is a string (name), find the corresponding numeric ID
            if (typeof typeId === 'string' && isNaN(Number(typeId))) {
              const govIdType = governmentIdTypes.find(type => type.name === typeId);
              console.log('Found matching type:', govIdType);
              typeId = govIdType ? govIdType.id : null;
            } else if (typeof typeId === 'string' && !isNaN(Number(typeId))) {
              // If it's a numeric string, convert to number
              typeId = parseInt(typeId);
            }
            
            console.log('Final typeId for government ID:', typeId);
            
            const transformedGovId = {
              typeId: typeId ? parseInt(typeId.toString()) : null,
              idNumber: govId.idNumber || govId.govtIdNo,
              issuedDate: govId.issuedDate || null,
              expiryDate: govId.expiryDate || null,
              isActive: govId.isActive !== undefined ? govId.isActive : true
            };
            
            console.log('Transformed government ID:', transformedGovId);
            return transformedGovId;
          })
        }
      };

      // Optional: Add work experiences only if they exist
      if (workExperiences && workExperiences.length > 0) {
        transformedEmployee.workExperiences = {
          create: workExperiences.map(work => ({
            companyName: work.companyName,
            position: work.position,
            startDate: work.from,
            endDate: work.to || null,
            description: work.description || null
          }))
        };
      }

      // Optional: Add education only if it exists
      if (educationList && educationList.length > 0) {
        transformedEmployee.educations = {
          create: educationList.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: null, // Add if you have startDate in your education model
            endDate: edu.endDate,
            description: null // Add if you have description in your education model
          }))
        };
      }

      // Optional: Add benefits only if they exist
      if (newEmployee.benefitList && newEmployee.benefitList.length > 0) {
        transformedEmployee.benefits = {
          create: newEmployee.benefitList.map(benefit => ({
            benefitTypeId: benefit.benefitTypeId || benefit.typeId,
            value: parseFloat(benefit.amount || benefit.value || '0'),
            frequency: benefit.frequency?.toLowerCase() || 'monthly',
            effectiveDate: benefit.effectiveDate,
            endDate: benefit.endDate || null,
            isActive: benefit.status?.toLowerCase() === 'active' || true
          }))
        };
      }

      // Optional: Add deductions only if they exist
      if (newEmployee.deductionList && newEmployee.deductionList.length > 0) {
        transformedEmployee.deductions = {
          create: newEmployee.deductionList.map(deduction => ({
            type: deduction.type?.toLowerCase() || 'fixed',
            value: parseFloat(deduction.amount || deduction.value || '0'),
            frequency: deduction.frequency?.toLowerCase() || 'monthly',
            effectiveDate: deduction.effectiveDate,
            endDate: deduction.endDate || null,
            isActive: deduction.status?.toLowerCase() === 'active' || true,
            deductionTypeId: deduction.deductionTypeId || deduction.typeId || 1
          }))
        };
      }

      // POST to backend (create employee)
      console.log('Final payload being sent to backend:', JSON.stringify(transformedEmployee, null, 2));
      
      const res = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedEmployee),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const createdEmployee = await res.json();
      
      // Refresh the full employee list from backend to ensure consistency
      await fetchEmployees();
      
      // Close the modal
      setShowAddModal(false);
      
      showSuccess('Success', 'Employee created successfully.');
    } catch (error) {
      console.error('Error creating employee:', error);
      showError('Error', (error as any).message || 'Failed to create employee');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = async (updatedEmployee: Employee) => {
    if (operationLoading) return; // Prevent multiple submissions
    
    try {
      setOperationLoading(true);
      
      if (!updatedEmployee.id) {
        showError('Error', 'No employee ID found!');
        return;
      }

      // Transform employee data for backend
      const transformedEmployee = {
        ...updatedEmployee,
        // Map frontend fields to backend DTO fields
        Id: updatedEmployee.id,
        hiredate: updatedEmployee.dateHired,
        phone: updatedEmployee.contact,
        employeeStatus: updatedEmployee.status,
        province: updatedEmployee.stateProvinceRegion,
        streetAddress: updatedEmployee.houseStreet,
        positionId: updatedEmployee.positionId ? parseInt(updatedEmployee.positionId.toString()) : undefined,
        // Remove frontend-only fields that backend doesn't expect
        id: undefined,
        dateHired: undefined,
        contact: undefined,
        status: undefined,
        stateProvinceRegion: undefined,
        houseStreet: undefined,
        department: undefined,
        position: undefined,
      };
      
      // Remove undefined fields
      Object.keys(transformedEmployee).forEach(key => {
        if (transformedEmployee[key as keyof typeof transformedEmployee] === undefined) {
          delete transformedEmployee[key as keyof typeof transformedEmployee];
        }
      });

      // PATCH to backend (update employee)
      const res = await fetch(`${API_URL}/employees/${updatedEmployee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedEmployee),
      });
      if (!res.ok) {
        const error = await res.json();
        showError('Error', error.message || 'Failed to update employee');
        return;
      }
      const updated = await res.json();

      // (OPTIONAL: If you want to update work experience after employee update, not needed if done in modal)
      // await fetchWorkExperiences(updatedEmployee.id);

      // Refresh the full employee list from backend to ensure consistency
      await fetchEmployees();
      
      // Close modal and reset state
      setShowEditModal(false);
      setSelectedEmployee(null);

      showSuccess('Success', 'Employee updated successfully!');

    } catch (err: any) {
      showError('Error', err.message || 'Something went wrong');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteRequest = async (employee: Employee) => {
    if (operationLoading) return; // Prevent multiple submissions
    
    const result = await showConfirmation(
      'Are you sure you want to delete this employee?<br/><small>This action cannot be undone. All associated data will be permanently removed.</small>'
    );
    
    if (result.isConfirmed) {
      try {
        setOperationLoading(true);
        
        if (!employee.id) {
          showError('Error', 'No employee ID found!');
          return;
        }

        // Call backend API to delete employee
        const res = await fetch(`${API_URL}/employees/${employee.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete employee');
        }

        // Refresh the full employee list from backend to ensure consistency
        await fetchEmployees();
        
        // Close any open modals
        setShowEditModal(false);
        setSelectedEmployee(null);
        
        showSuccess('Deleted!', 'Employee has been successfully deleted.');
      } catch (error) {
        console.error('Error deleting employee:', error);
        showError('Error', (error as Error).message || 'Failed to delete employee');
      } finally {
        setOperationLoading(false);
      }
    }
  };

  // ---- Edit Button: Use this in your "Edit" action ----
  const handleEditButtonClick = async (emp: any) => {
    // Find and set positionId based on position name
    if (emp.position) {
      const position = positions.find(p => p.positionName === emp.position);
      if (position) {
        emp.positionId = position.id;
      }
    }
    
    setSelectedEmployee(emp);
    setIsReadOnlyView(false);
    setShowEditModal(true);
    
    // Set selected department based on employee's department
    if (emp.department) {
      const dept = departments.find(d => d.departmentName === emp.department);
      if (dept) {
        setSelectedDepartmentId(dept.id);
      }
    }
    
    // Fetch latest work experience and education data from backend
    if (emp.id) {
      await fetchWorkExperiences(emp.id);
      await fetchEducationList(emp.id);
      // Note: Government IDs will be fetched by the EmployeeModal itself
    } else {
      // For new employees without ID, use the data from the employee object
      setWorkExperiences(emp.workExperiences ?? []);
      setEducationList(emp.educationList ?? []);
    }
    setCurrentPage(1);
    setPageSize(10);
    setError(null);
    setOpenActionDropdownIndex(null);
  };

  const handleViewButtonClick = async (emp: any) => {
    setSelectedEmployee(emp);
    setIsReadOnlyView(true);
    
    // Set selected department based on employee's department
    if (emp.department) {
      const dept = departments.find(d => d.departmentName === emp.department);
      if (dept) {
        setSelectedDepartmentId(dept.id);
      }
    }
    setShowEditModal(true);
    // Fetch latest work experience and education data from backend
    if (emp.id) {
      await fetchWorkExperiences(emp.id);
      await fetchEducationList(emp.id);
      // Note: Government IDs will be fetched by the EmployeeModal itself
    } else {
      // For new employees without ID, use the data from the employee object
      setWorkExperiences(emp.workExperiences ?? []);
      setEducationList(emp.educationList ?? []);
    }
    setCurrentPage(1);
  setPageSize(10);
  setError(null);
  setOpenActionDropdownIndex(null);
  };

  // ---- Dropdown logic ----
  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setOpenActionDropdownIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionDropdownIndex]);

  // ---- Fetch all education records for the selected employee
  const fetchEducationList = async (employeeId: string) => {
    try {
      const res = await fetch(`${API_URL}/education?employeeId=${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch education records');
      const data = await res.json();
      setEducationList(data || []);
    } catch (err) {
      showError('Error', (err as Error).message || 'Could not load education records');
      setEducationList([]);
    }
  };

  // ---- Return everything for use in modal and section ----
  return {
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedEmployee,
    setSelectedEmployee,
    employees,
    filteredEmployees: filteredByText,
    operationLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    positionFilter,
    setPositionFilter,
    handleAdd,
    handleEdit,
    handleEditButtonClick,
    handleViewButtonClick, // <--- Use for "Edit" action
    handleDeleteRequest,
    isReadOnlyView,
    setIsReadOnlyView,
    filterSections,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    actionDropdownRef,
    paginatedEmployees,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    loading,
    error,

  workExperiences,
  setWorkExperiences,
  editingWorkIndex,
  setEditingWorkIndex,
  tempWork,
  setTempWork,
  isTempWorkValid,
  setIsTempWorkValid,
  workDateError,
  setWorkDateError,
  validateWorkDates,

  educationList,
  setEducationList,
  tempEduc,
  setTempEduc,
  editingEducIndex,
  setEditingEducIndex,
  addEducation,
  saveEducation,
  editEducation,
  cancelEducationEdit,
  deleteEducation,
  isTempEducValid,
  setIsTempEducValid,
  educDateError,
  setEducDateError,
  addWork,
  saveWork,
  editWork,
  cancelWorkEdit,
  deleteWork,

  // Department and Position management
  departments,
  setDepartments,
  positions,
  setPositions,
  selectedDepartmentId,
  setSelectedDepartmentId,
  filteredPositions,
  handleDepartmentChange,

  // Government ID Types
  governmentIdTypes,

  // ...rest...
  };
};