import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})

// interceptor - function executed before request is sent
// or after response is received
axiosClient.interceptors.request.use( (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`;
    
    return config;
});

axiosClient.interceptors.response.use( (response) => {
    //IF SUCCESSFUL
    return response;
}, (error) => {
    //IF REJECTED
    try {
        // destructure the error to just get the response
        const {response} = error;
        if (response.status === 401) {
        // if unauthorized, remove token from local storage
        localStorage.removeItem('ACCESS_TOKEN');
    }
    } catch (e) {
        console.log(e);
    }
    
    // could handle forbidden or not found here etc
    throw error;
});

export default axiosClient;