/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import styles from './department.module.css';
import "@/styles/filters.css"
import "@/styles/pagination.css"
import DepartmentModal from '@/components/modal/information/DepartmentModalLogic';
import { DepartmentLogic } from './departmentLogic';
import PaginationComponent from '@/components/ui/pagination';

const DepartmentPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedDept,
    setSelectedDept,
    departments,
    filteredDepartments,
    paginatedDepartments,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
  } = DepartmentLogic();

  return (
    <div className={styles.base}>
      <div className={styles.departmentContainer}>
        <h1 className={styles.title}>Department List</h1>

        <div className={styles.headerSection}>
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

          {/* Sort by No. of Employees */}
          <div className={styles.sortWrapper}>
            <label htmlFor="sortOrder">Sort by</label>
            <select
              id="sortOrder"
              className={styles.filterDropdown}
              onChange={(e) =>
                handleApplyFilters({ sortBy: 'employees', order: e.target.value })
              }
            >
              <option value="">No. of Employees</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className={styles.buttonWrapper}>
            <button onClick={() => setShowAddModal(true)} className={styles.addDepartmentButton}>
              <i className='ri-add-line' />
              Add Department
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.departmentTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Department Name</th>
                <th>No. of Employees</th>
                <th>Time Added</th>
                <th>Time Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDepartments.map((dept, index) => (
                <tr key={dept.name}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{dept.name}</td>
                  <td>{dept.employees}</td>
                  <td>mm-dd-yyyy hh:mm</td>
                  <td>mm-dd-yyyy hh:mm</td>
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
                          className={styles.editButton}
                          onClick={() => {
                            setSelectedDept(dept.name);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                          }}
                        > <i className='ri-edit-2-line' /> Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(dept.name);
                            toggleActionDropdown(null);
                          }}
                        > <i className='ri-delete-bin-line' /> Delete
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
            setCurrentPage(1);
          }}
        />

        {showAddModal && (
          <DepartmentModal
            isEdit={false}
            existingDepartments={departments.map((d) => d.name)}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
          />
        )}

        {showEditModal && (
          <DepartmentModal
            isEdit={true}
            defaultValue={selectedDept}
            existingDepartments={departments.map((d) => d.name)}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;