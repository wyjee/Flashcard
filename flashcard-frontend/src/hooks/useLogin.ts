import {useMutation} from '@tanstack/react-query'
import api from '@/lib/api'

interface LoginForm {
    username: string
    password: string
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (form: LoginForm) => {
            const res = await api.post('/auth/login', form, {
                withCredentials: true,
            })
            return res.data
        },
    })
}