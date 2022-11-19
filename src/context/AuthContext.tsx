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
    user: User | null
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
        signInWithPopup(auth, provider)
    }

    const logOut = () => {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{googleSignIn, logOut, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}