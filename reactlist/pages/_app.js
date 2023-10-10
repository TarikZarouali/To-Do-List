import React, { useState, useEffect } from "react";
import "../styles/app.css";

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("pending");
  const [duration, setDuration] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(-1); // Track the editing index
  const [editItemName, setEditItemName] = useState(""); // Edit form fields
  const [editStatus, setEditStatus] = useState("");
  const [editDuration, setEditDuration] = useState("");

  useEffect(() => {
    // Load existing items from localStorage when the component mounts
    const storedItems = JSON.parse(localStorage.getItem("items"));
    if (storedItems) {
      setItems(storedItems);
    }
  }, []);

  const saveToLocalStorage = (itemsToSave) => {
    localStorage.setItem("items", JSON.stringify(itemsToSave));
  };

  const addItem = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleString();
    const endTime = new Date(
      new Date(currentTime).getTime() + duration * 60000 // Convert minutes to milliseconds
    ).toLocaleString();

    const newItem = {
      name: itemName,
      status: status,
      duration: duration,
      startTime: currentTime,
      endTime: endTime,
    };

    setItems([...items, newItem]);
    saveToLocalStorage([...items, newItem]);
    clearForm();
  };

  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    saveToLocalStorage(updatedItems);
  };

  const clearForm = () => {
    setItemName("");
    setStatus("pending");
    setDuration("");
  };

  const filterItemsByStatus = (status) => {
    if (status === "all") {
      return items;
    }
    return items.filter((item) => item.status === status);
  };

  const renderItems = (itemsToRender) => {
    return (
      <tbody>
        {itemsToRender.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.duration} minutes</td>
            <td>{item.startTime}</td>
            <td>{item.endTime}</td>
            <td>{item.status}</td>
            <td>
              <button
                className="btn btn-edit btn-lg"
                onClick={() => editItem(index)}
              >
                Edit
              </button>
              <button
                className="btn btn-delete btn-lg"
                onClick={() => deleteItem(index)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        {editingIndex !== -1 && ( // Render edit form conditionally
          <tr>
            <td>
              <input
                type="text"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
              />
            </td>
            <td colSpan="2">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </td>
            <td>
              <button
                className="btn btn-save btn-sm"
                onClick={() => saveEditedItem()}
              >
                Save
              </button>
              <button
                className="btn btn-cancel btn-sm"
                onClick={() => cancelEdit()}
              >
                Cancel
              </button>
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  const editItem = (index) => {
    // Set the editing state and populate the edit form with the item's data
    setEditingIndex(index);
    const itemToEdit = items[index];
    setEditItemName(itemToEdit.name);
    setEditStatus(itemToEdit.status);
    setEditDuration(itemToEdit.duration);
  };

  const saveEditedItem = () => {
    // Save the edited item and reset the editing state
    const updatedItems = [...items];
    const editedItem = {
      name: editItemName,
      status: editStatus,
      duration: editDuration,
      startTime: items[editingIndex].startTime,
      endTime: items[editingIndex].endTime,
    };
    updatedItems[editingIndex] = editedItem;
    setItems(updatedItems);
    saveToLocalStorage(updatedItems);
    setEditingIndex(-1);
    clearEditForm();
  };

  const clearEditForm = () => {
    setEditItemName("");
    setEditStatus("pending");
    setEditDuration("");
  };

  const cancelEdit = () => {
    // Cancel editing and reset the editing state
    setEditingIndex(-1);
    clearEditForm();
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">To do list</h1>

      <form onSubmit={addItem}>
        <div className="form-group">
          <label htmlFor="itemName">Name:</label>
          <input
            type="text"
            id="itemName"
            className="form-control"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (in minutes):</label>
          <input
            type="number"
            id="duration"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Item
        </button>
      </form>

      <div className="mt-3">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="container mt-3 text-center">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {renderItems(filterItemsByStatus(statusFilter))}
        </table>
      </div>
    </div>
  );
}

export default App;
