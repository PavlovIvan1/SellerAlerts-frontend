import { useEffect, useMemo, useState } from 'react'
import cardsByPerson from '../../../data/cardsByPerson.json'
import categoriesByPerson from '../../../data/categoriesByPerson.json'
import productsByPerson from '../../../data/productsByPerson.json'
import { SellerCard } from '../../ui/SellerCard/SellerCard'
import styles from './SellerCards.module.css'

// Функция для форматирования суммы с сокращением "к" для тысяч
function formatOrdersAmount(amount: string): { mainValue: string; suffix: string } {
	// Удаляем пробелы, запятые и валютный символ для обработки
	const cleanAmount = amount.replace(/[\s,₽]/g, '')
	const numericValue = parseInt(cleanAmount)
	
	if (numericValue >= 1000) {
		const thousands = Math.floor(numericValue / 1000)
		const remainder = numericValue % 1000
		
		if (remainder === 0) {
			return { mainValue: thousands.toString(), suffix: 'к' }
		} else {
			// Если есть остаток, показываем с десятичной частью
			const formattedValue = (numericValue / 1000).toFixed(1)
			return { mainValue: formattedValue, suffix: 'к' }
		}
	} else {
		return { mainValue: numericValue.toString(), suffix: ' ₽' }
	}
}

// Функция для форматирования значений с символами (%, ₽)
function formatValueWithSymbol(value: string): { mainValue: string; suffix: string } {
	if (value.includes('%')) {
		const numericPart = value.replace('%', '')
		return { mainValue: numericPart, suffix: '%' }
	} else if (value.includes('₽')) {
		const numericPart = value.replace(/[\s₽]/g, '')
		return { mainValue: numericPart, suffix: ' ₽' }
	} else {
		return { mainValue: value, suffix: '' }
	}
}

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
														 <div className={styles.dataColumn}>
															 {(() => {
																 const formatted = formatOrdersAmount(product.ordersAmount)
																 return (
																	 <>
																		 <span className={styles.mainValue}>{formatted.mainValue}</span>
																		 <span className={styles.suffixValue}>{formatted.suffix}</span>
																	 </>
																 )
															 })()}
														 </div>
														 <div className={styles.dataColumn}>
														  {(() => {
														 	 const formatted = formatValueWithSymbol(product.drr)
														 	 return (
														 		 <>
														 			 <span className={styles.mainValue}>{formatted.mainValue}</span>
														 			 <span className={styles.suffixValue}>{formatted.suffix}</span>
														 		 </>
														 	 )
														  })()}
														 </div>
														 <div className={styles.dataColumn}>
														  {(() => {
														 	 const formatted = formatValueWithSymbol(product.ctr)
														 	 return (
														 		 <>
														 			 <span className={styles.mainValue}>{formatted.mainValue}</span>
														 			 <span className={styles.suffixValue}>{formatted.suffix}</span>
														 		 </>
														 	 )
														  })()}
														 </div>
														 <div className={styles.dataColumn}>
														  {(() => {
														 	 const formatted = formatValueWithSymbol(product.cpc)
														 	 return (
														 		 <>
														 			 <span className={styles.mainValue}>{formatted.mainValue}</span>
														 			 <span className={styles.suffixValue}>{formatted.suffix}</span>
														 		 </>
														 	 )
														  })()}
														 </div>
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
														 <div className={styles.dataColumn}>
													 {(() => {
														 const formatted = formatOrdersAmount(category.ordersAmount)
														 return (
															 <>
																 <span className={styles.mainValue}>{formatted.mainValue}</span>
																 <span className={styles.suffixValue}>{formatted.suffix}</span>
															 </>
														 )
													 })()}
												 </div>
														 <div className={styles.dataColumn}>
															 {(() => {
																 const formatted = formatValueWithSymbol(category.drr)
																 return (
																	 <>
																		 <span className={styles.mainValue}>{formatted.mainValue}</span>
																		 <span className={styles.suffixValue}>{formatted.suffix}</span>
																	 </>
																 )
															 })()}
														 </div>
														 <div className={styles.dataColumn}>
															 {(() => {
																 const formatted = formatValueWithSymbol(category.ctr)
																 return (
																	 <>
																		 <span className={styles.mainValue}>{formatted.mainValue}</span>
																		 <span className={styles.suffixValue}>{formatted.suffix}</span>
																	 </>
																 )
															 })()}
														 </div>
														 <div className={styles.dataColumn}>
															 {(() => {
																 const formatted = formatValueWithSymbol(category.cpc)
																 return (
																	 <>
																		 <span className={styles.mainValue}>{formatted.mainValue}</span>
																		 <span className={styles.suffixValue}>{formatted.suffix}</span>
																	 </>
																 )
															 })()}
														 </div>
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
