var screenLock;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js?v=3')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès :', registration);
      })
      .catch((error) => {
        console.error('Échec de l’enregistrement du Service Worker :', error);
      });
  });
}

$(document).ready(function(){
  //window.location.reload();
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('fontSize='))?.split('=')[1];
  if (cookieValue != undefined) {
    document.getElementById("global_container").style.fontSize = cookieValue + "px";
  }
  getScreenLock();
  
  // Show the welcome popup if it is not disabled
  if (typeof showWelcomePopup === 'function') {
    showWelcomePopup();
  }
});

document.addEventListener('visibilitychange', async () => {
  if (screenLock !== null && document.visibilityState === 'visible') {
    screenLock = await navigator.wakeLock.request('screen');
  }
});


$(document).ready(function(){
  $("#projection").click(function(){
    toggleFullScreen();
  });
  $("#stop_projection").click(function(){
    toggleFullScreen();
  });
  $(document).on('mozfullscreenchange webkitfullscreenchange fullscreenchange',function(){
    breviary_toggle_fullscreen();
  });
  $("#settings").click(function(){
    $(".settings_menu").toggleClass("displayNone");
  });
  $("#hymne_toggle").click(function(){
    $("[id=hymne]").each(function(){
      $(this).toggleClass("displayNone");
    })
  });
  $("#hymne_toggleMob").click(function(){
    $("[id=hymne]").each(function(){
      $(this).toggleClass("displayNone");
    })
  });
});

function breviary_toggle_fullscreen(){
  $('.full_screen').toggleClass("displayNone");
  $('.main_site').toggleClass("displayNone");
  update_anchors();
}


