'use client'

import s from './GeneralInformation.module.scss'
import {Input} from '@/src/shared/ui'
import {Controller, SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useGetProfileByUsedIdQuery, useUpdateProfileMutation} from '@/src/entities/userProfile/api/userProfileApi'
import React, {useEffect} from 'react'
import {Select} from '@/src/shared/ui/Select/Select'
import {TextArea} from '@/src/shared/ui/TextArea/TextArea'
import {DatePicker} from '@/src/shared/ui/DataPicker/DatePicker'
import {Button} from '@/src/shared/ui'
import {profileSchema, UserProfile} from '@/src/entities/userProfile/model/profileSchema'
import Link from "next/link";
import { Path } from '@/src/shared/router/Path'

export const GeneralInformation = () => {
  const {data: dataProfile} = useGetProfileByUsedIdQuery({userId: '45d09b76-8237-417e-b744-702a2eb29913'})
  const [updateProfile, {isLoading}] = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {errors},
  } = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      city: '',
      country: '',
      region: '',
      dateOfBirth: '',
      aboutMe: '',
    },
  })

  useEffect(() => {
    if (dataProfile) {
      reset(dataProfile)
    }
  }, [dataProfile])

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
    console.log('submitData', data)
    updateProfile(data)
    try {
      await updateProfile(data).unwrap()
    } catch (e) {
    }
  }


  return (
    <div className={s.general}>

      <form onSubmit={handleSubmit(onSubmit)} className={s.inputsContainer}>
        <Input type='text' label={'Username'} name={'userName'} required register={register}
               error={errors.userName?.message}/>
        <Input type='text' label={'First Name'} name={'firstName'} required register={register}
               error={errors.firstName?.message}/>
        <Input type='text' label={'Last Name'} name={'lastName'} required register={register}
               error={errors.lastName?.message}/>
        <Controller
          name="dateOfBirth"
          control={control}
          rules={{required: true}}
          render={({field}) => {
            return (<DatePicker
              label={'Date of birth'}
              labelMobile={'Date of birthday'}
              error={errors.dateOfBirth?.message}
              errorLink={<Link href={Path.PrivacyPolicy}>PrivacyPolicy</Link>}
              {...field}
            />)
          }}
        />

        <div className={s.selects}>
          <Controller
            name="country"
            control={control}
            render={({field}) => {
              return (<Select
                options={['Belarus', 'Russia', 'USA', 'Germany']}
                placeholder='Country'
                title={'Select your country'}
                {...field}
              />)
            }}
          />
          <Controller
            name="city"
            control={control}
            render={({field}) => {
              return (<Select
                options={['Minsk', 'Moscow', 'New York', 'Saint-Peterburg', 'Berlin', 'Keln', 'NoName']}
                placeholder='City'
                title={'Select your city'}
                {...field}
              />)
            }}
          />
        </div>
        <TextArea label={'About me'} name={'aboutMe'} rows={4} register={register} error={errors.aboutMe?.message}/>
        <div className={s.line}></div>
        <div className={s.btnSaved}>
          <Button type={'submit'} disabled={isLoading}>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
