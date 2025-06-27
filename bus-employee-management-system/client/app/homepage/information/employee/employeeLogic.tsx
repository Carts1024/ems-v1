/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { showSuccess, showConfirmation, showError } from '@/app/utils/swal';
import { Employee } from '@/components/modal/information/EmployeeModalLogic';
import { Education } from '@/types/employee';
import { FilterSection } from '@/components/ui/filterDropdown';
import { formatDate } from '@/app/utils/dateUtils';

// --------- EmployeeLogic.tsx ---------
export const EmployeeLogic = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false); // For create/update/delete operations
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
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

  // ---- Roles State ----
  const [roles, setRoles] = useState<{ id: number, name: string }[]>([]);

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
      endDate: formatDate(selectedEducation?.endDate) || '',
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

  // ---- CSV Import Functions ----
  const parseCsvToEmployees = (csvContent: string): any[] => {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const expectedHeaders = [
      'employeeNumber', 'firstName', 'middleName', 'lastName', 'suffix', 'email', 
      'birthdate', 'hiredate', 'phone', 'streetAddress', 'barangay', 'city', 
      'province', 'country', 'zipCode', 'emergencyContactName', 'emergencyContactNo', 
      'basicRate', 'licenseType', 'licenseNo', 'restrictionCodes', 'expireDate', 
      'employeeStatus', 'employeeType', 'employeeClassification', 'terminationDate', 
      'terminationReason', 'positionId'
    ];

    // Validate headers
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const employees: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Remove quotes
      
      if (values.length !== headers.length) {
        throw new Error(`Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
      }

      const employee: any = {};
      headers.forEach((header, index) => {
        let value: string | null = values[index];
        
        // Handle empty values
        if (value === '' || value === 'null' || value === 'NULL') {
          value = null;
        }
        
        // Parse specific fields
        switch (header) {
          case 'positionId':
            employee[header] = value ? parseInt(value) : null;
            break;
          case 'basicRate':
            employee[header] = value || '0';
            break;
          case 'restrictionCodes':
            employee[header] = value ? value.split(';').map((code: string) => code.trim()) : [];
            break;
          case 'birthdate':
          case 'hiredate':
          case 'expireDate':
          case 'terminationDate':
            employee[header] = value || null;
            break;
          default:
            employee[header] = value;
        }
      });

      // Map CSV fields to expected employee object structure
      const mappedEmployee = {
        employeeNumber: employee.employeeNumber,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        suffix: employee.suffix,
        email: employee.email,
        birthdate: employee.birthdate,
        dateHired: employee.hiredate,
        contact: employee.phone,
        houseStreet: employee.streetAddress,
        barangay: employee.barangay,
        city: employee.city,
        stateProvinceRegion: employee.province,
        country: employee.country,
        zipCode: employee.zipCode,
        emergencyContactName: employee.emergencyContactName,
        emergencyContactNo: employee.emergencyContactNo,
        basicRate: employee.basicRate,
        licenseType: employee.licenseType,
        licenseNo: employee.licenseNo,
        restrictionCodes: employee.restrictionCodes,
        expireDate: employee.expireDate,
        status: employee.employeeStatus,
        employeeType: employee.employeeType,
        employeeClassification: employee.employeeClassification,
        terminationDate: employee.terminationDate,
        terminationReason: employee.terminationReason,
        positionId: employee.positionId,
        // Default values for required fields not in CSV
        governmentIdList: [], // Will need to be added manually or in separate import
        benefitList: [],
        deductionList: []
      };

      employees.push(mappedEmployee);
    }

    return employees;
  };

  const handleCsvImport = async (file: File) => {
    if (!file) {
      showError('Error', 'Please select a CSV file to import.');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showError('Error', 'Please select a valid CSV file.');
      return;
    }

    try {
      setImportLoading(true);
      
      const csvContent = await file.text();
      const employeesToImport = parseCsvToEmployees(csvContent);
      
      console.log('Parsed employees from CSV:', employeesToImport);

      // Validate positions exist
      const invalidPositions = employeesToImport.filter((emp: any) => {
        return emp.positionId && !positions.find((pos: any) => pos.id === emp.positionId);
      });

      if (invalidPositions.length > 0) {
        const invalidIds = [...new Set(invalidPositions.map((emp: any) => emp.positionId))];
        showError('Error', `Invalid position IDs found: ${invalidIds.join(', ')}. Please ensure all position IDs exist in the system.`);
        return;
      }

      // Import each employee
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < employeesToImport.length; i++) {
        try {
          const employee = employeesToImport[i];
          
          // Transform for backend API
          const transformedEmployee = {
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
            suffix: employee.suffix,
            email: employee.email,
            birthdate: employee.birthdate,
            hiredate: employee.dateHired,
            phone: employee.contact,
            streetAddress: employee.houseStreet,
            barangay: employee.barangay,
            city: employee.city,
            province: employee.stateProvinceRegion,
            zipCode: employee.zipCode,
            country: employee.country,
            emergencyContactName: employee.emergencyContactName,
            emergencyContactNo: employee.emergencyContactNo,
            basicRate: employee.basicRate,
            licenseType: employee.licenseType,
            licenseNo: employee.licenseNo,
            restrictionCodes: employee.restrictionCodes,
            expireDate: employee.expireDate ? new Date(employee.expireDate).toISOString() : null,
            employeeStatus: employee.status?.toLowerCase() || 'active',
            employeeType: employee.employeeType?.toLowerCase() || 'regular',
            employeeClassification: employee.employeeClassification?.toLowerCase() || 'full-time',
            positionId: employee.positionId,
            terminationDate: employee.terminationDate,
            terminationReason: employee.terminationReason,
            // Empty arrays for required nested data - can be populated later
            governmentIDs: []
          };

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
          
          // Check if user account creation is needed (same logic as manual creation)
          const qualifyingPositionIds = [1, 3, 6, 7, 10];
          if (qualifyingPositionIds.includes(employee.positionId)) {
            try {
              await registerUserForEmployee(createdEmployee.id);
            } catch (userError) {
              console.warn(`User account creation failed for ${employee.firstName} ${employee.lastName}:`, userError);
            }
          }

          successCount++;
        } catch (error) {
          errorCount++;
          const employeeName = `${employeesToImport[i].firstName} ${employeesToImport[i].lastName}`;
          errors.push(`Row ${i + 2}: ${employeeName} - ${(error as any).message}`);
          console.error(`Error importing employee ${employeeName}:`, error);
        }
      }

      // Refresh employees list
      await fetchEmployees();
      
      // Show results
      if (errorCount === 0) {
        showSuccess('Import Successful', `Successfully imported ${successCount} employees.`);
      } else if (successCount === 0) {
        showError('Import Failed', `Failed to import all employees:\n${errors.join('\n')}`);
      } else {
        showError('Partial Import', `Imported ${successCount} employees successfully, ${errorCount} failed:\n${errors.join('\n')}`);
      }

      setShowImportModal(false);
    } catch (error) {
      console.error('CSV Import Error:', error);
      showError('Import Error', (error as any).message || 'Failed to process CSV file');
    } finally {
      setImportLoading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const headers = [
      'employeeNumber', 'firstName', 'middleName', 'lastName', 'suffix', 'email',
      'birthdate', 'hiredate', 'phone', 'streetAddress', 'barangay', 'city',
      'province', 'country', 'zipCode', 'emergencyContactName', 'emergencyContactNo',
      'basicRate', 'licenseType', 'licenseNo', 'restrictionCodes', 'expireDate',
      'employeeStatus', 'employeeType', 'employeeClassification', 'terminationDate',
      'terminationReason', 'positionId'
    ];

    const sampleData = [
      'EMP-2025-000001', 'Juan', 'Reyes', 'Dela Cruz', 'Jr.', 'juan.delacruz@example.com',
      '1990-01-01', '2020-06-15', '09171234567', '123 Main St', 'Barangay Uno', 'Quezon City',
      'Metro Manila', 'Philippines', '1100', 'Maria Dela Cruz', '09179876543',
      '25000.00', 'Professional', 'DL-123456', 'A;B', '', 'active', 'regular', 'full-time', '', '', '1'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employee_import_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // ---- User Registration Function ----
  const registerUserForEmployee = async (employeeId: number) => {
    try {
      // Fetch the newly created employee details
      const employeeRes = await fetch(`${API_URL}/employees/${employeeId}`);
      if (!employeeRes.ok) {
        throw new Error('Failed to fetch employee details for user registration');
      }
      
      const employee = await employeeRes.json();
      
      // Check if employee's positionId qualifies for user account creation
      const qualifyingPositionIds = [1, 3, 6, 7, 10];
      if (!qualifyingPositionIds.includes(employee.positionId)) {
        return;
      }
      
      // Map positionId to roleId based on the specified conditions
      const positionToRoleMap: { [key: number]: number } = {
        1: 2,
        3: 3,
        6: 4,
        7: 5,
        10: 6
      };
      
      const roleId = positionToRoleMap[employee.positionId];
      
      // Additional validation: compare position name and role name for extra checking
      const position = positions.find(pos => pos.id === employee.positionId);
      const role = roles.find(r => r.id === roleId);
      
      // Prepare payload for auth/register endpoint
      const userRegistrationPayload = {
        employeeNumber: employee.employeeNumber,
        firstName: employee.firstName,
        // positionId: employee.positionId,
        email: employee.email,
        roleId: roleId
      };
      
      // Validate required fields
      if (!employee.email || employee.email.trim() === '') {
        showError('Warning', 'Employee was created successfully, but user account creation was skipped due to missing email address.');
        return;
      }
      
      // Make POST request to auth/register endpoint
      const authRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userRegistrationPayload),
      });
      
      if (!authRes.ok) {
        const errorData = await authRes.json();
        throw new Error(errorData.message || 'Failed to create user account');
      }
      
      const registeredUser = await authRes.json();
      
      showSuccess('Success', 'Employee created successfully and user account has been created for system access.');
      
    } catch (error) {
      console.error('Error during user registration:', error);
      showError('Warning', `Employee was created successfully, but user account creation failed: ${(error as any).message}`);
    }
  };

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

  // ---- Fetch Departments, Positions, Government ID Types & Roles ----
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
      .then(res => {
        console.log('Government ID Types response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Government ID Types data:', data);
        setGovernmentIdTypes(data);
      })
      .catch(error => {
        console.error('Error fetching government ID types:', error);
        setGovernmentIdTypes([]);
      });
    fetch(`${API_URL}/roles`)
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(() => setRoles([]));
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

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, departmentFilter, positionFilter]);

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

  // Apply all filters including search term, status filter, department filter, and position filter
  const filteredByAllCriteria = useMemo(() => {
    return filteredEmployees.filter(emp => {
      const fullName = `${emp.firstName} ${emp.middleName || ''} ${emp.lastName}`.toLowerCase();
      const searchableText = [
        fullName,
        emp.employeeNumber || '',
        emp.email || '',
        emp.departmentName || '',
        emp.positionName || ''
      ].join(' ').toLowerCase();
      
      return (
        (!statusFilter || emp.status === statusFilter) &&
        (!departmentFilter || emp.departmentName === departmentFilter) &&
        (!positionFilter || emp.positionName === positionFilter) &&
        (!searchTerm || searchableText.includes(searchTerm.toLowerCase()))
      );
    });
  }, [filteredEmployees, statusFilter, departmentFilter, positionFilter, searchTerm]);

  // ---- Pagination ----
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredByAllCriteria.slice(start, start + pageSize);
  }, [filteredByAllCriteria, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredByAllCriteria.length / pageSize);

  // ---- WORK EXPERIENCE: Backend CRUD ----
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
    const workExp = workExperiences[index];
    setTempWork({
      ...workExp,
      from: formatDate(workExp.from) || workExp.from || '',
      to: formatDate(workExp.to) || workExp.to || '',
    });
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
      
      // Map backend response to frontend format
      const mappedWorkExp = {
        id: newWorkExp.id,
        companyName: newWorkExp.companyName || '',
        position: newWorkExp.position || '',
        from: newWorkExp.startDate ? formatDate(newWorkExp.startDate) : '',
        to: newWorkExp.endDate ? formatDate(newWorkExp.endDate) : '',
        description: newWorkExp.description || '',
      };
      
      setWorkExperiences([...workExperiences, mappedWorkExp]);
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
      
      // Map backend response to frontend format
      const mappedWorkExp = {
        id: newWorkExp.id,
        companyName: newWorkExp.companyName || '',
        position: newWorkExp.position || '',
        from: newWorkExp.startDate ? formatDate(newWorkExp.startDate) : '',
        to: newWorkExp.endDate ? formatDate(newWorkExp.endDate) : '',
        description: newWorkExp.description || '',
      };
      
      const updated = workExperiences.map((exp, idx) =>
        idx === editingWorkIndex ? mappedWorkExp : exp
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

  // ---- Benefits States ----
  const [benefitList, setBenefitList] = useState<any[]>([]);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState<number | null>(null);
  const [tempBenefit, setTempBenefit] = useState<any>({
    typeId: '', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active'
  });
  const [isTempBenefitValid, setIsTempBenefitValid] = useState(true);

  // ---- Deductions States ----
  const [deductionList, setDeductionList] = useState<any[]>([]);
  const [editingDeductionIndex, setEditingDeductionIndex] = useState<number | null>(null);
  const [tempDeduction, setTempDeduction] = useState<any>({
    typeId: '', type: 'fixed', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active'
  });
  const [isTempDeductionValid, setIsTempDeductionValid] = useState(true);

  // ---- Benefits Management ----
  const addBenefit = () => {
    setEditingBenefitIndex(benefitList.length);
    setTempBenefit({ typeId: '', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
  };

  const editBenefit = (index: number) => {
    setEditingBenefitIndex(index);
    const selectedBenefit = benefitList[index];
    setTempBenefit({
      typeId: selectedBenefit?.typeId || selectedBenefit?.benefitTypeId || '',
      amount: selectedBenefit?.amount || selectedBenefit?.value || '',
      frequency: selectedBenefit?.frequency || 'monthly',
      effectiveDate: formatDate(selectedBenefit?.effectiveDate) || '',
      endDate: formatDate(selectedBenefit?.endDate) || '',
      status: selectedBenefit?.status || 'active',
      id: selectedBenefit?.id
    });
  };

  const cancelBenefitEdit = () => {
    setEditingBenefitIndex(null);
    setTempBenefit({ typeId: '', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
  };

  const saveBenefit = async () => {
    // For new employees (no id yet), just update local state
    if (!selectedEmployee || !selectedEmployee.id) {
      // Add or update in local array only
      let newBenefitArr = [...benefitList];
      if (editingBenefitIndex === benefitList.length) {
        newBenefitArr.push(tempBenefit);
      } else if (editingBenefitIndex !== null) {
        newBenefitArr[editingBenefitIndex] = tempBenefit;
      }
      setBenefitList(newBenefitArr);
      setEditingBenefitIndex(null);
      setTempBenefit({ typeId: '', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
      showSuccess('Success', 'Benefit saved locally.');
      return;
    }

    // For existing employees, save to backend
    const benefitDto = {
      ...tempBenefit,
      employeeId: selectedEmployee.id,
      benefitTypeId: tempBenefit.typeId,
      value: parseFloat(tempBenefit.amount || '0'),
      isActive: tempBenefit.status?.toLowerCase() === 'active'
    };

    try {
      let newBenefit: any;
      if (editingBenefitIndex === benefitList.length) {
        // ADD
        const res = await fetch(`${API_URL}/benefits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(benefitDto),
        });
        if (!res.ok) throw new Error('Failed to add benefit');
        newBenefit = await res.json();
        setBenefitList([...benefitList, newBenefit]);
        showSuccess('Success', 'Benefit added.');
      } else {
        // UPDATE
        const id = benefitList[editingBenefitIndex!].id;
        const res = await fetch(`${API_URL}/benefits/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(benefitDto),
        });
        if (!res.ok) throw new Error('Failed to update benefit');
        newBenefit = await res.json();
        const updated = benefitList.map((benefit, idx) =>
          idx === editingBenefitIndex ? newBenefit : benefit
        );
        setBenefitList(updated);
        showSuccess('Success', 'Benefit updated.');
      }
      setEditingBenefitIndex(null);
      setTempBenefit({ typeId: '', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
    } catch (err) {
      showError('Error', (err as any).message || 'Failed to save benefit');
    }
  };

  const deleteBenefit = async (index: number) => {
    try {
      const benefit = benefitList[index];
      if (benefit.id) {
        const res = await fetch(`${API_URL}/benefits/${benefit.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete benefit');
        showSuccess('Success', 'Benefit deleted.');
      }
      setBenefitList(benefitList.filter((_, i) => i !== index));
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete benefit');
    }
  };

  // ---- Deductions Management ----
  const addDeduction = () => {
    setEditingDeductionIndex(deductionList.length);
    setTempDeduction({ typeId: '', type: 'fixed', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
  };

  const editDeduction = (index: number) => {
    setEditingDeductionIndex(index);
    const selectedDeduction = deductionList[index];
    setTempDeduction({
      typeId: selectedDeduction?.typeId || selectedDeduction?.deductionTypeId || '',
      type: selectedDeduction?.type || 'fixed',
      amount: selectedDeduction?.amount || selectedDeduction?.value || '',
      frequency: selectedDeduction?.frequency || 'monthly',
      effectiveDate: formatDate(selectedDeduction?.effectiveDate) || '',
      endDate: formatDate(selectedDeduction?.endDate) || '',
      status: selectedDeduction?.status || 'active',
      id: selectedDeduction?.id
    });
  };

  const cancelDeductionEdit = () => {
    setEditingDeductionIndex(null);
    setTempDeduction({ typeId: '', type: 'fixed', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
  };

  const saveDeduction = async () => {
    // For new employees (no id yet), just update local state
    if (!selectedEmployee || !selectedEmployee.id) {
      // Add or update in local array only
      let newDeductionArr = [...deductionList];
      if (editingDeductionIndex === deductionList.length) {
        newDeductionArr.push(tempDeduction);
      } else if (editingDeductionIndex !== null) {
        newDeductionArr[editingDeductionIndex] = tempDeduction;
      }
      setDeductionList(newDeductionArr);
      setEditingDeductionIndex(null);
      setTempDeduction({ typeId: '', type: 'fixed', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
      showSuccess('Success', 'Deduction saved locally.');
      return;
    }

    // For existing employees, save to backend
    const deductionDto = {
      ...tempDeduction,
      employeeId: selectedEmployee.id,
      deductionTypeId: tempDeduction.typeId,
      value: parseFloat(tempDeduction.amount || '0'),
      isActive: tempDeduction.status?.toLowerCase() === 'active'
    };

    try {
      let newDeduction: any;
      if (editingDeductionIndex === deductionList.length) {
        // ADD
        const res = await fetch(`${API_URL}/deductions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deductionDto),
        });
        if (!res.ok) throw new Error('Failed to add deduction');
        newDeduction = await res.json();
        setDeductionList([...deductionList, newDeduction]);
        showSuccess('Success', 'Deduction added.');
      } else {
        // UPDATE
        const id = deductionList[editingDeductionIndex!].id;
        const res = await fetch(`${API_URL}/deductions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deductionDto),
        });
        if (!res.ok) throw new Error('Failed to update deduction');
        newDeduction = await res.json();
        const updated = deductionList.map((deduction, idx) =>
          idx === editingDeductionIndex ? newDeduction : deduction
        );
        setDeductionList(updated);
        showSuccess('Success', 'Deduction updated.');
      }
      setEditingDeductionIndex(null);
      setTempDeduction({ typeId: '', type: 'fixed', amount: '', frequency: 'monthly', effectiveDate: '', endDate: '', status: 'active' });
    } catch (err) {
      showError('Error', (err as any).message || 'Failed to save deduction');
    }
  };

  const deleteDeduction = async (index: number) => {
    try {
      const deduction = deductionList[index];
      if (deduction.id) {
        const res = await fetch(`${API_URL}/deductions/${deduction.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete deduction');
        showSuccess('Success', 'Deduction deleted.');
      }
      setDeductionList(deductionList.filter((_, i) => i !== index));
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete deduction');
    }
  };
  
  // ---- Add/Edit/Delete Employee ----
  const handleAdd = async (newEmployee: Employee) => {
    if (operationLoading) return; // Prevent multiple submissions
    
    try {
      setOperationLoading(true);
      
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
        
        return !hasValidType || !hasValidIdNumber;
      });
      
      if (invalidGovIds.length > 0) {
        showError('Error', 'All Government IDs must have a valid type and ID number.');
        return;
      }

      // Transform employee data for backend - STEP 1: Create basic employee first
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
        governmentIDs: newEmployee.governmentIdList.map(govId => {
          // Find the numeric typeId from the government ID types
          let typeId = govId.typeId || govId.governmentIdTypeId || govId.idType;
          
          // If typeId is a string (name), find the corresponding numeric ID
          if (typeof typeId === 'string' && isNaN(Number(typeId))) {
            const govIdType = governmentIdTypes.find(type => type.name === typeId);
            typeId = govIdType ? govIdType.id : null;
          } else if (typeof typeId === 'string' && !isNaN(Number(typeId))) {
            // If it's a numeric string, convert to number
            typeId = parseInt(typeId);
          }
          
          return {
            typeId: typeId ? parseInt(typeId.toString()) : null,
            idNumber: govId.idNumber || govId.govtIdNo,
            issuedDate: govId.issuedDate || null,
            expiryDate: govId.expiryDate || null,
            isActive: govId.isActive !== undefined ? govId.isActive : true
          };
        })
      };

      // Add work experiences only if they exist
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

      // Add education only if it exists
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

      // STEP 1: Create employee without benefits and deductions
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
      console.log('Employee created successfully:', createdEmployee);
      
      // STEP 2: Add benefits if they exist (from modal)
      const modalBenefitList = newEmployee.benefitList || [];
      if (modalBenefitList && modalBenefitList.length > 0) {
        try {
          // Fetch benefit types to map names to IDs
          const benefitTypesRes = await fetch(`${API_URL}/benefit/types`);
          const benefitTypes = benefitTypesRes.ok ? await benefitTypesRes.json() : [];

          const benefitPromises = modalBenefitList.map(async (benefit) => {
            // Find benefit type ID by name
            const benefitType = benefitTypes.find((bt: any) => bt.name === benefit.benefit);
            const benefitTypeId = benefitType ? benefitType.id : null;

            if (!benefitTypeId) {
              console.warn(`Benefit type not found for: ${benefit.benefit}`);
              return; // Skip this benefit if type not found
            }

            // Map modal benefit structure to backend API structure
            const benefitData = {
              employeeId: createdEmployee.id,
              benefitTypeId: benefitTypeId,
              value: parseFloat(benefit.amount || '0'),
              frequency: benefit.frequency?.toLowerCase() || 'monthly',
              effectiveDate: benefit.effectiveDate,
              endDate: benefit.endDate || null,
              isActive: benefit.status?.toLowerCase() === 'active' || true
            };

            const benefitRes = await fetch(`${API_URL}/benefits`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(benefitData),
            });

            if (!benefitRes.ok) {
              const errorData = await benefitRes.json();
              console.error('Failed to create benefit:', errorData);
              // Don't throw error for benefits - just log and continue
            }
          });

          await Promise.allSettled(benefitPromises);
        } catch (error) {
          console.error('Error processing benefits:', error);
        }
      }

      // STEP 3: Add deductions if they exist (from modal)
      const modalDeductionList = newEmployee.deductionList || [];
      if (modalDeductionList && modalDeductionList.length > 0) {
        try {
          // Fetch deduction types to map names to IDs
          const deductionTypesRes = await fetch(`${API_URL}/deduction/types`);
          const deductionTypes = deductionTypesRes.ok ? await deductionTypesRes.json() : [];

          const deductionPromises = modalDeductionList.map(async (deduction) => {
            // Find deduction type ID by name
            const deductionType = deductionTypes.find((dt: any) => dt.name === deduction.reason);
            const deductionTypeId = deductionType ? deductionType.id : null;

            if (!deductionTypeId) {
              console.warn(`Deduction type not found for: ${deduction.reason}`);
              return; // Skip this deduction if type not found
            }

            // Map modal deduction structure to backend API structure
            const deductionData = {
              employeeId: createdEmployee.id,
              type: deduction.type?.toLowerCase() || 'fixed',
              value: parseFloat(deduction.amount || '0'),
              frequency: deduction.frequency?.toLowerCase() || 'monthly',
              effectiveDate: deduction.effectiveDate,
              endDate: deduction.endDate || null,
              isActive: deduction.status?.toLowerCase() === 'active' || true,
              deductionTypeId: deductionTypeId            };

            const deductionRes = await fetch(`${API_URL}/deductions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(deductionData),
            });

            if (!deductionRes.ok) {
              const errorData = await deductionRes.json();
              console.error('Failed to create deduction:', errorData);
              // Don't throw error for deductions - just log and continue
            }
          });

          await Promise.allSettled(deductionPromises);
        } catch (error) {
          console.error('Error processing deductions:', error);
        }
      }
      
      // Check if user account creation is needed based on position
      const qualifyingPositionIds = [1, 3, 6, 7, 10];
      if (qualifyingPositionIds.includes(parseInt(newEmployee.positionId.toString()))) {
        await registerUserForEmployee(createdEmployee.id);
      } else {
        showSuccess('Success', 'Employee created successfully.');
      }
      
      // Refresh the full employee list from backend to ensure consistency
      await fetchEmployees();
      
      // Clear local state after successful creation
      clearLocalState();
      
      // Close the modal
      setShowAddModal(false);
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
      await fetchBenefitList(emp.id);
      await fetchDeductionList(emp.id);
      // Note: Government IDs will be fetched by the EmployeeModal itself
    } else {
      // For new employees without ID, use the data from the employee object
      setWorkExperiences(emp.workExperiences ?? []);
      setEducationList(emp.educationList ?? []);
      setBenefitList(emp.benefitList ?? []);
      setDeductionList(emp.deductionList ?? []);
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
      await fetchBenefitList(emp.id);
      await fetchDeductionList(emp.id);
      // Note: Government IDs will be fetched by the EmployeeModal itself
    } else {
      // For new employees without ID, use the data from the employee object
      setWorkExperiences(emp.workExperiences ?? []);
      setEducationList(emp.educationList ?? []);
      setBenefitList(emp.benefitList ?? []);
      setDeductionList(emp.deductionList ?? []);
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

  // ---- Fetch Benefits and Deductions ----
  const fetchBenefitList = async (employeeId: string) => {
    try {
      const res = await fetch(`${API_URL}/benefits?employeeId=${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch benefits');
      const data = await res.json();
      setBenefitList(data || []);
    } catch (err) {
      showError('Error', (err as Error).message || 'Could not load benefits');
      setBenefitList([]);
    }
  };

  const fetchDeductionList = async (employeeId: string) => {
    try {
      const res = await fetch(`${API_URL}/deductions?employeeId=${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch deductions');
      const data = await res.json();
      setDeductionList(data || []);
    } catch (err) {
      showError('Error', (err as Error).message || 'Could not load deductions');
      setDeductionList([]);
    }
  };

  // ---- Handle opening add modal ----
  const handleOpenAddModal = () => {
    clearLocalState();
    setShowAddModal(true);
  };

  // ---- Clear local state when adding new employee ----
  const clearLocalState = () => {
    setWorkExperiences([]);
    setEducationList([]);
    setBenefitList([]);
    setDeductionList([]);
    setEditingWorkIndex(null);
    setEditingEducIndex(null);
    setEditingBenefitIndex(null);
    setEditingDeductionIndex(null);
  };

  // ---- Return everything for use in modal and section ----
  return {
    showAddModal,
    setShowAddModal,
    handleOpenAddModal,
    showEditModal,
    setShowEditModal,
    selectedEmployee,
    setSelectedEmployee,
    employees,
    filteredEmployees: filteredByAllCriteria,
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

  // CSV Import functionality
  handleCsvImport,
  downloadCsvTemplate,
  showImportModal,
  setShowImportModal,
  importLoading,

  // Benefits and Deductions
  benefitList,
  setBenefitList,
  tempBenefit,
  setTempBenefit,
  editingBenefitIndex,
  setEditingBenefitIndex,
  addBenefit,
  saveBenefit,
  editBenefit,
  cancelBenefitEdit,
  deleteBenefit,

  deductionList,
  setDeductionList,
  tempDeduction,
  setTempDeduction,
  editingDeductionIndex,
  setEditingDeductionIndex,
  addDeduction,
  saveDeduction,
  editDeduction,
  cancelDeductionEdit,
  deleteDeduction,
  };
};