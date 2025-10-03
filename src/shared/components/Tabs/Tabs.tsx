'use client'

import Link from "next/link";
import s from "./Tabs.module.scss";
import {FlexContainer} from "@/src/shared/components/FlexContainer";
import {useSearchParams} from "next/navigation";
import {getTabsSettings} from "@/src/shared/utils/getTabsSettings";


export const Tabs = () => {
  const params = useSearchParams()

  const tabsName = getTabsSettings(params)

  return (
      <FlexContainer wrap justify={'center'} >
        {tabsName.map(({title, href, isActive}) => (
          <Link className={`${s.link} ${isActive ? s.activeLink : ''}`} href={href}>{title}</Link>
        ))}
      </FlexContainer>
  );
};