import axios, {AxiosError} from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🔄 refresh token 재요청 인터셉터
api.interceptors.response.use(
    (res) => res,
    async (err: unknown) => {
        const error = err as AxiosError;
        const originalRequest = error.config;

        const isRefreshCall = originalRequest?.url?.includes('/auth/refresh');
        const accessToken = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');
        const hasAccessToken = typeof accessToken === 'string' && accessToken.length > 0;

        console.log('originalRequestUrl:', originalRequest?.url);
        console.log('access_token:', accessToken);
        console.log('refresh_token:', refreshToken);
        console.log('isRefreshCall:', isRefreshCall);
        console.log('hasAccessToken:', hasAccessToken);

        if (isRefreshCall || !hasAccessToken) return Promise.reject(error);

        if (error.response?.status === 401) {
            try {
                await api.post('/auth/refresh', {}, {withCredentials: true});
                return api(originalRequest!);
            } catch (refreshErr) {
                const refreshError = refreshErr as AxiosError;
                console.error('[Refresh failed]', refreshError.message);

                // 쿠키 삭제
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');

                // 리디렉션
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;