import { React, useState } from "react";
import "./Comments.css";
import { useDispatch, useSelector } from "react-redux";
import { editComment, deleteComment } from "../../actions/comments";
import moment from "moment";

function DisplayComments({
  cId,
  commentBody,
  userId,
  commentOn,
  userCommented,
}) {
  const [edit, setEdit] = useState(false);
  const [cmtBdy, setCmtBdy] = useState("");
  const [cmtId, setCmtId] = useState("");
  const CurrentUser = useSelector((state) => state?.CurrentUserReducer);

  const handleEdit = (ctId, ctBdy) => {
    setEdit(true);
    setCmtId(ctId);
    setCmtBdy(ctBdy);
  };

  const dispatch = useDispatch();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!cmtBdy) {
      alert("Please enter a comment");
    } else {
      dispatch(
        editComment({
          id: cmtId,
          commentBody: cmtBdy,
        })
      );
      setCmtBdy("");
    }
    setEdit(false);
  };
  const handleDel = (id) => {
    dispatch(deleteComment(id));
  };
  return (
    <>
      {edit ? (
        <>
          <form
            className="comments_sub_form_comments"
            onSubmit={handleOnSubmit}
          >
            <input
              type="text"
              onChange={(e) => setCmtBdy(e.target.value)}
              placeholder="Edit comment..."
              value={cmtBdy}
              className="comment_ibox"
            />
            <input
              type="submit"
              value="Change"
              className="comments_add_btn_comments"
            />
          </form>
        </>
      ) : (
        <>
          <p className="comment_body">{commentBody}</p>
        </>
      )}
      <p className="usercommented">
        {" "}
        - {userCommented} commented {moment(commentOn).fromNow()}
      </p>
      {CurrentUser?.result._id === userId && (
        <p className="EditDel_DisplayComment">
          <i onClick={() => handleEdit(cId, commentBody)}>Edit</i>
          <i onClick={() => handleDel(cId)}>Delete</i>
        </p>
      )}
    </>
  );
}

export default DisplayComments;
