'use client'

import { useInfinityScroll } from '@/src/shared/hooks'
import { IconSearchOutline, Input } from '@rocketweb-studio/ulens-ui-kit'
import s from './SearchPage.module.scss'
import { useGetUsersInfiniteQuery } from '@/src/entities/user/api/userApi'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/src/shared/hooks/useDebounce'
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/src/shared/hooks/useAppSelector'
import { selectRecentSearchRequests, setRecentSearchRequests } from '@/src/store/app-slice'
import { SearchPageItem } from '@/src/views/SearchPage/ui/SearchPageItem'

export const SearchPage = () => {
  const dispatch = useAppDispatch()
  const recentSearch = useAppSelector(selectRecentSearchRequests)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search)

  const { fetchNextPage, hasNextPage, isFetching, isSuccess, currentData } = useGetUsersInfiniteQuery({
    search: debounceSearch,
  })

  const { observerRef } = useInfinityScroll({ hasNextPage, fetchNextPage })

  const searchUserItems = currentData?.pages.flatMap((page) => page.items) || []

  useEffect(() => {
    if (currentData && searchUserItems.length > 0 && debounceSearch !== '' && isSuccess && !isFetching) {
      dispatch(setRecentSearchRequests({ recent: searchUserItems }))
    }
  }, [currentData])

  return (
    <div className={s.searchPage}>
      <h1>Search</h1>
      <div className={s.searchWrapper}>
        <IconSearchOutline className={s.searchIcon} />
        <Input
          type={'search'}
          className={s.searchField}
          placeholder={'Search'}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </div>
      {/*((recentSearch.length > 0 && !debounceSearch.length) ||*/}
      {/*(searchUserItems.length <= 0 && debounceSearch.length > 0))*/}
      {recentSearch.length > 0 && isSuccess && !isFetching && !debounceSearch.length && (
        <div className={s.searchResult}>
          <h3>Recent request</h3>
          <div className={s.recent}>
            {recentSearch.map((recent) => (
              <SearchPageItem key={recent.id} item={recent} />
            ))}
          </div>
        </div>
      )}

      {!currentData ?
        <>Loading</>
      : <div className={s.searchResult}>
          {!searchUserItems.length ?
            <div className={s.oops}>
              <h4>Oops! This place looks empty!</h4>
              <span>No recent requests</span>
            </div>
          : <div className={s.recent}>
              {debounceSearch !== '' ?
                <h3>Result for your request:</h3>
              : <h3>All users:</h3>}
              {searchUserItems.map((user) => (
                <SearchPageItem key={user.id} item={user} />
              ))}
            </div>
          }
        </div>
      }
      {hasNextPage && <div ref={observerRef} style={{ height: '10px' }}></div>}
    </div>
  )
}
