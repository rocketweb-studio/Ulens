import React, {useEffect, useRef, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import ReCaptcha_logo from '@/public/reCaptcha.svg'
import checked from '@/public/check.svg'
import s from './ReCaptcha.module.scss'
import {delay} from "@/src/common/utils";

type Props = {
  errorMessage: string | boolean | undefined
  setCaptcha: (token: string ) => void
}

const ReCaptcha = ({errorMessage, setCaptcha}:Props) => {
  const [error, setError] = useState<string | boolean>('')
  const [loader, setLoader] = useState<'checkbox' | 'loading' | 'complete'>('checkbox');
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage)
      recaptchaRef.current?.reset()
      setLoader('checkbox')
    }
  },[errorMessage])

  const onSubmit = async () => {

    setLoader('loading')
    await delay(1000)

    recaptchaRef.current?.reset();
    recaptchaRef.current?.executeAsync()
      .then(() => {
        setLoader('complete')
      })
      .catch(() => {
        setLoader('checkbox')
      })
  };

  const onChangeReCaptcha = (token: string | null) => {
    if (!token) {
      setError('Verification expired. Check the checkbox again.')
      setLoader('checkbox')
      return;
    }
    setCaptcha(token)
  }



  return (
    <>
      <ReCAPTCHA ref={recaptchaRef}
                 sitekey={'6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                 size="invisible"
                 onChange={onChangeReCaptcha}/>

      <div className={s.boxModel}>
        <div className={s.wrapper}>
          <div>
            {loader === 'checkbox' && <div onClick={onSubmit} className={s.checkbox}></div>}
            {loader === 'loading' && <div className={s.loader}></div>}
            {loader === 'complete' && <Image src={checked} alt={'checked'}></Image>}
          </div>
          <p className={s.label}>I’m not a robot</p>
        </div>
        <Image src={ReCaptcha_logo} alt={'ReCAPTCHA'}/>
      </div>
      <p className={s.errorMessage}>{error}</p>
    </>
  );
};

export default ReCaptcha;