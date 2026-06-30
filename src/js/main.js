// ELEMENTS OF MEAL PAGE  =========================================================
const allCategories = document.getElementById("categories-grid");
const allAreas = document.getElementById("allAreas");
const searchInput = document.getElementById('search-input');
const mealsLink = document.getElementById("meals-link");
const scannerLink = document.getElementById("scanner-link");
const foodLogLink = document.getElementById("food-log-link");
const recipesGrid = document.getElementById("recipes-grid");
const recipesSection = document.getElementById("all-recipes-section");
const productsSection = document.getElementById("products-section");
const foodLogSection = document.getElementById("food-log-section");
const mealDetailsSection = document.getElementById("meal-details");
const backToMealsBtn = document.getElementById("back-to-meals-btn");
const mealImage = document.getElementById("meal-image");
const mealTitle = document.getElementById("meal-title");
const mealCategory = document.getElementById("meal-category");
const mealArea = document.getElementById("meal-area");
const mealDifficulty = document.getElementById("meal-difficulty");
const ingredientsCount = document.getElementById("ingredients-count");
const ingredientsList = document.getElementById("ingredients-list");
const instructionsList = document.getElementById("instructions-list");
const mealVideo = document.getElementById("meal-video");
const logMealBtn = document.getElementById("log-meal-btn");
const heroServings = document.getElementById("hero-servings");
const heroCalories = document.getElementById("hero-calories");
const viewAll = document.getElementById("view-all-btn");
const gridViewBtn = document.getElementById("grid-view-btn");
const listViewBtn = document.getElementById("list-view-btn");

// Nutrition facts elements (meal details)
const mealCalories = document.getElementById("meal-calories");
const mealProtein = document.getElementById("meal-protein");
const mealCarbs = document.getElementById("meal-carbs");
const mealFat = document.getElementById("meal-fat");
const mealFiber = document.getElementById("meal-fiber");
const mealSugar = document.getElementById("meal-sugar");
const vitaminA = document.getElementById("vitamin-a");
const vitaminC = document.getElementById("vitamin-c");
const calciumEl = document.getElementById("calcium");
const ironEl = document.getElementById("iron");

// API URLs  FOR MEAL PAGE =========================================================
const randomRecipesURL = "https://nutriplan-api.vercel.app/api/meals/random?count=25";
const areasURL = "https://nutriplan-api.vercel.app/api/meals/areas";
const categoriesURL = "https://nutriplan-api.vercel.app/api/meals/categories";

let currentView = "grid";
let areas = [];
let categories = [];
let recipes = [];

const categoriesIcons = {
    Beef: "fa-cow",
    Chicken: "fa-drumstick-bite",
    Dessert: "fa-ice-cream",
    Lamb: "fa-drumstick-bite",
    Miscellaneous: "fa-kitchen-set",
    Pasta: "fa-bowl-food",
    Pork: "fa-bacon",
    Seafood: "fa-fish",
    Side: "fa-carrot",
    Starter: "fa-utensils",
    Vegan: "fa-seedling",
    Vegetarian: "fa-leaf"
};

const colors = [
    "emerald",
    "amber",
    "red",
    "blue",
];

const DAILY_GOALS = {
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 65
};

let nutritionLoading = false;

// URL ROUTING ================================================
function navigateTo(tab, push = true) {
    if (push) {
        history.pushState({ tab }, "", `#${tab}`);
    }
    showSection(tab);
}

function updateActiveNav(tab) {
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        link.classList.remove(
            "bg-emerald-50",
            "text-emerald-700"
        );

        link.classList.add(
            "text-gray-600",
            "hover:bg-gray-50"
        );

        const span = link.querySelector("span");
        if (span) {
            span.classList.remove("font-semibold");
            span.classList.add("font-medium");
        }
        span.classList.remove("font-semibold");
        span.classList.add("font-medium");
    });

    let activeLink = null;

    if (tab === "meals") {
        activeLink = mealsLink.querySelector(".nav-link");
    } else if (tab === "scanner") {
        activeLink = scannerLink.querySelector(".nav-link");
    } else if (tab === "foodlog") {
        activeLink = foodLogLink.querySelector(".nav-link");
    }

    if (!activeLink) return;

    activeLink.classList.remove(
        "text-gray-600",
        "hover:bg-gray-50"
    );

    activeLink.classList.add(
        "bg-emerald-50",
        "text-emerald-700"
    );

    const span = activeLink.querySelector("span");
    span.classList.remove("font-medium");
    span.classList.add("font-semibold");
}

function hideAllSections() {
    recipesSection.classList.add("hidden");
    mealDetailsSection.classList.add("hidden");
    productsSection.classList.add("hidden");
    foodLogSection.classList.add("hidden");
}

function showSection(tab) {
    hideAllSections();
    switch (tab) {
        case "meals":
            if (mealDetailsSection.classList.contains("hidden")) {
                recipesSection.classList.remove("hidden");
            } else {
                mealDetailsSection.classList.remove("hidden");
            }
            break;
        case "scanner":
            productsSection.classList.remove("hidden");
            break;

        case "foodlog":
            foodLogSection.classList.remove("hidden");
            break;
    }
    updateActiveNav(tab);
}

function getTabFromPath() {
    const hash = window.location.hash;

    if (hash === "#scanner") return "scanner";
    if (hash === "#foodlog") return "foodlog";

    return "meals";
}

window.addEventListener("popstate", () => {
    showSection(getTabFromPath());
});

