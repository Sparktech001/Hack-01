import React from 'react';

export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={name} className="input-field__label">
          {label} {required && <span className="input-field__required">*</span>}
        </label>
      )}

      <div className="input-field__wrapper">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="input-field__control input-field__control--select"
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
        <span className="input-field__select-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {error && <p className="input-field__error-msg">{error}</p>}
    </div>
  );
}
