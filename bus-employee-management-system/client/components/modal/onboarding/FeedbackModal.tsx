'use client';

import React from 'react';
import styles from './OnboardingModal.module.css';
import { Candidate } from './CandidateModalLogic';
import { useFeedbackModal } from './FeedbackModalLogic';

interface FeedbackModalProps {
  candidate: Candidate;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ candidate, onClose }) => {
  const {
    fullDateText,
    numericDateTime,
    feedback,
    isEditing,
    originalFeedback,
    setFeedback,
    handleEditClick,
    handleCancel,
    handleSave,
    isFeedbackValid,
  } = useFeedbackModal(candidate, onClose);


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>

        <h1 className={styles.heading}>Feedback</h1>

        <div className={styles.sectionHeader}>
            <h4>
            Name: {candidate.firstName} {candidate.lastName} <br />
            Position: {candidate.position}
            </h4>

            <h4 className={styles.date}>
                {fullDateText} <br/>
                {numericDateTime}
            </h4>
        </div>

        <div className={styles.evaluationLabel}>
            <h3>Evaluation</h3>
        </div>
        {!isEditing && (
          <>
            <p>
              {originalFeedback ? originalFeedback : 'No evaluation feedback.'}
            </p>
            <div className={styles.evalButton}>
                <button onClick={handleEditClick} className={styles.addFeedbackButton}>
                    <i className="ri-draft-line" />
                    {originalFeedback ? 'Update Evaluation' : 'Write an Evaluation'}
                </button>
            </div>
          </>
        )}

        {isEditing && (
          <>
            <textarea
              className={styles.inputField}
              placeholder="Write an evaluation feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className={styles.buttonGroup}>
              <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
              <button
                onClick={handleSave}
                className={styles.submitButton}
                disabled={!isFeedbackValid || feedback == originalFeedback}>
                {originalFeedback ? 'Update' : 'Save'}
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
