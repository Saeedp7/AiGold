import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    const expirationTime = (exp * 1000) - 60000; // Subtract 1 minute for safety
    return Date.now() >= expirationTime;
};