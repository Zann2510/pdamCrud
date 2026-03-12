import Cookies from 'js-cookie';

export const getCookie = (key: string) => {
    return Cookies.get(key);
}

export const storeCookie = (key: string, value: string, expired: number) => {
    Cookies.set(key, value, {expires: expired});
}

export const removeCookie = (key: string) => {
    Cookies.remove(key);
}