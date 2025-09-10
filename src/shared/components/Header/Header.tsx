import { Navigation } from '@/src/shared/components/Navigation/Navigation'
import s from './Header.module.scss'
import Link from 'next/link'
import { FlexContainer } from '@/src/shared/components/FlexContainer'
import {Path} from "@/src/shared/constants/Path";

export const Header = () => {
  return (
    <header>
      <FlexContainer justify='between'>
        <div className={s.logotype}>
          <Link href={Path.Main}>Ulens</Link>
        </div>
        <Navigation />
      </FlexContainer>
    </header>
  )
}
