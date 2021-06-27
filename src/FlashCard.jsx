import React, {useState, useRef, useEffect} from 'react';
import uuid from 'react-uuid';
import { useStateValue } from './StateProvider';
import db from './firebase';

export default function Forum(){
  const questionRef = useRef();
  const answerRef = useRef();
  const flip = useRef();

  const [{ user }, dispatch] = useStateValue();

  const [tempFlashcardList, setTempFlashcardList] = useState([]);
  const [flashcardQuestion, setFlashcardQuestion] = useState('');
  const [flashcardAnswer, setFlashcardAnswer] = useState('');
  const [posts, setPosts] = useState([]);
  const [isFlipped, setFlipped] = useState(false);
  
  const handleSubmit = () => {
    if(flashcardAnswer != '' && flashcardQuestion != ''){
      db.collection('flashcards').add({
        username: user.displayName,
        question: flashcardQuestion,
        answer: flashcardAnswer,
        dateCreated: new Date().toUTCString(),
        email: user.email
      });
      setTempFlashcardList([]);
      setFlashcardAnswer('');
      setFlashcardQuestion('');
    }
  }

  function handleAddFlashcard(){
    if(!(tempFlashcardList.length > 0)){
      setTempFlashcardList(prev => {
        return [...prev, {question: '', answer: '', hidden: true, id: uuid()}];
      });
    }
  }

  function removeTempFlashcard(tempItem){
    setTempFlashcardList(prev => {
      return prev.filter(item => {
        console.log(item);
        if(tempItem.id != item.id){
          return item;
        }else{
          return;
        }
      });
    });
  }

  function handleAnswerChange(){
    setFlashcardAnswer(answerRef.current.value);
  }

  function handleQuestionChange(){
    setFlashcardQuestion(questionRef.current.value);
  }

  useEffect(() => {
    // Realtime connection to database
    db.collection("flashcards")
      .orderBy("dateCreated", "desc")
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data()})))
      });
  }, []);

  return(
    <div className="flashcards-wrapper">
      {tempFlashcardList.map((item) => (
          <div className="flashcard">
            <div className="d-flex flex-column">
              <input
                ref={questionRef}
                onChange={handleQuestionChange}
                className="form-control mb-1"
                placeholder="Enter Question"
              />
              <input
                ref={answerRef}
                onChange={handleAnswerChange}
                className="form-control mt-1"
                placeholder="Enter Answer"
              />
            </div>
            <div className="f-flex flex-row">
              <button className="btn btn-secondary btn-sml mr-1" onClick={()=>removeTempFlashcard(item)}>Cancel</button>
              <button className="btn btn-primary btn-sml ml-1" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        )
      )}
      {posts.map((post) => (
          post.data.email == user.email ? (<div ref={flip} className="flashcard" onClick={() => post.data.hidden = !post.data.hidden && setFlipped(!isFlipped)}>
            {!isFlipped ? (
              <h4 style={{textAlign: "center"}}>Question:<br/>{post.data.question}</h4>
            ) : (
              <h4>Answer: <br/>{post.data.answer}</h4>
            )}
          </div>) : (
            ''
          )
        )
    )}
      <div className="flashcard add-flashcard" onClick={handleAddFlashcard}>
        <img src="./src/darkPlus.svg"/>
      </div>
    </div>
  );
}