'use client';

import React from "react";
import styles from './interview.module.css';
import { InterviewLogic } from './interviewLogic';
import InterviewModal from '@/components/modal/recruitment/InterviewModal';
import FilterDropdown from "@/components/ui/filterDropdown";
import "@/styles/filters.css";
import "@/styles/pagination.css";
import PaginationComponent from '@/components/ui/pagination'; // Import PaginationComponent

export default function InterviewScheduling() {
  const {
    paginatedInterviewSchedules, // Changed from filteredInterviewSchedules to paginatedInterviewSchedules
    searchTerm,
    setSearchTerm,
    interviewStatusFilter,
    setInterviewStatusFilter,
    selectedInterview,
    setSelectedInterview,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    isReadOnlyView,
    setIsReadOnlyView,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    filterSections,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    // Pagination states and functions
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  } = InterviewLogic();

  return (
    <div className={styles.base}>
      <div className={styles.interviewContainer}>
        <h1 className={styles.title}>Interview Schedules</h1>

        {/* Status Filter */}
        <div className={styles.headerSection}>
          <select
            className={styles.statusfilterDropdown}
            value={interviewStatusFilter}
            onChange={(e) => setInterviewStatusFilter(e.target.value)}
          >
            <option value="">Interview Status</option>
            <option value="Not Scheduled">Not Scheduled</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Search */}
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
            <FilterDropdown
              sections={filterSections}
              onApply={handleApplyFilters}
            />
          </div>

          <button className={styles.scheduleInterviewButton} onClick={() => setShowAddModal(true)}>
            <i className="ri-calendar-schedule-line" />
            Schedule Interview
          </button>
        </div>

        {/* Interview Schedules Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.interviewTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Interview Status</th>
                <th>Name</th>
                <th>Desired Position</th>
                <th>Interview Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInterviewSchedules.map((schedule, index: number) => ( // Added type for index
                <tr key={`${schedule.candidateName}-${index}`}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td> {/* Adjusted index for pagination */}
                  <td>
                    <span className={`${styles.interviewStatus} ${
                        schedule.interviewStatus === 'Scheduled' ? styles['interview-scheduled'] :
                        schedule.interviewStatus === 'Not Scheduled' ? styles['interview-not-scheduled'] :
                        schedule.interviewStatus === 'Completed' ? styles['interview-completed'] :
                        styles['interview-cancelled']
                      }`}>
                      {schedule.interviewStatus}
                    </span>
                  </td>
                  <td>{schedule.candidateName}</td>
                  <td>{schedule.position}</td>
                  <td>{schedule.interviewDate}</td>
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
                            setSelectedInterview(schedule);
                            setIsReadOnlyView(true);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                          }}>
                          <i className="ri-eye-line" /> View
                        </button>
                        <button className={styles.editButton}
                          onClick={() => {
                            setSelectedInterview(schedule);
                            setIsReadOnlyView(false);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                          }}>
                          <i className="ri-edit-2-line" /> Edit
                        </button>
                        <button className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(schedule);
                            toggleActionDropdown(null);
                          }}>
                          <i className="ri-delete-bin-line" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1); // Reset to page 1 when size changes
          }}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <InterviewModal
          isEdit={false}
          existingSchedules={paginatedInterviewSchedules} // Pass relevant schedules if needed for uniqueness
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {showEditModal && selectedInterview && (
        <InterviewModal
          isEdit={!isReadOnlyView}
          isReadOnly={isReadOnlyView}
          defaultValue={selectedInterview}
          existingSchedules={paginatedInterviewSchedules} // Pass relevant schedules if needed for uniqueness
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}