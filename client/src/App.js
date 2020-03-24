import React from 'react';
import io from 'socket.io-client';


class App extends React.Component {
  state = {
    tasks: [
      {id: 1, name: 'Shopping'},
      {id: 2, name: 'Go out with a dog'},

    ],
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
  }

  removeTask(id) {
    const { tasks } = this.state;
    let index = '';

    tasks.filter(task => {
      if (task.id === id) {
        index = tasks.indexOf(task);
      }
      return index;
    });

    this.setState({
      tasks: tasks.filter(task => task.id !== id),
    });

    this.socket.emit('removeTask', index);
  }

  render() {
    const { tasks } = this.state;

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className='task'>
                {task.name}
                <button className="btn btn--red" onClick={() => this.removeTask(task.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form">
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;
