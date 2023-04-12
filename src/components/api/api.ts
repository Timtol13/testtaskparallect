import axios from 'axios'
import { INSPECT_MAX_BYTES } from 'buffer'

const instance = axios.create({
    baseURL: "http://localhost:8000/",
    headers:{
        "Content-Type": "application/json"
    }
})
const instancePhoto = axios.create({
    baseURL: "http://localhost:8000/",
    headers:{
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
    }
})

export const authAPI = {
    registration(data: {login: string, password: string}){
        return instance.post('api/createUser', data).then((e: any) => {localStorage.setItem('username', JSON.stringify(e.data))}).catch(err => console.log(err))
    },
    login(data: {login: string, password: string}){
        return instance.post('api/login', data).then((e: any) => {localStorage.setItem('username', JSON.stringify(e.data))}).catch(err => console.log(err))
    }
}

export const postAPI = {
    sendPhoto(data: {login: string | undefined, file: File | any, description: string}){
        console.log(data)
        return instancePhoto.post('api/sendPost', data)
    }
}

