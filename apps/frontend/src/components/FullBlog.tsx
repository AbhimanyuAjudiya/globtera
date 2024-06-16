import { useState } from "react";
import { Blog } from "../hooks";
import { Avatar } from "./BlogCard";
import axios from 'axios';
import { BACKEND_URL } from "../config";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [donationStatus, setDonationStatus] = useState("");

  const handleDonation = async () => {
    try {
      setDonationStatus("Processing...");
      const userId = Number(localStorage.getItem("userId")); 
      await axios.post(`${BACKEND_URL}/donation/donate`, {
        userId,
        // @ts-ignore
        orgId: blog.org.id,
        amount: parseFloat(donationAmount),
        secretKey, 
      });
      setDonationStatus("Donation successful!");
    } catch (error) {
      console.error('Donation error:', error);
      setDonationStatus("Donation failed. Please try again.");
    }
  };

  const paragraphs = blog.content.split("\n").filter((paragraph) => paragraph.trim() !== "");

  return (
    <div className="grid md:grid-cols-12 p-5">
      <div className="col-span-9 p-3">
        <div className="text-2xl font-extrabold">
          {blog.title}
        </div>
        <div className="text-sm font-light">
          Posted on {new Date(blog.publishedOn).toLocaleDateString()}
        </div>
        <div className="break-words">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="my-2">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm">Author</div>
        <div className="flex justify-normal">
          <div className="flex justify-center flex-col pr-2">
            <Avatar name={blog.org.name || "Anonymous"} />
          </div>
          <div className="text-lg font-semibold">
            {blog.org.name || "Anonymous"}
          </div>
        </div>
        {localStorage.getItem('userType') === "org" ? <></> :  <div className="mt-4">
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Enter donation amount"
            className="border rounded p-2"
          />
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter your secret key"
            className="border rounded p-2 mt-2"
          />
          <button
            onClick={handleDonation}
            className="ml-2 bg-blue-500 text-white p-2 rounded"
          >
            Donate
          </button>
          {donationStatus && <div className="mt-2 text-sm">{donationStatus}</div>}
        </div>}
      </div>
    </div>
  );
};
