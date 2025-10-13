'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { useUploadAvatarMutation, useDeleteAvatarMutation } from '@/src/entities/userProfile/api/userProfileApi'
import { Button } from '@/src/shared/ui/Button/Button'
import { toast } from 'react-toastify'

import s from './UserAvatarUploader.module.scss'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { Modal } from '@/src/shared/ui/Modal/Modal'

interface Props {
  avatars?: {
    url: string
    width: number
    height: number
    fileSize: number
    size: string
    createdAt: string
  }[]
}

export const UserAvatarUploader = ({ avatars }: Props) => {
  const { data: me } = useGetMeQuery()
  const userId = me?.id ?? ''

  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation()
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation()

  const avatarUrl = avatars && avatars.length > 0 ? avatars[0].url : null
  const [preview, setPreview] = useState<string | null>(avatarUrl)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleSelect = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const isValidFormat = ['image/jpeg', 'image/png'].includes(selectedFile.type)
    const isValidSize = selectedFile.size <= 10 * 1024 * 1024 // 10MB

    if (!isValidFormat || !isValidSize) {
      toast.error('The photo must be less than 10 Mb and have JPEG or PNG format')
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setIsModalOpen(true)
  }

  const handleUpload = async () => {
    if (!file || !userId) return

    try {
      await uploadAvatar({ file, userId }).unwrap()
      toast.success('Photo uploaded successfully!')
      setIsModalOpen(false)
      setFile(null)
    } catch {
      toast.error('Upload failed')
    }
  }

  const handleDelete = async () => {
    if (!userId) return

    try {
      await deleteAvatar({ userId }).unwrap()
      setPreview(null)
      setFile(null)
      toast.success('Photo deleted')
      setIsDeleteModalOpen(false)
    } catch {
      toast.error('Delete failed')
    }
  }

  if (!me) return null

  return (
    <div className={s.avatarUploader}>
      <div className={s.previewContainer}>
        {preview ?
          <>
            <Image
              src={preview.startsWith('blob:') ? preview : `${process.env.NEXT_PUBLIC_BASE_URL}${preview}`}
              alt='Avatar preview'
              width={192}
              height={192}
              className={s.avatar}
            />
            <button
              type='button'
              onClick={() => setIsDeleteModalOpen(true)}
              className={s.deleteBtn}
              disabled={isDeleting}
            >
              ×
            </button>
          </>
        : <div className={s.placeholder}>No photo</div>}
      </div>

      <input ref={fileInputRef} type='file' accept='image/jpeg,image/png' hidden onChange={handleFileChange} />

      <div className={s.buttons}>
        <Button type='button' onClick={handleSelect} disabled={isUploading} className={s.selectButton}>
          Select from Computer
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle='Add a Profile Photo'
        className={s.photoModal}
        hideDefaultButton
      >
        <div className={s.modalContent}>
          {preview && (
            <div className={s.imageWrapper}>
              <Image src={preview} alt='Avatar preview' width={300} height={300} className={s.roundImage} />
            </div>
          )}

          <div className={s.modalActions}>
            {file && (
              <Button type='button' onClick={handleUpload} disabled={isUploading}>
                Save
              </Button>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        modalTitle='Delete Photo'
        hideDefaultButton
      >
        <p className={s.deleteText}>Are you sure you want to delete the photo?</p>

        <div className={s.modalButtons}>
          <button type='button' className={s.yesBtn} onClick={handleDelete} disabled={isDeleting}>
            Yes
          </button>
          <button type='button' className={s.noBtn} onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
            No
          </button>
        </div>
      </Modal>
    </div>
  )
}
