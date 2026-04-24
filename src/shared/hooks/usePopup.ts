import { useEffect, useRef, useState } from 'react'

export const usePopup = () => {
  const [showPopup, setShowPopup] = useState(false)

  const refPopup = useRef<HTMLDivElement>(null)

  const togglePopup = (toggle: boolean) => {
    setShowPopup(toggle)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (refPopup.current && !refPopup.current.contains(event.target as Node)) {
      setTimeout(() => setShowPopup(false), 0)
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside)
    return () => {
      document.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  return { refPopup, showPopup, togglePopup }
}
