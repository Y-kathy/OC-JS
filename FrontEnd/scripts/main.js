// Get works from backend api
async function getWorks() {
  const works = await fetch("http://localhost:5678/api/works").then(
    (response) => response.json()
  );
  return works;
}

// Get categories from backend api
async function getCategories() {
  const categories = await fetch("http://localhost:5678/api/categories").then(
    (response) => response.json()
  );
  return categories;
}

// Fill the gallery tag with all works done
function generateGallery(works) {
  // Get parent tag
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML="";
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const figure = document.createElement("figure");
    figure.id = "work-" + work.id

    const imgFigure = document.createElement("img");
    imgFigure.src = work.imageUrl;
    imgFigure.alt = work.title;

    const figcaptionFigure = document.createElement("figcaption");
    figcaptionFigure.innerText = work.title;

    figure.appendChild(imgFigure);
    figure.appendChild(figcaptionFigure);

    gallery.appendChild(figure);
  }
}

function generateFilters(categories) {
  const filters = document.querySelector(".filters");

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const button = document.createElement("button");
    button.innerText = `${category.name}`;
    button.id = `${button.innerText}Btn`;
    filters.appendChild(button);
  }
}

function generateFiltersSection(categories) {
  const filters = document.querySelector(".filters");

  // Generate the "Tous" button first
  const TousBtn = document.createElement("button");
  TousBtn.innerText = "Tous";
  TousBtn.id = `${TousBtn.innerText}Btn`;
  // Append this button to the filters section
  filters.appendChild(TousBtn);

  // Generate other categories filters buttons
  generateFilters(categories);
}

function createFiltersListeners(works, categories) {
  // Create listeners for each filters
  // Get some DOM tags
  const gallery = document.querySelector(".gallery");
  const filterButtons = document.querySelectorAll(".filters button");

  // The "Tous" button is the first on
  filterButtons[0].addEventListener("click", () => {
    // Clear it all
    gallery.innerHTML = "";
    generateGallery(works);
    // Reset color and background color
    for (let i = 1; i < filterButtons.length; i++) {
      filterButtons[i].style.color = "#1D6154";
      filterButtons[i].style.backgroundColor = "white";
    }
    filterButtons[0].style.color = "white";
    filterButtons[0].style.backgroundColor = "#1D6154";
  });

  // Loop on each category
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const filterBtn = filterButtons[i + 1];
    filterBtn.addEventListener("click", () => {
      // Clear it all
      gallery.innerHTML = "";
      const filtered_works = works.filter(
        (work) => work.categoryId === category.id
      );
      generateGallery(filtered_works);
      for (let i = 0; i < filterButtons.length; i++) {
        if (filterBtn.id == filterButtons[i].id) {
          filterButtons[i].style.color = "white";
          filterButtons[i].style.backgroundColor = "#1D6154";
        } else {
          filterButtons[i].style.color = "#1D6154";
          filterButtons[i].style.backgroundColor = "white";
        }
      }
    });
  }
}

function is_logged_in() {
  const token = window.localStorage.getItem("token");
  if (token != null) return true;
  else return false;
}

function generateHeaderNavigation() {
  const header = document.querySelector(".image-and-nav")

  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  // Adding all bars: Careful to the ID on the login page
  ul.innerHTML = `
        <a href="#portfolio"><li>projets</li></a>
        <a href="#contact"><li>contact</li></a>
        <li id=loginTab>${is_logged_in() ? "logout" : "login"}</li>
        <a href="#"><li><img src="./assets/icons/instagram.png" alt="Instagram"></li></a>`;
  nav.appendChild(ul);
  header.appendChild(nav);

  // Create a listener on the login nav bar to handle the token and log process
  const loginTab = document.getElementById("loginTab");
  loginTab.addEventListener("click", () => {
    if (is_logged_in()) {
      // Delete the token & refresh the current page
      window.localStorage.removeItem("token");
      window.location = "./index.html";
    } else {
      // Open the login page
      window.location = "./login.html";
    }
  });
}

