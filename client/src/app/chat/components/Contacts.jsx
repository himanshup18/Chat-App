"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image"; 
import { useRouter } from "next/navigation";
import Logo from "../../assets/QC2.jpg";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Avatar } from '@mui/material';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./Logout";


export default function Contacts({ contacts, changeChat,groups,setGroups }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [currentSelectedGroup, setCurrentSelectedGroup] = useState(undefined);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(undefined);

  const [OpenCreateGroup, setOpenCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const router = useRouter();
  console.log(contacts);


  useEffect(() => {
    const fetchUserData = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY));
      if (data) {
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
        setUserId(data._id);
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
    }, [router]);

  
  useEffect(()=>{
    try{
      const fetchAllUsers = async () => {
        const { data } = await axios.get("https://chat-messaging-app-2eum.onrender.com/api/auth/allusers/66eabb8949a154a542327716");
        setAllUsers(data);
        console.log("jsjaajaa",data);
      };
      fetchAllUsers();
    }
    catch(error){
      console.log(error);
    }
  },[]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY));
      if (data) {
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
        setUserId(data._id);
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  
  const changeCurrentChat = (index, contact, isGroup) => {
    if (isGroup) {
      setCurrentSelectedGroup(index);
      setCurrentSelectedUser(undefined); 
    } else {
      setCurrentSelectedUser(index);
      setCurrentSelectedGroup(undefined);
    }
    changeChat(contact);
  };

  const handleOpenCreateGroup = () => {
    setOpenCreateGroup(true);
  };

  const handleCloseCreateGroup = () => {
    setOpenCreateGroup(false);
  };

  const handleSelectMembers = (event) => {
    setSelectedMembers(event.target.value);
  };
  
  const renderSelectedMembers = (selected) => {
    if (selected.length === 0) return 'Select members';
    return selected.map(id => {
      const user = allUsers.find(user => user._id === id);
      return user ? user.username : '';
    }).join(', ');
  };
  const handleCreateGroup =async () => {
    console.log("createGroup");
    setOpenCreateGroup(false);
    const data = {
      name: groupName,
      users: selectedMembers
    };
    console.log(data);
    try{
      const response = await axios.post("https://chat-messaging-app-2eum.onrender.com/api/groups/create", data);
    console.log(response);
      
    const res = await axios.get(`https://chat-messaging-app-2eum.onrender.com/api/groups/allgroups/${userId}`);
    toast.success("Group created successfully");
    setGroups(res.data);
    setGroupName('');
    setSelectedMembers([]);
    }
    catch(error){
      console.log(error);
      toast.error("Failed to create group");
    }
  };

  
  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <div className="flex">
              <Image src={Logo} alt="logo" width={40} height={50} style={{ borderRadius: "20px", objectFit: "cover", objectPosition: "center",marginRight:"10px",
              marginLeft:"10px" }} />
              <h3 className="font-semibold text-xl"><span className="text-blue-600 ">Quick</span>Con</h3>
            </div>
            <button onClick={handleOpenCreateGroup}>+</button>

            <Dialog open={OpenCreateGroup} onClose={handleCloseCreateGroup}>
        <DialogTitle>Create a Group Chat</DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="normal"
          />
          <Select
            multiple
            value={selectedMembers}
            onChange={handleSelectMembers}
            displayEmpty
            fullWidth
            renderValue={renderSelectedMembers}
          >
            {allUsers.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateGroup}>Cancel</Button>
          <Button onClick={handleCreateGroup} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

          </div>
          <div className="h-[300px] overflow-y-scroll scroll-bar-hide flex-col gap-4 justify-between align-middle">
            <div className="contacts mb-4">
              {groups.map((contact, index) => (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelectedGroup ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact, true)} // Pass true for group
                >
                  <div className="avatar">
                    {contact.avatarImage ? (
                      <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                    ) : (
                      <Avatar>{contact.name.charAt(0)}</Avatar>
                    )}
                  </div>
                  <div className="username">
                    <h3>{contact.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="contacts">
              {contacts.map((contact, index) => (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelectedUser ? "selected" : ""}  hover:bg-[#8a77e1]`}
                  onClick={() => changeCurrentChat(index, contact, false)} // Pass false for user
                >
                  <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username flex gap-4 justify-center">
              <h2>{currentUserName}</h2>
              <Logout />
            </div>
          </div>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: lightgray;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;

    img {
      height: 2rem;
    }

    h3 {
      color: #333; 
      text-transform: uppercase;
    }

    button {
      background-color: #4e0eff;
      border: none;
      color: white;
      font-size: 1.5rem;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    scroll-behavior: smooth;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff; 
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;

      &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: #333; 
        }
      }
    }

    .selected {
      background-color: darkgray;
    }
  }

  .current-user {
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: white; 
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;

      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }

    @media screen and (min-width: 320px) and (max-width: 720px) {
      gap: 1rem;  
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }

    @media screen and (max-width: 450px) {
    
     display:flex;
      
       }

 justify-content: center;}
`;
