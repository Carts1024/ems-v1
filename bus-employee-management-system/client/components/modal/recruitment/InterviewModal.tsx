
import React from 'react';

interface InterviewModalProps {
  isEdit: boolean;
  isReadOnly?: boolean;
  defaultValue?: any; 
  existingSchedules: any[]; 
  onClose: () => void;
  onSubmit: (data: any) => void; 
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  isEdit,
  isReadOnly,
  defaultValue,
  existingSchedules, 
  onClose,
  onSubmit,
}) => {


  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      // 
      candidateName: "Test Name", // Placeholder
      position: "Test Position", // Placeholder
      interviewDate: "2025-06-22", // Placeholder
      interviewTime: "03:00 PM", // Placeholder
      interviewer: "Test Interviewer", // Placeholder
      interviewStatus: "Scheduled", // Placeholder
    };
    onSubmit(formData); // Call the onSubmit prop with your form data
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal-overlay"> {/* Add styles for overlay/backdrop */}
      <div className="modal-container"> {/* Add styles for the modal content */}
        <h3>
          {isReadOnly
            ? "View Interview Details"
            : isEdit
            ? "Edit Interview Schedule"
            : "Schedule New Interview"}
        </h3>
        <form onSubmit={handleFormSubmit}>
          {/* Your form fields will go here, e.g.: */}
          <div>
            <label>Candidate Name:</label>
            <input type="text" value={defaultValue?.candidateName || ''} readOnly={isReadOnly} />
          </div>
          {/* ... other form fields for position, date, time, interviewer, etc. */}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            {!isReadOnly && (
              <button type="submit">
                {isEdit ? "Save Changes" : "Schedule"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;