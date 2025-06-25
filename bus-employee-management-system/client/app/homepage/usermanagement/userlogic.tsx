// C:\Users\clari\OneDrive\School\GitHub\ems-v1\bus-employee-management-system\client\app\homepage\usermanagement\userlogic.tsx
import { useState, useEffect, useMemo } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown';

// --- Type Definitions for User Management ---
export type UserRole = 'Admin' | 'Employee' | 'HR' | 'Manager';

// Interface for form data (what the modal submits)
export interface UserForm {
  employeeNumber: string;
  jobPosition: string;
  department: string;
  role: UserRole;
  // Add more user-specific fields as needed, e.g., name, email
  employeeName: string; // Added for search/display consistency
  email: string;
}

// Interface for the full User object (stored in the list)
// This extends UserForm and adds unique ID and timestamps
export interface User extends UserForm {
  id: string;
  timeAdded: string;
  timeModified: string;
}

export const UserLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // Dummy Data for User Management
  const [users, setUsers] = useState<User[]>([
    {
      id: 'usr1',
      employeeNumber: 'EMP001',
      employeeName: 'Alice Johnson',
      jobPosition: 'Software Engineer',
      department: 'Engineering',
      role: 'Employee',
      email: 'alice.j@example.com',
      timeAdded: '2024-06-20T10:00:00Z',
      timeModified: '2024-06-20T10:00:00Z'
    },
    {
      id: 'usr2',
      employeeNumber: 'EMP002',
      employeeName: 'Bob Williams',
      jobPosition: 'Marketing Specialist',
      department: 'Marketing',
      role: 'Employee',
      email: 'bob.w@example.com',
      timeAdded: '2024-06-15T11:30:00Z',
      timeModified: '2024-06-16T09:00:00Z'
    },
    {
      id: 'usr3',
      employeeNumber: 'EMP003',
      employeeName: 'Charlie Brown',
      jobPosition: 'HR Assistant',
      department: 'Human Resources',
      role: 'HR',
      email: 'charlie.b@example.com',
      timeAdded: '2024-06-24T14:00:00Z',
      timeModified: '2024-06-24T15:00:00Z'
    },
    {
      id: 'usr4',
      employeeNumber: 'EMP004',
      employeeName: 'Diana Prince',
      jobPosition: 'Sales Manager',
      department: 'Sales',
      role: 'Manager',
      email: 'diana.p@example.com',
      timeAdded: '2024-06-10T09:00:00Z',
      timeModified: '2024-06-10T09:00:00Z'
    },
    {
      id: 'usr5',
      employeeNumber: 'EMP005',
      employeeName: 'Eve Adams',
      jobPosition: 'Accountant',
      department: 'Finance',
      role: 'Employee',
      email: 'eve.a@example.com',
      timeAdded: '2024-06-05T13:00:00Z',
      timeModified: '2024-06-06T08:00:00Z'
    },
    {
      id: 'usr6',
      employeeNumber: 'ADM001',
      employeeName: 'Frank Miller',
      jobPosition: 'System Administrator',
      department: 'IT',
      role: 'Admin',
      email: 'frank.m@example.com',
      timeAdded: '2024-01-01T08:00:00Z',
      timeModified: '2024-01-01T08:00:00Z'
    }
  ]);

  const [currentFilteredUsers, setCurrentFilteredUsers] = useState<User[]>(users);

  // Effect to re-apply filters when the base users list changes (add/edit/delete)
  useEffect(() => {
    handleApplyFilters(activeFilters);
  }, [users, searchTerm]); // Also re-apply when searchTerm changes directly

  const filterSections: FilterSection[] = [
    {
      id: "department",
      title: "Department",
      type: "checkbox",
      options: [
        { id: "Engineering", label: "Engineering" },
        { id: "Marketing", label: "Marketing" },
        { id: "Human Resources", label: "Human Resources" },
        { id: "Sales", label: "Sales" },
        { id: "Finance", label: "Finance" },
        { id: "IT", label: "IT" },
      ],
      defaultValue: []
    },
    {
      id: "role",
      title: "Role",
      type: "radio",
      options: [
        { id: "Admin", label: "Admin" },
        { id: "Employee", label: "Employee" },
        { id: "HR", label: "HR" },
        { id: "Manager", label: "Manager" },
      ],
      defaultValue: ""
    },
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "employeeName", label: "Employee Name" },
        { id: "employeeNumber", label: "Employee Number" },
        { id: "department", label: "Department" },
        { id: "role", label: "Role" },
      ],
      defaultValue: "employeeName"
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
    setActiveFilters(filterValues);

    let newData = [...users];

    // Apply search term filtering
    const filteredBySearch = newData.filter(user =>
      user.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    newData = filteredBySearch;

    if (filterValues.department && filterValues.department.length > 0) {
      newData = newData.filter(user =>
        filterValues.department.includes(user.department)
      );
    }

    if (filterValues.role) {
      newData = newData.filter(user => user.role === filterValues.role);
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'employeeName') {
      newData.sort((a, b) => a.employeeName.localeCompare(b.employeeName) * sortOrder);
    } else if (sortBy === 'employeeNumber') {
      newData.sort((a, b) => a.employeeNumber.localeCompare(b.employeeNumber) * sortOrder);
    } else if (sortBy === 'department') {
      newData.sort((a, b) => a.department.localeCompare(b.department) * sortOrder);
    } else if (sortBy === 'role') {
      newData.sort((a, b) => a.role.localeCompare(b.role) * sortOrder);
    }

    setCurrentFilteredUsers(newData);
    setCurrentPage(1); // Reset to first page after applying filters
  };

  const finalFilteredUsers = useMemo(() => {
    // This memoization ensures that filtering by search term is always applied
    // after other filters handled by `handleApplyFilters`.
    return currentFilteredUsers.filter((user) => {
      const matchesSearch =
        user.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [currentFilteredUsers, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return finalFilteredUsers.slice(start, start + pageSize);
  }, [finalFilteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(finalFilteredUsers.length / pageSize);

  const generateUniqueId = () => `usr${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const handleAdd = async (newUserData: UserForm): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      const id = generateUniqueId();
      const now = new Date().toISOString();

      const fullUser: User = {
        ...newUserData,
        id: id,
        timeAdded: now,
        timeModified: now,
      };

      const updatedList = [...users, fullUser];
      setUsers(updatedList);
      await showSuccess('Success', 'User added successfully!');
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add user:', error);
      showError('Error', 'Failed to add user.');
    }
  };

  const handleEdit = async (updatedUserFormData: UserForm): Promise<void> => {
    try {
      if (!selectedUser) {
        showError('Error', 'No user selected for editing.');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      const now = new Date().toISOString();

      const updatedFullUser: User = {
        ...selectedUser,
        ...updatedUserFormData,
        id: selectedUser.id,
        timeAdded: selectedUser.timeAdded,
        timeModified: now,
      };

      const updatedList = users.map((user) =>
        user.id === updatedFullUser.id ? updatedFullUser : user
      );
      setUsers(updatedList);
      setShowEditModal(false);
      setSelectedUser(null);
      showSuccess('Success', 'User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      showError('Error', 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId);

    if (!userToDelete) {
      showError('Error', 'User not found.');
      return;
    }

    const result = await showConfirmation(`Are you sure you want to delete user ${userToDelete.employeeName} (${userToDelete.employeeNumber})?`);
    if (result.isConfirmed) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

        const updatedList = users.filter((user) => user.id !== userId);
        setUsers(updatedList);
        showSuccess('Success', 'User deleted successfully.');
      } catch (error) {
        console.error('Failed to delete user:', error);
        showError('Error', 'Failed to delete user.');
      }
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return {
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedUser,
    setSelectedUser,
    users, // Renamed from cashAdvances
    filteredUsers: finalFilteredUsers, // Renamed from filteredCashAdvances
    paginatedUsers, // Renamed from paginatedCashAdvances
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    handleAdd,
    handleEdit,
    handleDeleteUser, // Renamed from handleDeleteRequest
    filterSections,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    openAddModal,
    openEditModal,
  };
};
