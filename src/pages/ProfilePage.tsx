import { Header } from '@/components/ui/Header/Header'
import accountData from '@data/account.json'
import { useNavigate } from '@tanstack/react-router'
import styles from './ProfilePage.module.css'

export function Profile() {

	const navigate = useNavigate()
	
	return (
		<>
			<div className={styles.profilePage}>
				<div className={styles.headerBlock}>
						<Header />
						<div className={styles.profileHeaderSection}>
							<button
								className={styles.profileBackButton}
								onClick={() => navigate({ to: '/' })}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<polyline points="15,18 9,12 15,6"></polyline>
								</svg>
							</button>
							<h1 className={styles.profileTitle}>Профиль</h1>
						</div>
				</div>

				<div className={styles.profileContent}>
					<div className={styles.userSection}>
						<h2 className={styles.sectionTitle}>О пользователе</h2>
						
						<div className={styles.infoField}>
							<span className={styles.fieldLabel}>ФИО</span>
							<span className={styles.fieldValue}>{accountData.user.fullName}</span>
						</div>
						
						<div className={styles.infoField}>
							<span className={styles.fieldLabel}>Дата рождения</span>
							<span className={styles.fieldValue}>{accountData.user.dateOfBirth}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}