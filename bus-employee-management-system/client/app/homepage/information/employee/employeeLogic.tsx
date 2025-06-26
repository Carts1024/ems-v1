/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo } from 'react';
import { showSuccess, showConfirmation, showError } from '@/app/utils/swal';
import { Employee } from '@/components/modal/information/EmployeeModalLogic';
import { FilterSection } from '@/components/ui/filterDropdown';

// --------- EmployeeLogic.tsx ---------
export const EmployeeLogic = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  

  // ---- Work Experience States ----
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [tempWork, setTempWork] = useState<any>({
    company: '', position: '', from: '', to: '', description: ''
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
  const [educationList, setEducationList] = useState<any[]>([]);
  const [editingEducIndex, setEditingEducIndex] = useState<number | null>(null);
  const [tempEduc, setTempEduc] = useState<any>({
    institute: '', degree: '', specialization: '', completionDate: ''
  });
  const [isTempEducValid, setIsTempEducValid] = useState(true);
  const [educDateError, setEducDateError] = useState<string>('');

  const validateEducDates = (completionDate: string) => {
    if (!completionDate) {
      setEducDateError('Completion date is required');
      setIsTempEducValid(false);
      return false;
    }
    setEducDateError('');
    setIsTempEducValid(true);
    return true;
  };

  const addEducation = () => {
    setEditingEducIndex(educationList.length);
    setTempEduc({ institute: '', degree: '', specialization: '', completionDate: '' });
  };

  const editEducation = (index: number) => {
    setEditingEducIndex(index);
    setTempEduc(educationList[index]);
  };

  const cancelEducationEdit = () => setEditingEducIndex(null);

  const saveEducation = () => {
    if (!validateEducDates(tempEduc.completionDate)) return;
    if (editingEducIndex === educationList.length) {
      setEducationList([...educationList, tempEduc]);
    } else if (editingEducIndex !== null) {
      const updated = [...educationList];
      updated[editingEducIndex] = tempEduc;
      setEducationList(updated);
    }
    setEditingEducIndex(null);
  };

  const deleteEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };
  // ---- Departments & Positions ----
  const [departments, setDepartments] = useState<{ id: number, departmentName: string }[]>([]);
  const [positions, setPositions] = useState<{ id: number, positionName: string, departmentId: number }[]>([]);

  // ---- API URL ----
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ---- Fetch Employees ----
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/employees`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        const mapped = data.map((emp: any) => ({
          ...emp,
          positionName: emp.position?.positionName || '',
          departmentName: emp.position?.department?.departmentName || '',
        }));
        setEmployees(mapped);
        setFilteredEmployees(mapped);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch employees');
        setLoading(false);
      });
  }, [API_URL]);

  // ---- Fetch Departments & Positions ----
  useEffect(() => {
    fetch(`${API_URL}/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => setDepartments([]));
    fetch(`${API_URL}/positions`)
      .then(res => res.json())
      .then(data => setPositions(data))
      .catch(() => setPositions([]));
  }, [API_URL]);

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

  // Fetch all work experiences for the selected employee
  const fetchWorkExperiences = async (employeeId: string) => {
    try {
      const res = await fetch(`${API_URL}/work-experience?employeeId=${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch work experiences');
      const data = await res.json();
      setWorkExperiences(data || []);
    } catch (err) {
      showError('Error', (err as Error).message || 'Could not load work experiences');
      setWorkExperiences([]);
    }
  };

  // Add work experience row (UI only, for new record)
  const addWork = () => {
    setEditingWorkIndex(workExperiences.length);
    setTempWork({ company: '', position: '', from: '', to: '', description: '' });
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

    try {
      let newWorkExp: any;
      if (editingWorkIndex === workExperiences.length) {
        // ADD
        const res = await fetch(`${API_URL}/work-experience`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...tempWork, employeeId: selectedEmployee.id }),
        });
        if (!res.ok) throw new Error('Failed to add');
        newWorkExp = await res.json();
        setWorkExperiences([...workExperiences, newWorkExp]);
        showSuccess('Success', 'Work Experience added.');
      } else {
        // UPDATE
        const id = workExperiences[editingWorkIndex!].id;
        const res = await fetch(`${API_URL}/work-experience/${id}`, {
          method: 'PATCH', // FIXED: PATCH (not Patch)
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tempWork),
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
    } catch (err: any) {
      showError('Error', err.message || 'Failed to save');
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
  const handleAdd = (newEmployee: Employee) => {
    const updatedList = [...employees, newEmployee];
    setEmployees(updatedList);
    setFilteredEmployees(updatedList);
    showSuccess('Success', 'Employee added successfully.');
  };

  const handleEdit = async (updatedEmployee: Employee) => {
    try {
      if (!updatedEmployee.id) {
        showError('Error', 'No employee ID found!');
        return;
      }
      // PATCH to backend (update employee)
      const res = await fetch(`${API_URL}/employees/${updatedEmployee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmployee),
      });
      if (!res.ok) {
        const error = await res.json();
        showError('Error', error.message || 'Failed to update employee');
        return;
      }
      const updated = await res.json();

      // (OPTIONAL: If you want to update work experience after employee update, not needed if done in modal)
      // await fetchWorkExperiences(updatedEmployee.id);

      // Update UI
      const updatedList = employees.map(emp =>
        emp.id === updated.id ? updated : emp
      );
      setEmployees(updatedList);
      setFilteredEmployees(updatedList);
      setShowEditModal(false);

      showSuccess('Success', 'Employee updated successfully!');

    } catch (err: any) {
      showError('Error', err.message || 'Something went wrong');
    }
  };

  const handleDeleteRequest = async (employee: Employee) => {
    const result = await showConfirmation('Are you sure you want to delete this employee?');
    if (result.isConfirmed) {
      const updatedList = employees.filter(
        emp => emp.firstName !== employee.firstName ||
          emp.middleName !== employee.middleName ||
          emp.lastName !== employee.lastName
      );
      setEmployees(updatedList);
      setFilteredEmployees(updatedList);
      showSuccess('Success', 'Employee deleted successfully.');
    }
  };

  // ---- Edit Button: Use this in your "Edit" action ----
  const handleEditButtonClick = async (emp: any) => {
    setSelectedEmployee(emp);
    setIsReadOnlyView(false);
    setShowEditModal(true);
    // Synchronize work experience and education state with employee
    setWorkExperiences(emp.workExperiences ?? []);
    setEducationList(emp.educationList ?? []);
    setCurrentPage(1);
    setPageSize(10);
    setError(null);
    setOpenActionDropdownIndex(null);
  };

  const handleViewButtonClick = async (emp: any) => {
  setSelectedEmployee(emp);
  setIsReadOnlyView(true);
  setShowEditModal(true);
  setWorkExperiences(emp.workExperiences ?? []);
  setEducationList(emp.educationList ?? []);
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

  // ...rest...
  };
};