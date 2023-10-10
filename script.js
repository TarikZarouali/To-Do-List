// Initialize items array from localStorage or create an empty array
let items = JSON.parse(localStorage.getItem('items')) || [];

// Function to render the item table
function renderItemTable(filteredItems) {
    const itemTableBody = document.getElementById('itemTableBody');
    itemTableBody.innerHTML = '';

    (filteredItems || items).forEach((item, index) => {
        const row = document.createElement('tr');

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
                <button class="btn btn-primary btn-sm mr-2 edit-button" data-index="${index}">Edit</button>
                <button class="btn btn-danger btn-sm delete-button" data-index="${index}">Delete</button>
            </td>
        `;

        itemTableBody.appendChild(row);
    });
}

// Function to add a new item
function addItem(e) {
    e.preventDefault(); // Prevent form submission

    const itemName = document.getElementById('itemName').value;
    const status = document.getElementById('status').value;
    const duration = parseInt(document.getElementById('duration').value, 10);
    const currentTime = Math.floor(Date.now() / 1000);

    const newItem = {
        name: itemName,
        status: status,
        startTime: currentTime,
        endTime: currentTime + (duration * 60), // Convert duration to seconds
        duration: duration,
    };

    items.push(newItem);

    // Save items to localStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Update the table with all items
    renderItemTable();
    clearForm();
}

// Function to clear the form
function clearForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('status').value = 'pending';
    document.getElementById('duration').value = '';
}

// Initialize the item table on page load with all items
renderItemTable();

// Add an event listener to the form submission
document.getElementById('addItemForm').addEventListener('submit', addItem);

// Function to filter items by status
function filterItemsByStatus(status) {
    return status === 'all' ? items : items.filter(item => item.status === status);
}

// Function to update the table based on the selected status
function updateTableByStatus() {
    const statusFilter = document.getElementById('statusFilter');
    const selectedStatus = statusFilter.value;

    const filteredItems = filterItemsByStatus(selectedStatus);
    renderItemTable(filteredItems);
}

// Add an event listener to the status filter dropdown
document.getElementById('statusFilter').addEventListener('change', updateTableByStatus);

// Function to edit an item
function editItem(index) {
    // Redirect to the edit.html page with the item index as a query parameter
    window.location.href = `edit.html?index=${index}`;
}

// Function to delete an item
function deleteItem(index) {
    // Remove the item from the items array
    items.splice(index, 1);

    // Save updated items to localStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Refresh the table
    renderItemTable();
}

// Add event listeners to the "Edit" and "Delete" buttons in the table
document.getElementById('itemTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-button')) {
        const index = parseInt(e.target.dataset.index, 10);
        editItem(index);
    } else if (e.target.classList.contains('delete-button')) {
        const index = parseInt(e.target.dataset.index, 10);
        deleteItem(index);
    }
});
