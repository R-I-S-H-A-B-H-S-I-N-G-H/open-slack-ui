import JWT from "jwt-client"

const JWT_KEY = "open-slack-jwt";

export function saveJwt(jwt: string) {
    localStorage.setItem(JWT_KEY, jwt);
}

export function getJwt() {
    return localStorage.getItem(JWT_KEY);
}

export function validateJwt(jwt: string): boolean {
    try {
        const jwtObject = JWT.read(jwt);
        return JWT.validate(jwtObject);
    } catch (error) {
        return false;
    }
}

export function validateSessionJWT(): boolean {
    const jwt = getJwt() ?? "";
    return validateJwt(jwt);
}

export function getJWTObject() {
    if (!validateSessionJWT()) return null;
    const jwt = getJwt();
    if (!jwt) return null;
    return JWT.read(jwt);
}

export function getFromToken(key: string) {
    if (!validateSessionJWT()) return null;
    const jwtObj = getJWTObject();
    if (!jwtObj) return null;
    return jwtObj?.claim[key] ?? null;
}

export function getUserId() {
    return getFromToken("userId");
}