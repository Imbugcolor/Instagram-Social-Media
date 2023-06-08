import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'
import { FaRegEdit } from 'react-icons/fa'
import NewMessenger from './NewMessenger'

const LeftSide = () => {
    const { auth, message, online } = useSelector(state => state)
    const dispatch = useDispatch()

    // const [search, setSearch] = useState('')
    // const [searchUsers, setSearchUsers] = useState([])
    
    const navigate = useNavigate()
    const { id } = useParams() 

    const pageEnd = useRef()
    const [page, setPage] = useState(0)

    const [openNewMsg, setOpenNewMsg] = useState(false)

    // const handleSearch = async(e) => {
    //     e.preventDefault()
    //     if(!search) return setSearchUsers([]);
    //     try {
    //         const res = await getDataAPI(`search?username=${search}`, auth.token)
    //         setSearchUsers(res.data.users)
    //     } catch (err) {
    //         dispatch({
    //             type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
    //         })
    //     }
    // }

    const handleAddUser = (user) => {
        // setSearch('')
        // setSearchUsers([])
        dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media: []}})
        dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        return navigate(`/message/${user._id}`)
    }

    const isActive = (user) => {
        if(id === user._id) return 'active'
        return ''
    }

    useEffect(() => {
        if(message.firstLoad) return;
        dispatch(getConversations({auth}))
    }, [dispatch, auth, message.firstLoad])

    // Load More
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting) {
                setPage(p => p + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    },[setPage])

    useEffect(() => {
        if(message.resultUsers >= (page -1)*9 && page > 1){
            dispatch(getConversations({auth, page}))
        }
    },[message.resultUsers, page, auth, dispatch])

    // Check User Online - Offline
    useEffect(() => {
        if(message.firstLoad) dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
    },[online, message.firstLoad, dispatch])

    return (
    <>
        {/* <form className='message_header' onSubmit={handleSearch}>
            <input type='text' value={search}
            placeholder='Enter to Search...'
            onChange={e => setSearch(e.target.value)}
            />
            <button type='submit' style={{display: 'none'}}>Search</button>
        </form> */}
        <div className='message__list_header'>
            <div className='d-flex justify-content-between align-items-center' 
            style={{height: '74px'}}>
                <span>{auth.user.username}</span>
                <FaRegEdit style={{cursor: 'pointer'}} onClick={() => setOpenNewMsg(true)}/>
            </div>
        </div>

        <div className='message_chat_list'>
                {
                    message.users.map(user => (
                        <div key={user._id} className={`message_user ${isActive(user)}`}
                        onClick={() => handleAddUser(user)}>
                             <UserCard user={user} msg={true}>
                                {
                                    user.online 
                                    ?  <i className='fas fa-circle text-success'/> 
                                    :  auth.user.following.find(item => 
                                        item._id === user._id) && 
                                        <i className='fas fa-circle'/> 
                                }
                             </UserCard>
                        </div>
                    ))
                }
            <button ref={pageEnd} style={{opacity: 0}}>Load More</button>
        </div>

        {
            openNewMsg && <NewMessenger setOpenNewMsg={setOpenNewMsg} />
        }
    </>
  )
}

export default LeftSide
