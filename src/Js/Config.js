const Config = {
    apiUrl: 'http://localhost:3000/',
    // apiUrl: 'http://192.168.0.189:3000/',
    // apiUrl: 'http://192.168.100.33:3000/',
    tokenKey: 'authToken', // Use consistent key
    
    getToken: () => localStorage.getItem(Config.tokenKey),
    
    getConfig: () => ({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(Config.tokenKey)}`,
        }
    }),
    imageUrl: 'http://localhost:8000/storage/',
    currency: 'Rs. ',
}

export default Config;