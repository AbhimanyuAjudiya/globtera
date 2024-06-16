import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
  id: number;
  title: string;
  content: string;
  publishedOn: string;
  org: {
    id: any;
    name: string;
  };
}

export const useBlog = (id: number) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/org/posts/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return { blog, loading };
};

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/org/posts`, {
            headers: {
                Authorization: localStorage.getItem("token") || ""
            }
        })
        .then(res => {
            setBlogs(res.data); // Assuming backend response is { blogs: [...] }
            setLoading(false);
        })
        .catch(error => {
            console.error("Failed to fetch blogs", error);
            setLoading(false); // Ensure loading state is set to false on error
        });
    }, []); // Empty dependency array ensures the effect runs once

    return {
        loading,
        blogs
    };
};