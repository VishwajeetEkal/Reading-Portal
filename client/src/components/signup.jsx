// Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/Signup.css';


function Signup() {
 const navigate = useNavigate();


 const [firstname, SetFirstName] = useState('')
 const [lastname, SetLastName] = useState('')
 const [email, SetEmail] = useState('')
 const [password, SetPassword] = useState('')
 const [confirmpassword, SetConfirmPassword] = useState('')
 const [role, SetRole] = useState('')
 const [signUpResponseMsg, setSignUpResponseMsg] = useState('')
 const [securityQuestion1, setSecurityQuestion1] = useState('');
 const [securityAnswer1, setSecurityAnswer1] = useState('');
 const [securityQuestion2, setSecurityQuestion2] = useState('');
 const [securityAnswer2, setSecurityAnswer2] = useState('');


 const SECURITY_QUESTIONS1 = [
   'What was the name of your first pet?',
   'What was your childhood nickname?',
   'In what city you were born?',
 ];


 const SECURITY_QUESTIONS2 = [
   'what is your mothers maiden name?',
   'What high school did you attend?',
   'What was your favorite food as a child?',
 ];


 async function Register(event) {
   event.preventDefault()


   const response = await fetch('http://localhost:8080/signup', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         firstname,
         lastname,
         email,
         password,
         confirmpassword,
         role,
         securityQuestion1,
         securityAnswer1,
         securityQuestion2,
         securityAnswer2
       }),


   })
   const data = await response.json()
   console.log(data)
   setSignUpResponseMsg(data.message)
   if (data.message === "ok") {
     navigate("/login")
   }
 }


 return (
   <div className="signup-container">
     <h1 className="signup-title">Registration</h1>
     <form onSubmit={Register} className="signup-form">
       <div className="input-group">
         <input
           onChange={(e) => SetFirstName(e.target.value)}
           value={firstname}
           type="text"
           placeholder="First name"
           className="input-field"
         />
       </div>
       <div className="input-group">
         <input
           onChange={(e) => SetLastName(e.target.value)}
           value={lastname}
           type="text"
           placeholder="Last name"
           className="input-field"
         />
       </div>
       <div className="input-group">
         <input
           onChange={(e) => SetEmail(e.target.value)}
           value={email}
           type="text"
           placeholder="Email"
           className="input-field"
         />
       </div>
       <div className="input-group">
         <select onChange={(e) => SetRole(e.target.value)} value={role} className="input-field">
           <option value="" disabled>select option</option>
           <option value="user">User</option>
           <option value="admin">Admin</option>
           <option value="owner">Owner</option>
         </select>
       </div>
       <div className="input-group">
         <input
           onChange={(e) => SetPassword(e.target.value)}
           value={password}
           type="password"
           placeholder="Password"
           className="input-field"
         />
       </div>
       <div className="input-group">
         <input
           onChange={(e) => SetConfirmPassword(e.target.value)}
           value={confirmpassword}
           type="password"
           placeholder="Confirm Password"
           className="input-field"
         />
       </div>
       <div className="input-group">
         <select name="securityQuestion1" value={securityQuestion1} onChange={(e) => setSecurityQuestion1(e.target.value)} className="input-field">
           <option value="" disabled>select security Question1</option>
           {SECURITY_QUESTIONS1.map((question, index) => (
             <option key={index} value={question}>
               {question}
             </option>
           ))}
         </select>
       </div>
       <div className="input-group">
         <input
           type="text"
           name="securityAnswer1"
           value={securityAnswer1}
           placeholder="Ans for security question1"
           onChange={(e) => setSecurityAnswer1(e.target.value)}
           className="input-field"
         />
       </div>
       <div className="input-group">
         <select name="securityQuestion2" value={securityQuestion2} onChange={(e) => setSecurityQuestion2(e.target.value)} className="input-field">
           <option value="" disabled>select security Question2</option>
           {SECURITY_QUESTIONS2.map((question, index) => (
             <option key={index} value={question}>
               {question}
             </option>
           ))}
         </select>
       </div>
       <div className="input-group">
         <input
           type="text"
           name="securityAnswer2"
           value={securityAnswer2}
           placeholder="Ans for security question2"
           onChange={(e) => setSecurityAnswer2(e.target.value)}
           className="input-field"
         />
       </div>
       <div className="input-group">
         <input type="submit" value="Register" className="submit-button" />
       </div>
       <p className="response-message">{signUpResponseMsg}</p>
     </form>
   </div>
 );
}


export default Signup;
