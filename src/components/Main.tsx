import React, { ChangeEvent, useEffect, useState } from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import {Header} from './header/Header'
import { useDisclosure } from '@mantine/hooks'
import { Login } from './Login/Login'
import { Registration } from './Registration/Registartion'
import { Button } from '@mantine/core'
import { Dialog } from '@mantine/core'
import './Main.modul.scss'
import {useFormik} from 'formik'
import { authAPI, postAPI } from './api/api'

export const Main = () => {
    const nav = useNavigate()
    const isLoggin = localStorage.getItem('isLoggin')
    // useEffect(() => {
    //     if(isLoggin === "false") return nav('/login');  else {}
    // })
    return (
        <div>
            <Header />
            <Routes>
                <Route path='/home' element={<HomePage />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/registration' element={<Registration />}/>
            </Routes>
        </div>
    )
}

export const HomePage = () => {
    const [open, {toggle, close}] = useDisclosure()
    const [user, setUser] = useState<string>('')
    const [description, setDescription] = useState<string>('') 
    const [file, setFile] = useState<File>()
    const [posts, setPosts] = useState<string[]>([])
    async function fetchPhotos() {
        const response = await fetch('http://localhost:8000/api/getPosts')
        const data = await response.blob()
        const blob = new Blob([data], {'type': 'image/*'})
        const urls: string[] = []
        for (let i = 0; i < data.size; i += 7_000_000) {
            const chunk = data.slice(i, i + 7_000_000)
          const url = URL.createObjectURL(chunk)
          console.log(url)
          urls.push(url)
        }
        setPosts(urls)
      }
    useEffect(() => {
        let us = localStorage.getItem('username')
        setUser(us? JSON.parse(us).username : us)
        fetchPhotos();
    },[])
    const formik = useFormik({
        initialValues: {
            description: ''
        },
        onSubmit: values => {
            console.log(values)
            postAPI.sendPhoto({login: user,file, ...values}).then(() => {window.location.replace('/home')})
        }
    })
    return (
        <div>
            <Button onClick={toggle}>Создать запись</Button>
            <Dialog opened={open} withCloseButton onClose={close} className='modal' w={340} radius={10} position={{}}>
            <form className={'files'} onSubmit={formik.handleSubmit}>
                <label className={'input_file'} htmlFor="button-photo">
                    <span>+</span>
                    <input type="file"
                           accept="image/*"
                           className={'files'}
                           id="button-photo"
                           onChange={(e: any) => {setFile(e.target.files? e.target.files[0] : null)}}/>
                    <textarea {...formik.getFieldProps('description')}></textarea>
                </label>
                <Button type={'submit'}>SEND</Button>
            </form>
            </Dialog>
            <div className='posts'>
                {posts.map(post => {
                    return (
                    <div>
                        <img key={post.length} src={`${post}`} alt={'Oops'} width={40} />
                    </div>) 
                })}     
            </div>
        </div>
    )
}