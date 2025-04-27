'use client';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import api from '@/lib/api';

interface QNAUpdateForm {
    qnaId: number;
    question: string;
    answer: string;
}

export const useUpdateQna = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (form: QNAUpdateForm) => {
            const {qnaId, ...updateData} = form;
            const res = await api.put(`/qna/${qnaId}`, updateData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['topicDetail']});
        },
    });
};

export const useDeleteQna = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (qnaId: number) => {
            await api.delete(`/qna/${qnaId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['topicDetail']});
        },
    });
};