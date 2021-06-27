import React, { useState, useRef } from 'react';
import './App.css';
import ProfileData from './ProfileData';
import { useStateValue } from './StateProvider';
import db from './firebase';

export default function ForumCard({ postedPfpSrc, username, title, textContent, currentUserPfpSrc, dateCreated, comments, postId, likes, dislikes }) {
  const [{ user }, dispatch] = useStateValue();
  const commentInput = useRef();
  const [commentText, setCommentText] = useState('');
  const [showingComments, setShowingComments] = useState(false);

  function handleCommentInput() {
    setCommentText(commentInput.current.value);
  }

  function handleCommentCancel(){
    setCommentText('');
  }

  function handleShowComments(){
    if(showingComments){
      setShowingComments(false);
    }else{
      setShowingComments(true);
    }
  }

  function handleCommentPost(){
    if(commentText != ''){
      db.collection('posts').doc(postId).set({
        username: username,
        textContent: textContent,
        title: title,
        postedUserPfpSrc: postedPfpSrc,
        dateCreated: dateCreated,
        comments: [{pfpSrc: currentUserPfpSrc, username: user.displayName, textContent: commentInput.current.value + ' '}, ...comments],
      });
      setCommentText('');
    }
  }

  function getValidDisplayName(){
    let tempName = user.displayName;
    while(tempName.includes(' ')){
      tempName = tempName.replace(' ', '_');
    }
    return tempName;
  }

  return (
    <div className="forum-card">
      <div className="forum-post-data">
        <ProfileData pfpSrc={postedPfpSrc} username={username} />
      </div>
      <h3>{title}</h3>
      <hr />
      <p>{textContent}</p>
      <div className="comment-input">
      {user ? (
        <>
          <div className="d-flex flex-row">
            <div className="forum-user-pfp">
              <img src={currentUserPfpSrc} />
            </div>
            <textarea rows="2" cols="50" placeholder="Add public comment" className="form-control" type="text" onChange={handleCommentInput} ref={commentInput} value={commentText}></textarea>
          </div>
        </>) : ('')}
        <div className="comment-submits">
          <button className="btn btn-outline-secondary btn-sml mt-2" onClick={handleShowComments}>Show Comments ({comments.length})</button>
          <div>
            {user ? (
              <>
                <button className="btn btn-secondary btn-sml mr-1 mt-2" onClick={handleCommentCancel}>Cancel</button>
                <button className="btn btn-primary btn-sml ml-1 mt-2" onClick={handleCommentPost}>Post</button>
              </>) : ('')}
          </div>
        </div>
        {showingComments ? (
          comments.map(comment => (
            <div className="mt-2" style={{
              background: user && comment.textContent.includes(`@${getValidDisplayName()} `) ? 'rgba(40, 167, 69, 0.18)' : 'white',
              borderRadius: "4px"
            }}>
              <ProfileData pfpSrc={comment.pfpSrc} username={comment.username} bgColor={user && comment.textContent.includes(`@${getValidDisplayName()} `) ? 'rgba(255, 255, 255, 0)' : '#fff'} />
              <span className="comment-text">{comment.textContent}</span>
            </div>
          ))
        ) : (
          ''
        )}
      </div>
    </div>
  );
}