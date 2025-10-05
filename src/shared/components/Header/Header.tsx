'use client'

import s from './Header.module.scss'
import Link from 'next/link'
import {FlexContainer} from '@/src/shared/components/FlexContainer'
import {Path} from "@/src/shared/constants/Path";
import {Button} from "@/src/shared/components/Button/Button";
import {useGetMeQuery} from "@/src/features/auth/api/authApi";
import {IconOutlineBell} from '@rocketweb-studio/ulens-ui-kit';

export const Header = () => {
  const { data, isSuccess  } = useGetMeQuery(undefined, {
    // pollingInterval: 5 * 60 * 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const isAuth = !!data?.id && isSuccess

  return (
    <header className={s.header}>
      <FlexContainer justify={'between'} align={'center'}>
        <div className={s.logotype}>
          <Link href={Path.Main}>Ulens</Link>
        </div>

          {isAuth ?

            <IconOutlineBell/>
            :
            <FlexContainer gap={'25px'} >
              <Button tagType={'link'} variant={'text'} path={Path.SignIn}>Log in</Button>
              <Button tagType={'link'}  path={Path.SignUp}>Sing Up</Button>
            </FlexContainer>
          }


      </FlexContainer>
    </header>
  )
}
