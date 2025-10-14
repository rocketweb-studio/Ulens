'use client'

import s from './GeneralInformation.module.scss'
import { Input } from '@/src/shared/ui'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetProfileByUsedIdQuery, useUpdateProfileMutation } from '@/src/entities/userProfile/api/userProfileApi'
import React, { useEffect } from 'react'
import { Select } from '@/src/shared/ui/Select/Select'
import { TextArea } from '@/src/shared/ui/TextArea/TextArea'
import { DatePicker } from '@/src/shared/ui/DataPicker/DatePicker'
import { Button } from '@/src/shared/ui'
import { profileSchema, UserProfile } from '@/src/entities/userProfile/model/profileSchema'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { UserAvatarUploader } from '@/src/entities/userProfile'

const countriesCities: Record<string, string[]> = {
  Belarus: ['Minsk', 'Brest', 'Grodno', 'Gomel', 'Mogilev', 'Vitebsk'],
  Russia: ['Moscow', 'Saint-Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod'],
  USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
  Germany: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart'],
  Poland: ['Warsaw', 'Krakow', 'Lodz', 'Wroclaw', 'Poznań', 'Gdańsk'],
  Ukraine: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 'Donetsk'],
  France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes'],
  Italy: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice'],
}

export const GeneralInformation = () => {
  const { data: meData } = useGetMeQuery()
  const { data: dataProfile } = useGetProfileByUsedIdQuery({ userId: meData?.id! }, { skip: !meData?.id })
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  // Отслеживаем изменение страны
  const selectedCountry = useWatch({
    control,
    name: 'country',
  })

  // Получаем города для выбранной страны
  const getCitiesForCountry = (country: string): string[] => {
    return countriesCities[country] || []
  }

  // Очищаем город при смене страны
  useEffect(() => {
    if (selectedCountry) {
      setValue('city', '')
    }
  }, [selectedCountry, setValue])

  useEffect(() => {
    if (dataProfile) {
      reset(dataProfile)
    }
  }, [dataProfile])

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
    try {
      await updateProfile(data).unwrap()
    } catch (e) {
      console.error('Error updating profile:', e)
    }
  }

  return (
    <div className={s.general}>
      {dataProfile && <UserAvatarUploader avatars={dataProfile.avatars} />}
      <form onSubmit={handleSubmit(onSubmit)} className={s.inputsContainer}>
        <Input
          type='text'
          label={'Username'}
          name={'userName'}
          required
          register={register}
          error={errors.userName?.message}
        />
        <Input
          type='text'
          label={'First Name'}
          name={'firstName'}
          required
          register={register}
          error={errors.firstName?.message}
        />
        <Input
          type='text'
          label={'Last Name'}
          name={'lastName'}
          required
          register={register}
          error={errors.lastName?.message}
        />

        <Controller
          name='dateOfBirth'
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <DatePicker
                label={'Date of birth'}
                labelMobile={'Date of birthday'}
                error={errors.dateOfBirth?.message}
                errorLink={<Link href={Path.PrivacyPolicy}>PrivacyPolicy</Link>}
                {...field}
              />
            )
          }}
        />

        <div className={s.selects}>
          <Controller
            name='country'
            control={control}
            render={({ field }) => {
              return (
                <Select
                  options={Object.keys(countriesCities)}
                  placeholder='Country'
                  title={'Select your country'}
                  propsValue={dataProfile?.country}
                  {...field}
                />
              )
            }}
          />

          <Controller
            name='city'
            control={control}
            render={({ field }) => {
              const cities = selectedCountry ? getCitiesForCountry(selectedCountry) : []

              return (
                <Select
                  options={cities}
                  placeholder={selectedCountry ? 'Select city' : 'First select country'}
                  title={'Select your city'}
                  propsValue={dataProfile?.city}
                  disabled={!selectedCountry}
                  {...field}
                />
              )
            }}
          />
        </div>

        <TextArea label={'About me'} name={'aboutMe'} rows={4} register={register} error={errors.aboutMe?.message} />

        <div className={s.line}></div>
        <div className={s.btnSaved}>
          <Button type={'submit'} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
