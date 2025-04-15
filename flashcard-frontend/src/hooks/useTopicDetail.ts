import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Topic } from '@/types/Topic';

export const useTopicDetail = (id: number) => {
    return useQuery<Topic>({
        queryKey: ['topic', id],
        queryFn: async () => {
            const res = await api.get(`/topics/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};