import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Comments.css";
import DisplayComments from "./DisplayComments";
import { postComment } from "../../actions/comments";

function Comments({ videoId }) {
  const [commentText, setCommentText] = useState("");

  const CurrentUser = useSelector((state) => state?.CurrentUserReducer);
  const commentsList = useSelector((s) => s.commentReducer);

  // const commentsList = [
  //   {
  //     _id: "1",
  //     commentBody: "hello",
  //     userCommented: "abc",
  //   },
  //   {
  //     _id: "2",
  //     commentBody: "hii",
  //     userCommented: "xyz",
  //   },
  // ];
  const dispatch = useDispatch();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (CurrentUser) {
      if (!commentText) {
        alert("Please enter a comment");
      } else {
        dispatch(
          postComment({
            videoId: videoId,
            userId: CurrentUser?.result._id,
            commentBody: commentText,
            userCommented: CurrentUser?.result.name,
          })
        );
        setCommentText("");
      }
    } else {
      alert("Please login to comment");
    }
  };
  return (
    <>
      <form className="comments_sub_form_comments" onSubmit={handleOnSubmit}>
        <input
          type="text"
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add comment..."
          value={commentText}
          className="comment_ibox"
        />
        <input
          type="submit"
          value="add"
          className="comments_add_btn_comments"
        />
      </form>
      <div className="display_comment_container">
        {commentsList?.data
          ?.filter((q) => videoId === q?.videoId)
          .reverse()
          .map((m) => {
            return (
              <DisplayComments
                cId={m._id}
                userId={m.userId}
                commentBody={m.commentBody}
                commentOn={m.commentOn}
                userCommented={m.userCommented}
              />
            );
          })}
      </div>
    </>
  );
}

export default Comments;
