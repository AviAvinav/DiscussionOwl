import React from 'react';
import './App.css';

export default function ProfileData({pfpSrc, username, bgColor}){
  return(
    <div className="forum-user-wrapper" style={{background: bgColor}}>
      <div className="forum-user-pfp">
        <img src={pfpSrc} />
      </div>
      <h5>{username}</h5>
    </div>
  );
}