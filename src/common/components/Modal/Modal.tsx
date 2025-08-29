import {ReactNode} from "react";
import s from './Modal.module.scss'
import closeIcon from "@/public/close.svg";
import Image from "next/image";
import {Button} from "@/src/common/components/Button/Button";

type Props = {
  open: boolean
  onClose?: () => void
  children: ReactNode
  modalTitle: string
}

export const Modal = ({ onClose, open, children, modalTitle }: Props) => {
  return (
    <>
      {open && (
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

        </div>
      )}
    </>
  )
}