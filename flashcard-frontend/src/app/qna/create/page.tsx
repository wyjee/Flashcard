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
        setQnas([...qnas, {
            question: '',
            answer: '',
            type: 'text',
            options: [],
            correctAnswers: [],
        }]);
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
                        <textarea
                            placeholder="Question"
                            value={qna.question}
                            onChange={(e) => handleChange(idx, 'question', e.target.value)}
                            className="w-full mb-2 border px-4 py-2 rounded"
                            required
                        />
                        <select
                            value={qna.type || 'text'}
                            onChange={(e) => handleChange(idx, 'type', e.target.value as 'text' | 'multiple')}
                            className="w-full mb-2 border px-4 py-2 rounded"
                        >
                            <option value="text">기본 문제</option>
                            <option value="multiple">다중 선택 문제</option>
                        </select>
                        <textarea
                            placeholder="Answer"
                            value={qna.answer}
                            onChange={(e) => handleChange(idx, 'answer', e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                        {qna.type === 'multiple' && (
                            <div className="space-y-2">
                                {qna.options?.map((opt, optIdx) => {
                                    const label = String.fromCharCode(65 + optIdx);
                                    const isCorrect = qna.correctAnswers?.includes(label);
                                    return (
                                        <div key={optIdx} className="flex items-center gap-2">
                                            <input
                                                className="flex-1 border rounded px-2 py-1"
                                                placeholder={`옵션 ${label}`}
                                                value={opt}
                                                onChange={(e) => {
                                                    const updatedOptions = [...(qna.options || [])];
                                                    updatedOptions[optIdx] = e.target.value;
                                                    handleChange(idx, 'options', updatedOptions);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className={`px-2 py-1 rounded ${isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                                onClick={() => {
                                                    const updated = new Set(qna.correctAnswers || []);
                                                    if (updated.has(label)) {
                                                        updated.delete(label);
                                                    } else {
                                                        updated.add(label);
                                                    }
                                                    handleChange(idx, 'correctAnswers', Array.from(updated));
                                                }}
                                            >
                                                정답
                                            </button>
                                        </div>
                                    );
                                })}
                                <button
                                    type="button"
                                    className="text-sm text-blue-600"
                                    onClick={() => {
                                        const updatedOptions = [...(qna.options || []), ''];
                                        handleChange(idx, 'options', updatedOptions);
                                    }}
                                >
                                    + 옵션 추가
                                </button>
                            </div>
                        )}
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