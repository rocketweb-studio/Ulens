import s from './sentMessage.module.scss'
import { Button, Input } from '@rocketweb-studio/ulens-ui-kit'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageInput, messageSchema } from '@/src/features/messenger/sentMessage/model/schemas'
import { io } from 'socket.io-client'

type Props = {
  roomId: number | null
  isDisable: boolean
}

export const SendMessage = ({ roomId, isDisable = false }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<MessageInput>({
    mode: 'onChange',
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  })

  const onSubmit: SubmitHandler<MessageInput> = async (data) => {
    try {
      const token = localStorage.getItem('accessToken')

      if (!roomId) return
      const socket = io('https://ulens.org/ws', { auth: { token } })

      socket.emit('SEND_MESSAGE', {
        roomId,
        content: data.message,
      })
      reset()
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className={s.sendMessageContainer}>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.formWrapper}>
          <Input
            className={s.inputSendMessage}
            register={register}
            id={'message'}
            name={'message'}
            placeholder={'Type Message...'}
            disabled={isDisable}
          />
          <Button
            className={s.buttonSubmit}
            variant={'text'}
            size={'large'}
            withoutPadding
            disabled={!isValid || isDisable}
          >
            Send message
          </Button>
        </div>
      </form>
    </div>
  )
}
