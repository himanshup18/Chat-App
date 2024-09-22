"use client";
import React, { useContext } from 'react';
import './main.css';
import { assets } from '../../assets/assets';
import { Context } from '../context/context';
import appLogo from '../../assets/MediBuddy.jpg'; 
import Image from 'next/image';
const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSent();
    }
  };

  return (
    <div className='main overflow-hidden font-medium'>
      <div className="nav">
        <p>QuickCon</p>
        {/* <img src={assets.user_icon} alt="User Icon" /> */}
        <Image
          src={appLogo}
          alt="User Icon"
          width={30}
          height={30}
        />
      </div>
      <div className="chat-container">

        {!showResult ? (
          <>
            <div className="greet">
              <p><span>Hello, User!</span></p>
              <p>Start a conversation with your friends.</p>
            </div>
            <div className="lg:cards hidden lg:flex">
              <div className="card">
                <p>Instant Messaging: Chat with your contacts in real-time and stay connected.</p>
                {/* <img src={assets.chat_icon} alt="Chat Icon" /> */}
                <Image
                  src={assets.chat_icon}
                  alt="Chat Icon"
                  width={30}
                  height={30}
                />
              </div>
              <div className="card">
                <p>Media Sharing: Share photos, videos, and documents seamlessly.</p>
                {/* <img src={assets.media_icon} alt="Media Sharing Icon" /> */}
                <Image
                  src={assets.media_icon}
                  alt="Media Sharing Icon"
                  width={30}
                  height={30}
                />
              </div>
              <div className="card">
                <p>Group Chats: Create group chats and bring your friends together.</p>
                {/* <img src={assets.group_icon} alt="Group Icon" /> */}
                <Image
                  src={assets.group_icon}
                  alt="Group Icon"
                  width={30}
                  height={30}
                />
              </div>
              <div className="card">
                <p>24/7 Availability: Connect with your contacts anytime, from anywhere.</p>
                {/* <img src={assets.availability_icon} alt="Availability Icon" /> */}
                <Image
                  src={assets.availability_icon}
                  alt="Availability Icon"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </>
        ) : (
          <div className='result'>
            <div className="result-title">
              {/* <img src={assets.user_icon} alt="User Icon" /> */}
              <Image

                src={appLogo}   
                alt="User Icon"
                width={30}
                height={30}
              />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {/* <img src={appLogo} alt="App Logo" /> */}
               <Image

                src={appLogo} 
                alt="App Logo"
                width={30}
                height={30}
              />
              {loading ? (
                <div className='loader'>
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder='Type a message...' 
              onKeyDown={handleKeyDown} 
            />
            <div>
              {input ? <Image onClick={() => onSent()} src={assets.send_icon} alt="Send Icon" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            QuickCon - A project by Himanshu Patel
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
