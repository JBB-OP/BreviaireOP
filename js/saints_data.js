// Données des saints intégrées pour éviter les problèmes CORS en environnement local
// Ces données seront utilisées comme fallback lorsque le chargement du fichier JSON échoue

var integratedSaintsData = {
  "meta": {
    "version": "1.0",
    "last_updated": "2023-11-15",
    "source": "Martyrologe Romain et sources dominicaines"
  },
  "saints": {
    "01-01": [
      {
        "id": "marie-mere-de-dieu",
        "nom": "Sainte Marie, Mère de Dieu",
        "titre": "Solennité",
        "rang": "Solennité",
        "date": "1er janvier",
        "biographie": "En l'Octave de la Nativité du Seigneur et au jour de sa circoncision, solennité de <b>sainte Marie Mère de Dieu</b>. Au concile d'Éphèse, les Pères l'acclamèrent Théotokos, parce qu'en elle la personne du Verbe prit chair, se fit homme pour nous les hommes et pour notre salut.",
        "type": "solennité",
        "lieu": "Jérusalem",
        "siecle": "Ier siècle",
        "dates": {
          "naissance": "Inconnue",
          "mort": "Inconnue"
        },
        "attributs": []
      },
      {
        "id": "fulgence-de-ruspe",
        "nom": "Saint Fulgence de Ruspe",
        "titre": "Évêque",
        "rang": "Mémoire",
        "date": "1er janvier",
        "biographie": "En Byzacène, en 532, <b>saint Fulgence de Ruspe</b>, évêque. Procurateur de cette province il se fit moine ; devenu évêque il eut à souffrir de la part des Ariens, au temps de la persécution des Vandales. Il fut deux fois exilé en Sardaigne par le roi Thrasamond. Rendu à son peuple en 523, il le dirigea environ neuf années, puis il quitta son siège en 531, pour se préparer à la mort.",
        "type": "évêque",
        "lieu": "Byzacène",
        "siecle": "Ve-VIe siècle",
        "dates": {
          "naissance": "Inconnue",
          "mort": "532"
        },
        "attributs": []
      },
      {
        "id": "joseph-marie-tomasi",
        "nom": "Saint Joseph-Marie Tomasi",
        "titre": "Prêtre et cardinal",
        "rang": "Mémoire",
        "date": "1er janvier",
        "biographie": "À Rome, en 1713, <b>saint Joseph-Marie Tomasi</b>, prêtre de l'Ordre des Clercs Réguliers Théatins et cardinal. Désirant ardemment la restauration du culte divin, il consacra presque toute sa vie à étudier et éditer des documents et des textes anciens de la sainte liturgie. Il s'appliqua aussi à faire le catéchisme aux enfants.",
        "type": "cardinal",
        "lieu": "Rome",
        "siecle": "XVIIe-XVIIIe siècle",
        "dates": {
          "naissance": "Inconnue",
          "mort": "1713"
        },
        "attributs": []
      },
      {
        "id": "vincent-marie-strambi",
        "nom": "Saint Vincent Marie Strambi",
        "titre": "Évêque passioniste",
        "rang": "Mémoire",
        "date": "1er janvier",
        "biographie": "À Rome, en 1824, <b>saint Vincent Marie Strambi</b>, évêque de Macerata et de Tolentino, de la Congrégation des Passionistes. Condamné à l'exil pour sa fidélité au pape Pie VII, entre 1809 et 1814, lors de l'occupation des états pontificaux par l'empereur Napoléon Ier, il devint ensuite, à partir de 1823, conseiller du pape Léon XII.",
        "type": "évêque",
        "lieu": "Rome",
        "siecle": "XVIIIe-XIXe siècle",
        "dates": {
          "naissance": "Inconnue",
          "mort": "1824"
        },
        "attributs": []
      },
      {
        "id": "sigismond-gorazdowski",
        "nom": "Saint Sigismond Gorazdowski",
        "titre": "Prêtre",
        "rang": "Mémoire",
        "date": "1er janvier",
        "biographie": "À Lvov en Ukraine, en 1920, <b>saint Sigismond Gorazdowski</b>, prêtre, de nationalité polonaise. Il fonda l'Institut des Sœurs de Saint-Joseph voué au bien des pauvres et des opprimés.",
        "type": "prêtre",
        "lieu": "Lvov",
        "siecle": "XIXe-XXe siècle",
        "dates": {
          "naissance": "Inconnue",
          "mort": "1920"
        },
        "attributs": []
      }
    ],
    "01-02": [
      {
        "id": "basile-et-gregoire",
        "nom": "Saints Basile le Grand et Grégoire de Nazianze",
        "titre": "Évêques et Docteurs de l'Église",
        "rang": "Mémoire",
        "date": "2 janvier",
        "biographie": "Au IVe siècle, les <b>saints Basile le Grand et Grégoire de Nazianze</b>, évêques et Docteurs de l'Église. Basile, évêque de Césarée en Cappadoce, appelé le Grand pour sa doctrine et sa sagesse, enseigna aux moines la méditation des Écritures, le labeur de l'obéissance et la charité fraternelle. Il organisa leur vie par des règles qu'il avait lui-même rédigées. Par ses écrits, il instruisit les fidèles et se distingua par son souci pastoral des pauvres et des malades. Il mourut le 1er janvier 379. Grégoire, son ami, évêque successivement de Sasimes, de Constantinople au moment du concile de Constantinople I, puis de Nazianze ; il défendit contre les Ariens le mystère de la Trinité et la divinité du Verbe incarné, ce qui lui valut d'être appelé le Théologien. Il mourut en 389.",
        "type": "docteur",
        "lieu": "Césarée et Nazianze",
        "siecle": "IVe siècle",
        "dates": {
          "naissance": "Inconnue",
          "mort": "379 et 389"
        },
        "attributs": []
      },
      {
        "id": "macaire-d-alexandrie",
        "nom": "Saint Macaire d'Alexandrie",
        "titre": "Abbé",
        "rang": "Mémoire",
        "date": "2 janvier",
        "biographie": "Vers 394, <b>saint Macaire d'Alexandrie</b>, abbé. Il eut un grand rayonnement sur les moines de Basse-Égypte, notamment auprès d'Évagre ; il connut la déportation lors de la persécution arienne en 374.",
        "type": "abbé",
        "lieu": "Alexandrie",
        "siecle": "IVe siècle",
        "dates": {
          "naissance": "Inconnue",
          "mort": "394"
        },
        "attributs": []
      }
    ],
    "default": [
      {
        "id": "aucun-saint",
        "nom": "Aucun saint répertorié",
        "titre": "Martyrologe",
        "date": "Aujourd'hui",
        "biographie": "Aucun saint ou bienheureux n'est spécifiquement répertorié pour ce jour dans notre base de données.",
        "type": "information",
        "lieu": "-",
        "siecle": "-",
        "dates": {
          "naissance": "-",
          "mort": "-"
        },
        "attributs": []
      }
    ]
  }
};

// Fonction pour obtenir les données intégrées
function getIntegratedSaintsData() {
  return integratedSaintsData;
}