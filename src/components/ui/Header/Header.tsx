import styles from './Header.module.css'

interface HeaderProps {
	currentPersonName?: string
}

export function Header({ currentPersonName }: HeaderProps) {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.logo}>
					<div className={styles.appTitle}>
						seller<span className={styles.colon}>:</span>alert
					</div>
					{currentPersonName && (
						<div className={styles.greeting}>Привет, {currentPersonName}!</div>
					)}
				</div>
				
				<div className={styles.userSection}>
					<span className={styles.userName}>Ivan</span>
					<button className={styles.settingsButton}>
						<div className={styles.hamburger}>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>
				</div>
			</div>
		</header>
	)
}
