import { useEffect, useRef, useState } from 'react'
import { Profile } from './components/sections/Profile/Profile'
import { SellerCards } from './components/sections/SellerCards/SellerCards'
import { Services } from './components/sections/Services/Services'
import { Header } from './components/ui/Header/Header'
import { Tabs } from './components/ui/Tabs/Tabs'
import './styles/global.css'

interface Person {
  id: string
  name: string
  status: string
  balance: string
  autoRenewal: boolean
}

export function App() {
  const [people, setPeople] = useState<Person[]>([])
  const [personId, setPersonId] = useState('')
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayPersonId, setDisplayPersonId] = useState('')
  const appRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleProfileClick = () => {
    setIsProfileOpen(true)
  }

  const handleProfileBack = () => {
    setIsProfileOpen(false)
  }

  const handleAddPerson = (person: Person) => {
    // Check if person already exists
    if (!people.find(p => p.id === person.id)) {
      setPeople(prev => [...prev, person])
      // If no person is selected yet, select this one
      if (!personId) {
        setPersonId(person.id)
        setDisplayPersonId(person.id)
      }
    }
  }

  const getCurrentPersonIndex = () => {
    return people.findIndex(person => person.id === personId)
  }

  const goToNextPerson = () => {
    if (isTransitioning || people.length === 0) return
    const currentIndex = getCurrentPersonIndex()
    if (currentIndex < people.length - 1) {
      setIsTransitioning(true)
      setSlideDirection('left')
      setTimeout(() => {
        setPersonId(people[currentIndex + 1].id)
        setDisplayPersonId(people[currentIndex + 1].id)
        setSlideDirection(null)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const goToPreviousPerson = () => {
    if (isTransitioning || people.length === 0) return
    const currentIndex = getCurrentPersonIndex()
    if (currentIndex > 0) {
      setIsTransitioning(true)
      setSlideDirection('right')
      setTimeout(() => {
        setPersonId(people[currentIndex - 1].id)
        setDisplayPersonId(people[currentIndex - 1].id)
        setSlideDirection(null)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handlePersonSelect = (newPersonId: string) => {
    if (isTransitioning || people.length === 0) return
    setPersonId(newPersonId)
    setDisplayPersonId(newPersonId)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isModalOpen || isProfileOpen) return
    setIsDragging(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isTransitioning || isModalOpen || isProfileOpen) return
    
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        goToPreviousPerson()
      } else {
        goToNextPerson()
      }
      setIsDragging(false)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isModalOpen || isProfileOpen) return
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning || isModalOpen || isProfileOpen) return
    
    const deltaX = e.touches[0].clientX - startX
    const deltaY = e.touches[0].clientY - startY
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        goToPreviousPerson()
      } else {
        goToNextPerson()
      }
      setIsDragging(false)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen || isProfileOpen) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPreviousPerson()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextPerson()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [personId, isTransitioning, isModalOpen, isProfileOpen])

  return (
    <>
      <div 
        className='AppProvider'
        ref={appRef}
        onMouseDown={!isProfileOpen ? handleMouseDown : undefined}
        onMouseMove={!isProfileOpen ? handleMouseMove : undefined}
        onMouseUp={!isProfileOpen ? handleMouseUp : undefined}
        onMouseLeave={!isProfileOpen ? handleMouseLeave : undefined}
        onTouchStart={!isProfileOpen ? handleTouchStart : undefined}
        onTouchMove={!isProfileOpen ? handleTouchMove : undefined}
        onTouchEnd={!isProfileOpen ? handleTouchEnd : undefined}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        <div className="headerTabsBlock">
          <Header 
            onProfileClick={handleProfileClick}
            isProfileActive={isProfileOpen}
          />
          {isProfileOpen ? (
            <div className="profileHeaderSection">
              <button className="profileBackButton" onClick={handleProfileBack}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
              <h1 className="profileTitle">Профиль</h1>
            </div>
          ) : (
            <Tabs 
              selectedId={personId} 
              onSelect={handlePersonSelect} 
              onModalStateChange={setIsModalOpen}
              people={people}
              onAddPerson={handleAddPerson}
            />
          )}
        </div>
        {isProfileOpen ? (
          <Profile />
        ) : (
          people.length > 0 && (
            <>
              <div className={`seller-cards-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
                <SellerCards personId={displayPersonId} />
              </div>
              <div className={`services-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
                <Services personId={displayPersonId} />
              </div>
              {/* <div className={`company-info-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
                <CompanyInfo personId={displayPersonId} />
              </div> */}
            </>
          )
        )}
      </div>
    </>
  )
}