import Link from "next/link";
import { TopicItem } from "@/types/TopicListItem";

type Props = {
    topic: TopicItem
}

const TopicListItem = ({ topic }: Props) => {
    return (
        <Link key={topic.id} href={`/topics?id=${topic.id}`}>
            <div className="border rounded p-3 hover:bg-gray-100 cursor-pointer">{topic.title}</div>
        </Link>
    )
}

export default TopicListItem