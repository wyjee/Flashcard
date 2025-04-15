'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import QnaCard from '@/components/QnaCard';
import {AnimatePresence} from 'framer-motion';
import {useTopicDetail} from '@/hooks/useTopicDetail';

export default function TopicDetailPage() {
    const searchParams = useSearchParams();
    const topicId = searchParams.get('id');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [topicTitle, setTitle] = useState('');
    const {data: topicDetail, isLoading, isError} = useTopicDetail(Number(topicId));

    useEffect(() => {
        if (topicId) {
            setCurrentIndex(0);
            setTitle(topicDetail?.title || '')
        }
    }, [topicId]);

    if (isLoading) return <p>Loading...</p>;
    if (isError || !topicDetail?.qnas?.length) return <p>No QNAs available.</p>;

    const qnas = topicDetail.qnas;
    const currentQna = qnas[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1 < qnas.length ? prev + 1 : prev));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
    };

    return (
        <div className="p-6 flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold mb-2">{topicTitle}</h1>

            <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    {currentQna && (
                        <QnaCard
                            key={currentQna.id}
                            qna={currentQna}
                            onSwipeNext={handleNext}
                            onSwipePrev={handlePrev}
                        />
                    )}
                </AnimatePresence>
            </div>

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
                    disabled={currentIndex >= qnas.length - 1}
                >
                    ▶
                </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
                {currentIndex + 1} / {qnas.length}
            </p>

            <Link
                href="/topic/list"
                className="fixed bottom-4 right-4 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow hover:bg-gray-700 transition"
            >
                ← Back To List
            </Link>
        </div>
    );
}
