import {useToast} from "@/src/common/hooks/useToast";

export const useApiError = () => {
    const { showError } = useToast()

    const handleError = (error: unknown) => {
        if (typeof error === 'object' && error !== null) {
            const apiError = error as { status?: number; data?: { message?: string } }

            switch (apiError.status) {
                case 400:
                    showError(apiError.data?.message || 'Invalid request')
                    break
                case 401:
                    showError('Please check your credentials')
                    break
                case 403:
                    showError('Access denied')
                    break
                case 404:
                    showError('Resource not found')
                    break
                case 500:
                    showError('Server error. Please try again later')
                    break
                default:
                    showError('Something went wrong')
            }
        } else {
            showError('Unexpected error occurred')
        }
    }

    return { handleError }
}