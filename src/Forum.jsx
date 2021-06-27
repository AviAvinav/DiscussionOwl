import React, {useRef, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import db from './firebase';
import { useStateValue } from './StateProvider';
import './App.css';
import ProfileData from './ProfileData';
import ForumCard from './ForumCard';
import CreateForumPost from './CreateForumPost';

export default function Forum(){

  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searches, setSearches] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const [searchText, setSearchText] = useState('');
  const searchRef = useRef();

  useEffect(() => {
    // Realtime connection to database
    db.collection("posts")
      .orderBy("dateCreated", "desc")
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data()})))
      });
  }, []);

  function searchPosts(){
    let tempArray = [];
    posts.forEach(item => {
      if(()=>item.data.title.innerText.toLowerCase().includes(searchText)){
        tempArray.push(item);
        console.log(`${item.data.title} -has- ${searchText}`);
      }
    });//fix
    setSearches(tempArray);
  }

  function handleSearch(){
    setSearchText(searchRef.current.value);
    searchPosts();
  }

  return (
    <div className="content">
      <div className="forum-controls">
        <input className="form-control" placeholder="Search Forum" ref={searchRef} />
        <button className="btn btn-primary btn-sml" onClick={handleSearch}>Search<img src="./src/search.svg"/></button>
        {user ? (
          <>
            <div className="verticle-hr"></div>
            <Link to="/createForumPost" className="create-forum-post-link">
              <button className="btn btn-primary btn-sml" style={{fontSize: "18px"}}>Add To Forum<img src="./src/plus.svg"/></button>
            </Link>
          </>) : ('')}
      </div>
      {posts.length > 0 ? (
        searches.length > 0 ? (
          searches.map(post => (
            <ForumCard
              key={post.id}
              title={post.data.title}
              postedPfpSrc={post.data.postedUserPfpSrc}
              textContent={post.data.textContent}
              username={post.data.username}
              currentUserPfpSrc={user ? (user.photoURL) : ('https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg')}
              dateCreated={post.data.dateCreated}
              comments={post.data.comments}
            />
          ))
        ) : (
          posts.map((post)=>(
            <ForumCard 
              key={post.id}
              title={post.data.title}
              postedPfpSrc={post.data.postedUserPfpSrc}
              textContent={post.data.textContent}
              username={post.data.username}
              currentUserPfpSrc={user ? (user.photoURL) : ('https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg')}
              dateCreated={post.data.dateCreated}
              comments={post.data.comments}
              postId={post.id}
            />
          ))
        )
      ) : (
        <h4 style={{marginTop: "20px"}}>There are currently no forum posts</h4>
      )}
    </div>
  );
}