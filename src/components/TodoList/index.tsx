import s from './List.module.css'
import { useState, useEffect } from 'react'
import { userAPI } from '../../api/usersAPI'
import { auth } from '../../firebase'
import dayjs from 'dayjs'
import { ITodo } from '../../models/ITodo'
import { Dispatch, FC, SetStateAction } from 'react'
import { TodoItem } from '../TodoItem'
import { calculatePagginationArray, calculateShowingResults } from '../../utils/paggination'
import { TStatus } from '../../models/TStatus'

interface ListProps {
    setLoading: Dispatch<SetStateAction<boolean>>
    isLoading: boolean
}

export const TodoList: FC<ListProps> = ({ setLoading, isLoading }) => {
    const [heading, setHeading] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [files, setFiles] = useState<FileList | null>(null)
    const [status, setStatus] = useState<TStatus>('Выполнено')
    const [todos, setTodos] = useState<ITodo[]>([])
    const [trigger, setTrigger] = useState<boolean>(false)

    //pagination
    const [choosenPage, setChoosenPage] = useState<number>(1)
    const step = 5
    const paggArr = calculatePagginationArray(step, todos.length)

    const user = auth.currentUser

    useEffect(() => {
        if (user?.uid) {
            const fetchTodos = async () => {
                try {
                    setLoading(true)
                    const data = await userAPI.getTodos(user.uid)
                    if (data) {
                        setTodos(data)
                    } else {
                        setTodos([])
                    }
                    setChoosenPage(1)
                } catch (e) {
                    console.log(e)
                } finally {
                    setLoading(false)
                }
            }
            fetchTodos()
        }
    }, [trigger])

    const AddPostHandler = async () => {
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
            const newTodo = {
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
                await userAPI.addTodo(newTodo, user.uid, file)
            } catch (e) {
                console.log(e)
            } finally {
                setTrigger(!trigger)
            }
        }
    }

    const DeleteAllTodosHandler = async () => {
        if (user?.uid) {
            setLoading(true)
            try {
                await userAPI.deleteAllTodos(user.uid)
            } catch (e) {
                console.log(e)
            } finally {
                setTrigger(prev => !prev)
            }
        }
    }

    const statusHandler = () => {
        if(status === 'Не активно') {
            setStatus('Активно')
        } else if (status === 'Активно') {
            setStatus('Выполнено')
        } else {
            setStatus('Не активно')
        }
    }

    return (
        <div className={s.section}>
            <div className={s.add_wrapper}>
                <div className={s.input_wrapper}>
                    <label htmlFor="heading">Заголовок</label>
                    <input
                        id='heading'
                        className={s.input}
                        type="text"
                        required={true}
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                    />
                </div>
                <div className={s.input_wrapper}>
                    <label htmlFor="description">Описание</label>
                    <input
                        id='description'
                        className={s.input}
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className={s.input_wrapper}>
                    <label htmlFor="dateEnd">Выполнить до</label>
                    <input
                        id='dateEnd'
                        className={s.input}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className={s.input_wrapper}>
                    <label htmlFor="dateEnd">Прикрепить файл</label>
                    <input
                        id='file'
                        className={s.input}
                        type="file"
                        onChange={(e) => setFiles(e.target.files)}
                    />
                </div>
                <div className={s.input_wrapper}>
                    <p className={s.status_heading}>Статус</p>
                    <p onClick={statusHandler} className={s.status}>{status}</p>
                </div>
            </div>
            <button onClick={AddPostHandler} className={s.button}>Добавить</button>
            <p className={s.results}>
                Показано{todos.length > step ? ' ' + calculateShowingResults(choosenPage, step, todos.length) :
                    ` ${todos.length}`} из {todos.length} задач
            </p>
            {todos.length !== 0 && todos.map((todo, index) => {
                if (index < choosenPage * step - step || index > choosenPage * step - 1) return
                return <TodoItem
                    setLoading={setLoading}
                    key={todo.id}
                    todo={todo}
                    setTrigger={() => setTrigger(prev => !prev)}
                />
            })}
            <div className={s.paggination_wrapper}>
                {paggArr.map(num => {
                    return (
                        <button
                            key={num}
                            className={s.paggination_button}
                            style={num === choosenPage ? {
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-white)'
                            } : {}}
                            onClick={() => (setChoosenPage(num), window.scrollTo(0, 0))}
                        >
                            {num}
                        </button>
                    )
                })}
            </div>
            {todos.length !== 0 && <button onClick={DeleteAllTodosHandler} className={s.button_delete}>Удалить все</button>}
        </div>
    )
}