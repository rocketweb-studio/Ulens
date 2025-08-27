import React, { useEffect } from "react"
import {createPortal} from "react-dom"
import styles from "./Modal.module.scss"

export type Props = {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
};

export const Modal = ({
                   isOpen,
                   onClose,
                   children,
                   closeOnOverlayClick = true,
                   closeOnEsc = true
               }: Props) => {
    useEffect(() => {
        if (!isOpen || !closeOnEsc) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, closeOnEsc]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
J
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.modalOverlay} onClick={closeOnOverlayClick ? onClose : undefined}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                    ×
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};
