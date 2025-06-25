import React from 'react';
import styles from '../InformationModal.module.css';
import { Employee } from '../EmployeeModalLogic';
import { GovernmentID, GovIdErrors } from '../EmployeeRecordsLogic';

interface WorkGovSectionProps {
  employee: Employee;
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
}

const WorkGovSection: React.FC<WorkGovSectionProps> = ({
  employee,
  fieldErrors,
  handleChangeWrapper,
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
  isReadOnly
}) => {
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

        <select
          className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
          value={employee.department}
          onChange={(e) => handleChangeWrapper('department', e.target.value)}
          disabled={isReadOnly}
        >
          <option value="">Departments</option>
          <option value="Accounting">Accounting</option>
          <option value="Human Resource">Human Resource</option>
          <option value="Inventory">Inventory</option>
          <option value="Operations">Operations</option>
        </select>
        {fieldErrors.department && <p className={styles.errorText}>{fieldErrors.department}</p>}

        <label className={styles.label}>Position</label>
        <input
          className={`${styles.inputField} ${fieldErrors.position ? styles.inputError : ''}`}
          value={employee.position}
          onChange={(e) => handleChangeWrapper('position', e.target.value)}
          placeholder="Enter position"
          disabled={isReadOnly}
        />
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
            {[...governmentIds, ...(editingGovIdIndex === governmentIds.length ? [{
              idType: '', idNumber: '', issuedDate: '', expiryDate: '', status: ''
            }] : [])].map((id, index) => (
              <tr key={index}>
                {editingGovIdIndex === index ? (
                  <>
                    <td>
                      <select
                        className={styles.tableInput}
                        value={tempGovId.idType}
                        onChange={(e) => setTempGovId({ ...tempGovId, idType: e.target.value })}
                      >
                        <option value="">Select ID Type</option>
                        {['SSS', 'Pag-IBIG', 'PhilHealth', 'TIN', 'UMID'].map((type) => {
                          const isDisabled = governmentIds.some((id, idx) =>
                            id.idType === type && editingGovIdIndex !== idx
                          );
                          return (
                            <option key={type} value={type} disabled={isDisabled}>
                              {type}
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
                      <select
                        className={styles.tableInput}
                        value={tempGovId.status}
                        onChange={(e) => setTempGovId({ ...tempGovId, status: e.target.value })}
                      >
                        <option value="">Select ID status</option>
                        {['Active', 'Expired', 'Pending', 'For Renewal', 'Missing'].map((status) => {
                          const isDisabled = governmentIds.some((id, idx) =>
                            id.status === status && editingGovIdIndex !== idx
                          );
                          return (
                            <option key={status} value={status} disabled={isDisabled}>
                              {status}
                            </option>
                          );
                        })}
                      </select>
                      {govIdError.status && <p className={styles.errorText}>{govIdError.status}</p>}
                    </td>
                    <td className={styles.actionCell}>
                      <button className={styles.xButton} onClick={cancelGovernmentIDEdit}><i className="ri-close-line" /></button>
                      <button className={styles.saveButton} onClick={saveGovernmentID}><i className="ri-save-line" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{id.idType}</td>
                    <td>{id.idNumber.replace(/.(?=.{4})/g, '*')}</td>
                    <td>{id.issuedDate}</td>
                    <td>{id.expiryDate}</td>
                    <td>{id.status}</td>
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