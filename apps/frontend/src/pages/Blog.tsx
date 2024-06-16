import { useParams } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { FullBlog } from "../components/FullBlog";
import { useBlog } from "../hooks";
import { BlogSkeleton } from "../components/BlogSkeleton";

export function Blog() {
  const { id } = useParams<{ id: string }>();
  const { loading, blog } = useBlog(Number(id));

  if (loading) {
    return (
      <div>
        <AppBar />
        <BlogSkeleton />
      </div>
    );
  }

  return (
    <div>
      <AppBar />
      {/* @ts-ignore */}
      <FullBlog blog={blog} />
    </div>
  );
}
