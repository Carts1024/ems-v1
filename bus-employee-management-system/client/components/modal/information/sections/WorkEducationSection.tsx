/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import styles from '../InformationModal.module.css';
import { WorkExperience, Education } from '@/types/employee';
import { format } from 'date-fns';

interface Props {
  // --- Work Experience
  workExperiences: WorkExperience[];
  setWorkExperiences: (val: WorkExperience[]) => void;
  tempWork: WorkExperience;
  setTempWork: (val: WorkExperience) => void;
  editingWorkIndex: number | null;
  setEditingWorkIndex: (val: number | null) => void;
  addWork: () => void;
  saveWork: () => void;
  editWork: (index: number) => void;
  cancelWorkEdit: () => void;
  deleteWork: (index: number) => void;
  isTempWorkValid?: boolean;
  workDateError?: { from?: string; to?: string };
  validateWorkDates?: (from: string, to: string) => void;

  // --- Education
  educationList: Education[];
  setEducationList: (val: Education[]) => void;
  tempEduc: Education;
  setTempEduc: (val: Education) => void;
  editingEducIndex: number | null;
  setEditingEducIndex: (val: number | null) => void;
  addEducation: () => void;
  saveEducation: () => void;
  editEducation: (index: number) => void;
  cancelEducationEdit: () => void;
  deleteEducation: (index: number) => void;
  isTempEducValid?: boolean;
  educDateError?: string;
  setEducDateError?: (val: string) => void;
  isReadOnly?: boolean;
}

