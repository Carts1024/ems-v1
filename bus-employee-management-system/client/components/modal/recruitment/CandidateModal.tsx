/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import styles from './RecruitmentModal.module.css';
import { useCandidateModal, Candidate } from './CandidateModalLogic';
import { useCandidateRecords } from './CandidateRecordsLogic';
import { showConfirmation, showSuccess } from '@/app/utils/swal';

interface CandidateModalProps {
  isEdit: boolean;
  isReadOnly?: boolean;
  defaultValue?: Candidate;
  existingCandidates: Candidate[];
  onClose: () => void;
  onSubmit: (candidate: Candidate) => void;
}

const CandidateModal: React.FC<CandidateModalProps> = (props) => {
  const {
    candidate,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
  } = useCandidateModal(
    props.isEdit,
    props.defaultValue,
    props.existingCandidates,
    props.onSubmit,
    props.onClose
  );

  const {
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
  } = useCandidateRecords();

  const [hasChanges, setHasChanges] = useState(false);

  const handleChangeWrapper = (field: keyof Candidate, value: string) => {
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
            {props.isEdit ? 'Edit Candidate' : 'Add Candidate'}
          </h1>
        )}

        <h3>Candidate Information</h3>

        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            <div className={styles.basicInfo}>
              <h4>Personal Details</h4>
              <label className={styles.label}>Last Name</label>
              <input
                className={`${styles.inputField} ${fieldErrors.lastName ? styles.inputError : ''}`}
                value={candidate.lastName}
                onChange={(e) => handleChangeWrapper('lastName', e.target.value)}
                placeholder="Enter last name"
                disabled={props.isReadOnly}
              />
              {fieldErrors.lastName && <p className={styles.errorText}>{fieldErrors.lastName}</p>}

              <label className={styles.label}>First Name</label>
              <input
                className={`${styles.inputField} ${fieldErrors.firstName ? styles.inputError : ''}`}
                value={candidate.firstName}
                onChange={(e) => handleChangeWrapper('firstName', e.target.value)}
                placeholder="Enter first name"
                disabled={props.isReadOnly}
              />
              {fieldErrors.firstName && <p className={styles.errorText}>{fieldErrors.firstName}</p>}

              {!(props.isReadOnly && !candidate.middleName) && (
                <>
                  <label className={styles.label}>Middle Name</label>
                  <input
                    className={styles.inputField}
                    value={candidate.middleName}
                    onChange={(e) => handleChangeWrapper('middleName', e.target.value)}
                    placeholder="Enter middle name"
                    disabled={props.isReadOnly}
                  />
                </>
              )}

              {!(props.isReadOnly && !candidate.suffix) && (
                <>
                  <label className={styles.label}>Suffix</label>
                  <input
                    className={styles.inputField}
                    value={candidate.suffix}
                    onChange={(e) => handleChangeWrapper('suffix', e.target.value)}
                    placeholder="Enter suffix"
                    disabled={props.isReadOnly}
                  />
                </>
              )}

              <label className={styles.label}>Birthdate</label>
              <input
                type="date"
                className={`${styles.inputField} ${fieldErrors.birthdate ? styles.inputError : ''}`}
                value={candidate.birthdate}
                onChange={(e) => handleChangeWrapper('birthdate', e.target.value)}
                disabled={props.isReadOnly}
              />
              {fieldErrors.birthdate && <p className={styles.errorText}>{fieldErrors.birthdate}</p>}
            </div>

            <div className={styles.contactInfo}>
              <h4>Contact Information</h4>
              <label className={styles.label}>Email</label>
              <input
                className={`${styles.inputField} ${fieldErrors.email ? styles.inputError : ''}`}
                value={candidate.email}
                onChange={(e) => handleChangeWrapper('email', e.target.value)}
                placeholder="Enter email"
                disabled={props.isReadOnly}
              />
              {fieldErrors.email && <p className={styles.errorText}>{fieldErrors.email}</p>}

              <label className={styles.label}>Contact No.</label>
              <input
                className={`${styles.inputField} ${fieldErrors.contact ? styles.inputError : ''}`}
                value={candidate.contact}
                onChange={(e) => handleChangeWrapper('contact', e.target.value)}
                placeholder="Enter contact"
                disabled={props.isReadOnly}
              />
              {fieldErrors.contact && <p className={styles.errorText}>{fieldErrors.contact}</p>}
            </div>
          </div>

          <div>
            <h4>Address</h4>
              <label className={styles.label}>House No./Street</label>
              <input
                className={`${styles.inputField} ${fieldErrors.streetAddress ? styles.inputError : ''}`}
                value={candidate.streetAddress}
                onChange={(e) => handleChangeWrapper('streetAddress', e.target.value)}
                placeholder="Enter house no/ street"
                disabled={props.isReadOnly}
              />
              {fieldErrors.streetAddress && <p className={styles.errorText}>{fieldErrors.streetAddress}</p>}

              <label className={styles.label}>Barangay</label>
              <input
                className={`${styles.inputField} ${fieldErrors.barangay ? styles.inputError : ''}`}
                value={candidate.barangay}
                onChange={(e) => handleChangeWrapper('barangay', e.target.value)}
                placeholder="Enter barangay"
                disabled={props.isReadOnly}
              />
              {fieldErrors.barangay && <p className={styles.errorText}>{fieldErrors.barangay}</p>}

              <label className={styles.label}>City</label>
              <input
                className={`${styles.inputField} ${fieldErrors.city ? styles.inputError : ''}`}
                value={candidate.city}
                onChange={(e) => handleChangeWrapper('city', e.target.value)}
                placeholder="Enter city"
                disabled={props.isReadOnly}
              />
              {fieldErrors.city && <p className={styles.errorText}>{fieldErrors.city}</p>}

              <label className={styles.label}>Province</label>
              <input
                className={`${styles.inputField} ${fieldErrors.province ? styles.inputError : ''}`}
                value={candidate.province}
                onChange={(e) => handleChangeWrapper('province', e.target.value)}
                placeholder="Enter province"
                disabled={props.isReadOnly}
              />
              {fieldErrors.province && <p className={styles.errorText}>{fieldErrors.province}</p>}

              <label className={styles.label}>Country</label>
              <input
                className={`${styles.inputField} ${fieldErrors.country ? styles.inputError : ''}`}
                value={candidate.country}
                onChange={(e) => handleChangeWrapper('country', e.target.value)}
                placeholder="Enter country"
                disabled={props.isReadOnly}
              />
              {fieldErrors.country && <p className={styles.errorText}>{fieldErrors.country}</p>}
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
                      {!props.isReadOnly && (
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
                      )}
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
                          <button className={styles.editButton} onClick={() => editWork(index)}><i className="ri-edit-2-line" /></button>
                          <button className={styles.deleteButton}onClick={() => deleteWork(index)}><i className="ri-delete-bin-line" /></button>
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

        <h3>Application Information</h3>

        <div className={styles.sectionGroup}>
          <div className={styles.onboardingInfo}>
            <h4>Application Details</h4>
            <select
              className={`${styles.inputField} ${fieldErrors.applicationStatus ? styles.inputError : ''}`}
              value={candidate.applicationStatus}
              onChange={(e) => handleChangeWrapper('applicationStatus', e.target.value)}
              disabled={props.isReadOnly}
            >
              <option value="">Application status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Hired">Hired</option>
            </select>
            {fieldErrors.applicationStatus && <p className={styles.errorText}>{fieldErrors.applicationStatus}</p>}

            <label className={styles.label}>Application Date</label>
            <input
              type="date"
              className={`${styles.inputField} ${fieldErrors.applicationDate ? styles.inputError : ''}`}
              value={candidate.applicationDate}
              onChange={(e) => handleChangeWrapper('applicationDate', e.target.value)}
              disabled={props.isReadOnly}
            />
            {fieldErrors.applicationDate && <p className={styles.errorText}>{fieldErrors.applicationDate}</p>}

            <label className={styles.label}> Source of Hire</label>
            <input
              className={`${styles.inputField} ${fieldErrors.sourceOfHire ? styles.inputError : ''}`}
              value={candidate.sourceOfHire}
              onChange={(e) => handleChangeWrapper('sourceOfHire', e.target.value)}
              placeholder="Enter source of hire"
              disabled={props.isReadOnly}
            />
            {fieldErrors.position && <p className={styles.errorText}>{fieldErrors.position}</p>}

            <select
              className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
              value={candidate.department}
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

            <label className={styles.label}> Desired Position</label>
            <input
              className={`${styles.inputField} ${fieldErrors.position ? styles.inputError : ''}`}
              value={candidate.position}
              onChange={(e) => handleChangeWrapper('position', e.target.value)}
              placeholder="Enter position"
              disabled={props.isReadOnly}
            />
            {fieldErrors.position && <p className={styles.errorText}>{fieldErrors.position}</p>}

            <h4>Interview Details</h4>
            <table className={styles.interviewDetailsTable}>
              <thead>
                <tr>
                  <th className={styles.firstColumn}>No.</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>2019-02-20</td>
                </tr>
              </tbody>
            </table>
          </div>
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

export default CandidateModal;