// event listeners for navigation links =================================================
mealsLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("meals");
});

scannerLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("scanner");
});

foodLogLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("foodlog");
});

backToMealsBtn.addEventListener("click", () => {
    navigateTo("meals");
});

// AREAS ==============================================================================
allAreas.addEventListener("click", (e) => {
    const myElement = e.target.closest(".myElement");
    
    if (!myElement) return;

    displayEmptyState();
});

function displayEmptyState() {
    const div = document.createElement("div");
    div.className = "col-span-full flex flex-col items-center justify-center py-20";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-utensils text-6xl text-gray-300 mb-4";
    const h2 = document.createElement("h2");
    h2.className = "text-2xl font-bold text-gray-700";
    h2.textContent = "No Recipes Found";
    const p = document.createElement("p");
    p.className = "text-gray-500 mt-2";
    p.textContent = "Try another search or category.";

    div.appendChild(icon);
    div.appendChild(h2);
    div.appendChild(p);

    recipesGrid.innerHTML = "";
    recipesGrid.appendChild(div);
}

async function getAllAreas() {
    try {
        const response = await fetch(areasURL);
        if (response.ok) {
            const data = await response.json();
            areas = data.results;
            displayAreas();
        }
    } catch (err) {
        console.error("Failed to fetch areas:", err);
    }
}

function displayAreas() {
    for (let i = 0; i < 10 && i < areas.length; i++) {
        const area = areas[i];

        const button = document.createElement("button");
        button.className =
            "myElement px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";
        button.textContent = area.name;
        button.dataset.role = `${area.name}`;

        allAreas.appendChild(button);
    }
}


// CATEGORIES ==================================================

allCategories.addEventListener("click", (e) => {
    const category = e.target.closest(".Category");
    if (!category) return;
    const categoryName = category.dataset.role;
    getCategoryRecipes(categoryName);
});

async function getAllCategories() {
    try {
        const response = await fetch(categoriesURL);
        if (response.ok) {
            const data = await response.json();
            categories = data.results;
            displayCategories();
        }
    } catch (err) {
        console.error("Failed to fetch categories:", err);
    }
}

viewAll.addEventListener ("click" , ()=> {
    displayAllCategories()
})

function displayAllCategories(){
        allCategories.innerHTML = "";
        for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const color = colors[i % colors.length];

        const categoryCard = document.createElement("div");
        categoryCard.className = `Category category-card bg-${color}-50 border border-${color}-200 hover:border-${color}-400 rounded-xl p-3 hover:shadow-md cursor-pointer transition-all group`;
        categoryCard.dataset.role = `${category.name}`;

        const categoryGrid = document.createElement("div");
        categoryGrid.className = "flex items-center gap-2.5";

        const iconContainer = document.createElement("div");
        iconContainer.className = `w-9 h-9 bg-${color}-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm text-white`;

        const icon = document.createElement("i");
        icon.className = `fa-solid ${
            categoriesIcons[category.name] || "fa-utensils"
        }`;

        const categoryName = document.createElement("div");

        const categoryTitle = document.createElement("h3");
        categoryTitle.className = "text-sm font-bold text-gray-900";
        categoryTitle.textContent = category.name;

        iconContainer.appendChild(icon);
        categoryName.appendChild(categoryTitle);

        categoryGrid.appendChild(iconContainer);
        categoryGrid.appendChild(categoryName);

        categoryCard.appendChild(categoryGrid);

        allCategories.appendChild(categoryCard);
    }
}

function displayCategories() {
    allCategories.innerHTML = "";
    for (let i = 0; i < 12 && i < categories.length; i++) {
        const category = categories[i];
        const color = colors[i % colors.length];

        const categoryCard = document.createElement("div");
        categoryCard.className = `Category category-card bg-${color}-50 border border-${color}-200 hover:border-${color}-400 rounded-xl p-3 hover:shadow-md cursor-pointer transition-all group`;
        categoryCard.dataset.role = `${category.name}`;

        const categoryGrid = document.createElement("div");
        categoryGrid.className = "flex items-center gap-2.5";

        const iconContainer = document.createElement("div");
        iconContainer.className = `w-9 h-9 bg-${color}-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm text-white`;

        const icon = document.createElement("i");
        icon.className = `fa-solid ${
            categoriesIcons[category.name] || "fa-utensils"
        }`;

        const categoryName = document.createElement("div");

        const categoryTitle = document.createElement("h3");
        categoryTitle.className = "text-sm font-bold text-gray-900";
        categoryTitle.textContent = category.name;

        iconContainer.appendChild(icon);
        categoryName.appendChild(categoryTitle);

        categoryGrid.appendChild(iconContainer);
        categoryGrid.appendChild(categoryName);

        categoryCard.appendChild(categoryGrid);

        allCategories.appendChild(categoryCard);
    }
}

