import { TStatus } from "./TStatus"

export interface ITodo {
    heading: string
    description: string
    dateEnd: string
    file: string
    id: string
    status: TStatus
}