# Attendance CRUD Implementation

This implementation provides complete CRUD (Create, Read, Update, Delete) operations for attendance management with a searchable employee dropdown.

## Features

- ✅ Create new attendance records
- ✅ Read/view attendance records
- ✅ Update existing attendance records
- ✅ Delete attendance records
- ✅ Searchable employee dropdown
- ✅ Real-time validation
- ✅ ISO date/time format handling
- ✅ Holiday marking support

## API Payload Format

The backend expects attendance data in this format (as specified):

```json
{
  "date": "2025-07-05T00:00:00.000Z",
  "status": "Present",
  "timeIn": "2025-07-05T08:05:00.000Z",
  "timeOut": "2025-07-05T17:15:00.000Z",
  "remarks": "Arrived on time",
  "isHoliday": false
}
```

## Files Created/Modified

### New Files:
1. **`/services/attendanceService.ts`** - API service for attendance CRUD operations
2. **`/types/attendance.ts`** - TypeScript interfaces for attendance data
3. **`/components/ui/SearchableDropdown.tsx`** - Reusable searchable dropdown component
4. **`/components/ui/SearchableDropdown.module.css`** - Styles for dropdown
5. **`/hooks/useAttendance.ts`** - Custom hook for attendance state management
6. **`/hooks/useDailyReportLogic.ts`** - Logic hook for daily report page
7. **`/components/examples/AttendanceCRUDExample.tsx`** - Example usage component

### Modified Files:
1. **`/components/modal/attendance/AttendanceModalLogic.tsx`** - Updated with CRUD operations
2. **`/components/modal/attendance/AttendanceModal.tsx`** - Updated with searchable dropdown
3. **`/components/modal/attendance/AttendanceModal.module.css`** - Added checkbox styles

## Usage

### 1. Basic CRUD Operations

```tsx
import { useAttendance } from '@/hooks/useAttendance';

const MyComponent = () => {
  const {
    attendances,
    employees,
    loading,
    createAttendance,
    updateAttendance,
    deleteAttendance,
  } = useAttendance();

  // Create attendance
  const handleCreate = async () => {
    const payload = {
      date: "2025-07-05T00:00:00.000Z",
      status: "Present",
      timeIn: "2025-07-05T08:05:00.000Z",
      timeOut: "2025-07-05T17:15:00.000Z",
      remarks: "Arrived on time",
      isHoliday: false
    };
    
    await createAttendance("employee-id", payload);
  };

  // Update attendance
  const handleUpdate = async () => {
    await updateAttendance("employee-id", 123, payload);
  };

  // Delete attendance
  const handleDelete = async () => {
    await deleteAttendance("employee-id", 123);
  };
};
```

### 2. Using the Searchable Dropdown

```tsx
import { SearchableDropdown, DropdownOption } from '@/components/ui/SearchableDropdown';

const employeeOptions: DropdownOption[] = employees.map(employee => ({
  id: employee.id,
  label: `${employee.firstName} ${employee.lastName}`,
  subtitle: `${employee.employeeNumber} • ${employee.position?.positionName || 'N/A'}`,
}));

<SearchableDropdown
  options={employeeOptions}
  value={selectedEmployeeId}
  onChange={setSelectedEmployeeId}
  placeholder="Search and select employee..."
  loading={loadingEmployees}
/>
```

### 3. Using the Attendance Modal

```tsx
import AttendanceModal from '@/components/modal/attendance/AttendanceModal';

<AttendanceModal
  onClose={() => setShowModal(false)}
  onSubmit={(attendance) => {
    // Handle form submission
    console.log('Attendance data:', attendance);
  }}
  defaultValue={existingAttendance} // For editing
  isView={false} // Set to true for read-only view
/>
```

### 4. Complete Example Integration

See `/components/examples/AttendanceCRUDExample.tsx` for a complete working example that demonstrates:
- Data fetching and display
- CRUD operations
- Filtering and searching
- Modal management
- Error handling

## Key Components

### AttendanceService
Handles all API communications:
- `getAllAttendances()` - Get all attendance records
- `getAttendancesByEmployee(employeeId)` - Get attendance for specific employee
- `createAttendance(employeeId, payload)` - Create new attendance
- `updateAttendance(employeeId, attendanceId, payload)` - Update attendance
- `deleteAttendance(employeeId, attendanceId)` - Delete attendance

### SearchableDropdown
Features:
- Real-time search filtering
- Keyboard navigation
- Loading states
- Error handling
- Customizable styling
- Subtitle support for additional info

### useAttendance Hook
Provides:
- State management for attendance data
- CRUD operation methods
- Loading states
- Error handling
- Data refresh capabilities

## API Endpoints Used

Based on the backend structure, these endpoints are used:

- `GET /attendance` - Get all attendance records
- `GET /attendance/employee/:employeeId` - Get attendance for employee
- `POST /attendance/employee/:employeeId` - Create attendance for employee
- `PUT /attendance/employee/:employeeId/:id` - Update attendance record
- `DELETE /attendance/employee/:employeeId/:id` - Delete attendance record
- `GET /employees` - Get all employees for dropdown

## Data Flow

1. **Load Employees**: Fetch employee list for dropdown on component mount
2. **Select Employee**: User searches and selects employee from dropdown
3. **Auto-populate**: Employee details (name, department, position, hire date) auto-fill
4. **Validate**: Real-time validation ensures data integrity
5. **Submit**: Convert form data to API payload format and send to backend
6. **Refresh**: Update local state with latest data from server

## Error Handling

- Field-level validation with error messages
- API error handling with user notifications
- Loading states for better UX
- Confirmation dialogs for destructive actions

## Styling

The components use CSS modules for styling and are designed to be:
- Responsive (mobile-friendly)
- Accessible (keyboard navigation, ARIA labels)
- Consistent with existing design system
- Customizable through CSS variables

## Next Steps

To integrate this into your existing attendance pages:

1. Import the required hooks and components
2. Replace existing attendance logic with the new CRUD hooks
3. Update your modals to use the new AttendanceModal component
4. Add the SearchableDropdown where employee selection is needed
5. Test the API endpoints ensure they match the expected format

The implementation is designed to be drop-in compatible with minimal changes to existing code.
