interface WalletBalance {
  currency: string
  amount: number
  blockchain: Blockchain
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string
}

// Declare enum for better type safety, readability, and maintainability.
enum Blockchain {
  Osmosis = 'Osmosis',
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Zilliqa = 'Zilliqa',
  Neo = 'Neo'
}

// priorityMap is a Record of Blockchain to number
const priorityMap: Record<Blockchain, number> = {
  [Blockchain.Osmosis]: 100,
  [Blockchain.Ethereum]: 50,
  [Blockchain.Arbitrum]: 30,
  [Blockchain.Zilliqa]: 20,
  [Blockchain.Neo]: 20
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = ({ ...rest }) => {
  // destructure props to extract rest instead of spreading all props improving clarity and safety
  const balances = useWalletBalances()
  const prices = usePrices()

  // This is more robust and type-safe than using plain objects or switch statements. It also makes it easy to update priorities or add new blockchains.
  const getPriority = (blockchain: Blockchain): number => {
    return priorityMap[blockchain] ?? -99
  }

  const sortedBalances = useMemo<WalletBalance[]>(
    () =>
      balances
        .filter(
          (balance: WalletBalance) =>
            getPriority(balance.blockchain) > -99 && balance.amount > 0
        )
        .sort((a, b) => getPriority(a.blockchain) - getPriority(b.blockchain)),
    [balances]
  )

  const formattedBalances = useMemo<FormattedWalletBalance[]>(
    () =>
      sortedBalances.map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed()
      })),
    [sortedBalances]
  )
  // Mapping over sortedBalances and passing a formattedAmount property that does not exist on those objects can lead to undefined values and incorrect UI rendering. Using formattedBalances ensures that each row receives the properly formatted amount, improving correctness and maintainability
  const rows = formattedBalances.map((balance, index) => {
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount //  Adding a fallback ensures the UI remains stable and prevents unexpected behavior if price data is missing.
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency} // use currency as key, Using the array index as a key can cause rendering bugs and performance issues when the list changes, as React may not properly track item identity. Using a unique property ensures stable and predictable rendering.
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return <div {...rest}>{rows}</div>
}

export default WalletPage
