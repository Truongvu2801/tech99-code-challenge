import React from 'react'
import styles from './Input.module.scss'

type InputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number'
  error?: string
  className?: string
  disabled?: boolean
  inputMode?:
    | 'text'
    | 'search'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
}

const Input = ({
  value,
  onChange,
  placeholder = '',
  type,
  error = '',
  className = '',
  disabled = false,
  inputMode = 'text'
}: InputProps) => {
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.error : ''}`}
        disabled={disabled}
        inputMode={inputMode}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  )
}

export default Input
