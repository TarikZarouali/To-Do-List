// Initialize items array from localStorage or create an empty array
let items = JSON.parse(localStorage.getItem("items")) || [];

// Function to render the item table
function renderItemTable(filteredItems) {
  const itemTableBody = document.getElementById("itemTableBody");
  itemTableBody.innerHTML = "";

  (filteredItems || items).forEach((item, index) => {
    const row = document.createElement("tr");

    // Display item details with readable dates
    const startTime = new Date(item.startTime * 1000).toLocaleString();
    const endTime = new Date(item.endTime * 1000).toLocaleString();

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.duration} minutes</td>
      <td>${startTime}</td>
      <td>${endTime}</td>
      <td>${item.status}</td>
      <td>
        <button class="btn btn-primary btn-sm mr-2" onclick="editItem(${index})" data-toggle="modal" data-target="#editItemModal">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">Delete</button>
      </td>
    `;

    itemTableBody.appendChild(row);
  });
}

// Function to add a new item with confetti effect
function addItem(e) {
  e.preventDefault(); // Prevent form submission

  const itemName = document.getElementById("itemName").value;
  const status = document.getElementById("status").value;
  const duration = parseInt(document.getElementById("duration").value, 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if (duration <= 0) {
    alert("Invalid duration. Please enter a duration greater than 0.");
    return false; // Prevent form submission
  }

  const newItem = {
    name: itemName,
    status: status,
    startTime: currentTime,
    endTime: currentTime + duration * 60, // Convert duration to seconds
    duration: duration,
  };

  items.push(newItem);

  // Save items to localStorage
  localStorage.setItem("items", JSON.stringify(items));

  // Update the table with all items
  renderItemTable();
  clearForm();

  // Start the confetti effect
  startConfetti();
}

// Function to start the confetti effect
function startConfetti() {
  // Configuration for the confetti effect
  const config = {
    spread: 180,
    startVelocity: 55,
    elementCount: 50,
    decay: 0.92,
  };

  // Create a confetti object with the specified configuration
  const confetti = new ConfettiGenerator(config);

  // Append the confetti element to the body
  confetti.render();

  // Automatically stop the confetti after a few seconds (you can adjust the duration)
  setTimeout(() => {
    confetti.clear();
  }, 5000); // Stop the confetti after 5 seconds
}

// Function to clear the form
function clearForm() {
  document.getElementById("itemName").value = "";
  document.getElementById("status").value = "pending";
  document.getElementById("duration").value = "";
}

// Initialize the item table on page load with all items
renderItemTable();

// Function to filter items by status
function filterItemsByStatus(status) {
  return status === "all"
    ? items
    : items.filter((item) => item.status === status);
}

// Function to update the table based on the selected status
function updateTableByStatus() {
  const statusFilter = document.getElementById("statusFilter");
  const selectedStatus = statusFilter.value;

  const filteredItems = filterItemsByStatus(selectedStatus);
  renderItemTable(filteredItems);
}

// Add an event listener to the status filter dropdown
document
  .getElementById("statusFilter")
  .addEventListener("change", updateTableByStatus);

// Function to edit an item
function editItem(index) {
  const editItem = items[index];
  document.getElementById("editItemIndex").value = index;
  document.getElementById("editItemName").value = editItem.name;
  document.getElementById("editItemStatus").value = editItem.status;
  document.getElementById("editItemDuration").value = editItem.duration;
}

// Function to save the edited item
function saveEditedItem() {
  const index = document.getElementById("editItemIndex").value;
  const editItemName = document.getElementById("editItemName").value;
  const editItemStatus = document.getElementById("editItemStatus").value;
  const editItemDuration = parseInt(
    document.getElementById("editItemDuration").value,
    10
  );

  if (isNaN(index) || index < 0 || index >= items.length) {
    alert("Invalid item index.");
    return;
  }

  const editedItem = items[index];
  editedItem.name = editItemName;
  editedItem.status = editItemStatus;
  editedItem.duration = editItemDuration;

  // Calculate new end time based on edited duration
  editedItem.endTime = editedItem.startTime + editItemDuration * 60;

  // Save updated items to localStorage
  localStorage.setItem("items", JSON.stringify(items));

  // Close the edit modal
  $("#editItemModal").modal("hide");

  // Refresh the table
  renderItemTable();
}

// Add an event listener to the save button in the edit modal
document
  .getElementById("editItemForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    saveEditedItem();
  });

// Confetti effect
document.getElementById("addItemForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  const itemName = document.getElementById("itemName").value;
  const status = document.getElementById("status").value;
  const duration = parseInt(document.getElementById("duration").value, 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if (duration <= 0) {
    alert("Invalid duration. Please enter a duration greater than 0.");
    return false; // Prevent form submission
  }

  const newItem = {
    name: itemName,
    status: status,
    startTime: currentTime,
    endTime: currentTime + duration * 60, // Convert duration to seconds
    duration: duration,
  };

  items.push(newItem);

  // Save items to localStorage
  localStorage.setItem("items", JSON.stringify(items));

  // Update the table with all items
  renderItemTable();
  clearForm();

  // Start the confetti effect
  startConfetti();
});

function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    items.splice(index, 1); // Remove the item from the array
    localStorage.setItem("items", JSON.stringify(items)); // Update localStorage
    renderItemTable(); // Refresh the table
  }
}
