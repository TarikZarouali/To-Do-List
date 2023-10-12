<template>
  <div class="container mt-4">
    <h1 class="text-center">Edit Item</h1>

    <!-- Edit form -->
    <form @submit.prevent="editItem" class="mb-4">
      <div class="form-group">
        <label for="editName">Name:</label>
        <input
          v-model="editedItem.name"
          type="text"
          id="editName"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="editStatus">Status:</label>
        <select
          v-model="editedItem.status"
          id="editStatus"
          class="form-control"
          required
        >
          <option value="pending">Pending</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="form-group">
        <label for="editDuration">Duration (in minutes):</label>
        <input
          v-model="editedItem.duration"
          type="number"
          id="editDuration"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Save Changes</button>
      <button @click="cancelEditing" class="btn btn-secondary">Cancel</button>
      <!-- Cancel button -->
    </form>
  </div>
</template>

<script>
export default {
  props: {
    itemToEdit: Object, // Receive the item to edit as a prop
  },
  data() {
    return {
      editedItem: { ...this.itemToEdit }, // Initialize editedItem with the item to edit
    };
  },
  methods: {
    editItem() {
      // Emit an event with the edited item
      this.$emit("save-changes", this.editedItem);
      this.$router.push("/");
    },
    cancelEditing() {
      this.$router.push("/"); // Redirect to the main page without saving changes
    },
  },
};
</script>

<style scoped>
/* Your CSS styles for the EditItem.vue component */
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
  height: 30px;
  width: 100px;
  border-radius: 25px;
  color: #fff;
  border: none;
}

.btn-secondary {
  background-color: #6c757d;
  height: 30px;
  width: 80px;
  border-radius: 25px;
  margin-left: 1em;
  color: #fff;
  border: none;
}
</style>
