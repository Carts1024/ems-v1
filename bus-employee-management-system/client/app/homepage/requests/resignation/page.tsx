'use client';

import React from 'react';
import styles from './resignation.module.css'; 
import "@/styles/filters.css"; 
import "@/styles/pagination.css";
import { ResignationLogic, Resignation } from './resignationLogic'; 
import PaginationComponent from '@/components/ui/pagination'; 
import FilterDropdown from '@/components/ui/filterDropdown'; 
import ResignationModal from '@/components/modal/requests/resignation/resignationmodal';

const ResignationPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    paginatedResignations,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedResignation,
    setSelectedResignation,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
    openAddModal,
    openEditModal,
    filterSections,
    handleApplyFilters,
  } = ResignationLogic(); 

  const [showViewModal, setShowViewModal] = React.useState(false);

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const openViewModal = (resignation: Resignation) => {
    setSelectedResignation(resignation);
    setShowViewModal(true);
  };

  return (
    <div className={styles.base}>
      <div className={styles.resignationContainer}>
        <h1 className={styles.title}>Resignation List</h1>

        <div className={styles.headerSection}>
          <div className={styles.searchAndFilterContainer}>
            <div className={styles.search}>
              <i className="ri-search-line" aria-hidden="true"></i>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <FilterDropdown
              sections={filterSections}
              onApply={handleApplyFilters}
              className={styles.customFilterDropdown}
            />
          </div>

          <button onClick={openAddModal} className={styles.addResignationButton}>
            <i className="ri-add-line" aria-hidden="true"></i> Add Resignation
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.resignationTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th><th>Employee Name</th><th>Job Position</th><th>Department</th> {/* Added Department column */}<th>Last Day of Employment</th><th>Notice Period (Days)</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResignations.map((resignation, index) => (
                <tr key={resignation.id}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{resignation.employee}</td>
                  <td>{resignation.employeeJobPosition}</td>
                  <td>{resignation.department}</td>
                  <td>{formatDate(resignation.lastDayOfEmployment)}</td>
                  <td>{resignation.noticePeriod}</td>
                  <td>
                    <span className={`${styles.resignationStatus} ${
                      styles[`status-${resignation.status.toLowerCase()}`]
                    }`}>
                      {resignation.status}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.mainActionButton}
                      onClick={() => toggleActionDropdown(index)}
                    >
                      <i className="ri-more-2-fill" aria-hidden="true"></i>
                    </button>

                    {openActionDropdownIndex === index && (
                      <div className={styles.actionDropdown}>
                        <button
                          className={styles.editButton}
                          onClick={() => {
                            openEditModal(resignation);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-edit-2-line" aria-hidden="true"></i> Edit
                        </button>
                        <button
                          className={styles.viewButton}
                          onClick={() => {
                            openViewModal(resignation);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-eye-line" aria-hidden="true"></i> View
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(resignation.id);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {showAddModal && (
        <ResignationModal
          isEdit={false}
          isView={false}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {showEditModal && selectedResignation && (
        <ResignationModal
          isEdit={true}
          isView={false}
          defaultValue={selectedResignation}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEdit}
        />
      )}

      {showViewModal && selectedResignation && (
        <ResignationModal
          isEdit={false}
          isView={true}
          defaultValue={selectedResignation}
          onClose={() => setShowViewModal(false)}
          onSubmit={() => { /* No submission in view mode */ }}
        />
      )}
    </div>
  );
};

export default ResignationPage;
