import { Link } from "react-router-dom";

interface BlogCardProps {
    id: number;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
}

export const BlogCard = ({ authorName, title, content, publishedDate, id }: BlogCardProps) => {
    return (
        <Link to={`/blog/${id}`}>
            <div className="p-4 w-screen max-w-screen-md cursor-pointer">
                <div className="flex items-center space-x-2">
                    <Avatar name={authorName} />
                    <div className="font-extralight">{authorName}</div>
                    <Circle />
                    <div className="text-sm text-slate-500">{publishedDate}</div>
                </div>
                <div className="mt-2 text-2xl font-bold truncate">{title}</div>
                <div className="mt-1 text-sm font-thin text-ellipsis overflow-hidden line-clamp-3">{content.length >= 150 ? content.slice(0,150) + "..." : content}</div>
                <div className="mt-1 text-xs font-thin text-slate-500">
                    {`${Math.ceil(content.length / 100)} minutes`}
                </div>
                <div className="mt-4 bg-slate-200 h-1 w-full"></div>
            </div>
        </Link>
    );
};

const Circle = () => {
    return <div className="w-1 h-1 rounded-full dark:bg-gray-400"></div>;
}

export const Avatar = ({ name }: { name: string }) => {
    return (
        <div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{name[0]}</span>
        </div>
    );
};
