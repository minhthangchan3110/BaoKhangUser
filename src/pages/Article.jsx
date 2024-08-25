import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Helmet from "../components/Helmet/Helmet";

export default function Article() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlog(data);
          setTitle(data.title);
          setContentBlocks(data.contentBlocks || []);
        } else {
          setError("Không tìm thấy bài viết.");
        }
      } catch (err) {
        setError("Lỗi khi tải bài viết.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Helmet>
      <h1>{title}</h1>
      <div>
        {contentBlocks.map((block, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: block }} />
        ))}
      </div>
    </Helmet>
  );
}
