import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import projectsRouter from './routes/projects'
import tasksRouter from './routes/tasks'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/projects', projectsRouter)
app.use('/api/tasks', tasksRouter)

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`)
})
