import React from "react"
import { Button, Input, PasswordInput } from "@mantine/core"
import { useFormik } from 'formik'
import "./Login.modul.scss"
import { authAPI } from "../api/api"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const nav = useNavigate()
    const formik = useFormik({
        initialValues:{
            login: '',
            password: ''
        },
        onSubmit: values => {
            authAPI.login(values).then(() => {return nav('/home')})
        }
    })
    return (
        <div>
            <form onSubmit={formik.handleSubmit} className={'formLogin'}>
                <h2>Login</h2>
                <Input placeholder="Username" {...formik.getFieldProps('login')} />
                <PasswordInput placeholder="Password"{...formik.getFieldProps('password')} />
                <Button type="submit" w={140}>Submit</Button>
            </form>
        </div>
    )
}