import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  name,
  value,
  options = [],
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  icon: Icon = null
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = event => {
      if (event.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Normalize options (can be string or { value, label, badge, icon })
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : value || placeholder;

  const handleSelect = (optValue) => {
    if (disabled) return;
    setOpen(false);
    if (onChange) {
      // Support both event-style e.target.value and direct value
      onChange({
        target: { name: name || '', value: optValue }
      });
    }
  };

  return (
    <div className={`custom-select-wrap ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`} ref={ref}>
      <button
        type="button"
        className="custom-select-trigger"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <span className="trigger-content">
          {Icon && <Icon size={14} className="trigger-icon" />}
          {selectedOption?.icon && <selectedOption.icon size={14} className="trigger-icon" />}
          <span className={`trigger-label ${!selectedOption && !value ? 'is-placeholder' : ''}`}>
            {displayLabel}
          </span>
          {selectedOption?.badge && (
            <span className="trigger-badge">{selectedOption.badge}</span>
          )}
        </span>
        <ChevronDown size={14} className={`trigger-chevron ${open ? 'rotate' : ''}`} />
      </button>

      {open && (
        <div className="custom-select-popover">
          <div className="custom-select-options">
            {normalizedOptions.map(opt => {
              const isSelected = String(opt.value) === String(value);
              const OptIcon = opt.icon;
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="option-left">
                    {OptIcon && <OptIcon size={14} className="option-icon" />}
                    <span className="option-text">{opt.label}</span>
                    {opt.badge && <span className="option-badge">{opt.badge}</span>}
                  </span>
                  {isSelected ? (
                    <Check size={14} className="option-check" />
                  ) : (
                    <span className="option-check-placeholder" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

