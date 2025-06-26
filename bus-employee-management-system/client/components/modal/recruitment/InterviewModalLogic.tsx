/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

export interface InterviewForm {
  interviewStatus: 'Scheduled' | 'Completed' | 'Cancelled';
  candidateName: string;
  interviewDate: string;
  interviewTime: string; // stored in "HH:MM" format for <input type="time" />
}

export interface FieldErrors {
  interviewStatus?: string;
  candidateName?: string;
  interviewDate?: string;
  interviewTime?: string;
}

export const InterviewModalLogic = (defaultValue?: InterviewForm) => {
    const [schedule, setSchedule] = useState<InterviewForm>({
        interviewStatus: 'Scheduled',
        candidateName: '',
        interviewDate: '',
        interviewTime: '',
    });

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    useEffect(() => {
        if (defaultValue) {
        setSchedule({
            ...defaultValue,
            interviewTime: convertTo24Hour(defaultValue.interviewTime),
        });
        }
    }, [defaultValue]);

    const handleChange = (field: keyof InterviewForm, value: string) => {
        setSchedule((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const errors: FieldErrors = {};

        if (!schedule.candidateName) errors.candidateName = 'Required';
        if (!schedule.interviewDate) {
            errors.interviewDate = 'Required';
        } else {
            const today = new Date();
            const selectedDate = new Date(schedule.interviewDate);
            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
            errors.interviewDate = 'Cannot be in the past';
            }
        }

        if (!schedule.interviewTime) {
            errors.interviewTime = 'Required';
        } else {
            const [hourStr, minuteStr] = schedule.interviewTime.split(':');
            const hour = parseInt(hourStr);
            const minute = parseInt(minuteStr);

            if (
            hour < 9 ||
            (hour === 16 && minute > 0) ||
            hour > 16
            ) {
            errors.interviewTime = 'Time must be between 09:00 AM and 04:00 PM';
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const convertTo24Hour = (time12h: string): string => {
        if (!time12h.includes(' ')) return time12h; // Already in 24hr format
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');

        if (modifier === 'PM' && hours !== '12') {
        hours = String(parseInt(hours) + 12);
        }
        if (modifier === 'AM' && hours === '12') {
        hours = '00';
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    return {
        schedule,
        fieldErrors,
        handleChange,
        validate,
        setSchedule,
    };
};