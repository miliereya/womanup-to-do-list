import { Dispatch, FC, SetStateAction } from 'react'
import { UserAuth } from '../../context/AuthContext'
import { Button } from '../UI/Button'
import s from './Header.module.css'

interface HeaderProps {
    setAuthPopupToogle: Dispatch<SetStateAction<boolean>>
}

export const Header: FC<HeaderProps> = ({ setAuthPopupToogle }) => {
    const { user, logOut } = UserAuth()

    const logOutHandler = async () => {
        try {
            await logOut()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <header className={s.section}>
            <div className='container'>
                <div className={s.wrapper}>
                    <h1 className={s.heading}>To-do-list</h1>
                    {user?.displayName ?
                        <div className={s.user}>
                            {user.displayName}
                            <Button
                                text='Выйти'
                                onClick={logOutHandler}
                                margin='0 0 0 10px'
                            />
                        </div>
                        :
                        <Button
                            text='Регистрация'
                            onClick={() => setAuthPopupToogle(true)}
                        />
                    }
                </div>
            </div>
        </header>
    )
}