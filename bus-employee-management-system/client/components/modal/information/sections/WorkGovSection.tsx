/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styles from '../InformationModal.module.css';
import { Employee } from '../EmployeeModalLogic';
import { GovernmentID } from '@/types/employee';
import { formatDate } from '@/app/utils/dateUtils';

// Define GovIdErrors type locally since it's not exported
interface GovIdErrors {
  idNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  status?: string;
}

interface WorkGovSectionProps {
  employee: Employee;
  governmentIdList: any[];
  fieldErrors: Record<string, string>;
  handleChangeWrapper: (field: keyof Employee, value: string | string[]) => void;
  governmentIds: GovernmentID[];
  tempGovId: GovernmentID;
  setTempGovId: React.Dispatch<React.SetStateAction<GovernmentID>>;
  editingGovIdIndex: number | null;
  addGovernmentID: () => void;
  saveGovernmentID: () => void;
  editGovernmentID: (index: number) => void;
  cancelGovernmentIDEdit: () => void;
  deleteGovernmentID: (index: number) => void;
  govIdError: GovIdErrors;
  isReadOnly: boolean;
  // Department and Position props
  departments: { id: number, departmentName: string }[];
  positions: { id: number, positionName: string, departmentId: number }[];
  filteredPositions: { id: number, positionName: string, departmentId: number }[];
  selectedDepartmentId: number | null;
  handleDepartmentChange: (departmentId: number) => void;
  // Government ID Types
  governmentIdTypes: { id: number, name: string }[];
}

