import { useState, useEffect } from 'react';

// Define types for your dashboard data
interface SummaryData {
  totalEmployees: number;
  activeRequests: number; // Combined pending leaves, cash advances, resignations
  openPositions: number;
  pendingResignations: number;
}

// Updated ChartDataItem to be more flexible for different data keys (e.g., 'value', 'count', 'employees')
interface ChartDataItem {
  name: string;
  value?: number; // Made optional for PieChart
  count?: number; // Added for BarChart (Request Status)
  employees?: number; // Added for BarChart (Department Distribution)
  [key: string]: any; // Allows for other dynamic properties if needed
}

interface MonthlyActivityData {
  month: string;
  logins: number;
  requests: number; // Example for total requests (leaves, CAs, resignations)
}

export const DashboardLogic = () => {
  // State for dashboard data
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalEmployees: 0,
    activeRequests: 0,
    openPositions: 0,
    pendingResignations: 0,
  });

  const [employeeStatusData, setEmployeeStatusData] = useState<ChartDataItem[]>([]);
  const [requestStatusData, setRequestStatusData] = useState<ChartDataItem[]>([]);
  const [departmentDistributionData, setDepartmentDistributionData] = useState<ChartDataItem[]>([]);
  const [leaveTypeDistributionData, setLeaveTypeDistributionData] = useState<ChartDataItem[]>([]);
  const [monthlyActivityData, setMonthlyActivityData] = useState<MonthlyActivityData[]>([]);

  useEffect(() => {
    // Simulate fetching data from various modules
    // In a real application, you would make API calls here
    // Example: fetch('/api/employees/summary'), fetch('/api/requests/status')

    // Dummy data for Summary Cards
    setSummaryData({
      totalEmployees: 250,
      activeRequests: 15, // Sum of pending leaves, cash advances, resignations
      openPositions: 5,
      pendingResignations: 3,
    });

    // Dummy data for Employee Status Distribution (Pie Chart) - uses 'value'
    setEmployeeStatusData([
      { name: 'Active', value: 220 },
      { name: 'On Leave', value: 10 },
      { name: 'Terminated', value: 15 },
      { name: 'Resigned', value: 5 },
    ]);

    // Dummy data for Request Status Overview (Bar Chart) - uses 'count'
    setRequestStatusData([
      { name: 'Pending', count: 8 },
      { name: 'Approved', count: 12 },
      { name: 'Rejected', count: 3 },
      { name: 'Others', count: 2 },
    ]);

    // Dummy data for Department Employee Distribution (Bar Chart) - uses 'employees'
    setDepartmentDistributionData([
      { name: 'Accounting', employees: 80 },
      { name: 'Inventory', employees: 20 },
      { name: 'Operational', employees: 60 },
      { name: 'Finance', employees: 25 },
      { name: 'Office', employees: 20 },
    ]);

    // Dummy data for Leave Type Distribution (Pie Chart) - uses 'value'
    setLeaveTypeDistributionData([
      { name: 'Sick Leave', value: 40 },
      { name: 'Vacation Leave', value: 30 },
      { name: 'Maternity/Paternity Leave', value: 10 },
      { name: 'Emergency Leave', value: 5 },
    ]);

    // Dummy data for Monthly System Activity (Line Chart)
    setMonthlyActivityData([
      { month: 'Jan', logins: 150, requests: 20 },
      { month: 'Feb', logins: 160, requests: 25 },
      { month: 'Mar', logins: 180, requests: 30 },
      { month: 'Apr', logins: 170, requests: 28 },
      { month: 'May', logins: 190, requests: 35 },
      { month: 'Jun', logins: 200, requests: 40 },
    ]);

  }, []); // Empty dependency array means this effect runs once on mount

  return {
    summaryData,
    employeeStatusData,
    requestStatusData,
    departmentDistributionData,
    leaveTypeDistributionData,
    monthlyActivityData,
  };
};
