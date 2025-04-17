'use client'
import TopicListItem from "@/components/topic/TopicListItem";
import PageWrapper from "@/components/layout/PageWrapper";
import {useTopics} from "@/hooks/useTopics";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import { useEffect } from "react";

export default function Home() {
    const name = 'Home'
    const {data: currentUser} = useCurrentUser();
    const {data: topics, isLoading, isError} = useTopics();

    useEffect(() => {
        console.log("[테스트] API BASE:", process.env.NEXT_PUBLIC_API_BASE_URL);
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (isError || !topics) return <p>Something went wrong</p>;

    return (
        <PageWrapper title={name} showCreateTopicButton={!!currentUser}>
            <main>
                {/* 학습 통계 요약 컴포넌트 */}
                {topics.map((topic) => <TopicListItem key={topic.id} topic={topic}/>)}
            </main>
            <footer></footer>
        </PageWrapper>
    );
}