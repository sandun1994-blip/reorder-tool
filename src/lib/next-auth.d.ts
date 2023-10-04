import NextAuth from 'next-auth'

declare module 'next-auth'{
    interface Session{
      user:{
         id: number;
         firstName: string;
         lastName: string;
         username: string;
         password: null;
         age: number;
         email: string;
         isActive: number;
         staffNo: number;
         UserSystemMenuItem:any
         },
         backendTokens:{
            accessToken:string
            refreshToken :string
            expiresIn:number
         }
    }
}


import {JWT} from 'next-auth/jwt'

declare module 'next-auth/jwt'{

    interface JWT{
        user:{
         id: number;
         firstName: string;
         lastName: string;
         username: string;
         password: null;
         age: number;
         email: string;
         isActive: number;
         staffNo: number;
         UserSystemMenuItem:any
         },
         backendTokens:{
            accessToken:string
            refreshToken :string
            expiresIn:number
         }
    }
}