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
import { Form } from '../Form'
import { Tfilter } from '../../models/TFilter'
import ArrowIcon from '../../icons/arrow.png'

interface ListProps {
    setLoading: Dispatch<SetStateAction<boolean>>
}

export const TodoList: FC<ListProps> = ({ setLoading }) => {
    //filter
    const [filter, setFilter] = useState<Tfilter>('Все')
    const [filterPopupToogle, setFilterPopupToogle] = useState<boolean>(false)
    const filters: Tfilter[] = ["Все", "Выполнено", "Активно", "Не активно"]

    //props
    const [heading, setHeading] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [files, setFiles] = useState<FileList | null>(null)
    const [status, setStatus] = useState<TStatus>('Выполнено')

    //fetched todos
    const [todos, setTodos] = useState<ITodo[]>([])

    //trigger for latest data
    const [trigger, setTrigger] = useState<boolean>(false)

    //pagination
    const [choosenPage, setChoosenPage] = useState<number>(1)
    const step = 5
    const paggArr = calculatePagginationArray(step, todos.length)

    //user
    const user = auth.currentUser

    //fetching todo
    useEffect(() => {
        if (user?.uid) { // checking if user exist
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
        if (user?.uid) { //checking if user exist
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
                setTrigger(!trigger) //triggering for fetching latest data
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

    return (
        <div className={s.section}>
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
            <button onClick={AddPostHandler} className={s.button}>Добавить</button>
            <div className={s.filter_wrapper}>
                <div className={s.filter}>Фильтр: <span>{filter}</span>
                    <img
                        onClick={() => setFilterPopupToogle(!filterPopupToogle)}
                        className={s.arrow_icon}
                        src={ArrowIcon}
                        alt="arrow"
                        style={{ rotate: filterPopupToogle ? '0deg' : '180deg' }}
                    />
                    <div className={s.filter_popup} style={{ display: filterPopupToogle ? 'flex' : 'none' }}>
                        {filters.map(filter => {
                            return (
                                <button
                                    key={filter}
                                    className={s.filter_btn}
                                    onClick={() => { setFilter(filter); setFilterPopupToogle(false) }}
                                >
                                    {filter}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <p className={s.results}>
                    Показано{todos.length > step ? ' ' + calculateShowingResults(choosenPage, step, todos.length) :
                        ` ${todos.length}`} из {todos.length} задач
                </p>
            </div>
            {todos.length !== 0 && todos.map((todo, index) => {
                if (index < choosenPage * step - step || index > choosenPage * step - 1) return
                if (filter !== 'Все' && todo.status !== filter) return
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