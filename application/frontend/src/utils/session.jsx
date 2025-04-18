

const storeIsSession = (key, value) => {
    console.log("Storing in session:", key, value);
    return sessionStorage.setItem(key, value);
}
const lookInSession = (key) => {
    return sessionStorage.getItem(key);
}
const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}
const logOutUser = (key, value) => {
    sessionStorage.clear();
}

export {
    storeIsSession,
    lookInSession,
    removeFromSession,
    logOutUser
}