
import axios from "axios"
import config from "../../config"

export async function login(username: string, password: string) {
    const url = `${config.lambdaBaseUrl}/auth/login`
    const res = await axios.post(url, {
        username,
        password
    })

    return res.data
}