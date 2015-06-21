    	
function init() {
	checkRequestAnimationFrame();
	context = document.getElementById('context').dataset;
	prompt_message = new PromptMessage({view: document.getElementById('prompt_message')});
	//prompt_message.prompt('hello');
	viewGroup = new ViewGroup();
	viewBrowse = new ViewBrowse({view: document.getElementById('view_browse')});
	viewShare = new ViewShare({view: document.getElementById('view_share')});
	viewGroup.active('view_browse');
	//viewGroup.active('view_share');
	//viewGroup.active(document.getElementById("view_share"), 
	//	{'handler': 'display', 'card': {'type': 'image', 'url': 'img/page2.jpg'}});
	//viewGroup.active(document.getElementById("view_share"), 
		//{'handler': 'display', 'card': {'type': 'video', 'url': 'video/love.mp4'}});
}
