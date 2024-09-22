"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "./components/ChatContainer";
import Contacts from "./components/Contacts";
import Welcome from "./components/Welcome";
import Image from 'next/image';
import Popup from "./components/PopupWindow/PopupWindow";
const url = 'https://chatmessagingapp.vercel.app/MediBuddy';
export default function Chat() {
  const router = useRouter();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentGroupChat, setCurrentGroupChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const loadUser = async () => {
      const userData = localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY);
      if (!userData) {
        router.push("/login");
      } else {
        setCurrentUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, [router]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      return () => socket.current.disconnect();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser?.isAvatarImageSet) {
        try {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        
          setContacts(data);
        } catch (error) {
          console.error("Failed to fetch contacts:", error);
        }
      } else {
        router.push("/setAvatar");
      }
    };

    if (currentUser) {
      fetchContacts();
    }
  }, [currentUser, router]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (currentUser?.isAvatarImageSet) {
        try {
          const { data } = await axios.get(`${host}/api/groups/allgroups/${currentUser._id}`);
        
          setGroups(data);
        } catch (error) {
          console.error("Failed to fetch groups:", error);
        }
      } else {
        router.push("/setAvatar");
      }
    };

    if (currentUser) {
      fetchGroups();
    }
  }, [currentUser, router]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    // console.log("grpname->",chat.name);
     if(chat.name){
      setCurrentGroupChat(chat);
     }
     else{
      setCurrentGroupChat(undefined);
     }
  };

  console.log("currentGroupChat->",currentGroupChat);
  console.log("currentChat->",currentChat);

  return (
    <Container>
    {/* <Image src={bgimg} alt="Avatar" style={{width: '100%', height: '100%', position: 'absolute', zIndex: '-1'}}/> */}
      <div className="container">
      
        <Contacts contacts={contacts} changeChat={handleChatChange} groups={groups} setGroups={setGroups} />
        {currentChat ? (
          <ChatContainer className={!currentChat&&!currentGroupChat? "hide":""} currentChat={currentChat} socket={socket} currentGroupChat={currentGroupChat} />
        ) : (
          <Welcome />
        )}
      </div>
      <div>
      <Popup className='Popup' url={url}/>
    </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, lightgray, darkgray);
  
  .container {
    height: 85vh;
    width: 85vw;
    display: grid;
    grid-template-columns: 25% 75%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 20px;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media screen and (max-width: 720px) {
      grid-template-columns: 0.75fr 1fr;
    }

    @media screen and (max-width: 450px) {
      grid-template-columns: 1fr;
    }

    &.hide {
      display: none;
    }
  }
`;
