import React, {useState, useRef} from 'react';
import {Switch, Route, BrowserRouter as Router, Link} from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'

import './App.css';
import Forum from './Forum';
import FlashCard from './FlashCard';
import { useStateValue } from './StateProvider';
import ProfileData from './ProfileData';
import CreateForumPost from './CreateForumPost'
import { actionTypes } from './reducer'
import { auth, provider } from './firebase'

function App() {

  const [{ user }, dispatch] = useStateValue();
  const [state, stateDispatch] = useStateValue();

  const [progress, setProgress] = useState(0)
  const [signOutBtnShowing, setSignOutBtnShowing] = useState(false);
  const signOutBtn = useRef();

  const SignIn = () => {
    //   Sign in
    auth.signInWithPopup(provider).then(result => {
      stateDispatch({
        type: actionTypes.SET_USER,
        user: result.user,
      })
      console.log(result.user);
    }).catch(err => {alert(err.message)}); 
  };

  const SignOut = () => {
    auth.signOut().then(() => {
      console.log('succesful sign out');
      window.location.reload(true)
    }).catch(err => {alert(err.message)});
  };

  function toggleSignOut(){
    if(signOutBtnShowing){
      signOutBtn.current.style.transform = 'translateX(90px)';
      setSignOutBtnShowing(false);
    }else{
      signOutBtn.current.style.transform = 'translateX(-5px)';
      setSignOutBtnShowing(true);
    }
  }

  return (
    <Router>
      <div className="body-wrapper">
        <LoadingBar
          color='#f11946'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <div className="header">
          <div className="d-flex flex-row align-items-center">
            <Link to="/forum">
              <button className="btn btn-primary btn-sml m-1 ml-2">Forum</button>
            </Link>
            {user ? (
              <Link to="/flashcard">
                <button className="btn btn-primary btn-sml m-1">FlashCard</button>
              </Link>
            ) : (
              <h6 style={{margin: "0", marginLeft: "8px"}}>Sign in for better user experience</h6>
            )}
          </div>
          <div>
            {!user ? (
              <button className="btn btn-success btn-sml m-2" onClick={SignIn}>Sign in with Google</button>
            ) : (
              <div className="sign-out-btn-wrapper" ref={signOutBtn}>
                <div className="profile-hover" onClick={toggleSignOut}>
                  <ProfileData pfpSrc={user.photoURL} username={user.displayName} />
                </div>
                <Link to="/">
                  <button className="sign-out-btn btn btn-danger btn-sml" onClick={SignOut}>Sign Out</button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="content" style={{paddingTop: "0"}}>
          <Switch>
            <Route exact path="/">
              <Forum/>
            </Route>
            <Route exact path="/forum">
              <Forum/>
            </Route>
            <Route exact path="/flashcard">
              <FlashCard/>
            </Route>
            <Route exact path="/createForumPost">
              <CreateForumPost/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;