import { useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PageRender from './customRouter/PageRender';
import PrivateRouter from './customRouter/PrivateRouter';
import Register from './pages/register';
import Login from './pages/login';
import Alert from './components/alert/Alert';
import Home from './pages/home'
import Header from './components/header/Header';
import StatusModal from './components/StatusModal';

import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from './redux/actions/authAction';
import { getPosts } from './redux/actions/postAction';
import { getSuggestions } from './redux/actions/suggestionsAction';

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes';
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction';
import CallModal from './components/message/CallModal';
import Peer from 'peerjs'
import LeftSidebar from './components/sidebar/LeftSidebar';


function App() {
  const { auth, status, modal, call } = useSelector(state => state)
  const  dispatch = useDispatch()

  // joinUser
  useEffect(() => {
    dispatch(refreshToken())
    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(auth.token){
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    } 
  }, [dispatch, auth.token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
    
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
        
        }
      });
    }
  },[])
  
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    dispatch({type: GLOBALTYPES.PEER, payload: newPeer})
  },[dispatch])

  return (
    <Router>
      <Alert />
      <input type='checkbox' id='theme'/>
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className='row'> 
          {
            auth.token &&
            <div className='left__sidebar col-md-3'>
                <LeftSidebar />
            </div> 
          }
          <div className={`main ${auth.token ? 'col-md-9 content_app' : ''}`}>
            { auth.token && <Header /> }
            { status && <StatusModal /> }
            { auth.token && <SocketClient />}
            { call && <CallModal />}
            <Routes>
                <Route exact path='/' Component={auth.token ? Home : Login}/>
                <Route exact path='/register' Component={Register} />
                <Route exact path='/:page' element={<PrivateRouter component={PageRender}/>}/>
                <Route exact path='/:page/:id' element={<PrivateRouter component={PageRender}/>}/>
            </Routes>
          </div> 
        </div>
      </div>
    </Router>
  );
}

export default App;
