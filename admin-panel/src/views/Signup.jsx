import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from '../contexts/ContextProvider'

export default function Signup() {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors, setErrors] = useState(null)
  const { setUser, setToken } = useStateContext()

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      // name needs to have underscore not camel case for Laravel
      password_confirmation: passwordConfirmationRef.current.value 
    }
    axiosClient.post('/signup', payload)
    //destructure response and get data
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch (err => {
        const response = err.response;
        // 422 = validation error
        if (response && response.status === 422) {
          console.log(response.data.errors);
          setErrors(response.data.errors);
        }
      })
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form action="" onSubmit={onSubmit}>
          
          <h1 className="title">
            Sign Up
          </h1>
          {errors && <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div> }
          <input ref={nameRef} type="text" placeholder="Name" />
          <input ref={emailRef} type="email" placeholder="Email Address" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
          
          <button className="btn btn-block">Sign Up</button>
          
          <p className="message">
            Already registered? <Link to="/login">Sign in</Link>
          </p>

        </form>
      </div>
      </div>
  )
}
