import express, { Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://aryang23936:PfiPJewnm2d154cO@to-do.whpgui2.mongodb.net/TodoList?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);

const todoSchema = new mongoose.Schema({
  work: String,
  description: String,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  console.log(todos)
  res.json(todos);
});

app.post('/api/todos', async (req: Request, res: Response) => {
  try {
    const { work, description } = req.body;
    if (!work || !description) {
      return res.status(400).json({ error: 'Work and description are required fields.' });
    }

    const newTodo = new Todo({ work, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { work, description } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(id, { work, description }, { new: true });
  res.json(updatedTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
