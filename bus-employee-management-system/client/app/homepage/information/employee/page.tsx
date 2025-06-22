'use client';

import React from "react";
import styles from './employee.module.css';
import { EmployeeLogic } from './employeeLogic';
import EmployeeModal from '@/components/modal/information/EmployeeModal';
import FilterDropDown from '@/components/ui/filterDropdown';
import "@/styles/filters.css";
import "@/styles/pagination.css";

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
    positions,
    getPositionName,
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
              {filteredEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td className={styles.firstColumn}>{index + 1}</td>
                  <td>{emp.status}</td>
                  <td>{`${emp.firstName} ${emp.middleName ?? ''} ${emp.lastName}`}</td>
                  <td>{emp.dateHired}</td>
                  <td>{typeof emp.positionId === "number" ? getPositionName(emp.positionId) : ""}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.viewButton}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsReadOnlyView(true);
                        setShowEditModal(true);
                      }}
                    > <i className="ri-eye-line"/>
                    </button>

                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsReadOnlyView(false);
                        setShowEditModal(true);
                      }}
                    > <i className="ri-edit-2-line"/>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteRequest(emp)}
                    > <i className="ri-delete-bin-line"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
          <EmployeeModal
            isEdit={false}
            existingEmployees={employees}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
            positions={positions}
          />
        )}

        {showEditModal && selectedEmployee && (
          <EmployeeModal
            isEdit={true}
            defaultValue={selectedEmployee}
            existingEmployees={employees}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
            positions={positions}
            isReadOnly={isReadOnlyView}
          />
        )}
      </div>
    </div>
  );
}
