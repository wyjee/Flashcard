'use client';

import { useState } from 'react';

export default function QnaCard({ qna }: { qna: any }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full h-40 perspective cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div className={`card-inner w-full h-full ${flipped ? 'card-flipped' : ''}`}>
        <div className="card-face bg-white border rounded shadow p-4">
          <h2 className="font-semibold text-lg">{qna.question}</h2>
        </div>

        <div className="card-face card-back bg-gray-100 border rounded shadow p-4">
          <p>{qna.answer}</p>
        </div>
      </div>
    </div>
  );
}
