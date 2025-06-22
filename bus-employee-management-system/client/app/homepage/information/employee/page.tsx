'use client';

import React from "react";
import styles from './employee.module.css';
import { EmployeeLogic } from './employeeLogic';
import PaginationComponent from "@/components/ui/pagination";
import EmployeeModal from '@/components/modal/information/EmployeeModal';
import FilterDropDown from '@/components/ui/filterDropdown';
import "@/styles/filters.css";

export default function EmployeePage() {
  const {
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedEmployee,
    setSelectedEmployee,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    isReadOnlyView,
    setIsReadOnlyView,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredEmployees,
    employees,
    filterSections,
    handleApplyFilters,
    // Import the new state and function for the action dropdown
    openActionDropdownIndex,
    toggleActionDropdown,
    paginatedEmployees,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
  } = EmployeeLogic();

  return (
    <div className={styles.base}>
      <div className={styles.employeeContainer}>
        <h1 className={styles.title}>Employee List</h1>

        <div className={styles.headerSection}>
          <select
            className={styles.statusfilterDropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>

          <div className={styles.search}>
            <i className='ri-search-line'/>
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

          <button className={styles.addEmployeeButton} onClick={() => setShowAddModal(true)}>
            <i className="ri-add-line"/>
            Add Employee
          </button>
          <button className={styles.importButton}>
            <i className="ri-import-line"/>
            Import
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.employeeTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Status</th>
                <th>Name</th>
                <th>Date Hired</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp, index) => (
                <tr key={`${emp.firstName}-${emp.lastName}-${index}`}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>
                    <span className={`${styles.empStatus} ${
                        emp.status === 'Active' ? styles['status-Active'] :
                        emp.status === 'Resigned' ? styles['status-Resigned'] :
                        emp.status === 'On Leave' ? styles['status-onLeave'] :
                        styles['interview-cancelled']
                      }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>{`${emp.firstName} ${emp.middleName} ${emp.lastName}`}</td>
                  <td>{emp.dateHired}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>

                  {/* ACTION COLUMN AND CELLS - Implemented using the reference */}
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
                            setSelectedEmployee(emp);
                            setIsReadOnlyView(true);
                            setShowEditModal(true);
                            toggleActionDropdown(null); // Close dropdown
                          }}>
                          <i className="ri-eye-line"/> View
                        </button>

                        <button className={styles.editButton}
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsReadOnlyView(false);
                            setShowEditModal(true);
                            toggleActionDropdown(null); // Close dropdown
                          }}>
                          <i className="ri-edit-2-line"/> Edit
                        </button>
                        <button className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(emp);
                            toggleActionDropdown(null); // Close dropdown
                          }}>
                          <i className="ri-delete-bin-line"/> Delete
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

        {/* Modals */}
        {showAddModal && (
          <EmployeeModal
            isEdit={false}
            existingEmployees={employees}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
            positions={positions}
          />
        )}

        {/* Combined Edit/View Modal */}
        {showEditModal && selectedEmployee && (
          <EmployeeModal
            isEdit={!isReadOnlyView}
            isReadOnly={isReadOnlyView}
          />
        )}
      </div>
    </div>
  );
}
