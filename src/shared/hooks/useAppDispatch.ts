import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/src/store/store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
