import { info } from 'console'
import { v4 as uuid } from 'uuid'
import { api } from '../services/api'
type SignInRequestData = {
    username: string; 
    password: string;
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export async function signInRequest({username, password}: SignInRequestData){

    try {
        const info = await api({
            method: 'post', 
            url: '/login', 
            data:{
                username, 
                password
            }
        })

        const {token, name} = info.data; 

        return {
            token,
            user: {
                name,
                email: 'tomas@gmail.com',
                avatar_url: 'https://github.com/tomasduart17.png'
            }
        }

    } catch (error) {
        console.log(error)
    }



}

export async function recoverUserInformation() {
    await delay()

    return {
        user: {
            name: 'Tomás Duarte',
            email: 'tomas@gmail.com',
            avatar_url: 'https://github.com/tomasduart17.png'
        }
    }
}