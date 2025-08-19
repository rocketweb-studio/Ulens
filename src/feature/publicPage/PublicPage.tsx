'use client';

import {SignUp} from "@/src/feature/auth/ui/SignUp";

export const PublicPage = () => {
  return (
    <div>
      Главная страница (счётчик и 4 поста). Доступна всем (в тч авторизованным). Отличается наличием сайдбара и кнопками
      в хердере
        <SignUp/>
    </div>
  );
};