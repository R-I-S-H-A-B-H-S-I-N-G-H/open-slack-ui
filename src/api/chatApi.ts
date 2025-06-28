import axios from 'axios'
import config from "../../config";

export async function syncChats() {
    const url = `${config.lambdaBaseUrl}/user-M0S7U8KJDu/chat/sync?time=2025-06-27T12:30:00.000Z`;
    const resp = await axios.get(url, {
        headers: {
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLU0wUzdVOEtKRHUiLCJpYXQiOjE3NTExMjU2OTgsImV4cCI6MTc1MTczMDQ5OH0.IZfAwPCCTHqzNpdAIWsaknFSqhdWodv26JRRRDpnMPk",
        },
    });
    return resp.data;
}