async function getCategoryRecipes(categoryName) {
    try {
        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/meals/filter?category=${encodeURIComponent(categoryName)}&page=1&limit=25`
        );
        if (response.ok) {
            const data = await response.json();
            recipes = data.results || [];
            displayRecipes();
        }
    } catch (err) {
        console.error("Failed to fetch category recipes:", err);
        displayEmptyState();
    }
}

// RECIPES GRID =================================================
recipesGrid.addEventListener("click", (e) => {
    const recipeCard = e.target.closest(".recipe-card");
    if (!recipeCard) return;
    const mealId = recipeCard.dataset.mealId;
    getMealDetails(mealId);
});


function displayRecipes() {
    recipesGrid.innerHTML = "";

    if (currentView === "grid") {
        recipesGrid.className =
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6";
    } else {
        recipesGrid.className =
            "grid grid-cols-2 lg:grid-cols-2 gap-6";
    }

    if (!recipes || recipes.length === 0) {
        displayEmptyState();
        return;
    }

    for (let i = 0; i < 12 && i < recipes.length; i++) {
        const recipe = recipes[i];

        const recipesCard = document.createElement("div");
        recipesCard.className = `
            recipe-card
            bg-white
            rounded-xl
            overflow-hidden
            shadow-sm
            hover:shadow-lg
            transition-all
            cursor-pointer
            group
            ${currentView === "list" ? "flex flex-row h-40" : ""}
        `;
        recipesCard.dataset.mealId = recipe.id;

        const recipeImageContainer = document.createElement("div");
        recipeImageContainer.className = `
            relative
            overflow-hidden
            ${currentView === "list" ? "w-48 h-full flex-shrink-0" : "h-48"}
        `;

        const recipeImage = document.createElement("img");
        recipeImage.className =
            "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500";
        recipeImage.src = recipe.thumbnail;
        recipeImage.alt = recipe.name;
        recipeImage.loading = "lazy";

        const recipeTagsContainer = document.createElement("div");
        recipeTagsContainer.className = `
            absolute
            bottom-3
            left-3
            flex
            gap-2
            ${currentView === "list" ? "hidden" : ""}
        `;

        const recipeTag1 = document.createElement("span");
        recipeTag1.className =
            "px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700";
        recipeTag1.textContent = recipe.category;

        const recipeTag2 = document.createElement("span");
        recipeTag2.className =
            "px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white";
        recipeTag2.textContent = recipe.area;

        const recipeInfoContainer = document.createElement("div");
        recipeInfoContainer.className = "p-4 flex-1";

        const recipeTitle = document.createElement("h3");
        recipeTitle.className =
            "text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1";
        recipeTitle.textContent = recipe.name;

        const recipeDescription = document.createElement("p");
        recipeDescription.className =
            "text-xs text-gray-600 mb-3 line-clamp-2";
        recipeDescription.textContent = recipe.instructions
            ? recipe.instructions.slice(0, 80)
            : "No description available.";

        const recipeDetailsContainer = document.createElement("div");
        recipeDetailsContainer.className =
            "flex items-center justify-between text-xs";

        const recipeDetail1 = document.createElement("span");
        recipeDetail1.className = "font-semibold text-gray-900";
        recipeDetail1.innerHTML = `<i class="fa-solid fa-utensils text-emerald-600 mr-1"></i> ${recipe.category}`;

        const recipeDetail2 = document.createElement("span");
        recipeDetail2.className = "font-semibold text-gray-500";
        recipeDetail2.innerHTML = `<i class="fa-solid fa-globe text-blue-500 mr-1"></i> ${recipe.area}`;


        recipeImageContainer.append(recipeImage, recipeTagsContainer);

        recipeTagsContainer.append(recipeTag1);
        if (recipe.area) recipeTagsContainer.append(recipeTag2);

        recipeDetailsContainer.append(recipeDetail1);
        if (recipe.area) recipeDetailsContainer.append(recipeDetail2);

        recipeInfoContainer.append(
            recipeTitle,
            recipeDescription,
            recipeDetailsContainer
        );

        recipesCard.append(recipeImageContainer, recipeInfoContainer);

        recipesGrid.appendChild(recipesCard);
    }
}

async function getRandomRecipes() {

    try {
        const response = await fetch(randomRecipesURL);

        if (response.ok) {
            const data = await response.json();
            recipes = data.results || [];
            displayRecipes();
        }
    } catch (err) {
        console.error(err);
        displayEmptyState();
    }
}

gridViewBtn.addEventListener("click", () => {
    currentView = "grid";
    displayRecipes();

    gridViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
    listViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
});

listViewBtn.addEventListener("click", () => {
    currentView = "list";
    displayRecipes();

    listViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
    gridViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
});

// Search OF MEAL PAGE ===================================================

let searchTimer = null;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchRecipes(searchInput), 350);
});


async function searchRecipes(searchInput) {
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        getRandomRecipes();
        return;
    }

    try {
        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/meals/search?q=${encodeURIComponent(searchTerm)}&page=1&limit=25`
        );
        if (response.ok) {
            const data = await response.json();
            recipes = data.results || [];
            displayRecipes();
        }
    } catch (err) {
        console.error("Search failed:", err);
        displayEmptyState();
    }
}

// MEAL DETAILS ===================================================

async function getMealDetails(id) {
    try {
        const response = await fetch(`https://nutriplan-api.vercel.app/api/meals/${id}`);
        if (response.ok) {
            const data = await response.json();
            displayMealDetails(data.result);
        }
    } catch (err) {
        console.error("Failed to fetch meal details:", err);
    }
}

