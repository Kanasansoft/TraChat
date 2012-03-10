$(document).ready(function() {

	if ("WebSocket" in window) {
	} else {
		return;
	}

	var ws = null;

	var enterHandler = function(f) {
		return function(e) {
			if (e.which == 13) {
				f();
				return false;
			}
			return true;
		};
	};

	var getWebSocketSender = function(ws) {
		return function(string) {
			ws.send(string);
		};
	};

	var getWebSocketReceiver = function(callback) {
		return function(e) {
			return callback(e.data);
		};
	};

	var wrapJSONStringify = function(callback) {
		return function(json) {
			return callback(JSON.stringify(json));
		};
	};

	var wrapJSONParse = function(callback) {
		return function(string) {
			return callback(JSON.parse(string));
		};
	};

	var getChatManager = function(callback) {

		var nameLabel   = $("<label/>").text("name").attr("for","namebox");
		var nameBox     = $("<input type='text'/>").attr("id","namebox");
		var nameButton  = $("<input type='button'/>").val("set");
		var nameArea    = $("<div/>").attr("id","namearea").
				append(nameLabel).append(nameBox).append(nameButton);

		var voiceLabel  = $("<label/>").text("voice").attr("for","voicebox");
		var voiceBox    = $("<input type='text'/>").attr("id","voicebox");
		var voiceButton = $("<input type='button'/>").val("send");
		var voiceArea   = $("<div/>").attr("id","voicearea").
				append(voiceLabel).append(voiceBox).append(voiceButton);

		var voicesArea  = $("<div/>").attr("id","voicesarea");

		var chatArea = $("<div/>").attr("id","chatarea").
				append(nameArea).append(voiceArea).append(voicesArea);

		var userName = null;

	    var setName = function() {
			if (nameBox.val().length == 0) {
				nameBox.focus();
				return;
			}
			userName = nameBox.val();
			nameArea.hide();
			voiceArea.show();
			voiceBox.focus();
		};

		var sendVoice = function() {
			if (voiceBox.val().length == 0) {
				voiceBox.focus();
				return;
			}
			var voice = voiceBox.val();
			var data = {"name" : userName, "voice" : voice};
			callback(data);
			voiceBox.val("");
			voiceBox.focus();
		};

		var addVoice = (function(area){
			return function(data){
				var speaker = $("<span/>").addClass("speaker").text(data.name);
				var remark  = $("<span/>").addClass("remark").text(data.voice);
				var speak   = $("<div/>").addClass("speak").
						append(speaker).append(remark);
				speak.hide();
				area.prepend(speak);
				speak.fadeIn("fast");
			};
		})(voicesArea);

		nameButton.click(setName);
		nameBox.keydown(enterHandler(setName));
		voiceButton.click(sendVoice);
		voiceBox.keydown(enterHandler(sendVoice));

		voiceArea.hide();

		return {"addVoice":addVoice,"chatArea":chatArea};

	};

	var openChat = function(e) {
		var sender = wrapJSONStringify(getWebSocketSender(ws));
		var manager = getChatManager(sender);
		var receiver = getWebSocketReceiver(wrapJSONParse(manager.addVoice));
		ws.addEventListener("message",receiver,false);
		$("#content").empty().append(manager.chatArea);
	};

	var errorChat = function(e) {
		$("#content").empty().append($("<div/>").text("error chat."));
	};

	var closeChat = function(e) {
		$("#content").empty().append($("<div/>").text("close chat. ["+e.code+"]"+e.reason));
	};

	var getWebSocketURI =  function(port) {
		//   http://hostname:httpport/projectName/pluginName
		//=> ws://hostname:websocketport/pluginName?projectName=projectName
		var protocol = location.protocol == "http:" ? "ws:" : "wss:";
		var hostname = location.hostname;
		var href     = location.href;
		var slash    = href.lastIndexOf("/");                                  //separator slash between project name and plugin name
		var path     = href.slice(href.lastIndexOf("/",slash - 1) + 1);        //path of project name and plugin name
		var project  = path.slice(0,path.indexOf("/"));                        //project name
		var plugin   = path.slice(path.indexOf("/") + 1);                      //plugin name
		var endpoint = protocol + "//" + hostname + ":" + port + "/" + plugin; //end point of websocket
		return endpoint + "?projectName=" + encodeURIComponent(project);
	};

	var connectWebSocket = function(portNumber) {
		$("#content").empty().append($("<div/>").text("connect WebSocket..."));
		var uri = getWebSocketURI(portNumber);
		ws = new WebSocket(uri);
		$(window).unload((function(ws){return function(){ws.close();};})(ws));
		ws.addEventListener("open",openChat,false);
		ws.addEventListener("error",errorChat,false);
		ws.addEventListener("close",closeChat,false);
	};

	var getPortNumber = function(callback) {
		$("#content").empty().append($("<div/>").text("getting WebSocket port number..."));
		$.get(location.href + "/port",connectWebSocket);
	};

	getPortNumber();

});
