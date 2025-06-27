/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import styles from './benefits.module.css';
import "@/styles/filters.css"
import "@/styles/pagination.css"
import BenefitsModal from '@/components/modal/information/BenefitsModalLogic';
import { BenefitsLogic } from './benefitsLogic';
import PaginationComponent from '@/components/ui/pagination';

const BenefitsPage = () => {
  const {
    filteredBenefits,
    searchTerm,
    setSearchTerm,
    paginatedBenefits,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedBenefit,
    setSelectedBenefit,
    benefits,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
  } = BenefitsLogic();

  const [isViewMode, setIsViewMode] = React.useState(false);

  return (
    <div className={styles.base}>
      <div className={styles.benefitsContainer}>
        <h1 className={styles.title}>Benefits List</h1>

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

          <button onClick={() => setShowAddModal(true)} className={styles.addBenefitsButton}>
            <i className='ri-add-line'/>
            Add Benefit
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.benefitsTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBenefits.map((bnfts, index) => (
                <tr key={bnfts.name}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{bnfts.name}</td>
                  <td className={styles.actionCell}>
                    {/* The main action button */}
                    <button
                      className={styles.mainActionButton} // You might need to define this style
                      onClick={() => toggleActionDropdown(index)}
                    >
                      <i className="ri-more-2-fill" />
                    </button>

                    {/* Action dropdown container, conditionally rendered */}
                    {openActionDropdownIndex === index && (
                      <div className={styles.actionDropdown}>
                        <button
                          className={styles.viewButton}
                            onClick={() => {
                            setSelectedBenefit(bnfts);
                            setIsViewMode(true);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                        }}
                        > <i className='ri-eye-line'/> View
                        </button>
                        <button
                          className={styles.editButton}
                            onClick={() => {
                            setSelectedBenefit(bnfts);
                            setIsViewMode(false);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                        }}
                        > <i className='ri-edit-2-line'/> Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(bnfts.name);
                            toggleActionDropdown(null); // Close dropdown after action
                          }}
                        > <i className='ri-delete-bin-line' /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
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
        <BenefitsModal
            isEdit={false}
            existingBenefits={benefits.map((b) => b.name)}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
        />
        )}

        {showEditModal && selectedBenefit && (
        <BenefitsModal
            isEdit={!isViewMode} // Only true if not in view mode
            isView={isViewMode}  // Pass view flag separately
            defaultValue={selectedBenefit.name}
            defaultDescription={selectedBenefit.description}
            existingBenefits={benefits.map((b) => b.name)}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
        />
        )}
      </div>
    </div>
  );
};

export default BenefitsPage;