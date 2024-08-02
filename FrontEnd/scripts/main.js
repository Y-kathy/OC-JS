// Get works from backend api
async function getWorks() {
    const works = await fetch("http://localhost:5678/api/works")
        .then(response => response.json())
    return works
}

// Get categories from backend api
async function getCategories() {
    const categories = await fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
    return categories
}

// Fill the gallery tag with all works done
function generateGallery(works) {
    // Get parent tag
    const gallery = document.querySelector(".gallery")
    for (let i = 0 ; i < works.length ; i++) {
        const work = works[i]
        const figure = document.createElement("figure")

        const imgFigure = document.createElement("img")
        imgFigure.src = work.imageUrl
        imgFigure.alt = work.title

        const figcaptionFigure = document.createElement("figcaption")
        figcaptionFigure.innerText = work.title

        figure.appendChild(imgFigure)
        figure.appendChild(figcaptionFigure)

        gallery.appendChild(figure)
    }
}

function generateFilters(categories) {
    const filters = document.querySelector(".filters")

    for (let i = 0 ; i < categories.length ; i++) {
        const category = categories[i]
        const button = document.createElement("button")
        button.innerText = `${category.name}`
        button.id = `${button.innerText}Btn`
        filters.appendChild(button)
    }
}

function generateFiltersSection(categories) {
    const filters = document.querySelector(".filters")

    // Generate the "Tous" button first
    const TousBtn = document.createElement("button")
    TousBtn.innerText = "Tous"
    TousBtn.id = `${TousBtn.innerText}Btn`
    // Append this button to the filters section
    filters.appendChild(TousBtn)

    // Generate other categories filters buttons
    generateFilters(categories)
}

function createFiltersListeners(works, categories) {
    // Create listeners for each filters
    // Get some DOM tags
    const gallery = document.querySelector(".gallery")
    const filterButtons = document.querySelectorAll(".filters button")

    // The "Tous" button is the first on
    filterButtons[0].addEventListener("click", () => {
        // Clear it all
        gallery.innerHTML = ""
        generateGallery(works)
        // Reset color and background color
        for (let i = 1 ; i < filterButtons.length ; i++) {
            filterButtons[i].style.color = "#1D6154"
            filterButtons[i].style.backgroundColor = "white"
        }
        filterButtons[0].style.color = "white"
        filterButtons[0].style.backgroundColor = "#1D6154"
    })
    
    // Loop on each category
    for (let i = 0 ; i < categories.length ; i++) {
        const category = categories[i]
        const filterBtn = filterButtons[i + 1]
        filterBtn.addEventListener("click", () => {
            // Clear it all
            gallery.innerHTML = ""
            const filtered_works = works.filter((work) => work.categoryId === category.id)
            generateGallery(filtered_works)
            for (let i = 0 ; i < filterButtons.length ; i++) {
                if (filterBtn.id == filterButtons[i].id) {
                    filterButtons[i].style.color = "white"
                    filterButtons[i].style.backgroundColor = "#1D6154"
                } else {
                    filterButtons[i].style.color = "#1D6154"
                    filterButtons[i].style.backgroundColor = "white"
                }
            }
        })
    }
}

function is_logged_in() {
    const token = window.localStorage.getItem("token")
    if (token != null)
        return true
    else 
        return false
}

function generateHeaderNavigation() {
    const header = document.querySelector(".head")
    
    const nav = document.createElement("nav")
    const ul = document.createElement("ul")

    // Adding all bars: Careful to the ID on the login page
    ul.innerHTML = `
        <a href="#portfolio"><li>projets</li></a>
        <a href="#contact"><li>contact</li></a>
        <li id=loginTab>${is_logged_in() ? "logout" : "login"}</li>
        <a href="#"><li><img src="./assets/icons/instagram.png" alt="Instagram"></li></a>`
    nav.appendChild(ul)
    header.appendChild(nav)

    // Create a listener on the login nav bar to handle the token and log process
    const loginTab = document.getElementById("loginTab")
    loginTab.addEventListener("click", () => {
        if (is_logged_in()) {
            // Delete the token & refresh the current page
            window.localStorage.removeItem("token")
            window.location = "./index.html"
        } else {
            // Open the login page
            window.location = "./login.html"
        }
    })
}

function generateEditionBanner() {
    const header = document.querySelector("header")
    const divBanner = document.createElement("div")
    divBanner.className = "banner"

    const editIcon = document.createElement("span")
    editIcon.className = "material-symbols-outlined"
    editIcon.innerText = "edit_square"
    divBanner.appendChild(editIcon)

    const editText = document.createElement("span")
    editText.innerText = "Mode édition"
    divBanner.appendChild(editText)

    // Insert as the 1st child of the header
    header.insertBefore(divBanner, header.firstChild)
}

function generatePortfolioButton() {
    const head = document.querySelector("#portfolio .head")
    const divEdition = document.createElement("div")
    divEdition.className = "edition_mode"

    const editIcon = document.createElement("span")
    editIcon.className = "material-symbols-outlined"
    editIcon.innerText = "edit_square"
    divEdition.appendChild(editIcon)

    const editText = document.createElement("span")
    editText.innerText = "modifier"
    divEdition.appendChild(editText)

    head.appendChild(divEdition)
}

async function main() {
    // API constants
    const works = await getWorks()
    const categories = await getCategories()

    generateHeaderNavigation()
    generateGallery(works)
    if (is_logged_in() == false) {
        generateFiltersSection(categories)
        createFiltersListeners(works, categories)
    } else {
        generateEditionBanner()
        generatePortfolioButton()
    }
}


main()


// TODO code this in JS