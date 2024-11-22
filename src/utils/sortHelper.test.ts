import { describe, it, expect } from 'vitest';
import { isPastDue, sortTodos } from './sortHelper';
import { TTodo } from './api';

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

describe('isPastDue', () => {
    it('should return false if dueDate is null', () => {
        expect(isPastDue(null)).toBe(false);
    });

    it('should return false if dueDate is in the future', () => {
        expect(isPastDue(futureDate)).toBe(false);
    });

    it('should return true if dueDate is in the past', () => {
        const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
        expect(isPastDue(pastDate)).toBe(true);
    });
});



describe('sortTodos', () => {
    it('should sort todos by priority and due date', () => {
        const todos: TTodo[] = [
            { id: "2", description: 'Todo 2', isComplete: false, dueDate: new Date("2022-03-26").toISOString() }, // Incomplete due in past
            { id: "1", description: 'Todo 1', isComplete: false, dueDate: new Date("2022-03-25").toISOString() }, // Incomplete due in past
            { id: "3", description: 'Todo 3', isComplete: false, dueDate: futureDate }, // Incomplete due in future
            { id: "4", description: 'Todo 4', isComplete: false, dueDate: null},// Incomplete no due date
            { id: "7", description: 'Todo 7', isComplete: true, dueDate: null }, // Complete no due date
            { id: "5", description: 'Todo 5', isComplete: true, dueDate: futureDate }, // Complete due in future
            { id: "6", description: 'Todo 6', isComplete: true, dueDate: new Date("2022-03-25").toISOString() }, // Complete due in past
        ];
        const sortedTodos = sortTodos(todos);
        

        expect(sortedTodos[0].id).toBe("1"); // Past due
        expect(sortedTodos[1].id).toBe("2"); // Past due
        expect(sortedTodos[2].id).toBe("3"); // No due date
        expect(sortedTodos[3].id).toBe("4"); // Complete
        expect(sortedTodos[4].id).toBe("6"); // Complete
        expect(sortedTodos[5].id).toBe("5"); // Complete
        expect(sortedTodos[6].id).toBe("7"); // Complete
    });

    it('should handle todos with the same priority', () => {
        const todos: TTodo[] = [
            { id: "2", description: 'Todo 2', isComplete: false, dueDate: new Date("2022-03-25").toISOString() }, // Incomplete due in past
            { id: "1", description: 'Todo 1', isComplete: false, dueDate: new Date("2022-03-25").toISOString() }, // Incomplete due in past
            { id: "3", description: 'Todo 3', isComplete: true, dueDate:  null }, // Incomplete due in past
            { id: "5", description: 'Todo 5', isComplete: false, dueDate: futureDate }, // Incomplete due in future
            { id: "4", description: 'Todo 4', isComplete: false, dueDate: futureDate}, // Incomplete due in future
        ];
        const sortedTodos = sortTodos(todos);

        // The order should be: Past due in order of date, Incomplete future due date, Incomplete no due date, Complete future due date, Complete past due, Complete no due date
        expect(sortedTodos[0].id).toBe("2"); 
        expect(sortedTodos[1].id).toBe("1");
        expect(sortedTodos[2].id).toBe("5");
        expect(sortedTodos[3].id).toBe("4");
        expect(sortedTodos[4].id).toBe("3");
    });
});