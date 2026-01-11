'use client'

import s from './sentMessage.module.scss'
import {
  Button,
  IconClose,
  IconImageOutline,
  IconMicOutline,
  IconPlusCircleOutline,
  Input,
} from '@rocketweb-studio/ulens-ui-kit'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageInput, messageSchema } from '@/src/features/messenger/sentMessage/model/schemas'
import { useDropzone } from 'react-dropzone'
import { FILES_VALIDATE } from '@/src/features/post/postCreate/model/consts'
import { base64ToFile, fileToBase64, getImageDimensions } from '@/src/features/post/postCreate/utils'
import React, { useState } from 'react'
import { UploadedFileInMessage } from '@/src/entities/messenger/api/messengerApi.type'

import Image from 'next/image'
import { useUploadMessageImagesMutation } from '@/src/entities/messenger'
import { io } from 'socket.io-client'
 // import { VoiceRecorder } from '@/src/entities/message/ui/voiceMessage/VoiceRecorder'
import dynamic from 'next/dynamic';
//import { testSOCKET } from '@/src/entities/message/ui/voiceMessage/VoiceRecorder'

// ✅ ВАЖНО: ssr: false
const VoiceRecorder = dynamic(
  () =>
    import('@/src/entities/message/ui/voiceMessage/VoiceRecorder')
      .then((m) => m.VoiceRecorder),
  { ssr: false }
);
type Props = {
  roomId: number | null
  isDisable: boolean
}

export const SendMessage = ({ roomId, isDisable = false }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<MessageInput>({
    mode: 'onChange',
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  })

  const [uploadImages] = useUploadMessageImagesMutation()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInMessage[]>([])
  const [startVoiceRecorder, setStartVoiceRecorder] = useState<boolean>(false) // ← ИЗМЕНЕНО

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: FILES_VALIDATE.accept,
    maxFiles: FILES_VALIDATE.maxFiles,
    maxSize: FILES_VALIDATE.maxSize,
  })

  async function onDrop(acceptedFiles: File[], {/* rejectedFiles: any[]*/ }) {
    const newFiles = await Promise.all(
      acceptedFiles.slice(0, 10 - uploadedFiles.length).map(async (file) => {
        const base64String = await fileToBase64(file)
        const { width, height } = await getImageDimensions(base64String)
        return {
          id: `${file.name}-${Date.now()}`,
          file: base64String,
          originalPreview: base64String,
          preview: base64String,
          width,
          height,
          zoom: 1,
        }
      }),
    )
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const handleDeleteImage = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id))
  }

  const onSubmit: SubmitHandler<MessageInput> = async (data) => {
    try {
      if (!roomId) return

      const token = localStorage.getItem('accessToken')
      const socket = io('https://ulens.org/ws', { auth: { token } })
      let res
      if (uploadedFiles.length > 0) {
        const imageFiles = await Promise.all(
          uploadedFiles.map(async (item) => {
            return await base64ToFile(item.file, `image-${Date.now()}.jpg`)
          }),
        )
        res = await uploadImages({
          roomId,
          images: imageFiles,
        }).unwrap()
      }
      socket.emit('SEND_MESSAGE', {
        roomId,
        content: data.message,
        media: res ? res.files : null,
      })

      reset()
      setUploadedFiles([])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const isFormValid = () => {
    // @ts-ignore
    const hasMessage = watch('message')?.length > 0
    const hasMedia = uploadedFiles.length > 0
    return hasMessage || hasMedia
  }

  // Добавляем обработчик Escape для закрытия рекордера
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && startVoiceRecorder) {
        setStartVoiceRecorder(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [startVoiceRecorder])

  return (
    <div className={s.sendMessageContainer}>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        {uploadedFiles.length > 0 && (
          <div className={s.previewImageWrap}>
            {uploadedFiles.map((file) => (
              <div key={file.id} className={s.previewImage}>
                <Image src={file.preview} alt={''} width={90} height={90} />
                <span className={s.deleteImageBtn} onClick={() => handleDeleteImage(file.id)}>
                  <IconClose width={20} height={20} />
                </span>
              </div>
            ))}
            {uploadedFiles.length < 10 && (
              <div className={s.addMoreImageBtn} {...getRootProps()}>
                <input {...getInputProps()} />
                <IconPlusCircleOutline width={100} height={50} />
              </div>
            )}
          </div>
        )}

        <div className={s.formWrapper}>
          {startVoiceRecorder && roomId
            ?
              <VoiceRecorder
                roomId={roomId}
                setStartVoiceRecorder={() => setStartVoiceRecorder(false)}
                isRecording={startVoiceRecorder} />
            :
              <Input
                className={s.inputSendMessage}
                register={register}
                id={'message'}
                name={'message'}
                placeholder={'Type Message...'}
                // disabled={isDisable || startVoiceRecorder} // ← Отключаем при записи
          />}

          {isFormValid() ? (
            <Button
              className={s.buttonSubmit}
              type={'submit'}
              variant={'text'}
              size={'large'}
              withoutPadding
              disabled={!isFormValid()}
            >
              Send message
            </Button>
          ) : (
            <div className={s.buttonsGroup}>
              {!startVoiceRecorder && ( // ← Показываем кнопки только когда рекордер не активен
                <>
                  <Button
                    type="button"
                    className={s.buttonAudio}
                    variant="text"
                    size="large"
                    withoutPadding
                    onClick={() =>{ setStartVoiceRecorder(true)}} // ← ВКЛЮЧАЕМ рекордер
                    disabled={isDisable}
                  >
                    <input {...getInputProps()} />
                    <IconMicOutline />
                  </Button>
                  <Button
                    {...getRootProps()}
                    type={'button'}
                    className={s.buttonUploadImage}
                    variant={'text'}
                    size={'large'}
                    withoutPadding
                    disabled={isDisable}
                  >
                    <input {...getInputProps()} />
                    <IconImageOutline />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
