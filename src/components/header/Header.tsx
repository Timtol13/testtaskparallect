import React from "react"
import './Header.modul.scss'

export const Header = () => {
    const isLoggin = localStorage.getItem('isLoggin')
    return (
        <div>
            <nav className={'navBar'}>
            {isLoggin === "false"  ?
                <ul className={'nonAuth'}>    
                    <li>
                        <a href={'/login'}>Login</a>
                    </li>
                    <li>
                        <a href={'/registration'}>Sign-In</a>
                    </li>
                </ul>
                :   
                <ul>
                    <li></li>
                </ul>
                }
            </nav>
        </div>
    )
}