function displayMealDetails(meal) {
    recipesSection.classList.add("hidden");
    mealDetailsSection.classList.remove("hidden");

    window.scrollTo({
    top: 0,
    behavior: "smooth"
    });

    mealImage.src = meal.thumbnail;
    mealImage.alt = meal.name;
    mealTitle.textContent = meal.name;
    mealCategory.textContent = meal.category;
    mealArea.textContent = meal.area;

    if (meal.tags && meal.tags.length > 0) {
        mealDifficulty.textContent = meal.tags[0];
        mealDifficulty.classList.remove("hidden");
    } else {
        mealDifficulty.classList.add("hidden");
    }

    if (meal.youtube) {
        const videoId = meal.youtube.split("v=")[1];
        mealVideo.src = `https://www.youtube.com/embed/${videoId}`;
        mealVideo.parentElement.classList.remove("hidden");
    } else {
        mealVideo.parentElement.classList.add("hidden");
    }

    ingredientsList.innerHTML = "";
    const ingredients = meal.ingredients || [];
    ingredientsCount.textContent = `${ingredients.length} items`;

    ingredients.forEach((ing) => {
        const row = document.createElement("div");
        row.className = "flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300";

        const label = document.createElement("span");
        label.className = "text-gray-700";
        label.innerHTML = `<span class="font-medium text-gray-900">${ing.measure || ""}</span> ${ing.ingredient || ""}`;

        row.append(checkbox, label);
        ingredientsList.appendChild(row);
    });

    instructionsList.innerHTML = "";
    const steps = meal.instructions || [];
    steps.forEach((step, index) => {
        const stepEl = document.createElement("div");
        stepEl.className = "flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors";

        const numberEl = document.createElement("div");
        numberEl.className = "w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0";
        numberEl.textContent = index + 1;

        const textEl = document.createElement("p");
        textEl.className = "text-gray-700 leading-relaxed pt-2";
        textEl.textContent = step;

        stepEl.append(numberEl, textEl);
        instructionsList.appendChild(stepEl);
    });

    const servings = meal.servings || 4;

    heroServings.textContent = `${servings} servings`;
    heroCalories.textContent = `... cal/serving`;
    mealCalories.textContent = "...";
    mealProtein.textContent = "...";
    mealCarbs.textContent = "...";
    mealFat.textContent = "...";
    mealFiber.textContent = "...";
    mealSugar.textContent = "...";
    vitaminA.textContent = "...";
    vitaminC.textContent = "...";
    calciumEl.textContent = "...";
    ironEl.textContent = "...";

    logMealBtn.dataset.mealId = meal.id;
    logMealBtn._mealData = {
        id: meal.id,
        name: meal.name,
        thumbnail: meal.thumbnail,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    };

    nutritionLoading = true;
    getNutrition(meal).then((result) => {
        if (!result) {
            nutritionLoading = false;

            heroCalories.textContent = "N/A cal/serving";
            mealCalories.textContent = "N/A";
            return;
        }
        const nutrition = result.data.perServing;

        const perServingCalories = nutrition.calories;
        const perServingProtein = nutrition.protein;
        const perServingCarbs = nutrition.carbs;
        const perServingFat = nutrition.fat;
        const perServingFiber = nutrition.fiber;
        const perServingSugar = nutrition.sugar;

        heroCalories.textContent = `${perServingCalories} cal/serving`;
        mealCalories.textContent = perServingCalories;
        mealProtein.textContent = `${perServingProtein}g`;
        mealCarbs.textContent = `${perServingCarbs}g`;
        mealFat.textContent = `${perServingFat}g`;
        mealFiber.textContent = `${perServingFiber}g`;
        mealSugar.textContent = `${perServingSugar}g`;

        vitaminA.textContent = "...";
        vitaminC.textContent = "...";
        calciumEl.textContent = "...";
        ironEl.textContent = "...";

        logMealBtn._mealData = {
            id: meal.id,
            name: meal.name,
            thumbnail: meal.thumbnail,
            calories: perServingCalories,
            protein: perServingProtein,
            carbs: perServingCarbs,
            fat: perServingFat
        };
        nutritionLoading = false;
    });
}

async function getNutrition(meal) {
    try {
        const body = {
            recipeName: meal.name,
            ingredients: (meal.ingredients || []).map(
                ing => `${ing.measure} ${ing.ingredient}`
            )
        };

        const response = await fetch(
            "https://nutriplan-api.vercel.app/api/nutrition/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "btbq6wCcWaiv8J2LocOKqej8sbql9E4F4q5rPvEH"
                },
                body: JSON.stringify(body)
            }
        );


        const data = await response.json();
        if (!response.ok || !data.success || !data.data) {
            return null;
        }
        return data;

    } catch (err) {
        console.error(err);
        return null;
    }
}

const logMealModal = document.getElementById("log-meal-modal");
const closeLogMealModal = document.getElementById("close-log-meal-modal");
const cancelLogMeal = document.getElementById("cancel-log-meal");
const confirmLogMeal = document.getElementById("confirm-log-meal");
const servingsInput = document.getElementById("meal-servings");
const increaseBtn = document.getElementById("increase-servings");
const decreaseBtn = document.getElementById("decrease-servings");
const logCalories = document.getElementById("log-calories");
const logProtein = document.getElementById("log-protein");
const logCarbs = document.getElementById("log-carbs");
const logFat = document.getElementById("log-fat");
const logMealName = document.getElementById("log-meal-name");
const logMealImage = document.getElementById("log-meal-image");

logMealBtn.addEventListener("click", () => {

    if (nutritionLoading) {
        Swal.fire({
            icon: "info",
            title: "Please wait",
            text: "Nutrition information is still loading..."
        });
        return;
    }

    const meal = logMealBtn._mealData;
    if (!meal) return;

    logMealModal._mealData = meal;

    logMealName.textContent = meal.name;
    logMealImage.src = meal.thumbnail;

    servingsInput.value = 1;

    updateMealNutrition();

    logMealModal.classList.remove("hidden");
    logMealModal.classList.add("flex");
});

