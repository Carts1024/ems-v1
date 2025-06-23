import React from 'react';
import styles from '../InformationModal.module.css';

interface Props {
  workExperiences: any[];
  tempWork: any;
  editingWorkIndex: number | null;
  setTempWork: (val: any) => void;
  addWork: () => void;
  saveWork: () => void;
  editWork: (index: number) => void;
  cancelWorkEdit: () => void;
  deleteWork: (index: number) => void;
  isTempWorkValid: boolean;
  workDateError: any;
  setWorkDateError: (val: any) => void;
  validateWorkDates: (from: string, to: string) => void;

  educationList: any[];
  tempEduc: any;
  editingEducIndex: number | null;
  setTempEduc: (val: any) => void;
  addEducation: () => void;
  saveEducation: () => void;
  editEducation: (index: number) => void;
  cancelEducationEdit: () => void;
  deleteEducation: (index: number) => void;
  isTempEducValid: boolean;
  educDateError: string;
  setEducDateError: (val: string) => void;
  isReadOnly?: boolean;
}

const WorkEducationSection: React.FC<Props> = (props) => {
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
    setEducDateError,
    isReadOnly
  } = props;

  return (
    <div className={styles.sectionGroup}>
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
  );
};

export default WorkEducationSection;