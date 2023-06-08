import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import LoadIcon from '../../images/loading.gif'
import { MESS_TYPES } from '../../redux/actions/messageAction'
import { useNavigate } from 'react-router-dom'

const NewMessenger = ({setOpenNewMsg}) => {
    const { auth, online } = useSelector(state => state )
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [userChosen, setUserChosen] = useState(false)

    const navigate = useNavigate()

    const handleClose = () => {
        setSearch('')
        setUsers([])
        setUserChosen(false)
        setOpenNewMsg(false)
    }

    useEffect(() => {
        
        const delayDebounce = setTimeout(async() => {
            if(search.length < 2) {
                return (
                    setUsers([]),
                    setUserChosen(false)
                ); 
            }

            setLoad(true)
           
            try {
                const res = await getDataAPI(`search?username=${search}`, auth.token)
                setUsers(res.data.users)
            } catch (err) {
                dispatch({
                    type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
                })
            }
            setUserChosen(false)
            setLoad(false)

        }, 400)

        return () => clearTimeout(delayDebounce)

    },[search])

    const handleChoose = (user) => {
        setUserChosen(user)
    }

    const handleAddUser = () => {
        setSearch('')
        setUsers([])
        dispatch({type: MESS_TYPES.ADD_USER, payload: {...userChosen, text: '', media: []}})
        dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        setUserChosen(false)
        setOpenNewMsg(false)
        return navigate(`/message/${userChosen._id}`)
    }

    return (
        <div className='new__messenger_modal'>
            <div className='new__messenger_box'>
                <div className='new__header'>
                    <span className='title__header'>New message</span>
                    <span className='new__close_btn' onClick={handleClose}>&times;</span>
                </div>
                <div className='search__new'>
                    <label htmlFor='newMsgSearch'>To:</label>
                    <input type='text' name='newMsgSearch' id='newMsgSearch' value={search} 
                    placeholder='Search...'
                    onChange={e => setSearch(e.target.value.replace(/ /g, ''))}/>
                </div>

                <div className='search__new_container'>
                    {
                    load ? 
                    <div className='load__search'>
                        <img src={LoadIcon} />
                    </div> :
                    search.length > 2 && 
                    <div className='search__new_result'>
                        {
                            users.length ?
                            users.map(user => (
                                <div className='search__item_result' key={user._id} style={{background: `${userChosen._id === user._id ? '#efefef' : '#fff'}`}}>
                                    <div onClick={() =>handleChoose(user)} className='d-flex align-item-center'>
                                        <Avatar src={user.avatar} size='big-avatar'/>
                                        <div className='ml-2' style={{transform: 'translateY(-2px)'}}>
                                            <span className='d-block' style={{color: '#262626', fontWeight: '500'}}>{user.username}</span>
                                        
                                            <small style={{ color: '#666666'}}>
                                                {user.fullname}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))
                            : <div className='text-center'>
                                <span>No Result</span>
                            </div>
                        }
                    </div>
                    }
                </div>

                <div className='new__footer'>
                    <button className='new__chat_btn' disabled={!userChosen} style={{opacity: `${userChosen ? 1 : 0.5}`}}
                    onClick={handleAddUser}>Chat</button>
                </div>
            </div>      
        </div>
    )
}

export default NewMessenger
