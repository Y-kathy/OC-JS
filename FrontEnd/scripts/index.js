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

function generateFiltersSection() {
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

// API constants
const works = await getWorks()
const categories = await getCategories()

generateFiltersSection()
generateGallery(works)

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
