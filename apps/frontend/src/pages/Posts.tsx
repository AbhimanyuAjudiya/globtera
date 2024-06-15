import { AppBar } from "../components/AppBar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Blog, useBlogs } from "../hooks";

export const Posts = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div>
        <AppBar />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div>
        <AppBar />
      </div>
      <div className="flex justify-center">
        <div>
          {blogs.map((blog: Blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={blog.org.name || ""}
              title={blog.title}
              content={blog.content}
              publishedDate={new Date(blog.publishedOn).toLocaleDateString()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
