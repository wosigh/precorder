function RecordingAssistant(){
}

RecordingAssistant.prototype.setup = function() {
	this.record = this.record.bind(this);
    this.stop = this.stop.bind(this);
	this.play = this.play.bind(this);
	
	// this.appMenuModel defined in stage-assistant.js
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, appMenuModel);
	
	// viewMenuModel defined in stage-assistant.js
	this.controller.setupWidget(Mojo.Menu.viewMenu, {spacerHeight: 0, menuClass:"no-fade"}, viewMenuModel);
    
    this.controller.setupWidget('record', {}, this.recordModel = { buttonLabel : $L("Record"), disabled: false });
    this.controller.listen('record', Mojo.Event.tap, this.record);
			   
	this.controller.setupWidget('stop', {}, this.stopModel = { buttonLabel : $L("Stop"), disabled: true });
    this.controller.listen('stop', Mojo.Event.tap, this.stop);

    this.controller.setupWidget('play', {}, this.playModel = { buttonLabel : $L("Play"), disabled: true }); 
    this.controller.listen('play', Mojo.Event.tap, this.play);
};

RecordingAssistant.prototype.activate = function() {
	this.recordingStarted = this.recordingStarted.bind(this);
    this.recordFailure = this.recordFailure.bind(this);
    this.recordingStopped = this.recordingStopped.bind(this);
    this.stopFailure = this.stopFailure.bind(this);
};

RecordingAssistant.prototype.record = function(event) {
	this.recordingStarted();
    this.controller.serviceRequest('luna://org.webosinternals.precorder', {
        method: 'start_record',
        parameters: {
            source_device: source_device,
            stream_rate: prefs.stream_rate,
            lame_bitrate: prefs.lame_bitrate,
            lame_quality: prefs.lame_quality,
            voice_activation: prefs.voice_activation,
            filename: filename
        },
		onFailure: this.recordFailure,
        onError: this.recordFailure
    });
};

RecordingAssistant.prototype.recordingStarted = function(msg) {
    currentRecording = true;
	this.recordModel.disabled = true;
    this.controller.modelChanged(this.recordModel);
    this.stopModel.disabled = false;
    this.controller.modelChanged(this.stopModel);
    $("messages").innerHTML += "Recording...<br>";
    // start time
};

RecordingAssistant.prototype.recordFailure = function(response) {
    currentRecording = false;
	this.recordModel.disabled = false;
    this.controller.modelChanged(this.recordModel);
    this.stopModel.disabled = true;
    this.controller.modelChanged(this.stopModel);
    $("messages").innerHTML += "Recording failed:<br>" + response.errorText;
    // pop up error dialog then pop scene
};

RecordingAssistant.prototype.stop = function(event, lastFilename) {
		this.controller.serviceRequest('luna://org.webosinternals.precorder', {
        	method: 'stop_record',
        	onSuccess: this.recordingStopped,
        	onFailure: this.stopFailure,
        	onError: this.stopFailure
    	});
		
		if(lastFilename) {
        	this.lastRecording = lastFilename;
        	this.playModel.disabled = false;
        	this.controller.modelChanged(this.playModel);
    	}
};

RecordingAssistant.prototype.recordingStopped = function(response) {
	this.recordModel.disabled = false;
    this.controller.modelChanged(this.recordModel);
	this.stopModel.disabled = true;
    this.controller.modelChanged(this.stopModel);
    currentRecording = false;
};

RecordingAssistant.prototype.stopFailure = function(response) {
    currentRecording = false;  // Might as well, can't stop it now anyway
    $("messages").innerHTML += "Stop failed (WARNING, THIS SHOULD NEVER HAPPEN):<br>" + response.errorText;
};

RecordingAssistant.prototype.play = function(event) {
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

RecordingAssistant.prototype.deactivate = function(event) {
};

RecordingAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening('record', Mojo.Event.tap, this.record);
    this.controller.stopListening('stop', Mojo.Event.tap, this.stop);
	this.controller.stopListening('play', Mojo.Event.tap, this.play);
};
