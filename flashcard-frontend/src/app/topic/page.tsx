'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {AnimatePresence} from 'framer-motion';
import {useTopicDetail} from '@/hooks/useTopicDetail';
import {useDeleteTopic} from '@/hooks/useTopics';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/DropdownMenu';
import {MoreVertical} from 'lucide-react';
import QnaItem from '@/components/qna/QnaItem';

export default function TopicDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topicId = searchParams.get('id');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [topicTitle, setTopicTitle] = useState('');
    const {data: topicDetail, isLoading, isError} = useTopicDetail(Number(topicId));
    const deleteTopic = useDeleteTopic();

    const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (topicDetail) {
            setCurrentIndex(0);
            setTopicTitle(topicDetail.title || '');
            const shuffledQnas = [...topicDetail.qnas].sort(() => Math.random() - 0.5);
            topicDetail.qnas = shuffledQnas;
        }
    }, [topicDetail]);

    if (isLoading) return <p>Loading...</p>;
    if (isError || !topicDetail?.qnas?.length) return <p>No QNAs available.</p>;

    const qnas = topicDetail.qnas;
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1 < qnas.length ? prev + 1 : prev));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
    };

    const handleSelectAnswer = (qnaIdx: number, choice: string) => {
        setUserAnswers((prev) => {
            const current = prev[qnaIdx] || [];
            return {
                ...prev,
                [qnaIdx]: current.includes(choice)
                    ? current.filter(c => c !== choice)
                    : [...current, choice],
            };
        });
    };

    const handleSubmitAnswers = () => {
        let correct = 0;
        qnas.forEach((qna, i) => {
            const user = new Set(userAnswers[i] || []);
            const correctSet = new Set(qna.correctAnswers || []);
            if (user.size === correctSet.size && [...user].every(a => correctSet.has(a))) {
                correct += 1;
            }
        });
        alert(`점수: ${correct} / ${qnas.length}`);
        setIsComplete(true);
    };

    const handleEditTopic = () => {
        if (topicId) {
            router.push(`/topic/${topicId}/edit`);
        }
    };

    const handleDeleteTopic = async () => {
        if (topicId && confirm('Are you sure you want to delete this topic?')) {
            await deleteTopic.mutateAsync(Number(topicId));
            router.push('/topic/list');
        }
    };

    return (
        <div className="p-6 flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold mb-2">{topicTitle}</h1>

            {isError && <p className="text-red-500">Failed to load topic.</p>}
            {isLoading && <p>Loading...</p>}

            {!isError && !isLoading && (
                <>
                    <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            {qnas && qnas.length > 0 ? (
                                (() => {
                                    const qna = qnas[currentIndex];
                                    return (
                                        <div className="w-full">
                                            <QnaItem qna={qna}/>
                                            {qna.type === 'multiple' && qna.options?.map((opt, i) => {
                                                const label = String.fromCharCode(65 + i);
                                                const selected = userAnswers[currentIndex]?.includes(label);
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSelectAnswer(currentIndex, label)}
                                                        className={`block w-full text-left px-4 py-2 border my-1 rounded ${
                                                            selected ? 'bg-blue-500 text-white' : 'bg-gray-100'
                                                        }`}
                                                    >
                                                        {label}. {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })()
                            ) : (
                                <p>No QNAs available.</p>
                            )}
                        </AnimatePresence>
                    </div>

                    {topicDetail?.qnas?.length > 0 && (
                        <>
                            <div className="flex gap-4 mt-4">
                                <button
                                    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                >
                                    ◀
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                                    onClick={handleNext}
                                    disabled={currentIndex >= topicDetail.qnas.length - 1}
                                >
                                    ▶
                                </button>
                            </div>

                            {currentIndex === qnas.length - 1 && !isComplete && (
                                <button
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={handleSubmitAnswers}
                                >
                                    채점하기
                                </button>
                            )}

                            <p className="text-sm text-gray-500 mt-2">
                                {currentIndex + 1} / {topicDetail.qnas.length}
                            </p>
                        </>
                    )}
                </>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger
                    className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded shadow hover:bg-gray-700 transition">
                    <MoreVertical/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleEditTopic}>Edit Topic</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteTopic}>Delete Topic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/')}>Go to Home</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}