confirmLogMeal.addEventListener("click", () => {
    const meal = logMealModal._mealData;
    if (!meal) return;

    const servings = Number(servingsInput.value);

    addFoodLogEntry({
        type: "meal",
        name: meal.name,
        image: meal.thumbnail,
        calories: (meal.calories || 0) * servings,
        protein: (meal.protein || 0) * servings,
        carbs: (meal.carbs || 0) * servings,
        fat: (meal.fat || 0) * servings
    });

    logMealModal.classList.add("hidden");

    Swal.fire({
        icon: "success",
        title: "Meal Logged!",
        text: `${meal.name} has been added to your Food Log.`,
        timer: 1500,
        showConfirmButton: false
    });
});

closeLogMealModal.addEventListener("click", closeMealModal);
cancelLogMeal.addEventListener("click", closeMealModal);

function closeMealModal() {
    logMealModal.classList.add("hidden");
    logMealModal.classList.remove("flex");
}

increaseBtn.addEventListener("click", () => {
    servingsInput.value = Number(servingsInput.value) + 1;
    updateMealNutrition();
});

decreaseBtn.addEventListener("click", () => {
    if (Number(servingsInput.value) > 1) {
        servingsInput.value = Number(servingsInput.value) - 1;
        updateMealNutrition();
    }
});

function updateMealNutrition() {
    const meal = logMealBtn._mealData;
    if (!meal) return;

    const servings = Number(servingsInput.value);

    logCalories.textContent = Math.round(meal.calories * servings);
    logProtein.textContent = `${(meal.protein * servings).toFixed(1)} g`;
    logCarbs.textContent = `${(meal.carbs * servings).toFixed(1)} g`;
    logFat.textContent = `${(meal.fat * servings).toFixed(1)} g`;

    logMealModal._mealData = meal;
}



// PRODUCTS SECTION =====================================================================================================================================================================

const allProductCategoriesUrl = 'https://nutriplan-api.vercel.app/api/products/categories';
const ProductByCategoriesUrl = 'https://nutriplan-api.vercel.app/api/products/category/snacks';

const searchBtn = document.getElementById("search-product-btn");
const searchProductInput = document.getElementById("product-search-input");
const productsGrid = document.getElementById("products-grid");
const productsCount = document.getElementById("products-count");
const lookUpBtn = document.getElementById("lookup-barcode-btn")
const barcodeInput = document.getElementById("barcode-input")
const productCategoriesContainer = document.getElementById("product-categories");

const nutriColors = {
    a: "bg-green-500",
    b: "bg-lime-500",
    c: "bg-yellow-500",
    d: "bg-orange-500",
    e: "bg-red-500",
    unknown: "bg-gray-500"
};

const nutriHexColors = {
    a: "#16a34a",
    b: "#84cc16",
    c: "#eab308",
    d: "#f97316",
    e: "#ef4444",
    unknown: "#9ca3af"
};

const productColors = ["emerald", "blue", "amber", "purple", "rose"];
const productIcons = {
    Snacks: "fa-cookie",
    Beverages: "fa-glass-water",
    Dairy: "fa-cheese",
    Cheeses: "fa-cheese",
    Yogurts: "fa-jar",
    Chocolates: "fa-candy-bar",
    "Biscuits & Cookies": "fa-cookie-bite",
    "Ice Cream": "fa-ice-cream",
    "Breakfast Cereals": "fa-bowl-food",
    Breads: "fa-bread-slice",
    Waters: "fa-bottle-water",
    Sodas: "fa-glass-water",
    Coffees: "fa-mug-hot",
    Teas: "fa-mug-saucer",
    Fruits: "fa-apple-whole",
    Vegetables: "fa-carrot",
    Meats: "fa-drumstick-bite",
    "Fish & Seafood": "fa-fish",
    "Plant-based Foods": "fa-seedling",
    "Chips & Fries": "fa-bacon",
    Sauces: "fa-bottle-droplet",
    Spreads: "fa-jar",
    Pasta: "fa-bowl-food",
    Desserts: "fa-cake-candles"
};

let productCategories = [];
let currentProducts = [];
let currentNutriFilter = "";
let currentModalProduct = null;

// Search FOR PRODUCT PAGE ===================================================
searchBtn.addEventListener("click", async () => {
    await searchProducts(searchProductInput);
    searchProductInput.value = "";
});

searchProductInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        await searchProducts(searchProductInput);
        searchProductInput.value = "";
    }
});
lookUpBtn.addEventListener("click", () => {
    ProductsByBarCode(barcodeInput.value);
});

barcodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        ProductsByBarCode(barcodeInput.value);
    }
});

