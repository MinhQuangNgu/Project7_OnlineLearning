import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addLove, removeLove } from "./slice";

const BlogDetail = () => {
  const btnRef = useRef();
  const love = useSelector((state) => state.blogReducer);
  const dispatch = useDispatch();
  const { react, countReact } = love;
  const handleReact = () => {
    if (react === false) {
      dispatch(addLove());
    } else {
      dispatch(removeLove());
    }
  };
  const handleBtn = (e) => {
    if (e.target.value === "") {
      btnRef.current.className = "comment_btn_up";
    } else {
      btnRef.current.className = "comment_btn_up active";
    }
  };
  return (
    <div className="blog_detail">
      <div className="blog_detail_user">
        <div className="blog_detail_user_info">
          <h2>Nguyen Dinh Hoan</h2>
          <div className="blog_detail_user_react">
            <div className="blog_detail_user_react_love" onClick={handleReact}>
              {react === false ? (
                <i className="fa-regular fa-heart"></i>
              ) : (
                <i className="fa-solid fa-heart"></i>
              )}

              <span>{countReact}</span>
            </div>
            <i
              style={{
                marginLeft: "40px",
              }}
              className="fa-regular fa-comment"
            ></i>
          </div>
        </div>
      </div>
      <div className="blog_detail_center">
        <div className="blog_detail_center_header">
          <h2>
            Bỏ túi 21 lệnh Git cơ bản + Cách nhớ, giúp newDev làm chủ Git quản
            lý tốt mã nguồn!
          </h2>
        </div>
        <div className="blog_detail_center_info">
          <img src="https://res.cloudinary.com/sttruyen/image/upload/v1673249807/another/b6sudrpaizo80snhsq9m.png" />
          <div className="blog_detail_center_info_user">
            <h2>Nguyen Dinh Hoan</h2>
          </div>
        </div>
        <div className="blog_detail_center_content">
          <p>
            {" "}
            What is Git: Features, Command and Workflow in Git Lesson 2 of 11By
            Sayeda Haifa Perveez Last updated on Dec 9, 2022161344 What is Git:
            Features, Command and Workflow in Git PreviousNext Table of Contents
            What is Git?Features of GitGit WorkflowBranch in GitCommands in
            GitView More Git is a DevOps tool used for source code management.
            It is a free and open-source version control system used to handle
            small to very large projects efficiently. Git is used to tracking
            changes in the source code, enabling multiple developers to work
            together on non-linear development. Linus Torvalds created Git in
            2005 for the development of the Linux kernel. Learn the basics of
            Git VCS and understand how to setup Git in your system with the Git
            Training Course. Check out the course now. Before diving deep, let’s
            explain a scenario before Git: Developers used to submit their codes
            to the central server without having copies of their own Any changes
            made to the source code were unknown to the other developers There
            was no communication between any of the developers business Now
            let’s look at the scenario after Git: Every developer has an entire
            copy of the code on their local systems Any changes made to the
            source code can be tracked by others There is regular communication
            between the developers business-org Learn Concepts - Basics to
            Advanced! Caltech Program in DevOpsEXPLORE PROGRAMLearn Concepts -
            Basics to Advanced! What is Git? Git is a version control system
            used for tracking changes in computer files. It is generally used
            for source code management in software development. Git is used to
            tracking changes in the source code The distributed version control
            tool is used for source code management It allows multiple
            developers to work together It supports non-linear development
            through its thousands of parallel branches Features of Git Tracks
            history Free and open source Supports non-linear development Creates
            backups Scalable Supports collaboration Branching is easier
            Distributed development
          </p>
        </div>
      </div>
      <div className="warper_cover">
        <div className="comment">
          <div className="comment_header">
            <h2>No Comment</h2>
          </div>
          <div className="comment_content">
            <img src="https://res.cloudinary.com/sttruyen/image/upload/v1673249807/another/b6sudrpaizo80snhsq9m.png" />
            <input onChange={handleBtn} placeholder="Write your comment" />
          </div>
          <div className="comment_btn">
            <button className="comment_btn_close">Close</button>
            <button ref={btnRef} className="comment_btn_up">
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlogDetail;
