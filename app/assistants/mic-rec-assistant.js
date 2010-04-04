function MicRecAssistant(){
}

MicRecAssistant.prototype.setup = function() {
	this.record = this.record.bind(this);
    this.stop = this.stop.bind(this);
	this.play = this.play.bind(this);
	
	// viewMenuModel is a global defined in stage-assistant.js
	this.controller.setupWidget(Mojo.Menu.viewMenu, {spacerHeight: 0, menuClass:"no-fade"}, viewMenuModel);
    
    this.controller.setupWidget('record', {}, this.recordModel = { buttonLabel : $L("Record"), disabled: false });
    this.controller.listen('record', Mojo.Event.tap, this.record);
			   
	this.controller.setupWidget('stop', {}, this.stopModel = { buttonLabel : $L("Stop"), disabled: true });
    this.controller.listen('stop', Mojo.Event.tap, this.stop);

    this.controller.setupWidget('play', {}, this.playModel = { buttonLabel : $L("Play"), disabled: true }); 
    this.controller.listen('play', Mojo.Event.tap, this.play);
};

MicRecAssistant.prototype.activate = function() {};

MicRecAssistant.prototype.record = function(event) {
        this.recordModel.disabled = true;
        this.controller.modelChanged(this.recordModel);
	    this.stopModel.disabled = false;
        this.controller.modelChanged(this.stopModel);
};

MicRecAssistant.prototype.stop = function(event, lastFilename) {
        this.recordModel.disabled = false;
        this.controller.modelChanged(this.recordModel);
		this.stopModel.disabled = true;
        this.controller.modelChanged(this.stopModel);
		
		if(lastFilename) {
        	this.lastRecording = lastFilename;
        	this.playModel.disabled = false;
        	this.controller.modelChanged(this.playModel);
    	}
};

MicRecAssistant.prototype.play = function(event) {
    var p = {};
    
    if(this.lastRecording)
        p = {target: "file:///media/internal/recordings/" + this.lastRecording};
        
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'play',
        parameters: {
            id: "com.palm.app.musicplayer",
            params: p
        }
    });
};

MicRecAssistant.prototype.deactivate = function(event) {
};

MicRecAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening('record', Mojo.Event.tap, this.record);
    this.controller.stopListening('stop', Mojo.Event.tap, this.stop);
	this.controller.stopListening('play', Mojo.Event.tap, this.play);
};
