import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TOKEN_API_URL } from '../constants'
import type { SelectOption } from '@/components/Select'

export interface Token {
  currency: string
  price: number
  date: string
}

interface UseCurrencyReturn {
  // State
  fromAmount: string
  toAmount: string
  fromToken: string
  toToken: string
  isSwapping: boolean
  errorMessage: string
  amountError: string
  tokens: Token[]
  isLoading: boolean
  error: Error | null
  // Computed values
  availableToTokens: Token[]
  availableFromTokens: Token[]
  fromTokenOptions: SelectOption[]
  toTokenOptions: SelectOption[]

  // Actions
  setFromAmount: (value: string) => void
  setToAmount: (value: string) => void
  handleSwapDirection: () => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  validateAmount: (value: string) => void
  handleTokenChange: (value: string, isFrom: boolean) => void
  handleAmountChange: (value: string) => void
}

const fetchTokenPrices = async (): Promise<Token[]> => {
  const response = await fetch(TOKEN_API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch token prices')
  }
  return response.json()
}

export const useCurrency = (): UseCurrencyReturn => {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [amountError, setAmountError] = useState('')

  const {
    data: tokens = [],
    isLoading,
    error
  } = useQuery<Token[]>({
    queryKey: ['tokenPrices'],
    queryFn: fetchTokenPrices,
    select: (data: Token[]) =>
      data
        .filter((token: Token) => token.price && token.currency)
        .sort((a: Token, b: Token) => a.currency.localeCompare(b.currency))
  })

  const availableToTokens = tokens.filter(
    (token: Token) => token.currency !== fromToken
  )
  const availableFromTokens = tokens.filter(
    (token: Token) => token.currency !== toToken
  )

  const getTokenByCurrency = useCallback(
    (currency: string): Token | undefined => {
      return tokens.find((token: Token) => token.currency === currency)
    },
    [tokens]
  )

  const convertCurrency = useCallback(
    (amount: string, fromCurrency: string, toCurrency: string): string => {
      if (!amount || !fromCurrency || !toCurrency) return ''

      const fromToken = getTokenByCurrency(fromCurrency)
      const toToken = getTokenByCurrency(toCurrency)

      if (!fromToken || !toToken) return ''

      const amountNum = parseFloat(amount)
      if (isNaN(amountNum)) return ''

      const result = (amountNum * fromToken.price) / toToken.price
      return result.toString()
    },
    [getTokenByCurrency]
  )

  const handleSwapDirection = useCallback(() => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)

    if (fromAmount && toAmount) {
      const tempAmount = fromAmount
      setFromAmount(toAmount)
      setToAmount(tempAmount)
    }
  }, [fromToken, toToken, fromAmount, toAmount])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrorMessage('')

      if (!fromToken || !toToken) {
        setErrorMessage('Please select both tokens')
        return
      }

      if (!fromAmount) {
        setErrorMessage('Please enter an amount')
        return
      }

      setIsSwapping(true)

      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const converted = convertCurrency(fromAmount, fromToken, toToken)
        if (converted) {
          setToAmount(converted)
        }
      } catch (err) {
        setErrorMessage('Failed to process swap')
        console.error('Swap error:', err)
      } finally {
        setIsSwapping(false)
      }
    },
    [fromAmount, fromToken, toToken, convertCurrency]
  )

  const validateAmount = useCallback((value: string) => {
    if (value && isNaN(Number(value))) {
      setAmountError('Please enter a valid number')
      return false
    }
    if (value && Number(value) <= 0) {
      setAmountError('Amount must be greater than 0')
      return false
    }
    setAmountError('')
    return true
  }, [])

  const formatTokenOptions = (
    tokens: Array<{ currency: string; price: number }>
  ): SelectOption[] => {
    const uniqueTokens = new Map<string, { currency: string; price: number }>()

    tokens.forEach(token => {
      if (!uniqueTokens.has(token.currency)) {
        uniqueTokens.set(token.currency, token)
      }
    })

    return Array.from(uniqueTokens.values()).map(token => ({
      value: token.currency,
      label: token.currency
    }))
  }

  const fromTokenOptions = formatTokenOptions(availableFromTokens)
  const toTokenOptions = formatTokenOptions(availableToTokens)

  const handleTokenChange = useCallback(
    (value: string, isFrom: boolean): void => {
      if (isFrom) {
        setFromToken(value)
        if (value === toToken) {
          setToToken('')
        }
      } else {
        setToToken(value)
        if (value === fromToken) {
          setFromToken('')
        }
      }
    },
    [fromToken, toToken]
  )
  const handleAmountChange = useCallback(
    (value: string) => {
      setFromAmount(value)
      validateAmount(value)
    },
    [validateAmount]
  )

  return {
    // State
    fromAmount,
    toAmount,
    fromToken,
    toToken,
    isSwapping,
    errorMessage,
    amountError,
    tokens,
    isLoading,
    error,
    availableToTokens,
    availableFromTokens,
    fromTokenOptions,
    toTokenOptions,
    // Actions
    setFromAmount,
    setToAmount,
    handleSwapDirection,
    handleSubmit,
    validateAmount,
    handleTokenChange,
    handleAmountChange
  }
}
