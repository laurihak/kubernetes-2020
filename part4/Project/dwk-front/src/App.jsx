import React from "react";
import Todo from "./components/Todo";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 20,
  },
};

const App = () => {
  return (
    <div>
      <header style={styles.container}>TODO APP</header>
      <Todo />
    </div>
  );
};

export default App;
