const closeModalButton = document.querySelector(".js-close-modal-btn");
const locationModal = document.querySelector(".js-location-modal");
const editModal = document.querySelector(".js-edit-modal");
const createModal = document.querySelector(".js-create-modal");
const allModal = document.querySelectorAll(".js-modal");

controlModal("close", "all");

allModal.forEach((modal) => {
  modal.classList.add("hide");
});

//function for controlling the modal
function controlModal(action, scope, id = null) {
  if (action == "open") {
    if (scope == "location") {
      locationModal.classList.remove("hide");
    } else if (scope == "edit") {
      editModal.classList.remove("hide");
    } else if (scope == "create") {
      createModal.classList.remove("hide");
    } else if (scope == "all") {
      allModal.forEach((modal) => modal.classList.remove("hide"));
    }
  } else if (action == "close") {
    if (scope == "location") {
      locationModal.classList.add("hide");
    } else if (scope == "edit") {
      editModal.classList.add("hide");
    } else if (scope == "create") {
      createModal.classList.add("hide");
    } else if (scope == "all") {
      allModal.forEach((modal) => modal.classList.add("hide"));
    }
  }
}
