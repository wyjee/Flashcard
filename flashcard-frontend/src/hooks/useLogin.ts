import {useMutation} from '@tanstack/react-query'
import qs from 'qs'
import api from '@/lib/api'

interface LoginForm {
    username: string
    password: string
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (form: LoginForm) => {
            const res = await api.post('/auth/login', qs.stringify(form), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            return res.data
        },
    })
}