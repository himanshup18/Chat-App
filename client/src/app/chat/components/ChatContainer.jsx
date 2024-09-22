"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../../utils/APIRoutes";
import SearchIcon from "@mui/icons-material/Search";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { Avatar } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupChatOptions from "./GroupChatOptions";
// import VideoCall from "./VideoCall";
export default function ChatContainer({ currentChat, socket, currentGroupChat }) {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [usersCache, setUsersCache] = useState({});
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userdata, setUserData] = useState(null);
  const [showMoreOption, setShowMoreOption] = useState(false);
 const searchRef = useRef();
//  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
// const roomId = currentChat._id;

// const startVideoCall = () => {
//   socket.current.emit("join-room", roomId);
//   setIsVideoCallActive(true);
// };
  const fetchUsername = async (userId) => {
    // Check cache first
    if (usersCache[userId]) {
      return usersCache[userId];
    }

    try {
      const response = await axios.get(`https://chat-messaging-app-2eum.onrender.com/api/auth/getuser/${userId}`);
      const username = response.data.user.username;

      // Update cache
      setUsersCache((prevCache) => ({
        ...prevCache,
        [userId]: username,
      }));

      return username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY));
      setUserData(data);
      let response;
      if (!currentGroupChat) {
        response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
      } else {
        response = await axios.post("https://chat-messaging-app-2eum.onrender.com/api/groups/messages", {
          from: data._id,
          groupId: currentGroupChat._id,
        });
      }

      console.log("check->", response.data);
      // Fetch usernames for all the messages
      const messagesWithUsernames = await Promise.all(
        response.data.map(async (message) => {
          const username = await fetchUsername(message.from);
          return { ...message, username };
        })
      );

      setMessages(messagesWithUsernames);
      setFilteredMessages(messagesWithUsernames);
    };

    if (currentChat) fetchMessages();
  }, [currentChat, currentGroupChat]);

  useEffect(() => {
    // Listen for private message
    socket.current?.on("msg-recieve", (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg });
    });

    // Listen for group message
    socket.current?.on("group-msg-recieve", (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg });
    });
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
      setFilteredMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const handleSendMsg = async (msg) => {
    const data = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY));

    if (!currentGroupChat) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });
    } else {
      socket.current.emit("send-group-msg", {
        groupId: currentGroupChat._id,
        from: data._id,
        msg,
      });
      await axios.post("https://chat-messaging-app-2eum.onrender.com/api/groups/addmessage", {
        from: data._id,
        groupId: currentGroupChat._id,
        message: msg,
      });
    }

    const newMessage = { fromSelf: true, username: data.username, message: msg, time: Date.now() };
    setMessages((prev) => [...prev, newMessage]);
    setFilteredMessages((prev) => [...prev, newMessage]); // Update filteredMessages
  };

  const handleSearchMessages = (e) => {
    setSearchTerm(e.target.value);
    const filtered = messages.filter((message) =>
      message.message.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleAddMembers = () => {
  };
  const handleDeleteGroup = () => {
  };

  const handleLeaveGroup = () => {
  };



  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            {currentGroupChat ? (
              <Avatar>{currentGroupChat.name.charAt(0).toUpperCase()}</Avatar>
            ) : (
              <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
            )}
          </div>
          <div className="username">
            <h3>{currentGroupChat ? currentGroupChat.name : currentChat.username}</h3>
          </div>
        </div>
        <div className="flex ">
        <div className="icons">
          <VideocamOutlinedIcon
          // onClick={startVideoCall}
            sx={{ ":hover": { backgroundColor: "#2b2b2b", borderRadius: "50%" }, cursor: "pointer" }}
          />
          <SearchIcon
            sx={{ ":hover": { backgroundColor: "#2b2b2b", borderRadius: "50%" }, cursor: "pointer" }}
            onClick={() => setIsSearchActive(!isSearchActive)}
          />
          {/* <GroupChatOptions currentGroupChat={currentGroupChat} handleAddMembers={handleAddMembers} handleLeaveGroup={handleLeaveGroup} handleDeleteGroup={handleDeleteGroup} /> */}
        </div>
        {isSearchActive && (
        <div className="search-bar" ref={searchRef}>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={handleSearchMessages}
          />
        </div>
      )}
      </div>
      </div>

      {/* {isVideoCallActive && <VideoCall roomId={roomId} socket={socket.current} />} */}

      <div className="chat-messages">
        {filteredMessages.map((message, index) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <small style={{ textAlign: "right" }}>{message.username === userdata.username ? "You" : message.username}</small>
                <p>{message.message}</p>
                <small>
                  {new Date(message.time).getHours()}:{new Date(message.time).getMinutes()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: #f0f4ff; /* light background color */
 border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #ffffff; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); 

    .icons {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        color: #007bff;
        cursor: pointer;
        padding: 0.5rem;
        width: 2.5rem;
        height: 2.5rem;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(0, 123, 255, 0.1); 
          border-radius: 50%;
        }
      }
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
        }
      }

      .username {
        h3 {
          color: #333; /* Dark text color for contrast */
        }
      }
    }
  }

  .search-bar {
    padding: 1rem 2rem;

    input {
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid #ccc; /* Light border */
      outline: none;
      color: #333; /* Dark text color */
      background-color: #fff; /* White input background */
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #007bff; /* Sky blue scrollbar */
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #333; /* Dark text color */
        background-color: #e7f3ff; /* Light blue message background */

        small {
          display: block;
          color: #828282;
          font-size: 0.7rem;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #cce5ff; /* Light blue for sent messages */
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #d1ecf1; /* Light teal for received messages */
      }
    }
  }
`;

