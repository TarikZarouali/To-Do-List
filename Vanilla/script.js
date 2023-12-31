// Initialize items array from localStorage or create an empty array
let items = JSON.parse(localStorage.getItem("items")) || [];

// Function to render the item table
function renderItemTable(filteredItems) {
  const itemTableBody = document.querySelector(".js-itemTableBody");
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
        <button onclick="viewLocation(${index})">View Location</button>
      </td>
      <td>${startTime}</td>
      <td>${endTime}</td>
      <td>${item.status}</td>
      <td>
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
    `;

    itemTableBody.appendChild(row);
  });
}

// Function to add a new item
function addItem(e) {
  e.preventDefault(); // Prevent form submission

  const itemName = document.querySelector(".js-itemName").value;
  const status = document.querySelector(".js-status").value;
  const duration = parseInt(document.querySelector(".js-duration").value, 10);
  const location = document.querySelector(".js-location").value;
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
  document.querySelector(".js-itemName").value = "";
  document.querySelector(".js-status").value = "pending";
  document.querySelector(".js-duration").value = "";
  document.querySelector(".js-location").value = "";
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
  const statusFilter = document.querySelector(".js-statusFilter");
  const selectedStatus = statusFilter.value;

  const filteredItems = filterItemsByStatus(selectedStatus);
  renderItemTable(filteredItems);
}

// Add an event listener to the status filter dropdown
const statusFilter = document.querySelector(".js-statusFilter");
if (statusFilter) {
  statusFilter.addEventListener("change", updateTableByStatus);
}

// Function to edit an item
function editItem(index) {
  const editItem = items[index];
  const editItemIndexElement = document.querySelector(".js-editItemIndex");
  const editItemNameElement = document.querySelector(".js-editItemName");
  const editItemStatusElement = document.querySelector(".js-editItemStatus");
  const editItemDurationElement = document.querySelector(
    ".js-editItemDuration"
  );
  const editItemModal = document.querySelector(".js-editItemModal");

  if (
    editItemIndexElement &&
    editItemNameElement &&
    editItemStatusElement &&
    editItemDurationElement
  ) {
    editItemIndexElement.value = index;
    editItemNameElement.value = editItem.name;
    editItemStatusElement.value = editItem.status;
    editItemDurationElement.value = editItem.duration;

    // Display the edit modal
    editItemModal.style.display = "block";
  } else {
    alert("One or more edit form elements not found.");
  }
}

// Function to close the edit item modal
function closeEditItemModal() {
  document.querySelector(".js-editItemModal").style.display = "none";
}

// Function to save the edited item
function saveEditedItem() {
  const index = document.querySelector(".js-editItemIndex").value;
  const editItemName = document.querySelector(".js-editItemName").value;
  const editItemStatus = document.querySelector(".js-editItemStatus").value;
  const editItemDuration = parseInt(
    document.querySelector(".js-editItemDuration").value,
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
  document.querySelector(".js-editItemModal").style.display = "none";

  // Refresh the table
  renderItemTable();
}

// Add an event listener to the edit modal save button
const editItemSaveButton = document.querySelector(".js-editItemSaveButton");
if (editItemSaveButton) {
  editItemSaveButton.addEventListener("click", saveEditedItem);
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
  const mapPlaceholder = document.querySelector(".js-mapContainer");
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
  document.querySelector(".js-viewLocationModal").style.display = "block";
}

// Close the view location modal
function closeViewLocationModal() {
  document.querySelector(".js-viewLocationModal").style.display = "none";
}

// Add an event listener to the close button in the view location modal
const closeViewLocationModalButton =
  document.querySelector(".js-viewModalClose");
if (closeViewLocationModalButton) {
  closeViewLocationModalButton.addEventListener(
    "click",
    closeViewLocationModal
  );
}

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
const addItemForm = document.querySelector(".js-addItemForm");
if (addItemForm) {
  addItemForm.addEventListener("submit", function (e) {
    addItem(e);
  });
}

// Initialize the item table on page load with all items and make it sortable
document.addEventListener("DOMContentLoaded", function () {
  renderItemTable();
  initializeSortable();
});

// Initialize Sortable.js for the table body
function initializeSortable() {
  const itemTableBody = document.querySelector(".js-itemTableBody");
  const sortable = new Sortable(itemTableBody, {
    animation: 500, // Adjust the animation speed as needed
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

// Add an event listener to the "Export to CSV" button
const exportButton = document.querySelector(".js-exportButton");
if (exportButton) {
  exportButton.addEventListener("click", exportToCSV);
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
