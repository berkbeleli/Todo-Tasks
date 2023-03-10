import "./App.css";
import { useState, useEffect, createContext } from "react";
import { Heading, IconButton, useColorMode, VStack } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import TodoList from "./components/ToDoList";
import AddTodo from "./components/AddToDo";
import { Analytics } from '@vercel/analytics/react';

export const EditTodo = createContext();

function App() {
  // chakraui color mode
  const { colorMode, toggleColorMode } = useColorMode();
  //define todos array and initial data form local storage.
  const [todos, setTodos] = useState(
    () => JSON.parse(localStorage.getItem("todos")) || []
  );

  // edit todo
  const [editTodo, setEditTodo] = useState({});

  // Add
  const handleAddTodo = (todo) => {
    if (todo.priority) {
      setTodos([todo, ...todos]);
    } else {
      setTodos([...todos, todo]);
    }
  };
  // Update
  const handleUpdateTodo = (data) => {
    const index = todos.findIndex((todo) => todo.id === data.id);
    const existTodos = [...todos];

    //if priority no change
    if (existTodos[index].priority === data.priority) {
      existTodos[index] = data; // update
    } else {
      existTodos[index] = data; // update
      existTodos.sort((a, b) => b.priority - a.priority); // high priority first
    }

    setTodos(existTodos); // update state
    setEditTodo({}); // reset
  };

  // Remove
  const handleRemoveTodo = (id) => {
    const newTodos = todos.filter((todo) => {
      return todo.id !== id;
    });

    setTodos(newTodos);
  };

  // set data to local storage depend on todos changes.
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <VStack
      p={5}
      mx="auto"
      maxW={{ base: "90vw", sm: "80vw", md: "70vw", lg: "600px" }}
    >
      <IconButton
        icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
        alignSelf="flex-end"
        size="lg"
        isRound
        onClick={toggleColorMode}
      />
      <Heading
        as="h1"
        size="xl"
        fontWeight="extrabold"
        bgGradient="linear(to-l, #E6FFFA, #38B2AC)"
        _hover={{
          bgGradient: "linear(to-r, red.500, yellow.500)",
        }}
        bgClip="text"
        marginBottom="1.3rem !important"
      >
        To-Do Tasks
      </Heading>

      <EditTodo.Provider value={[editTodo, setEditTodo]}>
        <AddTodo
          handleAddTodo={handleAddTodo}
          handleUpdateTodo={handleUpdateTodo}
        />
        <TodoList todos={todos} handleRemoveTodo={handleRemoveTodo} />
      </EditTodo.Provider>
      <Analytics />
    </VStack>
  );
}

export default App;
