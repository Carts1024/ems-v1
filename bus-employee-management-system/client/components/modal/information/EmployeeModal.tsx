/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import styles from './InformationModal.module.css';
import { useEmployeeModal, Employee } from './EmployeeModalLogic';
import { useEmployeeRecords } from './EmployeeRecordsLogic';
import { showConfirmation } from '@/app/utils/swal';

import PersonalSection from './sections/PersonalSection';
import WorkEducationSection from './sections/WorkEducationSection';
import WorkGovSection from './sections/WorkGovSection';
import SalaryBenefitsSection from './sections/SalaryBenefitsSection';
import ExitLeaveSection from './sections/ExitLeaveSection';

interface EmployeeModalProps {
  isEdit: boolean;
  isReadOnly?: boolean;
  defaultValue?: Employee;
  existingEmployees: Employee[];
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = (props) => {
  const {
    employee,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
    formatCurrency
  } = useEmployeeModal(
    props.isEdit,
    props.defaultValue,
    props.existingEmployees,
    props.onSubmit,
    props.onClose
  );

  const employeeRecords = useEmployeeRecords();
  const [hasChanges, setHasChanges] = useState(false);
  const { deductionList, benefitList } = employeeRecords;

  const handleChangeWrapper = (field: keyof Employee, value: string | string[]) => {
    if (!hasChanges && value !== props.defaultValue?.[field]) {
      setHasChanges(true);
    }
    handleChange(field, value);
  };

  const handleExitClick = async () => {
    if (hasChanges) {
      const result = await showConfirmation("Are you sure you want to close? Unsaved changes will be lost.");
      if (result.isConfirmed) {
        setHasChanges(false);
        props.onClose();
      }
    } else {
      props.onClose();
    }
  };

  const handleSubmitWrapper = () => {
    if (!employeeRecords.validateGovernmentIds()) return;
    handleSubmit();
  };

  const handleUpdateConfirmWrapper = () => {
    if (!employeeRecords.validateGovernmentIds()) return;
    handleUpdateConfirm();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleExitClick} aria-label="Close modal">
          <i className='ri-close-line' />
        </button>

        {!props.isReadOnly && (
          <h1 className={styles.heading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.headingIcon}>
              <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2Z..." />
            </svg>
            {props.isEdit ? 'Edit Employee' : 'Add Employee'}
          </h1>
        )}

        <h3>Employee Information</h3>
        <PersonalSection
          employee={employee}
          fieldErrors={fieldErrors}
          handleChangeWrapper={handleChangeWrapper}
          isReadOnly={props.isReadOnly}
        />

        <WorkEducationSection
          {...employeeRecords}
          workExperiences={employee.workExperiences}
          educationList={employee.educationList}
          isReadOnly={props.isReadOnly}
        />

        <h3>Employment Information</h3>
        <WorkGovSection
          {...employeeRecords}
          employee={employee}
          fieldErrors={fieldErrors}
          handleChangeWrapper={handleChangeWrapper}
          isReadOnly={!!props.isReadOnly}
          governmentIdList={employee.governmentIdList ?? []}
          
        />

        <h3>Salary Information</h3>
        <SalaryBenefitsSection
          {...employeeRecords}
          employee={employee}
          fieldErrors={fieldErrors}
          handleChangeWrapper={handleChangeWrapper}
          isReadOnly={props.isReadOnly}
          deductionList={employee.deductionList ?? []}
          benefitList={employee.benefitList ?? []}
        />
        <h3>Related Forms/ Requests</h3>
        <ExitLeaveSection />

        <div className={styles.buttonGroup}>
          {props.isReadOnly ? (
            <button onClick={handleExitClick} className={styles.cancelButton}>Close</button>
          ) : (
            <>
              <button onClick={handleExitClick} className={styles.cancelButton}>Cancel</button>
              <button
                onClick={props.isEdit ? handleUpdateConfirmWrapper : handleSubmitWrapper}
                className={styles.submitButton}
              >
                {props.isEdit ? 'Update' : 'Add'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
