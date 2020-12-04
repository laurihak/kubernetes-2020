import axios from "axios";
import React, { useState, useEffect } from "react";

const API_URL = "/api";
// const API_URL = "/api";

const styles = {
  img: {
    width: "300px",
    borderRadius: 5,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  inputContainer: {
    marginTop: 5,
    flexDirection: "column",
  },
  listContainer: {
    textAlign: "center",
    marginTop: 20,
  },
  itemInput: {
    marginLeft: 10,
    marginRight: 10,
  },
};

const Todo = () => {
  const [list, setList] = useState();
  const [todo, setTodo] = useState("");

  const handleClick = async () => {
    const response = await axios.post(`${API_URL}/todos`, {
      content: todo,
      type: "todo",
    })
    .catch((e) => e);
    if (response) fetchList();
  };

  const fetchList = async () => {
    const response = await axios.get(`${API_URL}/todos`)
      .catch((e) => e);
    console.log('testing response: ', response)
    const data = response.data;
    console.log('this is the data from fetch ', data)
    if (data) {
      setList(data);
    }
  };

  useEffect(() => {
    console.log("fetching");
    fetchList();
  }, []);

  return (
    <div style={styles.container}>
      <img
        style={styles.img}
        src={`${API_URL}/image`}
        alt="img not found"
      ></img>
      <div style={styles.inputContainer}>
        <input
          style={styles.itemInput}
          placeholder="Place your todo here"
          onChange={(event) => setTodo(event.target.value)}
        ></input>
        <button style={styles.itemInput} onClick={handleClick}>
          Submit to do{" "}
        </button>
      </div>
      <div style={styles.listContainer}>
        <h2>List</h2>
        {list===undefined ? null
        : <List list={list}></List>
        }
      </div>
    </div>
  );
};

const List = ({ list }) => {
  return list.map((item, i) => (
    <li key={i} style={{ listStyleType: "none", marginTop: 10 }}>
      {item.content}
    </li>
  ));
};

export default Todo;
