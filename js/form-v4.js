//import {date_disponible, resume_du, office_du} from "./sanctoral_functions.js";

$(document).ready(function(){
  var date = new Date();
  $('#date').val(date.toDateInputValue());//en fonction de l'heure, l'office s'affiche.
  $('#dateMob').val(date.toDateInputValue());
  if (date.getHours() < 10){
    $('#office').val("laudes");
    $('#officeMob').val("laudes");
  }else if (date.getHours() < 12){
    $('#office').val("tierce");
    $('#officeMob').val("tierce");
  }else if (date.getHours() < 14){
    $('#office').val("sexte");
    $('#officeMob').val("sexte");
  }else if (date.getHours() < 16){
    $('#office').val("none");
    $('#officeMob').val("none");
  }else if (date.getHours() < 20){
    $('#office').val("vepres");
    $('#officeMob').val("vepres");
  }else {
    $('#office').val("complies");
    $('#officeMob').val("complies");
  }
  var date = $('#date').val();
  var office = $('#office').val();
  update_office_list(office, date);
  $('#date').change(function(){
    date = $(this).val();
    $('#dateMob').val(date);
    zone =  update_office_list(office, date); 
  });
  $('#dateMob').change(function(){
    date = $(this).val();
    $('#date').val(date);
    zone =  update_office_list(office, date); 
  });
  $('#office').change(function(){
    office = $(this).val();
    $('#officeMob').val(office);
    zone = update_office_list(office, date);
  });
  $('#officeMob').change(function(){
    office = $(this).val();
    $('#office').val(office);
    zone = update_office_list(office, date);
  });
  $('.office_choice').click(function(){
    zone = $("input[type='radio'][name='radio_office']:checked").val();
    var index = $("input[type='radio'][name='radio_office']:checked").index('input[name=radio_office]');
    $("input[type='radio'][name='radio_office_mob']")[index].checked=true;
    update_office(0);
  });
  $('.office_choice_mob').click(function(){
    zone = $("input[type='radio'][name='radio_office_mob']:checked").val();
    var index = $("input[type='radio'][name='radio_office_mob']:checked").index('input[name=radio_office_mob]');
    $("input[type='radio'][name='radio_office']")[index].checked=true;
    update_office(0);
  });

 /* $('#psaume_invitatoire_select').change(function(){
    $('#psaume_invitatoire_selectMob').val($("#psaume_invitatoire_select").val());
    zone =  update_office_list(office, date); 
  });
  $('#psaume_invitatoire_selectMob').change(function(){
    $('#psaume_invitatoire_select').val($("#psaume_invitatoire_selectMob").val());
    zone =  update_office_list(office, date); 
  });*/
});


function invitatoire_update(invit_select){
  let elements = document.getElementsByClassName("psaume_invitatoire_select");
  for (let i = 0; i < elements.length; i++) {
    elements[i].value = invit_select.value;
  }
  update_office(2);
}

function hymne_update(select_element){
  let elements = document.getElementsByClassName("hymne_select");
  for (let i = 0; i < elements.length; i++) {
    elements[i].value = select_element.value;
  }
  update_office(2);
}


Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    //console.log(local.toJSON().slice(11,13));
    return local.toJSON().slice(0,10);
});


function update_office_list(office, date){
  var fulldate = new Date(date);
  offices_disponibles = [];
  if (office_disponible(office, date2slashedDate(date))) {
    offices_disponibles = resumes_du(office, date2slashedDate(date));
  }
  if (office != "messes") {
    var urlAelf = "https://api.aelf.org/v1/informations/" + date + "/france"
    $.ajax({url: urlAelf,
    success: function(result){
      var ligne2 = result.informations.ligne2;
      if (result.informations.ligne3 != "") {
        ligne2 = ligne2 + " - " + result.informations.ligne3
      }
      if (result.informations.zone == "romain"){
        if (fulldate.getDay() == 0 || result.informations.degre != ""){
          offices_disponibles.push({"ligne1": result.informations.ligne1.charAt(0).toUpperCase() + result.informations.ligne1.slice(1), "ligne2": ligne2, "ligne3": "Office Romain", "zone": "romain", "rang": "haut"});
        } else {
          offices_disponibles.push({"ligne1": result.informations.ligne1.charAt(0).toUpperCase() + result.informations.ligne1.slice(1), "ligne2": ligne2, "ligne3": "Office Romain", "zone": "romain", "rang": "bas"});
        }
        display_office_list(offices_disponibles);
      } else {
        offices_disponibles.push({"ligne1": result.informations.ligne1.charAt(0).toUpperCase() + result.informations.ligne1.slice(1), "ligne2": ligne2, "ligne3": "Office Français", "zone": "france", "rang": "bas"});
        var urlAelfRomain = "https://api.aelf.org/v1/" + office + "/" + date + "/romain";
        $.ajax({url: urlAelfRomain,
          success: function(result2){
            ligne2 = result2.informations.ligne2;
            if (result2.informations.ligne3 != "") {
              ligne2 = ligne2 + " - " + result2.informations.ligne3
            }
            if (fulldate.getDay() == 0 || result.informations.degre != ""){
              offices_disponibles.push({"ligne1": result2.informations.ligne1.charAt(0).toUpperCase() + result2.informations.ligne1.slice(1), "ligne2": ligne2, "ligne3": "Office Romain", "zone": "romain", "rang": "haut"});
            } else {
              offices_disponibles.push({"ligne1": result2.informations.ligne1.charAt(0).toUpperCase() + result2.informations.ligne1.slice(1), "ligne2": ligne2, "ligne3": "Office Romain", "zone": "romain", "rang": "bas"});
            }
            display_office_list(offices_disponibles);
            update_office(0);
          },
          error: function(result){
            display_office_error();
          },
        });
      }
    },
    error: function(result){
      display_office_error();
    }
  });
  } else {
    if (messe_disponible(date2slashedDate(date))) {
      offices_disponibles = messe_resume_du(date2slashedDate(date));
    }

    var urlAelf = "https://api.aelf.org/v1/messes/" + date + "/romain"
    $.ajax({url: urlAelf,
      success: function(result){
        var index = 0;
        for (const iterator of result.messes) {
          offices_disponibles.push({"ligne1": result.informations.ligne1.charAt(0).toUpperCase() + result.informations.ligne1.slice(1), "ligne2": iterator["nom"] == "Messe du jour" ? result.informations.ligne2 : iterator["nom"], "ligne3": "Office Romain", "zone": "romain;" + index , "rang": "bas"});
          index++;
        }
        display_office_list(offices_disponibles);
        //update_office(1);
      },
      error: function(result){
        display_office_error();
      }
    });
  }
}

function display_office_list(offices_disponibles){
  var innerHtml = "";
  var innerHtmlMob = "";
  var id = 1;
  var topOffice = 1;
  var firstZone = ""
  if (offices_disponibles.length > 1) {
    $('#multiple-choice').attr('stroke', '#fc5a03');
    $('#multiple-choice').css('opacity', '.9');
    $('#multiple-choice').css('filter', 'invert(0)');
  } else {
    $('#multiple-choice').attr('stroke', '#000000');
    $('#multiple-choice').css('opacity', '.5');
    $('#multiple-choice').css('filter', '');
  }
  for (office of offices_disponibles){
    if (office.rang == "haut"){
      topOffice = id;
    }
    if (office.rang == "Mémoire facultative") {
      topOffice++;
    }
    id++;
  }
  id = 1;
  for (office of offices_disponibles){
    innerHtml = innerHtml + "<input type=\"radio\" id=\"" + id + "\" value=\""+ office.zone + "\" name=\"radio_office\" " + (id==topOffice?"checked":"") + " /><label for=\"" + id + "\" ><span class=\"office_button\"><p>" + office.ligne1 + "<\/p><p>" + office.ligne2 + "<\/p><p>" + office.ligne3  + "<\/p></span></label>";
    innerHtmlMob = innerHtmlMob + "<input type=\"radio\" id=\"" + id + "\" value=\""+ office.zone + "\" name=\"radio_office_mob\" " + (id==topOffice?"checked":"") + " /><label for=\"" + id + "\" ><span class=\"office_button\"><p>" + office.ligne1 + "<\/p><p>" + office.ligne2 + "<\/p><p>" + office.ligne3  + "<\/p></span></label>";
    if (id == 1){
      firstZone = office.zone;
    }
    id++;
  }
  $('.office_choice').html(innerHtml);
  $('.office_choice_mob').html(innerHtmlMob);
  update_office(0);
}

function display_office_error(){
  //var innerHtml = "<div class=\"office_button_error\"><p>Office non disponible</p></div>";
  $('.office_choice').html("");
  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html("<ul><li><a href='.' class='anchor_selected'>Retour à la date actuelle</li></ul>")});
  update_liturgical_color("noir");
  $(".office_content").html("<h1>Cet office n'est pas disponible</h1><p>Si vous voyez cet écran, vous n'avez pas de connexion à internet ou vous avez sélectionné une date éloignée de plusieurs mois de la date du jour. Pour l'une de ces raisons, l'office demandé ne peut pas être affiché.</p><p>Si vous êtes connectés à internet, vous pouvez afficher un office plus proche de la date actuelle en sélectionnant une nouvelle date, ou en appuyant sur le bouton de retour qui vous ramènera à l'office le plus proche de votre heure actuelle.</p><p>Si vous n'êtes pas connectés à internet, BreF propose la consultation des offices hors ligne des 7 jours suivants la date actuelle, à la condition que ceux-ci aient été chargés auparavant en visitant l'application en étant connecté à internet.</p>");
}

function select_office(zone){
  //window.location.href = window.location.href + "?office=" + $('#office').val() + "&date=" + $('#date').val() + "&zone=" + zone + "&hymne=" + $('#hymne').is(":checked") + "&invitatoire=" + $('#invitatoire').val()
}

function update_liturgical_color(color){
  switch (color) {
    case "blanc":
      $("#global").removeClass();
      $("#global").addClass("color_liturgy_white");
      break;
    case "vert":
      $("#global").removeClass();
      $("#global").addClass("color_liturgy_green");
      break;
    case "rouge":
      $("#global").removeClass();
      $("#global").addClass("color_liturgy_red");
      break;
    case "violet":
      $("#global").removeClass();
      $("#global").addClass("color_liturgy_purple");
      break;
    case "rose":
      $("#global").removeClass();
      $("#global").addClass("color_liturgy_pink");
      break;
    default:
      $("#global").removeClass();
      $("#global").addClass("color_liturgy_default");
      break;
  }
}

function update_office_class(office){
  switch (office) {
    case "lectures":
      $("#global").addClass("office_lectures");
      $("#global").removeClass("office_laudes");
      $("#global").removeClass("office_vepres");
      $("#global").removeClass("office_complies");
      break;
    case "laudes":
      $("#global").addClass("office_laudes");
      $("#global").removeClass("office_lectures");
      $("#global").removeClass("office_vepres");
      $("#global").removeClass("office_complies");
      break;
    case "vepres":
      $("#global").addClass("office_vepres");
      $("#global").removeClass("office_laudes");
      $("#global").removeClass("office_lectures");
      $("#global").removeClass("office_complies");
      break;
    case "complies":
      $("#global").addClass("office_complies");
      $("#global").removeClass("office_laudes");
      $("#global").removeClass("office_vepres");
      $("#global").removeClass("office_lectures");
      break;
    default:
      break;
  }
}


function update_office(scroll=0){
  var date = $('#date').val();
  var office = $('#office').val();
  var zone = $("input[type='radio'][name='radio_office']:checked").val();
	const hymne = true;
  let elements = document.getElementsByClassName("psaume_invitatoire_select");
	var invitatoire = elements.length > 0 ? elements[0].value : 94;  


	var urlAelf = "https://api.aelf.org/v1/" + office + "/" + date + "/" + zone.split(";")[0];

	var contenu_dominicain = null;
	if (office != "messes") {
    if (zone.startsWith("dominicain")) {
		  contenu_dominicain = office_du(office, date2slashedDate(date), zone.split(";")[1]);
		  urlAelf = "https://api.aelf.org/v1/" + office + "/" + date + "/romain"
		  zone = "dominicain";
    }
  } else {
    if (zone.startsWith("dominicain")) {
		  contenu_dominicain = messe_du(date2slashedDate(date));
		  urlAelf = "https://api.aelf.org/v1/" + office + "/" + date + "/romain"
		  zone = "dominicain";
    }
	}

	$.ajax({url: urlAelf,
		success: function(result){

      if (office != "messes") {
        let elements_hymne = document.getElementsByClassName("hymne_select");
        //Si pas encore de selecteurs affiché, ou si update de type retour à zéro, on choisit l'hymne d'aelf
        var hymne_selected = (elements_hymne.length > 0 ) ? elements_hymne[0].value : result[office].hymne.titre;
        if (scroll == 0){ 
          hymne_selected = result[office].hymne.titre;
        }
      }


			var html_text = create_office_html(office, date, zone, hymne, invitatoire, result, contenu_dominicain, hymne_selected);

				$(".office_content").each(function(){$(this).html(html_text.texte)});
        $(".office_titre").each(function(){$(this).html(html_text.titre)});
        $(".office_sommaire").each(function(){$(this).html(html_text.sommaire)});
        //this probably should be done in breviaire.js for consistency
        if (contenu_dominicain != null){
          $(".office_biographie").each(function(){$(this).html("<div class='text_part biographie' id='biographie'><h2>" + contenu_dominicain.informations.titre + "</h2>" + contenu_dominicain.biographie + "</div><hr>")});  
        }else{
          $(".office_biographie").each(function(){$(this).html("")});
        }
        update_anchors();
        update_liturgical_color(html_text.couleur);
        update_office_class(office);
        switch (scroll) {
          case 0:
            var element_to_scroll_to = document.getElementById('firstScroll');
            if (window.scrollY < 1000) {
              setTimeout(function(){
                //timeout to avoid scrolling to the wrong position on initial load
                element_to_scroll_to.scrollIntoView({behavior: "instant"});
              }, 10);
            } else {
              element_to_scroll_to.scrollIntoView({behavior: "smooth"});
            }
            break;
          case 1:
            var element_to_scroll_to = document.getElementById('firstScroll');
            element_to_scroll_to.scrollIntoView({behavior: "instant"});
            break;
          case 2:
            //no scroll (like for invitatoire)
            break;
          default:
            break;
        }
        if (office == "laudes") {
          let elements = document.getElementsByClassName("psaume_invitatoire_select");
          for (let i = 0; i < elements.length; i++) {
            elements[i].value = invitatoire;
          }
        }
        if (office == "laudes" || office == "vepres" || office == "lectures") {
          let elements = document.getElementsByClassName("hymne_select");
          for (let i = 0; i < elements.length; i++) {
            elements[i].value = hymne_aelf2bref(hymne_selected);
          }
        }
		},
		error: function(result){
			display_office_error();
      //$(".office_content").html("<br><br><h1>Office non disponible</h1><br><br><br><br><br>")
		}
	});
}

function update_office_credits(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Informations</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='credits'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
  sommaire = sommaire.concat("<li><a href='#credits'>Crédits</a></li>");

  texte_final = texte_final.concat("<h2> Crédits </h2>");
  texte_final = texte_final.concat("Application dérivée de l'application franciscaine développée par Matthias Pasquier et Thibaut Chourré.<br><br>");
  texte_final = texte_final.concat("Si vous avez une remarque, une suggestion ou une erreur à faire remonter, vous pouvez envoyer un message à outils.apostoliques.op[at]gmail.com. <br><br>");
  texte_final = texte_final.concat("Textes Liturgiques issus de <a href='http://aelf.org'>AELF</a> pour les offices romains et francais. <br>Textes liturgiques issus du Sanctoral dominicain (© Propium Officiorum Ordinis Prædicatorum, 1982) pour les offices dominicains.<br><br>");
  texte_final = texte_final.concat("Remerciements à xxx pour leur aide dans la retranscription du sanctoral dominicain.  <br><br>");
  texte_final = texte_final.concat("Remerciements aux frères de la Province de Toulouse pour leur aide dans les choix liturgiques. <br><br>");

  texte_final = texte_final.concat("</div>");

  // texte_final = texte_final.concat("<div class='text_part' id='installation'>");
  // sommaire = sommaire.concat("<li><a href='#installation'>Installation</a></li>");

  // texte_final = texte_final.concat("<h2> Installation </h2>");
  // texte_final = texte_final.concat("Guide pour l'installation de cette application sur votre téléphone. <br><br>");
  // texte_final = texte_final.concat("<h3> IOS </h3>");
  // texte_final = texte_final.concat('<ul><li>Naviguer jusqu\'à cette page dans Safari <li> Appuyer sur le bouton "Partage" (<span class="material-symbols-outlined">ios_share</span>)<li>Appuyer sur "Ajouter à l\'écran d\'accueil" (<span class="material-symbols-outlined">add_box</span>)<li>Appuyer sur "Ajouter"</ul>');

  // texte_final = texte_final.concat("<h3> Android </h3>");
  // texte_final = texte_final.concat('<ul><li>Naviguer jusqu\'à cette page dans Chrome <li> Appuyer sur le bouton "Plus d\'informations" (<span class="material-symbols-outlined">more_vert</span>)<li>Appuyer sur "Installer l\'application" (<span class="material-symbols-outlined">install_mobile</span>)<li>Appuyer sur "Installer"</ul>');

  // texte_final = texte_final.concat("</div>");



  texte_final = texte_final.concat("</div>");

  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html(titre)});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
  
  // Gestionnaire d'événement pour le bouton Nous soutenir
  $('#soutenir_button').click(function() {
    window.open('https://soutenir.fondationduclerge.com/?reserved_affectations=1258', '_blank');
  });
}


function update_settings(){
  // Charger les paramètres avant de construire l'interface
  loadSettings();
  
  // Déclencher les changements automatiques après avoir chargé les paramètres
  var couvent = $('#couvents_list').val();
  var couventsBJ = ['Toulouse', 'Montpellier', 'Bordeaux', 'Marseille', 'La Sainte-Baume', 'Monaco'];
  
  if (couventsBJ.includes(couvent)) {
    $('#traduction_switch').prop('checked', true);
  }
  
  if (couvent === 'Toulouse') {
    $('#psaumes_switch').prop('checked', true);
  }
  
  // Initialiser les gestionnaires d'événements pour la sauvegarde
  initSettingsHandlers();
  
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Paramètres</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='sombre' style='margin-top: 0px;'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
  sommaire = sommaire.concat("<li><a href='#sombre'>Mode Clair/Sombre</a></li>");

  texte_final = texte_final.concat("<h2> Mode Clair/Sombre</h2>");
  // bouton switch mode "Clair" / "Sombre"

  texte_final = texte_final.concat("</div>");


  // texte_final = texte_final.concat("<div class='text_part' id='Taille du texte'>");
  // sommaire = sommaire.concat("<li><a href='#tailletexte'>Taille du texte</a></li>");

  // texte_final = texte_final.concat("<h2> Taille du texte</h2>");
  // Loupe + et loupe - avec un point de réglage sur le texte.

  // texte_final = texte_final.concat("</div>");


  texte_final = texte_final.concat("<div class='text_part' id='couvents'>");
  sommaire = sommaire.concat("<li><a href='#couvents'>Couvents</a></li>");

  texte_final = texte_final.concat("<h2>Couvents</h2>");
  // Liste déroulante des couvents de la province de Toulouse
  texte_final = texte_final.concat("<select id='couvents_list' name='couvents'>");
  texte_final = texte_final.concat("<option value=''>Sélectionnez un couvent</option>");
  texte_final = texte_final.concat("<option value='Bordeaux'>Bordeaux</option>");
  texte_final = texte_final.concat("<option value='Fanjeaux'>Fanjeaux</option>");
  texte_final = texte_final.concat("<option value='La Réunion'>La Réunion</option>");
  texte_final = texte_final.concat("<option value='La Sainte-Baume'>La Sainte-Baume</option>");
  texte_final = texte_final.concat("<option value='Majanga'>Majanga</option>");
  texte_final = texte_final.concat("<option value='Marseille'>Marseille</option>");
  texte_final = texte_final.concat("<option value='Monaco'>Monaco</option>");
  texte_final = texte_final.concat("<option value='Montpellier'>Montpellier</option>");
  texte_final = texte_final.concat("<option value='Nice'>Nice</option>");
  texte_final = texte_final.concat("<option value='Port-au-Prince'>Port-au-Prince</option>");
  texte_final = texte_final.concat("<option value='Toulouse'>Toulouse</option>");
  texte_final = texte_final.concat("</select>");

  texte_final = texte_final.concat("</div>");

  texte_final = texte_final.concat("<div class='text_part' id='traduction'>");
  sommaire = sommaire.concat("<li><a href='#traduction'>Traduction</a></li>");

  texte_final = texte_final.concat("<h2>Traduction</h2>");
  // bouton switch AELF / BJ
  texte_final = texte_final.concat("<div class='switch-container'>");
  texte_final = texte_final.concat("<span class='switch-label'>AELF</span>");
  texte_final = texte_final.concat("<label class='switch'>");
  texte_final = texte_final.concat("<input type='checkbox' id='traduction_switch' name='traduction'>");
  texte_final = texte_final.concat("<span class='slider round'></span>");
  texte_final = texte_final.concat("</label>");
  texte_final = texte_final.concat("<span class='switch-label'>BJ</span>");
  texte_final = texte_final.concat("</div>");
  texte_final = texte_final.concat("</div>");

  texte_final = texte_final.concat("<div class='text_part' id='repartitionpsaumes'>");
  sommaire = sommaire.concat("<li><a href='#repartitionpsaumes'>Répartition des psaumes</a></li>");

  texte_final = texte_final.concat("<h2>Répartition des psaumes</h2>");
  // bouton switch Romaine / Toulousaine
  texte_final = texte_final.concat("<div class='switch-container'>");
  texte_final = texte_final.concat("<span class='switch-label'>Romaine</span>");
  texte_final = texte_final.concat("<label class='switch'>");
  texte_final = texte_final.concat("<input type='checkbox' id='psaumes_switch' name='psaumes'>");
  texte_final = texte_final.concat("<span class='slider round'></span>");
  texte_final = texte_final.concat("</label>");
  texte_final = texte_final.concat("<span class='switch-label'>Toulousaine</span>");
  texte_final = texte_final.concat("</div>");
  texte_final = texte_final.concat("</div>");


  texte_final = texte_final.concat("<div class='text_part' id='popuprein'>");
  sommaire = sommaire.concat("<li><a href='#popuprein'>Avertissement</a></li>");

  texte_final = texte_final.concat("<h2>Avertissement</h2>");
  // Tickbox Désactivé l'avertissement à l'ouverture.
  texte_final = texte_final.concat("<div class='checkbox-container'>");
  texte_final = texte_final.concat("<label class='checkbox-label'>");
  texte_final = texte_final.concat("<input type='checkbox' id='disable_warning' name='disable_warning'>");
  texte_final = texte_final.concat("Désactiver l'avertissement à l'ouverture");
  texte_final = texte_final.concat("</label>");
  texte_final = texte_final.concat("</div>");

  texte_final = texte_final.concat("</div>");


  texte_final = texte_final.concat("<div class='text_part' id='installation'>");
  sommaire = sommaire.concat("<li><a href='#installation'>Installation</a></li>");

  texte_final = texte_final.concat("<h2> Installation </h2>");
  texte_final = texte_final.concat("Pour installer cette application sur votre téléphone. <br><br>");
  texte_final = texte_final.concat("<h3> iOS </h3>");
  texte_final = texte_final.concat('<ul><li> Appuyer sur le bouton "Partage" (<span class="material-symbols-outlined">ios_share</span>)<li>Appuyer sur "Ajouter à l\'écran d\'accueil" (<span class="material-symbols-outlined">add_box</span>)<li>Appuyer sur "Ajouter"</ul>');

  texte_final = texte_final.concat("<h3> Android </h3>");
  texte_final = texte_final.concat('<ul><li> Appuyer sur le bouton "Plus d\'informations" (<span class="material-symbols-outlined">more_vert</span>)<li>Appuyer sur "Installer l\'application" (<span class="material-symbols-outlined">install_mobile</span>)<li>Appuyer sur "Installer"</ul>');

  texte_final = texte_final.concat("</div>");

  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
  
  // Sauvegarder les paramètres lorsque l'utilisateur accède aux paramètres
  saveSettings();
  
  // Gestionnaire d'événement pour la liste déroulante des couvents
  $('#couvents_list').change(function() {
    var couvent = $(this).val();
    var couventsBJ = ['Toulouse', 'Montpellier', 'Bordeaux', 'Marseille', 'La Sainte-Baume', 'Monaco'];
    
    if (couventsBJ.includes(couvent)) {
      $('#traduction_switch').prop('checked', true);
    } else {
      $('#traduction_switch').prop('checked', false);
    }
    
    // Activer automatiquement l'option Toulousaine si Toulouse est sélectionné
    if (couvent === 'Toulouse') {
      $('#psaumes_switch').prop('checked', true);
    }
    
    // Sauvegarder les paramètres après les changements automatiques
    saveSettings();
  });
}

// function update_office_installation(){
//   var texte_final = '<div class="office_text" id="office_text">';
//   var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
//    sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");

//   texte_final = texte_final.concat("<div class='text_part' id='installation'>");
//   sommaire = sommaire.concat("<li><a href='#installation'>Installation</a></li>");

//   //texte_final = texte_final.concat("<h2> Installation </h2>");
//   texte_final = texte_final.concat("Pour installer cette application sur votre téléphone. <br><br>");
//   texte_final = texte_final.concat("<h3> iOS </h3>");
//   texte_final = texte_final.concat('<ul><li> Appuyer sur le bouton "Partage" (<span class="material-symbols-outlined">ios_share</span>)<li>Appuyer sur "Ajouter à l\'écran d\'accueil" (<span class="material-symbols-outlined">add_box</span>)<li>Appuyer sur "Ajouter"</ul>');

//   texte_final = texte_final.concat("<h3> Android </h3>");
//   texte_final = texte_final.concat('<ul><li> Appuyer sur le bouton "Plus d\'informations" (<span class="material-symbols-outlined">more_vert</span>)<li>Appuyer sur "Installer l\'application" (<span class="material-symbols-outlined">install_mobile</span>)<li>Appuyer sur "Installer"</ul>');

//   texte_final = texte_final.concat("</div>");


//   $(".office_biographie").each(function(){$(this).html("")});
//   $(".office_content").each(function(){$(this).html(texte_final)});
//   $(".office_titre").each(function(){$(this).html("")});
//   $(".office_sommaire").each(function(){$(this).html(sommaire)});
//   $("body").removeClass("menu-open");
//   $('body').removeClass("background-open");
//   window.scrollTo(0, 0);
//   update_anchors();
//   update_liturgical_color("vert");
//   update_office_class(office);
// }

// Fonction pour afficher le popup d'avertissement à l'ouverture
function showWelcomePopup() {
  var popup = document.getElementById('welcome_popup');
  if (popup) {
    popup.style.display = 'block';
  }
}

