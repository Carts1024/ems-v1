 
 
import { useState, useMemo } from 'react';
import { showSuccess, showConfirmation } from '@/app/utils/swal';

export interface Benefits {
  name: string;
  description: string;
}

export const BenefitsLogic = () => {
  const [benefits, setBenefits] = useState<Benefits[]>([
    { name: 'Service Incentive Leave (SIL)', description: 'Service Incentive Leave (SIL) Benefit' },
    { name: 'Holiday', description: 'Holiday Pay' },
    { name: '13th-month Pay', description: '13th Month Pay' },
    { name: 'Safety', description: 'Safety Benefit' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefits | null>(null);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  const filteredBenefits = useMemo(() => {
    return benefits.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [benefits, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedBenefits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBenefits.slice(start, start + pageSize);
  }, [filteredBenefits, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBenefits.length / pageSize);

  const handleAdd = (name: string, description: string) => {
    const newBenefit = {
      name,
      description: description.trim() || 'No description',
    };
    const updated = [...benefits, newBenefit];
    setBenefits(updated);
    showSuccess('Success', 'Benefit added successfully.');
  };

  const handleEdit = (updatedName: string, updatedDescription: string) => {
    if (!selectedBenefit) return;

    const updatedList = benefits.map((b) =>
      b.name === selectedBenefit.name
        ? {
            ...b,
            name: updatedName,
            description: updatedDescription.trim() || 'No description',
          }
        : b
    );
    setBenefits(updatedList);
    showSuccess('Success', 'Benefit updated successfully.');
  };

  const handleDeleteRequest = async (benefitName: string) => {
    const result = await showConfirmation('Are you sure you want to delete this benefit?');
    if (result.isConfirmed) {
      const updatedList = benefits.filter(b => b.name !== benefitName);
      setBenefits(updatedList);
      showSuccess('Success', 'Benefit deleted successfully.');
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  return {
    benefits,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedBenefit,
    setSelectedBenefit,
    filteredBenefits,
    paginatedBenefits,
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