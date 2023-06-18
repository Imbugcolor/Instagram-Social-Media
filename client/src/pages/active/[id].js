import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { postDataAPI } from '../../utils/fetchData'
import LogoBrand from '../../images/vyviegram-logo.png'
import Success from '../../images/success.PNG'
import Failed from '../../images/failed.PNG'

const Active = () => {
    const { id } = useParams()
    const [ err, setErr ] = useState('')
    const [ success, setSuccess ] = useState('')

    useEffect(() => {
        if(id) {
            postDataAPI('active', { active_token: id })
            .then(res => setSuccess(res.data.msg))
            .catch(err => setErr(err.response.data.msg))
        }
    },[id])

    return (
        <div className='active_page'>
            <div className='header_logo'>
                <img src={LogoBrand} alt='logo'/>
            </div>
            <div className='form__message_container'>
                <div className='form__message'>
                    {
                        err &&
                        <>
                            <img src={Failed} alt='logo'/>
                            <span>{err}</span>
                        </>
                    }
                    
                    {

                        success && 
                        <>
                            <img src={Success} alt='logo'/>
                            <span>{success}</span>
                        </>
                    }

                    <Link to='/' 
                    style={{textDecoration: 'none'}}>
                        <button>
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Active