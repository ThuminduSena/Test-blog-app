import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center' >
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
                Want to learn more about Javascript?
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout these resources with 100 JavaScript Projects
            </p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none' >
                <a color = 'white' href='https://www.100jsprojects.com' target = '_blank' rel = 'noopener no refferer' >100 JS Projects</a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <img  src='https://cyberhoot.com/wp-content/uploads/2020/07/Free-Courses-to-learn-JavaScript-1024x576.jpg'/>
        </div>
    </div>
  )
}
