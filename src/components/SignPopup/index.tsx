import { Dispatch, FC, SetStateAction } from 'react'
import GoogleButton from 'react-google-button'
import { UserAuth } from '../../context/AuthContext'
import s from './SignPopup.module.css'

interface SignPopupProps {
    setAuthPopupToogle: Dispatch<SetStateAction<boolean>>
}

export const SignPopup:FC<SignPopupProps> = ({setAuthPopupToogle}) => {

    const { googleSignIn } = UserAuth()

    const GoogleSignInHandler = async () => {
        try {
            await googleSignIn()
            setAuthPopupToogle(false)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={s.section}>
            <div className={s.wrapper}>
                <h4 className={s.heading}>Войти с помощью</h4>
                <GoogleButton onClick={GoogleSignInHandler}/>
            </div>
        </div>
    )
}