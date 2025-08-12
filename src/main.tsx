import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./page/login/Login.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import Chat from "./page/chat/Chat.tsx";
import SignUp from "./page/signup/SignUp.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
    <>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<Chat />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </>
);
