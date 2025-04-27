'use client';

import { motion } from 'framer-motion';
import QnaCard from '@/components/QnaCard';

interface QnaItemProps {
    qna: {
        id: number;
        question: string;
        answer: string;
    };
    onSwipeNext: () => void;
    onSwipePrev: () => void;
    onUpdate: () => void;
    onDelete: () => void;
}

export default function QnaItem({ qna, onSwipeNext, onSwipePrev, onUpdate, onDelete }: QnaItemProps) {
    return (
        <motion.div
            key={qna.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center"
        >
            <QnaCard
                qna={qna}
                onSwipeNext={onSwipeNext}
                onSwipePrev={onSwipePrev}
            />
            <div className="flex gap-2 mt-4">
                <button
                    className="bg-yellow-400 text-black px-4 py-2 rounded"
                    onClick={onUpdate}
                >
                    Update
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </motion.div>
    );
}