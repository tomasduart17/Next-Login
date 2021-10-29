import { createContext, useEffect, useState } from "react";
import { signInRequest,recoverUserInformation } from '../services/auth'
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router';
import { api } from "../services/api";

type User = {
    name: string;
    email: string;
    avatar_url: string;
}

type SignInData = {
    username: string;
    password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User;
    signIn: (data: SignInData) => Promise<void>
}





export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }){

    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;


    useEffect(()=>{
        const { 'nextauth.token': token } = parseCookies()

        if(token) {
            recoverUserInformation().then(response =>{ 
                setUser(response.user)
            })
        }


    }, [])


    async function signIn({username, password}: SignInData){
        // Aqui chamamos a API e retornamos o jwt
        const { token, user } = await signInRequest({
            username,
            password,
        })
        
        setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 1, //1 hora
        })

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        setUser(user)

        Router.push('/dashboard');

    }

    return(
        <AuthContext.Provider value={{ isAuthenticated, signIn, user }}> 
            {children}
        </ AuthContext.Provider>
    )
}