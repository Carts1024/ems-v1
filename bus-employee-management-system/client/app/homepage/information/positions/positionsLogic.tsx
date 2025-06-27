import { useState, useMemo } from 'react';
import { showSuccess, showConfirmation } from '@/app/utils/swal';

export interface Position {
  positionName: string;
  department: string;
}

const departmentOptions = [
  'Accounting',
  'Human Resource',
  'Inventory',
  'Operational',
];

export const PositionsLogic = () => {
  const [positions, setPositions] = useState<Position[]>([
    { positionName: 'Manager', department: 'Accounting' },
    { positionName: 'Clerk', department: 'Inventory' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  const filteredPositions = useMemo(() => {
    return positions.filter(p => p.positionName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [positions, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedPositions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPositions.slice(start, start + pageSize);
  }, [filteredPositions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPositions.length / pageSize);

  const handleAdd = (positionName: string, department: string) => {
    const newPosition = { positionName, department };
    const updated = [...positions, newPosition];
    setPositions(updated);
    showSuccess('Success', 'Position added successfully.');
  };

  const handleEdit = (updatedName: string, updatedDepartment: string) => {
    if (!selectedPosition) return;
    const updatedList = positions.map(p =>
      p.positionName === selectedPosition.positionName
        ? { positionName: updatedName, department: updatedDepartment }
        : p
    );
    setPositions(updatedList);
    showSuccess('Success', 'Position updated successfully.');
  };

  const handleDeleteRequest = async (positionName: string) => {
    const result = await showConfirmation('Are you sure you want to delete this position?');
    if (result.isConfirmed) {
      setPositions(prev => prev.filter(p => p.positionName !== positionName));
      showSuccess('Success', 'Position deleted successfully.');
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  return {
    positions,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedPosition,
    setSelectedPosition,
    filteredPositions,
    paginatedPositions,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
    departmentOptions,
  };
};