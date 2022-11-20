import { useContext, createContext, FC, ReactNode, useEffect, useState } from 'react'
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth'
import { auth } from '../firebase'

interface AuthContextProps {
    googleSignIn: any 
    logOut: any
    user: User | null //null if user is not signed in
}

const authInitialState = {
    googleSignIn: null,
    logOut: null,
    user: null
}

const AuthContext = createContext<AuthContextProps>(authInitialState)

interface AuthContextProviderProps {
    children: ReactNode
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider()

        //with redirect
        signInWithPopup(auth, provider) 
    }

    const logOut = () => {
        signOut(auth)
    }

    //setting active user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    )
}

//getting userContext
export const UserAuth = () => {
    return useContext(AuthContext)
}