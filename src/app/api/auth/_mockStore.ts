import bcrypt from 'bcrypt'

export type DemoUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  password: string
  profilePicture?: string
  phone?: string
  preferredContactMethod?: string
}

let idCounter = 1
const saltRounds = 10

const users: DemoUser[] = [
  {
    id: idCounter++,
    username: 'demo',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'patient',
    password: bcrypt.hashSync('password', saltRounds),
  },
  {
    id: idCounter++,
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    password: bcrypt.hashSync('admin', saltRounds),
  },
]

export const mockStore = {
  async getUserByUsername(username: string) {
    return users.find(u => u.username === username) || null
  },
  async getUserByEmail(email: string) {
    return users.find(u => u.email === email) || null
  },
  async createUser(input: Omit<DemoUser, 'id' | 'password'> & { password: string }) {
    const user: DemoUser = { id: idCounter++, ...input }
    users.push(user)
    return user
  },
}

