'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getTopicDetails } from '@/lib/api';
import QnaCard from '@/components/QnaCard';

export default function TopicDetailPage() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('id');
  const [qnas, setQnas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (topicId) {
      getTopicDetails(topicId).then((res) => {
        setQnas(res.qnas || []);
        setCurrentIndex(0); // 새 topic이면 index 초기화
      });
    }
  }, [topicId]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 < qnas.length ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
  };

  const currentQna = qnas[currentIndex];

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold mb-2">🧠 QNAs for Topic {topicId}</h1>

      {currentQna ? <QnaCard key={currentQna.id} qna={currentQna} /> : <p>No QNAs available.</p>}

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
        href="/topics/list"
        className="fixed bottom-4 right-4 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow hover:bg-gray-700 transition"
      >
        ← Back To List
      </Link>
    </div>
  );
}
