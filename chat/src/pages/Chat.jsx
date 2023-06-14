import React,{useState,useEffect} from 'react'
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {allUsersRoute} from '../utils/APIRoutes'
import Contacts from '../components/Contacts';

const Chat = () => {

  const navigate = useNavigate();
const [ contacts, setContacts] = useState([]);
const[currentUser, setCurrentUser] = useState(undefined);

useEffect(()=>{
  const fetchData=async()=>{
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
  }};
  fetchData();
},[navigate]);

useEffect(()=>{
  const fetchData=async()=>{
    if(currentUser){
      if(currentUser.isAvatarImageSet){
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data)
      }else{
        navigate("/setAvatar");
      }
    }
  };
  fetchData();
},[currentUser, navigate])

  return (
    <Container>
      <div className="container">
        <Contacts 
        contacts={contacts}
        currentUser={currentUser}
        />
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat