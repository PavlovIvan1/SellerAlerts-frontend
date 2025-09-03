import { useEffect, useMemo, useState } from 'react'
import cardsByPerson from '../../../data/cardsByPerson.json'
import { SellerCard } from '../../ui/SellerCard/SellerCard'
import styles from './SellerCards.module.css'

interface Props {
  personId: string
}

type StatCategory = 'полная' | 'артикул' | 'категория'

export function SellerCards({ personId }: Props) {
	 const [activeCategory, setActiveCategory] = useState<StatCategory>('полная')
	 const [showAll, setShowAll] = useState(false)
	 const allCards = useMemo(() => (cardsByPerson as Record<string, any[]>)[personId] ?? [], [personId])

	 // Сбрасываем активную категорию и показ всех карт при смене человека
	 useEffect(() => {
		 setActiveCategory('полная')
		 setShowAll(false)
	 }, [personId])

	 if (!personId || allCards.length === 0) {
		 return (
			 <section className={styles.sellerSection}>
				 <div className={styles.container}>
					 <div className={styles.emptyState}>
						 <h2 className={styles.emptyTitle}>Нет данных</h2>
						 <p className={styles.emptyDescription}>
							 Добавьте компанию через токен доступа
						 </p>
					 </div>
				 </div>
			 </section>
		 )
	 }

	 // Показываем карточки для категории "полная"
	 const visibleCards = showAll ? allCards : allCards.slice(0, 4)

	 return (
		 <section className={styles.sellerSection}>
			 <div className={styles.container}>
				 <div className={styles.statisticsBlock}>
					 <div className={styles.header}>
						 <h2 className={styles.title}>Статистика</h2>
						 <div className={styles.categories}>
							 {(['полная', 'артикул', 'категория'] as const).map((category) => (
								 <button
									 key={category}
									 className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
									 onClick={() => setActiveCategory(category)}
								 >
									 {category}
								 </button>
							 ))}
						 </div>
					 </div>
					 
					 {activeCategory === 'полная' && (
						 <>
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
						 </>
					 )}
					 
					 {activeCategory !== 'полная' && (
						 <div className={styles.placeholderContent}>
							 <p>Содержимое для категории "{activeCategory}" будет добавлено позже</p>
						 </div>
					 )}
				 </div>
			 </div>
		 </section>
	 )
}
