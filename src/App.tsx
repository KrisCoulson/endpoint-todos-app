import { useMachine, useSelector } from '@xstate/react';
import todosMachine from './todosMachine';
import { isPastDue } from './utils/sortHelper';
import { TTodo } from './utils/api';

const Skeleton = () => { 
  return (
    <div className="todo-container">
      <div className="skeleton todo"></div>
      <div className="skeleton todo"></div>
      <div className="skeleton todo"></div>
      <div className="skeleton todo"></div>
    </div>
  )
}


const Todo = ({ todo }: { todo: TTodo }) => {
  const updating = useSelector(todo.ref, (state) => state.matches('updating'));
  console.log(updating)
  return (
    <div key={todo.id} className="todo">
      <div>
        <div>
        <input id={`todo-${todo.id}`} type="checkbox" checked={todo.isComplete} onChange={() => {
          todo.ref.send({ 
            type: 'TOGGLE_TODO', 
            todo: {...todo, isComplete: !todo.isComplete }
          })
        }}/>
        <label htmlFor={`todo-${todo.id}`}>
          <span className={`todo-description ${todo.isComplete && 'todo-strikethrough'}`}>{todo.description}</span>
        </label>
        </div>
      </div>
      <div className="todo-right">
        {updating && <span className="todo-updating-spinner"></span>}
        <div className="todo-status">
          {todo.isComplete ? <span className="todo-complete todo-pill">Completed</span> : null}
          {!todo.isComplete && isPastDue(todo.dueDate) ? <span className="todo-past-due todo-pill">Past Due</span> : null}
          {todo.dueDate && <p className="todo-due-date">{new Date(todo.dueDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>}
        </div>
      </div>
    </div>
  )
}

function TodoApp() {
  const [state, send] = useMachine(todosMachine);

  return (
    <div>
    <header>
      <img src="endpoint_logo.svg" />
    </header>
    {state.matches("loading") &&  <Skeleton />}
    <div className="todo-container">
      {state.matches('failure') && (
        <div>
          <p className="todos-error">Error: {state.context.error}</p>
          <button onClick={() => send({ type: 'FETCH' })}>Retry</button>
        </div>
      )}
      {state.context.todos.map(todo => (
        <Todo todo={todo} key={todo.id} />
      ))}
    </div>
    </div>
  );
}

export default TodoApp;