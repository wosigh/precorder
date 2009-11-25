function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    prefs.load();
    this.controller.pushScene("main");
}

StageAssistant.prototype.handleCommand = function (event) {
    var currentScene = this.controller.activeScene();

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
