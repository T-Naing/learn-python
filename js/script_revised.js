// Deepseek revision
const aboutUrl = "./snippets/about_snippet.html";
const homeUrl = "./snippets/home_snippet.html";

// Function to insert HTML into a target element
const insertHtml = (selector, html) => {
  const targetElem = document.querySelector(selector);
  if (targetElem) {
    targetElem.innerHTML = html;
  }
};

// Function to show a loading spinner
const showLoading = (selector) => {
  const html = `
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
  insertHtml(selector, html);
};

// Function to load content from a URL
//using a traditional function declaration
// async function loadContent(url, selector) {
  const loadContent = async (url, selector) => {
    showLoading(selector);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok.");
      const html = await response.text();
      insertHtml(selector, html);
    } catch (error) {
      console.error("Error loading content:", error);
      insertHtml(selector, "<p>Failed to load content.</p>");
    }
  };

// Function to load the About page
const loadAbout = () => {
  loadContent(aboutUrl, "#main-content");
  switchMenuToActive("#navAboutButton", "#navHomeButton");
};

// Function to switch the active state of the menu buttons
const switchMenuToActive = (activeButtonSelector, inactiveButtonSelector) => {
  const activeButton = document.querySelector(activeButtonSelector);
  const inactiveButton = document.querySelector(inactiveButtonSelector);

  if (activeButton) activeButton.classList.add("active");
  if (inactiveButton) inactiveButton.classList.remove("active");
};

// Function to collapse the navbar on small screens
const collapseNavbar = () => {
  const collapsableNav = document.getElementById("navbarNav");
  const screenWidth = window.innerWidth;

  if (screenWidth < 992 && collapsableNav?.classList.contains("show")) {
    collapsableNav.classList.remove("show");
  }
};

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Load the home page content
  loadContent(homeUrl, "#main-content");

  // Cache DOM elements
  const navbarToggle = document.getElementById("navbarToggle");
  const collapsableNav = document.getElementById("navbarNav");
  const navAboutButton = document.getElementById("navAboutButton");
  const navAboutButtonFooter = document.getElementById("navAboutButtonFooter");
  const languageDropdown = document.getElementById("languageDropdown");

  // Collapse navbar when clicking outside
  document.addEventListener("click", (event) => {
    if (!navbarToggle?.contains(event.target) && !collapsableNav?.contains(event.target)) {
      collapseNavbar();
    }
  });

  // Handle About button click
  navAboutButton?.addEventListener("click", (event) => {
    event.preventDefault();
    loadAbout();
    setTimeout(collapseNavbar, 100); // Collapse navbar after a short delay
  });

  // Handle About footer button click
  navAboutButtonFooter?.addEventListener("click", (event) => {
    event.preventDefault();
    loadAbout();
  });

  // Handle navbar toggle focus
  navbarToggle?.addEventListener("click", (event) => {
    event.target.focus();
  });

  // Initialize language dropdown
  const defaultDropdownItem = document.querySelector(".dropdown-item");
  if (languageDropdown && defaultDropdownItem) {
    languageDropdown.textContent = defaultDropdownItem.textContent;

    // Handle dropdown item clicks using event delegation
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("dropdown-item")) {
        languageDropdown.textContent = event.target.textContent;
      }
    });
  }
});