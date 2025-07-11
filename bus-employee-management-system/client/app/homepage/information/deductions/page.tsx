/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import styles from './deductions.module.css';
import "@/styles/filters.css"
import "@/styles/pagination.css"
import DeductionsModal from '@/components/modal/information/DeductionsModalLogic';
import { DeductionsLogic } from './deductionsLogic';
import PaginationComponent from '@/components/ui/pagination';

const DeductionsPage = () => {
  const {
    filteredDeductions,
    loading,
    isOperationLoading,
    searchTerm,
    setSearchTerm,
    paginatedDeductions,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedDeduction,
    setSelectedDeduction,
    deductions,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
  } = DeductionsLogic();

  const [isViewMode, setIsViewMode] = React.useState(false);

  return (
    <div className={styles.base}>
      <div className={styles.deductionsContainer}>
        <h1 className={styles.title}>Deduction List</h1>

        <div className={styles.headerSection}>

          {/* Search */}
          <div className={styles.search}>
            <i className='ri-search-line'/>
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)} 
            className={styles.addDeductionsButton}
            disabled={isOperationLoading}
          >
            <i className='ri-add-line'/>
            Add Deduction
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.deductionsTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                    Loading deductions...
                  </td>
                </tr>
              ) : paginatedDeductions.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                    No deductions found
                  </td>
                </tr>
              ) : (
                paginatedDeductions.map((deduct, index) => (
                <tr key={deduct.id}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{deduct.name}</td>
                  <td className={styles.actionCell}>
                    {/* The main action button */}
                    <button
                      className={styles.mainActionButton} // You might need to define this style
                      onClick={() => toggleActionDropdown(index)}
                      disabled={isOperationLoading}
                    >
                      <i className="ri-more-2-fill" />
                    </button>

                    {/* Action dropdown container, conditionally rendered */}
                    {openActionDropdownIndex === index && (
                      <div className={styles.actionDropdown}>
                        <button
                          className={styles.viewButton}
                            onClick={() => {
                            setSelectedDeduction(deduct);
                            setIsViewMode(true);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                        }}
                        > <i className='ri-eye-line'/> View
                        </button>
                        <button
                          className={styles.editButton}
                            onClick={() => {
                            setSelectedDeduction(deduct);
                            setIsViewMode(false);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                        }}
                        > <i className='ri-edit-2-line'/> Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(deduct);
                            toggleActionDropdown(null); // Close dropdown after action
                          }}
                        > <i className='ri-delete-bin-line' /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1); // reset to page 1 when size changes
          }}
        />

        {showAddModal && (
        <DeductionsModal
            isEdit={false}
            existingDeductions={deductions.map((b) => b.name)}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
        />
        )}

        {showEditModal && selectedDeduction && (
        <DeductionsModal
            isEdit={!isViewMode} // Only true if not in view mode
            isView={isViewMode}  // Pass view flag separately
            defaultValue={selectedDeduction.name}
            defaultDescription={selectedDeduction.description}
            existingDeductions={deductions.map((b) => b.name)}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
        />
        )}
      </div>
    </div>
  );
};

export default DeductionsPage;