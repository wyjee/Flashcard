'use client';

import {motion} from 'framer-motion';
import QnaCard from '@/components/QnaCard';
import type {Qna} from '@/types/Qna'

interface QnaItemProps {
    qna: Qna;
    onSwipeNext: () => void;
    onSwipePrev: () => void;
}

export default function QnaItem({qna, onSwipeNext, onSwipePrev}: QnaItemProps) {
    return (
        <motion.div
            key={qna.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3}}
            className="w-full h-full flex flex-col items-center justify-center"
        >
            <QnaCard
                qna={qna}
                onSwipeNext={onSwipeNext}
                onSwipePrev={onSwipePrev}
            />
        </motion.div>
    );
}