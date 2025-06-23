import React from 'react';
import styles from '../InformationModal.module.css';

const ExitLeaveSection: React.FC = () => {
  return (
    <div className={styles.sectionGroup}>
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
  );
};

export default ExitLeaveSection;