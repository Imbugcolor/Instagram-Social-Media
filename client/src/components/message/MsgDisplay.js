import React from 'react'
import Avatar from '../Avatar'
import { imageShow, videoShow } from '../../utils/mediaShow'
import { useSelector, useDispatch } from 'react-redux'
import { deleteMessages } from '../../redux/actions/messageAction'
import Times from './Times'
import stylePopUpConfirm from '../alert/Confirm'

const MsgDisplay = ({user, msg, theme, data}) => {
  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()

  const handleDeleteMessages = () => {
      if(!data) return;
      stylePopUpConfirm.fire({
          title: "Are you sure?",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: 'Cancel',
      }).then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteMessages({msg, data, auth}))
          } 
      })
  }

  return (
    <>
        <div className={`chat_title ${user._id === auth.user._id && 'flex-row-reverse'}`}>
            <Avatar src={user.avatar} size='mess-avatar'/>
            {/* <span>{user.username}</span> */}
            <div style={{margin: '0 7px'}}>

              <div className='you_content' style={{float: `${user._id === auth.user._id ? 'right' : 'left'}`}}>
                  { 
                    user._id === auth.user._id && 
                    <span className='unsend_msg' onClick={handleDeleteMessages}> Unsend </span>
                  }
                  <div>
                      {
                        msg.text && 
                        <div className='chat_text'
                        style={{filter: theme ? 'invert(1)' : 'invert(0)'}}>
                            {msg.text}
                        </div>
                      }
                      
                      {
                        msg.media.map((item, index) => (
                          <div key={index}>
                              {
                                item.url.match(/video/i) ?
                                videoShow(item.url, theme)
                                : imageShow(item.url, theme)
                              }
                          </div>
                        ))
                      }
                  </div>
                  
                  {
                    msg.call &&
                    <button className='btn d-flex align-items-center py-3'
                    style={{background: '#eee', borderRadius: '10px'}}>
                        <span className='material-icons font-weight-bold mr-1'
                        style={{ fontSize: '2.5rem', color: msg.call.times === 0 ? 'crimson' : 'green',
                        filter:  theme ? 'invert(1)' : 'invert(0)'}}>
                          {
                            msg.call.times === 0 ?
                            msg.call.video ? 'videocam_off' : 'phone_disabled' :
                            msg.call.video ? 'video_camera_front' : 'call'
                          }
                        </span>

                        <div className='text-left'>
                            <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
                            <small>
                                {
                                  msg.call.times > 0 ?
                                  <Times total={msg.call.times}/> :
                                  new Date(msg.createdAt).toLocaleTimeString()
                                }
                            </small>
                        </div>
                    </button>
                  }

              </div>

              <div className='chat_time' style={{textAlign: `${user._id === auth.user._id ? 'end' : 'start'}`}}>
                  {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
        </div>
        
    </>
  )
}

export default MsgDisplay
