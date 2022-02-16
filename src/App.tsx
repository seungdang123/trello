import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ITodoState, todoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  align-items: center;
`;

const Boards = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 3rem;
`;

const Form = styled.form`
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const Input = styled.input`
  font-family: "Reenie Beanie", cursive;
  color: whitesmoke;
  background: none;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  text-align: center;
  font-size: 30px;
  &::placeholder {
    font-family: "Reenie Beanie", cursive;
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 55px;
  margin: 25px 0;
  color: white;
`;

const App = () => {
  const [todos, setTodos] = useRecoilState(todoState);
  const { register, setValue, handleSubmit } = useForm();
  const onDragEnd = (info: DropResult) => {
    const { destination, source, type } = info;

    // Board 움직 일 떄
    if (type === "Board") {
      console.log("Board!");
      if (!destination) return;
      setTodos((prev) => {
        const update = Object.entries(prev);
        const [temp] = update.splice(source.index, 1);
        update.splice(destination?.index, 0, temp);
        const updateList = update.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        localStorage.setItem("todo", JSON.stringify(updateList));
        return updateList;
      });
    } else {
      //  Card  옮길 시
      console.log("Card!");
      if (destination === null) {
        // Card 를 Board 밖으로 옮길 시
        console.log("null!");
        setTodos((prev) => {
          const update = [...prev[source.droppableId]];
          update.splice(source.index, 1);
          const updateList = {
            ...prev,
            [source.droppableId]: update,
          };
          localStorage.setItem("todo", JSON.stringify(updateList));
          return updateList;
        });
      }

      // todo 변화 없이 그냥 들었다가 놨을 시 아무 변화 x
      if (!destination) return;

      // 같은 Board 에서 이동 시
      if (destination?.droppableId === source.droppableId) {
        setTodos((prev) => {
          const update = [...prev[source.droppableId]];
          const taskObj = update[source.index];
          update.splice(source.index, 1);
          update.splice(destination?.index, 0, taskObj);
          const updateList = {
            ...prev,
            [source.droppableId]: update,
          };
          localStorage.setItem("todo", JSON.stringify(updateList));
          return updateList;
        });
      }

      // 다른 Board 간의 이동 시
      if (destination.droppableId !== source.droppableId) {
        setTodos((prev) => {
          const sourceUpdate = [...prev[source.droppableId]];
          const targetUpdate = [...prev[destination.droppableId]];
          const taskObj = sourceUpdate[source.index];
          sourceUpdate.splice(source.index, 1);
          targetUpdate.splice(destination.index, 0, taskObj);
          const updateList = {
            ...prev,
            [source.droppableId]: sourceUpdate,
            [destination.droppableId]: targetUpdate,
          };
          localStorage.setItem("todo", JSON.stringify(updateList));
          return updateList;
        });
      }
    }
  };

  // Board 생성
  const onSubmit = ({ board }: ITodoState) => {
    setTodos((prev) => {
      const update = {
        ...prev,
        [board + ""]: [],
      };
      localStorage.setItem("todo", JSON.stringify(update));
      return update;
    });
    setValue("board", "");
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Title>Check your process</Title>
      <Wrapper>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("board", { required: true })}
            type="text"
            placeholder="Add Board !"
          />
        </Form>
        <Droppable droppableId="BOARDS" type={"Board"} direction={"horizontal"}>
          {(provided) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(todos).map((boardId, idx) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  todos={todos[boardId]}
                  idx={idx}
                />
              ))}
              {provided.placeholder}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
