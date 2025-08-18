'use client';
import {Input} from "@/src/common/components/Input/Input";

export const PublicPage = () => {
  return (
    <div>
      Главная страница (счётчик и 4 поста). Доступна всем (в тч авторизованным). Отличается наличием сайдбара и кнопками
      в хердере
        <Input name={"email"} value={''} placeholder={'Email'} label={'Email'}/>
    </div>
  );
};