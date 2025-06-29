import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./page/login/Login.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import Chat from "./page/chat/Chat.tsx";

createRoot(document.getElementById("root")!).render(
    <>
        <Toaster />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </BrowserRouter>
    </>
);
