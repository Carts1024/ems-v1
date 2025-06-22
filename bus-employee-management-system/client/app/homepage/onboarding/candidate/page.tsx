/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import styles from './candidate.module.css';
import { useCandidateLogic } from './candidateLogic';
import CandidateModal from '@/components/modal/onboarding/CandidateModal';
import FeedbackModal from '@/components/modal/onboarding/FeedbackModal';
import FilterDropDown, { FilterSection } from '@/components/ui/filterDropdown';
import "@/styles/filters.css";
import "@/styles/pagination.css";

export default function CandidatePage() {
  const {
    candidates,
    filteredCandidates,
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
    handleApplyFilters
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
              {filteredCandidates.map((c, index) => (
                <tr key={`${c.firstName}-${c.lastName}-${index}`}>
                  <td className={styles.firstColumn}>{index + 1}</td>
                  <td>{`${c.firstName} ${c.middleName} ${c.lastName}`}</td>
                  <td>{c.position}</td>
                  <td>{c.sourceOfHire}</td>
                  <td>{c.applicationDate}</td>
                  <td>{c.department}</td>
                  <td>{c.applicationStatus}</td>
                  <td>{c.interviewStatus}</td>
                  <td className={styles.actionCell}>
                    <button className={styles.viewButton}
                      onClick={() => { 
                        setSelectedCandidate(c); 
                        setIsReadOnlyView(true); 
                        setShowEditModal(true); }}>
                        <i className="ri-eye-line" />
                    </button>
                    <button className={styles.feedbackButton}
                      onClick={() => {
                        setSelectedCandidate(c);
                        setShowFeedbackModal(true);
                      }}>
                      <i className='ri-feedback-line'/>
                    </button>
                    <button className={styles.editButton}
                      onClick={() => { 
                        setSelectedCandidate(c); 
                        setIsReadOnlyView(false); 
                        setShowEditModal(true); }}>
                        <i className="ri-edit-2-line" />
                    </button>
                    <button className={styles.deleteButton}
                      onClick={() => handleDeleteRequest(c)}>
                      <i className="ri-delete-bin-line" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
            <button className="page-btn">
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">5</button>
            <button className="page-btn">
              <i className="ri-arrow-right-s-line"></i>
            </button>
        </div>   

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
