import React, { useState, useRef, useEffect } from 'react';
import styles from './SearchableDropdown.module.css';

export interface DropdownOption {
  id: string;
  label: string;
  subtitle?: string;
  data?: unknown;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string, option?: DropdownOption) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchable?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  error = "",
  loading = false,
  onSearch,
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  useEffect(() => {
    if (!searchable) {
      setFilteredOptions(options);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.subtitle && option.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options, searchable]);

  // Handle external search callback
  useEffect(() => {
    if (onSearch && searchTerm) {
      const debounceTimer = setTimeout(() => {
        onSearch(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get display value
  const getDisplayValue = () => {
    if (searchTerm && isOpen) return searchTerm;
    const selectedOption = options.find(option => option.id === value);
    return selectedOption ? selectedOption.label : '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!searchable) return;
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    onChange(option.id, option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div
        className={`${styles.dropdownInput} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleInputClick}
      >
        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={styles.searchInput}
            readOnly={!isOpen}
          />
        ) : (
          <div className={styles.displayValue}>
            {getDisplayValue() || placeholder}
          </div>
        )}
        <div className={`${styles.dropdownArrow} ${isOpen ? styles.open : ''}`}>
          {loading ? (
            <div className={styles.spinner} />
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {isOpen && (
        <div className={styles.dropdownList}>
          {filteredOptions.length === 0 ? (
            <div className={styles.noOptions}>
              {loading ? 'Loading...' : 'No options found'}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className={`${styles.dropdownOption} ${
                  option.id === value ? styles.selected : ''
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <div className={styles.optionLabel}>{option.label}</div>
                {option.subtitle && (
                  <div className={styles.optionSubtitle}>{option.subtitle}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
