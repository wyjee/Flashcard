'use client'
import TopicListItem from "@/components/topics/TopicListItem";
import {useTopics} from "@/hooks/UseTopics";

export default function Home() {
    const { data: topics, isLoading, isError } = useTopics();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !topics) return <p>Something went wrong</p>;

    return (
        <div>
            <main>
                {topics.map((topic) => <TopicListItem key={topic.id} topic={topic} />)}
            </main>
            <footer></footer>
        </div>
    );
}