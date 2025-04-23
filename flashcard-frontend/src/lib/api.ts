import axios, {AxiosError} from 'axios';
import Cookies from 'js-cookie';
// import {withTrailingSlash} from '@/lib/utils';

console.log("[테스트] API.ts:", process.env.NEXT_PUBLIC_API_BASE_URL);

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: URL 끝에 슬래시 붙이기 -> app.router.redirect_slashes = False
// api.interceptors.request.use((config) => {
//     if (config.url && !config.url.startsWith('/auth')) {
//         config.url = withTrailingSlash(config.url);
//     }
//     return config;
// });

// 응답 인터셉터: 리프레시 토큰 처리
api.interceptors.response.use(
    (res) => res,
    async (err: unknown) => {
        const error = err as AxiosError;
        const originalRequest = error.config;

        const isRefreshCall = originalRequest?.url?.includes('/auth/refresh');
        const accessToken = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');

        console.log('originalRequestUrl:', originalRequest?.url);
        console.log('access_token:', accessToken);
        console.log('refresh_token:', refreshToken);
        console.log('isRefreshCall:', isRefreshCall);

        if (isRefreshCall) {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && refreshToken) {
            try {
                await api.post('/auth/refresh', {}, {withCredentials: true});
                return api(originalRequest!); // 원래 요청 재시도
            } catch (refreshErr) {
                const refreshError = refreshErr as AxiosError;
                console.error('[Refresh failed]', refreshError.message);

                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;