import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 🔄 refresh token 재요청 인터셉터
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            try {
                await axios.post('/auth/refresh', {}, {withCredentials: true})
                return api(err.config) // 🔁 원래 요청 재시도
            } catch (refreshError) {
                document.cookie = "access_token=; Max-Age=0";
                document.cookie = "refresh_token=; Max-Age=0";
                window.location.href = '/login'
            }
        }
        return Promise.reject(err)
    }
)

export default api