const WorkEducationSection: React.FC<Props> = (props) => {
  // --- Work Experience Table
  return (
    <div className={styles.sectionGroup}>
      {/* Work Experience */}
      <div className={styles.sectionHeader}>
        <h4>Work Experience</h4>
        {!props.isReadOnly && (
          <button onClick={props.addWork} className={styles.addWorkExpButton}>
            <i className="ri-add-line" />
          </button>
        )}
      </div>
      <table className={styles.workExpTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Company</th>
            <th>Position</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Description</th>
            {!props.isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {[...props.workExperiences, ...(props.editingWorkIndex === props.workExperiences.length ? [{
            companyName: '', position: '', from: '', to: '', description: ''
          }] : [])].map((exp, index) => (
            <tr key={index}>
              {props.editingWorkIndex === index ? (
                <>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      className={styles.tableInput}
                      value={props.tempWork.companyName}
                      onChange={e => props.setTempWork({ ...props.tempWork, companyName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.tableInput}
                      value={props.tempWork.position}
                      onChange={e => props.setTempWork({ ...props.tempWork, position: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.tableInput}
                      type="date"
                      value={props.tempWork.from || ''}
                      onChange={e => {
                        const from = e.target.value;
                        const to = props.tempWork.to;
                        props.setTempWork({ ...props.tempWork, from });
                        props.validateWorkDates && props.validateWorkDates(from, to);
                      }}
                    />
                    {props.workDateError?.from && <p className={styles.errorText}>{props.workDateError.from}</p>}
                  </td>
                  <td>
                    <input
                      className={styles.tableInput}
                      type="date"
                      value={props.tempWork.to || ''}
                      onChange={e => {
                        const to = e.target.value;
                        const from = props.tempWork.from;
                        props.setTempWork({ ...props.tempWork, to });
                        props.validateWorkDates && props.validateWorkDates(from, to);
                      }}
                    />
                    {props.workDateError?.to && <p className={styles.errorText}>{props.workDateError.to}</p>}
                  </td>
                  <td>
                    <input
                      className={styles.tableInput}
                      value={props.tempWork.description}
                      onChange={e => props.setTempWork({ ...props.tempWork, description: e.target.value })}
                    />
                  </td>
                  <td className={styles.actionCell}>
                    <button className={styles.xButton} onClick={props.cancelWorkEdit}>
                      <i className='ri-close-line'/>
                    </button>
                    <button className={styles.saveButton}
                      onClick={props.saveWork}
                      disabled={props.isTempWorkValid === false}
                    >
                      <i className="ri-save-line"/>
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{index + 1}</td>
                  <td>{exp.companyName || ''}</td>
                  <td>{exp.position || ''}</td>
                  <td>
                    {exp.from ? (
                      typeof exp.from === 'string' && exp.from.includes('T') 
                        ? format(new Date(exp.from), 'yyyy-MM-dd') 
                        : exp.from
                    ) : ''}
                  </td>
                  <td>
                    {exp.to ? (
                      typeof exp.to === 'string' && exp.to.includes('T') 
                        ? format(new Date(exp.to), 'yyyy-MM-dd') 
                        : exp.to
                    ) : ''}
                  </td>
                  <td>{exp.description || ''}</td>
                  {!props.isReadOnly && (
                    <td className={styles.actionCell}>
                      <button className={styles.editButton} onClick={() => props.editWork(index)}>
                        <i className="ri-edit-2-line" />
                      </button>
                      <button className={styles.deleteButton} onClick={() => props.deleteWork(index)}>
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

      {/* --- Education Table --- */}
      <div className={styles.sectionHeader}>
        <h4>Education</h4>
        {!props.isReadOnly && (
          <button onClick={props.addEducation} className={styles.addEducButton}>
            <i className="ri-add-line" />
          </button>
        )}
      </div>
      <table className={styles.educTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Institution</th>
            <th>Degree</th>
            <th>Field of Study</th>
            <th>Completion Date</th>
            {!props.isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {[...props.educationList, ...(props.editingEducIndex === props.educationList.length ? [{
            institution: '', degree: '', fieldOfStudy: '', endDate: ''
          }] : [])].map((edu, index) => (
            <tr key={index}>
              {props.editingEducIndex === index ? (
                <>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      className={styles.tableInput}
                      value={props.tempEduc.institution || ''}
                      onChange={e => props.setTempEduc({ ...props.tempEduc, institution: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.tableInput}
                      value={props.tempEduc.degree || ''}
                      onChange={e => props.setTempEduc({ ...props.tempEduc, degree: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.tableInput}
                      value={props.tempEduc.fieldOfStudy || ''}
                      onChange={e => props.setTempEduc({ ...props.tempEduc, fieldOfStudy: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.tableInput}
                      type="date"
                      value={props.tempEduc.endDate || ''}
                      onChange={e => {
                        const value = e.target.value;
                        props.setTempEduc({ ...props.tempEduc, endDate: value });
                        if (props.setEducDateError) {
                          if (new Date(value) > new Date()) {
                            props.setEducDateError('Date cannot be in the future.');
                          } else {
                            props.setEducDateError('');
                          }
                        }
                      }}
                    />
                    {props.educDateError && <p className={styles.dateError}>{props.educDateError}</p>}
                  </td>
                  {!props.isReadOnly && (
                    <td className={styles.actionCell}>
                      <button className={styles.xButton} onClick={props.cancelEducationEdit}>
                        <i className='ri-close-line'/>
                      </button>
                      <button className={styles.saveButton}
                        onClick={props.saveEducation}
                        disabled={props.isTempEducValid === false}>
                        <i className='ri-save-line'/>
                      </button>
                    </td>
                  )}
                </>
              ) : (
                <>
                  <td>{index + 1}</td>
                  <td>{edu.institution || ''}</td>
                  <td>{edu.degree || ''}</td>
                  <td>{edu.fieldOfStudy || ''}</td>
                  <td>
                    {edu.endDate ? format(new Date(edu.endDate), 'yyyy-MM-dd') : ''}
                  </td>
                  {!props.isReadOnly && (
                    <td className={styles.actionCell}>
                      <button className={styles.editButton} onClick={() => props.editEducation(index)}>
                        <i className="ri-edit-2-line" />
                      </button>
                      <button className={styles.deleteButton} onClick={() => props.deleteEducation(index)}>
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
  );
};

export default WorkEducationSection;
