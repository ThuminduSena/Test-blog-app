import { Button, Modal, Table, TableCell, ModalBody } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [ comments, setComments ] = useState([]);
  const [ showMore, setShowMore ] = useState(true);
  const [ showModal, setShowModal ] = useState(false);
  const [ commentIdToDelete, setCommentIdToDelete ] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
        try {
          const res = await fetch('/api/comment/getcomments');
          const data = await res.json();
          if(res.ok){
            setComments(data.comments);
            if(data.comments.length < 9){
              setShowMore(false);
            }
          }
          
        } catch (error) {
          console.log(error.message)
        }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  },[currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
          method: 'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setComments((prev) => 
        prev.filter((comment) =>  comment._id !== commentIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-5 00'>
      {currentUser.isAdmin && comments.length > 0 ? 
        (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number ofLikes</Table.HeadCell>
              <Table.HeadCell>PostID</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>

            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className='divide-y '> 
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>
                  <TableCell>
                    {comment.numberOfLikes}
                  </TableCell>
                  <TableCell>{comment.postId}</TableCell>
                  <TableCell>{comment.userId}</TableCell>
                  <TableCell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={
                      ()=>{
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);

                      }
                      }>
                      Delete
                    </span>
                  </TableCell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>
              Show more
            </button>
          )}
        </>
      ):(<p> There are no commentss to show here </p>)
      }
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header />
            <ModalBody>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleDeleteComment}>
                            Confirm
                        </Button>
                        <Button color='gray' onClick={()=>setShowModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>    
    </div>
  )
}

