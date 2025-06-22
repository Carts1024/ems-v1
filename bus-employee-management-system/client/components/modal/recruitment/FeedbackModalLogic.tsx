    'use client';

    import { useState, useEffect } from 'react';
    import { Candidate } from './CandidateModalLogic';
    import { showConfirmation, showSuccess } from '@/app/utils/swal';

    export const useFeedbackModal = (candidate: Candidate, onClose: () => void) => {
    const [feedback, setFeedback] = useState(candidate.feedback || '');
    const [originalFeedback, setOriginalFeedback] = useState(candidate.feedback || '');
    const [isEditing, setIsEditing] = useState(false);

    const isFeedbackValid = feedback.trim().length > 0;

    useEffect(() => {
    setFeedback(candidate.feedback || '');
    setOriginalFeedback(candidate.feedback || '');
    setIsEditing(false);
    }, [candidate]);

    const handleEditClick = () => {
    setIsEditing(true);
    };

    const now = new Date();

    const fullDateText = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    });

    const numericDateTime = now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
    });

    const handleCancel = async () => {
    if (feedback !== originalFeedback) {
        const result = await showConfirmation("Are you sure you want to close? Unsaved changes will be lost.");
        if (!result.isConfirmed) return;
    }
    setFeedback(originalFeedback);
    setIsEditing(false);
    };

    const handleSave = async () => {
    if (originalFeedback) {
        const result = await showConfirmation('Are you sure you want to update the feedback?');
        if (!result.isConfirmed) return;
    }

    showSuccess('Success', originalFeedback ? 'Feedback updated' : 'Feedback added');
    setOriginalFeedback(feedback);
    setIsEditing(false);
    // Optionally update candidate in backend or parent state here
    };

    return {
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
    onClose
    };
    };
