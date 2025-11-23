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
import { getMeResponse } from '@/src/entities/auth/api/authApi.types'

type Props = {
  postId: string
  withBorderBottom?: boolean
  meData: getMeResponse | undefined
}

export const CreatePostComment = ({ postId, withBorderBottom = false, meData }: Props) => {
  const [createComment, { isLoading }] = useCreateCommentMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    trigger,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<CreateCommentInput>({
    mode: 'onChange',
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
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
      const res = await createComment({ postId: postId, content: content }).unwrap()
      reset()
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        handleServerError(err)
      }
    }
  }

  if (!meData) return null

  return (
    <div className={s.addCommentContainer}>
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