function generateEditionBanner() {
  const header = document.querySelector("header");
  const divBanner = document.createElement("div");
  divBanner.className = "banner";

  const editIcon = document.createElement("span");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");
  divBanner.appendChild(editIcon);

  const editText = document.createElement("span");
  editText.innerText = "Mode édition";
  divBanner.appendChild(editText);

  // Insert as the 1st child of the header
  header.insertBefore(divBanner, header.firstChild);
}

async function generatePortfolioEditButton(works, categories) {
  const head = document.querySelector("#portfolio .head");
  const linkEdition = document.createElement("a");
  linkEdition.href = "#modal";
  linkEdition.className = "js-modal";

  const editIcon = document.createElement("span");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");
  linkEdition.appendChild(editIcon);

  const editText = document.createElement("span");
  editText.innerText = "modifier";
  linkEdition.appendChild(editText);

  head.appendChild(linkEdition);

  linkEdition.addEventListener("click", () => {
    openModal(works, categories);
  });
}

async function main() {
  // API constants
  const works = await getWorks();
  const categories = await getCategories();

  generateHeaderNavigation();
  generateGallery(works);
  if (is_logged_in() == false) {
    generateFiltersSection(categories);
    createFiltersListeners(works, categories);
  } else {
    generateEditionBanner();
    generatePortfolioEditButton(works, categories);
  }
}

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
    addNewWork();
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

        const workGallery = document.getElementById("work-" + work.id)
        workGallery.remove();

        window.alert(`Le projet ${work.title} a bien été supprimé`);
      }
      else {
        window.alert(`Erreur lors de la suppression du projet ${work.title}`);
      }
    });
  }
}

/* On rajoute l'async + await pour pouvoir attendre la réponse de l'API et etre sur que le nouveau projet est bien créé */
async function addNewWork() {
  const headers = new Headers();
  /* D'apres la doc du FormData dont le lien est fourni dans le cours
  (https://developer.mozilla.org/fr/docs/Web/API/FormData/Using_FormData_Objects), on ne doit pas mettre de Content-Type lors d'un POST */
  // headers.append("Content-Type", "multipart/form-data")
  // On doit ajouter le token dans le header comme précisé dans l'API http://localhost:5678/api-docs/#/default/post_works
  // On le recupere dans le localStorage
  headers.append("Authorization", `Bearer ${window.localStorage.getItem("token")}`);

  const formData = new FormData()

  // On ajoute la photo à la FormData
  formData.append("image", document.getElementById("file").files[0]); // file[0] car l'input de type file recupere potentiellement une liste de files (on ne veut que le 1er)
  // On ajoute le titre à la FormData
  formData.append("title", document.getElementById("title").value);
  // On ajoute la catégorie a la FormData
  formData.append("category", document.getElementById("category").value);

  const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: headers,
      body: formData,
  });
  if (response.ok) {
      const newWork = await response.json();
      window.alert(`Le projet ${newWork.title} a bien été ajouté`);
      const works = await getWorks();
      generateGallery(works);
      closeModal();
  } else {
      window.alert("Erreur détectée lors de l'envoi du formulaire. Veuillez réessayer");
  }
}

function createEditablePhoto(gallery, work) {
  // Create the container for both the image and the bin
  const divPhoto = document.createElement("div");
  divPhoto.className = "js-modal-deletable-photo";

  // Create the image
  const photo = document.createElement("img");
  photo.src = work.imageUrl;
  divPhoto.appendChild(photo);

  // Create the trash bin (delete button)
  const divButton = document.createElement("div");
  divButton.className = "js-modal-deletable-photo-delete-div";
  const deleteButton = document.createElement("span");
  deleteButton.classList.add("fa-solid", "fa-trash-can");
  divButton.appendChild(deleteButton);
  divPhoto.appendChild(divButton);
  divButton.addEventListener("click", () => {
    deleteWork(work, divPhoto);
  });

  gallery.appendChild(divPhoto);
}

main();
