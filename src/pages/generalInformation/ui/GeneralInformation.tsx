'use client'

import s from './GeneralInformation.module.scss'
import {Input} from '@/src/shared/ui/Input/Input'
import {SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useGetProfileByUsedIdQuery, useUpdateProfileMutation} from '@/src/entities/userProfile/api/userProfileApi'
import React, {useEffect} from 'react'
import {Select} from '@/src/shared/ui/Select/Select'
import {TextArea} from '@/src/shared/ui/TextArea/TextArea'
import {DatePicker} from '@/src/shared/ui/DataPicker/DatePicker'
import {Button} from '@/src/shared/ui'
import {profileSchema, UserProfile} from '@/src/entities/userProfile/model/profileSchema'

export const GeneralInformation = () => {
  const {data: dataProfile} = useGetProfileByUsedIdQuery({userId: '45d09b76-8237-417e-b744-702a2eb29913'})
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

  console.log('dataProfile', dataProfile)
  // console.log('updateProfileData',result)

  const TestHandler = () => {
    updateProfile(body)
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
    console.log('submitErrors', errors)

    // try {
    // } catch (e) {
    // }
    // reset()
  }

  return (
    <div className={s.general}>

      <form onSubmit={handleSubmit(onSubmit)} className={s.inputsContainer}>
        <Input type='text' label={'Username'} name={'userName'} required register={register} error={errors.userName?.message}/>
        <Input type='text' label={'First Name'} name={'firstName'} required register={register} error={errors.firstName?.message}/>
        <Input type='text' label={'Last Name'} name={'lastName'} required register={register} error={errors.lastName?.message}/>
        <DatePicker
          onSelectAction={() => {
          }}
          // selected={"2021-01-01T00:00:00.000Z"}
          selected={dataProfile?.dateOfBirth}
          label={'Date of birth'}
          labelMobile={'Date of birthday'}
          error={errors.dateOfBirth?.message}
        />

        <div className={s.selects}>
          <Select
            options={['Belarus', 'Russia', 'USA', 'Germany']}
            onSelectAction={() => {  setValue('country','Russia')           }}
            placeholder='Country'
            title={'Select your country'}
          />{' '}
          <Select
            options={['Minsk', 'Moscow', 'New York', 'Saint-Peterburg', 'Berlin', 'Keln', 'NoName']}
            onSelectAction={() => {
            }}
            placeholder='City'
            title={'Select your city'}
          />
        </div>
        <TextArea label={'About me'} name={'aboutMe'} rows={4} register={register} error={errors.aboutMe?.message}/>
        <div className={s.line}></div>
        <div className={s.btnSaved}>
          <Button type={'submit'}>Save Changes</Button>
          {/*<button type="submit">Save Changes</button>*/}
        </div>
      </form>
    </div>
  )
}
