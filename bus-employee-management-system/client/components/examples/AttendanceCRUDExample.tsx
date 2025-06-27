'use client';

import React from 'react';
import { useDailyReportLogic } from '@/hooks/useDailyReportLogic';
import AttendanceModal from '@/components/modal/attendance/AttendanceModal';
import { SearchableDropdown, DropdownOption } from '@/components/ui/SearchableDropdown';

// Example component showing how to use the CRUD functionality
const AttendanceCRUDExample: React.FC = () => {
  const {
    attendanceList,
    employees,
    loading,
    selectedEmployeeId,
    showAddModal,
    showEditModal,
    showViewModal,
    selectedAttendance,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleAddAttendance,
    handleEditAttendance,
    handleViewAttendance,
    handleDeleteAttendance,
    handleAttendanceSubmit,
    handleModalClose,
    handleEmployeeFilter,
  } = useDailyReportLogic();

  // Convert employees to dropdown options
  const employeeOptions: DropdownOption[] = [
    { id: '', label: 'All Employees' },
    ...employees.map(employee => ({
      id: employee.id,
      label: `${employee.firstName} ${employee.lastName}`,
      subtitle: `${employee.employeeNumber} • ${employee.position?.positionName || 'N/A'}`,
    }))
  ];

  if (loading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  return (
    <div className="attendance-crud-container">
      <div className="header">
        <h1>Attendance Management</h1>
        <button 
          onClick={handleAddAttendance}
          className="add-button"
        >
          Add Attendance Record
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name, department, or position..."
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="employee">Employee:</label>
          <SearchableDropdown
            options={employeeOptions}
            value={selectedEmployeeId}
            onChange={handleEmployeeFilter}
            placeholder="Filter by employee..."
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Position</th>
              <th>Date</th>
              <th>Status</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Holiday</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.length === 0 ? (
              <tr>
                <td colSpan={9} className="no-data">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendanceList.map((attendance) => (
                <tr key={attendance.id}>
                  <td>{attendance.employeeName}</td>
                  <td>{attendance.department}</td>
                  <td>{attendance.position}</td>
                  <td>{new Date(attendance.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${attendance.status.toLowerCase()}`}>
                      {attendance.status}
                    </span>
                  </td>
                  <td>{attendance.timeIn || '-'}</td>
                  <td>{attendance.timeOut || '-'}</td>
                  <td>{attendance.isHoliday ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewAttendance(attendance)}
                        className="view-btn"
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEditAttendance(attendance)}
                        className="edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteAttendance(attendance)}
                        className="delete-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AttendanceModal
          onClose={handleModalClose}
          onSubmit={handleAttendanceSubmit}
        />
      )}

      {showEditModal && selectedAttendance && (
        <AttendanceModal
          onClose={handleModalClose}
          onSubmit={handleAttendanceSubmit}
          defaultValue={{
            id: selectedAttendance.id,
            status: selectedAttendance.status as '' | 'Present' | 'Absent' | 'Late',
            employeeName: selectedAttendance.employee 
              ? `${selectedAttendance.employee.firstName} ${selectedAttendance.employee.lastName}`
              : 'Unknown Employee',
            employeeId: selectedAttendance.employeeId,
            hiredate: selectedAttendance.employee?.hiredate || '',
            department: selectedAttendance.employee?.position?.department?.departmentName || 
                        selectedAttendance.employee?.department || '',
            position: selectedAttendance.employee?.position?.positionName || 
                      selectedAttendance.employee?.positionName || '',
            date: new Date(selectedAttendance.date).toISOString().split('T')[0],
            timeIn: selectedAttendance.timeIn ? new Date(selectedAttendance.timeIn).toTimeString().slice(0, 5) : '',
            timeOut: selectedAttendance.timeOut ? new Date(selectedAttendance.timeOut).toTimeString().slice(0, 5) : '',
            remarks: selectedAttendance.remarks || '',
            isHoliday: selectedAttendance.isHoliday || false,
          }}
        />
      )}

      {showViewModal && selectedAttendance && (
        <AttendanceModal
          onClose={handleModalClose}
          onSubmit={handleAttendanceSubmit}
          isView={true}
          defaultValue={{
            id: selectedAttendance.id,
            status: selectedAttendance.status as '' | 'Present' | 'Absent' | 'Late',
            employeeName: selectedAttendance.employee 
              ? `${selectedAttendance.employee.firstName} ${selectedAttendance.employee.lastName}`
              : 'Unknown Employee',
            employeeId: selectedAttendance.employeeId,
            hiredate: selectedAttendance.employee?.hiredate || '',
            department: selectedAttendance.employee?.position?.department?.departmentName || 
                        selectedAttendance.employee?.department || '',
            position: selectedAttendance.employee?.position?.positionName || 
                      selectedAttendance.employee?.positionName || '',
            date: new Date(selectedAttendance.date).toISOString().split('T')[0],
            timeIn: selectedAttendance.timeIn ? new Date(selectedAttendance.timeIn).toTimeString().slice(0, 5) : '',
            timeOut: selectedAttendance.timeOut ? new Date(selectedAttendance.timeOut).toTimeString().slice(0, 5) : '',
            remarks: selectedAttendance.remarks || '',
            isHoliday: selectedAttendance.isHoliday || false,
          }}
        />
      )}
    </div>
  );
};

export default AttendanceCRUDExample;
