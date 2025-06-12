import React from 'react'
import styles from './SelectItem.module.scss'

interface OptionItemProps {
  children: React.ReactNode
  value: string
  isSelected?: boolean
  onSelect: (value: string) => void
  label?: string
}

export const OptionItem: React.FC<OptionItemProps> = ({
  children,
  value,
  isSelected = false,
  onSelect,
  label = ''
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.src = '/vite.svg'
  }

  return (
    <div
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(value)}
      role="option"
      aria-selected={isSelected}
    >
      <div className={styles.optionContent}>
        <img
          src={`/tokens-icon/${value}.svg`}
          alt={label}
          className={styles.tokenIcon}
          onError={handleImageError}
        />
        <span className={styles.optionText}>{children}</span>
      </div>
    </div>
  )
}
