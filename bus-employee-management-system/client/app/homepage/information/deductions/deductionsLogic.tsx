 
 
import { useState, useMemo } from 'react';
import { showSuccess, showConfirmation } from '@/app/utils/swal';

export interface Deductions {
  name: string;
  description: string;
}

export const DeductionsLogic = () => {
  const [deductions, setDeductions] = useState<Deductions[]>([
    { name: 'SSS', description: 'Social Security System' },
    { name: 'Pag-IBIG', description: 'Home Development Mutual Fund' },
    { name: 'PhilHealth', description: 'Philippine Health Insurance Corporation' },
    { name: 'Withholding', description: 'Remitted to the Bureau of Internal Revenue (BIR)' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<Deductions | null>(null);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  const filteredDeductions = useMemo(() => {
    return deductions.filter(deduct => deduct.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [deductions, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedDeductions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeductions.slice(start, start + pageSize);
  }, [filteredDeductions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDeductions.length / pageSize);

  const handleAdd = (name: string, description: string) => {
    const newDeduction = {
      name,
      description: description.trim() || 'No description',
    };
    const updated = [...deductions, newDeduction];
    setDeductions(updated);
    showSuccess('Success', 'Deduction added successfully.');
  };

  const handleEdit = (updatedName: string, updatedDescription: string) => {
    if (!selectedDeduction) return;

    const updatedList = deductions.map((deduct) =>
      deduct.name === selectedDeduction.name
        ? {
            ...deduct,
            name: updatedName,
            description: updatedDescription.trim() || 'No description',
          }
        : deduct
    );
    setDeductions(updatedList);
    showSuccess('Success', 'Deduction updated successfully.');
  };

  const handleDeleteRequest = async (deductionName: string) => {
    const result = await showConfirmation('Are you sure you want to delete this deduction?');
    if (result.isConfirmed) {
      const updatedList = deductions.filter(deduct => deduct.name !== deductionName);
      setDeductions(updatedList);
      showSuccess('Success', 'Deduction deleted successfully.');
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  return {
    deductions,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedDeduction,
    setSelectedDeduction,
    filteredDeductions,
    paginatedDeductions,
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
  };
};