function toggleFullScreen() {
  console.log("fs");
  if (!document.fullscreenElement &&    // alternative standard method
  !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
   if (document.documentElement.requestFullscreen) {
     document.documentElement.requestFullscreen();
   } else if (document.documentElement.mozRequestFullScreen) {
     document.documentElement.mozRequestFullScreen();
   } else if (document.documentElement.webkitRequestFullscreen) {
     document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
   }
  } else {
    if (document.cancelFullScreen) {
       document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
       document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

function zoom_in(){
  var obj = document.getElementById("global_container");
  var newVal = Math.min((parseFloat(obj.style.fontSize, 10) + 1), 40);
  obj.style.fontSize = newVal + "px";
  var exp = new Date(new Date().setDate(new Date().getDate() + 90));
  document.cookie = "fontSize=" + newVal + "; SameSite=Lax; Expires=" + exp.toUTCString() + " Secure";
}

function zoom_out(){
  var obj = document.getElementById("global_container");
  var newVal = Math.max((parseFloat(obj.style.fontSize, 10) - 1), 10);
  obj.style.fontSize = newVal + "px";
  var exp = new Date(new Date().setDate(new Date().getDate() + 90));
  document.cookie = "fontSize=" + newVal + "; SameSite=Lax; Expires=" + exp.toUTCString() + " Secure";
}

function isScreenLockSupported() {
  return ('wakeLock' in navigator);
}

async function getScreenLock() {
  if(isScreenLockSupported()){
    try {
       screenLock = await navigator.wakeLock.request('screen');
    } catch(err) {
       console.log(err.name, err.message);
    }
  }
}


// menu sub-menu
$(document).ready(function() {
  $(document).on("click", function(a) {
    if ($(a.target).is("#plus, #submenu") === false) {
      if (!(document.getElementById('menuZoom').contains(a.target))){
        $(".dropdown").removeClass("active");
      }
    }else{
      $(".dropdown").addClass("active");
    }
  });
});

// menu mobile
$(document).ready(function() {
  $("#calendar").click(function(){
    $("body").addClass("calendar-open");
    $('body').addClass("background-open")
  });

  $("#setting").click(function(){
    $("body").addClass("setting-open");
    $('body').addClass("background-open")
  });

  $("#menu-mobile").click(function(){
    $("body").addClass("menu-open");
    $('body').addClass("background-open")
  });

  $("#multiple-choice").click(function(){
    $("body").addClass("multiple-choice-open");
    $('body').addClass("background-open")
  });

  $("#background, span.close").click(function(){
    $("body").removeClass("calendar-open");
    $("body").removeClass("setting-open");
    $("body").removeClass("menu-open");
    $('body').removeClass("background-open");
    $('body').removeClass("multiple-choice-open");
  });

});


// PWA install prompt (on Chrome)

let deferredEvent;

const isInAppMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true ||
  /*window.matchMedia('(display-mode: fullscreen)').matches ||
  window.navigator.fullscreen === true;*/

window.addEventListener('beforeinstallprompt', (e) => {
  // prevent the browser from displaying the default install dialog
  e.preventDefault();  
  // Stash the event so it can be triggered later when the user clicks the button

  // Show the install button
  const installButton = document.getElementById('install_button');
  const installButtonMob = document.getElementById('install_button_mob');
  installButton.style.display = 'block';
  installButtonMob.style.display = 'block';
  deferredEvent = e;
});

window.addEventListener('load', () => {
  // Check if the app is already installed
  if (!isInAppMode()) {
    const installButton = document.getElementById('install_button');
    const installButtonMob = document.getElementById('install_button_mob');
    installButton.style.display = 'block';
    installButtonMob.style.display = 'block';
    // Hide the install button
/*    if( /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
      const installButton = document.getElementById('install_button');
      installButton.style.display = 'block';
    }
*/  }
});

function install_prompt(){
  if(deferredEvent) {
    deferredEvent.prompt();
  }
  
  // Rediriger vers la section Installation des paramètres
  update_settings();
  setTimeout(function() {
    var installationSection = document.getElementById('installation');
    if (installationSection) {
      installationSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}



//Dark / light mode switch
function toggleTheme(){
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
};

// Load user preference on startup
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});

// Function to determine the complies psalm based on the day of the week and solemnities
function getCompliesPsalm(date) {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const dateObj = new Date(date);
  const dayOfWeek = days[dateObj.getDay()];
  
  // Check if today is a solemnity (you'll need to implement this function)
  const isTodaySolemnity = isSolemnity(date);
  
  // Check if tomorrow is a solemnity
  const tomorrow = new Date(dateObj);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrowSolemnity = isSolemnity(tomorrow.toISOString().split('T')[0]);
  
  // Determine the psalm based on the rules
  if (dayOfWeek === 'dimanche' || dayOfWeek === 'mardi' || dayOfWeek === 'jeudi' || isTodaySolemnity) {
    return '90'; // Psalm 90 for Sunday, Tuesday, Thursday, or solemnities
  } else if (dayOfWeek === 'lundi' || dayOfWeek === 'mercredi' || dayOfWeek === 'vendredi' || dayOfWeek === 'samedi' || isTomorrowSolemnity) {
    return '4,133'; // Psalms 4 and 133 for Monday, Wednesday, Friday, Saturday, or if tomorrow is a solemnity
  } else {
    return '90'; // Default to Psalm 90
  }
}

// Placeholder function for checking if a date is a solemnity
// You'll need to implement this based on your specific requirements
function isSolemnity(date) {
  // This is a placeholder - you need to implement the actual logic
  // to check if a date is a solemnity based on your liturgical calendar
  // For now, we'll return false for all dates
  return false;
}

// Function to check if a date is a solemnity using AELF API
function isSolemnity(date, callback) {
  console.log("=== isSolemnity called ===");
  console.log("Date:", date);
  
  // First, check if we have cached data for this date
  const cachedData = localStorage.getItem('aelf_solemnity_cache_' + date);
  if (cachedData) {
    console.log("Using cached data for", date);
    const data = JSON.parse(cachedData);
    const result = checkSolemnityFromData(data);
    console.log("Cached result:", result);
    callback(result);
    return;
  }
  
  console.log("No cached data, calling AELF API for", date);
  
  // If not cached, make the API call
  const urlAelf = "https://api.aelf.org/v1/informations/" + date + "/france";
  $.ajax({
    url: urlAelf,
    success: function(result) {
      console.log("API call successful for", date);
      // Cache the result for future use (for 24 hours)
      const cacheData = {
        data: result,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('aelf_solemnity_cache_' + date, JSON.stringify(cacheData));
      const solemnityResult = checkSolemnityFromData(result);
      console.log("API result:", solemnityResult);
      callback(solemnityResult);
    },
    error: function() {
      console.log("API call failed for", date);
      // If API call fails, return false
      callback(false);
    }
  });
}

// Helper function to check if data indicates a solemnity
function checkSolemnityFromData(data) {
  console.log("=== checkSolemnityFromData called ===");
  console.log("Data:", data);
  
  // Handle cached data structure
  let infoData = data;
  if (data && data.data) {
    console.log("Using cached data structure");
    infoData = data.data;
  }
  
  if (!infoData || !infoData.informations) {
    console.log("No data or informations found");
    return false;
  }
  
  const info = infoData.informations;
  console.log("Info:", info);
  
  // Check the degree (rang) - solemnities often have specific degrees
  if (info.rang && (info.rang.toLowerCase() === 'solennité' || info.rang.toLowerCase().includes('solenn'))) {
    console.log("Found solemnity in rang:", info.rang);
    return true;
  }
  
  // Check the title for common solemnity indicators
  const title = info.ligne1 ? info.ligne1.toLowerCase() : '';
  console.log("Title:", title);
  if (title.includes('solennité')) {
    console.log("Found solemnity in title");
    return true;
  }
  
  // Check specific solemnities by name
  const solemnityNames = [
    'noël', 'épiphanie', 'ascension', 'pentecôte', 'sainte famille',
    'trinité', 'christ roi', 'toussaint', 'immaculée conception',
    'assomption', 'annunciation', 'saints apôtres', 'saint joseph',
    'sacrement', 'cœur de jésus', 'saint pierre', 'saint paul'
  ];
  
  if (solemnityNames.some(name => title.includes(name))) {
    console.log("Found solemnity in name:", name);
    return true;
  }
  
  // Check if it's a Sunday with a special title (could be a solemnity)
  const dateObj = new Date(infoData.date);
  if (dateObj.getDay() === 0) { // 0 is Sunday
    if (title.includes('pâques') || title.includes('résurrection')) {
      console.log("Found solemnity in Sunday title");
      return true;
    }
  }
  
  console.log("No solemnity found");
  return false;
}

// Function to determine the complies psalm based on the day of the week and solemnities
function getCompliesPsalm(date, callback) {
  console.log("=== getCompliesPsalm called ===");
  console.log("Date:", date);
  
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const dateObj = new Date(date);
  const dayOfWeek = days[dateObj.getDay()];
  
  console.log("Day of week:", dayOfWeek);
  
  // Check if today is a solemnity
  isSolemnity(date, function(isTodaySolemnity) {
    console.log("Is today a solemnity?", isTodaySolemnity);
    
    // Check if tomorrow is a solemnity
    const tomorrow = new Date(dateObj);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    
    isSolemnity(tomorrowDateStr, function(isTomorrowSolemnity) {
      console.log("Is tomorrow a solemnity?", isTomorrowSolemnity);
      
      // Determine the psalm based on the rules
      if (isTodaySolemnity) {
        console.log("Returning Psaume 90 (solemnity)");
        callback('Psaume 90'); // Psalm 90 for solemnities
      } else if (dayOfWeek === 'dimanche' || dayOfWeek === 'mardi' || dayOfWeek === 'jeudi') {
        console.log("Returning Psaume 90");
        callback('Psaume 90'); // Psalm 90 for Sunday, Tuesday, Thursday
      } else if (dayOfWeek === 'lundi' || dayOfWeek === 'mercredi' || dayOfWeek === 'vendredi' || dayOfWeek === 'samedi' || isTomorrowSolemnity) {
        console.log("Returning Psaumes 4,133");
        callback('Psaumes 4,133'); // Psalms 4 and 133 for Monday, Wednesday, Friday, Saturday, or if tomorrow is a solemnity
      } else {
        console.log("Returning default Psaume 90");
        callback('Psaume 90'); // Default to Psalm 90
      }
    });
  });
}

// CONVENT SELECTION
// Function to initialize convent selection
function initializeConventSelection() {
  // Get the select element
  const conventSelect = document.getElementById('convent-select');
  const conventValue = document.getElementById('convent-value');
  
  if (conventSelect && conventValue) {
    // Load the saved convent from localStorage
    const savedConvent = localStorage.getItem('selectedConvent');
    
    // Set the saved convent as the selected option
    if (savedConvent) {
      const option = conventSelect.querySelector(`option[value="${savedConvent}"]`);
      if (option) {
        option.selected = true;
        conventValue.textContent = savedConvent;
      }
    }
    
    // Add event listener to save the selected convent
    conventSelect.addEventListener('change', function() {
      const selectedConvent = conventSelect.value;
      localStorage.setItem('selectedConvent', selectedConvent);
      conventValue.textContent = selectedConvent;
      console.log('Convent selected:', selectedConvent);
    });
    
    // Set the initial value
    if (!conventValue.textContent) {
      conventValue.textContent = conventSelect.value;
    }
  }
}

// TRADUCTION
// Translation switch
function toggleTraduction() {
  const currentTraduction = document.documentElement.getAttribute('data-traduction');
  const newTraduction = currentTraduction === 'BJ' ? 'AELF' : 'BJ';
  document.documentElement.setAttribute('data-traduction', newTraduction);
  localStorage.setItem('traduction', newTraduction);

  // Update the translation status text
  const valueElement = document.getElementById('traduction-value');
  if (valueElement) {
    valueElement.textContent = newTraduction;
  }

  // Update the switch position
  const traductionToggle = document.getElementById('traduction-toggle');
  if (traductionToggle) {
    traductionToggle.checked = newTraduction === 'BJ';
  }

  return newTraduction;
}

// Function to initialize translation settings
function initializeTranslation() {
  const savedTraduction = localStorage.getItem('traduction');
  let currentTraduction;

  if (savedTraduction) {
    currentTraduction = savedTraduction;
  } else {
    // Default to AELF if no preference is saved
    currentTraduction = 'AELF';
  }

  // Set the data attribute
  document.documentElement.setAttribute('data-traduction', currentTraduction);

  // Update the translation status text if the element exists
  const valueElement = document.getElementById('traduction-value');
  if (valueElement) {
    valueElement.textContent = currentTraduction;
  }

  // Update the switch position if the element exists
  const traductionToggle = document.getElementById('traduction-toggle');
  if (traductionToggle) {
    traductionToggle.checked = currentTraduction === 'BJ';
    traductionToggle.addEventListener('change', toggleTraduction);
  }
}

// Load user preference on translation on startup
window.addEventListener('DOMContentLoaded', () => {
  initializeTranslation();
});

// Also initialize when the settings page is loaded
function update_settings() {
  // ... existing code ...
  
  // Initialize translation settings when the settings page is loaded
  initializeTranslation();
  
  // Initialize psaume repartition selection when the settings page is loaded
  if (typeof initializePsaumeRepartition === 'function') {
    initializePsaumeRepartition();
  }
}

// Function to initialize psaume repartition selection
function initializePsaumeRepartition() {
  // Get the select element
  const psaumeRepartitionToggle = document.getElementById('psaume-repartition-toggle');
  const psaumeRepartitionValue = document.getElementById('psaume-repartition-value');
  
  if (psaumeRepartitionToggle && psaumeRepartitionValue) {
    // Load the saved psaume repartition from localStorage
    const savedPsaumeRepartition = localStorage.getItem('psaumeRepartition');
    
    // Set the saved psaume repartition as the selected option
    if (savedPsaumeRepartition) {
      psaumeRepartitionToggle.checked = savedPsaumeRepartition === 'Toulousaine';
      psaumeRepartitionValue.textContent = savedPsaumeRepartition;
    } else {
      // Default to Romaine
      psaumeRepartitionToggle.checked = false;
      psaumeRepartitionValue.textContent = 'Romaine';
    }
    
    // Add event listener to save the selected psaume repartition
    psaumeRepartitionToggle.addEventListener('change', function() {
      const selectedPsaumeRepartition = psaumeRepartitionToggle.checked ? 'Toulousaine' : 'Romaine';
      localStorage.setItem('psaumeRepartition', selectedPsaumeRepartition);
      psaumeRepartitionValue.textContent = selectedPsaumeRepartition;
      console.log('Psaume repartition selected:', selectedPsaumeRepartition);
    });
    
    // Set the initial value
    if (!psaumeRepartitionValue.textContent) {
      psaumeRepartitionValue.textContent = psaumeRepartitionToggle.checked ? 'Toulousaine' : 'Romaine';
    }
  }
}

function initializePopupDisable() {
  const disablePopupToggle = document.getElementById('disable-popup-toggle');
  const popupValue = document.getElementById('popup-value');
  
  if (disablePopupToggle && popupValue) {
    // Load the saved popup disable state from localStorage
    const savedPopupDisable = localStorage.getItem('disablePopup');
    
    // Set the saved popup disable state as the checked state
    if (savedPopupDisable) {
      disablePopupToggle.checked = savedPopupDisable === 'true';
      popupValue.textContent = disablePopupToggle.checked ? 'désactivé' : 'activé';
    } else {
      // Default to activated
      disablePopupToggle.checked = false;
      popupValue.textContent = 'activé';
    }
    
    // Add event listener to save the selected popup disable state
    disablePopupToggle.addEventListener('change', function() {
      const isDisabled = disablePopupToggle.checked;
      localStorage.setItem('disablePopup', isDisabled);
      popupValue.textContent = isDisabled ? 'désactivé' : 'activé';
      console.log('Popup disable state:', isDisabled ? 'désactivé' : 'activé');
    });
    
    // Set the initial value
    if (!popupValue.textContent) {
      popupValue.textContent = disablePopupToggle.checked ? 'désactivé' : 'activé';
    }
  }
}

function initializeCompliesRepartition() {
  const compliesRepartitionToggle = document.getElementById('complies-repartition-toggle');
  const compliesRepartitionValue = document.getElementById('complies-repartition-value');
  
  if (compliesRepartitionToggle && compliesRepartitionValue) {
    // Load the saved complies repartition from localStorage
    const savedCompliesRepartition = localStorage.getItem('compliesRepartition');
    
    // Set the saved complies repartition as the selected option
    if (savedCompliesRepartition) {
      compliesRepartitionToggle.checked = savedCompliesRepartition === '2 jours';
      compliesRepartitionValue.textContent = savedCompliesRepartition;
    } else {
      // Default to 7 jours
      compliesRepartitionToggle.checked = false;
      compliesRepartitionValue.textContent = '7 jours';
    }
    
    // Add event listener to save the selected complies repartition
    compliesRepartitionToggle.addEventListener('change', function() {
      const selectedCompliesRepartition = compliesRepartitionToggle.checked ? '2 jours' : '7 jours';
      localStorage.setItem('compliesRepartition', selectedCompliesRepartition);
      compliesRepartitionValue.textContent = selectedCompliesRepartition;
      console.log('Complies repartition selected:', selectedCompliesRepartition);
    });
    
    // Set the initial value
    if (!compliesRepartitionValue.textContent) {
      compliesRepartitionValue.textContent = compliesRepartitionToggle.checked ? '2 jours' : '7 jours';
    }
  }
}

function showWelcomePopup() {
  const disablePopup = localStorage.getItem('disablePopup');
  const welcomePopup = document.getElementById('welcome-popup');
  const disableWelcomePopupToggle = document.getElementById('disable-welcome-popup-toggle');
  
  if (welcomePopup && disableWelcomePopupToggle) {
    // Check if the popup should be shown
    if (disablePopup !== 'true') {
      welcomePopup.style.display = 'block';
    }
    
    // Add event listener to close the popup
    document.getElementById('close-popup').addEventListener('click', function() {
      welcomePopup.style.display = 'none';
    });
    
    // Add event listener to go to settings
    document.getElementById('settings-popup').addEventListener('click', function() {
      welcomePopup.style.display = 'none';
      update_settings();
    });
    
    // Add event listener to disable the popup
    disableWelcomePopupToggle.addEventListener('change', function() {
      if (disableWelcomePopupToggle.checked) {
        localStorage.setItem('disablePopup', 'true');
      } else {
        localStorage.setItem('disablePopup', 'false');
      }
    });
  }
}

function updateSettingsBasedOnConvent() {
  const conventSelect = document.getElementById('convent-select');
  const traductionToggle = document.getElementById('traduction-toggle');
  const psaumeRepartitionToggle = document.getElementById('psaume-repartition-toggle');
  
  if (conventSelect && traductionToggle && psaumeRepartitionToggle) {
    // Add event listener to update settings based on convent selection
    conventSelect.addEventListener('change', function() {
      const selectedConvent = conventSelect.value;
      
      // Reset to default values
      traductionToggle.checked = false;
      psaumeRepartitionToggle.checked = false;
      
      // Update settings based on the selected convent
      if (selectedConvent === 'Bordeaux' || selectedConvent === 'Montpellier' || selectedConvent === 'Marseille' || selectedConvent === 'La Sainte-Baume' || selectedConvent === 'Monaco') {
        // Set translation to BJ
        traductionToggle.checked = true;
        localStorage.setItem('traduction', 'BJ');
        document.getElementById('traduction-value').textContent = 'BJ';
      } else if (selectedConvent === 'Toulouse') {
        // Set translation to BJ and psaume repartition to Toulousaine
        traductionToggle.checked = true;
        psaumeRepartitionToggle.checked = true;
        localStorage.setItem('traduction', 'BJ');
        localStorage.setItem('psaumeRepartition', 'Toulousaine');
        document.getElementById('traduction-value').textContent = 'BJ';
        document.getElementById('psaume-repartition-value').textContent = 'Toulousaine';
      } else {
        // Set translation to AELF and psaume repartition to Romaine
        traductionToggle.checked = false;
        psaumeRepartitionToggle.checked = false;
        localStorage.setItem('traduction', 'AELF');
        localStorage.setItem('psaumeRepartition', 'Romaine');
        document.getElementById('traduction-value').textContent = 'AELF';
        document.getElementById('psaume-repartition-value').textContent = 'Romaine';
      }
    });
    
    // Add event listener to update translation based on psaume repartition selection
    psaumeRepartitionToggle.addEventListener('change', function() {
      if (psaumeRepartitionToggle.checked) {
        // If psaume repartition is Toulousaine, set translation to BJ
        traductionToggle.checked = true;
        localStorage.setItem('traduction', 'BJ');
        document.getElementById('traduction-value').textContent = 'BJ';
      }
    });
    
    // Add event listener to update psaume repartition based on translation selection
    traductionToggle.addEventListener('change', function() {
      if (!traductionToggle.checked && psaumeRepartitionToggle.checked) {
        // If translation is AELF and psaume repartition is Toulousaine, set psaume repartition to Romaine
        psaumeRepartitionToggle.checked = false;
        localStorage.setItem('psaumeRepartition', 'Romaine');
        document.getElementById('psaume-repartition-value').textContent = 'Romaine';
      }
    });
  }
}

