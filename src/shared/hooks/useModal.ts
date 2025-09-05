import { useState, useCallback } from 'react'

type Props = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useModal = (initialState = false): Props => {
  const [isOpen, setIsOpen] = useState(initialState)

  const openModal = useCallback(() => {
    if (!isOpen) setIsOpen(true)
  }, [isOpen])

  const closeModal = useCallback(() => {
    if (isOpen) setIsOpen(false)
  }, [isOpen])

  return {
    isOpen,
    openModal,
    closeModal,
  }
}
