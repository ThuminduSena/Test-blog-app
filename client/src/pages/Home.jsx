import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';

export default function Home() {
  const[ posts, setPosts ] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    }
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome To My Blog</h1>
        <p className='text-gray-600 text-xs sm:text-sm dark:text-gray-300'>Welcome to our coding blog, where we embark on a journey through the exciting world of software development, programming languages, and technology trends. Whether you're a seasoned developer looking to expand your skills, a newcomer eager to dive into the world of coding, or simply curious about the latest innovations in the tech industry, you've come to the right place.</p>
      <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
        View our Posts
      </Link>
      </div>
      <div className="p-3 bg-amber-200 dark:bg-slate-700 ">
        <CallToAction/>
      </div>

      <div className="max-w-8xl mx-auto p-3 flex flex-col gap-8 py-7 ">
        {
          posts && posts.length > 0 && (
            
            <div className='flex flex-col gap-6'>
                <h2 className='text-2xl font-semibold text-center '>Recent Posts</h2>
                <div className='flex flex-wrap gap-4 justify-center mr-20 ml-20'>
                  {
                    posts.map((post) => (
                      <PostCard key={post._id} post = {post} />
                    ))
                  }
                </div>
                <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>
                    View all posts
                </Link>
            </div>
           
          )
        }
      </div>
    </div>
  )
}
