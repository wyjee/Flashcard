'use client';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import api from '@/lib/api';

interface QNAUpdateForm {
    qnaId: number;
    question: string;
    answer: string;
}

export const useCreateQna = () => {
    return useMutation({
        mutationFn: ({topicId, question, answer}: { topicId: number, question: string, answer: string }) =>
            api.post(`/topics/${topicId}/qnas`, {qnas: [{question, answer}]}).then(res => res.data.createdQna),
    });
};

export const useUpdateQna = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (form: QNAUpdateForm) => {
            const {qnaId, ...updateData} = form;
            const res = await api.put(`/qnas/${qnaId}`, updateData);
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
            await api.delete(`/qnas/${qnaId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['topicDetail']});
        },
    });
};