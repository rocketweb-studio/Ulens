import React, { useEffect, useRef, useState } from 'react'
import s from '@/src/widgets/ViewPostModal/ui/Description/Description.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useUpdatePostMutation } from '@/src/entities/post/api/postsApi'

type Props = {
  description: string
  editMode: boolean
  postId: string
}

export const Description = ({ description: initDesc, editMode, postId }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpand, setNeedsExpand] = useState(false)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [updatePost, { isLoading }] = useUpdatePostMutation()
  // const { refetch } = useGetPostByIdQuery({ postId })
  const [description, setDescription] = useState(initDesc ?? '')

  const handleSave = async () => {
    try {
      await updatePost({ postId, description }).unwrap()
      //await refetch()
      //onUpdated?.(description) + setDescription(description)
      //onClose()
    } catch (error) {
      console.error('Update failed', error)
      toast.error('Update failed')
    }
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
  }, [needsExpand])

  return (
    <div className={s.postDescription}>
      {!editMode ?
        <div style={{ position: 'relative' }}>
          <motion.div
            initial={false}
            animate={{
              height:
                needsExpand ?
                  isExpanded ? 'auto'
                  : '3.6em'
                : '3.6em',
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden', borderRadius: '4px', background: '#232323' }}
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
          <label className={s.label}>Add publication descriptions</label>
          <div className={s.textareaWrapper}>
            <textarea
              id='description'
              ref={textareaRef}
              className={s.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={10}
            />
            <span className={s.counter}>{description?.length ?? 0}/500</span>
          </div>
          <div className={s.footer}>
            <button disabled={isLoading} className={s.saveButton} onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </>
      }
    </div>
  )
}
