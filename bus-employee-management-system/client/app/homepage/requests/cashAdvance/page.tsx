// cashadvancepage.tsx
'use client';

import React from 'react';
import styles from './cashAdvance.module.css';
import "@/styles/filters.css"
import "@/styles/pagination.css"
// UPDATED IMPORT PATH:
import CAModal from '@/components/modal/requests/cashAdvance/CAModal'; // Import the new CAModal from its new location
import { CashAdvanceLogic, CashAdvance } from './cashAdvanceLogic';
import PaginationComponent from '@/components/ui/pagination';
import FilterDropdown from '@/components/ui/filterDropdown';

const CashAdvancePage = () => {
  const {
    searchTerm,
    setSearchTerm,
    paginatedCashAdvances,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedCashAdvance,
    setSelectedCashAdvance,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
    openAddModal,
    openEditModal,
    filterSections,
    handleApplyFilters,
  } = CashAdvanceLogic();

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
      hour12: false,
    });
  };

  const openViewModal = (cashAdvance: CashAdvance) => {
    setSelectedCashAdvance(cashAdvance);
    setShowViewModal(true);
  };

  return (
    <div className={styles.base}>
      <div className={styles.cashAdvanceContainer}>
        <h1 className={styles.title}>Cash Advance List</h1>

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

          <button onClick={openAddModal} className={styles.addCashAdvanceButton}>
            <i className="ri-add-line" aria-hidden="true"></i> Add Cash Advance
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.cashAdvanceTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Employee Name</th>
                <th>Advance Type</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Repay Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCashAdvances.map((cashAdvance, index) => (
                <tr key={cashAdvance.id}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{cashAdvance.employeeName}</td>
                  <td>{cashAdvance.advanceType}</td>
                  <td>PHP {cashAdvance.amount.toFixed(2)}</td>
                  <td>{formatDate(cashAdvance.dueDate)}</td>
                  <td>
                    {cashAdvance.repaymentMethod === 'Deduction over periods'
                      ? `Deduction over ${cashAdvance.numberOfRepaymentPeriods} periods`
                      : cashAdvance.repaymentMethod === 'Full repayment on specific date'
                      ? `Full by ${formatDate(cashAdvance.fullRepaymentDate || '')}`
                      : cashAdvance.repaymentMethod
                    }
                  </td>
                  <td>
                    <span className={`${styles.cashAdvanceStatus} ${
                        cashAdvance.status === 'Pending' ? styles['status-Pending'] :
                        cashAdvance.status === 'Approved' ? styles['status-Approved'] :
                        cashAdvance.status === 'Rejected' ? styles['status-Rejected'] :
                        cashAdvance.status === 'Reimbursed' ? styles['status-Reimbursed'] :
                        styles['status-Cancelled']
                      }`}>
                      {cashAdvance.status}
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
                            openEditModal(cashAdvance);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-edit-2-line" aria-hidden="true"></i> Edit
                        </button>
                        <button
                          className={styles.viewButton}
                          onClick={() => {
                            openViewModal(cashAdvance);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-eye-line" aria-hidden="true"></i> View
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(cashAdvance.id);
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
        <CAModal
          isEdit={false}
          isView={false}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {showEditModal && selectedCashAdvance && (
        <CAModal
          isEdit={true}
          isView={false}
          defaultValue={selectedCashAdvance}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEdit}
        />
      )}

      {showViewModal && selectedCashAdvance && (
        <CAModal
          isEdit={false}
          isView={true}
          defaultValue={selectedCashAdvance}
          onClose={() => setShowViewModal(false)}
          onSubmit={() => { /* No submission in view mode */ }}
        />
      )}
    </div>
  );
};

export default CashAdvancePage;