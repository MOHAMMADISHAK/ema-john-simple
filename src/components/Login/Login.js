import React, { useState } from 'react';
import './Login.css'
import { useContext } from 'react';
import { UserContext} from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { handleGoogleSignIn, initializeLoginFramework,handleSignOut, handleFbLogin, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';



function Login() {
  const [newUser,setNewUser]=useState(false);
  const[user,setUser]=useState({
    isSignedIn : false,
    name :"",
    email:"",
    password:"",
    photos : ""
  });

  initializeLoginFramework();

const [loggedInUser,setLoggedInUser] = useContext(UserContext);
const history = useHistory();
const location = useLocation();

let { from } = location.state || { from: { pathname: "/" } };

const googleSignIn = ()=>{
handleGoogleSignIn()
.then(res=>{
  setUser(res);
  setLoggedInUser(res);
  history.replace(from);
})
}
const signOut = ()=>{
  handleSignOut()
  .then(res=>{
    setUser(res);
    setLoggedInUser(res);
  })
}
const fbSignIn =()=>{
  handleFbLogin()
  .then(res=>{
    setUser(res);
    setLoggedInUser(res);
    history.replace(from);
  })
}

const handleBlur=(e)=>{
  // console.log(e.target.name);
  // console.log(e.target.value);
  let isFieldValid =true ;
  if(e.target.name === "email"){
    isFieldValid  = /\S+@\S+\.\S+/.test(e.target.value); 
  }
  if(e.target.name==="password"){
    const isPasswordValid = e.target.value.length > 6;
    const passwordHasNumber = /\d{1}/.test(e.target.value);
    isFieldValid=isPasswordValid && passwordHasNumber;
  }
  if(isFieldValid){
    const newUserInfo = {...user};
    newUserInfo[e.target.name]= e.target.value;
    setUser(newUserInfo);
  }
}

const handleSubmit = (e)=>{
  if(  newUser && user.email && user.password){
    createUserWithEmailAndPassword(user.name,user.email,user.password)
    .then(res=>{
      setUser(res);
    setLoggedInUser(res);
    history.replace(from);
    })
  }

  if(!newUser && user.email && user.password){
    signInWithEmailAndPassword(user.email,user.password)
    .then(res=>{
      setUser(res);
    setLoggedInUser(res);
    history.replace(from);
  })
  e.preventDefault();
}}


  return (
    <div className="body">
     { user.isSignedIn? <button onClick={signOut}>Sign Out</button> :
      <button onClick={googleSignIn}>Sign In</button>
     }
     <br></br>
    <button onClick={fbSignIn}>Sign In using facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome ,{user.name}</p>
          <p>Your email : {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }

      <h1>Our own Authentication</h1>
    {/* <p>Name : {user.name}</p>
    <p>Email : {user.email}</p>
    <p>Password: {user.password}</p> */}
    <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
    <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input  name="name" type="text" placeholder="Your name" onBlur={handleBlur}/>}
        <br></br>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your email address" required/>
        <br></br>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
        <br></br>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>
      <p style={{color:"red"}}>{user.error}</p>
     {
       user.success &&  <p style={{color:"green"}}>User {newUser? 'created' : 'Logged In'} successful.</p>
     }
    </div>
  );
}
export default Login;
