import { Todo } from './api.ts';

export const isPastDue = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  const now = new Date();
  return date < now;
}

const getPriority = (todo: Todo): number => {
  if (todo.isComplete) return 3; // Complete always last
  if (todo.dueDate && isPastDue(todo.dueDate)) return 0; // Past due first
  if (!todo.dueDate) return 2; // No due date
  return 1; // Future due date
};

const compareDates = (a: Todo, b: Todo): number => {
  const dateA = a.dueDate ? new Date(a.dueDate) : null;
  const dateB = b.dueDate ? new Date(b.dueDate) : null;

  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;
  return dateA.getTime() - dateB.getTime();
};

export const sortTodos = (todos: Todo[]) => {
  return [...todos].sort((a, b) => {
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return compareDates(a, b);
  });
};