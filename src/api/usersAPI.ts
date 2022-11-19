import { getDatabase, ref, set, child, get, remove, update } from 'firebase/database'
import { getDownloadURL, ref as stRef } from 'firebase/storage'
import { storage } from '../firebase'
import { ITodo } from '../models/ITodo'
import { v4 as uuid } from 'uuid'
import { uploadBytes } from 'firebase/storage'

const db = getDatabase()

export const userAPI = {
    addTodo: async (todo: {}, userId: string, file: null | File) => {
        const todoId = uuid()
        let fileRef = ''
        if (file) {
            const storageRef = stRef(storage, `${todoId}-${file.name}`);
            await uploadBytes(storageRef, file)
                .then(() => {
                    fileRef = storageRef.fullPath
                })
        }
        await set(ref(db, `users/user-${userId}/todos/todo-${todoId}`), {
            ...todo,
            file: fileRef
        })
            .then(() => {
                return 'Success'
            })
            .catch((e) => {
                console.log(e)
            })
    },
    getTodos: async (userId: string) => {
        const dbRef = ref(db)
        return get(child(dbRef, `users/user-${userId}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let result: ITodo[] = []
                    let todos = snapshot.val().todos
                    for (let todo in todos) {
                        result.push({
                            id: todo,
                            ...todos[todo]
                        })
                    }
                    return result
                }
            })
            .catch((e) => {
                console.log(e)
            })
    },
    downloadFile: async (file: string) => {
        const fileRef = stRef(storage, file)
        return getDownloadURL(fileRef)
            .then((url) => url)
    },
    updateTodo: async (todoId: string, userId: string, todo: {}, file: null | File) => {
        let fileRef = ''
        if (file) {
            const storageRef = stRef(storage, `${todoId}-${file.name}`)
             uploadBytes(storageRef, file)
                .then(() => {
                    fileRef = storageRef.fullPath
                })
        }
        await update(ref(db, `users/user-${userId}/todos/${todoId}`), {
            ...todo,
            file: fileRef
        })
    },
    deleteTodo: async (todoId: string, userId: string) => {
        await remove(ref(db, `users/user-${userId}/todos/${todoId}`))
    },
    deleteAllTodos: async (userId: string) => {
        await remove(ref(db, `users/user-${userId}/todos`))
    }
}