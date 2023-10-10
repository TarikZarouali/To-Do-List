<template>
  <div class="container mt-4">
    <h1 class="text-center">To-Do List</h1>

    <!-- Form to add a new item -->
    <form @submit.prevent="addItem" class="mb-4">
      <div class="form-group">
        <label for="itemName">Name:</label>
        <input v-model="newItem.name" type="text" id="itemName" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="status">Status:</label>
        <select v-model="newItem.status" id="status" class="form-control" required>
          <option value="pending">Pending</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="form-group">
        <label for="duration">Duration (in minutes):</label>
        <input v-model="newItem.duration" type="number" id="duration" class="form-control" required @input="resetNegativeDuration">
      </div>
      <button type="submit" class="btn btn-primary">Add Item</button>
    </form>
    
    <!-- Filter by Status -->
    <div class="form-group">
      <label for="filterStatus">Filter by Status:</label>
      <select v-model="selectedStatus" id="filterStatus" class="form-control">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
    </div>

    <!-- Table to display items -->
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Duration (minutes)</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Status</th>
          <th>edit</th>
          <th>delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredItems" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.duration }}</td>
          <td>{{ item.startTime }}</td>
          <td>{{ item.endTime }}</td>
          <td>{{ item.status }}</td>
          <td>
            <button @click="removeItem(index)" class="btn btn-danger btn-lg" style="border-radius: 25px; height: 2rem; width: 8rem;">Remove</button>
          </td>
          <td>
            <!-- Set the editingIndex when clicking the Edit button -->
            <button @click="startEditing(index)" class="btn btn-primary btn-lg" style="border-radius: 25px; height: 2rem; width: 8rem;">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Include the EditItem component with v-if when editing is required -->
    <EditItem
      v-if="editingIndex !== null"
      :item-to-edit="items[editingIndex]"
      @save-changes="saveEditedItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import EditItem from './views/EditItem.vue'; // Import your EditItem component

const items = ref([]);
const newItem = ref({
  name: '',
  status: 'pending',
  duration: 0,
});
const selectedStatus = ref('all');
const editingIndex = ref(null);

// Load data from local storage when the component is mounted
onMounted(() => {
  const savedItems = localStorage.getItem('todoItems');
  if (savedItems) {
    items.value = JSON.parse(savedItems);
  }
});

//function to handle negative duration
function resetNegativeDuration() {
  if (newItem.value.duration < 0) {
    alert("put in a duration above 0!")
  }
}

// Function to handle the add item action
function addItem() {
  newItem.value.startTime = new Date().toLocaleTimeString();
  newItem.value.endTime = calculateEndTime(newItem.value);
  items.value.push({ ...newItem.value });
  newItem.value.name = '';
  newItem.value.duration = 0;

  // Save the updated items to local storage
  localStorage.setItem('todoItems', JSON.stringify(items.value));
}

// Function to remove an item
function removeItem(index) {
  items.value.splice(index, 1);

  // Save the updated items to local storage
  localStorage.setItem('todoItems', JSON.stringify(items.value));
}

// Function to calculate end time
function calculateEndTime(item) {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + item.duration * 60 * 1000);
  return endTime.toLocaleTimeString();
}

// Function to start editing an item
function startEditing(index) {
  editingIndex.value = index;
}

// Function to save changes made in the EditItem component
function saveEditedItem(updatedItem) {
  if (editingIndex.value !== null) {
    // Update the item in the items array
    items.value[editingIndex.value] = { ...updatedItem };
    editingIndex.value = null;

    // Save the updated items to local storage
    localStorage.setItem('todoItems', JSON.stringify(items.value));
  }
}

// Computed property to filter items by status
const filteredItems = computed(() => {
  if (selectedStatus.value === 'all') {
    return items.value;
  } else {
    return items.value.filter(item => item.status === selectedStatus.value);
  }
});
</script>
<style scoped>
/* Your CSS styles here */
.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  border-radius: 10px;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
  border: none;
}

.table {
  margin-top: 20px;
  width: 50rem;
}

.table th {
  background-color: #f5f5f5;
}

.table th,
.table td {
  text-align: center;
}

.table td {
  vertical-align: middle;
}
</style>
