import React, {useEffect, useState} from "react";
import Image from "next/image";
import ReCaptcha_logo from '@/public/reCaptcha.svg'
import checked from '@/public/сheck.svg'
import s from './ReCaptcha.module.scss'

type Props = {
  errorMessage: string | boolean | undefined
  setCaptcha: (token: string) => void
  invisible?: boolean
}

const ReCaptcha = ({errorMessage, setCaptcha, invisible}: Props) => {
  const [error, setError] = useState<string | boolean>('')
  const [loader, setLoader] = useState<'checkbox' | 'loading' | 'complete'>('checkbox');


  useEffect(() => {
    // @ts-ignore
    window.onSubmit = function (token: string | null) {
      if (!token) {
        return
      }
      setCaptcha(token)
      setLoader('complete')
    };
    // @ts-ignore
    window.expiredCallback = () => {
      setError('Verification expired. Check the checkbox again.')
      setLoader('checkbox')
      setCaptcha('')
      return;
    }

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true;
    script.defer = true;
    document.body.appendChild(script)

    if (invisible) {
      script.addEventListener('load', ()=>{
        // @ts-ignore
        window.grecaptcha.ready(()=>{
          // @ts-ignore
          window.grecaptcha.execute()
        })
      })
    }

    return () => {
      document.body.removeChild(script)
      // @ts-ignore
      delete window.onSubmit;
      // @ts-ignore
      delete window.expiredCallback;
      // @ts-ignore
      delete window.grecaptcha;
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage)
      // @ts-ignore
      grecaptcha.reset()
      setLoader('checkbox')
    }
  }, [errorMessage])

  const onSubmitHandler = async () => {
    setLoader('loading')
    // @ts-ignore
    grecaptcha.reset();
    // @ts-ignore
    grecaptcha.execute()
  };

  return (
    <>
      <div className="g-recaptcha"
           data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_TOKEN!}
           data-callback="onSubmit"
           data-expired-callback='expiredCallback'
           data-size="invisible">
      </div>

      {!invisible && <>
          <div className={s.boxModel}>

              <div className={s.wrapper}>
                  <p className={s.errorMessage2}>{error === 'Verification expired. Check the checkbox again.' && error}</p>
                  <div >
                    {loader === 'checkbox' && <div onClick={onSubmitHandler} className={s.checkbox}></div>}
                    {loader === 'loading' && <div className={s.loader}></div>}
                    {loader === 'complete' && <Image src={checked} alt={'checked'}></Image>}
                  </div>
                  <p className={s.label}>I’m not a robot</p>
              </div>
              <Image src={ReCaptcha_logo} alt={'ReCAPTCHA'}/>
          </div>
          <p className={s.errorMessage}>{!(error === 'Verification expired. Check the checkbox again.') && error}</p>
      </>}
    </>
  );
};

export default ReCaptcha;