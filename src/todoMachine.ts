import { setup, assign, fromPromise, sendParent } from 'xstate';
import { patchTodo, TTodo } from './utils/api';


const todoMachine = setup({
  types: {
    input: {} as { todo: TTodo },
  },
  actions: {
    updateTodo: assign(({ context }) => ({ todo: { ...context.todo, isComplete: !context.todo.isComplete }})),
    sendParentRevertTodo: sendParent(({ context }) => ({
      type: "UPDATE_TODO", 
      todo: context.todo
    })),
    setError: assign(({ event }) => {
      return ({ error: event.error.message })
    }),
  },
  actors: {
    patchTodo: fromPromise(async ({ input } : { input: { todo: TTodo }}) => {
      return await patchTodo(input.todo.id, input.todo.isComplete)
    },),
  }
}).createMachine({
  initial: "idle",
  context: ({ input }) => ({
    todo: input.todo,
    error: null,
  }),
  states: { 
    idle: {
      on: {
        TOGGLE_TODO: "updating",
      }
    }, 
    updating: {
      entry: [
        sendParent(({ context }) => ({
          type: "UPDATE_TODO", 
          todo: { ...context.todo, isComplete: !context.todo.isComplete }
        })
      ),
      ],
      invoke: {
        id: "patchTodo",
        src: "patchTodo",
        input: ({ context }) => ({ todo: context.todo }),
        onDone: {
          target: "idle",
          actions: ["updateTodo"],
        },
        onError: {
          target: "idle",
          actions: ["setError", 'sendParentRevertTodo'],
        },
      }
    }
  }
})





export default todoMachine;