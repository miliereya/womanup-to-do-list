import s from './TodoItem.module.css'
import { FC, Dispatch, SetStateAction } from 'react'
import { ITodo } from '../../models/ITodo'
import { useState, useEffect } from 'react'
import ArrowIcon from '../../icons/arrow.png'
import { userAPI } from '../../api/usersAPI'
import { auth } from '../../firebase'
import dayjs from 'dayjs'
import { TStatus } from '../../models/TStatus'
import { Form } from '../Form'

interface TodoItemProps {
    todo: ITodo
    setLoading: Dispatch<SetStateAction<boolean>>

    //trigger for fetching latest data
    setTrigger: () => void 
}

export const TodoItem: FC<TodoItemProps> = ({ todo, setLoading, setTrigger }) => {
    //modes
    const [isUpdateMode, setUpdateMode] = useState<boolean>(false)

    //opens full todo
    const [toogle, setToogle] = useState<boolean>(false)
 
    //input props
    const [files, setFiles] = useState<FileList | null>(null)  
    const [heading, setHeading] = useState<string>(todo.heading)
    const [description, setDescription] = useState<string>(todo.description)
    const [date, setDate] = useState<string>(dayjs(todo.dateEnd).format())
    const [status, setStatus] = useState<TStatus>(todo.status)

    //file url
    const [file, setFile] = useState<string>(todo.file)

    //user
    const user = auth.currentUser

    //download file
    useEffect(() => {
        if (todo.file) {
            const downloadFile = async () => {
                try {
                    setFile(await userAPI.downloadFile(todo.file))
                } catch (e) { }
            }
            downloadFile()
        }
    }, [])

    const updatePostHandler = async () => {

        //check if user exist
        if (user?.uid) {
            let file: null | File = null
            if (!heading) {
                alert('Заголовок не может быть пустым')
                return
            }
            if (!date || !dayjs(date).isValid()) {
                alert('Выберите дату')
                return
            }
            const updatedTodo = {
                heading: heading,
                description: description,
                dateEnd: dayjs(date).format(),
                status: status
            }

            if (files?.length) {
                file = files[0]
            }
            setLoading(true)
            try {
                await userAPI.updateTodo(todo.id, user.uid, updatedTodo, file)
            } catch (e) {
                console.log(e)
            } finally {
                setUpdateMode(false)
                setTrigger()
            }
        }
    }

    const deleteHandler = async () => {
        if (user?.uid) {
            try {
                setLoading(true)
                await userAPI.deleteTodo(todo.id, user.uid)
            } catch (e) {
                console.log(e)
            } finally {
                setTrigger()
            }
        }
    }

    return (
        <div className={s.section}>
            {isUpdateMode ?
                <Form
                    heading={heading}
                    setHeading={setHeading}
                    description={description}
                    setDescription={setDescription}
                    date={date}
                    setDate={setDate}
                    setFiles={setFiles}
                    status={status}
                    setStatus={setStatus}
                />
                : <div className={s.wrapper}>
                    <button
                        className={s.arrow_btn}
                        onClick={() => setToogle(!toogle)}
                    >
                        <img
                            src={ArrowIcon}
                            className={toogle ? s.arrowDown : s.arrow}
                            alt="arrow"
                        />
                    </button>
                    <div className={s.top_wrapper}>
                        <p className={s.heading}>{todo.heading}</p>
                        {dayjs() < dayjs(todo.dateEnd) ? <p className={s.date}>Срок прошел {dayjs(todo.dateEnd).diff(dayjs(), 'hour')} ч. назад</p> : <p className={s.date}>Выполнить до: {dayjs(todo.dateEnd).format('MMMM D, YYYY')}</p>}
                    </div>
                    <p className={s.status}>{todo.status}</p>

                </div>}
            {toogle &&
                <div className={s.toogle_wrapper}>
                    {!isUpdateMode && <div className={s.middle_wrapper}>
                        <p className={s.description}>Описание: {todo.description}</p>
                        {file &&
                            <a
                                href={file}
                                target='_blank'
                                className={s.file}
                            >
                                Прикрепленный файл
                            </a>}
                    </div>}
                    <div className={s.button_wrapper}>
                        {isUpdateMode ?
                            <div className={s.update_button_wrapper}>
                                <button
                                    className={s.save_button}
                                    onClick={updatePostHandler}
                                >
                                    Сохранить
                                </button>
                                <button
                                    className={s.cansel_button}
                                    onClick={() => setUpdateMode(false)}
                                >
                                    Отмена
                                </button>
                            </div>
                            :
                            <button
                                className={s.update_button}
                                onClick={() => setUpdateMode(true)}
                            >
                                Редактировать
                            </button>
                        }
                        <button
                            className={s.delete_button}
                            onClick={deleteHandler}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}