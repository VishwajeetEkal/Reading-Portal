import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Forgot.css';

function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState(''); // "email" or "question"
  const [securityQuestions, setSecurityQuestions] = useState([]); // array of questions
  const [answers, setAnswers] = useState([]); // array of answers
  const [fetchingQuestions, setFetchingQuestions] = useState(false);

  const fetchSecurityQuestions = async () => {
    try {
      console.log(process.env.REACT_APP_Backend_URL);
      //const response = await axios.post('https://ubook.onrender.com/get-security-questions', { email });
      const response = await axios.post('http://localhost:8080/get-security-questions', { email });
      //console.log('Backend response:', response.data);
      const questionsObject = response.data;
      //console.log('Backend response:',questionsObject);
    if (questionsObject) {
        const questionsArray = Object.values(questionsObject);
        setSecurityQuestions(questionsArray);
    } else {
    console.error('Questions object is missing or undefined in the response.');
}

    
    } catch (error) {
      console.error('Error fetching security questions:', error);
    }
    
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ubook.onrender.com/verify-answers', {
        email, answers
      });
      console.log(response.data);
      if(response?.data?.resetToken?.token){
        navigate(`/Reset?token=${response.data.resetToken.token}/`);
      }
    } catch (error) {
      console.error('Error verifying the answers:', error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ubook.onrender.com/Forgot', { email });
      console.log(response.data);
    } catch (error) {
      console.error('Not a valid email or username:', error);
    }
  };

  return (
    <div className="forgot-container">
      <form onSubmit={method === 'email' ? handleEmailSubmit : handleAnswerSubmit} className="forgot-form">
        {method === 'email' && (
          <div className="input-group">
            <label className="label">Password Recovery:</label>
            <input
              type="email"
              placeholder="Please type your email here"
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
        )}
        
        {securityQuestions && method === 'question' && (
          <div className="input-group">
            <label className="label">Email:</label>
            <input
              type="email"
              placeholder="Enter email to get security questions"
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            {!fetchingQuestions ? (
              <button
                type="button"
                onClick={() => { setFetchingQuestions(true); fetchSecurityQuestions(); }}
                className="button"
              >
                Fetch Questions
              </button>
            ) : (
              securityQuestions.map((question, index) => (
                <div key={index} className="question-group">
                  <label className="label">{question}</label>
                  <input
                    type="text"
                    placeholder="Your answer"
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    className="input-field"
                  />
                </div>
              ))
            )}
          </div>
        )}

        <div className="button-group">
          {method ? (
            <button type="submit" className="button">{method === 'email' ? 'Send Email' : 'Submit Answers'}</button>
          ) : (
            <>
              <button type="button" onClick={() => setMethod('email')} className="button">Send Reset Link via Email</button>
              <button type="button" onClick={() => setMethod('question')} className="button">Answer Security Questions</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Forgot;