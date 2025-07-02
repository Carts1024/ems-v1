'use client';

import React from 'react';
import styles from '@/app/homepage/attendance/attendance.module.css';
import PaginationComponent from '@/components/ui/pagination';
import FilterDropDown from '@/components/ui/filterDropdown';
import AttendanceModal from '@/components/modal/attendance/AttendanceModal';
import { dailyReportLogic } from './dailyReportLogic';
import FacialRecognitionModal from '@/components/modal/attendance/FacialRecognitionModal';
import FaceScanOptionsModal from '@/components/modal/attendance/FaceScanOptionsModal';
import RegisterFaceModal from '@/components/modal/attendance/RegisterFaceModal';
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
    totalPages,
    openActionDropdownIndex,
    toggleActionDropdown,
    selectedAttendance,
    setSelectedAttendance,
    isViewMode,
    setIsViewMode,
    showFaceScanOptionsModal,
    setShowFaceScanOptionsModal,
    showFacialRecognitionModal,
    setShowFacialRecognitionModal,
    showRegisterFaceModal,
    setShowRegisterFaceModal,
    handleFacialScanSuccess,
    handleFaceRegistrationSuccess,
    openFacialRecognitionModal,
    openRegisterFaceModal,
  } = dailyReportLogic(); 

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

          <button
            className={styles.facialRecognitionButton}
            onClick={() => setShowFaceScanOptionsModal(true)}
          >
            <i className="ri-camera-line" /> Face Scan
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
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp, index) => (
                  <tr key={`${emp.employeeName}-${index}`}>
                    <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      <span className={`${styles.empStatus} ${styles[`status-${emp.status}`]}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.hiredate}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.date}</td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.mainActionButton}
                        onClick={() => toggleActionDropdown(index)}
                      >
                        <i className="ri-more-2-fill" />
                      </button>

                      {openActionDropdownIndex === index && (
                        <div className={styles.actionDropdown}>
                          <button
                            className={styles.viewButton}
                            onClick={() => {
                              setSelectedAttendance(emp);
                              setIsViewMode(true);
                              setShowAddModal(true);
                              toggleActionDropdown(null);
                            }}
                          > <i className='ri-eye-line'/> View
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => {
                              handleDeleteRequest(emp);
                              toggleActionDropdown(null);
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
          <AttendanceModal
            onClose={() => {
              setShowAddModal(false);
              setSelectedAttendance(null);
              setIsViewMode(false);
            }}
            onSubmit={handleAdd}
            defaultValue={selectedAttendance || undefined}
            isView={isViewMode}
          />
        )}

        {showFaceScanOptionsModal && (
          <FaceScanOptionsModal
            onClose={() => setShowFaceScanOptionsModal(false)}
            onRecordAttendanceClick={openFacialRecognitionModal}
            onRegisterFaceClick={openRegisterFaceModal}
          />
        )}

        {showFacialRecognitionModal && (
          <FacialRecognitionModal
            onClose={() => setShowFacialRecognitionModal(false)}
            onScanSuccess={handleFacialScanSuccess}
          />
        )}

        {showRegisterFaceModal && (
          <RegisterFaceModal
            onClose={() => setShowRegisterFaceModal(false)}
            onRegisterSuccess={handleFaceRegistrationSuccess}
          />
        )}
      </div>
    </div>
  );
}