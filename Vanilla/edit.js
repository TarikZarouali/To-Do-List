// Get the item from the URL query
const urlParams = new URLSearchParams(window.location.search);
const editItemIndex = parseInt(urlParams.get('index'), 10);

//  items array from localStorage or create an empty array
let items = JSON.parse(localStorage.getItem('items')) || [];

// Function to populate the edit form with item details
function populateEditForm() {
    const editItem = items[editItemIndex];
    document.getElementById('editItemIndex').value = editItemIndex;
    document.getElementById('editItemName').value = editItem.name;
    document.getElementById('editItemStatus').value = editItem.status;
    document.getElementById('editItemDuration').value = editItem.duration;
}

// Function to edit an item
function editItem(e) {
    e.preventDefault(); // Prevent form submission

    const editItemIndex = parseInt(document.getElementById('editItemIndex').value, 10);
    const editItemName = document.getElementById('editItemName').value;
    const editItemStatus = document.getElementById('editItemStatus').value;
    const editItemDuration = parseInt(document.getElementById('editItemDuration').value, 10);

    if (isNaN(editItemIndex) || editItemIndex < 0 || editItemIndex >= items.length) {
        alert('Invalid item index.');
        return;
    }

    const editedItem = items[editItemIndex];
    editedItem.name = editItemName;
    editedItem.status = editItemStatus;
    editedItem.duration = editItemDuration;

    // Calculate new end time based on edited duration
    editedItem.endTime = editedItem.startTime + (editItemDuration * 60);

    // Save updated items to localStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Redirect back to the original page
    window.location.href = 'index.html'; // Replace 'original.html' with your actual page name
}

// Populate the edit form on page load
populateEditForm();

// Add an event listener to the edit form submission
document.getElementById('editItemForm').addEventListener('submit', editItem);
