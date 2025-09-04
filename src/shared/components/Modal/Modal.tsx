import React, {useEffect} from "react"
import {createPortal} from "react-dom"
import s from "./Modal.module.scss"
import Image from "next/image";
import closeIcon from "@/public/close.svg"
import {Button} from "@/src/shared/components/Button/Button";

export type Props = {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
    modalTitle: string
};

export const Modal = ({
                          isOpen,
                          onClose,
                          children,
                          modalTitle,
                          // closeOnOverlayClick = true,
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
