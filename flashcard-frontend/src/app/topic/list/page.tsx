'use client';

import TopicListItem from "@/components/topic/TopicListItem";
import {useTopics} from "@/hooks/useTopics";


export default function TopicListPage() {
    const {data: topics, isLoading, isError} = useTopics();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !topics) return <p>Something went wrong</p>;


    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Topic List</h1>
            <div className="flex flex-col space-y-2">
                {topics.map((topic) => <TopicListItem key={topic.id} topic={topic}/>)}
            </div>
        </div>
    );
}
