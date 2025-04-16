'use client';

import {motion} from 'framer-motion';
import {useState} from 'react';
import type {Qna} from '@/types/Qna'

export default function QnaCard({
                                    qna,
                                    onSwipeNext,
                                    onSwipePrev,
                                }: {
    qna: Qna;
    onSwipeNext: () => void;
    onSwipePrev: () => void;
}) {
    const [flipped, setFlipped] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);

    return (
        <motion.div
            key={qna.id}
            className="w-[90%] max-w-md h-[280px] cursor-pointer perspective"
            initial={{x: 0, y: 0, opacity: 0, scale: 0.95}}
            animate={{x: 0, y: 0, opacity: 1, scale: 1}}
            exit={{
                x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
                y: direction === 'up' ? -200 : direction === 'down' ? 200 : 0,
                opacity: 0,
                rotate: direction === 'left' ? -10 : direction === 'right' ? 10 : 0,
            }}
            transition={{duration: 0.3}}
            drag
            dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}}
            dragElastic={0.2}
            onClick={() => setFlipped((prev) => !prev)}
            onDragEnd={(event, info) => {
                const offsetX = info.offset.x;
                const offsetY = info.offset.y;

                if (Math.abs(offsetX) > Math.abs(offsetY)) {
                    // 좌우
                    if (offsetX < -100) {
                        setDirection('left');
                        onSwipeNext();
                    } else if (offsetX > 100) {
                        setDirection('right');
                        onSwipePrev(); // ✅ 오른쪽 → 이전 카드
                    }
                } else {
                    // 상하
                    if (offsetY < -100) {
                        setDirection('up');
                        onSwipeNext();
                    } else if (offsetY > 100) {
                        setDirection('down');
                        onSwipePrev(); // ✅ 아래 → 이전 카드
                    }
                }
            }}
        >
            <div
                className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
                    flipped ? 'rotate-y-180' : ''
                }`}
            >
                {/* 앞면 */}
                <div
                    className="absolute w-full h-full backface-hidden bg-white border rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center">
                    <h2 className="text-lg font-bold mb-2">{qna.question}</h2>
                </div>

                {/* 뒷면 */}
                <div
                    className="absolute w-full h-full backface-hidden bg-gray-100 border rounded-xl shadow-lg p-6 rotate-y-180 flex flex-col justify-center items-center text-center">
                    <p className="text-sm text-gray-800">{qna.answer}</p>
                </div>
            </div>
        </motion.div>
    );
}
