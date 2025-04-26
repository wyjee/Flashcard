'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import {useMutation, useQuery} from '@tanstack/react-query';
import api from '@/lib/api';
import type {Qna} from '@/types/Qna';

export default function EditQnaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topicId = searchParams.get('id');

    const [qnas, setQnas] = useState<Qna[]>([]);
    const [topicForm, setTopicForm] = useState<{
        title: string;
        description: string;
        is_public: boolean;
    } | null>(null);

    const {isLoading} = useQuery({
        queryKey: ['topicDetail', topicId],
        queryFn: async () => {
            const res = await api.get(`/topics/${topicId}`);
            setTopicForm({
                title: res.data.title,
                description: res.data.description,
                is_public: res.data.is_public,
            });
            setQnas(res.data.qnas || []);
        },
        enabled: !!topicId,
    });

    const mutation = useMutation({
        mutationFn: async () => {
            if (!topicForm || !topicId) throw new Error('Missing topic data');
            if (qnas.length === 0) throw new Error('Please add at least one QnA');

            await api.post(`/topics/${topicId}/qnas`, {qnas});
        },
        onSuccess: () => {
            router.push('/topic/list');
        },
    });

    const handleChange = <K extends keyof Qna>(
        index: number,
        name: K,
        value: Qna[K]
    ) => {
        const newQnas = [...qnas];
        newQnas[index][name] = value;
        setQnas(newQnas);
    };

    const addQna = () => {
        setQnas([...qnas, {question: '', answer: ''}]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <PageWrapper title="Edit QnAs">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-6">
                {qnas.map((qna, idx) => (
                    <div key={idx} className="py-4 rounded">
                        <input
                            placeholder="Question"
                            value={qna.question}
                            onChange={(e) => handleChange(idx, 'question', e.target.value)}
                            className="w-full mb-2 border px-4 py-2 rounded"
                            required
                        />
                        <textarea
                            placeholder="Answer"
                            value={qna.answer}
                            onChange={(e) => handleChange(idx, 'answer', e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addQna}
                    className="w-full bg-blue-100 text-gray-800 py-2 rounded hover:bg-gray-200 transition"
                >
                    + Add QnA
                </button>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </PageWrapper>
    );
}