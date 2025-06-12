import React from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'text'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: ButtonVariant
  isLoading?: boolean
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick = () => {},
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    isLoading ? styles.loading : '',
    className
  ].join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? <span className={styles.loader}></span> : children}
    </button>
  )
}

export default Button
