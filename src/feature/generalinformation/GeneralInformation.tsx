import {Button} from "@rocketweb-studio/ulens-ui-kit";
import s from './GeneralInformation.module.scss'
import { Input } from "@/src/shared/components/Input/Input";

export const GeneralInformation = () => {
//todo пока не знаю откуда urlPhoto брать
   const urlPhoto='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgVfHORQFLyUf_rNove-xUmxIskDeMJ63REz_YIMQ6S0vCyQdkBvJos4igKspvCgpqnpy8h0xM--1uckzZIxDgyoHy37-MowkF-YzvVx8'


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
                <Button  variant={'outlined'} title={'Select Profile Photo'} className={s.btn}/>
            </div>
            <div className={s.inputsContainer}>

                <Input type="text" label={"Username"} required  />
                <Input type="text" label={"First Name"} required />
                <Input type="text" label={"Last Name"} required />
                <Input type="date" label={"Date of birth"}/>
                <div className={s.selects}>
                    <Input type="text" label={"select"}/>
                    <Input type="text" label={"select"}/>
                </div>
                <Input type="textarea" label={"About me"} rows={4}/>

            </div>
        </div>
    );
};

