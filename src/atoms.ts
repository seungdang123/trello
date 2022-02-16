import { atom } from "recoil";

// ex) id:123123123, text:"Hello"
export interface ITodo {
  id: number;
  text: string;
}

// ex) "Doing": [id:123124123, text:"Hello"]
export interface ITodoState {
  [key: string]: ITodo[];
}

const localTodo = localStorage.getItem("todo");
const todoJSON = JSON.parse(localTodo as any);

export const todoState = atom<ITodoState>({
  key: "todo",
  default: todoJSON || {
    "TO DO": [],
    Doing: [],
    Done: [],
  },
});
