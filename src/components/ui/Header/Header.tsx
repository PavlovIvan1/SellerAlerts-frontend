import styles from './Header.module.css'

export function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.logo}>
					<h1>Seller Alerts</h1>
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
