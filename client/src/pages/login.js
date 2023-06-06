import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { googleLogin, login, githubLogin } from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { getDataAPI } from '../utils/fetchData'
import { useGoogleLogin } from '@react-oauth/google'

function Login() {
  const initialState = {email: '', password: ''}
  const [userData, setUserData] = useState(initialState)
  const { email, password } = userData

  const [typePass, setTypePass] = useState(false)

  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()
  const history = useNavigate()

  
  useEffect(() => {
    if(auth.token) history('/')
  },[auth.token, history])

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const codeParams = urlParams.get('code')
    if(codeParams && (localStorage.getItem('firstLogin') === null)) {
      dispatch(githubLogin(codeParams))
    }
  },[])

  const handleChangeInput = e => {
    const {name, value} = e.target
    setUserData({...userData, [name]: value})
  }

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(login(userData))
  }


  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => dispatch(googleLogin(tokenResponse.code)),
    flow: 'auth-code',
  })

  const handleGithubLogin = async() => {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=6c49586b76eda09415ca')
  }

  return (
    <div className='auth_page'>
      <div className='my-2'>
        <button onClick={() => handleGoogleLogin()} className='google-btn-login'>        
              <span>Sign in with Google</span>
        </button>
      </div>
      <div className='my-2'>
        <button onClick={() => handleGithubLogin()} >
          Sign in with Github
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <h3 className='text-uppercase text-center mb-4'>Instagram</h3>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" 
                 className="form-control" 
                 id="exampleInputEmail1" 
                 aria-describedby="emailHelp"
                 onChange={handleChangeInput} 
                 value={email}
                 name='email'
                 />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>

          <div className='pass'>
            <input type={ typePass ? "text" : "password" }
                  className="form-control" 
                  id="exampleInputPassword1"
                  onChange={handleChangeInput} 
                  value={password}
                  name='password'
                  />
            <small onClick={() => setTypePass(!typePass)}>
              {typePass ? 'Hide' : 'Show'}
            </small>
          </div>
        </div>
        <button type="submit" className="btn btn-dark w-100"
              disabled={ email && password ? false : true}>
          Login
        </button>

        <p className='my-2'>
          You don't have an account? <Link to='/register' style={{color: 'crimson'}}>Register Now</Link>
        </p>
      </form>
    </div>
  )
}

export default Login