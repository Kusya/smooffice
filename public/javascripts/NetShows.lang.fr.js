
if(NetShows.BrowserPanel){
	msg_log('Language : french');
	Ext.override(NetShows.BrowserPanel, {
		presentationsText : "Présentations",
		slidesText		: "Diapositives"
	});
}

if(NetShows.EditorAccordion){
	Ext.override(NetShows.EditorAccordion,{
		emptyText		: 'Sélectionnner un police...'	
	})
}

if (NetShows.FolderWindow) {
	Ext.override(NetShows.FolderWindow, {
		folderText		: 'Saisir le nom du dossier à créer',
		windowText		: 'Nouveau dossier',
		cancelText		: 'Annuler',
		invalidText		: "Le champ spécifié n'est pas valide."
	})
}

if (NetShows.MainPanel) {
	Ext.override(NetShows.MainPanel, {
		editText		: "Editer",
		fullScreenText	: "Visionner en plein écran",
		generalText		: "Général",
		loadingText		: 'Chargement...',
		introTitleText	: "Introduction",
		introContentText: "Bienvenue dans NetShows, le site de création de présentations. Au nom de toute l'equipe, nous vous souhaitons une bonne utilisation. Nous espérons que vous apprecierez la multitude de fonctionnalités telles que des transitions captivantes, des animations esthétiques pour chaque élements, et bien plus encore..."
	})
}

if (NetShows.PresentationBrowser) {
	Ext.override(NetShows.PresentationBrowser, {
		newText			: "Nouveau",
		newFolderText	: "Nouveau dossier",
		removeText		: "Supprimer",
		modifyText		: "Modifier",
		emptyTrashText	: "Vider la corbeille",
		authorMeText	: "Moi",
		myPresentationsText	: "Mes présentations",
		trashText			: "Corbeille"
	})
}

if (NetShows.PresentationWindow) {
	Ext.override(NetShows.PresentationWindow, {
		titleText			: 'Saisir le titre de la presentation',
		descriptionText		: 'Saisire une description',
		tagsText			: 'Saisir une list de mots-clés',
		windowText			: 'Créer une présentation',
		cancelText			: 'Annuler',
		modifyText			: "Modifier",
		invalidTitleText	: "Le titre spécifié n'est pas un champ text valide"
	})
}

if (NetShows.SlideBrowser) {
	Ext.override(NetShows.SlideBrowser, {
		newSlideText		: "Nouvelle diapo",
		noNameText			: 'Sans nom',
		removeText			: "Supprimer",
		loadingSlidesText	: 'Chargement des diapos...',
		noSlidesText		: '<p class="msg">Aucune diapo</p>'
	})
}

if (Ext.ux.TabCloseMenu) {
	Ext.closeTabText		= "Fermer l'onglet";
	Ext.closeOthersText		= "Fermer les autres onglets";
}