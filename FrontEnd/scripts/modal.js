export function openModal(works, categories) {
  // Get the modal
  const modal = document.getElementById("modal");
  // Open the modal
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  generateModalHome(works, categories);

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("click", function(e) {
    if (e.target == modal) {
      closeModal();
    }
  });

  // When the user press the escape button, close the modal
  window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal();
    }
  });
}

function closeModal() { 
  const modal = document.getElementById("modal");
  if (modal == null) return;
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.removeEventListener("keydown", closeModal);

  // Clean the current wrapper
    clearModalWrapper()
}

function clearModalWrapper() {
  // Resetting the modal state to an empty one without any content
  const homeModalWrapper = document.querySelector(".js-modal-home")
  if (homeModalWrapper !== null)
    homeModalWrapper.remove()

  // Resetting the modal state to an empty one without any content
  const addProjectModalWrapper = document.querySelector(".js-modal-add")
  if (addProjectModalWrapper !== null)
    addProjectModalWrapper.remove()
}

function generateModalHome(works, categories) {
  const head = document.querySelector(".head");
  const modalBox = document.querySelector(".modal");

  // Modal content creation
  const modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-wrapper", "js-modal-home");

  // closing button
  // div created to organize the CSS between flex centered and button on the right
  const divCloseButton = document.createElement("div");
  divCloseButton.className = "js-modal-div-header";
  const modalCloseButton = document.createElement("span");
  modalCloseButton.classList.add("fa-solid", "fa-xmark");
  modalCloseButton.style.marginLeft = "98%" // To set the button to the right side
  modalCloseButton.addEventListener("click", () => {
    closeModal();
  });

  divCloseButton.appendChild(modalCloseButton);
  modalWrapper.appendChild(divCloseButton);

  // Gallery title
  const galleryTitle = document.createElement("h3");
  galleryTitle.innerText = "Galerie photo";
  galleryTitle.className = "js-modal-title";
  modalWrapper.appendChild(galleryTitle);

  // Works
  const gallery = document.createElement("div");
  gallery.className = "js-modal-gallery";
  for (let i = 0 ; i < works.length ; i++) {
    createEditablePhoto(gallery, works[i]);
  }
  modalWrapper.appendChild(gallery);

  // Add-work button
  const addButton = document.createElement("input");
  addButton.type = "submit";
  addButton.value = "Ajouter une photo";
  modalWrapper.appendChild(addButton);
  addButton.addEventListener("click", () => {
    generateModalNewWorkForm(works, categories);
  });

  modalBox.appendChild(modalWrapper);
  head.appendChild(modalBox);
}

function generateModalNewWorkForm(works, categories) {
  // Clear the content of the modal
  clearModalWrapper();

  // Get the modal
  const modalBox = document.querySelector(".modal");

  // Modal content creation
  const modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-wrapper", "js-modal-add");
  
  // Navigation buttons
  const divNavigation = document.createElement("div");
  divNavigation.className = "js-modal-div-header";
  // Button to go back to the first modal screen (home)
  const previousButton = document.createElement("span");
  previousButton.classList.add("fa-solid", "fa-arrow-left");
  divNavigation.appendChild(previousButton);
  previousButton.addEventListener("click", () => {
    clearModalWrapper();
    generateModalHome(works, categories);
  });
  // Close button
  const modalCloseButton = document.createElement("span");
  modalCloseButton.classList.add("fa-solid", "fa-xmark");
  modalCloseButton.addEventListener("click", closeModal);
  divNavigation.appendChild(modalCloseButton);
  modalWrapper.appendChild(divNavigation);

  // title
  const title = document.createElement("h3");
  title.innerText = "Ajout photo";
  title.className = "js-modal-title";
  modalWrapper.appendChild(title);

  // New work form
  const form = generateAddWorkForm(categories);

  modalWrapper.appendChild(form);

  // Append the whole content to the modal
  modalBox.appendChild(modalWrapper);
}

function generateAddWorkForm(categories) {
  const form = document.createElement("form");
  form.id = "modal-add-work";

  const divInputs = document.createElement("div");
  divInputs.className = "modal-add-inputs";

  // File upload
  const divFileBox = document.createElement("div");
  divFileBox.className = "add-file-box";
  // Create another div to get either image information or the preview
  const divPreview = document.createElement("div");
  divPreview.id = "preview";
  divFileBox.appendChild(divPreview);
  // Picture logo
  const fileLogo = document.createElement("span");
  fileLogo.classList.add("fa-regular", "fa-image");
  divPreview.appendChild(fileLogo);
  // Adding button
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "file";
  fileInput.name = "file";
  fileInput.required = true;
  fileInput.accept = ".jpg, .png";
  divPreview.appendChild(fileInput);
  fileInput.style.opacity = 0;
  const fileLabel = document.createElement("label");
  fileLabel.id = "uploadFileButton";
  fileLabel.setAttribute("for", "file");
  fileLabel.innerText = "+ Ajouter photo";
  divPreview.appendChild(fileLabel);
  // Requirements
  const fileRequirements = document.createElement("span");
  fileRequirements.className = "add-image-requirements";
  fileRequirements.innerText = "jpg, png : 4mo max";
  divPreview.appendChild(fileRequirements);
  divInputs.appendChild(divFileBox);

  // Title of the work
  const divTitle = document.createElement("div");
  divTitle.className = "modal-add-title";
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.innerText = "Titre";
  divTitle.appendChild(titleLabel);
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";
  titleInput.id = "title";
  titleInput.required = true;
  divTitle.appendChild(titleInput);
  divInputs.appendChild(divTitle);

  // Category of the work
  const divCategory= document.createElement("div");
  divCategory.className = "modal-add-category";
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.innerText = "Catégorie";
  divCategory.appendChild(categoryLabel);
  const categorySelect= document.createElement("select");
  categorySelect.name = "category";
  categorySelect.id = "category";
  categorySelect.required = true;
  // Add the default category
  const defaultOption = document.createElement("option");
  defaultOption.value = 0;
  defaultOption.innerText = "";
  defaultOption.selected = true; // Marked as the default option
  categorySelect.appendChild(defaultOption);
  for (let i = 0 ; i < categories.length ; i++) {
    const option = document.createElement("option");
    option.value = categories[i].id;
    option.innerText = categories[i].name;
    categorySelect.appendChild(option);
  }
  divCategory.appendChild(categorySelect);
  divInputs.appendChild(divCategory);

  form.appendChild(divInputs);

  // Adding listeners on each inputs to enable the submit button
  titleInput.addEventListener("input", enableSubmitting);
  categorySelect.addEventListener("input", enableSubmitting);
  fileInput.addEventListener("input", enableSubmitting);

  // Submit button
  const submitButton = document.createElement("input");
  submitButton.id = "add-work-submit";
  submitButton.type = "submit";
  submitButton.value = "Valider";
  submitButton.disabled = true;
  form.appendChild(submitButton);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addNewWork(form);
  });

  return form;
}

