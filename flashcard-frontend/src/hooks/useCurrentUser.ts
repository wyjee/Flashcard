import {useQuery} from '@tanstack/react-query';
import api from '@/lib/api';

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => api.get('/auth/me').then((res) => res.data),
        retry: false,
    });
};