import React, { useState, useEffect } from 'react'
import Avatar from '../Avatar'
import EditProfile from './EditProfile'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { Link } from 'react-router-dom'

const Info = ({id, auth, profile, dispatch}) => {

  const [userData, setUserData] = useState([])
  const [onEdit, setOnEdit] = useState(false)

  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followedBy, setFollowedBy] = useState([])

  useEffect(() => {
    if(id === auth.user._id) {
        setUserData([auth.user])
    } else {
    
        const newData = profile.users.filter(user => user._id === id)
        setUserData(newData)

        let followByUser = []
        if(newData) {
            auth.user.following.map(following => {
                newData[0]?.followers?.map(follower => {
                    if(follower._id === following._id)
                    followByUser.push(following)
                })
            })
        }

        setFollowedBy(followByUser)

    }
  }, [id, auth, dispatch, profile.users])

  useEffect(() => {
    if(showFollowers || showFollowing || onEdit) {
        dispatch({type: GLOBALTYPES.MODAL, payload: true})
    } else {
        dispatch({type: GLOBALTYPES.MODAL, payload: false})
    }
  },[showFollowers, showFollowing, onEdit, dispatch])

  
  return (
    <div className='info'>
        {
            userData.map(user => (
                <div className='info_container' key={user._id}>
                    <Avatar src={user.avatar} size='supper-avatar' />
                    <div className='info_content'>
                        <div className='info_content_title'>
                            <h2>{user.username}</h2>
                            {
                                user._id === auth.user._id ? 
                                <button className='edit__profile_btn' onClick={() => setOnEdit(true)}>
                                    Edit profile
                                </button> :
                                <FollowBtn user={user}/>
                            }
                        </div>

                        <div className='follow_btn'>
                            <span className='mr-4' onClick={() => setShowFollowers(true)}>
                                <strong>{user.followers.length}</strong> Followers
                            </span>
                            <span className='mr-4' onClick={() => setShowFollowing(true)}>
                                <strong>{user.following.length}</strong> Following
                            </span>
                        </div>

                        <h6>{user.fullname} <span style={{color: '#0095F6'}}>{user.mobile}</span></h6>
                        <p className='m-0'>{user.address}</p>
                        <h6 className='m-0'>{user.email}</h6>
                        <a href={user.website} target='_blank' rel="noreferrer">
                            {user.website}
                        </a>
                        <p className='bio__profile'>{user.story}</p>

                        {
                            followedBy.length > 0 &&
                            <div className='follower__by'>
                                
                                <span className='text-muted'>Followed by </span>
                                {
                                    followedBy.length > 0 &&
                                    followedBy.slice(0,3).map(user => (
                                        <Link key={user._id} to={`/profile/${user._id}`} 
                                        style={{textDecoration: 'none', color: '#000'}}>
                                            {user.username}{ followedBy.length > 1 && ','} </Link>              
                                    ))
                                }

                                {       
                                    followedBy.length > 3 && <span onClick={() => setShowFollowers(true)} className='folower__by_view'>+ { followedBy.length - 3 } more </span>
                                }

                            </div>
                        }
                    </div>
                        {
                            onEdit && <EditProfile setOnEdit={setOnEdit}/>
                        }
                        {
                            showFollowers && 
                            <Followers 
                                users={user.followers} 
                                setShowFollowers={setShowFollowers}
                            />
                        }
                        {
                            showFollowing && 
                            <Following 
                                users={user.following} 
                                setShowFollowing={setShowFollowing}
                            />
                        }
                </div>
            ))
        }
    </div>
  )
}

export default Info