async function searchProducts(searchInput) {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === "") {
        displayEmptyProducts();
        return;
    }
    productsCount.textContent = "Searching...";
    try {
        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/search?q=${encodeURIComponent(searchTerm)}&page=1&limit=24`
        );
        if (response.ok) {
            const data = await response.json();
            currentProducts = (data.results || []).filter(p => p.name);
            displayProducts(currentProducts);
        }
    } catch (err) {
        console.error("Search failed:", err);
        displayEmptyProducts();
    }
}

async function ProductsByBarCode(barcode) {
    const searchTerm = barcode.trim();

    if (searchTerm === "") {
        displayEmptyProducts();
        return;
    }

    productsCount.textContent = "Looking up barcode...";

    try {
        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/barcode/${encodeURIComponent(searchTerm)}`
        );

        if (!response.ok) throw new Error("Barcode lookup failed");

        const data = await response.json();

        if (data.result) {
            currentProducts = [data.result];
            displayProducts(currentProducts);
            barcodeInput.value = "";
            
            openProductModal(data.result);
        } else {
            currentProducts = [];
            displayEmptyProducts();
            if (window.Swal) {
                Swal.fire({ icon: "info", title: "Not found", text: "No product found for that barcode." });
            }
        }
    } catch (err) {
        console.error(err);
        currentProducts = [];
        displayEmptyProducts();
        if (window.Swal) {
            Swal.fire({ icon: "error", title: "Lookup failed", text: "Could not look up that barcode. Please try again." });
        }
    }
}

function displayProducts(products) {
    productsGrid.innerHTML = "";

    if (!products || products.length === 0) {
        displayEmptyProducts();
        return;
    }

    productsCount.textContent = `${products.length} Products Found`;

    for (const product of products) {
        const nutrients = product.nutrients || {};
        const grade = (product.nutritionGrade || "unknown").toLowerCase();

        const productCard = document.createElement("div");
        productCard.className = "product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group";
        productCard.dataset.barcode = product.barcode ?? "";

        const imageBox = document.createElement("div");
        imageBox.className = "relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden";

        const image = document.createElement("img");
        image.className = "w-full h-full object-contain group-hover:scale-110 transition-transform duration-300";
        image.src = product.image || "https://via.placeholder.com/300x300?text=No+Image";
        image.alt = product.name || "Product";
        image.loading = "lazy";

        const nutriBadge = document.createElement("div");
        nutriBadge.className = `absolute top-2 left-2 ${nutriColors[grade] || nutriColors.unknown} text-white text-xs font-bold px-2 py-1 rounded uppercase`;
        nutriBadge.textContent = `Nutri-Score ${grade.toUpperCase()}`;

        const novaBadge = document.createElement("div");
        novaBadge.className = "absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center";
        novaBadge.title = `NOVA ${product.novaGroup || "?"}`;
        novaBadge.textContent = product.novaGroup || "?";

        imageBox.append(image, nutriBadge, novaBadge);

        const body = document.createElement("div");
        body.className = "p-4";

        const brand = document.createElement("p");
        brand.className = "text-xs text-emerald-600 font-semibold mb-1 truncate";
        brand.textContent = product.brand || "Unknown Brand";

        const title = document.createElement("h3");
        title.className = "font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors";
        title.textContent = product.name || "Unknown Product";

        const details = document.createElement("div");
        details.className = "flex items-center gap-3 text-xs text-gray-500 mb-3";
        details.innerHTML = `
            <span><i class="fa-solid fa-barcode mr-1"></i>${product.barcode || "N/A"}</span>
            <span><i class="fa-solid fa-fire mr-1"></i>${Math.round(nutrients.calories || 0)} kcal</span>
        `;

        const nutrition = document.createElement("div");
        nutrition.className = "grid grid-cols-4 gap-1 text-center";
        nutrition.innerHTML = `
            <div class="bg-emerald-50 rounded p-1.5">
                <p class="text-xs font-bold text-emerald-700">${(nutrients.protein || 0).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Protein</p>
            </div>
            <div class="bg-blue-50 rounded p-1.5">
                <p class="text-xs font-bold text-blue-700">${(nutrients.carbs || 0).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Carbs</p>
            </div>
            <div class="bg-purple-50 rounded p-1.5">
                <p class="text-xs font-bold text-purple-700">${(nutrients.fat || 0).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Fat</p>
            </div>
            <div class="bg-orange-50 rounded p-1.5">
                <p class="text-xs font-bold text-orange-700">${(nutrients.sugar || 0).toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Sugar</p>
            </div>
        `;

        body.append(brand, title, details, nutrition);
        productCard.append(imageBox, body);

        productCard.addEventListener("click", () => openProductModal(product));

        productsGrid.appendChild(productCard);
    }
}

function displayEmptyProducts() {
    productsGrid.innerHTML = "";

    const div = document.createElement("div");
    div.className =
        "col-span-full flex flex-col items-center justify-center py-20";

    const icon = document.createElement("i");
    icon.className =
        "fa-solid fa-barcode text-6xl text-gray-300 mb-4";

    const title = document.createElement("h2");
    title.className = "text-2xl font-bold text-gray-700";
    title.textContent = "No Products Found";

    const text = document.createElement("p");
    text.className = "text-gray-500 mt-2";
    text.textContent =
        "Try searching with another product name or barcode.";

    div.append(icon, title, text);

    productsGrid.appendChild(div);
    productsCount.textContent = "0 products found";
}

// CATEGORIES OF PRODUCTS ==================================================

productCategoriesContainer.addEventListener("click", (e) => {
    const category = e.target.closest(".product-category-btn");
    if (!category) return;

    const categoryName = category.dataset.category;
    getProductsByCategory(categoryName);
});

async function getProductCategories() {
    try {
        const response = await fetch(allProductCategoriesUrl);

        if (response.ok) {
            const data = await response.json();
            productCategories = data.results || [];
            displayProductCategories();
        }
    } catch (err) {
        console.error("Failed to fetch categories:", err);
    }
}

