import { useSelector } from "react-redux"
import { RootState } from "@/src/app/store"

export const useAppSelector = useSelector.withTypes<RootState>()
