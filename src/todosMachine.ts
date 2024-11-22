import todoMachine from './todoMachine';
import { setup, assign, fromPromise, ActorRefFrom } from 'xstate';
import { sortTodos } from './utils/sortHelper';
import { fetchTodos, TTodo } from './utils/api';

const todosMachine = 
setup({
    types: {
        context: {} as { todos: TTodo[], error: string | null },
    },
    actors: {
        todoMachine: todoMachine, 
        fetchTodos: fromPromise(async () => fetchTodos()),
    },
    actions: {
        sortTodos: assign(({ context }) => ({
            todos: sortTodos(context.todos),
        })),
        setTodos: assign(({ event, spawn }) => {
            return ({ 
              todos: sortTodos(event.output.map((todo: TTodo) => ({...todo, ref: spawn('todoMachine', { input: { todo }}) })))
            })
        }),
        setError: assign(({ event }) => {
            return ({ error: event.error.message })
        }),
        updateTodo: assign(({ context, event }) => {
          const updatedTodos = context.todos.map(todo =>
            todo.id === event.todo.id ? { ...todo, isComplete: event.todo.isComplete } : todo
          );
          return { todos: updatedTodos };
        }),
      },
}).createMachine({
  id: 'todos',
  initial: 'loading',
  context: {
    todos: [],
    error: null,
  },
  states: {
    loading: {
      invoke: {
        id: 'fetchTodos',
        src: 'fetchTodos',
        onDone: {
          target: 'success',
          actions: ['setTodos'],
        },
        onError: {
          target: 'failure',
          actions: 'setError',
        },
      },
    },
    success: {
      on: {
        FETCH: 'loading',
        'UPDATE_TODO': {
          actions: ['updateTodo', 'sortTodos'],
        }
      },
    },
    failure: {
      on: {
        FETCH: 'loading',
      },
    },
    
  },
});

export default todosMachine;