function displayProductCategories() {
    productCategoriesContainer.innerHTML = "";

    for (let i = 0; i < productCategories.length; i++) {
        const category = productCategories[i];
        const color = productColors[i % productColors.length];

        const button = document.createElement("button");

        button.className =
            `product-category-btn px-4 py-2 bg-${color}-100 text-${color}-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-${color}-200 transition-all`;

        button.dataset.category = category.name;

        button.innerHTML = `
            <i class="fa-solid ${productIcons[category.name] || "fa-box"} mr-1.5"></i>
            ${category.name}
        `;

        productCategoriesContainer.appendChild(button);
    }
}

async function getProductsByCategory(categoryName) {
    try {
        productsCount.textContent = "Loading...";

        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/category/${encodeURIComponent(categoryName.toLowerCase())}?page=1&limit=24`
        );

        if (!response.ok) throw new Error("Failed to load category");

        const data = await response.json();

        currentProducts = data.results || [];

        displayProducts(currentProducts);

    } catch (err) {
        console.error("Failed to fetch category products:", err);
        displayEmptyProducts();
    }
}

// ===================== PRODUCT DETAIL MODAL=====================

const productDetailModal = document.getElementById("product-detail-modal");
const modalProductImage = document.getElementById("modal-product-image");
const modalProductBrand = document.getElementById("modal-product-brand");
const modalProductName = document.getElementById("modal-product-name");
const modalProductQuantity = document.getElementById("modal-product-quantity");
const modalNutriBadge = document.getElementById("modal-nutri-badge");
const modalNutriLabel = document.getElementById("modal-nutri-label");
const modalCalories = document.getElementById("modal-calories");
const modalProtein = document.getElementById("modal-protein");
const modalCarbs = document.getElementById("modal-carbs");
const modalFat = document.getElementById("modal-fat");
const modalSugar = document.getElementById("modal-sugar");
const addProductToLogBtn = productDetailModal.querySelector(".add-product-to-log");
const scanProductBtn = document.getElementById("scan-product-btn");
const browseRecipesBtn = document.getElementById("browse-recipes-btn");

scanProductBtn.addEventListener("click", ()=> {
    updateActiveNav("scanner")
})

browseRecipesBtn.addEventListener("click", ()=> {
    updateActiveNav("meals")
})

function openProductModal(product) {
    currentModalProduct = product;
    const nutrients = product.nutrients || {};
    const grade = (product.nutritionGrade || "unknown").toLowerCase();

    modalProductImage.src = product.image || "https://via.placeholder.com/300x300?text=No+Image";
    modalProductImage.alt = product.name || "Product";
    modalProductBrand.textContent = product.brand || "Unknown Brand";
    modalProductName.textContent = product.name || "Unknown Product";
    modalProductQuantity.textContent = product.quantity || "";

    modalNutriBadge.textContent = grade === "unknown" ? "?" : grade.toUpperCase();
    modalNutriBadge.style.backgroundColor = nutriHexColors[grade] || nutriHexColors.unknown;
    modalNutriLabel.textContent = grade === "unknown" ? "Unknown" : `Grade ${grade.toUpperCase()}`;

    modalCalories.textContent = Math.round(nutrients.calories || 0);
    modalProtein.textContent = `${(nutrients.protein || 0).toFixed(1)}g`;
    modalCarbs.textContent = `${(nutrients.carbs || 0).toFixed(1)}g`;
    modalFat.textContent = `${(nutrients.fat || 0).toFixed(1)}g`;
    modalSugar.textContent = `${(nutrients.sugar || 0).toFixed(1)}g`;

    productDetailModal.classList.remove("hidden");
}

function closeProductModal() {
    productDetailModal.classList.add("hidden");
    currentModalProduct = null;
}

document.querySelectorAll(".close-product-modal").forEach((btn) => {
    btn.addEventListener("click", closeProductModal);
});

productDetailModal.addEventListener("click", (e) => {
    if (e.target === productDetailModal) closeProductModal();
});

addProductToLogBtn.addEventListener("click", () => {
    if (!currentModalProduct) return;
    const nutrients = currentModalProduct.nutrients || {};
    addFoodLogEntry({
        type: "product",
        name: currentModalProduct.name || "Unknown Product",
        image: currentModalProduct.image || "",
        calories: Math.round(nutrients.calories || 0),
        protein: nutrients.protein || 0,
        carbs: nutrients.carbs || 0,
        fat: nutrients.fat || 0
    });
    if (window.Swal) {
        Swal.fire({ icon: "success", title: "Logged!", text: `${currentModalProduct.name} added to your Food Log.`, timer: 1500, showConfirmButton: false });
    }
    closeProductModal();
});


// FOOD LOG ========================================================================================


const loggedItemsList = document.getElementById("logged-items-list");
const loggedItemsTitle = document.getElementById("logged-items-title");
const clearFoodLogBtn = document.getElementById("clear-foodlog");
const foodLogDate = document.getElementById("foodlog-date");
const FOODLOG_STORAGE_KEY = "nutriplan-foodlog";
const caloriesProgressBar = document.getElementById("calories-progress-bar");
const caloriesProgressText = document.getElementById("calories-progress-text");
const proteinProgressBar = document.getElementById("protein-progress-bar");
const proteinProgressText = document.getElementById("protein-progress-text");
const carbsProgressBar = document.getElementById("carbs-progress-bar");
const carbsProgressText = document.getElementById("carbs-progress-text");
const fatProgressBar = document.getElementById("fat-progress-bar");
const fatProgressText = document.getElementById("fat-progress-text");

function todayKey() {
    return new Date().toISOString().slice(0, 10); 
}

function loadFoodLog() {
    try {
        const raw = localStorage.getItem(FOODLOG_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        console.error("Failed to read food log:", err);
        return {};
    }
}

function saveFoodLog(log) {
    try {
        localStorage.setItem(FOODLOG_STORAGE_KEY, JSON.stringify(log));
    } catch (err) {
        console.error("Failed to save food log:", err);
    }
}

function addFoodLogEntry(entry) {
    const log = loadFoodLog();
    const key = todayKey();
    if (!log[key]) log[key] = [];
    log[key].push({ ...entry, id: Date.now() + Math.random(), loggedAt: new Date().toISOString() });
    saveFoodLog(log);
    renderFoodLog();
}

function removeFoodLogEntry(id) {
    const log = loadFoodLog();
    const key = todayKey();
    if (!log[key]) return;
    log[key] = log[key].filter((item) => item.id !== id);
    saveFoodLog(log);
    renderFoodLog();
}

function clearTodayFoodLog() {
    const log = loadFoodLog();
    const key = todayKey();
    log[key] = [];
    saveFoodLog(log);
    renderFoodLog();
}

if (clearFoodLogBtn) clearFoodLogBtn.addEventListener("click", clearTodayFoodLog);

function renderFoodLog() {
    const log = loadFoodLog();
    const key = todayKey();
    const items = log[key] || [];

    if (foodLogDate) {
        foodLogDate.textContent = new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric"
        });
    }

    const totals = items.reduce(
        (acc, item) => {
            acc.calories += Number(item.calories) || 0;
            acc.protein += Number(item.protein) || 0;
            acc.carbs += Number(item.carbs) || 0;
            acc.fat += Number(item.fat) || 0;
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setProgress(caloriesProgressBar, caloriesProgressText, totals.calories, DAILY_GOALS.calories, "kcal");
    setProgress(proteinProgressBar, proteinProgressText, totals.protein, DAILY_GOALS.protein, "g");
    setProgress(carbsProgressBar, carbsProgressText, totals.carbs, DAILY_GOALS.carbs, "g");
    setProgress(fatProgressBar, fatProgressText, totals.fat, DAILY_GOALS.fat, "g");

    if (loggedItemsTitle) {
        loggedItemsTitle.textContent = `Logged Items (${items.length})`;
    }

    if (clearFoodLogBtn) {
        clearFoodLogBtn.style.display =
            items.length > 0 ? "inline-block" : "none";
    }
    loggedItemsList.innerHTML = "";

    if (items.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "text-center py-8 text-gray-500";

        emptyState.innerHTML = `
            <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>

            <p class="font-medium">No meals logged today</p>

            <p class="text-sm mb-6">
                Add meals from the Meals page or scan products
            </p>

            <div class="flex justify-center gap-3">
                <button
                    id="browse-recipes-btn"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                >
                    <i class="fa-solid fa-plus"></i>
                    Browse Recipes
                </button>
                
                <button
                    id="scan-product-btn"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    <i class="fa-solid fa-barcode"></i>
                    Scan Product
                </button>
            </div>
        `;

        loggedItemsList.appendChild(emptyState);

        document
            .getElementById("browse-recipes-btn")
            .addEventListener("click", () => navigateTo("meals"));

        document
            .getElementById("scan-product-btn")
            .addEventListener("click", () => navigateTo("scanner"));

        return;
    }

    items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "flex items-center gap-3 p-3 bg-gray-50 rounded-xl";

        const img = document.createElement("img");
        img.src = item.image || "https://via.placeholder.com/60x60?text=Food";
        img.alt = item.name;
        img.className = "w-12 h-12 rounded-lg object-cover bg-gray-200";

        const info = document.createElement("div");
        info.className = "flex-1";
        info.innerHTML = `
            <p class="font-semibold text-gray-900 text-sm">${item.name}</p>
            <p class="text-xs text-gray-500">${Math.round(item.calories)} kcal · P ${Number(item.protein).toFixed(1)}g · C ${Number(item.carbs).toFixed(1)}g · F ${Number(item.fat).toFixed(1)}g</p>
        `;

        const removeBtn = document.createElement("button");
        removeBtn.className = "text-gray-400 hover:text-red-500";
        removeBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        removeBtn.addEventListener("click", () => removeFoodLogEntry(item.id));

        row.append(img, info, removeBtn);
        loggedItemsList.appendChild(row);
    });
}

function setProgress(barEl, textEl, value, goal, unit) {
    const pct = goal ? Math.min(100, Math.round((value / goal) * 100)) : 0;
    barEl.style.width = `${pct}%`;
    textEl.textContent = `${Math.round(value)} / ${goal} ${unit}`;
}

document.querySelectorAll(".quick-log-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        if (index === 0) navigateTo("meals");
        if (index === 1) navigateTo("scanner");
    });
});


// ===============================================================================================
window.addEventListener("load", () => {
    const loadingOverlay = document.getElementById("app-loading-overlay");
    if (!loadingOverlay) return;

    loadingOverlay.classList.add("opacity-0");

    setTimeout(() => {
        loadingOverlay.classList.add("hidden");
    }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
    showSection(getTabFromPath());

    getRandomRecipes();
    getAllAreas();
    getAllCategories();
    getProductCategories();
    renderFoodLog();
});