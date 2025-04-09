import {useQuery} from "@tanstack/react-query";
import api from '@/lib/api'
import {TopicItem} from "@/types/TopicListItem";

export const useTopics = () => {
    return useQuery({
        queryKey: ["topics"],
        queryFn: async (): Promise<TopicItem[]> => {
            const res = await api.get("/topics", {
                withCredentials: true,
            });
            return res.data;
        },
    });
};