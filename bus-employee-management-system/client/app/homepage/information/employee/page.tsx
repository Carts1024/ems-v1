/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from "react";
import styles from './employee.module.css';
import { EmployeeLogic } from './employeeLogic';
import PaginationComponent from "@/components/ui/pagination";
import EmployeeModal from '@/components/modal/information/EmployeeModal';
import FilterDropDown, { FilterSection } from '@/components/ui/filterDropdown';
import Swal from 'sweetalert2';
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchEmployeeDetails = async (employeeId: string) => {
    try {
      const res = await fetch(`${API_URL}/employees/${employeeId}`);
      if (!res.ok) throw new Error("Failed to fetch employee details");
      return await res.json();
    } catch (error) {   
      // You can show an error dialog or notification
      return null;
    }
  };
  
  function mapEmployeeApiToUI(apiEmp: any) {
    const formatDate = (dateStr: string | undefined) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${month}-${day}`;
    };

    // Transform Deductions
    const deductionList = (apiEmp.deductions || []).map((d: any) => ({
      reason: d.deductionType?.name || '',
      frequency: d.frequency || '',
      type: d.type || '',
      amount: d.value || '',
      effectiveDate: d.effectiveDate ? formatDate(d.effectiveDate) : '',
      endDate: d.endDate ? formatDate(d.endDate) : '',
      status: d.isActive ? "Active" : "Inactive",
    }));

    // Transform Benefits
    const benefitList = (apiEmp.benefits || []).map((b: any) => ({
      benefit: b.benefitType?.name || '',
      frequency: b.frequency || '',
      amount: b.value || '',
      effectiveDate: b.effectiveDate ? formatDate(b.effectiveDate) : '',
      endDate: b.endDate ? formatDate(b.endDate) : '',
      status: b.isActive ? "Active" : "Inactive",
    }));

  // Work Experience
  const workExperiences = (apiEmp.workExperiences || []).map((w: any) => ({
    company: w.companyName || '',
    position: w.position || '',
    from: w.startDate ? formatDate(w.startDate) : '',
    to: w.endDate ? formatDate(w.endDate) : '',
    description: w.description || '',
  }));

  // Education
  const educationList = (apiEmp.educations || []).map((e: any) => ({
    institute: e.institution || '',
    degree: e.degree || '',
    specialization: e.fieldOfStudy || '',
    completionDate: e.endDate ? formatDate(e.endDate) : '', // Using endDate as completion
    // you can also include honors/description if needed
  }));

    // Transform Government IDs
    // const governmentIdList = (apiEmp.governmentIDs || []).map((g: any) => ({
    //   type: g.type?.name || '',
    //   idNumber: g.idNumber || '',
    //   issuedDate: g.issuedDate ? formatDate(g.issuedDate) : '',
    //   expiryDate: g.expiryDate ? formatDate(g.expiryDate) : '',
    //   status: g.isActive ? "Active" : "Inactive",
    // }));

    return {
      ...apiEmp,
      houseStreet: apiEmp.streetAddress ?? '',
      contact: apiEmp.phone ?? '',
      stateProvinceRegion: apiEmp.province ?? '',
      birthdate: formatDate(apiEmp.birthdate),
      dateHired: formatDate(apiEmp.hiredate),
      status: apiEmp.employeeStatus ?? '',
      employeeType: apiEmp.employeeType ?? '',
      employeeClassification: apiEmp.employeeClassification ?? '',
      middleName: apiEmp.middleName ?? '',
      suffix: apiEmp.suffix ?? '',
      department: apiEmp.position?.department?.departmentName ?? '',
      position: apiEmp.position?.positionName ?? '',
      basicPay: apiEmp.basicRate ?? '',
      deductionList,
      benefitList,
      educationList,
      workExperiences,
      // governmentIdList,
      governmentIdList: (apiEmp.governmentIDs || []).map((g: any) => ({
        idType: g.type?.name || '',
        idNumber: g.idNumber || '',
        issuedDate: g.issuedDate ? formatDate(g.issuedDate) : '',
        expiryDate: g.expiryDate ? formatDate(g.expiryDate) : '',
        status: g.isActive ? "Active" : "Inactive",
      })),

    };
  }

  function capitalizeWords(str: string) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  function getStatusClass(status: string) {
  switch (status?.toLowerCase()) {
    case 'active':
      return styles['status-Active'];
    case 'resigned':
      return styles['status-Resigned'];
    case 'on leave':
      return styles['status-onLeave'];
    default:
      return styles['interview-cancelled'];
  }
  }

  return (
    <div className={styles.base}>
      <div className={styles.employeeContainer}>
        <h1 className={styles.title}>Employee List</h1>

        <div className={styles.headerSection}>
          {/* Status Filter */}
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

          {/* Search */}
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
                <th>Department</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp, index) => (
                <tr key={`${emp.firstName}-${emp.lastName}-${index}`}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>
                    <span className={`${styles.empStatus} ${getStatusClass(emp.employeeStatus)}`}>
                      {capitalizeWords(emp.employeeStatus)}
                    </span>
                  </td>
                  <td>{`${emp.firstName} ${emp.middleName} ${emp.lastName}`}</td>
                  <td>{emp.hiredate ? new Date(emp.hiredate).toLocaleDateString() : ''}</td>
                  <td>{emp.departmentName}</td>
                  <td>{emp.positionName}</td>

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
                          onClick={async () => {
                            const fullDetails = await fetchEmployeeDetails(emp.id);
                            if (fullDetails) {
                              const mappedEmployee = mapEmployeeApiToUI(fullDetails);
                              setSelectedEmployee(mappedEmployee);
                              setIsReadOnlyView(true);
                              setShowEditModal(true);
                              toggleActionDropdown(null);
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to fetch employee details'
                              });
                            }
                          }}>
                          <i className="ri-eye-line"/> View
                        </button>
                        <button className={styles.editButton}
                          onClick={async () => {
                            const fullDetails = await fetchEmployeeDetails(emp.id);
                            if (fullDetails) {
                              const mappedEmployee = mapEmployeeApiToUI(fullDetails);
                              setSelectedEmployee(mappedEmployee);
                              setIsReadOnlyView(false);
                              setShowEditModal(true);
                              toggleActionDropdown(null); // Close dropdown
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Error',
                                  text: 'Failed to fetch employee details'
                                });
                              }
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
          />
        )}

        {/* Combined Edit/View Modal */}
        {showEditModal && selectedEmployee && (
          <EmployeeModal
            isEdit={!isReadOnlyView}
            isReadOnly={isReadOnlyView}
            defaultValue={selectedEmployee}
            existingEmployees={employees}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}