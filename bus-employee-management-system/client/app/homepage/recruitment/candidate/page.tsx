'use client';

import React from 'react';
import styles from './candidate.module.css';
import { Candidate, useCandidateLogic } from './candidateLogic';
import CandidateModal from '@/components/modal/recruitment/CandidateModal';
import FeedbackModal from '@/components/modal/recruitment/FeedbackModal';
import FilterDropDown from '@/components/ui/filterDropdown';
import "@/styles/filters.css";
import "@/styles/pagination.css";
import PaginationComponent from '@/components/ui/pagination';


export default function CandidatePage() {
  const {
    candidates,
    searchTerm,
    setSearchTerm,
    applicationStatusFilter,
    setApplicationStatusFilter,
    interviewStatusFilter,
    setInterviewStatusFilter,
    selectedCandidate,
    setSelectedCandidate,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showFeedbackModal,
    setShowFeedbackModal,
    isReadOnlyView,
    setIsReadOnlyView,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    filterSections,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    paginatedCandidates, // This is the actual paginated and filtered data
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  } = useCandidateLogic();

  return (
    <div className={styles.base}>
      <div className={styles.candidateContainer}>
        <h1 className={styles.title}>Candidate Overview</h1>

        {/* Application Status Filter */}
        <div className={styles.headerSection}>
          <select className={styles.statusfilterDropdown} value={applicationStatusFilter} onChange={(e) => setApplicationStatusFilter(e.target.value)}>
            <option value="">Application Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Hired">Hired</option>
          </select>

        {/* Interview Status Filter */}
          <select className={styles.statusfilterDropdown} value={interviewStatusFilter} onChange={(e) => setInterviewStatusFilter(e.target.value)}>
            <option value="">Interview Status</option>
            <option value="Not Scheduled">Not Scheduled</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option> {/* Corrected duplicated value */}
          </select>

          <div className={styles.search}>
            <i className='ri-search-line' />
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button with Dropdown */}
          <div className="filter">
            <FilterDropDown
              sections={filterSections}
              onApply={handleApplyFilters}
            />
          </div>

          <button className={styles.addCandidateButton} onClick={() => setShowAddModal(true)}>
            <i className="ri-add-line" />
            Add Candidate
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.candidateTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Name</th>
                <th>Desired Position</th>
                <th>Source of Hire</th>
                <th>Application Date</th>
                <th>Department</th>
                <th>Application Status</th>
                <th>Interview Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((c: Candidate, index: number) => (
                  <tr key={`${c.firstName}-${c.lastName}-${index}`}
                  >
                    <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{`${c.firstName} ${c.middleName} ${c.lastName} ${c.suffix}`}</td>
                    <td>{c.position}</td>
                    <td>{c.sourceOfHire}</td>
                    <td>{c.applicationDate}</td>
                    <td>{c.department}</td>
                    <td>
                      <span className={`${styles.applicationStatus} ${c.applicationStatus === 'Pending' ? styles['app-pending'] : c.applicationStatus === 'Processing' ? styles['app-processing'] : styles['app-hired']}`}>
                        {c.applicationStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.interviewStatus} ${
                          c.interviewStatus === 'Scheduled' ? styles['interview-scheduled'] :
                          c.interviewStatus === 'Not Scheduled' ? styles['interview-not-scheduled'] :
                          c.interviewStatus === 'Completed' ? styles['interview-completed'] :
                          styles['interview-cancelled']
                        }`}>
                        {c.interviewStatus}
                      </span>
                    </td>

                  {/* ACTION COLUMN AND CELLS */}
                  <td className={styles.actionCell}>
                    {/* The main action button */}
                    <button
                      className={styles.mainActionButton}
                      onClick={() => toggleActionDropdown(index)}
                    >
                      <i className="ri-more-2-fill" />
                    </button>

                    {/* Action dropdown container, conditionally rendered */}
                    {openActionDropdownIndex === index && (
                      <div className={styles.actionDropdown}>
                        <button className={styles.viewButton}
                          onClick={() => {
                            setSelectedCandidate(c);
                            setIsReadOnlyView(true);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                          }}>
                            <i className="ri-eye-line" /> View
                        </button>
                        <button className={styles.feedbackButton}
                          onClick={() => {
                            setSelectedCandidate(c);
                            setShowFeedbackModal(true);
                            toggleActionDropdown(null);
                          }}> 
                          <i className='ri-feedback-line'/> Feedback
                        </button>
                        <button className={styles.editButton}
                          onClick={() => {
                            setSelectedCandidate(c);
                            setIsReadOnlyView(false);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                          }}>
                            <i className="ri-edit-2-line" /> Edit
                        </button>
                        <button className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(c);
                            toggleActionDropdown(null);
                          }}>
                          <i className="ri-delete-bin-line" /> Delete
                        </button>
                      </div>
                    )}
                    {/* END OF ACTION COLUMN AND CELLS */}
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


        {/* Modals */}
        {showAddModal && (
          <CandidateModal
            isEdit={false}
            existingCandidates={candidates}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
          />
        )}

        {showEditModal && selectedCandidate && (
          <CandidateModal
            isEdit={!isReadOnlyView}
            isReadOnly={isReadOnlyView}
            defaultValue={selectedCandidate}
            existingCandidates={candidates}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
          />
        )}

        {showFeedbackModal && selectedCandidate && (
          <FeedbackModal
            candidate={selectedCandidate}
            onClose={() => setShowFeedbackModal(false)}
          />
        )}

      </div>
    </div>
  );
}