function StageAssistant() {
    videoRecording = false;
}

StageAssistant.prototype.setup = function() {
    prefs.load();
    this.controller.pushScene("mic-rec");
	viewMenuModel = {
		visible: true,
		items: [
			{},
			{toggleCmd: 'mic-rec',
			items: [
				{label: $L("Microphone"), command: 'mic-rec', width: 160},
				{label: $L("Stream Record"), command: 'stream-rec', width: 160}
				] },
			{}
		]
	};
};

StageAssistant.prototype.handleCommand = function (event) {
    var currentScene = this.controller.activeScene();
	var stageController = this.controller.getActiveStageController();
		
    switch(event.type) {
        case Mojo.Event.commandEnable:
            switch (event.command) {
                case Mojo.Menu.prefsCmd:
                    if(!currentScene.assistant.prefsMenuDisabled)
                        event.stopPropagation();
                    break;
                case Mojo.Menu.helpCmd:
                    if(!currentScene.assistant.helpMenuDisabled)
                        event.stopPropagation();
                    break;
            }
            break;
        case Mojo.Event.command:
            switch (event.command) { 
				case 'mic-rec':
					stageController.swapScene('mic-rec');
					
				case 'stream-rec':
					stageController.swapScene('stream-rec');
			  
                case Mojo.Menu.helpCmd:
                    this.controller.pushScene('support');
                    break;
                
                case Mojo.Menu.prefsCmd:
                    this.controller.pushScene('preferences');
                    break;
            }
        break;
    }
};
