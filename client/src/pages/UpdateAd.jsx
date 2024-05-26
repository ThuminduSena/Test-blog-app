import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateAd() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({
        _id : '',
        title: '',
        content: '',
        image: '',
        targetURL: '',
        endDate: '',
    });
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const { adId } = useParams();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        try {
            const fetchAds = async () => {
                const res = await fetch(`/api/ad/getads?adId=${adId}`);
                const data = await res.json();
                if(!res.ok){
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if(res.ok){
                    setPublishError(null);
                    setFormData({
                        _id: data.ads[0]._id,
                        title: data.ads[0].title,
                        content: data.ads[0].content,
                        image: data.ads[0].image,
                        targetURL: data.ads[0].targetURL,
                        endDate: data.ads[0].endDate,
                        startDate: data.ads[0].startDate,
                    });
                }
            };
            fetchAds();

        } catch (error) {
            console.log(error);
        }
    }, [adId]);
    const handleUploadImage = async () => {
        try {
            if(!file){
                setImageUploadError('Please select an image');
                return;  
            }
            setImageUploadProgress(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({...formData, image: downloadURL });
                    });
                }
            );
         } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };
    const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const res = await fetch(`/api/ad/updateAd/${adId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                console.log(currentUser._id);
                const data = await res.json();
                if(!res.ok){
                    setPublishError(data.message);
                    return;
                }
                if(res.ok){
                    setPublishError(null);
                    navigate(`/dashboard?tab=ads`);
                }

            } catch (error) {
                setPublishError('Something went wrong');
            }
    }
    
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
            Update an Advertisment
        </h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type= 'text' placeholder='Title*' required id='title' className='flex-1' onChange = {(e) => 
                    setFormData({...formData, title: e.target.value })
                } value={formData.title}/>
            </div>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type= 'text' placeholder='Targeted Url*' required id='TargetUrl' className='flex-1' onChange = {(e) => 
                    setFormData({...formData, targetURL: e.target.value })
                } value={formData.targetURL}/>
            </div>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <div className='flex gap-2 flex-1 border-4 border-teal-500 border-dotted p-2'>
                    <span className='my-2'>Start Date</span>
                    <TextInput type= 'date' placeholder='Start Date*' required id='startDate' className='flex-1' onChange = {(e) => 
                        setFormData({...formData, startDate: e.target.value })
                    } value={formData.startDate ? formData.startDate.substring(0, 10) : ''} disabled/>
                </div>
                <div className="flex gap-2 flex-1 border-4 border-teal-500 border-dotted p-2">
                    <span className='my-2'>End Date</span>
                    <TextInput type= 'date' placeholder='End Date*' required id='EndDate' className='flex-1' onChange = {(e) => 
                        setFormData({...formData, endDate: e.target.value })
                    } value={formData.endDate ? formData.endDate.substring(0, 10) : ''}/>
                </div>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type='file' accept= 'image/*' onChange={(e)=>setFile(e.target.files[0])}/>
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
                    {
                        imageUploadProgress ? (
                        <div className='w-16 h-16'>
                            <CircularProgressbar value={imageUploadProgress} text = {`${imageUploadProgress || 0}%`} />
                        </div> ) : (
                            'Upload Image'
                        )
                    }
                    </Button>
            </div>
            {imageUploadError && (
                <Alert color = 'failure'>
                    {imageUploadError}
                </Alert> 
            )}
            {formData.image && (
                <img src = {formData.image} alt='upload' className='w-full h-72 object-cover' />
            )}
            <ReactQuill theme='snow' placeholder = 'Write something here*' className='h-72 mb-12' required onChange={
                (value) => {
                    setFormData({...formData, content: value });

                }
            } value={formData.content}/>
            <Button type='submit' gradientDuoTone='purpleToPink'>Update Advertiesment</Button>
            {
                publishError && <Alert className='mt-5' color = 'failure'>{publishError}</Alert>
            }
        </form>
    </div>
  )
}
