import styles from './Profile.module.css'

interface ProfileProps {
	onBack: () => void
}

export function Profile({ onBack }: ProfileProps) {
	return (
		<div className={styles.profilePage}>
			<div className={styles.profileContent}>
				<div className={styles.userSection}>
					<h2 className={styles.sectionTitle}>О пользователе</h2>
					
					<div className={styles.infoField}>
						<span className={styles.fieldLabel}>ФИО</span>
						<span className={styles.fieldValue}>Васильев Дмитрий Александрович</span>
					</div>
					
					<div className={styles.infoField}>
						<span className={styles.fieldLabel}>Дата рождения</span>
						<span className={styles.fieldValue}>02.01.1993</span>
					</div>
				</div>
			</div>
		</div>
	)
}