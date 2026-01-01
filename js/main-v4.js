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
  // First, check if we have cached data for this date
  const cachedData = localStorage.getItem('aelf_solemnity_cache_' + date);
  if (cachedData) {
    const data = JSON.parse(cachedData);
    callback(checkSolemnityFromData(data));
    return;
  }
  
  // If not cached, make the API call
  const urlAelf = "https://api.aelf.org/v1/informations/" + date + "/france";
  $.ajax({
    url: urlAelf,
    success: function(result) {
      // Cache the result for future use (for 24 hours)
      const cacheData = {
        data: result,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('aelf_solemnity_cache_' + date, JSON.stringify(cacheData));
      callback(checkSolemnityFromData(result));
    },
    error: function() {
      // If API call fails, return false
      callback(false);
    }
  });
}

// Helper function to check if data indicates a solemnity
function checkSolemnityFromData(data) {
  if (!data || !data.informations) {
    return false;
  }
  
  const info = data.informations;
  
  // Check the degree (rang) - solemnities often have specific degrees
  if (info.rang && (info.rang.toLowerCase() === 'solennité' || info.rang.toLowerCase().includes('solenn'))) {
    return true;
  }
  
  // Check the title for common solemnity indicators
  const title = info.ligne1 ? info.ligne1.toLowerCase() : '';
  if (title.includes('solennité')) {
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
    return true;
  }
  
  // Check if it's a Sunday with a special title (could be a solemnity)
  const dateObj = new Date(data.date);
  if (dateObj.getDay() === 0) { // 0 is Sunday
    if (title.includes('pâques') || title.includes('résurrection')) {
      return true;
    }
  }
  
  return false;
}

// Function to determine the complies psalm based on the day of the week and solemnities
function getCompliesPsalm(date, callback) {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const dateObj = new Date(date);
  const dayOfWeek = days[dateObj.getDay()];
  
  // Check if today is a solemnity
  isSolemnity(date, function(isTodaySolemnity) {
    // Check if tomorrow is a solemnity
    const tomorrow = new Date(dateObj);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    
    isSolemnity(tomorrowDateStr, function(isTomorrowSolemnity) {
      // Determine the psalm based on the rules
      if (dayOfWeek === 'dimanche' || dayOfWeek === 'mardi' || dayOfWeek === 'jeudi' || isTodaySolemnity) {
        callback('90'); // Psalm 90 for Sunday, Tuesday, Thursday, or solemnities
      } else if (dayOfWeek === 'lundi' || dayOfWeek === 'mercredi' || dayOfWeek === 'vendredi' || dayOfWeek === 'samedi' || isTomorrowSolemnity) {
        callback('4,133'); // Psalms 4 and 133 for Monday, Wednesday, Friday, Saturday, or if tomorrow is a solemnity
      } else {
        callback('90'); // Default to Psalm 90
      }
    });
  });
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
}

