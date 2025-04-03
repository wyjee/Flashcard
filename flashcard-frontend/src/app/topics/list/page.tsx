'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTopics } from '@/lib/api';

type Topic = {
  id: number;
  title: string;
};

export default function TopicListPage() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    getTopics().then(setTopics);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📒 Topic List</h1>
      <div className="space-y-2">
        {topics.map((topic) => (
          <Link key={topic.id} href={`/topics?id=${topic.id}`}>
            <div className="border rounded p-3 hover:bg-gray-100 cursor-pointer">{topic.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
