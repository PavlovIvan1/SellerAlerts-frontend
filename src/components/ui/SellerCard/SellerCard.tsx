import styles from './SellerCard.module.css'

interface Props {
	title: string
	money: number
	earnings: number
	isPercentage?: boolean
}

export function SellerCard({title, money, earnings, isPercentage = false}: Props) {
	const formatValue = (value: number, isPercent: boolean) => {
		if (isPercent) {
			return { mainValue: value.toString(), suffix: '%' }
		} else {
			return { mainValue: value.toString(), suffix: 'к' }
		}
	}

	const formatEarnings = (value: number, isPercent: boolean) => {
		const sign = value >= 0 ? '+' : ''
		if (isPercent) {
			return { mainValue: `${sign}${value}`, suffix: '%' }
		} else {
			return { mainValue: `${sign}${value}`, suffix: 'к' }
		}
	}

	const mainValueFormatted = formatValue(money, isPercentage)
	const earningsFormatted = formatEarnings(earnings, isPercentage)

	return (
		<div className={styles.SellerCard}>
			<div className={styles.title}>
				<p>{title}</p>
			</div>
			<div className={styles.mainValue}>
				<span className={styles.valueNumber}>{mainValueFormatted.mainValue}</span>
				<span className={styles.valueSuffix}>{mainValueFormatted.suffix}</span>
			</div>
			<div className={`${styles.earnings} ${earnings >= 0 ? styles.positive : styles.negative}`}>
				<p>
					<span className={styles.earningsNumber}>{earningsFormatted.mainValue}</span>
					<span className={styles.earningsSuffix}>{earningsFormatted.suffix}</span>
				</p>
			</div>
		</div>
	)
}