const WorkGovSection: React.FC<WorkGovSectionProps> = ({
  employee,
  fieldErrors,
  handleChangeWrapper,
  governmentIdList,
  governmentIds,
  tempGovId,
  setTempGovId,
  editingGovIdIndex,
  addGovernmentID,
  saveGovernmentID,
  editGovernmentID,
  cancelGovernmentIDEdit,
  deleteGovernmentID,
  govIdError,
  isReadOnly,
  // Department and Position props
  departments,
  positions, // eslint-disable-line @typescript-eslint/no-unused-vars
  filteredPositions,
  selectedDepartmentId,
  handleDepartmentChange,
  // Government ID Types
  governmentIdTypes
}) => {
  // Helper function to calculate status based on dates
  const calculateIdStatus = (issuedDate: string, expiryDate: string): string => {
    if (!issuedDate || !expiryDate) return 'Pending';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const issued = new Date(issuedDate);
    const expiry = new Date(expiryDate);
    
    if (issued > today) {
      return 'Pending';
    } else if (expiry < today) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };

  return (
    <div className={styles.sectionGroup}>
      <div className={styles.workInfo}>
        <h4>Work Details</h4>
        <select
          className={`${styles.inputField} ${fieldErrors.status ? styles.inputError : ''}`}
          value={employee.status}
          onChange={(e) => handleChangeWrapper('status', e.target.value)}
          disabled={isReadOnly}
        >
          <option value="">Select status</option>
          <option value="active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Resigned">Resigned</option>
        </select>
        {fieldErrors.status && <p className={styles.errorText}>{fieldErrors.status}</p>}

        <label className={styles.label}>Date Hired</label>
        <input
          type="date"
          className={`${styles.inputField} ${fieldErrors.dateHired ? styles.inputError : ''}`}
          value={employee.dateHired}
          onChange={(e) => handleChangeWrapper('dateHired', e.target.value)}
          disabled={isReadOnly}
        />
        {fieldErrors.dateHired && <p className={styles.errorText}>{fieldErrors.dateHired}</p>}

        <label className={styles.label}>Employee Type</label>
        <select
          className={`${styles.inputField} ${fieldErrors.employeeType ? styles.inputError : ''}`}
          value={employee.employeeType}
          onChange={(e) => handleChangeWrapper('employeeType', e.target.value)}
          disabled={isReadOnly}
        >
          <option value="">Select Employee Type</option>
          <option value="regular">Regular</option>
          <option value="contractual">Contractual</option>
          <option value="probation">Probation</option>
          <option value="temporary">Temporary</option>
        </select>
        {fieldErrors.employeeType && <p className={styles.errorText}>{fieldErrors.employeeType}</p>}

        <label className={styles.label}>Employee Classification</label>
        <select
          className={`${styles.inputField} ${fieldErrors.employeeClassification ? styles.inputError : ''}`}
          value={employee.employeeClassification}
          onChange={(e) => handleChangeWrapper('employeeClassification', e.target.value)}
          disabled={isReadOnly}
        >
          <option value="">Select Employee Classification</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
        </select>
        {fieldErrors.employeeClassification && <p className={styles.errorText}>{fieldErrors.employeeClassification}</p>}

        <label className={styles.label}>Department</label>
        <select
          className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
          value={employee.department}
          onChange={(e) => {
            const selectedDeptName = e.target.value;
            const selectedDept = departments.find(dept => dept.departmentName === selectedDeptName);
            if (selectedDept) {
              handleDepartmentChange(selectedDept.id);
              handleChangeWrapper('department', selectedDeptName);
              // Clear position when department changes
              handleChangeWrapper('position', '');
              handleChangeWrapper('positionId' as any, '');
            } else {
              handleChangeWrapper('department', selectedDeptName);
            }
          }}
          disabled={isReadOnly}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.departmentName}>
              {dept.departmentName}
            </option>
          ))}
        </select>
        {fieldErrors.department && <p className={styles.errorText}>{fieldErrors.department}</p>}

        <label className={styles.label}>Position</label>
        <select
          className={`${styles.inputField} ${fieldErrors.position ? styles.inputError : ''}`}
          value={employee.position}
          onChange={(e) => {
            const selectedPositionName = e.target.value;
            const selectedPosition = filteredPositions.find(pos => pos.positionName === selectedPositionName);
            
            handleChangeWrapper('position', selectedPositionName);
            if (selectedPosition) {
              // Also store the positionId for the backend
              handleChangeWrapper('positionId' as any, selectedPosition.id.toString());
            }
          }}
          disabled={isReadOnly || !selectedDepartmentId}
        >
          <option value="">
            {selectedDepartmentId ? 'Select Position' : 'Select Department First'}
          </option>
          {filteredPositions.map((pos) => (
            <option key={pos.id} value={pos.positionName}>
              {pos.positionName}
            </option>
          ))}
        </select>
        {fieldErrors.position && <p className={styles.errorText}>{fieldErrors.position}</p>}

        {/* Government ID Section */}
        <div className={styles.sectionHeader}>
          <h4>Government Identification</h4>
          {!isReadOnly && (
            <button onClick={addGovernmentID} className={styles.addGovtIdButton}>
              <i className="ri-add-line" />
            </button>
          )}
        </div>
        <table className={styles.govtIdTable}>
          <thead>
            <tr>
              <th>ID Type</th>
              <th>ID Number</th>
              <th>Issued Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              {!isReadOnly && <th>Actions</th>}
            </tr>
          </thead>
            <tbody>
              {(isReadOnly ? governmentIdList : [...governmentIds, ...(editingGovIdIndex === governmentIds.length ? [{
                idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: ''
              }] : [])]).map((id: GovernmentID, index: number) => (
                <tr key={index}>
                  {(!isReadOnly && editingGovIdIndex === index) ? (
                    <>
                      <td>
                        <select
                          className={styles.tableInput}
                          value={tempGovId.idType}
                          onChange={(e) => setTempGovId({ ...tempGovId, idType: e.target.value })}
                        >
                          <option value="">Select ID Type</option>
                          {governmentIdTypes.map((type) => {
                            const isDisabled = governmentIds.some((id, idx) =>
                              id.idType === type.name && editingGovIdIndex !== idx
                            );
                            return (
                              <option key={type.id} value={type.name} disabled={isDisabled}>
                                {type.name}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                      <td>
                        <input
                          className={styles.tableInput}
                          value={tempGovId.idNumber}
                          onChange={(e) => setTempGovId({ ...tempGovId, idNumber: e.target.value })}
                        />
                        {govIdError.idNumber && <p className={styles.errorText}>{govIdError.idNumber}</p>}
                      </td>
                      <td>
                        <input
                          type="date"
                          className={styles.tableInput}
                          value={tempGovId.issuedDate}
                          onChange={(e) => setTempGovId({ ...tempGovId, issuedDate: e.target.value })}
                        />
                        {govIdError.issuedDate && <p className={styles.errorText}>{govIdError.issuedDate}</p>}
                      </td>
                      <td>
                        <input
                          type="date"
                          className={styles.tableInput}
                          value={tempGovId.expiryDate}
                          onChange={(e) => setTempGovId({ ...tempGovId, expiryDate: e.target.value })}
                        />
                        {govIdError.expiryDate && <p className={styles.errorText}>{govIdError.expiryDate}</p>}
                      </td>
                      <td>
                        {/* Auto-calculated status - no dropdown when editing */}
                        <span className={styles.calculatedStatus}>
                          {tempGovId.issuedDate && tempGovId.expiryDate 
                            ? calculateIdStatus(tempGovId.issuedDate, tempGovId.expiryDate)
                            : 'Pending'
                          }
                        </span>
                      </td>
                      <td className={styles.actionCell}>
                        <button className={styles.xButton} onClick={cancelGovernmentIDEdit}><i className="ri-close-line" /></button>
                        <button className={styles.saveButton} onClick={saveGovernmentID}><i className="ri-save-line" /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{id.idType}</td>
                      <td>{id.idNumber ? id.idNumber.replace(/.(?=.{4})/g, '*') : ''}</td>
                      <td>{formatDate(id.issuedDate) || id.issuedDate || ''}</td>
                      <td>{formatDate(id.expiryDate) || id.expiryDate || ''}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[calculateIdStatus(id.issuedDate, id.expiryDate).toLowerCase()]}`}>
                          {calculateIdStatus(id.issuedDate, id.expiryDate)}
                        </span>
                      </td>
                      {!isReadOnly && (
                        <td className={styles.actionCell}>
                          <button className={styles.editButton} onClick={() => editGovernmentID(index)}><i className="ri-edit-2-line" /></button>
                          <button className={styles.deleteButton} onClick={() => deleteGovernmentID(index)}><i className="ri-delete-bin-line" /></button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkGovSection;