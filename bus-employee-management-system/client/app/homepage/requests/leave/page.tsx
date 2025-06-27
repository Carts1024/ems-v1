/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import styles from './leave.module.css';
import "@/styles/filters.css"
import "@/styles/pagination.css"
import LeaveFormModal from '@/components/modal/requests/leave/LeaveFormModal';
import { LeaveForm, SpecificLeaveType, DurationType, LeaveStatus } from '@/components/modal/requests/leave/LeaveFormModalLogic';
import { LeaveLogic, Leave } from './leaveLogic';
import PaginationComponent from '@/components/ui/pagination';
import FilterDropdown from '@/components/ui/filterDropdown';

const LeavePage = () => {
  const {
    filteredLeaves,
    searchTerm,
    setSearchTerm,
    paginatedLeaves,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedLeave,
    setSelectedLeave,
    leaves,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
    openAddModal,
    openEditModal,
    filterSections,
    handleApplyFilters,
  } = LeaveLogic();

  // State to control the visibility of the "View" modal
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

  const formatDateTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    });
  };


  const defaultAddLeaveForm: LeaveForm = {
    employee: '',
    department: '',
    dateHired: '',
    jobPosition: '',
    leaveType: '', // Initial value for the select dropdown
    customLeaveType: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    durationType: 'Full Days', // Default to Full Days
    numberOfHours: undefined, // Default to undefined for number input
    specificPartialDate: '',
    reason: '',
    contactInformation: '',
    supportingDocuments: '',
    approver: '',
    remarks: '',
    status: 'Pending', // Default status for new requests
  };

  // Function to open the "View" modal
  const openViewModal = (leave: Leave) => {
    setSelectedLeave(leave); 
    setShowViewModal(true); 
  };

  return (
    <div className={styles.base}>
      <div className={styles.leaveContainer}>
        <h1 className={styles.title}>Leave List</h1>

        <div className={styles.headerSection}>
          <div className={styles.searchAndFilterContainer}>
            <div className={styles.search}>
              <i className="ri-search-line" aria-hidden="true"></i>
              <input
                type="text"
                placeholder="Search here..."
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

          <button onClick={openAddModal} className={styles.addLeaveButton}>
            <i className="ri-add-line" aria-hidden="true"></i> Add Leave
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.leaveTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Time Added</th>
                <th>Time Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{leave.employee}</td>
                  <td>{leave.leaveType}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>
                    <span className={`${styles.leaveStatus} ${
                        leave.status === 'Pending' ? styles['status-Pending'] :
                        leave.status === 'Approved' ? styles['status-Approved'] :
                        leave.status === 'Rejected' ? styles['status-Rejected'] :
                        styles['interview-cancelled']
                      }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>{formatDateTime(leave.createdAt)}</td>
                  <td>{formatDateTime(leave.updatedAt)}</td>

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
                            openEditModal(leave);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-edit-2-line" aria-hidden="true"></i> Edit
                        </button>
                        <button
                          className={styles.viewButton}
                          onClick={() => {
                            openViewModal(leave); 
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-eye-line" aria-hidden="true"></i> View
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(leave.id);
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

        {/* Add Leave Modal: Now correctly uses LeaveFormModal */}
        {showAddModal && (
          <LeaveFormModal
            isEdit={false}
            isView={false} // Not a view modal
            defaultValue={defaultAddLeaveForm}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
            existingEmployees={leaves.map(l => l.employee)}
          />
        )}

        {/* Edit Leave Modal: Now correctly uses LeaveFormModal */}
        {showEditModal && selectedLeave && (
          <LeaveFormModal
            isEdit={true}
            isView={false} // Not a view modal
            defaultValue={{
              // Explicitly cast selectedLeave to unknown first, then to LeaveForm
              // IMPORTANT BY CLANG: This is a workaround until the 'Leave' interface in leaveLogic.tsx is updated.
              ...(selectedLeave as unknown as LeaveForm)
            } as LeaveForm}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
            existingEmployees={leaves.map(l => l.employee)}
          />
        )}

        {/* View Leave Modal: New modal for viewing details */}
        {showViewModal && selectedLeave && (
          <LeaveFormModal
            isEdit={false} 
            isView={true} 
            defaultValue={{
              ...(selectedLeave as unknown as LeaveForm)
            } as LeaveForm}
            onClose={() => setShowViewModal(false)}
            onSubmit={() => { /* No submission in view mode */ }}
            existingEmployees={leaves.map(l => l.employee)}
          />
        )}
      </div>
    </div>
  );
};

export default LeavePage;