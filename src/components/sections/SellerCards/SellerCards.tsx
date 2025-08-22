import { useEffect, useMemo, useState } from 'react'
import cardsByPerson from '../../../data/cardsByPerson.json'
import { SellerCard } from '../../ui/SellerCard/SellerCard'
import styles from './SellerCards.module.css'

interface Props {
  personId: string
}

export function SellerCards({ personId }: Props) {
	const [showAll, setShowAll] = useState(false)
	const allCards = useMemo(() => (cardsByPerson as Record<string, any[]>)[personId] ?? [], [personId])
	const visibleCards = showAll ? allCards : allCards.slice(0, 4)

	// Сбрасываем состояние showAll при смене человека
	useEffect(() => {
		setShowAll(false)
	}, [personId])

	return (
		<section className={styles.sellerSection}>
			<div className={styles.container}>
				<div className={styles.cardsGrid}>
					{visibleCards.map((card) => (
						<SellerCard
							key={`${personId}-${card.id}`}
							title={card.title}
							money={card.money}
							earnings={card.earnings}
							isPercentage={card.isPercentage}
						/>
					))}
				</div>
				{allCards.length > 4 && (
					<div className={styles.showMoreContainer}>
						<button
							className={styles.showMoreButton}
							onClick={() => setShowAll(!showAll)}
						>
							{showAll ? 'Скрыть' : 'Показать еще'}
						</button>
					</div>
				)}
			</div>
		</section>
	)
}
