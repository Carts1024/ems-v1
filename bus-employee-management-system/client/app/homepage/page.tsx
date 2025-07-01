'use client';

import React from 'react';
import styles from './dashboard.module.css';
import { DashboardLogic } from './dashboardLogic';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const DashboardPage = () => {
  const {
    summaryData,
    employeeStatusData,
    requestStatusData,
    departmentDistributionData,
    leaveTypeDistributionData,
    monthlyActivityData,
  } = DashboardLogic();

  // Pie chart colors
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF197F'];

  return (
    <div className={styles.base}>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.title}>Dashboard Overview</h1>

        {/* Overview Cards */}
        <div className={styles.overviewCards}>
          <div className={styles.card}>
            <h3>Total Candidates</h3>
            <p className={styles.cardValue}>{summaryData.totalCandidates}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Employees</h3>
            <p className={styles.cardValue}>{summaryData.totalEmployees}</p>
          </div>
          <div className={styles.card}>
            <h3>Open Positions</h3>
            <p className={styles.cardValue}>{summaryData.openPositions}</p>
          </div>
          <div className={styles.card}>
            <h3>On Leave Employees</h3>
            <p className={styles.cardValue}>{summaryData.onLeaveEmployees}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>

          {/* Employee Status Distribution - Pie Chart */}
          <div className={styles.chartCard}>
            <h3>Employee Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                >
                  {employeeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Request Status Distribution - Bar Chart */}
          <div className={styles.chartCard}>
            <h3>Request Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={requestStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Employee Distribution - Bar Chart */}
          <div className={styles.chartCard}>
            <h3>Employees by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={departmentDistributionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} height={45} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="employees" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leave Type Distribution - Pie Chart */}
          <div className={styles.chartCard}>
            <h3>Leave Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leaveTypeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                >
                  {leaveTypeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly System Activity - Line Chart */}
          <div className={styles.chartCardFull}>
            <h3>Monthly System Activity (e.g., Logins, Requests)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyActivityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="logins" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="requests" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;