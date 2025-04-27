import {useQuery, useMutation} from "@tanstack/react-query";
import api from '@/lib/api'
import {Topic} from "@/types/Topic";

export const useTopics = () => {
    return useQuery({
        queryKey: ["topics"],
        queryFn: async (): Promise<Topic[]> => {
            const res = await api.get("/topics", {
                withCredentials: true,
            });
            return res.data;
        },
    });
};

export const useDeleteTopic = () => {
    return useMutation({
        mutationFn: (topicId: number) => api.delete(`/topics/${topicId}`),
    });
};