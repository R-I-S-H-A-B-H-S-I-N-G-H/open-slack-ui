import { useEffect } from 'react';
import './App.css'
import { syncChats } from './api/chatApi'
import { db } from "./utils/dbUtil";

function App() {
    useEffect(() => {
        syncChats().then((res) => {
            const entries = res.response as [];
            db.chats.bulkAdd(entries);
        });
    });

    return <></>;
}

export default App
