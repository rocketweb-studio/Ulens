import {useEffect, useRef} from "react";

type Props = {
  hasNextPage: boolean,
  fetchNextPage: () => void
};
export const useInfinityScroll = ({fetchNextPage,hasNextPage}: Props) => {
  const observerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    })

    if (observerRef.current) observer.observe(observerRef.current)
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
      observer.disconnect()
    }

  }, [hasNextPage]);

  return {observerRef}
};