<template>
  <div class="container mt-4">
    <h1 class="text-center">To-Do List</h1>

    <!-- Form to add a new item -->
    <form @submit.prevent="addItem" class="mb-4">
      <div class="form-group">
        <label for="itemName">Name:</label>
        <input
          v-model="newItem.name"
          type="text"
          id="itemName"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="status">Status:</label>
        <select
          v-model="newItem.status"
          id="status"
          class="form-control"
          required
        >
          <option value="pending">Pending</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="form-group">
        <label for="duration">Duration (in minutes):</label>
        <input
          v-model="newItem.duration"
          type="number"
          id="duration"
          class="form-control"
          required
          @input="resetNegativeDuration"
        />
      </div>
      <div class="form-group">
        <label for="location">Location:</label>
        <input
          v-model="newItem.location"
          type="text"
          id="location"
          class="form-control"
        />
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

    <button @click="exportToCSV" class="btn btn-success">Export to CSV</button>

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
          <th>view</th>
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
            <button @click="removeItem(index)" class="btn btn-danger btn-lg">
              Remove
            </button>
          </td>
          <td>
            <button @click="startEditing(index)" class="btn btn-primary btn-lg">
              Edit
            </button>
          </td>
          <td>
            <button
              @click="viewLocation(item.location)"
              class="btn btn-info btn-lg"
            >
              View Location
            </button>
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

  <!-- View Location Modal -->
  <div
    class="modal fade"
    id="viewLocationModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="viewLocationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="viewLocationModalLabel">Location</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="mapContainer">
          <iframe width="100%" height="400" :src="googleMapsUrl"></iframe>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            id="closeViewLocationModalButton"
            class="btn btn-secondary"
            data-dismiss="modal"
            @click="closeViewLocationModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import EditItem from "./views/EditItem.vue";
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY"; // Replace with your Google Maps API key

const items = ref([]);
const newItem = ref({
  name: "",
  status: "pending",
  duration: 0,
  location: "",
});
const selectedStatus = ref("all");
const editingIndex = ref(null);

const filteredItems = computed(() => {
  if (selectedStatus.value === "all") {
    return items.value;
  } else {
    return items.value.filter((item) => item.status === selectedStatus.value);
  }
});

onMounted(() => {
  const savedItems = localStorage.getItem("todoItems");
  if (savedItems) {
    items.value = JSON.parse(savedItems);
  }
});

function resetNegativeDuration() {
  if (newItem.value.duration < 0) {
    alert("Duration must be a positive number.");
    newItem.value.duration = 0;
  }
}

function addItem() {
  newItem.value.startTime = new Date().toLocaleTimeString();
  newItem.value.endTime = calculateEndTime(newItem.value);
  items.value.push({ ...newItem.value });
  newItem.value.name = "";
  newItem.value.duration = 0;
  newItem.value.location = "";
  saveItems();
}

function removeItem(index) {
  items.value.splice(index, 1);
  saveItems();
}

function calculateEndTime(item) {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + item.duration * 60 * 1000);
  return endTime.toLocaleTimeString();
}

function startEditing(index) {
  editingIndex.value = index;
}

function saveEditedItem(updatedItem) {
  if (editingIndex.value !== null) {
    items.value[editingIndex.value] = { ...updatedItem };
    editingIndex.value = null;
    saveItems();
  }
}

function viewLocation(location) {
  const googleMapsUrl = `https://maps.google.com/maps?q=${location}&output=embed`;
  const viewLocationModal = document.getElementById("viewLocationModal");
  viewLocationModal.classList.add("show");
  newItem.value.location = location;
}

function closeViewLocationModal() {
  const viewLocationModal = document.getElementById("viewLocationModal");
  viewLocationModal.classList.remove("show");
}

function saveItems() {
  localStorage.setItem("todoItems", JSON.stringify(items.value));
}

const googleMapsUrl = computed(() => {
  return `https://maps.google.com/maps?q=${newItem.value.location}&output=embed`;
});

// Function to export data to CSV
function exportToCSV() {
  const csvData = items.value.map((item) => {
    return `${item.name},${item.duration},${item.startTime},${item.endTime},${item.status},${item.location}`;
  });
  csvData.unshift("Name,Duration,Start Time,End Time,Status,Location");
  const csvContent = "data:text/csv;charset=utf-8," + csvData.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "todo_items.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
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

.btn-info {
  background-color: #17a2b8;
  color: #fff;
  border: none;
}

.table {
  margin-top: 20px;
  width: 50rem;
}

table th {
  background-color: #f5f5f5;
}

table th,
table td {
  text-align: center;
}

table td {
  vertical-align: middle;
}

.modal-content {
  position: relative;
}
</style>