// Fonction pour fermer le popup
function closeWelcomePopup() {
  var popup = document.getElementById('welcome_popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

// Gestionnaire d'événement pour les boutons du popup
$(document).ready(function() {
  $('#close_popup').click(function() {
    saveSettings();
    closeWelcomePopup();
  });
  
  $('#settings_popup').click(function() {
    saveSettings();
    closeWelcomePopup();
    update_settings();
  });
  

  
  // Charger les paramètres au démarrage
  loadSettings();
  
  // Déclencher les changements automatiques après avoir chargé les paramètres
  var couvent = $('#couvents_list').val();
  var couventsBJ = ['Toulouse', 'Montpellier', 'Bordeaux', 'Marseille', 'La Sainte-Baume', 'Monaco'];
  
  if (couventsBJ.includes(couvent)) {
    $('#traduction_switch').prop('checked', true);
  }
  
  if (couvent === 'Toulouse') {
    $('#psaumes_switch').prop('checked', true);
  }
  
  // Afficher le popup à l'ouverture si l'avertissement n'est pas désactivé
  if (!$('#disable_warning').is(':checked')) {
    showWelcomePopup();
  }
});

// Fonction pour sauvegarder tous les paramètres
function saveSettings() {
  var settings = {
    couvent: $('#couvents_list').val(),
    traduction: $('#traduction_switch').is(':checked'),
    psaumes: $('#psaumes_switch').is(':checked'),
    disableWarning: $('#disable_warning').is(':checked')
  };
  localStorage.setItem('breviaireSettings', JSON.stringify(settings));
}

// Fonction pour charger tous les paramètres
function loadSettings() {
  var settings = localStorage.getItem('breviaireSettings');
  if (settings) {
    settings = JSON.parse(settings);
    
    // Charger le couvent sélectionné
    if (settings.couvent) {
      $('#couvents_list').val(settings.couvent);
    }
    
    // Charger la traduction sélectionnée
    if (settings.traduction !== undefined) {
      $('#traduction_switch').prop('checked', settings.traduction);
    }
    
    // Charger la répartition des psaumes sélectionnée
    if (settings.psaumes !== undefined) {
      $('#psaumes_switch').prop('checked', settings.psaumes);
    }
    
    // Charger l'état de la désactivation de l'avertissement
    if (settings.disableWarning !== undefined) {
      $('#disable_warning').prop('checked', settings.disableWarning);
      $('#disable_warning_popup').prop('checked', settings.disableWarning);
    }
  }
}

// Fonction pour initialiser les gestionnaires d'événements pour la sauvegarde
function initSettingsHandlers() {
  // Sauvegarder les paramètres lorsque le couvent change
  $('#couvents_list').change(function() {
    saveSettings();
  });
  
  // Sauvegarder les paramètres lorsque la traduction change
  $('#traduction_switch').change(function() {
    saveSettings();
  });
  
  // Sauvegarder les paramètres lorsque la répartition des psaumes change
  $('#psaumes_switch').change(function() {
    saveSettings();
  });
  
  // Sauvegarder les paramètres lorsque la désactivation de l'avertissement change
  $('#disable_warning').change(function() {
    saveSettings();
  });
  
  // Sauvegarder les paramètres lorsque la désactivation de l'avertissement dans le popup change
  $('#disable_warning_popup').change(function() {
    saveSettings();
  });
}

// Charger les paramètres au démarrage
$(document).ready(function() {
  loadSettings();
  
  // Déclencher les changements automatiques après avoir chargé les paramètres
  var couvent = $('#couvents_list').val();
  var couventsBJ = ['Toulouse', 'Montpellier', 'Bordeaux', 'Marseille', 'La Sainte-Baume', 'Monaco'];
  
  if (couventsBJ.includes(couvent)) {
    $('#traduction_switch').prop('checked', true);
  }
  
  if (couvent === 'Toulouse') {
    $('#psaumes_switch').prop('checked', true);
  }
  
  // Sauvegarder les paramètres après les changements automatiques
  saveSettings();
  
  initSettingsHandlers();
});


function update_office_consecrations(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Consécrations à Marie</h1></div>")
 
  // texte_final = texte_final.concat("<div class='text_part' id='maximilien' style='margin-top: 0px;'>");
  // sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
  // sommaire = sommaire.concat("<li><a href='#maximilien'>St Maximilien-Marie Kolbe</a></li>");

  // texte_final = texte_final.concat("<h2> Consécration de St Maximilien-Marie Kolbe </h2>");
  // texte_final = texte_final.concat("Immaculée Conception, Reine du ciel et de la terre, Refuge des pécheurs et Mère très aimante, à qui Dieu voulut confier tout l’ordre de la Miséricorde, me voici à tes pieds, moi, pauvre pécheur.<br>");
  // texte_final = texte_final.concat("<br>Je t’en supplie, accepte mon être tout entier comme ton bien et ta propriété ; agis en moi selon ta volonté, en mon âme et mon corps, en ma vie, ma mort et mon éternité.<br>");
  // texte_final = texte_final.concat("<br>Dispose avant tout de moi comme tu le désires, pour que se réalise enfin ce qui est dit de toi : « La Femme écrasera la tête du serpent » et aussi « Toi seule vaincras les hérésies dans le monde entier ».<br>");
  // texte_final = texte_final.concat("<br>Qu’en tes mains toutes pures, si riches de miséricorde, je devienne un instrument de ton amour, capable de ranimer et d’épanouir pleinement tant d’âmes tièdes ou égarées.<br>");
  // texte_final = texte_final.concat("<br>Ainsi s’étendra sans fin le Règne du Coeur divin de Jésus. Vraiment, ta seule présence attire les grâces qui convertissent et sanctifient les âmes, puisque la Grâce jaillit du Coeur divin de Jésus sur nous tous, en passant par tes mains maternelles.<br>");
  // texte_final = texte_final.concat("<br>Amen.");

  // texte_final = texte_final.concat("</div>");



  // texte_final = texte_final.concat("<div class='text_part' id='mariemamere'>");
  // sommaire = sommaire.concat("<li><a href='#mariemamere'>Ô Marie ma Mère</a></li>");

  // texte_final = texte_final.concat("<h2> Ô Marie ma Mère </h2>");
  // texte_final = texte_final.concat("Ô Marie ma Mère je me donne à toi, prends-moi dans ton cœur Immaculé. Avec toi je veux aimer Jésus comme tu l'aimes. Je te consacre mon corps et mon âme, mes dons et mes biens, pour que tout en moi glorifie le Seigneur. Puisque je t'appartiens, fais de moi ce qu'il te plaira ; je suis ton enfant et je t'aime.");

  // texte_final = texte_final.concat("</div>");



  texte_final = texte_final.concat("<div class='text_part' id='louis'>");
  sommaire = sommaire.concat("<li><a href='#louis'>St Louis-Marie Grignion de Monfort</a></li>");

  texte_final = texte_final.concat("<h2> Consécration de St Louis-Marie Grignion de Monfort </h2>");
  texte_final = texte_final.concat("Je te choisis aujourd'hui, ô Marie, en présence de toute la Cour céleste pour ma Mère et ma Reine.<br>");
  texte_final = texte_final.concat("<br>Je te livre et consacre, en toute soumission et amour mon corps et mon âme, mes biens intérieurs et extérieurs, et la valeur même de mes bonnes actions passées, présentes et futures, te laissant un entier et plein droit de disposer de moi et de tout ce qui m'appartient sans exception, selon ton bon plaisir, à la plus grande Gloire de Dieu dans le temps et l'éternité. <br>");
  texte_final = texte_final.concat("<br>Amen.");

  texte_final = texte_final.concat("</div>");



  // texte_final = texte_final.concat("<div class='text_part' id='mission'>");
  // sommaire = sommaire.concat("<li><a href='#mission'>Mission de l'Immaculée</a></li>");

  // texte_final = texte_final.concat("<h2> Consécration quotidienne de la Mission de l'Immaculée </h2>");
  // texte_final = texte_final.concat("Vierge Immaculée, ma mère, Marie, je renouvelle aujourd’hui et pour toujours, la consécration de tout mon être, pour que tu disposes de moi pour le salut des âmes. <br>");
  // texte_final = texte_final.concat("<br>Je te demande seulement, ô ma reine et mère de l’Église, de participer fidèlement à ta mission pour que s’établisse le règne de Jésus dans le monde. <br>");
  // texte_final = texte_final.concat("<br>Je t’offre donc, ô cœur immaculé de Marie, les prières, les actions et les sacrifices de ce jour.<br>");


  // texte_final = texte_final.concat("</div>");


  // texte_final = texte_final.concat("<div class='text_part' id='familles'>");
  // sommaire = sommaire.concat("<li><a href='#familles'>Consécration des familles</a></li>");

  // texte_final = texte_final.concat("<h2> Consécration des familles </h2>");
  // texte_final = texte_final.concat("Immaculée Conception, Reine du Ciel et de la Terre, Refuge des pécheurs et Mère très aimante, à qui Dieu voulut confier tout l'ordre de la Miséricorde, nous voici à tes pieds, nous, pauvres pécheurs.<br>");
  // texte_final = texte_final.concat("<br>En ce jour, ô Notre-Dame, nous renouvelons la Consécration de tout nous-mêmes à ton Cœur Immaculé. Nous te confions toutes nos familles et celles du monde entier, en particulier les plus fragiles, et celles qui sont persécutées à cause de leur foi. Nous te confions nos enfants, nos personnes âgées, nos malades et tous nos défunts.<br>");  
  // texte_final = texte_final.concat("<br>Fais de toutes nos familles des foyers qui s'ouvrent à l'écoute de la Parole de Dieu et à la pratique des sacrements, avec la joie de vivre dans la foi, l'espérance et la charité. Qu'elles soient ton bien et ta propriété.<br>");  
  // texte_final = texte_final.concat("<br>Agis en chacun de leurs membres selon ta volonté en leurs âmes, en leurs corps, en leurs vies, leurs morts et leur éternité. Qu'en tes mains toutes pures, si riches de miséricorde, Ils reçoivent les sept dons du Saint Esprit et tous les charismes nécessaires pour se donner à l'évangélisation du monde, dans tous les domaines de l'activité humaine.<br>");  
  // texte_final = texte_final.concat("<br>Ainsi s'étendra sans fin, le règne du Cœur Divin de Jésus. Vraiment ta seule présence attire les grâces qui convertissent et sanctifient les âmes, puisque la Grâce jaillit du Coeur Sacré de Jésus sur nous tous, en passant par tes mains maternelles.<br>");  
  // texte_final = texte_final.concat("<br>Amen.");


  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
}


function update_office_prierescommunes(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Prières Communes</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='signe' style='margin-top: 0px;'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
  sommaire = sommaire.concat("<li><a href='#signe'>Signe de la Croix</a></li>");

  texte_final = texte_final.concat("<h2> Signe de la Croix </h2>");
  texte_final = texte_final.concat("Au nom du Père,<br> et du Fils,<br> et du Saint-Esprit. Amen.");
  texte_final = texte_final.concat("<h2> Signum Crucis </h2>");
  texte_final = texte_final.concat("In nómine Patris<br>et Fílii<br>et Spíritus Sancti. Amen.");

  texte_final = texte_final.concat("</div>");


  texte_final = texte_final.concat("<div class='text_part' id='doxologie'>");
  sommaire = sommaire.concat("<li><a href='#doxologiefr'>Doxologie</a></li>");

  texte_final = texte_final.concat("<h2> Doxologie </h2>");
  texte_final = texte_final.concat("Gloire au Père, au Fils, et au Saint-Esprit. <br>Comme il était au commencement, maintenant et toujours et dans les siècles des siècles. Amen.");
  texte_final = texte_final.concat("<h2> Gloria Patri </h2>");
  texte_final = texte_final.concat("Glória Patri<br>et Fílio<br>et Spirítui Sancto.<br>Sicut erat in princípio,<br>et nunc et semper<br>et in sæcula sæculórum. Amen.");

  texte_final = texte_final.concat("</div>");

  texte_final = texte_final.concat("<div class='text_part' id='avemaria'>");
  sommaire = sommaire.concat("<li><a href='#avemaria'>Je vous salue</a></li>");

  texte_final = texte_final.concat("<h2> Je vous salue </h2>");
  texte_final = texte_final.concat("Je vous salue, Marie, pleine de grâce ;<br>Le Seigneur est avec vous ;<br>Vous êtes bénie entre toutes les femmes ;<br>Et Jésus, le fruit de vos entrailles, est béni.<br>Sainte Marie, Mère de Dieu,<br>Priez pour nous, pauvres pécheurs<br>Maintenant et à l’heure de notre mort.<br>Amen.");
  texte_final = texte_final.concat("<h2> Ave Maria </h2>");
  texte_final = texte_final.concat("Ave, María, grátia plena,<br>Dóminus tecum.<br>Benedícta tu in muliéribus,<br>et benedíctus fructus ventris tui, Iesus.<br>Sancta María, Mater Dei,<br>ora pro nobis peccatóribus,<br>nunc et in hora mortis nostræ.<br>Amen.");

  texte_final = texte_final.concat("</div>");  

texte_final = texte_final.concat("<div class='text_part' id='angedieu'>");
sommaire = sommaire.concat("<li><a href='#angedieu'>Ange de Dieu</a></li>");

texte_final = texte_final.concat("<h2> Ange de Dieu </h2>");
texte_final = texte_final.concat("Ange de Dieu, <br>qui es mon gardien,<br>et à qui j’ai été confié par la Bonté divine,<br>éclaire-moi, défends-moi,<br>conduis-moi et dirige-moi. Amen.");
texte_final = texte_final.concat("<h2> Ángele Dei </h2>");
texte_final = texte_final.concat("Ángele Dei,<br>qui custos es mei,<br>me, tibi commíssum pietáte supérna,<br>illúmina, custódi,<br>rege et gubérna. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='reposeternel'>");
sommaire = sommaire.concat("<li><a href='#reposeternel'>Le repos éternel</a></li>");

texte_final = texte_final.concat("<h2> Le repos éternel </h2>");
texte_final = texte_final.concat("Donne-leur, Seigneur, le repos éternel<br>Et que brille sur eux la lumière de ta face.<br>Qu’ils reposent en paix. Amen.");
texte_final = texte_final.concat("<h2> Réquiem ætérnam </h2>");
texte_final = texte_final.concat("Réquiem ætérnam dona eis Dómine,<br>et lux perpétua lúceat eis.<br>Requiéscant in pace. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='angelus'>");
sommaire = sommaire.concat("<li><a href='#angelus'>Angelus</a></li>");

texte_final = texte_final.concat("<h2> Angelus </h2>");
texte_final = texte_final.concat("D. L’ange du Seigneur apporta<br>l’annonce à Marie.<br>C. Et elle a conçu<br>du Saint-Esprit.<br>Je vous salue, Marie …<br>D. Voici la servante du Seigneur.<br>C. Qu’il me soit fait<br>selon ta parole.<br>Je vous salue, Marie …<br>D. Et le Verbe s’est fait chair.<br>C. Et il a habité parmi nous.<br>Je vous salue, Marie …<br>D. Prie pour nous, Sainte Mère de Dieu.<br>C. Afin que nous soyons rendus dignes<br>des promesses du Christ.<br>Prions<br>Que ta grâce, Seigneur notre Père,<br>se répande en nos cœurs :<br>par le message de l’ange,<br>tu nous as fait connaître l’incarnation<br>de ton Fils bien-aimé,<br>conduis-nous, par sa passion et<br>par sa croix,<br>jusqu’à la gloire de la Résurrection<br>Par Jésus, le Christ,<br>notre Seigneur. Amen.<br>Gloire au Père...");
texte_final = texte_final.concat("<h2> Angelus Domini </h2>");
texte_final = texte_final.concat("D. Ángelus Dómini<br>nuntiávit Maríæ.<br>C. Et concépit<br>de Spíritu Sancto.<br>Ave, María...<br>D. Ecce ancílla Dómini.<br>C. Fiat mihi secúndum<br>verbum tuum.<br>Ave, María...<br>D. Et Verbum caro factum est.<br>C. Et habitávit in nobis.<br>Ave, María...<br>D. Ora pro nobis, sancta Dei génetrix.<br>C. Ut digni efficiámur<br>promissiónibus Christi.<br>Orémus.<br>Grátiam tuam, quæ´sumus,<br>Dómine, méntibus nostris infúnde;<br>ut qui, Ángelo nuntiánte,<br>Christi Fílii tui incarnatiónem<br>cognóvimus,<br>per passiónem eius et crucem,<br>ad resurrectiónis glóriam perducámur.<br>Per eúmdem Christum<br>Dóminum nostrum. Amen.<br>Glória Patri...");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regina_caeli'>");
sommaire = sommaire.concat("<li><a href='#regina_caeli'>Regina Cæli</a></li>");

texte_final = texte_final.concat("<h2> Regina Cæli </h2>");
texte_final = texte_final.concat("(au temps pascal)<br>Reine du ciel, réjouis-toi,<br>alleluia.<br>Car celui qu’il te fut donné de porter,<br>alleluia,<br>Est ressuscité comme il l’avait dit.<br>alleluia.<br>Prie Dieu pour nous,<br>alleluia.<br>D. Sois heureuse et réjouis-toi,<br>Vierge Marie, alleluia,<br>C. Car le Seigneur est vraiment ressuscité,<br>alleluia.<br>Prions. Dieu qui, par la résurrection de ton<br>Fils notre Seigneur Jésus Christ, as bien<br>voulu réjouir le monde, fais, nous t’en<br>prions, que par la Vierge Marie, sa mère,<br>nous arrivions aux joies de la vie éternelle.<br>Par le Christ notre Seigneur.<br>Amen.");
texte_final = texte_final.concat("<h2> Regina Cæli (tempus paschale) </h2>");
texte_final = texte_final.concat("Regína cæli lætáre,<br>allelúia.<br>Quia quem meruísti portáre,<br>allelúia.<br>Resurréxit, sicut dixit,<br>allelúia.<br>Ora pro nobis Deum,<br>allelúia.<br>D. Gaude et lætáre, Virgo María,<br>allelúia,<br>C. Quia surréxit Dóminus vere,<br>allelúia.<br>Orémus. Deus, qui per resurrectiónem<br>Fílii tui Dómini nostri Iesu Christi<br>mundum lætificáre dignátus es, præsta,<br>quæ´sumus, ut per eius Genetrícem<br>Vírginem Maríam perpétuæ<br>capiámus gáudia vitæ.<br>Per Christum Dóminum nostrum. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='salve_regina'>");
sommaire = sommaire.concat("<li><a href='#salve_regina'>Salve Regina</a></li>");

texte_final = texte_final.concat("<h2> Salve Regina </h2>");
texte_final = texte_final.concat("Salut, ô Reine,<br>Mère de miséricorde,<br>notre vie, notre douceur, notre espérance, salut!<br>Nous crions vers toi,<br>enfants d’Ève exilés.<br>Vers toi nous soupirons, gémissant<br>et pleurant<br>dans cette vallée de larmes.<br>Ô toi, notre avocate<br>tourne vers nous ton regard miséricordieux.<br>Et, après cet exil,<br>montre-nous Jésus,<br>le fruit béni de tes entrailles.<br>Ô clémente, ô miséricordieuse, ô douce<br>Vierge Marie");
texte_final = texte_final.concat("<h2> Salve, Regina </h2>");
texte_final = texte_final.concat("Salve, Regína,<br>Mater misericórdiæ,<br>vita, dulcédo et spes nostra, salve.<br>Ad te clamámus,<br>éxsules fílii Evæ.<br>Ad te suspirámus geméntes et flentes<br>in hac lacrimárum valle.<br>Eia ergo, advocáta nostra,<br>illos tuos misericórdes óculos<br>ad nos convérte.<br>Et Iesum benedíctum fructum<br>ventris tui,<br>nobis, post hoc exsílium, osténde.<br>O clemens, o pia, o dulcis Virgo María!");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='magnificat'>");
sommaire = sommaire.concat("<li><a href='#magnificat'>Magnificat</a></li>");

texte_final = texte_final.concat("<h2> Magnificat </h2>");
texte_final = texte_final.concat("Mon âme exalte le Seigneur,<br>exulte mon esprit<br>en Dieu, mon Sauveur!<br>Il s’est penché<br>sur son humble servante;<br>désormais, tous les âges<br>me diront bienheureuse.<br>Le Puissant fit pour moi des merveilles;<br>Saint est son nom!<br>Son amour s’étend d’âge en âge<br>sur ceux qui le craignent.<br>Déployant la force de son bras,<br>il disperse les superbes.<br>Il renverse les puissants de leurs trônes,<br>il élève les humbles.<br>Il comble de bien les affamés,<br>renvoie les riches les mains vides.<br>Il relève Israël, son serviteur,<br>il se souvient de son amour,<br>de la promesse faite à nos pères,<br>en faveur d’Abraham et de sa race,<br>à jamais.<br>Gloire au Père, et au Fils,<br>et au Saint-Esprit<br>au Dieu qui est, qui était et qui vient,<br>pour les siècles des siècles.<br>Amen.");
texte_final = texte_final.concat("<h2> Magnificat (latin) </h2>");
texte_final = texte_final.concat("Magníficat ánima mea Dóminum,<br>et exsultávit spíritus meus<br>in Deo salutári meo.<br>Quia respéxit humilitátem<br>ancíllæ suæ,<br>ecce enim ex hoc beátam<br>me dicent omnes generatiónes.<br>Quia fecit mihi magna<br>qui potens est,<br>et sanctum nomen eius.<br>Et misericórdia eius a progénie<br>in progénies <br>timéntibus eum. <br>Fecit poténtiam in bráchio suo, <br>dispérsit supérbos mente cordis sui. <br>Depósuit poténtes de sede <br>et exaltávit húmiles. <br>Esuriéntes implévit bonis, <br>et dívites dimísit inánes. <br>Suscépit Ísrael púerum suum, <br>recordátus misericórdiæ suæ, <br>sicut locútus est ad patres nostros, <br>Ábraham et sémini eius in sæ´cula. <br>Glória Patri et Fílio <br>et Spirítui Sancto. <br>Sicut erat in princípio et nunc et semper, <br>et in sæcula sæculórum. <br>Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='sub_tuum'>");
sommaire = sommaire.concat("<li><a href='#sub_tuum'>Sub Tuum</a></li>");

texte_final = texte_final.concat("<h2> Sub Tuum </h2>");
texte_final = texte_final.concat("Sous l’abri de ta miséricorde, nous nous <br>réfugions, <br>Sainte Mère de Dieu.<br>Ne méprise pas nos prières <br>quand nous sommes dans l’épreuve, <br>mais de tous les dangers <br>délivre-nous toujours, <br>Vierge glorieuse, Vierge bienheureuse.");
texte_final = texte_final.concat("<h2> Sub Tuum (latin) </h2>");
texte_final = texte_final.concat("Sub tuum præsídium confúgimus, <br>Sancta Dei Génetrix. <br>Nostras deprecatiónes ne despícias <br>in necessitátibus, <br>sed a perículis cunctis <br>líbera nos semper, <br>Virgo gloriósa et benedícta.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='benedictus'>");
sommaire = sommaire.concat("<li><a href='#benedictus'>Benedictus</a></li>");

texte_final = texte_final.concat("<h2> Benedictus </h2>");
texte_final = texte_final.concat("Béni soit le Seigneur, le Dieu d’Israël, <br>qui visite <br>et rachète son peuple. <br>Il a fait surgir la force qui nous sauve <br>dans la maison de David, son serviteur, <br>comme il l’avait par la bouche des saints, <br>par ses prophètes, depuis les temps <br>anciens : <br>salut qui nous arrache à l’ennemi,<br>à la main de tous nos oppresseurs, <br>amour qu’il montre envers nos pères, <br>mémoire de son alliance sainte, <br>serment juré à notre père Abraham <br>de nous rendre sans crainte,  <br>afin que délivrés de la main des ennemis, <br>nous le servions, dans la justice et la <br>sainteté, <br>en sa présence, tout au long de nos jours. <br>Et toi, petit enfant <br>tu seras appelé prophète du Très-Haut : <br>tu marcheras devant, à la face du Seigneur, <br>et tu prépareras ses chemins <br>pour donner à son peuple <br>de connaître le salut <br>par la rémission de ses péchés, <br>grâce à la tendresse, à l’amour de <br>notre Dieu, <br>quand nous visite l’astre d’en haut, <br>pour illuminer ceux qui habitent <br>les ténèbres <br>et l’ombre de la mort, <br>pour conduire nos pas <br>au chemin de la paix. <br>Gloire au Père, et au Fils, <br>et au Saint-Esprit <br>au Dieu qui est, <br>qui était et qui vient, <br>pour les siècles des siècles. <br>Amen.");
texte_final = texte_final.concat("<h2> Benedictus (latin) </h2>");
texte_final = texte_final.concat("Benedíctus Dóminus, Deus Ísrael, <br>quia visitávit <br>et fecit redemptiónem plebis suæ, <br>et eréxit cornu salútis nobis <br>in domo David púeri sui, <br>sicut locútus est per os sanctórum, <br>qui a sæ´ culo sunt, prophetárum eius, <br>salútem ex inimícis nostris <br>et de manu ómnium, <br>qui odérunt nos, <br>ad faciéndam  misericórdiam <br>cum pátribus nostris, <br>et memorári testaménti sui sancti, <br>iusiurándum, quod iurávit <br>ad Ábraham patrem nostrum, <br>datúrum se nobis, <br>ut sine timóre, de manu inimicórum <br>nostrórum liberáti, <br>serviámus illi, <br>in sanctitáte et iustítia coram ipso  <br>ómnibus diébus nostris. <br>Et tu, puer, <br>prophéta Altíssimi vocáberis:  <br>præíbis enim ante fáciem Dómini <br>paráre vias eius, <br>ad dandam sciéntiam salútis <br>plebi eius <br>in remissiónem peccatórum eórum, <br>per víscera misericórdiæ Dei nostri, <br>in quibus visitábit nos óriens ex alto, <br>illumináre his, qui in ténebris <br>et in umbra mortis sedent, <br>ad dirigéndos pedes nostros <br>in viam pacis. <br>Glória Patri et Fílio <br>et Spirítui Sancto. <br>Sicut erat in princípio <br>et nunc et semper, <br>et in sæcula sæculórum. <br>Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='te_deum'>");
sommaire = sommaire.concat("<li><a href='#te_deum'>Te Deum</a></li>");

texte_final = texte_final.concat("<h2> Te Deum </h2>");
texte_final = texte_final.concat("À Dieu, notre louange! <br>Seigneur, nous te glorifions <br>À toi, Père éternel, <br>la terre entière te vénère. <br>À toi les anges <br>Et toutes les puissances d’en haut <br>À toi tous les esprits bienheureux <br>Redisent sans cesse : <br>Saint! Saint! Saint! <br>Le Seigneur, Dieu de l’univers; <br>le ciel et la terre <br>sont remplis de ta gloire. <br>Le chœur glorieux des Apôtres, <br>les prophètes, <br>l’armée des martyrs chante ta gloire; <br>Par toute la terre, <br>la Sainte Église confesse, <br>Ô Père, ton infinie majesté; <br>Ton adorable et unique vrai Fils; <br>Avec le Saint-Esprit Consolateur. <br>Ô Christ, tu es le Roi de gloire. <br>Tu es le Fils éternel du Père. <br>Pour libérer l’humanité, <br>tu t’es fait homme, <br>ne dédaignant pas le corps de la Vierge. <br>Toi, Vainqueur de la mort, <br>tu ouvres aux croyants le Royaume <br>des cieux; <br>Tu sièges à la droite de Dieu, <br>Dans la gloire du Père. <br>Nous croyons que tu es le juge qui <br>doit venir. <br>Daigne alors secourir <br>tes serviteurs que tu as rachetés <br>par ton précieux sang. <br>Fais qu’ils soient au nombre de tes saints, <br>dans la gloire éternelle. <br>Sauve ton peuple, Seigneur, et bénis <br>ton héritage. <br>Sois leur guide et conduis-les sur le chemin <br>d’éternité. <br>Chaque jour, nous te bénissons <br>Nous louons ton nom <br>à jamais, et dans les siècles des siècles. <br>Daigne, Seigneur, <br>veiller sur nous et nous garder de <br>tout péché. <br>Aie pitié de nous, Seigneur, <br>aie pitié de nous. <br>Que ta miséricorde, <br>Seigneur, soit sur nous, <br>puisque tu es notre espoir. <br>Tu es, Seigneur, mon espérance; <br>jamais je ne serai déçu.");
texte_final = texte_final.concat("<h2> Te Deum (latin) </h2>");
texte_final = texte_final.concat("Te Deum laudámus, <br>te Dóminum confitémur. <br>Te ætérnum Patrem, <br>omnis terra venerátur. <br>Tibi omnes ángeli, <br>tibi cæli et univérsæ potestátes: <br>Tibi chérubim et séraphim <br>incessábili voce proclámant: <br>Sanctus, Sanctus, Sanctus,<br>Dóminus Deus Sábaoth. <br>Pleni sunt cæli et terra <br>maiestátis glóriæ tuæ. <br>Te gloriósus apostolórum chorus, <br>te prophetárum laudábilis númerus, <br>te mártyrum candidátus <br>laudat exércitus. <br>Te per orbem terrárum <br>sancta confitétur Ecclésia, <br>Patrem imménsæ maiestátis; <br>venerándum tuum verum <br>et únicum Fílium; <br>Sanctum quoque Paráclitum Spíritum. <br>Tu rex glóriæ, Christe. <br>Tu Patris sempitérnus es Fílius. <br>Tu, ad liberándum susceptúrus <br>hóminem, <br>non horruísti Vírginis úterum. <br>Tu, devícto mortis acúleo, <br>aperuísti credéntibus regna cælórum. <br>Tu ad déxteram Dei sedes, <br>in glória Patris. <br>Iudex créderis esse ventúrus. <br>Te ergo quæ´sumus, <br>tuis fámulis súbveni, <br>quos pretióso sánguine redemísti. <br>Ætérna fac cum sanctis tuis <br>in glória numerári. <br>Salvum fac pópulum tuum, Dómine, et  <br>bénedic hereditáti tuæ. <br>Et rege eos, et extólle <br>illos usque in ætérnum. <br>Per síngulos dies benedícimus te; <br>et laudámus nomen tuum <br>in sæ´culum, et in sæ´culum sæ´ culi. <br>Dignáre, Dómine, <br>die isto sine peccáto nos custodíre.  <br>Miserére nostri, Dómine, <br>miserére nostri. <br>Fiat misericórdia tua, <br>Dómine, super nos, <br>quemádmodum sperávimus in te. <br>In te, Dómine, sperávi: <br>non confúndar in ætérnum.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='veni_creator'>");
sommaire = sommaire.concat("<li><a href='#veni_creator'>Veni Creator</a></li>");

texte_final = texte_final.concat("<h2> Veni Creator </h2>");
texte_final = texte_final.concat("Viens, Esprit Créateur, <br>Visite l’âme de tes fidèles, <br>Emplis de la grâce d’En-Haut <br>Les cœurs que tu as créés. <br>Toi qu’on nomme le Conseiller, <br>Don du Dieu Très-Haut, <br>Source vive, feu, charité, <br>Invisible consécration. <br>Tu es l’Esprit aux sept dons, <br>Le doigt de la main du Père,<br>L’Esprit de vérité promis par le Père, <br>C’est toi qui inspires nos paroles. <br>Allume en nous ta lumière, <br>Emplis d’amour nos cœurs, <br>Affermis toujours de ta force <br>La faiblesse de notre corps. <br>Repousse l’ennemi loin de nous, <br>Donne-nous ta paix sans retard, <br>Pour que, sous ta conduite et ton conseil, <br>Nous évitions tout mal et toute erreur. <br>Fais-nous connaître le Père, <br>Révèle-nous le Fils, <br>Et toi, leur commun Esprit, <br>Fais-nous toujours croire en toi. <br>Gloire soit à Dieu le Père, <br>au Fils ressuscité des morts, <br>à l’Esprit Saint Consolateur, <br>maintenant et dans tous les siècles. Amen.");
texte_final = texte_final.concat("<h2> Veni Creator Spiritus </h2>");
texte_final = texte_final.concat("Veni, creátor Spíritus, <br>Mentes tuórum vísita, <br>Imple supérna grátia <br>Quæ tu creásti péctora. <br>Qui díceris Paráclitus, <br>Altíssimi donum Dei, <br>Fons vivus, ignis, cáritas, <br>Et spiritális únctio. <br>Tu septifórmis múnere, <br>Dígitus patérnæ déxteræ, <br>Tu rite promíssum Patris, <br>Sermóne ditans gúttura. <br>Accénde lumen sénsibus, <br>Infúnde amórem córdibus, <br>Infírma nostri córporis <br>Virtúte firmans pérpeti. <br>Hostem repéllas lóngius, <br>Pacémque dones prótinus, <br>Ductóre sic te præ´vio <br>Vitémus omne nóxium. <br>Per Te sciámus da Patrem, <br>Noscámus atque Fílium, <br>Teque utriúsque Spíritum <br>Credámus omni témpore. <br>Deo Patri sit glória, <br>Et Fílio, qui a mórtuis <br>Surréxit, ac Paráclito, <br>In sæculórum sæ´cula. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='veni_sancte_spiritus'>");
sommaire = sommaire.concat("<li><a href='#veni_sancte_spiritus'>Veni, Sancte Spiritus</a></li>");

texte_final = texte_final.concat("<h2> Veni, Sancte Spiritus </h2>");
texte_final = texte_final.concat("Viens, Esprit Saint, <br>et envoie du haut du ciel <br>un rayon de ta lumière. <br>Viens, Père des pauvres, <br>viens, dispensateur des dons, <br>viens, lumière de nos cœurs. <br>Consolateur souverain, <br>hôte très doux de nos âmes, <br>adoucissante fraîcheur. <br>Dans le labeur, le repos; <br>dans la fièvre, la fraîcheur; <br>dans les pleurs, le réconfort. <br>Ô lumière bienheureuse, <br>viens remplir jusqu’à l’intime <br>le cœur de tous tes fidèles. <br>Sans ta puissance divine, <br>il n’est rien en aucun homme, <br>rien qui ne soit perverti. <br>Lave ce qui est souillé, <br>baigne ce qui est aride, <br>guéris ce qui est blessé. <br>Assouplis ce qui est raide, <br>réchauffe ce qui est froid, <br>rends droit ce qui est faussé. <br>À tous ceux qui ont la foi <br>et qui en toi se confient <br>donne tes sept dons sacrés. <br>Donne mérite et vertu, <br>donne le salut final, <br>donne la joie éternelle. Amen.");
texte_final = texte_final.concat("<h2> Veni, Sancte Spiritus (latin) </h2>");
texte_final = texte_final.concat("Veni, Sancte Spíritus, Et emítte cæ´ litus Lucis tuæ rádium. Veni, Pater páuperum, Veni, Dator múnerum, Veni, Lumen córdium. Consolátor óptime, Dulcis hospes ánimæ, Dulce refrigérium. In labóre réquies, In æstu tempéries, In fletu solátium. O lux beatíssima, Reple cordis íntima Tuórum fidélium. Sine tuo númine, Nihil est in hómine, Nihil est innóxium. Lava quod est sórdidum, Riga quod est áridum, Sana quod est sáucium. Flecte quod est rígidum, Fove quod est frígidum, Rege quod est dévium. Da tuis fidélibus In te confidéntibus Sacrum septenárium. Da virtútis méritum, Da salútis éxitum, Da perénne gáudium. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='ame_du_christ'>");
sommaire = sommaire.concat("<li><a href='#ame_du_christ'>Âme du Christ</a></li>");

texte_final = texte_final.concat("<h2> Âme du Christ </h2>");
texte_final = texte_final.concat("Âme du Christ, <br>sanctifie-moi. <br>Corps du Christ, <br>sauve-moi. <br>Sang du Christ, <br>enivre-moi. <br>Eau du côté du Christ, lave-moi. <br>Passion du Christ, fortifie-moi. <br>Ô bon Jésus, exauce-moi. <br>Dans tes blessures, cache-moi. <br>Ne permets pas que je sois séparé de toi. <br>De l’ennemi perfide, défends-moi. <br>À l’heure de ma mort, appelle-moi. Ordonne-moi de venir à toi, pour qu’avec tes Saints je te loue, toi, dans les siècles des siècles. Amen.");
texte_final = texte_final.concat("<h2> Anima Christi </h2>");
texte_final = texte_final.concat("Ánima Christi, sanctífica me.<br>Corpus Christi, salva me.<br>Sanguis Christi, inébria me.<br>Aqua láteris Christi, lava me.<br>Pássio Christi, confórta me.<br>O bone Iesu, exáudi me.<br>Intra tua vúlnera abscónde me.<br>Ne permíttas me separári a te.<br>Ab hoste malígno defénde me.<br>In hora mortis meæ voca me.<br>Et iube me veníre ad te,<br>ut cum Sanctis tuis laudem te<br>in sæ´cula sæculórum. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='souvenez_vous'>");
sommaire = sommaire.concat("<li><a href='#souvenez_vous'>Souvenez-vous</a></li>");

texte_final = texte_final.concat("<h2> Souvenez-vous </h2>");
texte_final = texte_final.concat("Souvenez-vous, ô très miséricordieuse<br>Vierge Marie, qu’on n’a jamais entendu dire<br>qu’aucun de ceux qui avaient eu recours à<br>votre protection, imploré votre assistance,<br>réclamé votre secours, ait été abandonné.<br>Animé d’une pareille confiance, ô Vierge<br>des vierges, ô ma Mère, je cours vers vous<br>et, gémissant sous le poids de mes péchés, je<br>me prosterne à vos pieds. Ô Mère du Verbe,<br>ne méprisez pas mes prières, mais accueillez-<br>les favorablement et daignez les exaucer.<br>Amen.");
texte_final = texte_final.concat("<h2> Memorare </h2>");
texte_final = texte_final.concat("Memoráre, O piíssima Virgo María, non<br>esse audítum a sæ´ culo, quemquam ad tua<br>curréntem præsídia, tua implorántem<br>auxília, tua peténtem suffrágia, esse<br>derelíctum. Ego tali animátus confidéntia,<br>ad te, Virgo Vírginum, Mater, curro, ad te<br>vénio, coram te gemens peccátor assisto.<br>Noli, Mater Verbi, verba mea despícere;<br>sed áudi propítia et exáudi. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='rosaire'>");
sommaire = sommaire.concat("<li><a href='#rosaire'>Rosaire</a></li>");

texte_final = texte_final.concat("<h2> Rosaire </h2>");
texte_final = texte_final.concat("Mystères joyeux. <br>(à réciter le lundi et le samedi)<br>L’Annonciation.<br>La Visitation.<br>La Nativité.<br>La Présentation de Jésus au Temple.<br>Recouvrement de Jésus au Temple.<br><br>Mystère lumineux<br>(à réciter le jeudi)<br>Le baptême de Jésus dans le Jourdain.<br>Les noces de Cana.<br>L’annonce du Royaume de Dieu.<br>La Transfiguration.<br>L’Institution de l’Eucharistie.<br><br>Mystères douloureux<br>(à réciter le mardi et le vendredi)<br>L’agonie de Jésus au Jardin des Oliviers.<br>La flagellation.<br>Le couronnement d’épines.<br>Jésus porte sa croix.<br>La mort de Jésus en croix.<br><br>Mystères glorieux<br>(à réciter le mercredi et le dimanche)<br>La Résurrection.<br>L’Ascension.<br>La Pentecôte.<br>L’Assomption.<br>Le couronnement de Marie.<br><br>Prière à la fin du Rosaire<br>D. Prie pour nous, Sainte Mère de Dieu.<br>C. Afin que nous soyons rendus dignes<br>des promesses du Christ.<br>Prions.<br>Ô Dieu, dont le Fils unique, par sa vie, sa<br>mort et sa résurrection, nous a acquis les<br>récompenses de la vie éternelle, fais, nous<br>t’en supplions, qu’en méditant ces mystères<br>du Rosaire de la Bienheureuse Vierge Marie,<br>nous puissions imiter ce qu’ils contiennent<br>et obtenir ce qu’ils promettent. Par Jésus<br>Christ, notre Seigneur. Amen.");
texte_final = texte_final.concat("<h2> Rosarium </h2>");
texte_final = texte_final.concat("Mystéria gaudiósa<br>(in feria secunda et sabbato)<br>Annuntiátio.<br>Visitátio.<br>Natívitas.<br>Præsentátio.<br>Invéntio in Templo.<br><br>Mystéria luminósa<br>(in feria quinta)<br>Baptísma apud Iordánem.<br>Autorevelátio apud Cananénse matrimónium.<br>Regni Dei proclamátio coniúncta cum invitaménto ad conversiónem.<br>Transfigurátio.<br>Eucharistíæ Institútio.<br><br>Mystéria dolorosa<br>(in feria tertia et feria sexta)<br>Agonía in Hortu.<br>Flagellátio.<br>Coronátio Spinis.<br>Baiulátio Crucis.<br>Crucifíxio et Mors.<br><br>Mysteria gloriosa<br>(in feria quarta et Dominica)<br>Resurréctio.<br>Ascénsio.<br>Descénsus Spíritus Sancti.<br>Assúmptio.<br>Coronátio in Cælo.<br><br>Oratio ad finem Rosarii dicenda<br>D. Ora pro nobis, sancta Dei génetrix.<br>C. Ut digni efficiámur<br>promissiónibus Christi.<br>Orémus.<br>Deus, cuius Unigénitus per vitam, mortem<br>et resurrectiónem suam nobis salútis<br>ætérnæ præ´mia comparávit, concéde,<br>quæ´sumus: ut hæc mystéria sacratíssimo<br>beátæ Maríæ Vírginis Rosário recoléntes,<br>et imitémur quod cóntinent, et quod<br>promíttunt assequámur. Per eúmdem<br>Christum Dóminum nostrum. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='priere_encens'>");
sommaire = sommaire.concat("<li><a href='#priere_encens'>Prière de l’Encens</a></li>");

texte_final = texte_final.concat("<h2> Prière de l’Encens </h2>");
texte_final = texte_final.concat("<i>(Tradition copte)</i><br>Ô Roi de la paix, donne-nous ta paix et pardonne nos péchés.<br> Éloigne les ennemis de l’Église et garde-la, afin qu’elle ne défaille pas.<br>L’Emmanuel notre Dieu est au milieu de nous dans la gloire du Père et de l’Esprit Saint.<br> Qu’il nous bénisse, qu’il purifie notre coeur et qu’il guérisse les maladies de l’âme et du corps.<br> Nous t’adorons, ô Christ, avec ton Père de bonté et avec l’Esprit Saint, parce que tu es venu et parce que tu nous as sauvés.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='adieuautel'>");
sommaire = sommaire.concat("<li><a href='#adieuautel'>Prière de « l’Adieu à l’Autel »</a></li>");

texte_final = texte_final.concat("<h2> Prière de « l’Adieu à l’Autel » </h2>");
texte_final = texte_final.concat("<i>(Tradition Syro-Maronite)</i><br>Sois en paix, Autel de Dieu.<br> Puisse l’oblation que je t’ai prise servir à la rémission des dettes et au pardon des péchés.<br> Qu’elle m’obtienne de me tenir devant le tribunal du Christ sans damnation et sans confusion.<br> Je ne sais pas s’il me sera donné de revenir offrir sur toi un autre Sacrifice.<br> Protège-moi, Seigneur, et garde ton Église, qui est chemin de vérité et de salut.<br> Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='prieredefunts'>");
sommaire = sommaire.concat("<li><a href='#prieredefunts'>Prière pour les défunts</a></li>");

texte_final = texte_final.concat("<h2> Prière pour les défunts </h2>");
texte_final = texte_final.concat("(Tradition Byzantine)<br>Dieu des esprits et de toute chair, qui a foulé au pied la mort, qui a réduit le diable à néant et qui a donné ta vie au monde;<br> Donne toi-même, Seigneur, à l’âme de ton serviteur défunt <i>N.</i> le repos dans un lieu lumineux, verdoyant et frais, loin de la souffrance, de la douleur et des gémissements. <br>Que le Dieu bon et miséricordieux lui pardonne tous ses péchés commis en parole, par action et en pensée. Parce qu’il n’existe pas d’homme qui vive et qui ne pèche pas; toi seul es sans péché, ta justice est justice pour les siècles et ta Parole est vérité. <br>Ô Christ notre Dieu, puisque tu es la Résurrection, la vie et le repos de ton serviteur défunt <i>N.</i>, nous te rendons grâce <br>avec ton Père incréé et avec ton Esprit très <br>saint, bon et vivifiant, aujourd’hui et pour les  <br>siècles des siècles. Amen. <br>Qu’ils reposent en paix.<br> Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='actefoi'>");
sommaire = sommaire.concat("<li><a href='#actefoi'>Acte de Foi</a></li>");

texte_final = texte_final.concat("<h2> Acte de Foi </h2>");
texte_final = texte_final.concat("Mon Dieu,<br> je crois fermement toutes les vérités<br> que vous m’avez révélées<br> et que vous ous enseignez par votre sainte Église,<br> parce que vous ne pouvez ni vous tromper, ni nous tromper.<br>Dans cette foi, puis-je vivre et mourir.<br>Amen.");
texte_final = texte_final.concat("<h2> Actus Fidei </h2>");
texte_final = texte_final.concat("Dómine Deus,<br> firma fide credo et confíteor ómnia et síngula quæ<br> sancta Ecclésia Cathólica propónit,<br> quia tu, Deus, ea ómnia revelásti,<br> qui es ætérna véritas et sapiéntia quæ nec fállere nec falli potest.<br>In hac fide vívere et mori státuo.<br> Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='acteesperance'>");
sommaire = sommaire.concat("<li><a href='#acteesperance'>Acte d’Espérance</a></li>");

texte_final = texte_final.concat("<h2> Acte d’Espérance </h2>");
texte_final = texte_final.concat("Mon Dieu,<br> j’espère avec une ferme confiance que vous me donnerez, <br> par les mérites de Jésus-Christ, votre grâce en ce monde<br> et le bonheur éternel dans l’autre,<br> parce que vous l’avez promis<br> et que vous tenez toujours vos promesses.<br>Dans cette foi, puis-je vivre et mourir.<br>Amen.");
texte_final = texte_final.concat("<h2> Actus Spei </h2>");
texte_final = texte_final.concat("Dómine Deus,<br> spero per grátiam tuam remissiónem ómnium peccatórum,<br> et post hanc vitam ætérnam felicitátem me esse consecutúrum:<br> quia tu promisísti,<br> qui es infiníte potens, fidélis, benígnus, et miséricors.<br>In hac spe vívere et mori státuo.<br>Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='actecharite'>");
sommaire = sommaire.concat("<li><a href='#actecharite'>Acte de Charité</a></li>");

texte_final = texte_final.concat("<h2> Acte de Charité </h2>");
texte_final = texte_final.concat("Mon Dieu,<br> je vous aime de tout mon coeur et plus que tout,<br> parce que vous êtes infiniment bon,<br> et j’aime mon prochain comme moi-même<br>pour l’amour de vous.");
texte_final = texte_final.concat("<h2> Actus Caritatis </h2>");
texte_final = texte_final.concat("Dómine Deus,<br> amo te super ómnia<br> et próximum meum propter te,<br> quia tu es summum, infinítum, et perfectíssimum bonum,<br> omni dilectióne dignum.<br> In hac caritáte vívere et mori státuo. Amen.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='actecontrition'>");
sommaire = sommaire.concat("<li><a href='#actecontrition'>Acte de Contrition</a></li>");

texte_final = texte_final.concat("<h2> Acte de Contrition </h2>");
texte_final = texte_final.concat("Mon Dieu,<br> j’ai un très grand regret de vous avoir offensé <br>parce que vous êtes infiniment bon<br> et que le péché vous déplaît. <br>Je prends la ferme résolution, <br>avec le secours de votresainte grâce, <br>de ne plus vous offenser <br>et de faire pénitence.");
texte_final = texte_final.concat("<h2> Actus Contritionis </h2>");
texte_final = texte_final.concat("Deus meus, ex toto corde pænitet me ómnium meórum peccatórum,<br> eáque detéstor, quia peccándo, <br>non solum poenas a te iuste statútas proméritus sum,<br> sed præsértim<br> quia offéndi te, summum bonum,<br>ac dignum qui super ómnia diligáris.<br> Ídeo fírmiter propóno, adiuvánte grátia tua,<br> de cétero me non peccatúrum peccandíque occasiónes próximas fugitúrum. Amen.");

texte_final = texte_final.concat("</div>");



  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
}


function update_office_formulesdoctrinales(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Formules doctrinales</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='commandementscharite' style='margin-top: 0px;'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
sommaire = sommaire.concat("<li><a href='#commandementscharite'>Les deux commandements de la charité</a></li>");

texte_final = texte_final.concat("<h2> Les deux commandements de la charité </h2>");
texte_final = texte_final.concat("1. Tu aimeras le Seigneur ton Dieu de tout ton cœur, de toute ton âme et de tout ton esprit.<br>2. Tu aimeras ton prochain comme toi-même.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regleor'>");
sommaire = sommaire.concat("<li><a href='#regleor'>La règle d’or</a></li>");

texte_final = texte_final.concat("<h2> La règle d’or (Mt 7,12) </h2>");
texte_final = texte_final.concat("Tout ce que vous désirez que les autres fassent pour vous, faites-le vous-mêmes pour eux.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='beatitudes'>");
sommaire = sommaire.concat("<li><a href='#beatitudes'>Les Béatitudes</a></li>");

texte_final = texte_final.concat("<h2> Les Béatitudes <i>(Mt 5,3-12)</i> </h2>");
texte_final = texte_final.concat("Heureux les pauvres de cœur : le Royaume des cieux est à eux !<br>Heureux les doux : ils obtiendront la terre promise !<br>Heureux ceux qui pleurent : ils seront consolés !<br>Heureux ceux qui ont faim et soif de la justice : ils seront rassasiés !<br>Heureux les miséricordieux : ils obtiendront miséricorde !<br>Heureux les cœurs purs : ils verront Dieu !<br>Heureux les artisans de paix : ils seront appelés fils de Dieu !<br>Heureux ceux qui sont persécutés pour la justice : le Royaume des cieux est à eux !<br>Heureux serez-vous si l’on vous insulte, si l’on vous persécute et si l’on dit faussement toute sorte de mal contre vous, à cause de moi.<br>Réjouissez-vous, soyez dans l’allégresse, car votre récompense sera grande dans les cieux !");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='vertustheologales'>");
sommaire = sommaire.concat("<li><a href='#vertustheologales'>Les trois vertus théologales</a></li>");

texte_final = texte_final.concat("<h2> Les trois vertus théologales </h2>");
texte_final = texte_final.concat("1. Foi.<br>2. Espérance.<br>3. Charité.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='vertuscardinales'>");
sommaire = sommaire.concat("<li><a href='#vertuscardinales'>Les quatre vertus cardinales</a></li>");

texte_final = texte_final.concat("<h2> Les quatre vertus cardinales </h2>");
texte_final = texte_final.concat("1. Prudence.<br>2. Justice.<br>3. Force.<br>4. Tempérance.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='donsse'>");
sommaire = sommaire.concat("<li><a href='#donsse'>Les sept dons du Saint-Esprit</a></li>");

texte_final = texte_final.concat("<h2> Les sept dons du Saint-Esprit </h2>");
texte_final = texte_final.concat("1. Sagesse.<br>2. Intelligence.<br>3. Conseil.<br>4. Force.<br>5. Science.<br>6. Piété.<br>7. Crainte de Dieu.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='fruitsse'>");
sommaire = sommaire.concat("<li><a href='#fruitsse'>Les douze fruits du Saint-Esprit</a></li>");

texte_final = texte_final.concat("<h2> Les douze fruits du Saint-Esprit </h2>");
texte_final = texte_final.concat("1. Charité.<br>2. Joie.<br>3. Paix.<br>4. Patience.<br>5. Longanimité.<br>6. Bonté.<br>7. Bénignité.<br>8. Mansuétude.<br>9. Modestie.<br>10. Continence.<br>11. Chasteté.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='precepteseglise'>");
sommaire = sommaire.concat("<li><a href='#precepteseglise'>Les cinq préceptes de l’Église</a></li>");

texte_final = texte_final.concat("<h2> Les cinq préceptes de l’Église </h2>");
texte_final = texte_final.concat("1. Participer à l’Eucharistie dominicale et aux autres fêtes d’obligation et s’abstenir des travaux et des activités qui pourraient empêcher la sanctification de tels jours.<br>2. Confesser ses péchés au moins une fois par an.<br>3. Recevoir le Sacrement de l’Eucharistie au moins à Pâques.<br>4. S’abstenir de manger de la viande et observer le jeûne durant les jours établis par l’Église.<br>5. Subvenir aux besoins matériels de l’Église, selon ses possibilités.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='misericordecorporelle'>");
sommaire = sommaire.concat("<li><a href='#misericordecorporelle'>Les sept œuvres de miséricorde corporelle</a></li>");

texte_final = texte_final.concat("<h2> Les sept œuvres de miséricorde corporelle </h2>");
texte_final = texte_final.concat("1. Donner à manger à ceux qui ont faim.<br>2. Donner à boire à ceux qui ont soif.<br>3. Vêtir ceux qui sont nus.<br>4. Loger les pèlerins.<br>5. Visiter les malades.<br>6. Visiter les prisonniers.<br>7. Ensevelir les morts.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='misericordespirituelle'>");
sommaire = sommaire.concat("<li><a href='#misericordespirituelle'>Les sept œuvres de miséricorde spirituelle</a></li>");

texte_final = texte_final.concat("<h2> Les sept œuvres de miséricorde spirituelle </h2>");
texte_final = texte_final.concat("1. Conseiller ceux qui doutent.<br>2. Enseigner ceux qui sont ignorants.<br>3. Réprimander les pécheurs.<br>4. Consoler les affligés.<br>5. Pardonner les offenses.<br>6. Supporter patiemment les personnes importunes.<br>7. Prier Dieu pour les vivants et pour les morts.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='pechescapitaux'>");
sommaire = sommaire.concat("<li><a href='#pechescapitaux'>Les sept péchés capitaux</a></li>");

texte_final = texte_final.concat("<h2> Les sept péchés capitaux </h2>");
texte_final = texte_final.concat("1. Orgueil.<br>2. Avarice.<br>3. Envie.<br>4. Colère.<br>5. Impureté.<br>6. Gourmandise.<br>7. Paresse ou acédie.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='finsdernieres'>");
sommaire = sommaire.concat("<li><a href='#finsdernieres'>Les quatre fins de l’homme</a></li>");

texte_final = texte_final.concat("<h2> Les quatre fins de l’homme </h2>");
texte_final = texte_final.concat("1. Mort.<br>2. Jugement.<br>3. Enfer.<br>4. Paradis.");

texte_final = texte_final.concat("</div>");




  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
}

function update_office_prieresop(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Prières de l'Ordre des Prêcheurs</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='commandementscharite' style='margin-top: 0px;'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
sommaire = sommaire.concat("<li><a href='#commandementscharite'>Les deux commandements de la charité</a></li>");

texte_final = texte_final.concat("<h2> Les deux commandements de la charité </h2>");
texte_final = texte_final.concat("1. Tu aimeras le Seigneur ton Dieu de tout ton cœur, de toute ton âme et de tout ton esprit.<br>2. Tu aimeras ton prochain comme toi-même.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regleor'>");
sommaire = sommaire.concat("<li><a href='#regleor'>La règle d’or</a></li>");

texte_final = texte_final.concat("<h2> La règle d’or (Mt 7,12) </h2>");
texte_final = texte_final.concat("Tout ce que vous désirez que les autres fassent pour vous, faites-le vous-mêmes pour eux.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='beatitudes'>");
sommaire = sommaire.concat("<li><a href='#beatitudes'>Les Béatitudes</a></li>");

texte_final = texte_final.concat("<h2> Les Béatitudes <i>(Mt 5,3-12)</i> </h2>");
texte_final = texte_final.concat("Heureux les pauvres de cœur : le Royaume des cieux est à eux !<br>Heureux les doux : ils obtiendront la terre promise !<br>Heureux ceux qui pleurent : ils seront consolés !<br>Heureux ceux qui ont faim et soif de la justice : ils seront rassasiés !<br>Heureux les miséricordieux : ils obtiendront miséricorde !<br>Heureux les cœurs purs : ils verront Dieu !<br>Heureux les artisans de paix : ils seront appelés fils de Dieu !<br>Heureux ceux qui sont persécutés pour la justice : le Royaume des cieux est à eux !<br>Heureux serez-vous si l’on vous insulte, si l’on vous persécute et si l’on dit faussement toute sorte de mal contre vous, à cause de moi.<br>Réjouissez-vous, soyez dans l’allégresse, car votre récompense sera grande dans les cieux !");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='vertustheologales'>");
sommaire = sommaire.concat("<li><a href='#vertustheologales'>Les trois vertus théologales</a></li>");

texte_final = texte_final.concat("<h2> Les trois vertus théologales </h2>");
texte_final = texte_final.concat("1. Foi.<br>2. Espérance.<br>3. Charité.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='vertuscardinales'>");
sommaire = sommaire.concat("<li><a href='#vertuscardinales'>Les quatre vertus cardinales</a></li>");

texte_final = texte_final.concat("<h2> Les quatre vertus cardinales </h2>");
texte_final = texte_final.concat("1. Prudence.<br>2. Justice.<br>3. Force.<br>4. Tempérance.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='donsse'>");
sommaire = sommaire.concat("<li><a href='#donsse'>Les sept dons du Saint-Esprit</a></li>");

texte_final = texte_final.concat("<h2> Les sept dons du Saint-Esprit </h2>");
texte_final = texte_final.concat("1. Sagesse.<br>2. Intelligence.<br>3. Conseil.<br>4. Force.<br>5. Science.<br>6. Piété.<br>7. Crainte de Dieu.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='fruitsse'>");
sommaire = sommaire.concat("<li><a href='#fruitsse'>Les douze fruits du Saint-Esprit</a></li>");

texte_final = texte_final.concat("<h2> Les douze fruits du Saint-Esprit </h2>");
texte_final = texte_final.concat("1. Charité.<br>2. Joie.<br>3. Paix.<br>4. Patience.<br>5. Longanimité.<br>6. Bonté.<br>7. Bénignité.<br>8. Mansuétude.<br>9. Modestie.<br>10. Continence.<br>11. Chasteté.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='precepteseglise'>");
sommaire = sommaire.concat("<li><a href='#precepteseglise'>Les cinq préceptes de l’Église</a></li>");

texte_final = texte_final.concat("<h2> Les cinq préceptes de l’Église </h2>");
texte_final = texte_final.concat("1. Participer à l’Eucharistie dominicale et aux autres fêtes d’obligation et s’abstenir des travaux et des activités qui pourraient empêcher la sanctification de tels jours.<br>2. Confesser ses péchés au moins une fois par an.<br>3. Recevoir le Sacrement de l’Eucharistie au moins à Pâques.<br>4. S’abstenir de manger de la viande et observer le jeûne durant les jours établis par l’Église.<br>5. Subvenir aux besoins matériels de l’Église, selon ses possibilités.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='misericordecorporelle'>");
sommaire = sommaire.concat("<li><a href='#misericordecorporelle'>Les sept œuvres de miséricorde corporelle</a></li>");

texte_final = texte_final.concat("<h2> Les sept œuvres de miséricorde corporelle </h2>");
texte_final = texte_final.concat("1. Donner à manger à ceux qui ont faim.<br>2. Donner à boire à ceux qui ont soif.<br>3. Vêtir ceux qui sont nus.<br>4. Loger les pèlerins.<br>5. Visiter les malades.<br>6. Visiter les prisonniers.<br>7. Ensevelir les morts.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='misericordespirituelle'>");
sommaire = sommaire.concat("<li><a href='#misericordespirituelle'>Les sept œuvres de miséricorde spirituelle</a></li>");

texte_final = texte_final.concat("<h2> Les sept œuvres de miséricorde spirituelle </h2>");
texte_final = texte_final.concat("1. Conseiller ceux qui doutent.<br>2. Enseigner ceux qui sont ignorants.<br>3. Réprimander les pécheurs.<br>4. Consoler les affligés.<br>5. Pardonner les offenses.<br>6. Supporter patiemment les personnes importunes.<br>7. Prier Dieu pour les vivants et pour les morts.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='pechescapitaux'>");
sommaire = sommaire.concat("<li><a href='#pechescapitaux'>Les sept péchés capitaux</a></li>");

texte_final = texte_final.concat("<h2> Les sept péchés capitaux </h2>");
texte_final = texte_final.concat("1. Orgueil.<br>2. Avarice.<br>3. Envie.<br>4. Colère.<br>5. Impureté.<br>6. Gourmandise.<br>7. Paresse ou acédie.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='finsdernieres'>");
sommaire = sommaire.concat("<li><a href='#finsdernieres'>Les quatre fins de l’homme</a></li>");

texte_final = texte_final.concat("<h2> Les quatre fins de l’homme </h2>");
texte_final = texte_final.concat("1. Mort.<br>2. Jugement.<br>3. Enfer.<br>4. Paradis.");

texte_final = texte_final.concat("</div>");




  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
}


function update_office_regleaugustin(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Règle de saint Augustin</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='augustin1' style='margin-top: 0px;'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
  sommaire = sommaire.concat("<li><a href='#augustin1'>Chapitre 1</a></li>");

// texte_final = texte_final.concat("<div class='text_part' id='regle_saint_augustin_introduction'>");
// sommaire = sommaire.concat("<li><a href='#regle_saint_augustin_introduction'>Introduction</a></li>");

texte_final = texte_final.concat("<h2>Règle de saint Augustin</h2>");
texte_final = texte_final.concat("<i>Commencement de la Règle du bienheureux Augustin, évêque.</i>");

texte_final = texte_final.concat("</div>");

// texte_final = texte_final.concat("<div class='text_part' id='augustin1'>");
// sommaire = sommaire.concat("<li><a href='#augustin1'>Chapitre 1</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 1</h2>");
texte_final = texte_final.concat("<p>1. Avant tout, frères très chers, aimons Dieu, aimons le prochain : ce sont les commandements qui nous sont donnés en premier<sup>[2]</sup>. Et voici les prescriptions sur votre manière de vivre dans le monastère.</p>");
texte_final = texte_final.concat("<p>Tout d’abord, pourquoi êtes-vous réunis<sup>[3]</sup> sinon pour habiter ensemble dans l’unanimité<sup>[4]</sup>, ne faisant <i>qu’un cœur et qu’une âme</i><sup>[5]</sup> en Dieu. Ne dîtes pas « ceci m’appartient » ; mais que, pour vous, tout soit en commun<sup>[6]</sup>. Que votre supérieur distribue à chacun<sup>[7]</sup> <i>le vivre et le couv</i>rt</i><sup>[8]</sup> non pas selon un principe d’égalité – ni vos forces, ni vos santés ne sont égales – mais bien plutôt selon les besoins de chacun<sup>[9]</sup>. Lisez en effet les Actes des Apôtres : <i>Pour eux tout était en commun et l’on distribuait à chacun selon son besoin</i><sup>[10]</sup>.</p>");
texte_final = texte_final.concat("<p>Ceux qui possédaient quelque chose quand ils sont entrés au monastère doivent accepter volontiers que tout cela soit désormais commun. Ceux qui n’avaient rien n’ont pas à chercher dans le monastère ce qu’au dehors ils n’avaient pu posséder. Qu’on leur donne toutefois ce que requiert leur mauvaise santé, même si auparavant leur pauvreté les empêchait de se procurer le nécessaire. Mais alors qu’ils ne se félicitent pas d’avoir trouvé vivre et couvert<sup>[11]</sup> qu’ils n’auraient pu trouver tels au dehors !</p>");
texte_final = texte_final.concat("<p>Qu’ils n’aillent pas orgueilleusement, tête haute<sup>[12]</sup>, parce qu’ils ont désormais pour compagnons des gens qu’auparavant ils n’auraient pas osé approcher : que leur cœur plutôt s’élève<sup>[13]</sup>, sans chercher les vanités de la terre<sup>[14]</sup>. Les monastères n’auraient d’utilité que pour les riches et non pour les pauvres, s’ils devenaient lieu d’humble abaissement pour les premiers, d’enflure pour les autres<sup>[15]</sup>.</p>");
texte_final = texte_final.concat("<p>De leur côté ceux qui étaient antérieurement des gens considérés<sup>[16]</sup> ne seront pas dédaigneux à l’égard de leurs frères venus de la pauvreté dans cette société sainte. S’ils cherchent à se glorifier, que ce ne soit pas de la richesse et du prestige de leur parenté, mais bien plutôt d’habiter en compagnie de frères pauvres. Qu’ils ne se vantent pas d’avoir tant soit peu contribué de leur fortune<sup>[17]</sup> à la vie commune ; avoir distribué leurs richesses dans le monastère ne devrait pas leur causer plus d’orgueil que d’en vivre dans le monde. Tout autre vice se déploie en faisant faire le mal ; mais l’orgueil, lui, s’attaque même au bien que l’on fait, pour le réduire à néant. A quoi sert de distribuer ses biens aux pauvres<sup>[18]</sup>, de se faire pauvre soi-même, si l’âme dans sa misère devient plus orgueilleuse de mépriser les richesses que de les posséder ? Vivez donc tous dans l’unanimité<sup>[19]</sup> et la concorde et honorez mutuellement en vous, Dieu dont vous avez été faits les temples<sup>[20]</sup>.</p>");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='augustin2'>");
sommaire = sommaire.concat("<li><a href='#augustin2'>Chapitre 2</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 2</h2>");
texte_final = texte_final.concat("<p>2. <i>Soyez assidus aux prières</i><sup>[21]</sup>, aux heures et aux temps fixés. Puisque l’oratoire est par définition un lieu de prière, qu’on n’y fasse pas autre chose. Si l’un ou l’autre, en dehors des heures fixées, veut profiter de son loisir pour y prier, qu’il n’en soit pas empêché par ce que l’on y prétendrait faire. Quand vous priez Dieu avec des psaumes et des hymnes<sup>[22]</sup>, portez dans votre cœur ce que profèrent vos lèvres<sup>[23]</sup>. Ne chantez que ce qui est prescrit ; ce qui n’est pas indiqué pour être chanté ne doit pas être chanté.</p>");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='augustin3'>");
sommaire = sommaire.concat("<li><a href='#augustin3'>Chapitre 3</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 3</h2>");
texte_final = texte_final.concat("<p>3. Domptez votre chair par le jeûne et l’abstinence dans la nourriture et la boisson, autant que la santé le permet. Celui qui ne peut pas jeûner doit à tout le moins ne pas prendre de nourriture en dehors de l’heure des repas, sauf en cas de maladie. A table, jusqu’à la fin du repas, écoutez la lecture d’usage sans bruit et sans discussions. Que votre bouche ne soit pas seule à prendre nourriture ; que vos oreilles aussi aient faim de la parole de Dieu<sup>[24]</sup>.</p>");
texte_final = texte_final.concat("<p>Affaiblis par leur ancienne manière de vivre, certains peuvent avoir un régime spécial ; ceux que d’autres habitudes ont rendus plus robustes, ne doivent pas s’en chagriner ni voir là une injustice. Qu’ils n’estiment pas ceux-ci plus heureux de recevoir ce qu’eux-mêmes ne reçoivent pas ; qu’ils se félicitent plutôt d’avoir plus de force physique que les autres. Si ceux qui sont passés d’une vie plus raffinée au monastère reçoivent en fait de nourriture, de vêtements et de couvertures, un peu plus que les autres, plus vigoureux et donc plus heureux, ces derniers doivent songer à la différence de niveau qui sépare la vie mondaine que leurs compagnons ont quittée et celle du monastère, lors même qu’ils n’arrivent pas à la frugalité des plus robustes. Tous ne doivent pas réclamer le supplément accordé à quelques-uns, non comme marque d’honneur mais par condescendance. Ce serait vraiment un lamentable renversement des choses si dans un monastère, où les riches font tous les efforts possibles, les pauvres devenaient des délicats.</p>");
texte_final = texte_final.concat("<p>On donne moins aux malades pour ne pas les charger. Aussi doivent-ils être spécialement traités ensuite pour se rétablir plus rapidement, fussent-ils originaires de la plus humble condition ; leur récente maladie leur laisse les mêmes besoins qu’aux riches leur genre de vie antérieur. Une fois leurs forces réparées, qu’ils reviennent à leur plus heureuse façon de vivre, celle qui convient d’autant mieux à des serviteurs de Dieu qu’ils ont moins de besoins. Redevenus bien portants qu’ils ne s’attachent pas par mollesse à ce que la maladie avait rendu nécessaire. Qu’ils estiment plus favorisés ceux qui ont été plus vaillants dans le support des privations. Mieux vaut en effet moins de besoins que plus de biens.</p>");
texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='augustin4'>");
sommaire = sommaire.concat("<li><a href='#augustin44'>Chapitre 4</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 4</h2>");
texte_final = texte_final.concat("<p>4. Pas de singularités dans votre tenue ; ne cherchez pas à plaire par vos vêtements, mais par votre manière de vivre. Si vous sortez, marchez ensemble ; à l’arrivée, restez ensemble. Dans votre démarche, votre maintien, tous vos gestes, n’offensez le regard de personne ; mais que tout s’accorde avec la sainteté de votre état.</p>");
texte_final = texte_final.concat("<p>Que votre regard ne se fixe sur aucune femme. En vos allées et venues, il ne vous est pas défendu de voir des femmes ; ce qui est coupable, c’est le désir que l’on accepte en soi, ou que l’on voudrait provoquer chez autrui. La convoitise s’éprouve et se provoque non seulement par un sentiment secret, mais aussi par ce que l’on manifeste. Ne dites pas : mon cœur est chaste, si vos yeux ne le sont pas. L’œil impudique dénonce le cœur impudique<sup>[25]</sup>. Quand, même sans paroles, l’échange des regards dénonce l’impureté des cœurs, chacun se complaisant en l’autre selon la concupiscence de la chair<sup>[26]</sup>, les corps ont beau demeurer intacts de toute souillure, la chasteté, quant à elle, est en fuite. Celui qui fixe ses regards sur une femme et se complaît à se savoir regardé par elle ne doit pas s’imaginer qu’on ne le voit pas lorsqu’il agit ainsi : il est parfaitement vu de ceux dont il ne se doute pas.</p>");
texte_final = texte_final.concat("<p>Mais passerait-il inaperçu et ne serait-il vu de personne, que fait-il de celui qui d’en haut lit dans les cœurs<sup>[27]</sup>, à qui rien ne peut échapper ? Doit-on croire qu’il ne le voit pas, parce que sa patience est aussi grande que sa perspicacité ? Que l’homme consacré craigne donc de Lui déplaire<sup>[28]</sup> et il ne cherchera pas à plaire coupablement à une femme. Qu’il songe que Dieu voit tout et il ne cherchera pas à regarder coupablement une femme. Car c’est précisément en cela que la crainte de Dieu est recommandée par l’Écriture : <i>qui fixe son regard est en abomination au Seigneur</i><sup>[29]</sup>.</p>");
texte_final = texte_final.concat("<p>Quand donc vous êtes ensemble, à l’église, et partout où il y a des femmes, veillez mutuellement sur votre chasteté ; car Dieu qui habite en vous<sup>[30]</sup>, par ce moyen veillera<sup>[31]</sup> par vous sur vous.</p>");
texte_final = texte_final.concat("<p>Si vous remarquez chez l’un d’entre vous cette effronterie du regard dont je parle, avertissez-le tout de suite, pour empêcher le progrès du mal et amener un amendement immédiat. Mais si après cet avertissement, ou un autre jour, vous le voyez recommencer, c’est comme un blessé à guérir qu’il convient de le dénoncer. Toutefois, prévenez d’abord un ou deux autres<sup>[32]</sup> pour qu’on puisse le convaincre par le témoignage de deux ou trois<sup>[33]</sup> et le punir ensuite avec la sévérité qui convient.</p>");
texte_final = texte_final.concat("<p>Ne vous taxez pas vous-mêmes de malveillance, à dénoncer ainsi. Bien au contraire, vous ne seriez pas sans reproches, si vos frères, que votre dénonciation pourrait corriger, se trouvaient par votre silence abandonnés à leur perte. Si, par exemple, ton frère voulait cacher une plaie corporelle par crainte des soins, n’y aurait-il pas cruauté à te taire et miséricorde à parler<sup>[34]</sup> ? Combien plus justement dois-tu le dénoncer, pour que n’empire pas la plaie de son cœur.</p>");
texte_final = texte_final.concat("<p>Cependant, avant d’en informer d’autres pour le confondre en ses dénégations, c’est d’abord au supérieur qu’il faut le signaler, si malgré l’avertissement déjà reçu, il ne s’est pas soucié de s’amender ; une réprimande plus secrète pourrait éviter en effet que d’autres soient mis au courant. S’il nie, c’est alors qu’il faut lui opposer d’autres témoins ; ainsi, devant tous il ne sera pas seulement inculpé<sup>[35]</sup> par un seul, mais confondu par deux ou trois<sup>[36]</sup>. Une fois confondu, selon la décision du supérieur ou du prêtre auquel en revient le pouvoir, il doit se soumettre à une sanction salutaire. S’il la refuse, ne voudrait-il pas de lui-même se retirer, qu’il soit exclu de votre communauté. Ici encore ce n’est pas cruauté mais miséricorde<sup>[37]</sup>, pour éviter une funeste contagion qui en perdrait un plus grand nombre.</p>");
texte_final = texte_final.concat("<p>Ce que j’ai dit des regards trop appuyés, doit être de même soigneusement et fidèlement observé pour toute autre faute à découvrir, prévenir, dénoncer, confondre et punir, la haine des vices s’y associant à l’affection pour les personnes. D’autre part, on peut être avancé dans le mal jusqu’à recevoir de quelqu’un lettres ou cadeaux. A celui qui s’en accuse, on pardonnera et on priera pour lui ; celui qui sera pris sur le fait et convaincu, sera plus sévèrement puni selon la décision du prêtre ou du supérieur.</p>");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regle_saint_augustin_chapitre5'>");
sommaire = sommaire.concat("<li><a href='#regle_saint_augustin_chapitre5'>Chapitre 5</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 5</h2>");
texte_final = texte_final.concat("<p>5. Laissez vos vêtements sous la garde d’une personne ou deux, ou d’autant qu’il en faudra pour les secouer et les défendre contre les mites. De même qu’une seule nourriture vous nourrit, qu’un seul vestiaire vous habille. Si possible, ne vous préoccupez pas des effets que l’on vous procure selon les exigences des saisons, ni de savoir si vous recevez bien le vêtement que vous aviez déposé ou au contraire celui qu’un autre avait porté, à condition toutefois qu’on ne refuse à aucun ce dont il a besoin<sup>[38]</sup>.</p>");
texte_final = texte_final.concat("<p>Si cette distribution provoque parmi vous contestations et murmures, si l’on se plaint de recevoir un vêtement moins bon que le précédent, si l’on s’indigne d’être habillé comme un autre frère l’était auparavant, jugez vous-mêmes par là de ce qui vous manque en cette tenue sainte<sup>[39]</sup> qui est celle de l’intime du cœur, vous qui vous chicanez pour la tenue du corps. Si toutefois, l’on condescend à votre faiblesse en vous rendant vos anciens habits, rangez cependant toujours en un seul vestiaire, sous une garde commune, les effets que vous déposez. Que personne ne travaille pour soi ; mais que tous vos travaux se fassent en commun, avec plus d’empressement, de constance et de zèle que si chacun s’occupait exclusivement de ses propres affaires. La charité en effet, comme il est écrit, <i>ne recherche pas ses intérêts</i><sup>[40]</sup> ; cela veut dire qu’elle fait passer ce qui est commun avant ce qui est personnel, et non ce qui est personnel avant ce qui est commun. Plus vous aurez souci du bien commun avant votre bien propre, plus vous découvrirez vos progrès. Dans l’usage de toutes ces choses nécessaires qui passent, que la prééminence<sup>[41]</sup> soit à la charité, qui demeure<sup>[42]</sup>.</p>");
texte_final = texte_final.concat("<p>C’est pourquoi, lorsque tel ou telle envoie à ses enfants ou à de plus ou moins proches parents vivant au monastère, un vêtement ou tout autre objet d’usage courant, il ne faut pas les recevoir en cachette, mais les mettre à la disposition du supérieur pour que, rangés en commun<sup>[43]</sup>, ils soient attribués à qui en a besoin. Cacher un présent ainsi reçu, c’est un délit à juger comme un vol.</p>");
texte_final = texte_final.concat("<p>Au supérieur de régler comment les vêtements seront lavés, soit par vous-mêmes soit par les blanchisseurs. Il ne faut pas qu’un souci excessif de propreté dans les habits provoque quelques taches intérieures dans l’âme. Ne pas refuser les bains, si la santé y oblige. Qu’on suive sans murmure l’avis du médecin. Même y répugnerait-on, sur l’ordre du supérieur, on fera ce qui est nécessaire pour la santé. Qu’on ne cède pas au caprice de celui qui réclame un bain, si ce traitement n’est pas opportun. Quand quelque chose fait plaisir en effet, on s’imagine que cela fait du bien, même si c’est en réalité nuisible. Un serviteur de Dieu vient-il se plaindre d’une douleur cachée, on le croira sans hésiter ; mais s’il n’est pas sûr que le remède agréable souhaité doive guérir cette douleur, mieux vaut consulter le médecin.</p>");
texte_final = texte_final.concat("<p>Pour les bains comme pour tout déplacement nécessaire, on sera au moins deux ou trois. Celui qui doit sortir n’a pas à choisir ses compagnons ; ils seront désignés par le supérieur.</p>");
texte_final = texte_final.concat("<p>Le soin des malades, des convalescents et de tous ceux qui, même sans fièvre, sont plus ou moins affaiblis, sera confié à l’un d’entre vous, qui aura à demander lui-même à la dépense ce qu’il jugera nécessaire pour eux. Quant aux responsables de la dépense, du vestiaire ou des livres, qu’ils servent leurs frères sans murmurer. Pour les livres, une heure chaque jour, sera fixée pour les demander ; en dehors de cette heure, aucune demande ne sera honorée. Ceux qui s’occupent des vêtements et des chaussures les remettront sans délai à ceux qui, en ayant besoin, viendront les leur demander.</p>");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regle_saint_augustin_chapitre6'>");
sommaire = sommaire.concat("<li><a href='#regle_saint_augustin_chapitre6'>Chapitre 6</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 6</h2>");
texte_final = texte_final.concat("<p>6. Pas de litiges entre vous ; ou alors mettez-y fin au plus vite ; que votre colère ne se développe pas en haine, d’un fétu faisant une poutre<sup>[44]</sup> et rendant votre âme homicide. Vous lisez en effet : <i>qui hait son frère est homicide</i><sup>[45]</sup>. Quiconque blesse autrui par injure, mauvais propos, accusation directe, se préoccupera de réparer le plus tôt possible ; et que l’offensé pardonne sans récriminer<sup>[46]</sup>. Si l’offense a été réciproque, que l’on se pardonne réciproquement ses torts<sup>[47]</sup>, à cause de vos prières qui doivent être d’autant plus saintes qu’elles sont plus fréquentes.</p>");
texte_final = texte_final.concat("<p>Mieux vaut le vif coléreux qui se dépêche de solliciter son pardon auprès de celui qu’il reconnaît avoir offensé, que l’homme plus lent à s’irriter mais plus lent aussi à s’excuser. Qui ne veut jamais demander pardon ou le fait de mauvaise grâce n’a rien à faire dans le monastère, même si l’on ne l’en chasse pas. Épargnez-vous donc des paroles trop dures ; s’il en échappe de votre bouche, que cette bouche prononce sans retard, les mots qui seront un remède aux blessures qu’elle a causées.</p>");
texte_final = texte_final.concat("<p>Si la nécessité de la régularité à maintenir vous pousse à des paroles sévères, même si vous avez conscience d’avoir dépassé la mesure, on n’exige pas de vous que vous demandiez pardon à vos inférieurs. En effet, vis-à-vis de ceux qui ont à demeurer soumis, un excès d’humilité compromettrait l’autorité que vous avez pour les commander. Mais alors demandez pardon à celui qui est le Seigneur de tous : Il sait bien, Lui, quelle bienveillante affection vous portez à ceux-là mêmes que vous réprimandez peut-être plus qu’il ne convient. Car entre vous l’affection ne doit pas être charnelle, mais spirituelle.</p>");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regle_saint_augustin_chapitre7'>");
sommaire = sommaire.concat("<li><a href='#regle_saint_augustin_chapitre7'>Chapitre 7</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 7</h2>");
texte_final = texte_final.concat("<p>7. Obéissez au supérieur<sup>[48]</sup> comme à un père, et plus encore au prêtre qui a la charge de vous tous. Veiller à l’observation de toutes ces prescriptions, ne laisser passer par négligence aucun manquement mais amender et corriger, telle est la charge du supérieur. Pour ce qui dépasserait ses moyens ou ses forces, qu’il en réfère au prêtre dont l’autorité sur vous est plus grande.</p>");
texte_final = texte_final.concat("<p>Quant à celui qui est à votre tête, qu’il ne s’estime pas heureux de dominer au nom de son autorité mais de servir par amour<sup>[49]</sup>. Que l’honneur, devant vous, lui revienne de la première place ; que la crainte, devant Dieu, le maintienne à vos pieds<sup>[50]</sup>. Qu’il s’offre à tous comme un modèle de bonnes œuvres<sup>[51]</sup>. <i>Qu’il reprenne les turbulents, encourage les pusillanimes, soutienne les faibles ; qu’il soit patient à l’égard de tous</i><sup>[52]</sup>. Empressé lui-même à la vie régulière, qu’en se faisant craindre, il la maintienne. Et bien que l’un et l’autre soient nécessaires, qu’il recherche auprès de vous l’affection plutôt que la crainte, se rappelant sans cesse que c’est à Dieu qu’il aura à rendre compte de vous<sup>[53]</sup>. Quant à vous, par votre obéissance ayez pitié de vous-mêmes sans doute<sup>[54]</sup>, mais plus encore de lui ; car, parmi vous, plus la place est élevée, plus elle est dangereuse.</p>");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regle_saint_augustin_chapitre8'>");
sommaire = sommaire.concat("<li><a href='#regle_saint_augustin_chapitre8'>Chapitre 8</a></li>");

// texte_final = texte_final.concat("<h2>Chapitre 8</h2>");
texte_final = texte_final.concat("<p>8. Puisse le Seigneur vous donner d’observer tout cela avec amour, en êtres épris de beauté spirituelle et dont l’excellence de la vie<sup>[55]</sup> exhale l’excellent parfum du Christ<sup>[56]</sup>, non comme des esclaves sous le régime de la loi, mais en hommes libres sous le régime de la grâce<sup>[57]</sup>. Que ce livret vous soit comme un miroir pour vous regarder ; et de peur que l’oubli n’entraîne des négligences, qu’on vous le lise chaque semaine. Si vous vous trouvez fidèles à l’égard de ce qui est écrit, rendez grâce au Seigneur dispensateur de tout bien. Si par contre quelqu’un se découvre en défaut, qu’il regrette le passé, veille à l’avenir, priant notre Père de lui remettre sa dette et de ne pas le soumettre à la tentation<sup>[58]</sup>.</p>");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='regle_saint_augustin_notes'>");
sommaire = sommaire.concat("<li><a href='#regle_saint_augustin_notes'>Notes</a></li>");

texte_final = texte_final.concat("<h2>Notes</h2>");
texte_final = texte_final.concat("<p>1. Textus regulae quem hic damus, est textus receptus ab Ordine, prout exstat in prototypo, in archivo generali Ordinis asservato. Numeri sumpti sunt ex VERHEYEN L, o. praem, <i>La règle de saint-Augustin I. La tradition manuscrite</i>, Paris, 1969, pp. 417-437.</p>");
texte_final = texte_final.concat("<p>2. Mt 22, 35 – 40.</p>");
texte_final = texte_final.concat("<p>3. Mt 18, 20 ; Jn 11, 52 ; 17.</p>");
texte_final = texte_final.concat("<p>4. Ps 67, 7 <i>…Deus qui habitare facit unanimes in domo</i>.</p>");
texte_final = texte_final.concat("<p>5. Ac 4, 32.</p>");
texte_final = texte_final.concat("<p>6. Ac 2, 44 ; 4, 32.</p>");
texte_final = texte_final.concat("<p>7. Ac 4, 35.</p>");
texte_final = texte_final.concat("<p>8. 1 Tm 6, 8 <i>…habentes autem victum et tegumentum his contenti sumus…</i> Cf. Dt 10,18.</p>");
texte_final = texte_final.concat("<p>9. Ac 2, 45 ; 4, 35.</p>");
texte_final = texte_final.concat("<p>10. Ac 2, 44 – 45.</p>");
texte_final = texte_final.concat("<p>11. cf. supra note 7.</p>");
texte_final = texte_final.concat("<p>12. <i>erigere cervicem</i>, expression dérivée de l’Ancien Testament et fréquemment employée par saint Augustin pour désigner l’orgueil.</p>");
texte_final = texte_final.concat("<p>13. Col 3, 1 – 2.</p>");
texte_final = texte_final.concat("<p>14. Ph 3, 19.</p>");
texte_final = texte_final.concat("<p>15. 1 Co 5, 2 ; 13, 4.</p>");
texte_final = texte_final.concat("<p>16. Ga 2, 6.</p>");
texte_final = texte_final.concat("<p>17. Tb 1, 19 ; Lc 8, 3 ; 1 Co 13, 3.</p>");
texte_final = texte_final.concat("<p>18. Ps 111, 9 ; Lc 18, 22 ; 1 Co 13, 3.</p>");
texte_final = texte_final.concat("<p>19. Ac 1, 14 ; 2, 46 ; Rm 15, 6.</p>");
texte_final = texte_final.concat("<p>20. Co 6, 16 <i>…Nos enim templa Dei vivi sumus…</i> ; cf. 1 Co 3, 16.</p>");
texte_final = texte_final.concat("<p>21. Col 4, 2 ; Rm 12, 12.</p>");
texte_final = texte_final.concat("<p>22. Ep 5, 19.</p>");
texte_final = texte_final.concat("<p>23. Mt 12, 34.</p>");
texte_final = texte_final.concat("<p>24. Am 8, 11 ; Mt 4, 4.</p>");
texte_final = texte_final.concat("<p>25. Mt 5, 28.</p>");
texte_final = texte_final.concat("<p>26. Jn 2, 16.</p>");
texte_final = texte_final.concat("<p>27. Pr 24, 12.</p>");
texte_final = texte_final.concat("<p>28. Pr 24, 18.</p>");
texte_final = texte_final.concat("<p>29. Pr 27, 20 a, selon la Septante.</p>");
texte_final = texte_final.concat("<p>30. 1 Co 3, 16 ; Rm 8, 9 et 11.</p>");
texte_final = texte_final.concat("<p>31. <i>Custodiet</i>, cf. psautier <i>passim</i>.</p>");
texte_final = texte_final.concat("<p>32. Mt 18, 15 – 17.</p>");
texte_final = texte_final.concat("<p>33. Dt 19, 15 ; 17, 6.</p>");
texte_final = texte_final.concat("<p>34. Pr 11, 17.</p>");
texte_final = texte_final.concat("<p>35. 1 Tm 5, 20.</p>");
texte_final = texte_final.concat("<p>36. Cf. supra note 33.</p>");
texte_final = texte_final.concat("<p>37. Cf. supra note 34.</p>");
texte_final = texte_final.concat("<p>38. Ac 4, 35.</p>");
texte_final = texte_final.concat("<p>39. Tit 2, 3.</p>");
texte_final = texte_final.concat("<p>40. 1 Co 13, 5.</p>");
texte_final = texte_final.concat("<p>41. 1 Co 12, 31 <i>…et adhuc supereminentiorem viam vobis demonstro…</i></p>");
texte_final = texte_final.concat("<p>42. 1 Co 13, 8 – 13.</p>");
texte_final = texte_final.concat("<p>43. Ac 4, 35.</p>");
texte_final = texte_final.concat("<p>44. Mt 7, 3 – 5.</p>");
texte_final = texte_final.concat("<p>45. 1 Jn 3, 15.</p>");
texte_final = texte_final.concat("<p>46. Mt 6, 12.</p>");
texte_final = texte_final.concat("<p>47. <i>Debita</i> cf. Mt 6, 12.</p>");
texte_final = texte_final.concat("<p>48. Hb 13, 17.</p>");
texte_final = texte_final.concat("<p>49. Lc 22, 25 – 26 ; Ga 5, 13.</p>");
texte_final = texte_final.concat("<p>50. Eccl 13, 20.</p>");
texte_final = texte_final.concat("<p>51. Tit 2, 7 <i>…circa omnes te ipsum bonorum operum prebens exemplum…</i></p>");
texte_final = texte_final.concat("<p>52. 1 Th 5, 14.</p>");
texte_final = texte_final.concat("<p>53. Hb 13, 17 <i>…quia ipsi vigilant pro animabus vestrius, tamquam rationem reddituri pro vobis…</i></p>");
texte_final = texte_final.concat("<p>54. Eccl 30, 34.</p>");
texte_final = texte_final.concat("<p>55. Jc 3, 13 ; 1 P 3, 16 ; 2, 12.</p>");
texte_final = texte_final.concat("<p>56. 2 Co 2, 15.</p>");
texte_final = texte_final.concat("<p>57. Rm 6, 14 ; Ga 4, 1 – 7.</p>");
texte_final = texte_final.concat("<p>58. Mt 6, 13.</p>");

texte_final = texte_final.concat("</div>");





  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
}


function update_office_pglh(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>PGLH</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='liturgie_heures_chapitre1' style='margin-top: 0px;'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
  sommaire = sommaire.concat("<li><a href='#liturgie_heures_chapitre1'>Chapitre I : Importance de la Liturgie des Heures</a></li>");

texte_final = texte_final.concat("<h2>Chapitre I : Importance de la Liturgie des Heures ou Office Divin dans la vie de l’Église</h2>");
// texte_final = texte_final.concat("<h3>1. La prière publique et commune du peuple de Dieu</h3>");
texte_final = texte_final.concat("La prière publique et commune du peuple de Dieu est considérée à juste titre comme l’une des fonctions principales de l’Église. Dès le commencement, les baptisés « étaient assidus à recevoir l’enseignement des Apôtres, à participer à la vie commune, à la fraction du pain et aux prières » (Ac 2,42). Les Actes des Apôtres attestent à plusieurs reprises que la communauté chrétienne priait d’un seul cœur (Cf. Ac 1,14 ; Ac 4,24 ; Ac 12 ; Ac 5,12 ; cf. Ep 5, 19-21).<br><br>Le témoignage de l’Église primitive nous apprend que les fidèles s’adonnaient à la prière individuelle aussi à des heures fixes. Dans la suite, en diverses contrées, la coutume s’est établie assez rapidement d’affecter à la prière commune des moments déterminés, comme la dernière heure du jour, lorsque tombe le soir et qu’on allume la lampe, ou la première, quand vers l’apparition de l’astre du jour la nuit touche à sa fin.<br><br>Avec le temps, on allait sanctifier par la prière commune d’autres heures encore, comme cela était suggéré aux Pères par la lecture des Actes des Apôtres. Ceux-ci nous montrent en effet les disciples rassemblés (pour la prière) à la troisième heure (cf. Ac 2, 1-15). Et le prince des Apôtres « monta à la chambre haute, pour prier vers la sixième heure » (Ac 10, 9) ; « Pierre et Jean montaient au Temple pour la prière de la neuvième heure » (Ac 3, 1) ; « Au milieu de la nuit, Paul et Silas, en prière, louaient Dieu » (Ac 16, 25).<br><br>Ces prières faites en commun allaient constituer progressivement un cycle d’heures bien défini. Cette Liturgie des heures, ou Office divin, complétée également par des lectures, est avant tout une prière de louange et de supplication ; elle est prière de l’Église avec le Christ et adressée au Christ.");

texte_final = texte_final.concat("<h3>I. La prière du Christ</h3>");
texte_final = texte_final.concat("<h4>Le Christ prie le Père</h4>");
texte_final = texte_final.concat("En venant pour apporter aux hommes la vie divine, le Verbe procède du Père comme l’éclat de sa gloire, « le Souverain Prêtre de la Nouvelle et Éternelle Alliance, le Christ Jésus, prenant la nature humaine, a introduit dans notre exil terrestre cet hymne qui se chante éternellement dans les demeures célestes » (Conc. Vat II. Const. sur la Ste Liturgie Sacrosanctum Concilium, n. 83). Désormais, dans le cœur du Christ, la louange de Dieu se fait entendre par des paroles humaines, celles de l’adoration, de la propitiation et de l’intercession. Tout cela est présenté à Dieu par le chef de l’humanité nouvelle, médiateur entre Dieu et les hommes, au nom et pour le bien de tous.<br><br>Le Fils de Dieu lui-même, « qui ne fait qu’un avec son Père » (cf. Jn 10, 30) et qui, en entrant dans le monde, proclamait : « Voici que je viens pour faire, ô Dieu, ta volonté » (He 10, 9 ; cf. Jn 6, 38), a bien voulu aussi nous laisser divers témoignages sur sa prière. Très souvent, en effet, les évangiles nous le montrent en prière : quand sa mission est dévoilée par le Père (Lc 3, 21-22), avant d’appeler les Apôtres (Lc 6, 16), en bénissant Dieu au moment de la multiplication des pains (Mt 14, 19 ; 15, 36 ; Mc 6, 41 ; 8, 7 ; Lc 9, 16 ; Jn 6, 11), quand il est transfiguré sur la montagne (Lc 9, 28-29), lorsqu’il guérit un sourd-muet (Mc 7, 34) et quand il ressuscite Lazare (Jn 11, 41 ss), avant de provoquer la confession de Pierre (Lc 9, 18), quand il apprend à prier à ses disciples (Lc 11, 1), au retour des disciples envoyés en mission (Mt 11, 25 ss. ; Lc 10, 21 ss.), quand il bénit les petits enfants (Mt 19, 13) et quand il intercède pour Pierre (Lc 22, 32).<br><br>Son activité de tous les jours était intimement liée avec sa prière, si tant est qu’elle n’en découlait pas en quelque sorte, ainsi, quand il se retirait dans le désert ou sur la montagne pour prier (Mc 1, 35 ; 6, 46 ; Lc 5, 16 ; cf. Mt 4, 1 par. ; Mt 14, 23), en se levant de très bonne heure (Mc 1, 35), ou passait la nuit à prier Dieu (Mt 14, 23.25 ; Mc 6, 46.48), depuis le soir jusqu’à la quatrième veille (Lc 6, 12) (celle de l’aube). Il participait également – suppose-t-on à juste titre – tant aux prières dites publiquement dans les synagogues, où il avait 'l’habitude' (Lc 4, 16) de se rendre le jour du sabbat, et au Temple, qu’il avait appelé une maison de prière (Mt 21, 13 par.), qu’à celles récitées en privé par les pieux Israélites habituellement tous les jours. Il prononçait de même les bénédictions traditionnelles adressées à Dieu au moment des repas, ainsi qu’on nous le rapporte expressément pour la multiplication des pains (Mt 14, 19 par. ; Mt 15, 36 par.), la dernière Cène (Mt 26, 26 par.), le repas d’Emmaüs (Lc 24, 30). Il récitait également des hymnes avec ses disciples (Mt 26, 30 par.).<br><br>Jusqu’à la fin de sa vie, alors que la Passion était déjà proche (Jn 12, 27 ss.), à la dernière Cène (Jn 17, 1-26), dans l’agonie (Mt 26, 36-44 par.) et sur la croix (Lc 23, 34.46 ; Mt 27, 46 ; Mc 15, 34), le divin Maître a montré que la prière était l’âme de son ministère messianique et de l’aboutissement pascal de celui-ci. Car lui-même 'aux jours de sa vie mortelle, présentant des prières et des supplications, avec un grand cri et des larmes, à celui qui pouvait le sauver de la mort, a été exaucé à cause de sa piété' (He 5, 7) et, par le sacrifice accompli sur l’autel de la croix, 'il a rendu parfaits pour toujours ceux qu’il sanctifie' (He 10, 14) ; enfin, ressuscité des morts, il est vivant pour toujours et il prie pour nous (Cf. He 7, 25).");

texte_final = texte_final.concat("<h3>II. La prière de l’Église</h3>");
texte_final = texte_final.concat("<h4>Le précepte de la prière</h4>");
texte_final = texte_final.concat("Ce que lui-même faisait, Jésus nous a ordonné de le faire à notre tour. 'Priez', a-t-il dit souvent, 'demandez', 'implorez' (Mt 5, 44 ; 7, 7 ; 26, 41 ; Lc 13, 33 ; 14, 38 ; Lc 6, 28 ; 10, 2 ; 11, 9 ; 22, 40.46.), 'en mon nom' (Jn 14, 13 ss. ; 15, 16 ; 16, 23 ss., 26.) ; il a même donné un modèle de prière dans l’oraison dite dominicale (Mt 6, 9-13 ; Lc 11, 2-4.), et il nous a avertis que la prière était nécessaire (Lc 18, 1), une prière humble (Lc 18, 9-14), vigilante (Lc 21, 36 ; Mc 13, 33.), persévérante, confiante dans la bonté du Père (Lc 11, 5-13 ; 18, 1-8 ; Jn 14, 13 ; 16, 23.), faite avec une intention pure et accordée à la nature de Dieu (Mt 6, 5-8 ; 23, 14 ; Lc 20, 47 ; Jn 4, 23.).<br><br>Quant aux Apôtres, qui maintes fois dans leurs Épîtres nous transmettent des prières, surtout de louange et d’action de grâce, ils nous exhortent à l’insistance et à l’assiduité (Rm 8, 15.26 ; 1 Co 12, 3 ; Ga 4, 6 ; Jude 20.), dans la prière offerte à Dieu (2 Co 1, 20 ; Col 3, 17.), par le Christ (He 13, 15), dans l’Esprit Saint (Rm 12, 12 ; 1 Co 7, 5 ; Ep 6, 18 ; Col 4, 2 ; 1 Th 5, 17 ; 1 Tm 5, 5 ; 1 P 4, 7.), et en soulignent l’efficacité pour la sanctification (1 Tm 4, 5, Jc 5, 15 ss ; 1 Jn 3, 22 ; 5, 15 ss) ; ils nous exhortent à la prière de louange (Ep 5, 19 ss. ; He 13, 15 ; Ap 19, 5.), d’action de grâce (Col 3, 17 ; Ph 4, 6 ; 1 Th 5, 17 ; 1 Tm 2, 1.), de demande (Rm 8, 26 ; Ph 4, 6.) et d’intercession pour tous (Rm 15, 30 ; 1 Tm 2, 1 ss. ; Ep 6, 18 ; 1 Th 5, 25 ; Jc 5, 14.16.).<br><br>Puisque l’homme tient de Dieu tout ce qu’il est, il doit reconnaître et confesser cette souveraineté de son Créateur, ce que les hommes religieux de tous les temps ont effectivement fait par la prière.<br><br>Mais la prière adressée à Dieu se relie au Christ, Seigneur de tous les hommes et unique Médiateur (1 Tm 2, 5 ; He 8, 6 ; 9, 15 ; 12, 24.), le seul par qui nous avons accès auprès de Dieu (Rm 5, 2 ; Ep 2, 18 ; 3, 12.). Il rattache, en effet, à lui-même toute la communauté humaine (Cf. Const. sur la Liturgie, n. 83.) de telle sorte qu’il se crée un lien intime entre la prière du Christ et la prière de tout le genre humain. Car c’est dans le Christ et en lui seul que la religion humaine trouve sa valeur salvatrice et atteint son but.<br><br>Un lien essentiel spécial et très étroit s’établit cependant entre le Christ et les hommes que, par le sacrement de la nouvelle naissance, il assume comme membres dans son corps qui est l’Église. C’est de cette façon, en effet, que se répandent dans tout le corps, à partir de la tête, toutes les richesses qui appartiennent au Fils : la communication de l’Esprit, la vérité, la vie et la participation à sa filiation divine qui se manifestaient dans toute sa prière lorsqu’il vivait parmi nous.<br><br>Tout le corps de l’Église participe, de même, au sacerdoce du Christ, de telle sorte que 'les baptisés, par la régénération et l’onction du Saint-Esprit, sont consacrés pour être une demeure spirituelle et un sacerdoce saint' (Const. dogm. sur l’Église, Lumen Gentium, n. 10.), et deviennent aptes à célébrer le culte de la Nouvelle Alliance, qui ne procède pas de nos forces, mais du mérite et du don du Christ.<br><br>'Dieu n’aurait pu faire aux hommes plus grand don que celui-ci : de son Verbe, par qui il a créé toutes choses, il fait leur chef, et d’eux il fait ses membres, pour que lui, il soit Fils de Dieu et Fils de l’homme, un seul Dieu avec le Père, un seul homme avec les hommes ; pour qu’en parlant à Dieu dans la prière nous ne séparions pas de lui son Fils, pour qu’en priant, le corps du Fils ne sépare pas son chef de lui-même : pour qu’il soit l’unique sauveur de son corps, Notre Seigneur Jésus Christ, Fils de Dieu, qui, à la fois, prie pour nous, prie en nous et est prié par nous. Il prie pour nous comme notre prêtre, il prie en nous comme notre chef, il est prié par nous comme notre Dieu. Reconnaissons donc nos paroles en lui, et ses paroles en nous' (S. Augustin, Commentaire du psaume 85, 1 : CCL 39, 1176.).<br><br>C’est en cela que réside la dignité de la prière chrétienne : elle participe de la piété du Fils unique envers le Père et de la prière que, durant sa vie sur terre, il a exprimée par la parole et qui, à présent, se perpétue sans interruption dans toute l’Église et en tous ses membres, au nom et pour le salut de tout le genre humain.");

texte_final = texte_final.concat("<h3>L’action de l’Esprit Saint</h3>");
texte_final = texte_final.concat("L’unité de l’Église en prière est l’œuvre de l’Esprit Saint : c’est le même Esprit qui est dans le Christ (Cf. Lc 10, 21 quand il tressaillit de joie sous l’action de l’Esprit Saint et dit : 'Je te bénis, Père...'), dans l’Église tout entière et en chacun des baptisés. C’est 'l’Esprit (lui-même) qui vient au secours de notre faiblesse' et 'qui intervient pour nous par des cris inexprimables' (Rm 8, 26) ; c’est lui qui, en tant qu’Esprit du Fils, nous infuse 'l’esprit d’adoption dans lequel nous crions : Abba, Père' (Rm 8, 15 ; cf. Ga 4, 6 ; 1 Co 12, 3 ; Ep 5, 18 ; Jude 20). Aucune prière chrétienne ne peut donc exister sans l’action de l’Esprit Saint qui, en assurant l’unité de toute l’Église, conduit au Père par le Fils.");

texte_final = texte_final.concat("<h3>Nature communautaire de la prière</h3>");
texte_final = texte_final.concat("L’exemple et le précepte du Seigneur et des apôtres, qui nous invitent à prier instamment et sans cesse, ne doivent donc pas être considérés comme une règle purement légale ; ils appartiennent intimement à l’essence de l’Église, qui est une communauté et qui doit, par sa prière aussi, manifester sa nature communautaire.<br><br>Voilà pourquoi lorsque, dans les Actes des Apôtres il est question pour la première fois de la communauté des fidèles, celle-ci apparaît précisément rassemblée dans la prière avec quelques femmes, Marie, mère de Jésus, et ses frères (Ac 1, 14). 'La multitude des croyants n’avait qu’un cœur et qu’une âme' (Ac 4, 32), cette unanimité étant fondée sur la parole de Dieu, la communion fraternelle, la prière et l’Eucharistie (Cf. Ac 2, 42.).<br><br>Certes, la prière qu’on fait dans sa chambre, portes fermées (Cf., Mt 6, 6) est toujours nécessaire et recommandée (Cf. Const. sur la Liturgie, n. 12.), elle est la prière d’un membre de l’Église, accomplie par le Christ dans l’Esprit Saint. Cependant la prière de la communauté possède une dignité spéciale ; le Christ lui-même n’a-t-il pas dit : 'Là où deux ou trois sont rassemblés en mon nom, je suis au milieu d’eux' (Mt 18, 20) ?");

texte_final = texte_final.concat("<h3>III. La Liturgie des heures</h3>");
texte_final = texte_final.concat("<h4>La sanctification du temps</h4>");
texte_final = texte_final.concat("Puisque le Christ nous a ordonné : 'Il faut toujours prier, sans se lasser' (Lc 18, 1), l’Église, obéissant fidèlement à cette recommandation, ne cesse jamais de prier et nous y invite par ces paroles : 'Par lui (Jésus) offrons toujours à Dieu le sacrifice de louange' (He 13, 15). Ce précepte est accompli non seulement par la célébration de l’Eucharistie, mais également d’autres façons, et surtout par la Liturgie des heures, qui a en propre, par rapport aux autres actes liturgiques, suivant l’ancienne tradition chrétienne, de consacrer tout le cycle du jour et de la nuit (Cf. : Ibid., nn. 83-84.).<br><br>Sanctifier la journée et toute l’activité humaine est l’un des buts de la Liturgie des heures ; aussi le déroulement de celle-ci a-t-il été restauré de façon à rendre aux heures, autant que possible, la vérité du temps et à tenir compte également des conditions de la vie actuelle (Cf. Ibid., n. 88.).<br><br>C’est pourquoi 'il importe, soit pour sanctifier véritablement la journée, soit pour célébrer les heures elles-mêmes avec fruit spirituel, que, dans la prière des heures, on observe le moment qui se rapproche le plus du temps véritable de chaque heure canonique' (Cf. Ibid., n. 94.).");

texte_final = texte_final.concat("<h4>Relation de la liturgie des heures avec l’eucharistie</h4>");
texte_final = texte_final.concat("La Liturgie des heures étend aux différents moments de la journée (Cf. Décr. sur le ministère et la vie des prêtres, Presbyterorum ordinis, n. 5.) la louange et l’action de grâce, de même que la commémoration des mystères du salut, la supplication, l’avant-goût de la gloire céleste qui sont contenus dans le mystère eucharistique, 'centre et sommet de toute la vie de la communauté chrétienne' (Décr. sur la charge pastorale des évêques, Christus Dominus, n. 30.).<br><br>La célébration eucharistique elle-même trouve dans la Liturgie des heures une excellente préparation, car celle-ci éveille et nourrit comme il faut les dispositions nécessaires pour une célébration fructueuse de l’Eucharistie, comme la foi, l’espérance, la charité, la dévotion et l’esprit de sacrifice.");

texte_final = texte_final.concat("<h4>Accomplissement de la fonction sacerdotale du Christ dans la Liturgie des heures</h4>");
texte_final = texte_final.concat("L’œuvre de la rédemption des hommes et de la parfaite glorification de Dieu (Cf. Const. sur la Liturgie, n. 5.) le Christ l’exerce, dans l’Esprit Saint et par l’Église, non seulement quand on célèbre l’Eucharistie et quand on administre les sacrements, mais également, et d’une manière particulière, quand se déroule la Liturgie des heures (Cf. Ibid. nn. 83 et 98.). Il est lui-même présent dans cette liturgie pendant que la communauté est rassemblée, que la Parole de Dieu est proclamée et « que l’Église prie et chante les psaumes » (Ibid., n. 7.).");

texte_final = texte_final.concat("<h4>Sanctification de l’homme</h4>");
texte_final = texte_final.concat("La sanctification de l’homme s’opère (Cf. Ibid. n. 10.) et le culte de Dieu s’exerce dans la Liturgie des heures de manière à instaurer une sorte d’échange ou de dialogue entre Dieu et les hommes, par lequel « Dieu parle à son Peuple... et le peuple répond à Dieu par les chants et la prière » (Ibid., n. 33.).<br><br>Ceux qui y participent peuvent retirer de la Liturgie des heures, par la vertu de la parole salutaire de Dieu, qui y tient une place importante, une grande richesse de sanctification. En effet, les lectures sont tirées de l’Écriture, les paroles de Dieu transmises dans les psaumes sont chantées en sa présence, et les autres prières, oraisons et hymnes, naissant également de son inspiration et d’un élan profond qui vient de lui (Cf. Ibid., n. 24.).<br><br>Ce n’est donc pas seulement quand on lit « ce qui a été écrit pour notre enseignement » (Rm 15, 4), mais aussi quand l’Église prie ou chante, que la foi de ceux qui y participent est nourrie, que les âmes sont entraînées vers Dieu pour lui offrir un hommage spirituel et pour recevoir sa grâce plus abondamment (Ibid., n. 33.).");

texte_final = texte_final.concat("<h4>Louange offerte à Dieu en union avec l’Église du ciel</h4>");
texte_final = texte_final.concat("Dans la Liturgie des heures, l’Église, en exerçant la fonction sacerdotale de son Chef offre à Dieu 'sans relâche' (1 Th 5, 17) le sacrifice de louange, c’est-à-dire « le fruit de lèvres qui confessent son nom » (Cf. He 13, 15.). Cette prière est 'la voix de l’Épouse elle-même qui s’adresse à son Époux et, mieux encore, c’est la prière du Christ que celui-ci, avec son Corps, présente au Père' (Const. sur la Liturgie n. 84). « Par conséquent, tous ceux qui assurent cette charge accomplissent l’office de l’Église et, en même temps, participent de l’honneur suprême de l’Épouse du Christ, parce qu’en acquittant les louanges divines, ils se tiennent devant le trône de Dieu au nom de la Mère Église » (Ibid., n. 85.).<br><br>Par la louange des Heures offerte à Dieu, l’Église s’associe au divin chant de louange que chante de toute éternité le Fils (Cf. Ibid., n. 83) en même temps, elle perçoit un avant-goût de la louange céleste, décrite par saint Jean dans l’Apocalypse, qui résonne sans cesse devant le trône de Dieu et de l’Agneau. En effet, notre union étroite avec l’Église du ciel se réalise lorsque « nous proclamons, dans une joie commune, la louange de la divine Majesté ; tous, rachetés dans le sang du Christ, de toute tribu, langue, peuple ou nation (cf. Ap 5, 9) et rassemblés en l’unique Église, nous glorifions le Dieu un en trois Personnes dans un chant unanime de louange » (Const. dogm. sur l’Église, Lumen Gentium, n. 50 ; cf. Const. sur la Liturgie nn. 8 et 104.).<br><br>Cette liturgie céleste, les prophètes l’ont contemplée à l’avance dans la victoire du jour sans nuit, de la lumière sans obscurité : « Tu n’auras plus le soleil comme lumière le jour, la clarté de la lune ne t’éclairera plus, mais le Seigneur sera ta lumière éternelle » (Is 60, 19 ; cf. Ap 21, 23.25). « Ce sera un jour merveilleux – le Seigneur le connaît ! – sans alternance de jour et de nuit : au temps du soir il fera clair » (Za 14, 7). Or, « les derniers temps sont arrivés pour nous (cf. 1 Co 10, 11). Le renouvellement du monde est irrévocablement acquis et, en toute réalité, anticipé dès maintenant » (Lumen Gentium, n. 48.). Ainsi par la foi, nous sommes instruits même sur le sens de notre vie temporelle, pour vivre, avec toute la création, dans l’attente de la manifestation des fils de Dieu (Cf. Rm 8, 19.). Dans la Liturgie des heures, nous proclamons cette foi, nous exprimons et nourrissons cette espérance, nous participons en quelque sorte à la joie de la louange perpétuelle et du jour qui ne connaît pas de crépuscule.");

texte_final = texte_final.concat("<h4>Supplication et intercession</h4>");
texte_final = texte_final.concat("Mais outre la louange de Dieu, l’Église apporte dans la liturgie les appels et les désirs de tous les fidèles du Christ, et c’est même pour le salut du monde entier qu’elle interpelle le Christ et, par lui le Père (Cf. Const. sur la Liturgie, n. 83.). La voix qu’on entend ici n’est pas seulement celle de l’Église, elle est aussi celle du Christ, puisque les prières sont prononcées au nom du Christ, c’est-à-dire « par Jésus Christ notre Seigneur » ; et ainsi l’Église continue de dire les prières et les supplications que le Christ a faites aux jours de sa vie dans la chair (Cf. He 5, 7.) et qui, pour cette raison, ont une efficacité particulière. Ce n’est donc pas seulement par la charité, par l’exemple et par les œuvres de pénitence, mais également par la prière que la communauté ecclésiale exerce un véritable rôle maternel envers les âmes pour les conduire au Christ (Cf. Presbytererum ordinis, n. 6.). Ceci concerne principalement tous ceux qui ont reçu un mandat spécial d’accomplir la Liturgie des heures – à savoir, les évêques et les prêtres, qui prient d’office pour leur peuple et pour tout le peuple de Dieu (Cf. Lumen Gentium, n. 41.), et certains ministres dans les ordres sacrés, ainsi que les religieux (Cf. infra, n. 24).");

texte_final = texte_final.concat("<h4>Sommet et source de l’action pastorale</h4>");
texte_final = texte_final.concat("Ceux qui participent à la Liturgie des heures, contribuent donc par une mystérieuse fécondité apostolique à accroître le peuple du Seigneur (Cf. Décret. sur la rénovation de la vie religieuse, Perfectæ caritatis n. 7.), car tout labeur apostolique vise « à ce que tous devenus enfants de Dieu par la foi et le baptême, se rassemblent, louent Dieu au milieu de l’Église, participent au sacrifice et mangent la Cène du Seigneur » (Const. sur la Liturgie, n. 10.).<br><br>C’est ainsi que les fidèles expriment par leur vie et manifestent aux autres « le mystère du Christ et la nature authentique de la véritable Église. Car il appartient en propre à celle-ci d’être... visible et riche de réalités invisibles, fervente dans l’action et occupée à la contemplation, présente au monde et pourtant étrangère » (Ibid., n. 2.).<br><br>Dans un autre sens, les lectures et les prières de la Liturgie des heures constituent une source de vie chrétienne. En effet, c’est à la table de la sainte Écriture et des paroles des saints que cette vie se nourrit, et elle puise sa vigueur dans la prière. Car seul le Seigneur, sans qui nous ne pouvons rien faire (Cf. Jn 15, 5), peut donner efficacité et prospérité à nos œuvres (Cf. Const. sur la Liturgie, n. 86.) si nous le lui demandons, afin que nous soyons, jour après jour, intégrés dans la construction du temple de Dieu dans l’Esprit (Cf. Ep 2, 21-22.), de façon à atteindre la force de l’âge qui correspond à la plénitude du Christ (Cf. Ep 4, 13.), et qu’en même temps nous accroissions nos forces pour annoncer la bonne nouvelle du Christ à ceux du dehors. (Cf. Const. sur la Liturgie, n. 2.).");

texte_final = texte_final.concat("<h4>Que l’âme s’accorde avec la voix</h4>");
texte_final = texte_final.concat("Pour que cette prière appartienne en propre à chacun de ceux qui y participent, pour qu’elle soit source de piété, et de la grâce divine dans toute sa richesse, et aussi aliment d’oraison personnelle et d’action apostolique, il faut que dans son accomplissement digne, attentif et fervent, l’âme s’accorde avec la voix (Cf. Ibid., n. 90 ; Règle de S. Benoît, c. 19.). Que chacun s’applique à coopérer avec la grâce d’en haut pour ne pas la recevoir en vain. En cherchant le Christ et en pénétrant toujours plus intimement dans son mystère par la prière (Cf. Décr. Presbyterorum ordinis, n. 14 ; Décr. sur la formation des prêtres, Optatam totius, n. 8.), que tous louent Dieu et lui présentent leurs supplications dans le même esprit qui animait la prière du divin Rédempteur lui-même.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='liturgie_heures_chapitre2'>");
sommaire = sommaire.concat("<li><a href='#liturgie_heures_chapitre2'>Chapitre II : La sanctification de la journée</a></li>");

texte_final = texte_final.concat("<h2>Chapitre II : La sanctification de la journée</h2>");
texte_final = texte_final.concat("<h3>I. L’introduction à tout l’office</h3>");
texte_final = texte_final.concat("Habituellement, tout l’office est introduit par l’invitatoire. Celui-ci consiste dans le verset : « Seigneur, ouvre mes lèvres. Et ma bouche publiera ta louange », et dans le psaume 94, par lequel, chaque jour, les fidèles sont invités à chanter les louanges de Dieu et à écouter sa voix, et conviés à attendre le « repos du Seigneur ». Cependant, si l’on y trouve avantage, on peut utiliser le psaume 99, le psaume 66, ou le psaume 23, à la place du psaume 94. Il est préférable de dire le psaume invitatoire, comme cela est indiqué en son lieu, sous le mode responsorial, c’est-à-dire avec son antienne, qui est proposée d’emblée et tout de suite répétée, pour être ensuite reprise après chaque strophe.<br><br>L’invitatoire se place au début de tout le cycle de la prière quotidienne, c’est-à-dire en tête de l’office du matin ou de l’office de lecture, suivant que c’est l’un ou l’autre de ces actes liturgiques qui inaugure la journée. On peut cependant, si on le juge opportun, omettre le psaume invitatoire quand il devrait se placer avant l’office du matin.<br><br>La façon de varier les antiennes de l’invitatoire selon la diversité des jours liturgiques est chaque fois indiquée en son lieu.");

texte_final = texte_final.concat("<h3>II. Offices du matin et du soir</h3>");
texte_final = texte_final.concat("« Les laudes, comme prières du matin, et les vêpres, comme prières du soir, qui, d’après la vénérable tradition de l’Église universelle, constituent les deux pôles de l’office quotidien, doivent être tenues pour les Heures principales et elles doivent être célébrées en conséquence. »<br><br>Les laudes matinales sont destinées à sanctifier les heures du matin et sont organisées en conséquence, comme on le voit par bon nombre de leurs éléments. Leur caractère matinal est très bien exprimé par ces paroles de saint Basile le Grand : « Louange du matin, pour consacrer à Dieu les premiers mouvements de notre âme et de notre esprit, pour que nous n’entreprenions rien avant de nous être réjouis à la pensée de Dieu, selon ce qui est écrit : ‘Je me suis souvenu de Dieu et j’y ai pris mes délices’ (Ps 76,4), et pour que nos corps, de même, ne se mettent pas au travail avant que nous ayons accompli ce qui est écrit : ‘Je dirigerai vers toi ma prière, Seigneur ; au matin tu exauceras ma voix ; au matin je me tiendrai devant toi et je te verrai’ (Ps 5,4-5). » De plus, cette Heure, qu’on dit au moment où revient la nouvelle lumière du jour, évoque la résurrection du Seigneur Jésus qui est « la lumière véritable, éclairant tous les hommes » (Jn 1,9) et « le soleil de justice » (Mi 3,20), « le soleil levant qui vient d’en haut » (Lc 1,78). On comprend donc bien la recommandation de saint Cyprien : « Le matin, il faut prier, afin que la résurrection du Seigneur soit célébrée par une prière matinale. »<br><br>L’office du soir est célébré dans la soirée, quand le jour baisse déjà, « afin de rendre grâce pour ce qui, en ce jour, nous a été donné, ou pour ce que nous avons fait de bien ». De plus, la prière que nous faisons monter « comme l’encens en présence du Seigneur » et dans laquelle « l’élévation de nos mains » devient comme « le sacrifice du soir » constitue un rappel de la rédemption. Ce sacrifice « peut cependant être compris dans un sens encore plus sacré, comme le véritable sacrifice du soir, soit en tant qu’il est transmis par le Seigneur, notre Sauveur, aux Apôtres lors de la Cène, quand il inaugurait ainsi les mystères saints et sacrés de l’Église ; soit comme le sacrifice du soir qu’il a offert au Père le jour suivant, c’est-à-dire à la fin des temps, par l’élévation de ses mains, pour le salut du monde entier ». Enfin, pour diriger notre espérance vers la lumière qui ne connaît pas de crépuscule, « nous prions et demandons que la lumière revienne sur nous, nous demandons l’avènement du Christ qui doit nous apporter la grâce de la lumière éternelle ». À cette heure-là nous unissons notre voix à celle des Églises d’Orient en invoquant la « Joyeuse lumière de la sainte gloire du Père céleste et éternel, le bienheureux Jésus Christ ; parvenus au coucher du soleil, en voyant la lumière du soir, nous chantons Dieu, Père, Fils et Esprit Saint... ».<br><br>On doit donc faire grand cas des offices du matin et du soir comme étant la prière de la communauté chrétienne. Leur célébration publique ou commune doit être favorisée, surtout chez ceux qui vivent en communauté. Elle doit même être conseillée aux fidèles qui ne peuvent pas participer à la célébration commune.<br><br>Les offices du matin et du soir commencent par le verset d’introduction : « Dieu, viens à mon aide. Seigneur, à notre secours », que suit le « Gloire au Père » avec « Au Dieu qui est... » et « Alléluia » (qu’on omet en Carême). Mais tout cela est supprimé à l’office du matin quand celui-ci commence par l’invitatoire.<br><br>Aussitôt après, on chante ou on dit l’hymne qui convient. Le rôle de l’hymne est de donner à chaque Heure ou à chaque fête sa tonalité propre, et de rendre plus facile et plus joyeuse l’entrée dans la prière, surtout quand la célébration se fait avec le peuple.<br><br>Après l’hymne, vient la psalmodie, conformément aux nn. 121-125. La psalmodie de l’office du matin comprend un psaume approprié au matin, puis un cantique de l’Ancien Testament et un deuxième psaume, qui est, selon la tradition de l’Église, un psaume de louange. La psalmodie de l’office du soir est constituée de deux psaumes (ou de deux sections d’un psaume trop long) appropriés à cette heure et à une célébration avec le peuple, et d’un cantique tiré des épîtres ou de l’Apocalypse.<br><br>La psalmodie achevée, on fait une lecture, soit brève, soit relativement longue.<br><br>La lecture brève est choisie suivant le jour, le temps ou la fête. Elle doit être lue et écoutée comme une véritable proclamation de la parole de Dieu, qui propose avec force quelque sentence sacrée, et qui met en lumière des paroles brèves auxquelles on risque de ne pas faire attention au cours d’une lecture continue des Écritures. La lecture brève change chaque jour dans le cycle de la psalmodie.<br><br>Cependant, au gré du célébrant, et surtout quand il y a participation du peuple, on peut choisir une lecture biblique plus longue, tirée soit de l’office de lecture, soit des textes lus à la messe, choisie surtout parmi celles qui n’ont pu avoir lieu pour différents motifs. Rien n’empêche non plus de choisir parfois une autre lecture, mieux adaptée, en tenant compte de ce qui est dit sous les nn. 248-249, 251.<br><br>Lorsque la célébration se fait avec le peuple, on peut y ajouter, quand cela semble indiqué, une brève homélie pour faire mieux comprendre cette lecture.<br><br>Après la lecture ou après l’homélie, si on le juge bon, on peut observer un temps de silence.<br><br>Pour répondre à la parole de Dieu, un chant responsorial ou répons bref est proposé, qu’on peut omettre si on le juge bon. On peut cependant le remplacer par d’autres chants répondant à la même fonction et appartenant au même genre, du moment qu’ils sont dûment approuvés pour cet usage par la Conférence épiscopale.<br><br>On dit ensuite solennellement, avec son antienne, le cantique évangélique, c’est-à-dire le matin le cantique de Zacharie, le Benedictus, et le soir le cantique de la Bienheureuse Vierge Marie, le Magnificat. Ces cantiques, maintenus par l’usage séculaire et populaire de l’Église romaine, expriment la louange de la rédemption et l’action de grâce. L’antienne de Benedictus et celle de Magnificat est suggérée par la nature du jour, du temps ou de la fête.<br><br>Le cantique terminé, le matin on dit des prières pour consacrer à Dieu la journée et le travail, et le soir des intercessions (cf. nn. 179 à 193).<br><br>Après ces prières ou intercessions, le « Notre Père » est dit par tous.<br><br>Le « Notre Père » est suivi par l’oraison de conclusion, qu’on trouve au psautier pour les féries ordinaires et au propre pour les autres jours.<br><br>Enfin, si la présidence est exercée par un prêtre ou un diacre, c’est celui-ci qui congédie le peuple par la salutation « Le Seigneur soit avec vous » et la bénédiction comme à la messe, suivie par l’invitation « Allez dans la paix du Christ » et la réponse « Nous rendons grâce à Dieu ». Autrement, la célébration s’achève par « Que le Seigneur nous bénisse, etc. ».");

texte_final = texte_final.concat("<h3>III. L’office de lecture</h3>");
texte_final = texte_final.concat("L’office de lecture a pour but de proposer au peuple de Dieu, et surtout à ceux qui sont consacrés au Seigneur d’une manière particulière, une riche méditation de la Sainte Écriture ainsi que les plus belles pages des auteurs spirituels. Car, bien que les lectures faites tous les jours à la messe constituent aujourd’hui un cycle plus abondant de textes scripturaires, le trésor de révélation et de tradition contenu dans l’office de lecture sera d’un grand profit spirituel. Ce sont avant tout les prêtres qui doivent chercher ces richesses afin de pouvoir dispenser à tous la parole de Dieu qu’ils ont reçue, et « nourrir le peuple de Dieu » de leur enseignement.<br><br>Et comme la prière des fidèles « doit aller de pair avec la lecture de la Sainte Écriture, pour que s’établisse le dialogue entre Dieu et l’homme », car « nous lui parlons quand nous prions, mais nous l’écoutons quand nous lisons les oracles divins », l’office de lecture comporte également des psaumes, une hymne, une oraison et d’autres formules ; il présente le caractère d’une véritable prière.<br><br>L’office de lecture, selon la Constitution du deuxième Concile du Vatican sur la liturgie, « bien qu’il garde, dans la célébration chorale, son caractère de louange nocturne, sera adapté de telle sorte qu’il puisse être dit à n’importe quelle heure du jour, et il comportera un moins grand nombre de psaumes, et des lectures plus étendues ».<br><br>Ceux qui doivent, en vertu de leur statut particulier, et ceux qui, d’une façon très louable, veulent garder à cet office son caractère de louange nocturne, qu’ils le disent la nuit ou très tôt avant l’office du matin, choisiront une hymne dans la série destinée à cet usage pour le Temps ordinaire. En outre, pour les dimanches et certaines fêtes et solennités, on tiendra compte de ce qui est dit des vigiles aux nn. 70 à 73.<br><br>Cette disposition étant respectée, l’office de lecture peut être dit à n’importe quelle heure du jour et même de la nuit précédente, après l’office du soir.<br><br>Si l’office de lecture se dit avant l’office du matin, on le fait précéder de l’invitatoire, comme il est indiqué ci-dessus (nn. 34 à 36). Autrement, on commence par le verset « Dieu, viens à mon aide », avec « Gloire au Père », « Au Dieu qui est » et, en dehors du Carême, « Alléluia ».<br><br>On dit ensuite l’hymne, choisie dans le Temps ordinaire, ou bien dans la série nocturne, comme il est indiqué ci-dessus au n. 58, ou bien dans la série diurne, suivant ce que demande la vérité du moment où l’on célèbre.<br><br>Vient ensuite la psalmodie, qui comporte trois psaumes (ou sections de psaumes si les psaumes occurrents sont trop longs). Pendant le Triduum pascal, aux jours des octaves de Pâques et de Noël, ainsi qu’aux solennités et aux fêtes, il y a des psaumes propres, avec leurs antiennes propres. En revanche, aux dimanches et aux féries, les psaumes avec leurs antiennes sont pris dans le cycle ordinaire du psautier. On les prend de même au cycle ordinaire du psautier pour la mémoire des saints, à moins qu’il n’y ait des psaumes et des antiennes propres, comme il est expliqué aux nn. 218 et ss.<br><br>Entre la psalmodie et les lectures, on dit habituellement un verset qui fait passer, dans la prière, de la récitation des psaumes à l’audition des lectures.<br><br>On fait deux lectures : la première est biblique, la seconde est tirée des écrits des Pères ou des écrivains ecclésiastiques ; ou encore elle est hagiographique.<br><br>Après chaque lecture, on dit un répons (cf. nn. 169 à 172).<br><br>Habituellement, il faut prendre la lecture biblique qui se trouve dans le propre du temps, suivant les règles qui seront données ci-dessous aux nn. 140 à 155. Aux solennités et aux fêtes, en revanche, la lecture biblique est prise dans le propre ou le commun.<br><br>La seconde lecture avec son répons est prise soit dans le livre de la Liturgie des Heures, soit dans le lectionnaire facultatif dont il est question ci-dessous au n. 161. C’est ordinairement celle que présente le propre du temps. Mais aux solennités et aux fêtes, on utilise une lecture propre, qui est hagiographique ; à son défaut, on prend la seconde lecture dans le commun des saints correspondant. De même, pour la mémoire des saints dont la célébration n’est pas empêchée, la lecture hagiographique est prise à la place de la seconde lecture occurrente (cf. nn. 166, 235).<br><br>Aux dimanches en dehors du Carême, aux jours dans les octaves de Pâques et de Noël, aux solennités et aux fêtes, après la seconde lecture et son répons, on dit l’hymne « A toi Dieu » (Te Deum), que l’on omet, en revanche, aux mémoires et aux féries. La dernière partie de cette hymne, du verset « Sauve ton peuple » jusqu’à la fin, peut être omise à volonté.<br><br>L’office de lecture se termine par l’oraison propre et, au moins dans la célébration commune, par l’acclamation « Bénissons le Seigneur. – Nous rendons grâce à Dieu. ».");

texte_final = texte_final.concat("<h3>IV. Les vigiles</h3>");
texte_final = texte_final.concat("La vigile pascale est célébrée par toute l’Église telle qu’elle est décrite dans les différents livres liturgiques. « La vigile de cette nuit est si grande, dit saint Augustin, qu’elle seule peut revendiquer comme propre ce nom qui lui est commun avec les autres. » « Nous la passons à veiller, cette nuit au cours de laquelle le Seigneur est ressuscité... et a inauguré pour nous, dans sa chair, la vie... qui ne connaît ni mort ni sommeil... ; ainsi donc, celui dont nous chantons la résurrection en prolongeant un peu plus notre veillée, nous accordera de régner avec lui dans une vie sans fin. »<br><br>Comme à la veillée de Pâques, on a pris l’habitude dans diverses églises de commencer par une vigile diverses solennités, notamment, en premier lieu, la Nativité du Seigneur et le jour de la Pentecôte. Cette coutume doit être conservée et encouragée, suivant l’usage propre à chaque Église. Là où existe éventuellement l’habitude de rehausser par une vigile d’autres solennités ou des pèlerinages, on observera les règles générales données pour les célébrations de la parole de Dieu.<br><br>Les Pères et les auteurs spirituels ont très souvent exhorté les fidèles, et surtout ceux qui mènent la vie contemplative, à la prière nocturne qui traduit et stimule l’attente du Seigneur qui reviendra : « Au milieu de la nuit, un cri se fit entendre : voici l’époux qui vient, sortez à sa rencontre » (Mt 25,6) ; « Veillez donc, car vous ne savez quand viendra le maître de la maison, le soir, à minuit, au chant du coq ou le matin, de peur que, s’il vient à l’improviste, il ne vous trouve endormis » (Mc 13,35). Ils sont donc dignes d’éloge, tous ceux qui conservent à l’office de lecture son caractère nocturne.<br><br>En outre, puisque dans le rite romain, en tenant compte surtout des besoins de ceux qui se dévouent aux travaux de l’apostolat, l’office de lecture doit rester toujours aussi bref, ceux qui désirent prolonger, suivant la tradition, la célébration de la vigile du dimanche, des solennités et des fêtes procéderont de la manière suivante. On célébrera d’abord l’office de lecture tel qu’il est donné dans le livre de la Liturgie des Heures, jusqu’aux lectures inclusivement. Mais après les deux lectures et avant l’hymne « A toi, Dieu » (Te Deum), on ajoutera les cantiques indiqués à cet effet dans l’appendice du livre en question. Puis, on lira l’Évangile, suivi, s’il y a lieu, d’une homélie, après quoi on chantera l’hymne « A toi, Dieu » et on dira l’oraison. Pour les solennités et les fêtes, on prendra l’Évangile dans le lectionnaire de la messe et, pour les dimanches, dans la série de lectures sur le mystère pascal, qui est indiquée en appendice du livre de la Liturgie des Heures.");

texte_final = texte_final.concat("<h3>V. Tierce, sexte et none, ou l’Heure médiane</h3>");
texte_final = texte_final.concat("En vertu d’une très ancienne tradition, les chrétiens ont l’habitude de prier, par dévotion privée, à divers moments de la journée, même au milieu du travail, pour imiter l’Église apostolique ; cette tradition s’est traduite par des célébrations diverses au cours des âges.<br><br>L’usage liturgique, en Occident comme en Orient, a retenu tierce, sexte et none, surtout à cause du lien qui rattache à ces Heures la mémoire de la passion du Seigneur et celle de la première propagation de l’Évangile.<br><br>Le deuxième Concile du Vatican a décidé que l’on garderait au chœur les petites Heures de tierce, sexte et none. L’usage liturgique de dire ces trois Heures doit être conservé, sauf droit particulier, par ceux qui mènent la vie contemplative ; et même il est recommandé à tous, surtout à ceux qui font une retraite spirituelle ou participent à une réunion de pastorale.<br><br>Mais, en dehors du chœur, le droit particulier étant sauf, il est permis de choisir une seule de ces trois Heures, accordée au moment de la journée, de sorte que soit conservée la tradition d’une prière au milieu du travail de chaque jour. Quant à ceux qui n’acquittent pas les trois Heures, ils doivent en célébrer au moins une, de façon à maintenir la tradition de prier dans la journée, au milieu du travail.<br><br>L’ordonnance de tierce, sexte et none est donc établie de façon à tenir compte à la fois de ceux qui disent une seule Heure, ou « Heure médiane », et de ceux qui ont l’obligation ou le désir de les dire toutes trois.<br><br>Tierce, sexte et none, ou l’Heure médiane, commencent par le verset d’introduction : « Dieu, viens à mon aide », avec « Gloire au Père », « Au Dieu qui est » et « Alléluia » (qu’on omet en Carême). On dit ensuite l’hymne qui convient à l’Heure. Vient alors la psalmodie, puis la lecture brève, suivie du verset. Chaque Heure se termine par l’oraison et, au moins dans la célébration commune, par l’acclamation « Bénissons le Seigneur. – Nous rendons grâce à Dieu ».<br><br>Pour chaque Heure sont proposées des hymnes et des oraisons différentes, qui peuvent convenir à la vérité du temps selon la tradition, et qui peuvent le mieux assurer la sanctification de la journée ; c’est pourquoi celui qui dit une seule Heure doit choisir les éléments qui conviennent à cette Heure-là. Les lectures brèves et les oraisons varient, en outre, selon la nature du jour, du temps ou de la fête.<br><br>On propose une double psalmodie : une psalmodie courante et une psalmodie complémentaire. Celui qui dit une seule Heure prendra la psalmodie courante. Celui, en revanche, qui dit plusieurs petites Heures prendra pour l’une d’elles la psalmodie courante, pour les autres la psalmodie complémentaire.<br><br>La psalmodie courante est constituée par trois psaumes (ou sections de psaumes s’il s’agit de psaumes trop longs) tirés du texte du psautier, dits avec leurs antiennes, à moins que ce ne soit indiqué autrement en son lieu. Aux solennités, au Triduum pascal et aux jours dans l’octave de Pâques, on utilise des antiennes propres avec trois psaumes à choisir dans la psalmodie complémentaire, à moins qu’on ne doive employer des psaumes spéciaux ou que la célébration de la solennité ne tombe un dimanche ; en ce cas on prend les psaumes au dimanche de la première semaine.<br><br>La psalmodie complémentaire comprend des groupes de trois psaumes, choisis habituellement parmi les psaumes appelés « graduels ».");

texte_final = texte_final.concat("<h3>VI. Complies</h3>");
texte_final = texte_final.concat("Complies est la dernière prière du jour, à faire avant le repos de la nuit, même après minuit le cas échéant.<br><br>Complies commence, comme les autres Heures, par le verset « Dieu, viens à mon aide » avec « Gloire au Père », « Au Dieu qui est » et « Alléluia » (qu’on omet en Carême).<br><br>Ensuite, il est très louable de faire un examen de conscience ; dans la célébration commune, celui-ci se fait en silence ou s’insère dans un acte pénitentiel suivant les formules du Missel romain.<br><br>Ensuite on dit l’hymne appropriée.<br><br>La psalmodie comprend, le dimanche, après les premières vêpres, les psaumes 4 et 133, et après les secondes vêpres, le psaume 90. Pour les autres jours, les psaumes ont été choisis de façon à stimuler surtout la confiance en Dieu ; mais il est permis de leur substituer les psaumes du dimanche, principalement pour la commodité de ceux qui voudraient dire complies de mémoire.<br><br>Après la psalmodie, on fait la lecture brève, que suit le répons « En tes mains, Seigneur » (In manus tuas). Ensuite on dit, avec son antienne, le cantique évangélique « Maintenant, ô Maître Souverain » (Nunc dimittis), qui est en quelque sorte le sommet de toute cette Heure liturgique.<br><br>On dit l’oraison finale indiquée dans le psautier.<br><br>Après l’oraison, on dit, même quand on est seul, la bénédiction « Que le Seigneur... » (Noctem quietam).<br><br>On dit ensuite l’une des antiennes de la Sainte Vierge. Pendant le Temps pascal, ce sera toujours Regina cæli. En plus des antiennes données dans le livre de la Liturgie des Heures, d’autres peuvent être approuvées par les Conférences épiscopales.");

texte_final = texte_final.concat("<h3>VII. Comment rattacher, s’il y a lieu, les Heures de l’office à la messe, ou entre elles</h3>");
texte_final = texte_final.concat("Dans certains cas particuliers, si les circonstances le demandent, on peut établir, dans la célébration publique ou commune, une liaison plus étroite entre la messe et une Heure de l’office, selon les règles qui suivent, pourvu que la messe et l’Heure en question relèvent du même office. On prendra garde cependant à ce que ce ne soit pas au détriment de l’intérêt pastoral des fidèles, surtout le dimanche.<br><br>Quand on célèbre l’office du matin, au chœur ou en commun, immédiatement avant la messe, on pourra commencer la célébration par le verset d’introduction et l’hymne des laudes surtout les jours de férie, ou bien par le chant et la procession d’entrée, puis la salutation du célébrant, surtout les jours de fête. On omet donc, suivant le cas, un des deux rites de début. On poursuit par la psalmodie de l’Heure, dite de la manière habituelle, jusqu’à la lecture brève exclusivement. Après la psalmodie, en omettant l’acte pénitentiel et le Kyrie, on dit le Gloria, selon les rubriques, et le célébrant dit l’oraison de la messe. Suit la liturgie de la Parole à la manière habituelle. La prière universelle se fait à l’endroit et suivant la formule usités pour la messe. Cependant, les jours de férie, à la messe matinale, on peut remplacer le formulaire quotidien de la prière universelle par les prières de l’office du matin. Après la communion accompagnée de son chant propre, on chante le Benedictus avec son antienne ; ensuite on dit la prière de la postcommunion et le reste comme d’habitude.<br><br>Si la messe est immédiatement précédée par la célébration publique d’une Heure médiane, c’est-à-dire tierce, sexte ou none, selon que le requiert la vérité des Heures, la célébration pourra commencer, de la même façon, soit par le verset d’introduction et l’hymne de l’Heure en question, surtout les jours de férie, soit par le chant et la procession d’entrée et la salutation du célébrant, surtout les jours de fête, en omettant, suivant le cas, un des deux rites de début. On enchaîne ensuite la psalmodie de l’Heure, dite de la manière habituelle, jusqu’à la lecture brève exclusivement. Après la psalmodie, en omettant l’acte pénitentiel et, si on le juge bon, le Kyrie, on dit le Gloria, selon les rubriques, et le célébrant dit la collecte de la messe.<br><br>De la même façon que l’office du matin, l’office du soir peut être rattaché à la messe qu’il précède immédiatement. Cependant, les premières vêpres des solennités, des dimanches ou des fêtes du Seigneur qui tombent un dimanche, ne peuvent se célébrer qu’une fois terminée la messe du jour précédent ou du samedi.<br><br>Quand l’Heure médiane, c’est-à-dire tierce, sexte ou none, ou l’office du soir suit la messe, celle-ci est célébrée de la façon habituelle jusqu’à la postcommunion inclusivement. Lorsque la postcommunion est dite, on commence immédiatement la psalmodie de l’Heure. À l’Heure médiane, lorsque la psalmodie est achevée, on omet la lecture brève, et on dit tout de suite l’oraison et la formule de renvoi, comme à la messe. Quand il s’agit de l’office du soir, lorsque la psalmodie est achevée, on omet la lecture, on dit tout de suite le Magnificat avec son antienne, puis, en omettant les prières et l’oraison dominicale, on dit l’oraison conclusive et on bénit le peuple.<br><br>A l’exception de la nuit de Noël, la jonction de la messe avec l’office de lecture est, en règle générale, exclue, car la messe a son propre cycle de lectures qu’il convient de garder distinct de celui de l’office. Si toutefois, dans quelques cas exceptionnels, il faut procéder ainsi, alors, aussitôt après la seconde lecture de l’office et son répons, en omettant le reste on commence la messe par le Gloria, si on doit le dire ; autrement on la commence par la collecte.<br><br>Si l’office de lecture est dit immédiatement avant une autre Heure de l’office, on peut placer avant le début de l’office de lecture l’hymne propre à l’Heure en question ; ensuite, à la fin de l’office de lecture, on omet l’oraison et la conclusion, tandis qu’à l’Heure qui suit on omet le verset d’introduction avec le « Gloire au Père ».");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='liturgie_heures_chapitre3'>");
sommaire = sommaire.concat("<li><a href='#liturgie_heures_chapitre3'>Chapitre III : Les divers éléments de la Liturgie des Heures</a></li>");

texte_final = texte_final.concat("<h2>Chapitre III : Les divers éléments de la Liturgie des Heures</h2>");
texte_final = texte_final.concat("<h3>I. Les psaumes et leur relation avec la prière chrétienne</h3>");
texte_final = texte_final.concat("Dans la Liturgie des Heures, l’Église prie en grande partie avec ces chants magnifiques composés, sous l’inspiration de l’Esprit Saint, par les auteurs sacrés de l’Ancien Testament. De leur origine, en effet, ces poèmes tiennent la vertu d’élever à Dieu l’esprit des hommes, d’éveiller en eux des sentiments religieux et saints, de les aider admirablement à rendre grâce dans les circonstances heureuses, et de leur apporter consolation et force d’âme dans l’adversité.<br><br>Cependant, les psaumes ne font qu’esquisser la plénitude des temps qui est apparue dans le Christ Seigneur et dans laquelle la prière de l’Église puise sa force. Il n’est donc pas étonnant si, tous les chrétiens étant d’accord pour estimer hautement les psaumes, telle ou telle difficulté surgit parfois lorsqu’on essaie de s’approprier dans la prière ces poèmes vénérables.<br><br>Mais l’Esprit Saint, sous l’inspiration duquel les psalmistes ont chanté, vient toujours avec sa grâce au secours des croyants qui chantent ces poèmes avec bonne volonté. En outre, il est nécessaire que, chacun selon ses forces, « ils se procurent une connaissance plus abondante de la Bible, et principalement des psaumes », et qu’ils comprennent comment, par quelle méthode, ils peuvent bien prier en les récitant.<br><br>Les psaumes ne sont pas des textes à lire, ni des prières en prose, mais des poèmes de louange. Bien qu’ils aient pu quelquefois avoir été utilisés sous forme de lecture, cependant, c’est à juste titre, en raison de leur genre littéraire, qu’ils sont appelés en hébreu Tehillim, c’est-à-dire « cantiques de louange », et en grec psalmoi, c’est-à-dire « cantiques à chanter au son du psaltérion ». En effet, tous les psaumes possèdent un caractère musical qui détermine la manière dont il convient de les chanter. C’est pourquoi, même si le psaume est dit sans être chanté, et même dans la solitude et en silence, cette récitation doit être commandée par son caractère musical : sans doute il présente un texte à notre esprit, mais il tend davantage à toucher les cœurs de ceux qui psalmodient et de ceux qui écoutent, voire de ceux qui jouent « sur le psaltérion et la cithare ».<br><br>Celui qui sait vraiment psalmodier parcourt donc les versets en les méditant l’un après l’autre ; il est toujours prêt dans son cœur à y répondre comme le veut l’Esprit, qui a inspiré le psalmiste et inspirera aussi ceux qui sont prêts à recevoir sa grâce. C’est pourquoi la psalmodie, tout en exigeant le respect qui convient à la majesté de Dieu, doit se dérouler dans la joie du cœur et la douceur de l’amour, ainsi qu’il convient à la poésie sacrée et au chant divin, mais surtout à la liberté des enfants de Dieu.<br><br>Sans doute, nous pouvons souvent prier avec facilité et ferveur sur les paroles du psaume, en rendant grâce et en glorifiant Dieu dans l’allégresse, ou bien en le suppliant du fond de nos angoisses. Cependant d’autres fois – surtout si le psaume ne s’adresse pas immédiatement à Dieu – une difficulté peut surgir. Le psalmiste en effet, justement parce qu’il est poète, s’adresse souvent au peuple, par exemple en rappelant l’histoire d’Israël ; parfois il interpelle d’autres créatures, sans excepter celles qui sont dépourvues de raison. Il fait parler Dieu et les hommes, voire, comme dans le psaume 2, les ennemis de Dieu. On voit par là que le psaume ne prie pas de la même manière qu’une prière ou une collecte composée par l’Église. En outre, ce qui s’accorde avec la nature poétique et musicale des psaumes, c’est qu’ils ne s’adressent pas nécessairement à Dieu, mais qu’ils sont chantés devant Dieu, comme nous en avertit saint Benoît : « Considérons donc comment il faut être sous le regard de la Divinité et de ses anges, et tenons-nous dans la psalmodie de façon que notre âme soit accordée à notre voix. »<br><br>Celui qui psalmodie ouvre son cœur aux sentiments dont les psaumes sont animés, chacun selon son genre littéraire, que ce soit le genre de lamentation, de confiance, d’action de grâce, ou qu’il y ait d’autres genres, soulignés à juste titre par les exégètes.<br><br>En s’appliquant au sens littéral des psaumes, celui qui les chante s’attache à leur importance pour la vie humaine des croyants. Il est certain, en effet, que chaque psaume a été composé dans des circonstances particulières, que les titres qui les précèdent dans le psautier hébraïque cherchent à évoquer. Mais quoi qu’il en soit de son origine historique, chaque psaume a un sens littéral que, même à notre époque, nous ne pouvons pas négliger. Et bien que ces poèmes soient nés en Orient il y a de nombreux siècles, ils expriment bien les douleurs et l’espérance, la misère et la confiance des hommes de toute époque et de toute région, et, surtout, ils chantent la foi en Dieu, ainsi que la révélation et la rédemption.<br><br>Celui qui psalmodie dans la Liturgie des Heures ne psalmodie pas tellement en son propre nom qu’au nom de tout le Corps du Christ, et même en tenant la place du Christ lui-même. Si l’on se rappelle cela, les difficultés disparaissent, au cas où l’on s’aperçoit que les sentiments intimes, tandis que l’on psalmodie, sont en désaccord avec les sentiments exprimés par le psaume ; par exemple, si étant accablé de tristesse, on rencontre un psaume de jubilation, ou bien, dans le succès, un psaume de lamentation. Dans la prière purement privée, il est facile d’éviter cet inconvénient, car on est libre de choisir un psaume accordé à ses sentiments. Mais dans l’office divin, on ne psalmodie pas à titre privé : c’est au nom de l’Église que le cycle officiel des psaumes est pratiqué même par celui qui dit une Heure en étant seul. Celui qui psalmodie au nom de l’Église peut toujours trouver un motif de joie ou de tristesse car, en ce sens aussi, se vérifie la parole de l’Apôtre : « Joyeux avec ceux qui sont joyeux, pleurant avec ceux qui pleurent » (Rm 12,15) ; et ainsi la fragilité humaine, blessée par l’amour de soi, est guérie à ce niveau de charité où l’âme s’accorde avec la voix chez celui qui psalmodie.<br><br>Celui qui psalmodie au nom de l’Église doit s’attacher au sens plénier des psaumes, surtout à leur sens messianique, car c’est à cause de lui que l’Église a adopté le psautier. Ce sens messianique a été pleinement manifesté dans le Nouveau Testament, et même il a été clairement exprimé par le Christ Seigneur lorsque celui-ci disait aux Apôtres : « Il fallait que s’accomplisse tout ce qui a été écrit de moi dans la Loi de Moïse, les prophètes et les psaumes » (Lc 24,44). Un exemple bien connu de ce fait est le dialogue, chez saint Matthieu, au sujet du Messie, fils de David et son Seigneur, où le psaume 109 s’entend du Messie. En continuant dans cette voie, les Pères de l’Église ont reçu et expliqué tout le psautier comme une prophétie concernant le Christ et l’Église ; et c’est pour cette raison que les psaumes ont été choisis pour la liturgie. Bien que parfois on ait admis certaines interprétations artificielles, en général les Pères aussi bien que la liturgie ont entendu légitimement dans les psaumes le Christ criant vers son Père, ou le Père parlant avec son Fils ; ils y reconnaissaient même la voix de l’Église, des Apôtres ou des martyrs. Cette méthode d’interprétation a fleuri encore au moyen âge : en effet, dans beaucoup de psautiers manuscrits du moyen âge, on proposait aux utilisateurs des psaumes un sens christologique indiqué dans le titre de chacun. L’interprétation christologique ne s’est jamais restreinte aux psaumes considérés comme messianiques, mais elle s’étend à beaucoup d’autres ; pour certains ce sont de simples appropriations, mais recommandées par la tradition de l’Église. Surtout pour la psalmodie des jours de fête, les psaumes ont été choisis pour un motif christologique, et c’est pour le mettre en lumière que l’on propose souvent des antiennes tirées des psaumes eux-mêmes.");

texte_final = texte_final.concat("<h3>II. Les antiennes et les autres éléments qui aident à prier avec les psaumes</h3>");
texte_final = texte_final.concat("Il y a trois éléments, dans la tradition latine, qui ont beaucoup contribué à faire comprendre les psaumes ou à les convertir en prière chrétienne : ce sont les titres, les collectes psalmiques et surtout les antiennes.<br><br>Dans le psautier de la Liturgie des Heures, chaque psaume est précédé d’un titre indiquant son sens et son importance pour la vie humaine du croyant. Ces titres ne sont proposés dans le livre de la Liturgie des Heures que pour rendre service à ceux qui disent les psaumes. Pour faciliter la prière à la lumière de la révélation nouvelle, une phrase du Nouveau Testament et des Pères y est ajoutée, qui invite à prier dans le sens christologique.<br><br>Les collectes psalmiques qui peuvent aider ceux qui récitent les psaumes à bien les comprendre, surtout dans le sens chrétien, sont proposées pour chaque psaume en appendice du livre de la Liturgie des Heures, et on peut librement les employer conformément à l’ancienne tradition : après qu’on a terminé le psaume et observé un moment de silence, la collecte rassemble les sentiments de tous et conclut leur psalmodie.<br><br>Même si la Liturgie des Heures est accomplie sans que l’on chante, chaque psaume a son antienne, que l’on doit dire même lorsqu’on est seul. En effet, les antiennes aident à mettre en lumière le genre littéraire du psaume ; elles transforment le psaume en prière personnelle ; elles soulignent une phrase digne d’attention, qui aurait pu échapper ; elles donnent à l’un ou l’autre psaume une nuance particulière selon les circonstances ; surtout, pourvu qu’elles excluent les accommodations arbitraires, elles secondent efficacement l’interprétation typologique ou correspondant à la fête ; elles apportent de l’agrément et de la variété dans la récitation des psaumes.<br><br>Les antiennes du psautier sont organisées de façon à pouvoir être traduites dans les langues vivantes, et en outre à pouvoir être répétées après chaque strophe, selon ce qui est dit au n. 125. Dans l’office du Temps ordinaire célébré sans chanter, on peut, si on le juge bon, remplacer ces antiennes par les phrases jointes aux psaumes dont il est question au n. 111.<br><br>Quand un psaume, en raison de sa longueur, peut être divisé en plusieurs sections à l’intérieur de la même Heure canoniale, une antienne propre est donnée pour chaque section, afin d’apporter de la variété, surtout dans la célébration chantée, et aussi pour faire mieux percevoir les richesses du psaume ; mais il est permis d’aller jusqu’au bout du psaume sans interruption, en n’employant que la première antienne.<br><br>Il y a des antiennes propres pour chacun des psaumes à l’office du matin et à celui du soir dans le Triduum pascal, aux jours dans les octaves de Pâques et de Noël et aussi aux dimanches du temps de l’Avent, de Noël, du Carême et de Pâques ; de même aux féries de la semaine sainte, du Temps pascal et aux jours qui vont du 17 au 24 décembre.<br><br>Des antiennes propres sont proposées pour les solennités, à l’office de lecture, à l’office du matin, à tierce, sexte, none et à l’office du soir ; à leur défaut, on prend les antiennes au commun. Pour les fêtes, on observe la même règle, à l’office de lecture, à ceux du matin et du soir.<br><br>Si les mémoires de saints ont des antiennes propres, on les garde (cf. n. 235).<br><br>Les antiennes à Benedictus et à Magnificat, pour l’office du temps, se prennent au propre du temps, s’il en comporte, sinon au psautier courant ; pour les solennités et les fêtes des saints, on les prend au propre, s’il en comporte, sinon au commun ; pour les mémoires, qui n’ont pas d’antienne propre, on dit à son gré l’antienne du commun ou de la férie.<br><br>Au Temps pascal, on ajoute Alléluia à toutes les antiennes, sauf si cela est en désaccord avec le sens de l’antienne.");

texte_final = texte_final.concat("<h3>III. La manière de psalmodier</h3>");
texte_final = texte_final.concat("Selon que le requiert le genre littéraire du psaume ou sa longueur, de même, selon que le psaume est dit en latin ou en langue vivante, et surtout selon qu’il est dit par un seul ou par plusieurs, ou que la célébration se fait avec le peuple rassemblé, on peut proposer une façon ou une autre de dire les psaumes, pour que ceux qui psalmodient perçoivent plus facilement le parfum spirituel et littéraire des psaumes. Ceux-ci ne sont pas employés comme une quantité quelconque de prière, mais on a veillé à la variété, et tenu compte du caractère propre de chaque psaume.<br><br>Les psaumes sont chantés ou dits d’un seul trait (in directum), ou bien en alternant les versets entre deux chœurs ou deux parties de l’assemblée, ou bien selon le mode responsorial, selon les diverses manières approuvées par la tradition ou l’expérience.<br><br>Au début de chaque psaume, on prononcera son antienne, comme il a été dit ci-dessus aux nn. 113 -120 ; et à la fin du psaume entier on gardera l’usage de le conclure par « Gloire au Père ». En effet, « Gloire au Père » est la conclusion qui convient, la tradition la recommande, et elle apporte à la prière de l’Ancien Testament un sens laudatif, christologique et trinitaire. Après le psaume, si on le juge bon, on reprend l’antienne.<br><br>Quand on emploie des psaumes trop longs, les divisions de ces psaumes sont marquées dans le psautier ; elles partagent les phases de la psalmodie de façon à dessiner la structure ternaire de l’Heure, tout en respectant strictement le sens objectif du psaume. Il convient d’observer cette division surtout dans la célébration chorale accomplie en latin, en ajoutant « Gloire au Père » à la fin de chaque section. Il est permis cependant ou bien de garder ce mode traditionnel, ou bien de faire une pause entre les diverses parties d’un même psaume, ou bien de dire d’un trait le psaume entier avec son antienne.<br><br>En outre, quand le genre littéraire du psaume le suggérera, ses divisions en strophes seront indiquées, pour que, surtout dans le chant en langue vivante, on puisse le dire en répétant l’antienne après chaque strophe. En ce cas, on se contentera de dire « Gloire au Père » à la fin de tout le psaume.");

texte_final = texte_final.concat("<h3>IV. Principes de la répartition des psaumes dans l’office</h3>");
texte_final = texte_final.concat("Les psaumes sont répartis sur un cycle de quatre semaines. Cependant un très petit nombre de psaumes sont omis ; d’autres, que la tradition a distingués, sont répétés assez souvent ; enfin l’office du matin, celui du soir et complies sont pourvus de psaumes accordés à chacune de ces heures.<br><br>Pour les offices du matin et du soir, parce que ce sont des Heures destinées davantage à être célébrées avec le peuple, on a choisi les psaumes les plus appropriés à une telle célébration.<br><br>A complies on observera la règle indiquée ci-dessus, n. 88.<br><br>Pour le dimanche, même à l’office de lecture et à l’Heure médiane, on a choisi les psaumes qui, selon la tradition, sont particulièrement capables d’exprimer le mystère pascal. Au vendredi on a assigné certains psaumes parce qu’ils sont pénitentiels ou se rapportent à la Passion.<br><br>On réserve pour les temps de l’Avent, de Noël, du Carême et de Pâques trois psaumes : 77, 104 et 105, qui dévoilent plus clairement dans l’histoire de l’Ancien Testament la préfiguration de ce qui se réalise dans le Nouveau.<br><br>Trois psaumes : 57, 82 et 108, où dominent les imprécations, sont omis dans le cycle du psautier. De même, on passe certains versets dans différents psaumes, comme c’est indiqué en tête de chacun d’eux. Ces omissions ont pour but d’éviter une difficulté psychologique, bien que les psaumes d’imprécations eux-mêmes se rencontrent dans la piété du Nouveau Testament, par exemple Ap 6,10, et ne visent nullement à suggérer aux chrétiens de maudire qui que ce soit.<br><br>Les psaumes trop longs pour tenir dans une seule Heure de l’office sont répartis entre différents jours à la même Heure, de telle sorte qu’ils puissent être dits intégralement par ceux qui n’ont pas coutume de réciter d’autres Heures. C’est ainsi que le psaume 118, selon la division qui lui est propre, est réparti sur vingt-deux jours à l’Heure médiane, car la tradition l’attribue aux Heures diurnes.<br><br>Le cycle de quatre semaines du psautier s’articule avec l’année liturgique de telle sorte qu’on le reprenne à la première semaine, fût-ce en omettant les autres : le premier dimanche de l’Avent, la première semaine du Temps ordinaire, le premier dimanche de Carême, le dimanche de Pâques. Après la Pentecôte, puisque, pendant le Temps ordinaire, le cycle du psautier suit la série des semaines, on reprend à la semaine du psautier qui est indiquée dans le propre du temps au début de la semaine ordinaire dont il s’agit.<br><br>Pour les solennités et les fêtes, le Triduum pascal, les jours dans l’octave de Pâques et de Noël, à l’office de lecture sont assignés des psaumes propres, parmi ceux qui sont recommandés par la tradition, et leur convenance est mise en lumière, la plupart du temps, par l’antienne. C’est ce qui se passe même pour l’Heure médiane, à certaines solennités du Seigneur et dans l’octave de Pâques. Pour l’office du matin, on prend les psaumes et le cantique au premier dimanche du psautier. Aux premières vêpres des solennités, les psaumes sont de la série Laudate selon l’usage ancien. À l’office du soir des solennités et des fêtes, les psaumes et le cantique sont propres. À l’Heure médiane des solennités, excepté celles dont on vient de parler, et si elles ne tombent pas le dimanche, les psaumes sont pris aux psaumes graduels ; à l’Heure médiane des fêtes, on dit les psaumes de la férie.<br><br>Dans les autres cas on dit les psaumes selon le cycle du psautier, à moins qu’il n’y ait des antiennes propres ou des psaumes propres.");

texte_final = texte_final.concat("<h3>V. Les cantiques de l’Ancien et du Nouveau Testament</h3>");
texte_final = texte_final.concat("A l’office du matin, entre le premier et le dernier psaume, se place, selon la coutume, un cantique de l’Ancien Testament. Outre la série reçue de l’ancienne tradition romaine, et une seconde introduite dans le bréviaire par saint Pie X, on a ajouté dans le psautier plusieurs cantiques tirés de divers livres de l’Ancien Testament, pour que chacune des féries des quatre semaines ait son cantique propre ; les dimanches, on fait alterner les deux parties du cantique des Trois Enfants.<br><br>A l’office du soir, après les deux psaumes, se place un cantique du Nouveau Testament, tiré des Épîtres ou de l’Apocalypse. Sept cantiques sont indiqués, un pour chaque jour de la semaine. Mais les dimanches de Carême, au lieu du cantique alléluiatique tiré de l’Apocalypse, on dit le cantique de la première épître de Pierre ; en outre, à la solennité de l’Épiphanie et à la fête de la Transfiguration du Seigneur, on dit le cantique indiqué en son lieu, tiré de la Première Épître à Timothée.<br><br>Les cantiques évangéliques Benedictus, Magnificat, Nunc dimittis jouissent de la même solennité et dignité que les lectures tirées de l’Évangile.<br><br>Aussi bien la psalmodie que les lectures se suivent en observant cette loi de la tradition : on proclame d’abord l’Ancien Testament, ensuite l’Apôtre, et finalement l’Évangile.");

texte_final = texte_final.concat("<h3>VI. La lecture de la Sainte Écriture</h3>");
texte_final = texte_final.concat("<h4>a. La lecture de la Sainte Écriture en général</h4>");
texte_final = texte_final.concat("La lecture de la Sainte Écriture qui, d’après l’antique tradition, se fait publiquement dans la liturgie, et non pas seulement dans la célébration eucharistique, mais aussi dans l’office divin, doit être hautement estimée par tous les chrétiens parce que c’est l’Église qui la propose non pour obéir à un choix individuel ou à un penchant excessif, mais en relation avec le Mystère que l’Épouse du Christ « déploie pendant le cycle de l’année, de l’Incarnation et la Nativité jusqu’à l’Ascension, jusqu’au jour de la Pentecôte, et jusqu’à l’attente de la bienheureuse espérance et de l’avènement du Seigneur ». De plus, dans la célébration liturgique, la prière accompagne toujours la lecture de l’Écriture sainte, pour que la lecture porte plus de fruit et qu’en revanche la prière, surtout celle des psaumes, soit mieux comprise et devienne plus fervente grâce à la lecture.<br><br>Dans la Liturgie des Heures on propose une lecture de l’Écriture sainte, tantôt longue et tantôt brève.<br><br>La lecture longue qu’on peut faire à son gré, à l’office du matin et à l’office du soir, est décrite plus haut, n. 46.");

texte_final = texte_final.concat("<h4>b. Le cycle de lecture d’Écriture sainte à l’office de lecture</h4>");
texte_final = texte_final.concat("Dans le cycle des lectures de l’Écriture sainte à l’office de lecture, on tient compte des temps sacrés où l’on doit lire certains livres selon une tradition vénérable, et aussi du cycle des lectures de la messe. Ainsi donc la Liturgie des Heures s’articule avec la messe pour que la lecture scripturaire à l’office complète celle qui se fait à la messe et que nous soit présenté un panorama complet de toute l’histoire du salut.<br><br>Sauf l’exception prévue au n. 73, on ne lit pas l’Évangile à la Liturgie des Heures, puisqu’il est lu chaque année intégralement à la messe.<br><br>Il y a un double cycle de lecture biblique : l’un, qui figure dans le livre de la Liturgie des Heures ne comporte qu’une année ; l’autre, qu’on peut librement employer, et qui se trouve dans le supplément, s’étend sur deux années, comme le cycle de lecture de la messe pour les féries du Temps ordinaire.<br><br>Le cycle bisannuel est agencé de telle sorte que presque tous les livres de la Sainte Écriture se lisent chaque année, soit à la messe, soit à la Liturgie des Heures, et que les textes longs et difficiles, qui ne peuvent guère trouver place à la messe, sont assignés à la Liturgie des Heures. Mais le Nouveau Testament est lu intégralement chaque année, en partie à la messe et en partie à la Liturgie des Heures, tandis que pour les livres de l’Ancien Testament on a choisi les morceaux qui ont le plus d’importance pour faire comprendre l’histoire du salut et pour nourrir la piété. Mais il faut ajuster les lectures de la Liturgie des Heures et celles de la messe, pour que les mêmes textes ne soient pas proposés le même jour ou qu’on n’attribue pas les mêmes livres à peu près aux mêmes époques, ce qui réserverait à la Liturgie des Heures les péricopes les moins importantes et troublerait l’ordre du texte. Cet ajustement exige nécessairement que le même livre revienne une année sur deux, alternativement, à la messe et à la Liturgie des Heures, ou au moins, si on le lit la même année, que ce soit après un certain intervalle.<br><br>Au temps de l’Avent, selon une antique tradition, on lit des péricopes tirées du Livre d’Isaïe, en lecture semi-continue, et en alternant d’une année sur l’autre. On y ajoute le Livre de Ruth et certaines prophéties tirées du Livre de Michée. Comme on lit du 17 au 24 décembre des lectures assignées spécialement à ces jours-là, on omet celles de la troisième semaine de l’Avent qui n’ont plus leur place à ces dates.<br><br>Du 29 décembre au 5 janvier, on lit la première année l’Épître aux Colossiens, où l’Incarnation du Seigneur est envisagée dans le cadre de toute l’histoire du salut ; la deuxième année, on lit le Cantique des cantiques où est préfigurée l’union de Dieu avec l’homme dans le Christ : « Dieu le Père a fait des noces pour Dieu son Fils quand il l’a uni à la nature humaine dans le sein de la Vierge, quand celui qui est Dieu avant les siècles a voulu devenir l’homme à la fin des siècles. »<br><br>Du 7 janvier au samedi après l’Épiphanie, on lit des textes eschatologiques tirés d’Isaïe 60-66 et de Baruch ; les lectures qui n’ont pu trouver leur place sont omises cette année-là.<br><br>En Carême, on lit la première année des textes tirés du Deutéronome et de l’Épître aux Hébreux. La seconde année offre un panorama de l’histoire du salut tiré des livres de l’Exode, du Lévitique et des Nombres. L’Épître aux Hébreux explique l’ancienne alliance à la lumière du mystère pascal du Christ. De la même épître on lit un extrait le vendredi saint sur le sacrifice du Christ (9, 11-28) et le samedi saint sur le repos du Seigneur (4, 1-13). Les autres jours de la semaine sainte on lit la première année, dans le Livre d’Isaïe, le troisième et le quatrième chant du Serviteur du Seigneur, et des péricopes tirées du Livre des lamentations ; la seconde année, on lit le prophète Jérémie, comme ayant préfiguré le Christ souffrant.<br><br>Au Temps pascal, sauf les premier et deuxième dimanches de Pâques et aux solennités de l’Ascension et de la Pentecôte, on lit selon la tradition, la première année, la Première Épître de saint Pierre, l’Apocalypse et les épîtres de Jean ; la seconde année, on lit les Actes des Apôtres.<br><br>Du lundi après le dimanche du Baptême du Seigneur jusqu’au Carême, et du lundi après la Pentecôte jusqu’à l’Avent, se déroule la série continue des trente-quatre dimanches du Temps ordinaire. Cette série s’interrompt du mercredi des Cendres au dimanche de la Pentecôte ; le lundi après le dimanche de la Pentecôte, on reprend la lecture du Temps ordinaire, à la semaine qui suit celle que le Carême est venu interrompre, en omettant la lecture assignée au dimanche. Les années où l’on ne compte, dans le Temps ordinaire, que 33 semaines, on omet la semaine qui tombe immédiatement après la Pentecôte, pour que soient toujours lues les lectures des dernières semaines, qui sont de nature eschatologique. Les livres de l’Ancien Testament sont distribués selon l’histoire du salut : Dieu se révèle au cours de la vie du peuple, lequel est conduit et éclairé par étapes successives. C’est pourquoi on lit les prophètes parmi les livres historiques, en tenant compte de l’époque où ils ont vécu et enseigné. Par conséquent, la première année, la série de lectures vétéro-testamentaires propose à la fois des livres historiques et des oracles de prophètes, du livre de Josué au temps de l’exil inclusivement. La seconde année, après les lectures de la Genèse, qui se font avant le Carême, on reprend l’histoire du salut à partir de l’exil jusqu’à l’époque des Maccabées. Sont insérés dans cette même année les prophètes les plus récents, les livres sapientiaux et les récits des livres d’Esther, Tobie et Judith. Les épîtres apostoliques qui ne sont pas lues à des périodes spéciales sont réparties en tenant compte des lectures de la messe, et aussi de l’ordre chronologique dans lequel elles ont été écrites.<br><br>Quant au cycle d’une seule année, il a été abrégé de telle sorte qu’on lise chaque année des morceaux choisis de la Sainte Écriture, en tenant compte du double cycle des lectures de la messe pour qu’ils viennent le compléter.<br><br>Aux solennités et aux fêtes est assignée une lecture propre ; sinon on prend cette lecture au commun des saints.<br><br>Chaque péricope, autant que possible, observe une certaine unité ; c’est pourquoi, afin de ne pas dépasser une longueur raisonnable, bien qu’elle puisse différer selon les genres littéraires des livres, on omet parfois certains versets, ce qui est toujours indiqué. Mais il est permis et méritoire de lire le texte intégral, dans un texte approuvé.");

texte_final = texte_final.concat("<h4>c. Les lectures brèves</h4>");
texte_final = texte_final.concat("Les lectures brèves ou « capitules », dont l’importance dans la Liturgie des Heures a été signalée plus haut, n. 45, ont été choisies pour exprimer une pensée ou une exhortation avec précision et clarté. On a veillé aussi à leur variété.<br><br>On a donc établi quatre séries hebdomadaires de lectures brèves pour le Temps ordinaire ; elles sont insérées dans le psautier, de sorte que la lecture change chaque jour pendant les quatre semaines. On a aussi des séries hebdomadaires pour les temps de l’Avent, de Noël, du Carême et de Pâques. Il y a encore des lectures brèves propres pour les solennités, les fêtes et certaines mémoires, ainsi qu’une série d’une semaine pour complies.<br><br>Dans le choix des lectures brèves on a observé les points suivants.<br>a) Selon la tradition, les Évangiles sont exclus.<br>b) Autant que possible on a respecté le caractère du dimanche, ou encore du vendredi, et des heures elles-mêmes.<br>c) Les lectures de l’office du soir, puisqu’elles suivent un cantique du Nouveau Testament, ont été choisies exclusivement dans celui-ci.");

texte_final = texte_final.concat("<h3>VII. La lecture des Pères et des écrivains ecclésiastiques</h3>");
texte_final = texte_final.concat("Selon la tradition de l’Église romaine, à l’office de lecture, après la lecture biblique on a une lecture des Pères ou d’écrivains ecclésiastiques avec son répons, à moins qu’on ne doive faire une lecture hagiographique (cf. nn. 228 et 239).<br><br>Dans cette lecture on propose des textes empruntés aux écrits des saints Pères, des docteurs de l’Église et d’autres écrivains ecclésiastiques, appartenant à l’Église d’Orient comme à l’Église d’Occident, mais de telle sorte que la première place soit donnée aux Pères, qui jouissent dans l’Église d’une autorité particulière.<br><br>Outre les lectures assignées pour chaque jour dans le livre de la Liturgie des Heures, on a un lectionnaire facultatif, où l’on trouve une plus grande abondance de lectures, ouvrant plus largement à ceux qui acquittent l’office divin le trésor de la tradition de l’Église. Chacun est libre de prendre la seconde lecture soit au livre de la Liturgie des Heures, soit au lectionnaire facultatif.<br><br>En outre, les Conférences épiscopales peuvent encore préparer d’autres textes appropriés aux traditions et à la mentalité des territoires sous leur juridiction, et les insérer dans le lectionnaire facultatif, à titre de supplément. Ces textes sont empruntés aux œuvres d’écrivains catholiques éminents par leur doctrine et leur sainteté.<br><br>Le rôle de cette lecture est principalement de faire méditer la parole de Dieu telle qu’elle est reçue par l’Église dans sa tradition. Car l’Église a toujours estimé nécessaire d’éclairer pour ses fidèles la parole de Dieu de façon autorisée « afin que la ligne d’interprétation prophétique et apostolique soit maintenue selon la règle du sens ecclésial et catholique ».<br><br>Par la fréquentation assidue des documents que nous présente la tradition universelle de l’Église, les lecteurs sont amenés à méditer plus profondément la Sainte Écriture et à en acquérir un goût savoureux et vivant. En effet, les écrits des Pères sont les témoins éclatants de cette méditation de la parole de Dieu, poursuivie, à travers les siècles, par laquelle l’Épouse du Verbe incarné, l’Église « qui reste fidèle au dessein et à l’esprit de son Époux et de son Dieu » s’efforce d’acquérir chaque jour une plus profonde intelligence des Écritures.<br><br>La lecture des Pères introduit aussi les chrétiens dans le sens des temps et des fêtes liturgiques. En outre, elle leur ouvre l’accès aux inestimables richesses spirituelles qui constituent le magnifique patrimoine de l’Église, et en même temps elle fournit une base pour la vie spirituelle et un très riche aliment pour la piété. Ainsi les prédicateurs de la parole de Dieu ont chaque jour à leur disposition des modèles remarquables de prédication.");

texte_final = texte_final.concat("<h3>VIII. La lecture hagiographique</h3>");
texte_final = texte_final.concat("On appelle lecture hagiographique soit un texte d’un Père ou d’un écrivain ecclésiastique qui parle précisément du saint que l’on célèbre, soit un texte qui s’applique bien à lui : ou bien un extrait des écrits de ce saint ; ou bien le récit de sa vie.<br><br>En élaborant les propres particuliers des saints, on veillera à la vérité historique et au véritable profit spirituel de ceux qui liront ou entendront la lecture hagiographique ; on se gardera de ce qui ne fait que susciter l’étonnement ; on mettra en lumière la spiritualité particulière des saints, d’une façon adaptée aux conditions actuelles, et aussi leur importance dans la vie et la spiritualité de l’Église.<br><br>Une petite notice biographique, qui présente des notations purement historiques et résume le déroulement de la vie du saint, est placée avant la lecture elle-même, uniquement à titre de renseignement ; elle n’a pas à être proclamée dans la célébration.");

texte_final = texte_final.concat("<h3>IX. Les répons</h3>");
texte_final = texte_final.concat("La lecture biblique, à l’office de lecture, est suivie de son répons propre, dont le texte a été puisé dans le trésor traditionnel ou a été nouvellement composé. Ce répons vise à apporter une lumière nouvelle pour l’intelligence de la lecture qui vient d’être faite, à insérer cette lecture dans l’histoire du salut, ou à faire le passage de l’Ancien au Nouveau Testament, ou à transformer la lecture en prière et en contemplation, ou enfin à procurer par sa beauté poétique une agréable variété.<br><br>Semblablement, un répons approprié est adjoint à la seconde lecture ; mais il ne se relie pas aussi étroitement au texte de la lecture, et par conséquent, il favorise davantage une libre méditation.<br><br>Les répons avec leurs reprises gardent donc leur valeur même dans la récitation solitaire. Mais la partie qui est répétée dans le répons peut s’omettre lorsqu’on se contente de réciter, à moins que cette répétition ne soit exigée par le sens.<br><br>De la même manière, mais plus simplement, le répons bref des offices du matin et du soir et de complies dont on parle plus haut, nn. 49 et 89, et les versets de tierce, sexte et none répondent à la lecture brève, comme une acclamation grâce à laquelle la parole de Dieu pénètre plus profondément dans l’esprit de l’auditeur ou du lecteur. Les hymnes et les autres chants d’origine non biblique.");

texte_final = texte_final.concat("<h3>X. Les hymnes et les autres chants d’origine non biblique</h3>");
texte_final = texte_final.concat("Les hymnes, qui ont leur place dans l’office en vertu d’une tradition fort ancienne, gardent encore maintenant leur place. En vérité, non seulement par leur nature lyrique elles sont destinées expressément à la louange de Dieu, mais elles constituent un élément populaire, et même elles manifestent presque toujours d’emblée, mieux que les autres parties de l’office, le caractère propre des Heures ou de chaque fête, elles entraînent et attirent les âmes à célébrer pieusement. Leur beauté littéraire accroît souvent cette efficacité. En outre, les hymnes sont, dans l’office, comme le plus important élément poétique de création ecclésiastique.<br><br>L’hymne se termine traditionnellement par une doxologie qui, d’ordinaire, s’adresse à la même personne que l’hymne elle-même.<br><br>Dans l’office du Temps ordinaire, pour assurer de la variété, on a prévu pour toutes les Heures un double cycle d’hymnes, qu’on doit faire alterner d’une semaine sur l’autre.<br><br>En outre, à l’office de lecture on a introduit pour le Temps ordinaire, un double cycle d’hymnes, selon que celles-ci sont récitées de nuit ou de jour.<br><br>Les hymnes nouvelles peuvent être chantées sur des mélodies traditionnelles de même nombre et de même mètre.<br><br>En ce qui concerne la célébration en langue vivante, les Conférences épiscopales ont la faculté d’adapter les hymnes latines au génie de leur propre langue, ainsi que d’introduire de nouvelles créations hymnodiques, pourvu qu’elles s’accordent exactement à l’esprit de l’Heure, du temps ou de la fête ; de plus, on veillera soigneusement à ne pas admettre de petits cantiques populaires qui n’auraient aucune valeur artistique et ne répondraient pas vraiment à la dignité de la liturgie.");

texte_final = texte_final.concat("<h3>XI. Les intercessions, l’oraison dominicale, l’oraison conclusive</h3>");
texte_final = texte_final.concat("<h4>a. Les intercessions aux offices du matin et du soir</h4>");
texte_final = texte_final.concat("Certes, la Liturgie des Heures célèbre les louanges de Dieu. Cependant la tradition, aussi bien juive que chrétienne, ne sépare pas la prière de demande de la louange divine, et souvent elle fait dériver plus ou moins celle-là de celle-ci. L’Apôtre Paul recommande de faire « des supplications, des prières, des demandes, des actions de grâce pour tous les hommes : pour les rois et tous les dépositaires de l’autorité, afin que nous puissions mener une vie calme et tranquille, en toute piété et dignité. Cela est bon et agréable aux yeux de Dieu notre Sauveur, qui veut que tous les hommes soient sauvés et viennent à la connaissance de la vérité » (1 Tm 2,1-4). Plus d’une fois les Pères ont interprété cette recommandation en ce sens qu’il faut faire matin et soir des intercessions.<br><br>Les intercessions qui ont été instaurées dans la messe de rite romain se font aussi à l’office du soir, quoique d’une manière différente, qui sera décrite plus loin.<br><br>D’autre part, puisqu’il était traditionnel dans la prière que le matin on recommandât à Dieu toute la journée, on fait à l’office du matin des invocations pour recommander ou consacrer à Dieu la journée.<br><br>On appelle intercessions aussi bien les intercessions qui se font à l’office du soir, que les louanges et invocations qui se font à l’office du matin pour consacrer à Dieu la journée.<br><br>Pour varier, mais surtout afin que la diversité des besoins de l’Église et des hommes soit mieux exprimée selon la différence des états, des assemblées, des personnes, des conditions et des époques, on propose diverses formules d’intercession pour chaque jour dans le cycle du psautier, pour les temps de l’année liturgique, et aussi pour quelques célébrations festives.<br><br>De plus, les Conférences épiscopales ont le droit d’adapter les formules proposées dans le livre de la Liturgie des Heures, comme d’en approuver de nouvelles, mais en observant les règles suivantes.<br><br>Comme dans l’oraison dominicale, il faut unir aux demandes la louange de Dieu ou la reconnaissance de sa gloire, ou le rappel de l’histoire du salut.<br><br>Aux intercessions de l’office du soir, la dernière intention est toujours pour les défunts.<br><br>Puisque la Liturgie des Heures est principalement la prière de toute l’Église pour toute l’Église, et même pour le salut du monde entier, il faut que dans les intercessions les intentions universelles aient absolument la première place : c’est-à-dire qu’on prie pour l’Église avec ses différents ordres ; pour les autorités séculières ; pour ceux qui sont affligés par la pauvreté, la maladie ou le deuil ; et pour les besoins du monde entier, comme la paix et les intentions analogues.<br><br>Il est cependant permis, à l’office du matin comme à celui du soir, d’ajouter quelques intentions particulières.<br><br>Les intercessions de l’office sont dotées d’une structure qui permet de les adapter aussi bien à la célébration avec le peuple qu’à la célébration dans une petite communauté et à la récitation solitaire.<br><br>C’est pourquoi, dans la récitation avec le peuple ou en commun, les intercessions sont introduites par une brève invitation du prêtre ou du ministre, dans laquelle est proposé le modèle de la réponse que l’assemblée doit reprendre invariablement.<br><br>D’autre part, les intentions sont énoncées, en s’adressant à Dieu, de sorte qu’elles puissent convenir aussi bien à la célébration commune qu’à la récitation solitaire.<br><br>Chaque formule d’intention est composée de deux parties, dont la seconde peut être employée comme réponse variable.<br><br>Aussi peut-on adopter différentes méthodes : ou bien le prêtre ou le ministre dit les deux parties, et l’assemblée donne une réponse uniforme, ou bien observe un temps de silence ; ou encore le prêtre ou le ministre dit seulement la première partie, et l’assemblée la seconde.");

texte_final = texte_final.concat("<h4>b. L’oraison dominicale</h4>");
texte_final = texte_final.concat("Aux offices du matin et du soir, étant donné que ce sont des Heures plus populaires, après les intercessions, l’oraison dominicale trouve place en raison de sa dignité, conformément à une tradition vénérable.<br><br>L’oraison dominicale sera donc désormais dite solennellement trois fois par jour : à la messe, aux offices du matin et du soir.<br><br>Le Notre Père est dit par tous, précédé, si on le juge bon, par une brève monition.");

texte_final = texte_final.concat("<h4>c. L’oraison conclusive</h4>");
texte_final = texte_final.concat("A la fin de l’Heure, on dit pour terminer l’oraison conclusive qui, dans la célébration publique et populaire, selon la tradition, revient au prêtre ou au diacre.<br><br>Cette oraison, à l’office de lecture, est ordinairement celle qui est propre au jour. À complies, elle est toujours au psautier.<br><br>Aux offices du matin et du soir, l’oraison est prise au propre pour les dimanches, les féries du temps de l’Avent, de Noël, du Carême et de Pâques, ainsi que pour les solennités, les fêtes et les mémoires. Aux féries du Temps ordinaire, on dit l’oraison indiquée dans le psautier du jour, pour exprimer le caractère propre de ces Heures.<br><br>A tierce, sexte et none, ou à l’Heure médiane, l’oraison est prise au propre pour les dimanches et les féries du temps de l’Avent, de Noël, du Carême et de Pâques, ainsi que pour les solennités et les fêtes. Les autres jours on dit les oraisons qui expriment le caractère de l’Heure qu’on célèbre, et qui sont réparties dans le psautier.");

texte_final = texte_final.concat("<h3>XII. Le silence sacré</h3>");
texte_final = texte_final.concat("Puisque, en général, dans les actions liturgiques, on doit veiller à ce qu’on « observe aussi en son temps un silence sacré », on ménagera la possibilité de moments de silence dans la célébration de la Liturgie des Heures elle-même.<br><br>Avec réalisme et prudence, pour faciliter au maximum la résonance dans les cœurs de la voix de l’Esprit Saint, et pour unir plus étroitement la prière personnelle à la parole de Dieu et à la prière officielle de l’Église, il est permis de ménager un intervalle de silence après chaque psaume, et la reprise de son antienne, selon la coutume des anciens, et surtout si, après le silence, on ajoute une des collectes psalmiques (cf. n. 112) ; ou encore après les lectures, qu’elles soient brèves ou longues, et avant ou après le répons. On veillera cependant à ce qu’un tel silence n’amène pas à déformer la structure de l’office, ou n’apporte aux participants du désagrément ou de l’ennui.<br><br>Dans la récitation solitaire, on est plus libre de s’arrêter à méditer une formule qui suggère un élan spirituel, sans que l’office perde pour autant son caractère de prière publique.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='liturgie_heures_chapitre4'>");
sommaire = sommaire.concat("<li><a href='#liturgie_heures_chapitre4'>Chapitre IV : Les différentes célébrations dans le cycle annuel</a></li>");

texte_final = texte_final.concat("<h2>Chapitre IV : Les différentes célébrations dans le cycle annuel</h2>");
texte_final = texte_final.concat("<h3>I. La célébration des mystères du Seigneur</h3>");
texte_final = texte_final.concat("<h4>a) Le dimanche</h4>");
texte_final = texte_final.concat("L’office du dimanche commence aux premières vêpres (office du samedi soir) où tout est pris au psautier, sauf ce qui est assigné comme propre.<br><br>Quand une fête du Seigneur se célèbre le dimanche, elle a ses premières Vêpres propres (office de la veille au soir).<br><br>On a parlé plus haut, n. 73, de la façon de célébrer, si on le juge bon, les vigiles dominicales.<br><br>Il convient tout à fait, lorsqu’on le peut, de célébrer avec le peuple au moins l’office du soir, selon une coutume très ancienne (Const. sur la Liturgie, n. 100.).");

texte_final = texte_final.concat("<h4>b) Le triduum pascal</h4>");
texte_final = texte_final.concat("Au triduum pascal, l’office se célèbre comme indiqué au propre du temps.<br><br>Ceux qui assistent à la messe du soir le jeudi saint, ou à la célébration de la passion le vendredi saint ne disent pas l’office du soir chacun de ces jours-là.<br><br>Le vendredi, et le samedi saints on aura, avant l’office du matin, autant que c’est possible, une célébration publique et populaire de l’office de lecture.<br><br>Les complies du samedi saint ne sont dites que par ceux qui n’assistent pas à la veillée pascale.<br><br>La veillée pascale tient lieu de l’office de lecture : ceux qui n’ont pas assisté à la veillée pascale solennelle en réciteront au moins, quatre lectures, avec leurs chants et leurs oraisons. Il est bon de choisir les lectures de l’Exode, d’Ézékiel, de l’Apôtre, et de l’Évangile. Viennent ensuite l’hymne A toi Dieu « Te Deum » et l’oraison du jour.<br><br>L’office du matin, le dimanche de la Résurrection, est dit par tous ; il convient que l’office du soir soit célébré avec solennité pour honorer la fin d’un jour aussi sacré et pour commémorer les apparitions par lesquelles le Seigneur s’est montré à ses disciples. Là où elle est en vigueur, on maintiendra avec le plus grand soin la tradition particulière de célébrer, le jour de Pâques, les vêpres baptismales pendant lesquelles, en chantant des psaumes, on va en procession aux fonts baptismaux.");

texte_final = texte_final.concat("<h4>c) Le temps pascal</h4>");
texte_final = texte_final.concat("La Liturgie des heures reçoit son caractère pascal de l’acclamation alléluia, par laquelle se terminent la plupart des antiennes, (cf. n. 120) ; mais aussi des hymnes, des antiennes et des intercessions spéciales, enfin des lectures propres assignées à chacune des heures.");

texte_final = texte_final.concat("<h4>d) Noël</h4>");
texte_final = texte_final.concat("Dans la nuit de Noël, avant la messe, il convient de célébrer une vigile solennelle par l’office de lecture. Ceux qui participent à cette vigile ne disent pas complies.<br><br>L’office du matin, le jour de Noël, se dit habituellement avant la messe de l’aurore.");

texte_final = texte_final.concat("<h4>e) Les autres solennités et fêtes du Seigneur</h4>");
texte_final = texte_final.concat("Pour organiser l’office aux solennités et fêtes du Seigneur, on observera ce qui est dit ci-dessous, nn. 225-233, en faisant les modifications nécessaires.");

texte_final = texte_final.concat("<h3>II. La célébration des saints</h3>");
texte_final = texte_final.concat("Les célébrations des saints sont disposées de telle sorte qu’elles « ne l’emportent pas sur les fêtes ou les temps sacrés qui célèbrent les mystères du salut » (Cf. Ibid., n. 111.) qu’elles ne brisent pas à tout moment le cycle de la psalmodie et de la lecture divine, et qu’elles n’engendrent pas des répétitions fâcheuses, mais plutôt qu’elles favorisent la dévotion légitime de chacun. C’est sur ces principes que s’appuie aussi bien la réforme du calendrier accomplie sur l’ordre du 2e Concile du Vatican, que la manière de célébrer les Saints, dans la Liturgie des heures, décrite dans les numéros qui suivent.<br><br>Les célébrations de saints sont des solennités, des fêtes, ou des mémoires.<br><br>Les mémoires sont obligatoires, ou bien, si rien n’est indiqué, facultatives. Pour décider s’il convient de célébrer telle mémoire facultative dans un office à célébrer avec le peuple ou en commun, on tiendra compte du bien général, ou de la dévotion réelle de l’assemblée, et non de son seul président.<br><br>Si plusieurs mémoires facultatives se rencontrent le même jour, on ne peut en célébrer qu’une seule, en omettant les autres.<br><br>Les solennités, et elles seules, sont transférées conformément aux rubriques.<br><br>Les règles qui suivent valent aussi bien pour les saints inscrits au calendrier romain universel que pour ceux qui figurent dans les calendriers particuliers.<br><br>Les différents communs des saints suppléent aux parties propres qui pourraient manquer.");

texte_final = texte_final.concat("<h4>1. Comment l’office doit être organisé aux solennités</h4>");
texte_final = texte_final.concat("Les solennités ont des premières vêpres (un premier office du soir), le jour précédent.<br><br>Aux deux offices du soir, l’hymne, les antiennes, la lecture brève avec son répons et l’oraison conclusive sont propres ; si elles manquent au propre, on les prend au commun. Les deux psaumes, aux premières vêpres, sont ordinairement pris à la série des Laudate (Ps 112, 116, 134, 145, 146, 147) selon la tradition ancienne, le cantique du Nouveau Testament est indiqué en son lieu. Aux secondes vêpres, les psaumes et le cantique sont propres. Les intercessions sont propres, ou du commun.<br><br>A l’office du matin, l’hymne, les antiennes, la lecture brève avec son répons, et l’oraison conclusive sont propres ; si elles manquent, on les prend au commun. On prend les psaumes au dimanche 1 du psautier. Les intercessions sont propres ou du commun.<br><br>A l’office de lecture, tout est propre : hymne, antiennes et psaumes, lectures et répons. La première lecture est biblique et la seconde hagiographique. Mais s’il s’agit d’un saint qui ne jouit que d’un culte local et qui n’a pas de textes spéciaux même dans le propre local, on prend tout au commun.<br><br>A la fin de l’office de lecture, on dit l’hymne A toi, Dieu « Te Deum » et l’oraison propre.<br><br>A l’heure médiane, ou à tierce, sexte, et none, on dit l’hymne quotidienne, à moins d’une indication différente ; les psaumes sont pris aux psaumes graduels, avec antienne propre ; mais le dimanche on prend les psaumes au psautier du dimanche 1 ; la lecture brève et l’oraison conclusive sont propres. Toutefois, pour certaines solennités du Seigneur, des psaumes spéciaux sont proposés.<br><br>Aux complies, tout est du dimanche, respectivement après l’office du soir de la veille et du jour.");

texte_final = texte_final.concat("<h4>2. Comment l’Office doit être organisé aux fêtes</h4>");
texte_final = texte_final.concat("Les fêtes n’ont pas de premières vêpres, à moins qu’il ne s’agisse de fêtes du Seigneur qui tombent le dimanche. À l’office de lecture, aux offices du matin et du soir, tout se fait comme aux solennités.<br><br>A l’heure médiane, ou à tierce, sexte et none, on dit l’hymne quotidienne ; on dit les psaumes de la férie avec leurs antiennes, à moins que pour l’heure médiane une raison particulière ou une tradition ne requière qu’on dise une antienne propre, ce qui sera indiqué en son lieu. La lecture brève et l’oraison conclusive sont propres.<br><br>Les complies se disent comme aux jours ordinaires.");

texte_final = texte_final.concat("<h4>3. Comment l’office doit être organisé aux mémoires des saints</h4>");
texte_final = texte_final.concat("Entre une mémoire obligatoire et une mémoire facultative effectivement célébrée, il n’y a aucune différence dans l’organisation de l’office, à moins qu’il ne s’agisse de mémoires facultatives qui tomberaient dans des temps privilégiés.<br><br>a) Mémoires tombant à des jours ordinaires<br>À l’office de lecture, aux offices du matin :<br>a) les psaumes avec leurs antiennes sont de la férie, à moins qu’il n’y ait des antiennes propres ou des psaumes propres qui sont indiqués à chaque endroit ;<br>b) l’antienne d’Invitatoire, l’hymne, la lecture brève, les antiennes à Benedictus et à Magnificat, et les intercessions, si elles sont propres, doivent être dits du saint ; sinon, ils sont dits du commun ou de la férie ;<br>c) on doit dire l’oraison conclusive du saint ;<br>d) à l’office de lecture, la lecture biblique avec son répons est de l’Écriture en cours. La seconde, lecture est hagiographique, avec répons propre ou du commun ; à défaut de lecture propre, on prend la lecture patristique du jour. On ne dit pas le « A toi, Dieu » ou « Te Deum ».<br><br>À l’heure médiane, ou à tierce, sexte et none, et à complies, on ne tient pas compte du saint ; tout est de la férie.<br><br>b) Mémoires tombant dans un temps privilégié<br>Les dimanches, aux solennités et aux fêtes, ainsi que le mercredi des cendres, pendant la semaine sainte et la semaine de Pâques, on ne tient pas compte des mémoires qui tombent ces jours-là.<br><br>Aux féries du 17 au 24 décembre, comme pendant l’octave de Noël et aux féries de carême, il n’y a aucune mémoire obligatoire, pas même dans les calendriers particuliers. Quant aux mémoires obligatoires qui tombent éventuellement en carême, elles sont considérées cette année-là comme mémoires facultatives.<br><br>En ces mêmes périodes, si quelqu’un veut célébrer un saint assigné à ce jour-là comme mémoire,<br>a) à l’office de lecture, après la lecture patristique prise au propre du temps avec son répons, on ajoutera la lecture hagiographique, et on conclura par l’oraison de ce saint ;<br>b) en outre, soit à l’office du matin, soit à l’office du soir, on peut, après l’oraison conclusive, ajouter l’antienne (propre ou du commun) et l’oraison du saint.<br><br>c) La mémoire de sainte Marie le samedi<br>Les samedis du temps ordinaire où sont permises les mémoires facultatives, on peut célébrer, sous le même rite, la mémoire facultative de sainte Marie, avec sa lecture propre.");

texte_final = texte_final.concat("<h3>III. Le calendrier à employer et la faculté de choisir un Office ou l’une de ses parties</h3>");
texte_final = texte_final.concat("<h4>a) Le calendrier à employer</h4>");
texte_final = texte_final.concat("L’office célébré au chœur ou en commun doit suivre le calendrier propre, c’est-à-dire celui du diocèse, de la famille religieuse, ou des diverses églises (Normes universelles de l’année liturgique, n. 52. 1 Cf. Ibid., n. 52 c.). Les religieux s’unissent à la communauté de l’Église locale pour célébrer la dédicace de la cathédrale et les patrons principaux du lieu et du territoire plus vaste où ils vivent (Table des jours liturgiques, nn. 4 et 8).<br><br>Tout clerc ou religieux astreint à l’office divin à quelque titre que ce soit, et qui participe en commun à l’Office selon un calendrier ou à un rite autre que le sien, satisfait de cette manière à son devoir quant à cette partie de l’office.<br><br>Dans la récitation solitaire, on peut observer ou bien le calendrier du lieu, ou bien le calendrier propre, sauf aux solennités et aux fêtes propres.");

texte_final = texte_final.concat("<h4>b) Faculté de choisir l’office</h4>");
texte_final = texte_final.concat("Aux féries qui admettent la célébration d’une mémoire facultative, on peut, pour un juste motif, célébrer sous le même rite (cf. nn. 234-239) l’office d’un saint inscrit ce jour-là au martyrologe romain, ou dans son appendice approuvé.<br><br>En dehors des solennités, des dimanches de l’Avent, du Carême et de Pâques, du mercredi des cendres, de la semaine sainte, des jours de l’octave de Pâques et du 2 Novembre, on peut célébrer, pour un motif d’intérêt public ou de dévotion, soit totalement, soit en partie, un office votif, par exemple en raison d’un pèlerinage, d’une fête locale, de la solennité extérieure d’un saint.");

texte_final = texte_final.concat("<h4>c) Faculté de choisir certains formulaires</h4>");
texte_final = texte_final.concat("En certains cas particuliers, on peut choisir dans l’office des formulaires différents de ceux qui se présentent du moment qu’on ne touche pas « à l’organisation générale de chaque heure et qu’on observe les règles suivantes ».<br><br>A l’office des dimanches, des solennités et des fêtes du Seigneur qui figurent au calendrier universel, des féries du Carême et de la semaine sainte, des jours dans les octaves de Pâques et de Noël, ainsi qu’aux féries qui vont du 17 au 24 décembre inclusivement, il n’est jamais permis de changer les formulaires qui sont propres ou appropriés à cette célébration, comme c’est le cas pour les antiennes, les hymnes, les lectures, les répons, oraisons et même très souvent les psaumes.<br><br>Aux psaumes dominicaux de la semaine en cours on peut, si on le juge bon, substituer les psaumes dominicaux d’une autre semaine et même, s’il s’agit d’un office célébré avec le peuple, d’autres psaumes choisis pour initier progressivement celui-ci à l’intelligence des psaumes.<br><br>A l’office de lecture, la lecture en cours de la sainte Écriture doit toujours être respectée. Il vaut pour l’office aussi, ce souhait de l’Église « que dans un nombre d’années déterminé, on lise au peuple la partie la plus importante des saintes Écritures » (Const. sur la Liturgie, n. 5).<br><br>Compte tenu de cela, aux temps de l’Avent, de Noël, du Carême et de Pâques, le cycle de lectures scripturaires qui est proposé dans l’office de lecture ne doit pas être abandonné. Dans le temps ordinaire, et pour un juste motif, un jour ou l’autre, ou pendant une suite de quelques jours, on peut choisir des lectures parmi celles qui sont proposées pour d’autres jours, ou même d’autres lectures bibliques, par exemple quand on fait les exercices spirituels, des sessions pastorales, ou des prières pour l’unité de l’Église, et dans les autres cas analogues.<br><br>Si la lecture continue est interrompue par une solennité, une fête ou une célébration particulière, il sera permis, au cours de la même semaine, en considérant l’organisation de toute cette semaine, ou bien, d’unir à d’autres les parties qui seront omises, ou bien de décider quels textes doivent être préférés à d’autres.<br><br>Dans le même office de lecture, au lieu de la seconde lecture assignée à tel jour, on peut choisir, pour un juste motif, une autre lecture de la même période, empruntée soit au livre de la Liturgie des heures, soit au lectionnaire facultatif (n. 161). En outre, aux féries du temps ordinaire et, si on le juge bon, même aux temps de l’Avent, de Noël, du carême et de Pâques, on pourra faire une lecture quasi continue de l’œuvre d’un Père accordée à l’esprit de la bible et de la liturgie.<br><br>Les lectures des offices du matin et du soir et des autres heures, ainsi que les oraisons, les chants et les intercessions, qui sont proposés pour les féries d’un temps particulier, peuvent être dits à d’autres féries du même temps, excepté les cas indiqués au n. 247.<br><br>Bien qu’on doive tenir à l’observation de tout le cycle du psautier réparti par semaines (cf. supra, n. 100-109), si on le juge bon pour un motif spirituel ou pastoral, au lieu des psaumes assignés à un jour déterminé, on peut dire des psaumes de la même heure assignés à un autre jour. Il y a même des circonstances occasionnelles où il est permis de choisir des psaumes appropriés, ainsi que d’autres parties, comme pour un office votif.");

texte_final = texte_final.concat("</div>");

texte_final = texte_final.concat("<div class='text_part' id='liturgie_heures_chapitre5'>");
sommaire = sommaire.concat("<li><a href='#liturgie_heures_chapitre5'>Chapitre V : Les rites à observer dans la célébration publique commune</a></li>");

texte_final = texte_final.concat("<h2>Chapitre V : Les rites à observer dans la célébration publique commune</h2>");
texte_final = texte_final.concat("<h3>I. Les différentes fonctions à remplir</h3>");
texte_final = texte_final.concat("Dans la célébration solennelle de la Liturgie des heures, de même que dans les autres actions liturgiques, « chacun, ministre ou fidèle, en s’acquittant de sa fonction, fera seulement et totalement ce qui lui revient en vertu des normes liturgiques » (Const. sur la Liturgie, n. 28).<br><br>Si c’est l’Évêque qui préside, surtout dans la cathédrale il sera entouré de son presbyterium et de ministres, avec la participation plénière et active de tout le peuple. Mais ordinairement, dans toute célébration avec le Peuple c’est le prêtre ou le diacre qui présidera, et il y aura aussi des ministres.<br><br>Le prêtre ou le diacre qui préside la célébration peut revêtir l’étole sur l’aube ou le surplis ; le prêtre peut mettre aussi la chape. Rien n’empêche d’ailleurs qu’aux grandes solennités plusieurs prêtres mettent la chape, et que les diacres mettent la dalmatique.<br><br>Il revient au prêtre ou au diacre qui préside, à son siège de commencer l’office par le verset d’introduction, d’entonner l’oraison dominicale, de prononcer l’oraison conclusive, de saluer le peuple, de le bénir et de le congédier.<br><br>Soit le prêtre, soit un ministre peut prononcer les intercessions.<br><br>En l’absence du prêtre ou du diacre, celui qui préside l’office ne se distingue pas de ses égaux ; il n’entre pas au sanctuaire, ne salue pas le peuple et ne le bénit pas.<br><br>Ceux qui remplissent la fonction de lecteur prononcent les lectures, qu’elles soient longues ou brèves, en se tenant debout à l’endroit approprié.<br><br>L’intonation des antiennes, des psaumes ou des autres chants sera faite par le ou les chantres. En ce qui concerne la psalmodie, on observera ce qui est dit ci-dessus, nn. 121-125.<br><br>Pendant le cantique évangélique, aux offices du matin et du soir, on peut encenser l’autel, et ensuite le prêtre et le peuple.<br><br>L’obligation chorale porte sur la communauté, non sur le lieu de la célébration, qui n’est pas nécessairement une église, surtout s’il s’agit des heures qui sont célébrées sans solennité.<br><br>Tous les participants se tiennent debout :<br>a) pendant qu’on dit l’introduction de l’office, et le verset introduction de chaque heure ;<br>b) pendant l’hymne ;<br>c) pendant le cantique tiré de l’Évangile ;<br>d) pendant les intercessions, l’oraison dominicale et l’oraison conclusive.<br><br>Tous sont assis pour écouter les lectures autres que l’Évangile.<br><br>Pendant qu’on dit les psaumes et les autres cantiques, l’assemblée est assise ou se tient debout, selon les coutumes.<br><br>Tous font le signe de la croix, du front à la poitrine, et de l’épaule gauche à l’épaule droite.<br>a) au début des heures, quand on dit : « Dieu, viens à mon aide »<br>b) au début des cantiques tirés de l’Évangile – Benedictus, Magnificat, Nunc dimittis.<br>On fait le signe de la croix sur sa bouche, au début de l’invitatoire, aux paroles : « Seigneur, ouvre mes lèvres ».");

texte_final = texte_final.concat("<h3>II. Le chant de l’office</h3>");
texte_final = texte_final.concat("Dans les rubriques et les règles de cette présentation, les mots « dire » ou « proférer » doivent s’entendre tantôt du chant et tantôt de la simple récitation, selon les principes énoncés ci-dessous.<br><br>« La célébration chantée de l’office divin est la forme qui s’accorde le mieux à la nature de cette prière. Elle en exprime la solennité d’une manière plus complète, elle traduit une plus profonde union des cœurs dans le service de la louange de Dieu. C’est pourquoi, cette forme chantée est vivement recommandée à tous ceux qui célèbrent l’office au chœur ou en commun » (S. R. C. Instr. Musicam sacram du 5 mars 1967, n. 37 ; cf. Const. sur la Liturgie, n. 99.).<br><br>Les déclarations du 2e Concile du Vatican sur le chant liturgique (Cf. Const. sur la Liturgie, n. 113.) s’appliquent à toute action liturgique, mais surtout à la Liturgie des heures. Bien que toutes et chacune de ses parties aient été rénovées de façon à pouvoir être récitées avec fruit même quand on est seul, la plupart d’entre elles sont d’un genre lyrique, et par conséquent ne peuvent exprimer tout leur sens qu’avec le chant ; c’est surtout le cas pour les psaumes, les cantiques, les hymnes et les répons.<br><br>Dans la célébration de la Liturgie des heures, le chant ne peut donc être tenu pour un ornement surajouté comme du dehors à la prière ; bien plutôt il jaillit des profondeurs de l’âme qui prie et qui loue Dieu, et il manifeste pleinement et parfaitement la nature communautaire du culte chrétien.<br><br>Ils méritent donc des éloges, tous les groupes chrétiens de n’importe quel genre, qui s’efforcent d’employer le plus souvent possible cette forme de prière. Il faut, par la catéchèse voulue et par la pratique, former aussi bien les clercs et les religieux que les fidèles, pour qu’ils puissent, surtout les jours de fête, chanter les heures avec joie. Mais il est difficile de chanter intégralement l’office ; et d’ailleurs la louange de l’Église, ni par son origine ni par sa nature propre, ne doit être réservée aux moines et aux clercs : elle appartient à toute la communauté chrétienne. Il faut donc considérer simultanément plusieurs principes pour que la célébration chantée de la Liturgie des heures s’accomplisse le mieux possible, pour qu’elle rayonne de vérité et de beauté.<br><br>Il importe avant tout qu’on chante l’office au moins les dimanches et jours de fête, et que la pratique du chant contribue à distinguer les différents degrés de solennité.<br><br>De même, puisque toutes les heures n’ont pas la même valeur, il est bien que le chant fasse ressortir celles qui sont vraiment les pôles de l’office, c’est-à-dire celles du matin et du soir.<br><br>Sans doute, la célébration entièrement chantée est recommandée, pourvu qu’elle atteigne un haut niveau artistique et spirituel. Cependant c’est avec profit qu’on peut appliquer parfois le principe de la solennité « progressive » ; cela pour des motifs pratiques, mais aussi parce que les différents éléments de la célébration liturgique ne sont pas à mettre indistinctement sur le même plan ; au contraire, chacun d’eux peut retrouver son sens et sa fonction originels. De cette façon, la Liturgie des heures n’apparaît plus comme un beau monument du passé, qui exige d’être conservé presque sans aucun changement, afin d’exciter l’admiration pour lui-même ; au contraire, elle peut acquérir une nouvelle vie, faire de nombreux progrès et redevenir l’expression d’une communauté bien vivante.<br><br>Le principe de solennité « progressive » consiste en ce qu’il admet nombre de degrés intermédiaires entre l’office intégralement chanté et la simple récitation de toutes ses parties. Cette solution introduit une grande et agréable variété, et sa mesure doit être appréciée d’après la couleur du jour ou de l’heure qu’on célèbre, d’après la nature de chacun des éléments qui constituent l’office, enfin d’après l’importance numérique ou le caractère de la communauté, ainsi que d’après le nombre des chanteurs dont on disposera en telle occasion.<br><br>Grâce à cette plus grande flexibilité, la louange publique de l’Église pourra être chantée plus souvent qu’auparavant et s’adapter de multiples façons à la diversité des circonstances ; ainsi se lève un grand espoir de découvrir de nouvelles voies et de nouvelles formes pour notre époque, ce qui s’est toujours produit dans la vie de l’Église.<br><br>« Dans les actions liturgiques qui doivent être chantées en latin, le chant grégorien, comme étant le chant propre de la liturgie romaine... doit, toutes choses égales, d’ailleurs, occuper la première place ». Dans l’office chanté, si on n’a pas de mélodie pour l’antienne qui est proposée, on prendra dans le répertoire une autre antienne, pourvu aussi qu’il n’empêche pas une juste « participation active du Peuple ».<br><br>Puisque la Liturgie des heures peut être accomplie en langue vivante, on devra donc « faire le nécessaire pour préparer les mélodies dont on se servira dans le chant de l’office en langue du pays » (S. R. C. Instr. Musicam sacram, n. 41 ; cf. nn. 54-61).<br><br>Cependant rien n’empêche que dans la même célébration, différentes parties soient chantées dans des langues différentes (Cf. Ibid., n. 51.).<br><br>Quels éléments doit-on chanter de préférence ? Cela se déduit de l’organisation authentique de la célébration liturgique, qui demande une juste estimation du sens et de la nature propre, de chaque partie et du chant ; il y a en effet des éléments qui, de soi, requièrent le chant (Cf. Ibid., n. 6.). Tels sont d’abord « les acclamations, les réponses aux salutations du prêtre et des ministres, et aux prières de forme litanique, et en outre les antiennes et les psaumes, de même que les versets intercalaires ou refrains, ainsi que les hymnes et les cantiques » (cf. Ibid., nn. 16 a et 38).<br><br>Il est évident que les psaumes, comme on l’a dit plus haut, nn. 103-120, ont une relation étroite avec la musique, ce que vérifie la tradition aussi bien juive que chrétienne. En fait, pour entrer pleinement dans l’intelligence de nombreux psaumes, il est très utile de les chanter, ou du moins de les considérer toujours sous cette lumière poétique et musicale. Si c’est possible, la forme musicale paraît donc préférable, du moins aux jours et aux heures principales, et selon la nature originelle des psaumes.<br><br>On a décrit plus haut, nn. 121-123, différentes façons de chanter les psaumes ; cette variété ne tient pas tellement à des circonstances extérieures qu’aux genres différents des psaumes qui se rencontrent dans une même célébration. C’est ainsi qu’il vaudra mieux écouter seulement des psaumes sapientiaux ou historiques tandis que les hymnes ou les actions de grâce comportent par elles-mêmes le chant commun. Une seule chose est tout à fait importante : que la célébration ne soit pas rigide ou artificielle, ou préoccupée seulement d’exécuter des règles toutes formelles, mais qu’elle réponde vraiment à la réalité. C’est là-dessus que l’effort doit porter d’abord, pour que les âmes soient guidées par le désir d’une authentique prière d’Église, et que Dieu reçoive « une louange agréable et belle » (cf. Ps. 146).<br><br>Les hymnes pourront aussi nourrir la prière de celui qui récite les heures, si elles ont une valeur doctrinale et artistique ; cependant, elles sont, par elles-mêmes, destinées au chant. Il est donc recommandé de les chanter, autant que possible, dans la célébration communautaire.<br><br>Le répons bref qui suit la lecture aux offices du matin et du soir et dont on traite au n. 49, est destiné par lui-même à être chanté, et chanté par le peuple.<br><br>Les répons qui suivent les lectures à l’office de lecture appellent le chant, par leur nature et leur fonction. Cependant, dans le déroulement de l’office, leur structure est telle qu’ils gardent leur portée même dans une récitation solitaire et privée. On pourra très souvent chanter ceux qui auront été dotés de mélodies plus simples et plus faciles que celles qui viennent des sources liturgiques.<br><br>Les lectures, qu’elles soient longues ou brèves, ne sont pas par elles-mêmes destinées au chant ; lorsqu’on les proclame, il faut veiller soigneusement à ce que la lecture soit digne, claire et distincte, et que tous puissent vraiment l’entendre et bien la comprendre. La seule mélodie que l’on puisse accepter dans une lecture est celle qui permet d’obtenir une meilleure audition des paroles et une meilleure intelligence du texte.<br><br>Les textes que le président est seul à prononcer, comme les oraisons, peuvent être chantées d’une façon belle et appropriée, surtout en latin. Cela peut être plus difficile avec certaines langues vivantes, à moins que le chant ne permette à tous de percevoir clairement les paroles.");

texte_final = texte_final.concat("</div>");





  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html("")});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
}


