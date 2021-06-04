import axios, { AxiosResponse } from 'axios'
import { User } from '../models/Users'

export async function getUsers(): Promise<User[]> {
    const url = `http://localhost:3001/users`
  
    const results: AxiosResponse = await axios.get<User[]>(url)
    return results && results.data
}

export async function getUser(employeeId: string): Promise<User[]> {
    const url = `http://localhost:3001/users?employee_id=${employeeId}`
  
    const results: AxiosResponse = await axios.get<User>(url)
    return results && results.data
}