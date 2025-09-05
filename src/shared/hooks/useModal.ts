import { useState, useCallback } from "react";

type Props = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModal = (initialState = false): Props => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
