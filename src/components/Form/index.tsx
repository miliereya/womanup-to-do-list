import { Dispatch, SetStateAction, FC } from 'react'
import { TStatus } from '../../models/TStatus'
import s from './Form.module.css'

interface FormProps {
    heading: string
    setHeading: Dispatch<SetStateAction<string>>
    description: string
    setDescription: Dispatch<SetStateAction<string>>
    date: string
    setDate: Dispatch<SetStateAction<string>>
    setFiles: Dispatch<SetStateAction<FileList | null>>
    status: TStatus
    setStatus: Dispatch<SetStateAction<TStatus>>
}

export const Form: FC<FormProps> = ({
    heading,
    setHeading,
    description,
    setDescription,
    date,
    setDate,
    setFiles,
    status,
    setStatus
}) => {

    //Update status on click
    const statusHandler = () => {
        if (status === 'Не активно') {
            setStatus('Активно')
        } else if (status === 'Активно') {
            setStatus('Выполнено')
        } else {
            setStatus('Не активно')
        }
    }
    return (
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
                <label htmlFor="dateEnd">Файл</label>
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
    )
}