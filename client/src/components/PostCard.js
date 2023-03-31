import React from 'react'
import CardHeader from './home/post_card/CardHeader'
import CardFooter from './home/post_card/CardFooter'
import CardBody from './home/post_card/CardBody'

import Comments from './home/Comments'
import InputComment from './home/InputComment'

const PostCard = ({post}) => {
  return (
    <div className='card my-3'>
         <CardHeader post={post}/>
         <CardBody post={post}/>
         <CardFooter post={post}/>

         <Comments post={post}/>
         <InputComment post={post} />
    </div>
  )
}

export default PostCard
