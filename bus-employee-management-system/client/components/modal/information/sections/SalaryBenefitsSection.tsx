import React from 'react';
import styles from '../InformationModal.module.css';
import { Employee } from '../EmployeeModalLogic';

interface Props {
  employee: Employee;
  fieldErrors: any;
  handleChangeWrapper: (field: keyof Employee, value: string | string[]) => void;
  isReadOnly?: boolean;
  deductionList: any[];
  tempDeduct: any;
  editingDeductIndex: number | null;
  setTempDeduct: (val: any) => void;
  addDeduction: () => void;
  saveDeduction: () => void;
  editDeduction: (index: number) => void;
  cancelDeductionEdit: () => void;
  deleteDeduction: (index: number) => void;
  isTempDeductValid: boolean;
  deductFieldError: any;

  benefitList: any[];
  tempBenefit: any;
  editingBenefitIndex: number | null;
  setTempBenefit: (val: any) => void;
  addBenefit: () => void;
  saveBenefit: () => void;
  editBenefit: (index: number) => void;
  cancelBenefitEdit: () => void;
  deleteBenefit: (index: number) => void;
  isTempBenefitValid: boolean;
  benefitFieldError: any;
  setBenefitFieldError: (val: any) => void;
}

const SalaryBenefitsSection: React.FC<Props> = ({
  employee,
  fieldErrors,
  handleChangeWrapper,
  isReadOnly,
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
  deductFieldError,
  benefitList,
  tempBenefit,
  editingBenefitIndex,
  setTempBenefit,
  addBenefit,
  saveBenefit,
  editBenefit,
  cancelBenefitEdit,
  deleteBenefit,
  isTempBenefitValid,
  benefitFieldError,
  setBenefitFieldError
}) => {
  return (
    <div className={styles.sectionGroup}>
        <label className={styles.label}>Basic Rate</label>
        <input
            type="number"
            step="0.01"
            min="0"
            className={`${styles.inputField} ${fieldErrors.basicPay ? styles.inputError : ''}`}
            value={employee.basicPay}
            onChange={(e) => handleChangeWrapper('basicPay', e.target.value)}
            placeholder="Enter basic rate"
            disabled={isReadOnly}
        />
        {fieldErrors.basicPay && <p className={styles.errorText}>{fieldErrors.basicPay}</p>}

        {/* Deductions Table */}
        <div className={styles.sectionHeader}>
            <h4>Deductions</h4>
            {!isReadOnly && (
            <button onClick={addDeduction} className={styles.addDeductButton}>
                <i className="ri-add-line" />
            </button>
            )}
        </div>
        <table className={styles.deductTable}>
            <thead>
            <tr>
                <th>No.</th>
                <th>Reason</th>
                <th>Frequency</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Effective Date</th>
                <th>End Date</th>
                <th>Status</th>
                {!isReadOnly && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {[...deductionList, ...(editingDeductIndex === deductionList.length ? [{
                reason: '', amount: '', frequency: '', effectiveDate: '', endDate: '', status: ''
            }] : [])].map((d, index) => (
                <tr key={index}>
                {editingDeductIndex === index ? (
                    <>
                    <td>{index + 1}</td>
                    <td>
                        <select
                        className={styles.tableInput}
                        value={tempDeduct.reason}
                        onChange={(e) => setTempDeduct({ ...tempDeduct, reason: e.target.value })}
                        >
                        <option value="">Select reason</option>
                        {['SSS', 'Pag-IBIG', 'PhilHealth', 'Withholding Tax', 'Cash Advance', 'Others'].map(reason => (
                            <option key={reason} value={reason}>{reason}</option>
                        ))}
                        </select>
                        {deductFieldError.reason && <p className={styles.errorText}>{deductFieldError.reason}</p>}
                    </td>
                    <td>
                        <select
                        className={styles.tableInput}
                        value={tempDeduct.frequency}
                        onChange={(e) => setTempDeduct({ ...tempDeduct, frequency: e.target.value })}
                        >
                        <option value="">Select frequency</option>
                        {['Once', 'Daily', 'Weekly', 'Monthly', 'Annually'].map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                        ))}
                        </select>
                        {deductFieldError.frequency && <p className={styles.errorText}>{deductFieldError.frequency}</p>}
                    </td>
                    <td>
                        <select
                            className={styles.tableInput}
                            value={tempDeduct.type}
                            onChange={(e) => setTempDeduct({ ...tempDeduct, type: e.target.value as 'fixed' | 'percentage' })}
                        >
                            <option value="fixed">fixed</option>
                            <option value="percentage">percentage</option>
                        </select>
                        {deductFieldError.type && <p className={styles.errorText}>{deductFieldError.type}</p>}
                    </td>
                    <td>
                        <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={styles.tableInput}
                        value={tempDeduct.amount}
                        onChange={(e) => setTempDeduct({ ...tempDeduct, amount: e.target.value })}
                        />
                        {deductFieldError.amount && <p className={styles.errorText}>{deductFieldError.amount}</p>}
                    </td>
                    <td>
                        <input
                        type="date"
                        className={styles.tableInput}
                        value={tempDeduct.effectiveDate}
                        onChange={(e) => setTempDeduct({ ...tempDeduct, effectiveDate: e.target.value })}
                        />
                        {deductFieldError.effectiveDate && <p className={styles.errorText}>{deductFieldError.effectiveDate}</p>}
                    </td>
                    <td>
                        <input
                        type="date"
                        className={styles.tableInput}
                        value={tempDeduct.endDate}
                        onChange={(e) => setTempDeduct({ ...tempDeduct, endDate: e.target.value })}
                        />
                        {deductFieldError.endDate && <p className={styles.errorText}>{deductFieldError.endDate}</p>}
                    </td>
                    <td>
                        <select
                        className={styles.tableInput}
                        value={tempDeduct.status}
                        onChange={(e) => setTempDeduct({ ...tempDeduct, status: e.target.value })}
                        >
                        <option value="">Select status</option>
                        {['Active', 'Exempt'].map(stat => (
                            <option key={stat} value={stat}>{stat}</option>
                        ))}
                        </select>
                        {deductFieldError.status && <p className={styles.errorText}>{deductFieldError.status}</p>}
                    </td>
                    <td className={styles.actionCell}>
                        <button className={styles.xButton} onClick={cancelDeductionEdit}><i className="ri-close-line" /></button>
                        <button className={styles.saveButton} onClick={saveDeduction}>
                        <i className="ri-save-line" />
                        </button>
                    </td>
                    </>
                ) : (
                    <>
                    <td>{index + 1}</td>
                    <td>{d.reason}</td>
                    <td>{d.frequency}</td>
                    <td>{d.type}</td>
                    <td>{d.amount}</td>
                    <td>{d.effectiveDate}</td>
                    <td>{d.endDate}</td>
                    <td>{d.status}</td>
                    {!isReadOnly && (
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

        {/* Benefits Table */}
        <div className={styles.sectionHeader}>
            <h4>Benefits</h4>
            {!isReadOnly && (
            <button onClick={addBenefit} className={styles.addBenefitButton}>
                <i className="ri-add-line" />
            </button>
            )}
        </div>
        <table className={styles.benefitTable}>
            <thead>
            <tr>
                <th>No.</th>
                <th>Benefit</th>
                <th>Frequency</th>
                <th>Amount</th>
                <th>Effective Date</th>
                <th>End Date</th>
                <th>Status</th>
                {!isReadOnly && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {[...benefitList, ...(editingBenefitIndex === benefitList.length ? [{
                benefit: '', amount: '', frequency: '', effectiveDate: '', endDate: '', status: ''
            }] : [])].map((b, index) => (
                <tr key={index}>
                {editingBenefitIndex === index ? (
                    <>
                    <td>{index + 1}</td>
                    <td>
                        <select
                        className={styles.tableInput}
                        value={tempBenefit.benefit}
                        onChange={(e) => setTempBenefit({ ...tempBenefit, benefit: e.target.value })}
                        >
                        <option value="">Select benefit</option>
                        {['Service Incentive Leave (SIL)', 'Holiday', '13-month Pay', 'Safety', 'Others'].map(benefit => (
                            <option key={benefit} value={benefit}>{benefit}</option>
                        ))}
                        </select>
                        {benefitFieldError.benefit && <p className={styles.errorText}>{benefitFieldError.benefit}</p>}
                    </td>
                    <td>
                        <select
                        className={styles.tableInput}
                        value={tempBenefit.frequency}
                        onChange={(e) => setTempBenefit({ ...tempBenefit, frequency: e.target.value })}
                        >
                        <option value="">Select frequency</option>
                        {['Once', 'Daily', 'Weekly', 'Monthly', 'Annually'].map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                        ))}
                        </select>
                        {benefitFieldError.frequency && <p className={styles.errorText}>{benefitFieldError.frequency}</p>}
                    </td>
                    <td>
                        <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={styles.tableInput}
                        value={tempBenefit.amount}
                        onChange={(e) => setTempBenefit({ ...tempBenefit, amount: e.target.value })}
                        />
                        {benefitFieldError.amount && <p className={styles.errorText}>{benefitFieldError.amount}</p>}
                    </td>
                    <td>
                        <input
                        type="date"
                        className={styles.tableInput}
                        value={tempBenefit.effectiveDate}
                        onChange={(e) => setTempBenefit({ ...tempBenefit, effectiveDate: e.target.value })}
                        />
                        {benefitFieldError.effectiveDate && <p className={styles.errorText}>{benefitFieldError.effectiveDate}</p>}
                    </td>
                    <td>
                        <input
                        type="date"
                        className={styles.tableInput}
                        value={tempBenefit.endDate}
                        onChange={(e) => setTempBenefit({ ...tempBenefit, endDate: e.target.value })}
                        />
                        {benefitFieldError.endDate && <p className={styles.errorText}>{benefitFieldError.endDate}</p>}
                    </td>
                    <td>
                        <select
                        className={styles.tableInput}
                        value={tempBenefit.status}
                        onChange={(e) => setTempBenefit({ ...tempBenefit, status: e.target.value })}
                        >
                        <option value="">Select status</option>
                        {['Active', 'Inactive', 'Pending', 'Terminated'].map(stat => (
                            <option key={stat} value={stat}>{stat}</option>
                        ))}
                        </select>
                        {benefitFieldError.status && <p className={styles.errorText}>{benefitFieldError.status}</p>}
                    </td>
                    <td className={styles.actionCell}>
                        <button className={styles.xButton} onClick={cancelBenefitEdit}><i className="ri-close-line" /></button>
                        <button className={styles.saveButton} onClick={saveBenefit}>
                        <i className="ri-save-line" />
                        </button>
                    </td>
                    </>
                ) : (
                    <>
                    <td>{index + 1}</td>
                    <td>{b.benefit}</td>
                    <td>{b.frequency}</td>
                    <td>{b.amount}</td>
                    <td>{b.effectiveDate}</td>
                    <td>{b.endDate}</td>
                    <td>{b.status}</td>
                    {!isReadOnly && (
                        <td className={styles.actionCell}>
                        <button className={styles.editButton} onClick={() => editBenefit(index)}><i className="ri-edit-2-line" /></button>
                        <button className={styles.deleteButton} onClick={() => deleteBenefit(index)}><i className="ri-delete-bin-line" /></button>
                        </td>
                    )}
                    </>
                )}
                </tr>
            ))}
            </tbody>
        </table>

        {/* Driver’s License (only visible for Drivers)*/}
        {employee.position === 'Driver' && (
            <>
            <h4>Driver’s License (For Drivers)</h4>

            <label className={styles.label}>License Type</label>
            <select
                className={`${styles.inputField} ${fieldErrors.licenseType ? styles.inputError : ''}`}
                value={employee.licenseType}
                onChange={(e) => handleChangeWrapper('licenseType', e.target.value)}
                disabled={isReadOnly}
            >
                <option value="professional">Professional</option>
            </select>

            <label className={styles.label}>License No.</label>
            <input
                className={`${styles.inputField} ${fieldErrors.licenseNo ? styles.inputError : ''}`}
                value={employee.licenseNo.replace(/.(?=.{4})/g, '*')}
                onChange={(e) => handleChangeWrapper('licenseNo', e.target.value)}
                placeholder="Enter license no."
                disabled={isReadOnly}
            />
            {fieldErrors.licenseNo && <p className={styles.errorText}>{fieldErrors.licenseNo}</p>}

            <label>Restriction Codes</label>
            <div className={styles.checkboxGroup}>
                {[
                'A : Motorcycle (L1, L2, L3)',
                'A1 : Tricycle (L4, L5, L6, L7)',
                'B : Passenger Car (M1)',
                'B1 : Van or Jeepney (M2)',
                'B2 : Light Commercial Vehicle (N1)',
                'C : Heavy Commercial Vehicle (N2, N3)',
                'D : Passenger Bus (M3)',
                'BE : Light Articulated Vehicle (O1, O2)',
                'CE : Heavy Articulated Vehicle (O3, O4)'
                ].map((code) => (
                <label key={code} className={styles.checkboxItem}>
                    <input
                    type="checkbox"
                    value={code}
                    checked={employee.restrictionCodes.includes(code)}
                    onChange={(e) => {
                        const value = e.target.value;
                        const updated = e.target.checked
                        ? [...employee.restrictionCodes, value]
                        : employee.restrictionCodes.filter((c) => c !== value);
                        handleChangeWrapper('restrictionCodes', updated);
                    }}
                    className={styles.styledCheckbox}
                    disabled={isReadOnly}
                    />
                    {code}
                </label>
                ))}
            </div>
            {fieldErrors.restrictionCodes && (
                <p className={styles.errorText}>{fieldErrors.restrictionCodes}</p>
            )}

            <label className={styles.label}>Expiration Date</label>
            <input
                type="date"
                className={`${styles.inputField} ${fieldErrors.expireDate ? styles.inputError : ''}`}
                value={employee.expireDate}
                onChange={(e) => handleChangeWrapper('expireDate', e.target.value)}
                disabled={isReadOnly}
            />
            {fieldErrors.expireDate && <p className={styles.errorText}>{fieldErrors.expireDate}</p>}
            </>
        )}
    </div>
  );
};

export default SalaryBenefitsSection;