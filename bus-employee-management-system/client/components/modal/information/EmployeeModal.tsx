'use client';

import React, { useState } from 'react';
import styles from './InformationModal.module.css';
import { useEmployeeModal, Employee } from './EmployeeModalLogic';
import { useEmployeeRecords } from './EmployeeRecordsLogic';
import { showConfirmation } from '@/app/utils/swal';

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
  } = useEmployeeModal(
    props.isEdit,
    props.defaultValue,
    props.existingEmployees,
    props.onSubmit,
    props.onClose
  );

      const {
      governmentIds,
      tempGovId,
      editingGovIdIndex,
      setTempGovId,
      addGovernmentID,
      saveGovernmentID,
      editGovernmentID,
      cancelGovernmentIDEdit,
      deleteGovernmentID,
      govIdError,

      deductionList,
      tempDeduct,
      editingDeductIndex,
      setTempDeduct,
      addDeduction,
      saveDeduction,
      editDeduction,
      cancelDeductionEdit,
      deleteDeduction,
      isTempDeductValid,
      deductDateError,

      workExperiences,
      tempWork,
      editingWorkIndex,
      setTempWork,
      addWork,
      saveWork,
      editWork,
      cancelWorkEdit,
      deleteWork,
      isTempWorkValid,
      workDateError,
      setWorkDateError,
      validateWorkDates,
  
      educationList,
      tempEduc,
      editingEducIndex,
      setTempEduc,
      addEducation,
      saveEducation,
      editEducation,
      cancelEducationEdit,
      deleteEducation,
      isTempEducValid,
      educDateError,
      setEducDateError
    } = useEmployeeRecords();

  const [hasChanges, setHasChanges] = useState(false);

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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleExitClick} aria-label="Close modal">
          <i className='ri-close-line'/>
        </button>

        {!props.isReadOnly && (
          <h1 className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.headingIcon}
            >
              <path d="M12 2C17.52 2 22 6.48 22 12C22 
                17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 
                12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 
                7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 
                6.34315 9 8C9 9.65685 10.3431 11 12 11Z"
              />
            </svg>
            {props.isEdit ? 'Edit Employee' : 'Add Employee'}
          </h1>
        )}

        <h3>Employee Information</h3>

        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            <div className={styles.basicInfo}>
              <h4>Personal Details</h4>
              <label className={styles.label}>Last Name</label>
              <input
                className={`${styles.inputField} ${fieldErrors.lastName ? styles.inputError : ''}`}
                value={employee.lastName}
                onChange={(e) => handleChangeWrapper('lastName', e.target.value)}
                placeholder="Enter last name"
                disabled={props.isReadOnly}
              />
              {fieldErrors.lastName && <p className={styles.errorText}>{fieldErrors.lastName}</p>}

              <label className={styles.label}>First Name</label>
              <input
                className={`${styles.inputField} ${fieldErrors.firstName ? styles.inputError : ''}`}
                value={employee.firstName}
                onChange={(e) => handleChangeWrapper('firstName', e.target.value)}
                placeholder="Enter first name"
                disabled={props.isReadOnly}
              />
              {fieldErrors.firstName && <p className={styles.errorText}>{fieldErrors.firstName}</p>}

              {!(props.isReadOnly && !employee.middleName) && (
                <>
                  <label className={styles.label}>Middle Name (Optional)</label>
                  <input
                    className={styles.inputField}
                    value={employee.middleName}
                    onChange={(e) => handleChangeWrapper('middleName', e.target.value)}
                    placeholder="Enter middle name"
                    disabled={props.isReadOnly}
                  />
                </>
              )}

              <label className={styles.label}>Birthdate</label>
              <input
                type="date"
                className={`${styles.inputField} ${fieldErrors.birthdate ? styles.inputError : ''}`}
                value={employee.birthdate}
                onChange={(e) => handleChangeWrapper('birthdate', e.target.value)}
                disabled={props.isReadOnly}
              />
              {fieldErrors.birthdate && <p className={styles.errorText}>{fieldErrors.birthdate}</p>}
            </div>

            <div className={styles.contactInfo}>
              <h4>Contact Details</h4>
              <label className={styles.label}>Email</label>
              <input
                className={`${styles.inputField} ${fieldErrors.email ? styles.inputError : ''}`}
                value={employee.email}
                onChange={(e) => handleChangeWrapper('email', e.target.value)}
                placeholder="Enter email"
                disabled={props.isReadOnly}
              />
              {fieldErrors.email && <p className={styles.errorText}>{fieldErrors.email}</p>}

              <label className={styles.label}>Contact No.</label>
              <input
                className={`${styles.inputField} ${fieldErrors.contact ? styles.inputError : ''}`}
                value={employee.contact}
                onChange={(e) => handleChangeWrapper('contact', e.target.value)}
                placeholder="Enter contact no."
                disabled={props.isReadOnly}
              />
              {fieldErrors.contact && <p className={styles.errorText}>{fieldErrors.contact}</p>}

              <label className={styles.label}>Address</label>
              <input
                className={`${styles.inputField} ${fieldErrors.address ? styles.inputError : ''}`}
                value={employee.address}
                onChange={(e) => handleChangeWrapper('address', e.target.value)}
                placeholder="Enter address"
                disabled={props.isReadOnly}
              />
              {fieldErrors.address && <p className={styles.errorText}>{fieldErrors.address}</p>}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className={styles.contactInfo}>
            <h4>Emergency Contact</h4>
            <label className={styles.label}>Full Name</label>
            <input
              className={`${styles.inputField} ${fieldErrors.emergencyContactName ? styles.inputError : ''}`}
              value={employee.emergencyContactName}
              onChange={(e) => handleChangeWrapper('emergencyContactName', e.target.value)}
              placeholder="Enter full name"
              disabled={props.isReadOnly}
            />
            {fieldErrors.emergencyContactName && <p className={styles.errorText}>{fieldErrors.emergencyContactName}</p>}

            <label className={styles.label}>Contact No.</label>
            <input
              className={`${styles.inputField} ${fieldErrors.emergencyContactNo ? styles.inputError : ''}`}
              value={employee.emergencyContactNo}
              onChange={(e) => handleChangeWrapper('emergencyContactNo', e.target.value)}
              placeholder="Enter 11-digit contact no."
              disabled={props.isReadOnly}
            />
            {fieldErrors.emergencyContactNo && <p className={styles.errorText}>{fieldErrors.emergencyContactNo}</p>}
          </div>

          {/* Work Experience Table */}
          <div className={styles.sectionHeader}>
            <h4>Work Experience</h4>
            {!props.isReadOnly && (
              <button onClick={addWork} className={styles.addWorkExpButton}><i className="ri-add-line" /></button>
            )}
          </div>
          <table className={styles.workExpTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Company</th>
                <th>Position</th>
                <th>From</th>
                <th>To</th>
                <th>Description</th>
                {!props.isReadOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {[...workExperiences, ...(editingWorkIndex === workExperiences.length ? [{
              company: '', position: '', from: '', to: '', description: ''
              }] : [])].map((exp, index) => (
                <tr key={index}>
                  {editingWorkIndex === index ? (
                    <>
                      <td className={styles.firstColumn}>{index + 1}</td>
                      <td><input className={styles.tableInput} value={tempWork.company} onChange={(e) => setTempWork({ ...tempWork, company: e.target.value })} /></td>
                      <td><input className={styles.tableInput} value={tempWork.position} onChange={(e) => setTempWork({ ...tempWork, position: e.target.value })} /></td>
                      <td>
                        <input
                          className={styles.tableInput}
                          type="date"
                          value={tempWork.from}
                          onChange={(e) => {
                            const from = e.target.value;
                            const to = tempWork.to;
                            setTempWork({ ...tempWork, from });
                            validateWorkDates(from, to);
                          }}
                        />
                        {workDateError.from && <p className={styles.errorText}>{workDateError.from}</p>}
                      </td>
                      <td>
                        <input
                          className={styles.tableInput}
                          type="date"
                          value={tempWork.to}
                          onChange={(e) => {
                            const to = e.target.value;
                            const from = tempWork.from;
                            setTempWork({ ...tempWork, to });
                            validateWorkDates(from, to);
                          }}
                        />
                        {workDateError.to && <p className={styles.errorText}>{workDateError.to}</p>}
                      </td>
                      <td><input className={styles.tableInput} value={tempWork.description} onChange={(e) => setTempWork({ ...tempWork, description: e.target.value })} /></td>
                      <td className={styles.actionCell}>
                        <button className={styles.xButton} onClick={cancelWorkEdit}>
                          <i className='ri-close-line'/>
                        </button>
                        <button className={styles.saveButton}
                          onClick={saveWork}
                          disabled={!isTempWorkValid}>
                          <i className="ri-save-line"/>
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.firstColumn}>{index + 1}</td>
                      <td>{exp.company}</td>
                      <td>{exp.position}</td>
                      <td>{exp.from}</td>
                      <td>{exp.to}</td>
                      <td>{exp.description}</td>
                      {!props.isReadOnly && (
                        <td className={styles.actionCell}>
                          <button className={styles.editButton} onClick={() => editWork(index)}>
                            <i className="ri-edit-2-line" />
                          </button>
                          <button className={styles.deleteButton}onClick={() => deleteWork(index)}>
                            <i className="ri-delete-bin-line" />
                          </button>
                        </td>
                      )}

                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Education Table */}
          <div className={styles.sectionHeader}>
            <h4>Education</h4>
            {!props.isReadOnly && (
              <button onClick={addEducation} className={styles.addEducButton}><i className="ri-add-line" /></button>
            )}
          </div>
          <table className={styles.educTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Institute</th>
                <th>Degree</th>
                <th>Specialization</th>
                <th>Completion Date</th>
                {!props.isReadOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {[...educationList, ...(editingEducIndex === educationList.length ? [{
              institute: '', degree: '', specialization: '', completionDate: ''
              }] : [])].map((edu, index) => (
                <tr key={index}>
                  {editingEducIndex === index ? (
                    <>
                      <td className={styles.firstColumn}>{index + 1}</td>
                      <td><input className={styles.tableInput} value={tempEduc.institute} onChange={(e) => setTempEduc({ ...tempEduc, institute: e.target.value })} /></td>
                      <td><input className={styles.tableInput} value={tempEduc.degree} onChange={(e) => setTempEduc({ ...tempEduc, degree: e.target.value })} /></td>
                      <td><input className={styles.tableInput} value={tempEduc.specialization} onChange={(e) => setTempEduc({ ...tempEduc, specialization: e.target.value })} /></td>
                      <td>
                        <input
                          className={styles.tableInput}
                          type="date"
                          value={tempEduc.completionDate}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTempEduc({ ...tempEduc, completionDate: value });
                            if (new Date(value) > new Date()) {
                              setEducDateError('Date cannot be in the future.');
                            } else {
                              setEducDateError('');
                            }
                          }}
                        /> {educDateError && <p className={styles.dateError}>{educDateError}</p>}
                      </td>
                      {!props.isReadOnly && (
                        <td className={styles.actionCell}>
                          <button className={styles.xButton} onClick={cancelEducationEdit}>
                            <i className='ri-close-line'/>
                          </button>
                          <button className={styles.saveButton}
                            onClick={saveEducation}
                            disabled={!isTempEducValid}>
                            <i className='ri-save-line'/>
                          </button>
                        </td>
                      )}
                    </>
                  ) : (
                    <>
                      <td className={styles.firstColumn}>{index + 1}</td>
                      <td>{edu.institute}</td>
                      <td>{edu.degree}</td>
                      <td>{edu.specialization}</td>
                      <td>{edu.completionDate}</td>
                      {!props.isReadOnly && (
                        <td className={styles.actionCell}>
                          <button className={styles.editButton} onClick={() => editEducation(index)}>
                            <i className="ri-edit-2-line" />
                            </button>
                          <button className={styles.deleteButton} onClick={() => deleteEducation(index)}>
                            <i className="ri-delete-bin-line" />
                            </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Employment Information</h3>
        <div className={styles.sectionGroup}>
          <div className={styles.workInfo}>
            <h4>Work Details</h4>
            <select
              className={`${styles.inputField} ${fieldErrors.status ? styles.inputError : ''}`}
              value={employee.status}
              onChange={(e) => handleChangeWrapper('status', e.target.value)}
              disabled={props.isReadOnly}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
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
              disabled={props.isReadOnly}
            />
            {fieldErrors.dateHired && <p className={styles.errorText}>{fieldErrors.dateHired}</p>}

            <select
              className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
              value={employee.department}
              onChange={(e) => handleChangeWrapper('department', e.target.value)}
              disabled={props.isReadOnly}
            >
              <option value="">Select department</option>
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
              disabled={props.isReadOnly}
            />
            {fieldErrors.position && <p className={styles.errorText}>{fieldErrors.position}</p>}

            {/* Government ID Section */}
            <div className={styles.sectionHeader}>
              <h4>Government Identification</h4>
              {!props.isReadOnly && (
                <button onClick={addGovernmentID} className={styles.addGovtIdButton}><i className="ri-add-line" /></button>
              )}
            </div>
            <table className={styles.govtIdTable}>
              <thead>
                <tr>
                  <th>ID Type</th>
                  <th>ID Number</th>
                  {!props.isReadOnly && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {[...governmentIds, ...(editingGovIdIndex === governmentIds.length ? [{ idType: '', idNumber: '' }] : [])].map((id, index) => (
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
                            <option value="SSS">SSS</option>
                            <option value="Pag-IBIG">Pag-IBIG</option>
                            <option value="PhilHealth">PhilHealth</option>
                            <option value="TIN">TIN</option>
                            <option value="UMID">UMID</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className={styles.tableInput}
                            value={tempGovId.idNumber}
                            onChange={(e) => setTempGovId({ ...tempGovId, idNumber: e.target.value })}
                          />
                          {govIdError && <p className={styles.errorText}>{govIdError}</p>}
                        </td>
                        <td className={styles.actionCell}>
                          <button className={styles.xButton} onClick={cancelGovernmentIDEdit}><i className="ri-close-line" /></button>
                          <button className={styles.saveButton} onClick={saveGovernmentID}><i className="ri-save-line" /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{id.idType}</td>
                        <td>{id.idNumber}</td>
                        {!props.isReadOnly && (
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

            <h4>Salary Information</h4>
            <label className={styles.label}>Basic Pay</label>
            <input
              className={`${styles.inputField} ${fieldErrors.basicPay ? styles.inputError : ''}`}
              value={employee.basicPay}
              onChange={(e) => handleChangeWrapper('basicPay', e.target.value)}
              placeholder="Enter basic pay"
              disabled={props.isReadOnly}
            />
            {fieldErrors.basicPay && <p className={styles.errorText}>{fieldErrors.basicPay}</p>}

            {/* Deductions Table */}
            <div className={styles.sectionHeader}>
              <h4>Deductions</h4>
              {!props.isReadOnly && (
                <button onClick={addDeduction} className={styles.addDeductButton}><i className="ri-add-line" /></button>
              )}
            </div>
            <table className={styles.deductTable}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Institute</th>
                  <th>Amount</th>
                  <th>Date</th>
                  {!props.isReadOnly && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {[...deductionList, ...(editingDeductIndex === deductionList.length ? [{ institute: '', amount: '', deductionDate: '' }] : [])].map((d, index) => (
                  <tr key={index}>
                    {editingDeductIndex === index ? (
                      <>
                        <td>{index + 1}</td>
                        <td><input className={styles.tableInput} value={tempDeduct.institute} onChange={(e) => setTempDeduct({ ...tempDeduct, institute: e.target.value })} /></td>
                        <td><input className={styles.tableInput} value={tempDeduct.amount} onChange={(e) => setTempDeduct({ ...tempDeduct, amount: e.target.value })} /></td>
                        <td>
                          <input
                            className={styles.tableInput}
                            type="date"
                            value={tempDeduct.deductionDate}
                            onChange={(e) => {
                              const value = e.target.value;
                              setTempDeduct({ ...tempDeduct, deductionDate: value });
                            }}
                          />
                          {deductDateError && <p className={styles.errorText}>{deductDateError}</p>}
                        </td>
                        <td className={styles.actionCell}>
                          <button className={styles.xButton} onClick={cancelDeductionEdit}><i className="ri-close-line" /></button>
                          <button className={styles.saveButton} onClick={saveDeduction} disabled={!isTempDeductValid}><i className="ri-save-line" /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{index + 1}</td>
                        <td>{d.institute}</td>
                        <td>{d.amount}</td>
                        <td>{d.deductionDate}</td>
                        {!props.isReadOnly && (
                          <td className={styles.actionCell}>
                            <button className={styles.editButton} onClick={() => editDeduction(index)}><i className="ri-edit-2-line" /></button>
                            <button className={styles.deleteButton} onClick={() => deleteDeduction(index)}><i className="ri-delete-bin-line" /></button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Driver’s License */}
            <h4>Driver’s License (For Drivers)</h4>
            <label className={styles.label}>License Type</label>
            <select
              className={`${styles.inputField} ${fieldErrors.licenseType ? styles.inputError : ''}`}
              value={employee.licenseType}
              onChange={(e) => handleChangeWrapper('licenseType', e.target.value)}
              disabled={props.isReadOnly}
            >
              <option value="professional">Professional</option>
            </select>

            <label className={styles.label}>License No.</label>
            <input
              className={`${styles.inputField} ${fieldErrors.licenseNo ? styles.inputError : ''}`}
              value={employee.licenseNo}
              onChange={(e) => handleChangeWrapper('licenseNo', e.target.value)}
              placeholder="Enter license no."
              disabled={props.isReadOnly}
            />

            <label className={styles.label}>Restriction Codes</label>
            <select
              multiple
              className={styles.inputField}
              value={employee.restrictionCodes}
              onChange={(e) =>
                handleChangeWrapper(
                  'restrictionCodes',
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
              disabled={props.isReadOnly}
            >
              <option value="A">A : Motorcycle</option>
              <option value="A1">A1 : Tricycle</option>
              <option value="B">B : Passenger Car</option>
              <option value="B1">B1 : Van or Jeepney</option>
              <option value="B2">B2 : Light Commercial</option>
              <option value="C">C : Heavy Commercial</option>
              <option value="D">D : Passenger Bus</option>
              <option value="BE">BE : Light Articulated</option>
              <option value="CE">CE : Heavy Articulated</option>
            </select>

            <label className={styles.label}>Expiration Date</label>
            <input
              type="date"
              className={`${styles.inputField} ${fieldErrors.expireDate ? styles.inputError : ''}`}
              value={employee.expireDate}
              onChange={(e) => handleChangeWrapper('expireDate', e.target.value)}
              disabled={props.isReadOnly}
            />
          </div>
        </div>
        <br />

        <h3>Related Forms/ Requests</h3>
        <div className={styles.sectionGroup}>
          <div className={styles.workInfo}></div>
          <h4>Exit Details</h4>
          <div className={styles.tableWrapper}></div>
          <table className={styles.exitDetailsTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Date Hired</th>
                <th>Department</th>
                <th>Position</th>
                <th>Request Date</th>
                <th>Last Day of Work</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2019-02-20</td>
                <td>Operations</td>
                <td>Driver</td>
                <td>2024-04-15</td>
                <td>2024-05-15</td>
              </tr>
            </tbody>
          </table>

          <h4>Leave Requests</h4>
          <div className={styles.tableWrapper}></div>
          <table className={styles.leaveRequestTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Date Hired</th>
                <th>Department</th>
                <th>Position</th>
                <th>Request Date</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2021-03-10</td>
                <td>Operations</td>
                <td>Driver</td>
                <td>2024-03-01</td>
                <td>Vacation Leave</td>
                <td>2024-06-10</td>
                <td>2024-06-17</td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>

        <div className={styles.buttonGroup}>
          {props.isReadOnly ? (
            <button onClick={handleExitClick} className={styles.cancelButton}>Close</button>
          ) : (
            <>
              <button onClick={handleExitClick} className={styles.cancelButton}>Cancel</button>
              <button onClick={props.isEdit ? handleUpdateConfirm : handleSubmit} className={styles.submitButton}>
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