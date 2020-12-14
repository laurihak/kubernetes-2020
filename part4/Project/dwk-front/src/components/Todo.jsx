import axios from "axios";
import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";

const API_URL = "/api";

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
    const response = await axios
      .post(`${API_URL}/todos`, {
        content: todo,
        type: "todo",
      })
      .catch((e) => e);
    if (response) fetchList();
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      console.log("testing response: ", response);
      const data = response.data;
      console.log("this is the data from fetch ", data);
      if (data) {
        setList(data);
      }
    } catch (e) {
      console.log(e);
      throw new Error("Database connection error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  // mock data for list
  // const list = [
  //   {
  //     id: 1,
  //     type: "todo",
  //     content: "do this",
  //     done: false,
  //   },
  //   {
  //     id: 2,
  //     type: "todo",
  //     content: "already done",
  //     done: true,
  //   },
  // ];

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
        {list === undefined ? null : (
          <List list={list} fetchList={fetchList}>
            {" "}
          </List>
        )}
      </div>
    </div>
  );
};

const List = ({ list, fetchList }) => {
  return list.map((item, i) => (
    <li key={i} style={{ listStyleType: "none", marginTop: 10 }}>
      {item.content} <CheckBox item={item} />{" "}
      <DeleteIcon item={item} fetchList={fetchList} />
    </li>
  ));
};

const CheckBox = ({ item }) => {
  const [check, setChecked] = useState(item.done);

  const handleClick = async (event) => {
    console.log("handling update, with id: ", item.id);
    setChecked(!check);
    try {
      await axios.put(`${API_URL}/todos/${item.id}`, {
        ...item,
        done: !check,
      });
    } catch (e) {
      console.log(e);
      throw new Error("Database connection error");
    }
  };
  return (
    <input type="checkbox" defaultChecked={check} onChange={handleClick} />
  );
};

const DeleteIcon = ({ item, fetchList }) => {
  const handleClick = async (event) => {
    console.log("handling delete, with item: ", item);
    try {
      const response = await axios.delete(`${API_URL}/todos/${item.id}`, {
        data: item,
      });
      if (response) {
        console.log('this is the response ', response)
        console.log('fetching lists')
        fetchList();
      }
    } catch (e) {
      console.log(e);
      throw new Error("Database connection error");
    }
  };
  return <AiFillDelete onClick={handleClick} />;
};
export default Todo;
