'use client'

import s from './GeneralInformation.module.scss'
import { Input } from '@/src/shared/ui/Input/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetProfileByUsedIdQuery, useUpdateProfileMutation } from '@/src/entities/userProfile/api/userProfileApi'
import React from 'react'
import { Select } from '@/src/shared/ui/Select/Select'
import { TextArea } from '@/src/shared/ui/TextArea/TextArea'
import { DatePicker } from '@/src/shared/ui/DataPicker/DatePicker'
import { Button } from '@/src/shared/ui/Button/Button'
import { profileSchema, UserProfile } from '@/src/entities/userProfile/model/profileSchema'

export const GeneralInformation = () => {
  const { data } = useGetProfileByUsedIdQuery({ userId: '45d09b76-8237-417e-b744-702a2eb29913' })
  const [updateProfile, result] = useUpdateProfileMutation()

  const body = {
    userName: 'valeratirs',
    firstName: 'Val',
    lastName: 'Ras',
    city: 'Russia',
    country: 'Moscow',
    region: 'Moscow',
    dateOfBirth: '01.01.2000',
    aboutMe: 'aboutMe',
  }

  console.log('dataProfile', data)
  // console.log('updateProfileData',result)

  const TestHandler = () => {
    updateProfile(body)
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
    try {
    } catch (e) {}
    reset()
  }

   return (
    <div className={s.general}>

      <form className={s.inputsContainer}>
        <Input type='text' label={'Username'} required />
        <Input type='text' label={'First Name'} required />
        <Input type='text' label={'Last Name'} required />
        <DatePicker
          label={'Date of birth'}
          labelMobile={'Date of birthday'}
          dateString={'2023-11-25T15:30:00.000Z'}
          onClick={() => {}}
        />

        <div className={s.selects}>
          <Select
            options={['Belarus', 'Russia', 'USA', 'Germany']}
            onSelect={() => {}}
            placeholder='Country'
            title={'Select your country'}
          />{' '}
          <Select
            options={['Minsk', 'Moscow', 'New York', 'Saint-Peterburg', 'Berlin', 'Keln', 'NoName']}
            onSelect={() => {}}
            placeholder='City'
            title={'Select your city'}
          />
        </div>
        <TextArea label={'About me'} rows={4}/>
        <div className={s.line}></div>
        <div className={s.btnSaved}>
        <Button onClick={TestHandler} variant={'primary'}>
          Save Changes
        </Button>
        </div>
      </form>
    </div>
  )
}
