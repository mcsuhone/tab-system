interface BalanceTextProps {
  balance: number
}

const getBalanceEmoji = (balance: number) => {
  if (balance <= -500) return '🤬' // Extremely angry
  if (balance <= -200) return '😡' // Very angry
  if (balance <= -100) return '😠' // Angry
  if (balance <= -50) return '😤' // Frustrated
  if (balance < 0) return '😒' // Annoyed
  if (balance === 0) return '😐' // Neutral
  if (balance < 50) return '🙂' // Just positive
  if (balance < 100) return '😊' // Slightly positive
  if (balance < 200) return '🤗' // Positive
  if (balance < 500) return '🤑' // Quite positive
  return '👑🔥💰' // Very positive - King with fire and money
}

export const BalanceText = ({ balance }: BalanceTextProps) => {
  const emoji = getBalanceEmoji(balance)

  return (
    <p className="text-1xl font-bold tabular-nums flex items-center gap-2">
      <span>{emoji}</span>
      {balance.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}
      €
    </p>
  )
}
