import {useMutation} from '@tanstack/react-query'
import api from '@/lib/api'

interface SignupForm {
    username: string
    email: string
    password: string
}

export const useSignup = () => {
    return useMutation({
        mutationFn: async (form: SignupForm) => {
            const res = await api.post('/auth/signup', form)
            return res.data
        },
    })
}