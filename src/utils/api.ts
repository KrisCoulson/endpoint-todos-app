import { ActorRefFrom } from "xstate";
import todoMachine from "../todoMachine";

const TODOS_ENDPOINT = 'https://b0f179aa-a791-47b5-a7ca-5585ba9e3642.mock.pstmn.io';
const TODOS_ENDPOINT_HEADERS = { 
    'Content-Type': 'application/json', 
    "X-Api-Key": import.meta.env.VITE_ENDPOINT_API_KEY as string 
};

export type TTodo = {
    id: string;
    description: string;
    isComplete: boolean;
    dueDate: string | null;
    ref?: ActorRefFrom<typeof todoMachine>;
}


export const fetchTodos = async () => {
    const response = await fetch(`${TODOS_ENDPOINT}/get`, { headers: TODOS_ENDPOINT_HEADERS });
    
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    return response.json();
  };

export const patchTodo = async (id: TTodo["id"], isComplete: TTodo["isComplete"]) => {
    const response = await fetch(`${TODOS_ENDPOINT}/patch/${id}`, {
        method: 'PATCH',
        headers: TODOS_ENDPOINT_HEADERS,
        body: JSON.stringify({ isComplete }),
    });

    if (!response.ok) {
        throw new Error('Failed to update todo');
    }

    return response.json();
};