import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TopicItem } from '@/types/TopicListItem';

export const useTopicDetail = (id: number) => {
    return useQuery<TopicItem>({
        queryKey: ['topic', id],
        queryFn: async () => {
            const res = await api.get(`/topics/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};