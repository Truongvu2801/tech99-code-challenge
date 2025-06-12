import { useCurrency } from '@/pages/SwapPage/hooks'
import { Select } from '@/components/Select'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { formatNumber } from './utils'

import styles from './SwapPage.module.scss'

const SwapPage = () => {
  const {
    // State
    fromAmount,
    toAmount,
    fromToken,
    toToken,
    isSwapping,
    isLoading,
    fromTokenOptions,
    toTokenOptions,
    amountError,
    error,
    handleSwapDirection,
    handleSubmit,
    handleTokenChange,
    handleAmountChange
  } = useCurrency()

  if (isLoading) {
    return <div className={styles.loading}>Loading tokens...</div>
  }
  if (error) {
    return <div className={styles.error}>{error.message}</div>
  }
  return (
    <div className={styles.swapContainer}>
      <h1>Swap Tokens</h1>
      <form onSubmit={handleSubmit} className={styles.swapForm}>
        <div className={styles.inputGroup}>
          <Select
            value={fromToken}
            onChange={value => handleTokenChange(value, true)}
            options={fromTokenOptions}
            placeholder="Select token"
            disabled={isLoading}
          />
          <div className={styles.inputWrapper}>
            <Input
              value={fromAmount}
              onChange={handleAmountChange}
              placeholder="0.0"
              className={styles.amountInput}
              error={amountError}
              type="text"
            />
          </div>
        </div>

        <div className={styles.swapButtonContainer}>
          <button
            type="button"
            onClick={handleSwapDirection}
            className={styles.swapButton}
            aria-label="Swap direction"
            disabled={!fromToken && !toToken}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 17.01V10H14V17.01H11L15 21L19 17.01H16ZM9 3L5 6.99H8V14H10V6.99H13L9 3Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className={styles.inputGroup}>
          <Select
            value={toToken}
            onChange={value => handleTokenChange(value, false)}
            options={toTokenOptions}
            placeholder="Select token"
            disabled={!fromToken || isLoading}
          />
          <div className={styles.inputWrapper}>
            <Input
              type="text"
              value={toAmount ? formatNumber(toAmount) : ''}
              onChange={() => {}}
              placeholder="0.0"
              className={styles.amountInput}
              disabled
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSwapping}
          className={styles.submitButton}
          disabled={!fromToken || !toToken || !fromAmount}
        >
          {isSwapping ? 'Swapping...' : 'Swap'}
        </Button>
      </form>
    </div>
  )
}

export default SwapPage
