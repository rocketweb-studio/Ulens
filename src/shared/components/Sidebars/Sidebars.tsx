'use client'

import s from './Sidebars.module.scss'
import Link from "next/link";
import {Path} from "@/src/shared/constants/Path";
import {IconHomeOutline} from '@rocketweb-studio/ulens-ui-kit';
import {IconPlusSquareOutline} from '@rocketweb-studio/ulens-ui-kit';
import {IconPersonOutline} from '@rocketweb-studio/ulens-ui-kit';
import {IconMessageCircleOutline} from '@rocketweb-studio/ulens-ui-kit';
import {IconSearch} from '@rocketweb-studio/ulens-ui-kit';
import {IconTrendingUpOutline} from '@rocketweb-studio/ulens-ui-kit';
import {IconBookmarkOutline} from '@rocketweb-studio/ulens-ui-kit';
import {IconLogOutOutline} from '@rocketweb-studio/ulens-ui-kit';
import {FlexContainer} from "@/src/shared/components/FlexContainer";
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";

const sidebarsLinks = [
  {icon: IconHomeOutline, title: 'Feed', href: Path.Main},
  {icon: IconPlusSquareOutline, title: 'Create', href: ''},
  {icon: IconPersonOutline, title: 'My Profile', href: Path.Profile},
  {icon: IconMessageCircleOutline, title: 'Messenger', href: Path.InDevelopment},
  {icon: IconSearch, title: 'Search', href: Path.InDevelopment},
  {icon: IconTrendingUpOutline, title: 'Statistics', href: Path.InDevelopment},
  {icon: IconBookmarkOutline, title: 'Favorites', href: Path.InDevelopment},
  {icon: IconLogOutOutline, title: 'Log Out', href: Path.Logout},
]


export const Sidebars = () => {
  const { error } = useGetMeQuery()

  const isAuth = !error
  return (isAuth &&
      <div className={s.sidebarWrapper}>
        {sidebarsLinks.map(({title, href, icon: Icon}, i) => (
          <FlexContainer className={s.linkWrapper} gap={'13px'} key={i}>
            <Icon/>
            <Link href={href} className={s.link}>{title}</Link>
          </FlexContainer>
        ))}
      </div>
  );
};