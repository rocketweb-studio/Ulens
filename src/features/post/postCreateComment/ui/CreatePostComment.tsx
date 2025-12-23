'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCommentInput, createCommentSchema } from '@/src/features/post/postCreateComment/model'
import { useCreateCommentMutation } from '@/src/entities/post/api/postsApi'
import { isFetchBaseQueryError } from '@/src/shared/utils'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { ServerErrorType } from '@/src/features/auth/singUp/model/types'
import s from './CreatePostComment.module.scss'
import { Button, Input } from '@rocketweb-studio/ulens-ui-kit'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'

type Props = {
  postId: string
  replyToCommentId?: string | null
  initialValue?: string
  onSuccess?: () => void
  className?: string
  withoutBorderTop?: boolean
  padding: 'Small' | 'Big'
}

export const CreatePostComment = ({
  postId,
  className,
  withoutBorderTop = false,
  padding = 'Big',
  initialValue,
  onSuccess,
  replyToCommentId,
}: Props) => {
  const { data: meData } = useGetMeQuery()
  const [createComment, { isLoading }] = useCreateCommentMutation()
  const paddingClass = `padding${padding}`

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<CreateCommentInput>({
    mode: 'onChange',
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: initialValue ?? '',
    },
  })

  const onSubmit: SubmitHandler<CreateCommentInput> = async (data) => {
    const { content } = data

    const handleServerError = (error: FetchBaseQueryError) => {
      if (!error) return
      clearErrors()

      if ('status' in error) {
        if (error.status === 400 && error.data) {
          const serverError = error.data as ServerErrorType
          const errorsMessages = serverError.errorsMessages
          if (errorsMessages && errorsMessages.length > 0) {
            serverError.errorsMessages.forEach((errorMessage) => {
              const fieldName = errorMessage.field as keyof CreateCommentInput
              setError(fieldName, {
                type: 'serverError',
                message: errorMessage.message,
              })
            })
          }
        }
      }
    }

    try {
      await createComment({
        postId: postId,
        content: data.content,
        ...(replyToCommentId ? { replyToCommentId } : {}),
      }).unwrap()

      reset()
      onSuccess?.()
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        handleServerError(err)
      }
    }
  }

  if (!meData) return null

  return (
    <div
      className={`${s.addCommentContainer} ${!withoutBorderTop && s.borderTop} ${className || ''} ${s[paddingClass]}`}
    >
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.formWrapper}>
          <Input
            className={s.inputAddComment}
            register={register}
            id={'content'}
            name={'content'}
            placeholder={'Add a Comment...'}
            error={errors.content?.message}
          />
          <Button
            className={s.buttonSubmit}
            variant={'text'}
            disabled={!isValid || isLoading}
            size={'large'}
            withoutPadding
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  )
}
