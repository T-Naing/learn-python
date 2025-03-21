var aboutUrl = "./snippets/about_snippet.html";
var homeUrl = "./snippets/home_snippet.html";

var insertHtml = function(selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

var showLoading = function(selector) {
  var html = '<div class="d-flex justify-content-center">';
  html += '<div class="spinner-border" role="status">';
  html += '<span class="visually-hidden" >Loading...</span></div></div>';

  insertHtml(selector, html);
};

var loadAbout = function() {
  showLoading("#main-content");
  var requestObj = new XMLHttpRequest();
  requestObj.onreadystatechange = function() {
    if (requestObj.readyState === 4 && requestObj.status === 200) {
      document.querySelector("#main-content")
        .innerHTML = requestObj.responseText;
      switchMenuToActive();
    }
  };
  requestObj.open("Get", aboutUrl, true);
  requestObj.send();    
}

var switchMenuToActive = function() {
  // console.log("active");
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navAboutButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    classes = document.querySelector("#navAboutButton").className = classes;
  }
}

document.addEventListener("DOMContentLoaded",
  function(event) {

    showLoading("#main-content");
    var requestObj = new XMLHttpRequest();
    requestObj.onreadystatechange = function() {
      if (requestObj.readyState === 4 && requestObj.status === 200) {
        document.querySelector("#main-content")
          .innerHTML = requestObj.responseText;
      }
    };
    requestObj.open("Get", homeUrl, true);
    requestObj.send();

    const navbarToggle = document.getElementById("navbarToggle");
    const collapsableNav = document.getElementById("navbarNav");
    
    function collapseNavbar() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 992 && collapsableNav.classList.contains("show")) {
        collapsableNav.classList.remove("show");
      }
    }

    // Listen for clicks anywhere on the document
    document.addEventListener("click", function(event) {
      // Check if the click is outside the navbar toggle and the collapsible menu
      if (!navbarToggle.contains(event.target) && !collapsableNav.contains(event.target)) {
        collapseNavbar();
      }
    });

    // Handle click event on the navAboutButton
    document.getElementById("navAboutButton")
    .addEventListener("click", function(event) {
      event.preventDefault(); // Prevent default link behavior
      loadAbout(); // Call the loadAbout function

      // Collapse the navbar after a short delay
      setTimeout(collapseNavbar, 100); // Adjust the delay as needed
    });

    // Handle click event on the navAboutButton
    document.getElementById("navAboutButtonFooter")
    .addEventListener("click", function(event) {
      loadAbout(); // Call the loadAbout function
    });

    // navbarToggle.addEventListener("blur", function(event) {
    //   console.log("blur "+!event.relatedTarget?.closest("#navAboutButton")) ;
    //   const screenWidth = window.innerWidth;
    //   // if (screenWidth < 768){
    //   if(screenWidth<992) {
    //     collapsableNav.classList.remove("show"); // Hide the collapsible navigation
    //   }
    // });
    navbarToggle.addEventListener("click", function(event) {
      event.target.focus();
    });
        
    const button = document.getElementById('languageDropdown');
    const defaultItem = document.querySelector('.dropdown-item'); // Select the first dropdown item
    button.textContent = defaultItem.textContent; // Set the button text to the first item's text

    // Dropdown item click listener
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function() {
        console.log("dropdown-item");
        const button = document.getElementById('languageDropdown');
        button.textContent = this.textContent; // Update the button text based on the selected item
      });
    });

  });
