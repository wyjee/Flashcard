'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import {useMutation} from '@tanstack/react-query';
import api from '@/lib/api';
import type {Qna} from '@/types/Qna';

export default function CreateQnaPage() {
    const router = useRouter();

    const [topicForm, setTopicForm] = useState<{
        title: string;
        description: string;
        is_public: boolean;
    } | null>(null);

    const [qnas, setQnas] = useState<Qna[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('temp-topic');
        if (stored) {
            setTopicForm(JSON.parse(stored));
        } else {
            alert('Topic information is missing. Please fill the form completely.');
            router.push('/topic/create');
        }
    }, [router]);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!topicForm) throw new Error('Topic form is missing');
            if (qnas.length === 0) throw new Error('Please add at least one QnA');

            const topicRes = await api.post('/topics', topicForm);
            const topicId = topicRes.data.id;

            await api.post(`/topics/${topicId}/qnas`, {qnas});

            localStorage.removeItem('temp-topic');
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
                    {mutation.isPending ? 'Submitting...' : 'Submit All QnAs'}
                </button>
            </form>
        </PageWrapper>
    );
}