import { useEffect } from 'react';
import './App.css'
import { syncChats } from './api/chatApi'
import Dexie from "dexie";
import type { Table } from "dexie";

export interface Chat {
  _id: string;
  userId: string;
  recepientId: string;
  isRead: boolean;
  isDeleted: boolean;
  message: string;
  shortId: string;
  createdAt: string; // ISO string
  __v: number;
}

class ChatDB extends Dexie {
  chats!: Table<Chat, string>; // Primary key is `_id` (string)

  constructor() {
    super("ChatDatabase");
    this.version(1).stores({
      chats: "_id, userId, recepientId, isRead, isDeleted, createdAt, shortId",
    });
  }
}

export const db = new ChatDB();


function App() {
  useEffect(() => {
    syncChats().then(res => {
      console.log(res.response);
      
    })
  })
  

  return (
    <>
     
    </>
  )
}

export default App
