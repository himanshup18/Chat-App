"use client";
import React from 'react'
import Sidebar from './Sidebar/Sidebar.jsx';
import Main from './main/Main.jsx';
import ContextProvider from './context/context.jsx';
import {motion} from 'framer-motion';
const pageVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  out: {
    opacity: 0,
    x:-1000,
    transition: { duration: 0.5 },
  },
}

const Medibuddy = () => {
  return (
    <ContextProvider>
    <motion.div
    variants={pageVariants} 
    initial="hidden"
    animate="visible"
    exit="out"
     className='body'>
      <Sidebar/>
      <Main/>
      </motion.div>
    </ContextProvider>
  )
}

export default Medibuddy
