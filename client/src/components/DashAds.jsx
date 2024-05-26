import { Button, Modal, Table, TableCell, ModalBody } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';


export default function DashAds() {
  const { currentUser } = useSelector((state) => state.user);
  const [ ads, setAds ] = useState([]);
  const [ showMore, setShowMore ] = useState(true);
  const [ showModal, setShowModal ] = useState(false);
  const [ adIdToDelete, setAdIdToDelete ] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
        try {
          const res = await fetch('/api/ad/getads');
          const data = await res.json();
          if(res.ok){
            setAds(data.ads);
            if(data.ads.length < 9){
              setShowMore(false);
            }
          }
          
        } catch (error) {
          console.log(error.message)
        }
    };
    if (currentUser.isAdmin) {
      fetchAds();
    }
  },[currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = ads.length;
    try {
      const res = await fetch(`/api/ad/getads?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setAds(prev => [...prev, ...data.Ads]);
        if (data.ads.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteAd = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/ad/deleteAd/${adIdToDelete}`,{
          method: 'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setAds((prev) => 
        prev.filter((ad) =>  ad._id !== adIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-5 00'>
      {currentUser.isAdmin && ads.length > 0 ? 
        (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>End Date</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Ad Content</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>View Count</Table.HeadCell>
              
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>

            </Table.Head>
            {ads.map((ad) => (
              <Table.Body key={ad._id} className='divide-y '> 
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(ad.startDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(ad.endDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {ad.title}
                  </Table.Cell>
                  <TableCell>
                    <div className="max-w-2xl w-full ad-content" dangerouslySetInnerHTML={{__html: ad && ad.content}}></div>
                  </TableCell>
                  <Table.Cell>
                      <img src={ad.image} alt= {ad.title} className='w-20 h-10 object-cover bg-gray-500'/>
                  </Table.Cell>
                  <TableCell className='text-center'>{ad.viewCount}</TableCell>
                  <TableCell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={
                      ()=>{
                          setShowModal(true);
                          setAdIdToDelete(ad._id);
                      }
                      }>
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link className='text-teal-500 hover:underline' to={`/update-ad/${ad._id}`}>
                      Edit
                    </Link>
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
      ):(<p> There are no ads to show here </p>)
      }
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header />
            <ModalBody>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this ad?</h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleDeleteAd}>
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