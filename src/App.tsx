import { useEffect, useRef, useState } from 'react'
import { CompanyInfo } from './components/sections/CompanyInfo/CompanyInfo'
import { SellerCards } from './components/sections/SellerCards/SellerCards'
import { Header } from './components/ui/Header/Header'
import { Tabs } from './components/ui/Tabs/Tabs'
import peopleData from './data/people.json'
import './styles/global.css'

export function App() {
  const [personId, setPersonId] = useState('ivanov')
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayPersonId, setDisplayPersonId] = useState('ivanov')
  const appRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const people = peopleData

  const getCurrentPersonIndex = () => {
    return people.findIndex(person => person.id === personId)
  }

  const goToNextPerson = () => {
    if (isTransitioning) return
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
    if (isTransitioning) return
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
    if (isTransitioning) return
    setPersonId(newPersonId)
    setDisplayPersonId(newPersonId)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isModalOpen) return
    setIsDragging(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isTransitioning || isModalOpen) return
    
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
    if (isModalOpen) return
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning || isModalOpen) return
    
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
      if (isModalOpen) return
      
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
  }, [personId, isTransitioning, isModalOpen])

  return (
    <>
      <div 
        className='AppProvider'
        ref={appRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        <Header />
        <Tabs selectedId={personId} onSelect={handlePersonSelect} onModalStateChange={setIsModalOpen} />
        <div className={`seller-cards-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
          <SellerCards personId={displayPersonId} />
        </div>
        <div className={`company-info-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
          <CompanyInfo personId={displayPersonId} />
        </div>
      </div>
    </>
  )
}