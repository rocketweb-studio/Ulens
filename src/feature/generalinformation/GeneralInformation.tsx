'use client'

import {Button} from "@rocketweb-studio/ulens-ui-kit";
import s from './GeneralInformation.module.scss'
import {Input} from "@/src/shared/components/Input/Input";
import {DatePicker} from "@/src/shared/components/DataPicker/DatePicker";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useGetProfileByUsedIdQuery, useUpdateProfileMutation} from "@/src/feature/userProfile/api/userProfileApi";
import React from "react";
import {Select} from "@/src/shared/components/Select/Select";
import {UserProfile, profileSchema} from "@/src/feature/userProfile/model/schemas";


export const GeneralInformation = () => {
  const {data} = useGetProfileByUsedIdQuery({userId: '45d09b76-8237-417e-b744-702a2eb29913'})
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
    formState: {errors},
  } = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {userName: '', firstName: '', lastName: '', city:'',country:'', region:'', dateOfBirth: '',aboutMe: ''},
  })

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {

    try {

    } catch (e) {
    }
    reset()
  }

  //todo пока не знаю откуда urlPhoto брать
  const urlPhoto = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgVfHORQFLyUf_rNove-xUmxIskDeMJ63REz_YIMQ6S0vCyQdkBvJos4igKspvCgpqnpy8h0xM--1uckzZIxDgyoHy37-MowkF-YzvVx8'
  return (
    <div className={s.general}>
      <div className={s.addPhotoContainer}>
        <div className={s.photo}>
          {!!urlPhoto
            ? <img src={urlPhoto} alt={'Avatar'} width={192} height={192} className={s.photo}/>
            : <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30 0H6C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6V30C0 31.5913 0.632141 33.1174 1.75736 34.2426C2.88258 35.3679 4.4087 36 6 36H30C31.5913 36 33.1174 35.3679 34.2426 34.2426C35.3679 33.1174 36 31.5913 36 30V6C36 4.4087 35.3679 2.88258 34.2426 1.75736C33.1174 0.632141 31.5913 0 30 0ZM6 4H30C30.5304 4 31.0391 4.21071 31.4142 4.58579C31.7893 4.96086 32 5.46957 32 6V22.72L25.6 17.26C24.6084 16.4441 23.3641 15.998 22.08 15.998C20.7959 15.998 19.5516 16.4441 18.56 17.26L4 29.4V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4ZM30 32H7.12L21.12 20.32C21.3889 20.1203 21.715 20.0125 22.05 20.0125C22.385 20.0125 22.7111 20.1203 22.98 20.32L32 28V30C32 30.5304 31.7893 31.0391 31.4142 31.4142C31.0391 31.7893 30.5304 32 30 32Z"
                fill="currentColor"/>
            </svg>
          }
        </div>
        <Button onClick={TestHandler} variant={'outlined'} title={'Select Profile Photo'} className={s.btn}/>
      </div>
      <div className={s.inputsContainer}>

                <Input type="text" label={"Username"} required  />
                <Input type="text" label={"First Name"} required />
                <Input type="text" label={"Last Name"} required />
                <DatePicker  label={"Date of birth"} labelMobile={"Date of birthday"} dateString={"2023-11-25T15:30:00.000Z"}  onClick={()=>{}}/>

                <div className={s.selects}>
                        <Select
                            options={['Belarus','Russia','USA','Germany']}
                            onSelect={()=>{}}
                            placeholder="Country"
                            title={"Select your country"}
                        />   <Select
                            options={['Minsk','Moscow','New York','Saint-Peterburg','Berlin','Keln',"NoName"]}
                            onSelect={()=>{}}
                            placeholder="City"
                            title={"Select your city"}
                        />
                </div>
                <Input type="textarea" label={"About me"} rows={4}/>
            </div>
        </div>
    );
};

