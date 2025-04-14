'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import {useMutation} from '@tanstack/react-query';
import api from '@/lib/api';
import type {Qna} from '@/types/Qna'

export default function CreateQnaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topicId = searchParams.get('topicId');

    const [qnas, setQnas] = useState<Qna[]>([]);

    const mutation = useMutation({
        mutationFn: async () => {
            await api.post(`/topics/${topicId}/qnas`, {qnas}, {
                withCredentials: true,
            })
        },
        onSuccess: () => {
            router.push('/topic/list');
        },
    });

    const handleChange = (index: number, name: keyof Qna, value: string) => {
        const newQnas: Qna[] = [...qnas];
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

    return (
        <PageWrapper title="Create QnAs">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-6">
                {qnas.map((qna, idx) => (
                    <div key={idx} className="border p-4 rounded bg-white">
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
                    className="w-full bg-blue-100 text-blue-800 py-2 rounded hover:bg-blue-200 transition"
                >
                    + Add QnA
                </button>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    {mutation.isPending ? 'Saving QnAs...' : 'Submit All QnAs'}
                </button>
            </form>
        </PageWrapper>
    );
}
