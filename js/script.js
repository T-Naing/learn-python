const config = {
  urls: {
    home: "./snippets/home_snippet.html",
    about: "./snippets/about_snippet.html",
    languages: {
      en: "./json/en.json",
      my: "./json/my.json"
    }
  },
  defaultLang: 'en',
};
var selectedLang = config.defaultLang;
var selectedPage = config.urls.home;

var insertHtml = function(selector, html) {


  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

var showLoading = function(selector) {
  var html = `
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
  insertHtml(selector, html);
};

async function loadContent(selector, url, lang) {
  // console.log("loadContent() " + lang);
  showLoading(selector);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseText = await response.text();
    insertHtml(selector, responseText);
    if (lang !== config.defaultLang) {
      const language_data = await loadLanguageData(lang);
      changeLanguage(language_data);

    }
  } catch (error) {
    console.error("Error fetching content:", error.message);
  }
}

async function loadLanguageData(lang) {
  try {
    const response = await fetch(config.urls.languages[lang]);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading language data:', error);
  }
}

function changeLanguage(data) {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (data[key]) {
      // el.textContent = data[key];
      el.innerHTML = data[key];
    }
  });
}

function collapseNavbar() {
  var navbarCollapse = document.querySelector(".navbar-collapse");
  if (navbarCollapse && navbarCollapse.classList.contains("show")) {
    navbarCollapse.classList.remove("show");
  }
}

var switchActive = function(notToActive, toActive) {
  var notToActiveButton = document.querySelector(notToActive);
  notToActiveButton.className = notToActiveButton.className.replace(/active/g, "");

  var toActiveButton = document.querySelector(toActive);
  if (!toActiveButton.classList.contains("active")) {
    toActiveButton.className += " active";
  }
};

document.addEventListener("DOMContentLoaded", async function(event) {
  await loadContent("#main-content", selectedPage, selectedLang);

  const navbarToggle = document.getElementById("navbarToggle");
  const collapsableNav = document.getElementById("navbarNav");

  document.addEventListener("click", function(event) {
    if (!navbarToggle.contains(event.target) && !collapsableNav.contains(event.target)) {
      collapseNavbar();
    }
  });

  document.getElementById("navHomeButton").addEventListener("click", async function(event) {
    selectedPage = config.urls.home;
    await loadContent("#main-content", selectedPage, selectedLang);
    switchActive("#navAboutButton", "#navHomeButton");
    collapseNavbar();
  });

  document.getElementById("navAboutButton").addEventListener("click", async function(event) {
    selectedPage = config.urls.about;
    await loadContent("#main-content", selectedPage, selectedLang);
    switchActive("#navHomeButton", "#navAboutButton");
    collapseNavbar();
  });
  
  document.getElementById("navHomeButtonFooter").addEventListener("click", async function(event) {
    selectedPage = config.urls.home;
    await loadContent("#main-content", selectedPage, selectedLang);
    switchActive("#navAboutButton", "#navHomeButton");
    collapseNavbar();
  });
  
  document.getElementById("navAboutButtonFooter").addEventListener("click", async function(event) {
    selectedPage = config.urls.about;
    await loadContent("#main-content", selectedPage, selectedLang);
    switchActive("#navHomeButton", "#navAboutButton");
    collapseNavbar();
  });

  const button = document.getElementById('languageDropdown');
  const defaultItem = document.querySelector('.dropdown-item');
  button.textContent = defaultItem.textContent;

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', async function() {
      button.textContent = this.textContent;
      selectedLang = this.getAttribute('data-lang');

      if (selectedLang === 'en') {
        await loadContent("#main-content", selectedPage, selectedLang);
        document.documentElement.classList.remove('myanmar-font'); // Must apply to <html>
        console.log("Language toggle en");
      }
      else{
        document.documentElement.classList.add('myanmar-font'); // Must apply to <html>
        console.log("Language toggle mm");
      }
      
      // Toggles: removes if present, adds if absent
      // document.body.classList.toggle('myanmar-font');
      const data = await loadLanguageData(selectedLang);
      if (data) {
        changeLanguage(data);
      }
    });
  });
});

