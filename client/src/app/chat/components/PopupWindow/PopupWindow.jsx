import React, { useState, useEffect } from 'react';
import closeImg from '../../../assets/close.svg'
import {motion} from 'framer-motion'
import '../PopupWindow/PopupWindow.css'
import { FaClosedCaptioning, FaDoorClosed, FaRegWindowClose, FaWindowClose } from 'react-icons/fa';
import imglogo from '../../../assets/MediBuddy.jpg'
import Image from 'next/image';

const Popup = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBlueContainer, setShowBlueContainer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBlueContainer(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

   console.log(imglogo);
   console.log(closeImg);
  return (
    <>
      {isOpen ? (
        <motion.div   initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.7 }}  className={`popup-container`}>
          <div className="popup-content ">
            <iframe src={url} title="Popup Window" />
          </div>
        </motion.div>
      ) : null}
      {showBlueContainer && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.7 }} 
    className="w-40 h-16 fixed right-7 bottom-20 z-10 flex items-center justify-center bg-blue-600 p-2"
    style={{ 
      backgroundPosition: 'center',
      borderRadius: '8px', // Optional: Add border-radius for rounded corners
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' // Optional: Add box-shadow for a better look
    }}
  >
    <span className="text-white font-semibold">Hey! ChatBuddy this side . . . </span>
  </motion.div>
)}



      <div className='w-12 h-12 rounded-full fixed right-7 bottom-5 z-10 bg-blue-600'>
        {!isOpen ? (
          <button onClick={() => setIsOpen(!isOpen)}>
            {/* <img className='w-12 h-12 rounded-full' src={imglogo} alt="Logo" /> */}
            <Image className='w-12 h-12 rounded-full' src={imglogo} alt="Logo" />
          </button>
        ) : (
          <button onClick={() => setIsOpen(!isOpen)} className='z-10'>
            {/* <img className='w-12 h-12 rounded-full text-white' src={closeImg} alt="Close" /> */}
            <Image className='w-12 h-12 rounded-full text-white' src={closeImg} alt="Close" />
          </button>
        )}
      </div>
    </>
  );
};

export default Popup;
