import type {Qna} from '@/types/Qna'

export type Topic = {
    id: number;
    title: string;
    qnas?: Qna[];
};