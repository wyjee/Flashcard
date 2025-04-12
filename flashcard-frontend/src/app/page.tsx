'use client'
import TopicListItem from "@/components/topics/TopicListItem";
import PageWrapper from "@/components/layout/PageWrapper";
import {useTopics} from "@/hooks/UseTopics";
import {useCurrentUser} from "@/hooks/useCurrentUser";

export default function Home() {
    const name = 'Home'
    const {data: currentUser} = useCurrentUser();
    const {data: topics, isLoading, isError} = useTopics();

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