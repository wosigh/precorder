function MicRecAssistant(){
}

MicRecAssistant.prototype.setup = function() {
	
	// viewMenuModel is a global defined in stage-assistant.js
	this.controller.setupWidget(Mojo.Menu.viewMenu, {spacerHeight: 0, menuClass:"no-fade"}, viewMenuModel);

    this.record = this.record.bindAsEventListener(this);
    this.stop   = this.stop.bindAsEventListener(this);
    
    this.controller.setupWidget("record", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                { 
                    buttonLabel : $L("Record"), 
                    disabled: false 
                });
    this.controller.listen('record', Mojo.Event.tap, 
               this.record);
			   
	this.controller.setupWidget("stop", 
                { 
                    disabledProperty: 'enabled' 
                }, 
                { 
                    buttonLabel : $L("Stop"), 
                    disabled: true 
                });
    this.controller.listen('stop', Mojo.Event.tap, 
               this.stop);

    this.controller.setupWidget("play", 
                { 
                    disabledProperty: 'enabled' 
                }, 
                this.launchModel = { 
                    buttonLabel : $L("Play"), 
                    disabled: true 
                }); 
    this.controller.listen('play', Mojo.Event.tap, 
               this.play);
};

MicRecAssistant.prototype.play = function(event) {
    var p = {};
    
    if(this.lastRecording)
        p = {target: "file:///media/internal/recordings/" + this.lastRecording};
        
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'launch',
        parameters: {
            id: "com.palm.app.musicplayer",
            params: p
        }
    });
};

MicRecAssistant.prototype.activate = function(lastFilename) {
    if(lastFilename)
    {
        this.lastRecording = lastFilename;
        this.playModel.buttonLabel = $L("Play");
        this.controller.modelChanged(this.playModel);
    }
};

MicRecAssistant.prototype.deactivate = function(event) {
};

MicRecAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening('record', Mojo.Event.tap,
                                  this.record);
    this.controller.stopListening('stop', Mojo.Event.tap, 
               this.launch);
};
