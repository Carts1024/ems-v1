/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styles from '../InformationModal.module.css';
import { Employee } from '../EmployeeModalLogic';

interface Props {
  employee: Employee;
  fieldErrors: any;
  handleChangeWrapper: (field: keyof Employee, value: string) => void;
  isReadOnly?: boolean;
}

const PersonalSection: React.FC<Props> = ({ employee, fieldErrors, handleChangeWrapper, isReadOnly }) => {
  return (
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
            disabled={isReadOnly}
            />
            {fieldErrors.lastName && <p className={styles.errorText}>{fieldErrors.lastName}</p>}

            <label className={styles.label}>First Name</label>
            <input
            className={`${styles.inputField} ${fieldErrors.firstName ? styles.inputError : ''}`}
            value={employee.firstName}
            onChange={(e) => handleChangeWrapper('firstName', e.target.value)}
            placeholder="Enter first name"
            disabled={isReadOnly}
            />
            {fieldErrors.firstName && <p className={styles.errorText}>{fieldErrors.firstName}</p>}

            {!(isReadOnly && !employee.middleName) && (
            <>
                <label className={styles.label}>Middle Name (Optional)</label>
                <input
                className={styles.inputField}
                value={employee.middleName}
                onChange={(e) => handleChangeWrapper('middleName', e.target.value)}
                placeholder="Enter middle name"
                disabled={isReadOnly}
                />
            </>
            )}

            {!(isReadOnly && !employee.suffix) && (
            <>
                <label className={styles.label}>Suffix</label>
                <input
                className={styles.inputField}
                value={employee.suffix}
                onChange={(e) => handleChangeWrapper('suffix', e.target.value)}
                placeholder="Enter suffix"
                disabled={isReadOnly}
                />
            </>
            )}

            <label className={styles.label}>Birthdate</label>
            <input
            type="date"
            className={`${styles.inputField} ${fieldErrors.birthdate ? styles.inputError : ''}`}
            value={employee.birthdate}
            onChange={(e) => handleChangeWrapper('birthdate', e.target.value)}
            disabled={isReadOnly}
            />
            {fieldErrors.birthdate && <p className={styles.errorText}>{fieldErrors.birthdate}</p>}

            {/* Emergency Contact */}
            <h4>Emergency Contact</h4>
            <label className={styles.label}>Full Name</label>
            <input
            className={`${styles.inputField} ${fieldErrors.emergencyContactName ? styles.inputError : ''}`}
            value={employee.emergencyContactName}
            onChange={(e) => handleChangeWrapper('emergencyContactName', e.target.value)}
            placeholder="Enter full name"
            disabled={isReadOnly}
            />
            {fieldErrors.emergencyContactName && <p className={styles.errorText}>{fieldErrors.emergencyContactName}</p>}

            <label className={styles.label}>Contact No.</label>
            <input
            className={`${styles.inputField} ${fieldErrors.emergencyContactNo ? styles.inputError : ''}`}
            value={employee.emergencyContactNo}
            onChange={(e) => handleChangeWrapper('emergencyContactNo', e.target.value)}
            placeholder="Enter 11-digit contact no."
            disabled={isReadOnly}
            />
            {fieldErrors.emergencyContactNo && <p className={styles.errorText}>{fieldErrors.emergencyContactNo}</p>}
        </div>

        <div className={styles.contactInfo}>
            <h4>Contact Details</h4>
            <label className={styles.label}>Email</label>
            <input
            className={`${styles.inputField} ${fieldErrors.email ? styles.inputError : ''}`}
            value={employee.email}
            onChange={(e) => handleChangeWrapper('email', e.target.value)}
            placeholder="Enter email"
            disabled={isReadOnly}
            />
            {fieldErrors.email && <p className={styles.errorText}>{fieldErrors.email}</p>}

            <label className={styles.label}>Contact No.</label>
            <input
            className={`${styles.inputField} ${fieldErrors.contact ? styles.inputError : ''}`}
            value={employee.contact}
            onChange={(e) => handleChangeWrapper('contact', e.target.value)}
            placeholder="Enter contact no."
            disabled={isReadOnly}
            />
            {fieldErrors.contact && <p className={styles.errorText}>{fieldErrors.contact}</p>}

            <label className={styles.label}>House No./Street</label>
            <input
            className={`${styles.inputField} ${fieldErrors.houseStreet ? styles.inputError : ''}`}
            value={employee.houseStreet}
            onChange={(e) => handleChangeWrapper('houseStreet', e.target.value)}
            placeholder="Enter house no./ street"
            disabled={isReadOnly}
            />
            {fieldErrors.houseStreetBarangay && <p className={styles.errorText}>{fieldErrors.houseStreetBarangay}</p>}

            <label className={styles.label}>Barangay</label>
            <input
            className={`${styles.inputField} ${fieldErrors.barangay ? styles.inputError : ''}`}
            value={employee.barangay}
            onChange={(e) => handleChangeWrapper('barangay', e.target.value)}
            placeholder="Enter barangay"
            disabled={isReadOnly}
            />
            {fieldErrors.houseStreetBarangay && <p className={styles.errorText}>{fieldErrors.houseStreetBarangay}</p>}

            <label className={styles.label}>City</label>
            <input
            className={`${styles.inputField} ${fieldErrors.city ? styles.inputError : ''}`}
            value={employee.city}
            onChange={(e) => handleChangeWrapper('city', e.target.value)}
            placeholder="Enter city"
            disabled={isReadOnly}
            />
            {fieldErrors.city && <p className={styles.errorText}>{fieldErrors.city}</p>}

            <label className={styles.label}>State/Province/Region</label>
            <input
            className={`${styles.inputField} ${fieldErrors.stateProvinceRegion ? styles.inputError : ''}`}
            value={employee.stateProvinceRegion}
            onChange={(e) => handleChangeWrapper('stateProvinceRegion', e.target.value)}
            placeholder="Enter state/ province/ region"
            disabled={isReadOnly}
            />
            {fieldErrors.stateProvinceRegion && <p className={styles.errorText}>{fieldErrors.stateProvinceRegion}</p>}
            
            <label className={styles.label}>Country</label>
            <input
            className={`${styles.inputField} ${fieldErrors.country ? styles.inputError : ''}`}
            value={employee.country}
            onChange={(e) => handleChangeWrapper('country', e.target.value)}
            placeholder="Enter country"
            disabled={isReadOnly}
            />
            {fieldErrors.country && <p className={styles.errorText}>{fieldErrors.country}</p>}

            <label className={styles.label}>Zip Code</label>
            <input
            className={`${styles.inputField} ${fieldErrors.zipCode ? styles.inputError : ''}`}
            value={employee.zipCode}
            onChange={(e) => handleChangeWrapper('zipCode', e.target.value)}
            placeholder="Enter zip code"
            disabled={isReadOnly}
            />
            {fieldErrors.zipCode && <p className={styles.errorText}>{fieldErrors.zipCode}</p>}
        </div>
        </div>
    </div>
  );
};

export default PersonalSection;
