import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {Path} from "@/src/common/components/Navigation/Navigation"
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";


export const useRedirectIfAuthorized = (redirecTo = Path.Profile) => {
    const router = useRouter()
    const {data, isLoading} = useGetMeQuery()

    useEffect(() => {
        if (data) {
            router.push(redirecTo)
        }
    }, [data])

    return isLoading
}