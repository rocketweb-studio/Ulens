import React, { useEffect, useRef, useState } from 'react'
import s from '@/src/widgets/ViewPostModal/ui/Description/Description.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useUpdatePostMutation } from '@/src/entities/post/api/postsApi'
import { Button } from '@rocketweb-studio/ulens-ui-kit'
import { Modal } from '@/src/shared/ui/Modal/Modal'

type Props = {
  description: string
  editMode: boolean
  postId: string
  handleSetEditMode: () => void
}

export const Description = ({ description: initDesc, editMode, postId, handleSetEditMode }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpand, setNeedsExpand] = useState(false)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [updatePost] = useUpdatePostMutation()
  const [initDescription, setInitDescription] = useState(initDesc)
  const [description, setDescription] = useState(initDesc)
  const [showConfirmExit, setShowConfirmExit] = useState(false)

  const handleSave = async () => {
    setIsExpanded(false)
    if (description !== initDescription) {
      try {
        await updatePost({ postId, description }).unwrap()
        handleSetEditMode()
        setInitDescription(description)
      } catch (error) {
        toast.error('Update failed')
      }
    } else {
      handleSetEditMode()
    }
  }

  const handleCancel = () => {
    setIsExpanded(false)
    description !== initDescription ? setShowConfirmExit(true) : handleSetEditMode()
  }

  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current
      // Вычисляем приблизительное количество строк
      const lineHeight = parseInt(getComputedStyle(element).lineHeight) || 20
      const contentHeight = element.scrollHeight
      const approximateLines = Math.ceil(contentHeight / lineHeight)
      setNeedsExpand(approximateLines > 3)
    }
  }, [handleSave])

  return (
    <>
      <div className={s.postDescription}>
        {!editMode ?
          <div style={{ position: 'relative' }}>
            <motion.div
              initial={false}
              animate={{
                height:
                  needsExpand ?
                    isExpanded ? 'auto'
                    : '3.8em'
                  : '3.8em',
              }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              style={{ overflow: 'hidden', borderRadius: '4px', background: '#1e1e1e' }}
            >
              <p ref={contentRef} style={{ margin: 0 }}>
                {description}
              </p>
            </motion.div>

            {/* Кнопка с анимацией */}
            <AnimatePresence>
              {needsExpand && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 1 }}
                  exit={{ opacity: 1, y: 5 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={s.readMore}
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        : <>
            <div className={s.textareaWrapper}>
              <textarea
                id='description'
                ref={textareaRef}
                className={s.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={9}
              />
              <div className={s.areaNotes}>
                <span className={s.label}>Add publication descriptions</span>
                <span className={s.counter}>{description?.length ?? 0}/500</span>
              </div>
            </div>

            <div className={s.footer}>
              <Button onClick={handleCancel} className={s.cancel} variant={'darken'}>
                Cancel
              </Button>
              <Button onClick={handleSave} className={s.save} variant={'primary'}>
                Save Changes
              </Button>
            </div>
          </>
        }
      </div>
      <Modal
        isOpen={showConfirmExit}
        onClose={() => setShowConfirmExit(false)}
        modalTitle={'Unsaved changes'}
        hideDefaultButton
      >
        <p>Do you really want to finish editing? If you close the changes you have made will not be saved</p>
        <div className={s.footer}>
          <Button
            onClick={() => {
              setDescription(initDescription)
              setShowConfirmExit(false)
              handleSetEditMode()
            }}
            className={s.cancel}
            variant={'darken'}
          >
            Yes
          </Button>
          <Button className={s.save} onClick={() => setShowConfirmExit(false)} variant={'primary'}>
            No
          </Button>
        </div>
      </Modal>
    </>
  )
}
