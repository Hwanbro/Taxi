import axios from "axios";

const instance = axios.create({
    baseURL: 'http://192.168.1.107:3000',
    timeout: 10000,
});

export default {
    test() {
        return instance.get('/taxi/test')
    },
    login(id:string,pw:string, fcmToken:string) {
        return instance.post('/taxi/login', {userId:id, userPw:pw, fcmToken: fcmToken})
    },
    register (id:string, pw:string, fcmToken:string) {
        return instance.post('/taxi/register', {userId:id, userPw:pw,fcmToken: fcmToken})
    },
    list (id:string) {
        return instance.post('/taxi/list', {userId:id})
    },
    call (id:string, startLat:string, startLng:string, startAddr:string,
        endLat:string, endLng:string, endAddr:string){
        return instance.post('/taxi/call', {userId:id, 
            startLat: startLat, startLng: startLng, startAddr  : startAddr,
            endLat: endLat, endLng: endLng, endAddr  : endAddr
        })
    },
    geoCoding (coords:any, key:string) {
        let url = 'https://maps.googleapis.com/maps/api/geocode/json'
        let lat = coords.latitude
        let lng = coords.longitude

        return axios.get(`${url}?latlng=${lat},${lng}&key=${key}&language=ko`)
    },
}