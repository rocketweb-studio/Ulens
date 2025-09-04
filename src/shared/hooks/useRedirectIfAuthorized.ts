import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {Path, PathValue} from "@/src/shared/components/Navigation/Navigation"
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";


export const useRedirectIfAuthorized = (redirectTo:PathValue = Path.Profile) => {
    const router = useRouter()
    const {data, isLoading, error} = useGetMeQuery()

    useEffect(() => {
        if (data && !error) {
            router.push(redirectTo)
        }
    }, [data, error])

    return isLoading && !error
}
