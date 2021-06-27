import React, {useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import './App.css';
import ProfileData from './ProfileData';
import { useStateValue } from './StateProvider';
import db from './firebase';
import firebase from './firebase';

export default function CreateForumPost(){
  const fileUploadRef = useRef();
  const fileContentRef = useRef();
  const titleRef = useRef();
  const postContentRef = useRef();
  const inpRef = useRef();

  const [{ user }, dispatch] = useStateValue();

  const [title, setTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const handleSubmit = e => {
    if(getValidInputs()){
      db.collection('posts').add({
        username: user.displayName,
        textContent: postContent,
        title: title,
        postedUserPfpSrc: user.photoURL,
        dateCreated: new Date().toUTCString(),
        comments: [],
      });

      setTitle('');
      setPostContent('');
    }
  }

  function getValidInputs(){
    return (title != '' && postContent != '');
  }

  function handleTitleChange(){
    setTitle(titleRef.current.value);
  }

  function handleContentChange(){
    setPostContent(postContentRef.current.value);
  }

  const resetData = () => {
    setTitle('');
    setPostContent('');
  }

  return(
    <div className="content" style={{marginTop: "0"}}>
      <div className="forum-card">
        <ProfileData
          pfpSrc={user ? (user.photoURL) : ('https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg')}
          username={user.displayName}
        />
        <input className="form-control" placeholder="Post Title" style={{width: "22rem", marginTop: "6px"}} onChange={handleTitleChange} ref={titleRef} />
        <hr/>
        <textarea className="form-control" rows="3" placeholder="Add Post Content" onChange={handleContentChange} ref={postContentRef} />
        <div className="forum-img-wrapper">
          <input
            type="file"
            className="file-input"
            multiple="multiple"
            ref={inpRef}
          />
        </div>
        <div className="comment-submits">
          <Link to="/forum">
            <button className="btn btn-secondary btn-sml mr-1 mt-2" onClick={resetData}>Cancel</button>
          </Link>
          {getValidInputs() ? (<Link to="/forum">
            <button className="btn btn-primary btn-sml ml-1 mt-2" onClick={handleSubmit}>Post</button>
          </Link>) : (
            <button className="btn btn-primary btn-sml ml-1 mt-2" onClick={handleSubmit}>Post</button>
          )}
        </div>
      </div>
    </div>
  );
}