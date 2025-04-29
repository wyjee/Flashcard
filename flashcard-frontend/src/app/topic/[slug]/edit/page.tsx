'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import {useTopicDetail} from '@/hooks/useTopicDetail';
import {useCreateQna, useDeleteQna, useUpdateQna} from '@/hooks/useQna';
import type {Qna} from '@/types/Qna';

export default function EditQnaPage() {
    const router = useRouter();
    const params = useParams();
    const topicId = params?.slug;
    const {data: topicDetail, isLoading, isError} = useTopicDetail(Number(topicId));
    const updateQna = useUpdateQna();
    const deleteQna = useDeleteQna();
    const createQna = useCreateQna();

    const [qnas, setQnas] = useState<Qna[]>([]);

    useEffect(() => {
        if (topicDetail?.qnas) {
            setQnas(topicDetail.qnas);
        }
    }, [topicDetail]);

    const handleChange = <K extends keyof Qna>(
        index: number,
        name: K,
        value: Qna[K]
    ) => {
        const newQnas = [...qnas];
        newQnas[index] = {
            ...newQnas[index],
            [name]: value,
        };
        setQnas(newQnas);
    };

    const handleUpdate = async (index: number) => {
        const qna = qnas[index];
        if (!qna.id) return;

        await updateQna.mutateAsync({
            qnaId: qna.id,
            question: qna.question,
            answer: qna.answer,
        });
        alert('Updated Succesfully!');
    };

    const handleDelete = async (index: number) => {
        const qna = qnas[index];
        if (!qna.id) return;

        if (confirm('Are you sure you want to delete this QnA?')) {
            await deleteQna.mutateAsync(qna.id);
            setQnas((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleAddQna = async () => {
        if (!topicId) return;
        const newQna = {question: '', answer: ''};
        const created = await createQna.mutateAsync({
            topicId: Number(topicId),
            ...newQna,
        });
        setQnas((prev) => [...prev, created]);
    };

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;
    if (isError) return <div className="text-center mt-10 text-red-500">Failed to load</div>;

    return (
        <PageWrapper title="Edit QnAs">
            <div className="max-w-md mx-auto space-y-6 mt-6">
                {qnas.map((qna, idx) => (
                    <div key={qna.id || idx} className="p-4 shadow rounded space-y-2 border">
                        <input
                            placeholder="Question"
                            value={qna.question}
                            onChange={(e) => handleChange(idx, 'question', e.target.value)}
                            className="w-full px-4 py-2 rounded
                                bg-surface-light dark:bg-gray-800
                                border border-gray-300 dark:border-gray-700
                                text-text-light dark:text-white
                                placeholder-gray-400 dark:placeholder-gray-500"
                            required
                        />
                        <textarea
                            placeholder="Answer"
                            value={qna.answer}
                            onChange={(e) => handleChange(idx, 'answer', e.target.value)}
                            className="w-full px-4 py-2 rounded
                                bg-surface-light dark:bg-gray-800
                                border border-gray-300 dark:border-gray-700
                                text-text-light dark:text-white
                                placeholder-gray-400 dark:placeholder-gray-500"
                            required
                        />
                        <div className="flex justify-between gap-2">
                            <button
                                onClick={() => handleUpdate(idx)}
                                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(idx)}
                                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddQna}
                    className="w-full bg-gray-100 border text-gray-800 py-2 rounded hover:bg-gray-200"
                >
                    + Add QnA
                </button>

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mt-4"
                >
                    Back
                </button>
            </div>
        </PageWrapper>
    );
}