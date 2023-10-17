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
      <td>
        <button class="btn btn-primary btn-sm" onclick="viewLocation(${index})" data-toggle="modal" data-target="#viewLocationModal">View Location</button>
      </td>
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

// Function to add a new item
function addItem(e) {
  e.preventDefault(); // Prevent form submission

  const itemName = document.getElementById("itemName").value;
  const status = document.getElementById("status").value;
  const duration = parseInt(document.getElementById("duration").value, 10);
  const location = document.getElementById("location").value;
  const currentTime = Math.floor(Date.now() / 1000);

  if (duration <= 0) {
    alert("Invalid duration. Please enter a duration greater than 0.");
    return false;
  }

  const newItem = {
    name: itemName,
    status: status,
    startTime: currentTime,
    endTime: currentTime + duration * 60, // Convert duration to seconds
    duration: duration,
    location: location,
  };

  items.push(newItem);

  // Save items to localStorage
  localStorage.setItem("items", JSON.stringify(items));

  // Update the table with all items
  renderItemTable();
  clearForm();
}

// Function to clear the form
function clearForm() {
  document.getElementById("itemName").value = "";
  document.getElementById("status").value = "pending";
  document.getElementById("duration").value = "";
  document.getElementById("location").value = "";
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

// Add an event listener to the edit modal save button
document
  .getElementById("editItemSaveButton")
  .addEventListener("click", saveEditedItem);

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

// Function to view the location on the map
function viewLocation(index) {
  const location = items[index].location;

  if (!location) {
    alert("No location available for this item.");
    return;
  }

  // Use the "location" value to display the location on a map in the viewLocationModal
  // You will need to implement the map integration here.
  // The code for this part depends on the mapping service you are using.
  // You can replace the following placeholder code with your map integration code.
  // For example, if you are using Google Maps, you would replace the map placeholder below with your Google Maps code.
  const mapPlaceholder = document.getElementById("mapContainer");
  mapPlaceholder.innerHTML = `<iframe
    width="100%"
    height="100%"
    frameborder="0"
    scrolling="no"
    marginheight="0"
    marginwidth="0"
    src="https://maps.google.com/maps?q=${location}&output=embed"
  ></iframe>`;

  // Show the viewLocationModal
  $("#viewLocationModal").modal("show");
}

// Close the view location modal
function closeViewLocationModal() {
  $("#viewLocationModal").modal("hide");
}

// Add an event listener to the close button in the view location modal
document
  .getElementById("closeViewLocationModalButton")
  .addEventListener("click", closeViewLocationModal);

// Function to delete an item
function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    items.splice(index, 1);

    // Save updated items to localStorage
    localStorage.setItem("items", JSON.stringify(items));

    // Update the table with all items
    renderItemTable();
  }
}

// Add an event listener to the form for adding a new item
document.getElementById("addItemForm").addEventListener("submit", function (e) {
  addItem(e);
});

// Initialize the item table on page load with all items and make it sortable
document.addEventListener("DOMContentLoaded", function () {
  renderItemTable();
  initializeSortable();
});

// Initialize Sortable.js for the table body
function initializeSortable() {
  const itemTableBody = document.getElementById("itemTableBody");
  const sortable = new Sortable(itemTableBody, {
    animation: 150, // Adjust the animation speed as needed
    onEnd: function (evt) {
      // Handle item reordering here
      const movedItem = items.splice(evt.oldIndex, 1)[0];
      items.splice(evt.newIndex, 0, movedItem);
      // Save the updated order to localStorage
      localStorage.setItem("items", JSON.stringify(items));
    },
  });
}

// Function to convert data to CSV format and trigger download
function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(date * 1000).toLocaleString(undefined, options);
}

function exportToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Header row for the CSV
  const header = [
    "Item Name",
    "Duration",
    "Location",
    "Start Time",
    "End Time",
    "Status", // Moved "Status" to the end
  ];
  csvContent += header.join(",") + "\n";

  // Iterate through the items and add them to the CSV
  items.forEach((item) => {
    const row = [
      item.name,
      item.duration,
      item.location,
      formatDate(item.startTime),
      formatDate(item.endTime),
      item.status, // Moved "Status" to the end
    ];
    csvContent += row.join(",") + "\n";
  });

  // Create a data URI and trigger the download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "todo_list_data.csv");
  document.body.appendChild(link); // Required for Firefox
  link.click();
}
