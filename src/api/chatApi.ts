import axios from 'axios'
import config from "../../config";
import { getJwt, getUserId } from "@/utils/jwtUtil";

export async function syncChats() {
    const userId = getUserId();
    const url = `${config.lambdaBaseUrl}/${userId}/chat/sync?time=2025-06-27T12:30:00.000Z`;
    const resp = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${getJwt()}`,
        },
    });
    return resp.data;
}


export async function syncContacts() {
    const userId = getUserId();
    const url = `${config.lambdaBaseUrl}/${userId}/chat/contacts`;
    const resp = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${getJwt()}`,
        },
    });
    return resp.data;
}

export async function sendChat(msgPayload: { message: string; to: string }) {
    const userId = getUserId();
    const url = `${config.lambdaBaseUrl}/${userId}/chat/send`;
    const resp = await axios.post(url, msgPayload, {
        headers: {
            Authorization: `Bearer ${getJwt()}`,
        },
    });
    return resp.data;
}