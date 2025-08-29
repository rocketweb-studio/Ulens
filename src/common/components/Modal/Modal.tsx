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
        <div className={s.overlay}>
            <div className={s.content}>
                <h3 className={s.title}>{modalTitle}</h3>
                <button className={s.closeButton} onClick={onClose}>
                    <Image src={closeIcon} alt={'closeIcon'}/>
                </button>
                <div className={s.flexContainer}>
                    {children}
                    <Button className={s.button} onClick={onClose}>ОК</Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
