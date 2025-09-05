import { useEffect, useMemo, useState } from 'react'
import cardsByPerson from '../../../data/cardsByPerson.json'
import categoriesByPerson from '../../../data/categoriesByPerson.json'
import productsByPerson from '../../../data/productsByPerson.json'
import { SellerCard } from '../../ui/SellerCard/SellerCard'
import styles from './SellerCards.module.css'

interface Props {
  personId: string
}

interface Product {
  id: string
  name: string
  orders: number
  ordersAmount: string
  drr: string
  ctr: string
  cpc: string
}

interface Category {
  id: string
  name: string
  orders: number
  ordersAmount: string
  drr: string
  ctr: string
  cpc: string
}

type StatCategory = 'полная' | 'артикул' | 'категория'

export function SellerCards({ personId }: Props) {
	 const [activeCategory, setActiveCategory] = useState<StatCategory>('полная')
	 const [showAll, setShowAll] = useState(false)
	 const allCards = useMemo(() => (cardsByPerson as Record<string, any[]>)[personId] ?? [], [personId])
	 const products = useMemo(() => (productsByPerson as Record<string, Product[]>)[personId] ?? [], [personId])
	 const categories = useMemo(() => (categoriesByPerson as Record<string, Category[]>)[personId] ?? [], [personId])

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
					 
					 {activeCategory === 'артикул' && (
						 <>  
							 {products.length > 0 ? (
								 <div className={styles.productsTable}>
									 <div className={styles.tableHeader}>
										 <div className={styles.headerCell}>Заказы</div>
										 <div className={styles.headerCell}>ДРР</div>
										 <div className={styles.headerCell}>CTR</div>
										 <div className={styles.headerCell}>CPC</div>
									 </div>
									 <div className={styles.tableBody}>
										 {products.map((product, index) => (
											 <div key={product.id} className={styles.tableRow}>
												 <div className={styles.productCell}>
													 <div className={styles.productName}>{index + 1}. {product.name}</div>
													 <div className={styles.productDataRow}>
														 <div className={styles.dataColumn}>{product.orders} ({product.ordersAmount})</div>
														 <div className={styles.dataColumn}>{product.drr}</div>
														 <div className={styles.dataColumn}>{product.ctr}</div>
														 <div className={styles.dataColumn}>{product.cpc}</div>
													 </div>
												 </div>
											 </div>
										 ))}
									 </div>
								 </div>
							 ) : (
								 <div className={styles.emptyProducts}>
									 <p>Данные по товарам отсутствуют</p>
								 </div>
							 )}
						 </>
					 )}
					 
					 {activeCategory === 'категория' && (
						 <>  
							 {categories.length > 0 ? (
								 <div className={styles.productsTable}>
									 <div className={styles.tableHeader}>
										 <div className={styles.headerCell}>Заказы</div>
										 <div className={styles.headerCell}>ДРР</div>
										 <div className={styles.headerCell}>CTR</div>
										 <div className={styles.headerCell}>CPC</div>
									 </div>
									 <div className={styles.tableBody}>
										 {categories.map((category, index) => (
											 <div key={category.id} className={styles.tableRow}>
												 <div className={styles.productCell}>
													 <div className={styles.productName}>{index + 1}. {category.name}</div>
													 <div className={styles.productDataRow}>
														 <div className={styles.dataColumn}>{category.orders} ({category.ordersAmount})</div>
														 <div className={styles.dataColumn}>{category.drr}</div>
														 <div className={styles.dataColumn}>{category.ctr}</div>
														 <div className={styles.dataColumn}>{category.cpc}</div>
													 </div>
												 </div>
											 </div>
										 ))}
									 </div>
								 </div>
							 ) : (
								 <div className={styles.emptyProducts}>
									 <p>Данные по категориям отсутствуют</p>
								 </div>
							 )}
						 </>
					 )}
				 </div>
			 </div>
		 </section>
	 )
}
