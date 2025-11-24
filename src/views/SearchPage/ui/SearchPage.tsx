'use client'

import { useInfinityScroll } from '@/src/shared/hooks'
import { IconSearchOutline, Input } from '@rocketweb-studio/ulens-ui-kit'
import s from './SearchPage.module.scss'
import { useGetUsersInfiniteQuery } from '@/src/entities/user/api/userApi'
import { useState } from 'react'
import { useDebounce } from '@/src/shared/hooks/useDebounce'
import { UserAvatar } from '@/src/entities/userProfile'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'

export const SearchPage = () => {
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search)
  const { data, fetchNextPage, hasNextPage, isLoading } = useGetUsersInfiniteQuery({ search: debounceSearch })
  const { observerRef } = useInfinityScroll({ hasNextPage, fetchNextPage })

  const userItems = data?.pages.flatMap((page) => page.items) || []
  console.log(userItems)
  return (
    <div className={s.searchPage}>
      <h1>Search</h1>
      <div className={s.searchWrapper}>
        <IconSearchOutline className={s.searchIcon} />
        <Input
          className={s.searchField}
          placeholder={'Search'}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </div>
      <div className={s.searchResult}>
        {!userItems.length ?
          <>
            {/*<h3>Recent request</h3>*/}
            <div className={s.oops}>
              <h4>Oops! This place looks empty!</h4>
              <span>No recent requests</span>
            </div>
          </>
        : <div className={s.recent}>
            {userItems.map((user) => (
              <div className={s.recentItem}>
                <div className={s.avatar}>
                  <UserAvatar mode={'size'} userName={user.userName} width={50} height={50} avatarOwner={user.avatar} />
                </div>
                <div className={s.userInfo}>
                  <div className={s.userName}>
                    <Link href={Path.UserProfile(user.id)}>{user.userName}</Link>
                  </div>
                  <div className={s.firstName}>
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              </div>
            ))}
            {hasNextPage && <div ref={observerRef} style={{ height: '10px' }}></div>}
          </div>
        }
      </div>
    </div>
  )
}
