import { useSelector } from 'react-redux'
import { RootState } from '@/src/store/store'

export const useAppSelector = useSelector.withTypes<RootState>()
