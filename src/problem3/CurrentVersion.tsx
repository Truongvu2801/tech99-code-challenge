interface WalletBalance {
  currency: string
  amount: number
}
interface FormattedWalletBalance {
  currency: string
  amount: number
  formatted: string
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  //removed unused children prop destructuring
  const { children, ...rest } = props
  const balances = useWalletBalances()
  const prices = usePrices()

  const getPriority = (blockchain: any): number => {
    // should use Enum for better type safety, readability, and maintainability.
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  // The current filter uses an undefined variable (lhsPriority), which can cause runtime errors and incorrect filtering
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain) // Missing type on blockchain, balancePriority not used
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true
          }
        }
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        if (leftPriority > rightPriority) {
          // The sort comparator does not handle the case when priorities are equal, can cause unpredictable sorting.
          return -1
        } else if (rightPriority > leftPriority) {
          return 1
        }
      })
  }, [balances, prices]) // Including prices in the dependency array causes sortedBalances to recompute whenever prices changes, even though prices is not used in the calculation. This can lead to unnecessary renders and reduced performance.

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // use useMemo to memoize the result of the map operation
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount // prices can be undefined
      return (
        <WalletRow
          className={classes.row}
          key={index} // avoid use index for key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    }
  )

  return <div {...rest}>{rows}</div>
}
