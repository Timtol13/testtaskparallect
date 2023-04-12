import React, { useState } from 'react'
import { Button, Input, PasswordInput } from "@mantine/core"
import { useFormik } from 'formik'
import { authAPI } from '../api/api'

export const Registration = () => {
    const formik = useFormik({
        initialValues:{
            login: '',
            password: '',
        },
        onSubmit: values => {
            console.log(values)
            authAPI.registration(values)
        }
    })
    return (
        <div>
            <form onSubmit={formik.handleSubmit} className={'formLogin'}>
                <h2>Sign-In</h2>
                <Input placeholder="Username" {...formik.getFieldProps('login')} />
                <PasswordInput placeholder="Password" {...formik.getFieldProps('password')} />
                <Button type="submit" w={140}>Submit</Button>
            </form>
        </div>
    )
}