function updateImageDisplay(input) {
  const preview = document.getElementById("preview");

  // Display : none to all children. If just deleted, there would be issues while gathering information
  for (const child of preview.children) {
    child.style.display = "none";
  }

  const file = input.files[0];
  let img = preview.querySelector("img");
  if (img === null) {
    img = document.createElement("img");
    preview.appendChild(img);
  }
  img.src = window.URL.createObjectURL(file);
  img.style.display = "block";
}

function isValidFile(file) {
  if (file.name === null)
    return false;

  // Check size
  if (file.size > 4000000)
    return false;

  // Check type
  const fileTypes = ["image/jpg", "image/png"];
  for (let i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i])
      return true;
  }
      
  return false;
}

function enableSubmitting() {
  const form = document.getElementById("modal-add-work");
  const submit = document.getElementById("add-work-submit");
  const fileInput = document.getElementById("file");
  // Check file
  if (fileInput.value === "") {
    disableSubmitButton(submit);
    return false;
  }

  // Check title
  if (document.getElementById("title").value === "") {
    disableSubmitButton(submit);
    return false;
  }

  // Check category
  if (document.getElementById("category").value === "0") {
    disableSubmitButton(submit);
    return false;
  }

  // Check only if there is a file
  if (fileInput.files.length > 0) {
    let alert = document.querySelector("#modal-add-work alert");
    if (isValidFile(fileInput.files[0]) === true) {
      updateImageDisplay(fileInput);
      enableSubmitButton(submit);
      if (alert !== null) 
        alert.remove();
    } else {
      if (alert == null) {
        alert = document.createElement("alert");
        form.appendChild(alert);
      }
      alert.innerText = "Le fichier sélectionné ne correspond pas aux critères requis. Veuillez le changer.";
      disableSubmitButton(submit);
    }
  }

  return true;
}

function enableSubmitButton(button) {
  button.disabled = false;
  button.style.backgroundColor = "rgb(29, 97, 84)";
  button.style.cursor = "pointer";
}

function disableSubmitButton(button) {
  button.disabled = true;
  button.style.backgroundColor = "rgb(167, 167, 167)";
  button.style.cursor = "auto";
}

function deleteWork(work, divPhoto) {
  const confirmation = confirm(`Etes-vous certaine de supprimer le projet nommé ${work.title} ?`);
  if (confirmation === true) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${window.localStorage.getItem("token")}`);
    // Call the fetch function with the token
    fetch(`http://localhost:5678/api/works/${work.id}`, {
      method: "DELETE",
      headers: headers
    }).then((response) => {
      // Returns true if the response returned successfully
      if (response.ok) {
        // Think to delete also the listener
        divPhoto.removeEventListener("click", deleteWork);
        // Remove all children
        divPhoto.remove();
        window.alert(`Le projet ${work.title} a bien été supprimé`);
      }
      else {
        window.alert(`Erreur lors de la suppression du projet ${work.title}`);
      }
    });
  }
}

function addNewWork(form) {
  console.log("Ajout d'un nouveau projet réalisé avec succès !");
}

function createEditablePhoto(gallery, work) {
  // Create the container for both the image and the bin
  const divPhoto = document.createElement("div");
  divPhoto.className = "js-modal-photo";

  // Create the image
  const divImage = document.createElement("div");
  divImage.className = "js-modal-photo-img";
  const photo = document.createElement("img");
  photo.src = work.imageUrl;
  divImage.appendChild(photo);
  divPhoto.appendChild(divImage);
  
  // Create the trash bin (delete button)
  const divButton = document.createElement("div");
  divButton.className = "js-modal-photo-delete-btn";
  const deleteButton = document.createElement("span");
  deleteButton.classList.add("fa-solid", "fa-trash-can");
  divButton.appendChild(deleteButton);
  divPhoto.appendChild(divButton);
  divPhoto.addEventListener("click", () => {
    deleteWork(work, divPhoto);
  });

  gallery.appendChild(divPhoto);
}