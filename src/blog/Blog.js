import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import BlogCard from "../card/BlogCard";
import Pagination from "../paginating/Pagination";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import "./style.scss";
const Blog = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [listBLog, setListBlog] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loveBlog, setLoveBlog] = useState([]);
  const { cache } = useContext(UserContext);
  const [update, setUpdate] = useState(false);
  const page = new URLSearchParams(search).get("page") || 1;
  const auth = useSelector((state) => state?.auth);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!searchText) {
      let here = true;
      const url = `/api/common/blog?page=${page}&limit=20`;
      dispatch(isLoading());
      axios
        .get(url)
        .then((res) => {
          if (!here) {
            return dispatch(isSuccess());
          }
          setListBlog(res?.data);
          cache.current[url] = res?.data;
          console.log(res?.data);
          dispatch(isSuccess());
        })
        .catch((err) => {
          if (!here) {
            return dispatch(isFailing());
          }
          dispatch(isFailing());
          toast.error(err?.response?.data?.msg);
        });
      return () => {
        here = false;
      };
    }
    let here = true;
    const url = `/api/common/blog/blog_search?page=${page}&limit=20&search=${searchText}`;
    dispatch(isLoading());
    axios
      .get(url)
      .then((res) => {
        if (!here) {
          return dispatch(isSuccess());
        }
        setListBlog(res?.data);
        cache.current[url] = res?.data;
        console.log(res?.data);
        dispatch(isSuccess());
      })
      .catch((err) => {
        if (!here) {
          return dispatch(isFailing());
        }
        dispatch(isFailing());
        toast.error(err?.response?.data?.msg);
      });
    return () => {
      here = false;
    };
  }, [page, update]);
  const handleSearch = async () => {
    try {
      dispatch(isLoading());
      const res = await axios.get(
        `/api/common/blog/blog_search?page=${page}&limit=20&search=${searchText}`
      );
      console.log(searchText, page);
      setListBlog(res?.data);
      dispatch(isSuccess());
      return toast.success("All below is blog search");
    } catch (error) {
      setSearchText("");
      dispatch(isFailing());
      return toast.error(error?.response?.data?.msg);
    }
  };
  useEffect(() => {
    if (auth?.user?.token) {
      let here = true;
      const url = `/api/blog/mark_blog`;
      dispatch(isLoading());
      axios
        .get(url, {
          headers: {
            token: auth.user?.token,
          },
        })
        .then((res) => {
          if (!here) {
            return;
          }
          console.log(res?.data);
          setLoveBlog(res?.data?.blogs);
          cache.current[url] = res?.data?.blogs;
          dispatch(isSuccess());
        })
        .catch((err) => {
          dispatch(isFailing());
        });
      return () => {
        here = false;
      };
    }
  }, [update]);
  return (
    <div className="blog_container">
      <div className="blog_container_header">
        <div className="blog_container_header_left">
          <h2 style={{ fontSize: "4rem" }}>Blog</h2>
          <p>Share good blog here</p>
        </div>
        <div className="blog_container_header_right">
          <div className="blog_container_header_right_input">
            <input
              type="text"
              placeholder="Tìm kiếm blog"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="blog_container_body">
        <div className="blog_container_body_cards">
          {listBLog?.blogs?.map((item, index) => {
            return (
              <BlogCard
                key={index + "blogCard"}
                item={item}
                index={index + "blogCard"}
                update={update}
                setUpdate={setUpdate}
                loveBlog={loveBlog}
              />
            );
          })}
        </div>
      </div>
      <div className="pagination blog_page">
        <Pagination count={listBLog?.numPage} />
      </div>
    </div>
  );
};

export default Blog;
