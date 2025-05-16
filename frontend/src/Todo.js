import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [edititem, setEditItem] = useState(-1);

    const [edittitle, setEditTitle] = useState("");
    const [editdescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            })
                .then((req) => {
                    if (req.ok) {
                        getItems(); // fetch updated todos from backend
                        setMessage("Item added successfully");
                        setTitle("");
                        setDescription("");
                        setTimeout(() => setMessage(""), 3000);
                    } else {
                        setError("Unable to create todo item.");
                    }
                })
                .catch(() => {
                    setError("Network issue occurred.");
                });
        }
    };

    const handleEdit = (item) => {
        setEditItem(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleEditCancel = () => {
        setEditItem(-1);
    };

    const handleUpdate = () => {
        setError("");
        if (edittitle.trim() !== '' && editdescription.trim() !== '') {
            fetch(`${apiUrl}/todos/${edititem}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: edittitle, description: editdescription })
            })
                .then((res) => {
                    if (res.ok) {
                        getItems(); // refresh from backend
                        setMessage("Item updated successfully");
                        setEditItem(-1);
                        setTimeout(() => setMessage(""), 3000);
                    } else {
                        setError("Unable to update todo item.");
                    }
                })
                .catch(() => setError("Network error during update."));
        }
    };

    const handleDelete = (id) => {
        fetch(`${apiUrl}/todos/${id}`, {
            method: "DELETE"
        })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.filter((item) => item._id !== id));
                } else {
                    setError("Failed to delete item");
                }
            })
            .catch(() => setError("Network error while deleting"));
    };

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => setTodos(res));
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>Todo component works correctly!</h1>
            </div>

            <div className="row">
                <h3>Add item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text" />
                    <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text" />
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>

            <div className="row mt-3">
                <h3>Tasks</h3>
                <ul className="list-group">
                    {
                        todos.map((item) => (
                            <li key={item._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2">
                                    {
                                        edititem !== item._id ? (
                                            <>
                                                <span className="fw-bold">{item.title}</span>
                                                <span>{item.description}</span>
                                            </>
                                        ) : (
                                            <div className="form-group d-flex gap-2">
                                                <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={edittitle} className="form-control" type="text" />
                                                <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editdescription} className="form-control" type="text" />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="d-flex gap-2">
                                    {
                                        edititem !== item._id ? (
                                            <>
                                                <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                                                <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                                            </>
                                        )
                                    }
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    );
}
