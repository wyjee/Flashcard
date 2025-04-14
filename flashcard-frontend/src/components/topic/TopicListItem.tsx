import Link from "next/link";
import {TopicItem} from "@/types/TopicListItem";

type Props = {
    topic: TopicItem;
};

const TopicListItem = ({topic}: Props) => {
    return (
        <Link key={topic.id} href={`/topic?id=${topic.id}`}>
            <div className="border rounded p-3 transition hover:bg-gray-500/25 cursor-pointer">
                {topic.title}
            </div>
        </Link>
    );
};

export default TopicListItem;