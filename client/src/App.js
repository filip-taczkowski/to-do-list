import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: ''
    };
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('addTask', ({ id, name }) => this.addTask({ id: id, name: name }));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  }

  removeTask(id, isLocal) {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id)
    });
    if (isLocal) {
      this.socket.emit('removeTask', id);
    }
  }

  submitForm(e) {
    e.preventDefault();
    const newTask = { name: this.state.taskName, id: uuidv4() };
    this.addTask(newTask);
    this.socket.emit('addTask', this.state.taskName);
  }
  
  addTask(task) {
    this.setState({ tasks: [...this.state.tasks, task] });
  }

  updateTasks(taskslist) {
    this.setState({ tasks: taskslist });
  }
  
  render() {
    const { tasks, taskName } = this.state;

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => (
              <li key={task.id} className='task'>
                {task.name}
                <button className="btn btn--red" onClick={() => this.removeTask(task.id, true)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={(e) => this.submitForm(e)}>
            <input 
              className="text-input" 
              value={taskName} 
              autocomplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              onChange={(e) => this.setState({ taskName: e.target.value })}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;
