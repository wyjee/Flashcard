export type Qna = {
    id?: number;
    question: string;
    answer: string;
    type?: string;
    options?: string[];
    correct_answers: string[];
}