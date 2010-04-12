function StageAssistant() {
	source_device = 0;
    currentRecording = false;
}

StageAssistant.prototype.setup = function() {
    prefs.load();
    this.controller.pushScene("recording");
	viewMenuModel = {
		visible: true,
		items: [
			{},
			{toggleCmd: 'mic',
			items: [
				{label: $L("Microphone"), command: 'mic', width: 160},
				{label: $L("Output Monitor"), command: 'output', width: 160}
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
				case 'mic':
					source_device = 0;
					
				case 'output':
					source_device = 1;
			  
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
