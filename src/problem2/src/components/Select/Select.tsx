import React, { useState, useRef, useEffect } from 'react'
import { OptionItem } from './SelectItem/SelectItem'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleSelect = (selectedValue: string) => {
    if (selectedValue !== value) {
      onChange(selectedValue)
    }
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown when disabled
  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false)
    }
  }, [disabled, isOpen])

  return (
    <div className={`${styles.selectContainer} ${className}`} ref={selectRef}>
      <div
        className={`${styles.select} ${isOpen ? styles.open : ''} ${
          disabled ? styles.disabled : ''
        }`}
        onClick={toggleDropdown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            toggleDropdown()
          } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault()
            setIsOpen(false)
          }
        }}
      >
        <div className={styles.selectedValue}>
          {selectedOption ? (
            <div className={styles.optionContent}>
              <img
                src={`/tokens-icon/${selectedOption.value}.svg`}
                alt={selectedOption.label}
                className={styles.tokenIcon}
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.src = '/vite.svg'
                }}
              />
              <span className={styles.optionText}>{selectedOption.label}</span>
            </div>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <div className={styles.arrow} />
      </div>
      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {options.map(option => (
            <OptionItem
              key={option.value}
              value={option.value}
              label={option.label}
              isSelected={option.value === value}
              onSelect={handleSelect}
            >
              {option.label}
            </OptionItem>
          ))}
        </div>
      )}
    </div>
  )
}