function update_office_soutenir(){
  var texte_final = '<div class="office_text" id="office_text">';
  var sommaire = '<div class="office_sommaire" id="office_sommaire"><ul>';
  var titre = '<div class="office_titre" id="office_titre">';
  titre = titre.concat("<h1>Nous soutenir</h1></div>")
 
  texte_final = texte_final.concat("<div class='text_part' id='soutenir'>");
  sommaire = sommaire.concat("<li><a href='.'>Retour à la date actuelle</a></li>");
  sommaire = sommaire.concat("<li><a href='#soutenir'>Nous soutenir</a></li>");

  texte_final = texte_final.concat("<h2> Nous soutenir </h2>");
  texte_final = texte_final.concat("Pour soutenir la province de Toulouse qui a codéveloppé et maintient cette webapplication, vous pouvez faire un don défiscalisé à l'Amitié dominicaine via la Fondation Nationale pour le Clergé. <br><br>");
  texte_final = texte_final.concat("<div class='button-container'><button id='soutenir_button' class='soutenir-button'>Nous soutenir</button></div> <br><br>");
  texte_final = texte_final.concat("Si vous souhaitez nous écrire, si vous avez une remarque, une suggestion ou une erreur à faire remonter, vous pouvez envoyer un message à outils.apostoliques.op[at]gmail.com. <br><br>");

  texte_final = texte_final.concat("</div>");

  $(".office_biographie").each(function(){$(this).html("")});
  $(".office_content").each(function(){$(this).html(texte_final)});
  $(".office_titre").each(function(){$(this).html(titre)});
  $(".office_sommaire").each(function(){$(this).html(sommaire)});
  $("body").removeClass("menu-open");
  $('body').removeClass("background-open");
  window.scrollTo(0, 0);
  update_anchors();
  update_liturgical_color("vert");
  update_office_class(office);
  
  // Gestionnaire d'événement pour le bouton Nous soutenir
  $('#soutenir_button').click(function() {
    window.open('https://soutenir.fondationduclerge.com/?reserved_affectations=1258', '_blank');
  });
}