import styles from './SellerCard.module.css'

interface Props {
	title: string
	money: number
	earnings: number
	isPercentage?: boolean
}

export function SellerCard({title, money, earnings, isPercentage = false}: Props) {
	const formatValue = (value: number, isPercent: boolean) => {
		return isPercent ? `${value}%` : `${value}к`
	}

	const formatEarnings = (value: number, isPercent: boolean) => {
		const sign = value >= 0 ? '+' : ''
		return isPercent ? `${sign}${value}%` : `${sign}${value}к`
	}

	return (
		<div className={styles.SellerCard}>
			<div className={styles.title}>
				<p>{title}</p>
			</div>
			<div className={styles.mainValue}>
				{formatValue(money, isPercentage)}
			</div>
			<div className={`${styles.earnings} ${earnings >= 0 ? styles.positive : styles.negative}`}>
				<p>{formatEarnings(earnings, isPercentage)}</p>
			</div>
		</div>
	)
}
