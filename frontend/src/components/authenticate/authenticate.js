const Auth = {
    authenticate() {
        localStorage.setItem('authenticated', JSON.parse(true))
    },
    signout() {
        localStorage.setItem('authenticated', JSON.parse(false))
    },
    getAuth() {
        // return this.isAuthenticated;
        return JSON.parse(localStorage.getItem('authenticated')) ? JSON.parse(localStorage.getItem('authenticated')) : false;
    }
};

export default Auth;