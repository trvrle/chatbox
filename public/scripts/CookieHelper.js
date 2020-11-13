class CookieHelper {
    saveCookie(key, value) {
        document.cookie = `${key}=${value}; path=/; max-age=31536000`;
    }

    getCookieValue(key) {
        if(!this.hasCookie(key)) return "";
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${key}=`))
            .split('=')[1];
        return cookieValue;
    }

    hasCookie(key) {
        if (document.cookie.split(';').some((item) => item.trim().startsWith(`${key}=`))) {
            return true;
        }
        return false;
    }
}