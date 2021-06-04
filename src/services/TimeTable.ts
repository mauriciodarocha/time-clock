import axios, { AxiosResponse } from 'axios'
import { Timetable } from '../models/Timetable'

export async function getTimetable(): Promise<Timetable[]> {
    const url = `http://localhost:3001/timetable`
  
    const results: AxiosResponse = await axios.get<Timetable[]>(url)
    return results && results.data
}

export async function getTimetableById(id: string|number): Promise<Timetable[]> {
    const url = `http://localhost:3001/timetable?user_id=${id}`
  
    const results: AxiosResponse = await axios.get<Timetable>(url)
    return results && results.data
}

export async function saveTimetable(data: Timetable): Promise<Timetable[]> {
    const url = `http://localhost:3001/timetable`
  
    const results: AxiosResponse = await axios.post<Timetable>(url, data)
    return results && results.data
}

export async function deleteTimetableById(id: string|number): Promise<Timetable[]> {
    const url = `http://localhost:3001/timetable/${id}`
  
    const results: AxiosResponse = await axios.delete<Timetable>(url)
    return results && results.data
}