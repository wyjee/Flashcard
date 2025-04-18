import axios, { AxiosError } from 'axios';
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
        const hasAccessToken = !!Cookies.get('access_token');

        console.warn('[Interceptor Error]', {
            originalRequest: originalRequest?.url,
            isRefreshCall,
            hasAccessToken,
        });

        if (isRefreshCall) return Promise.reject(error);

        if (error.response?.status === 401 && hasAccessToken) {
            try {
                await api.post('/auth/refresh', {}, {
                    withCredentials: true,
                });

                // 리프레시 토큰 재발급 성공 후 원래 요청 재시도
                return api(error.config!);
            } catch (refreshErr: unknown) {
                const refreshError = refreshErr as AxiosError;
                console.error('[Refresh failed]', refreshError.message);

                // 리프레시도 실패한 경우
                document.cookie = 'access_token=; Max-Age=0';
                document.cookie = 'refresh_token=; Max-Age=0';

                // 로그인 페이지로
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;