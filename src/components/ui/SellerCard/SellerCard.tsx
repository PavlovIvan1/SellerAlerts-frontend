import styles from './SellerCard.module.css'

interface Props {
	title: string
	money: number
	earnings: number
	isPercentage?: boolean
}

export function SellerCard({title, money, earnings, isPercentage = false}: Props) {
	const formatValue = (value: number, isPercent: boolean) => {
		return isPercent ? `${value}%` : `${value} тыс`
	}

	const formatEarnings = (value: number, isPercent: boolean) => {
		const sign = value >= 0 ? '+' : ''
		return isPercent ? `${sign}${value}%` : `${sign}${value} тыс`
	}

	return (
		<div className={styles.SellerCard}>
			<div className={styles.top}>
				<span className={styles.title}>
					<p>{title}</p>
				</span>
				<span className={`${styles.earnings} ${earnings >= 0 ? styles.positive : styles.negative}`}>
					<p>{formatEarnings(earnings, isPercentage)}</p>
				</span>
			</div>
			<h1 className={styles.mainValue}>{formatValue(money, isPercentage)}</h1>
		</div>
	)
}
