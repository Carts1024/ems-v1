'use client';

import React from 'react';
import styles from '@/app/homepage/attendance/attendance.module.css';
import PaginationComponent from '@/components/ui/pagination';
import FilterDropDown from '@/components/ui/filterDropdown';
import AttendanceModal from '@/components/modal/attendance/AttendanceModal';
import { DailyReportLogic } from './dailyReportLogic';
import '@/styles/filters.css';

export default function AttendancePage() {
  const {
    showAddModal,
    setShowAddModal,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleAdd,
    handleDeleteRequest,
    filterSections,
    handleApplyFilters,
    paginatedEmployees,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  } = DailyReportLogic();

  return (
    <div className={styles.base}>
      <div className={styles.attendanceContainer}>
        <h1 className={styles.title}>Attendance Report</h1>

        <div className={styles.headerSection}>
          <select
            className={styles.statusfilterDropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
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

          <div className="filter">
            <FilterDropDown
              sections={filterSections}
              onApply={handleApplyFilters}
            />
          </div>

          <button className={styles.addAttendanceButton} onClick={() => setShowAddModal(true)}>
            <i className="ri-add-line" /> Record
          </button>

          <button className={styles.importButton}>
            <i className="ri-import-line" /> Import
          </button>

          <button className={styles.exportButton}>
            <i className="ri-export-line" /> Export
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.attendanceTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Status</th>
                <th>Employee Name</th>
                <th>Date Hired</th>
                <th>Department</th>
                <th>Position</th>
                <th>Attendance Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp, index) => (
                  <tr key={`${emp.employeeName}-${index}`}>
                    <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      <span className={`${styles.empStatus} ${styles[`status-${emp.attendanceStatus}`]}`}>
                        {emp.attendanceStatus}
                      </span>
                    </td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.dateHired}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.attendanceDate}</td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteRequest(emp)}
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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

        {showAddModal && (
          <AttendanceModal onClose={() => setShowAddModal(false)} onSubmit={handleAdd} />
        )}
      </div>
    </div>
  );
}