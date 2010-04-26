function RecordingAssistant(){
}

RecordingAssistant.prototype.setup = function() {
	this.record = this.record.bind(this);
    this.stop = this.stop.bind(this);
	this.play = this.play.bind(this);
	// this.toggle_vcva = this.toggle_vcva.bind(this);
	
	// appMenuModel defined in stage-assistant.js
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, appMenuModel);
	
	// viewMenuModel defined in stage-assistant.js
	this.controller.setupWidget(Mojo.Menu.viewMenu, {spacerHeight: 0, menuClass:"no-fade"}, viewMenuModel);
	
	this.cmdMenuModel = {
    visible: true,
    items: [
        {items:[{label: $L('Record'), iconPath:'images/record.png', command:'record', disabled: false}, {label: $L('Stop'), iconPath:'images/stop.png', command:'stop', disabled: true}]},
        {items:[{label: $L('vox'), command:'toggle_vox', disabled: true}, {label: $L('play'), command:'play', disabled: true}]}
    ]
	};
	
	this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this.cmdMenuModel);
    
    //this.controller.setupWidget('record', {}, this.recordModel = { buttonLabel : $L("Record"), disabled: false });
    //this.controller.listen('record', Mojo.Event.tap, this.record);
			   
	//this.controller.setupWidget('stop', {}, this.stopModel = { buttonLabel : $L("Stop"), disabled: true });
    //this.controller.listen('stop', Mojo.Event.tap, this.stop);

    //this.controller.setupWidget('play', {}, this.playModel = { buttonLabel : $L("Play"), disabled: true }); 
    //this.controller.listen('play', Mojo.Event.tap, this.play);
};

RecordingAssistant.prototype.activate = function() {
	this.recordingStarted = this.recordingStarted.bind(this);
    this.recordFailure = this.recordFailure.bind(this);
    this.recordingStopped = this.recordingStopped.bind(this);
    this.stopFailure = this.stopFailure.bind(this);
	this.controller.serviceRequest('luna://org.webosinternals.precorder', {
        	method: 'get_events',
			parameters: {
			subscribe: true
        	},
        	onSuccess: this.eventSuccess,
        	onFailure: this.eventFailure,
        	onError: this.eventFailure
    });
	this.resetPosition();
};

RecordingAssistant.prototype.resetPosition = function() {
	$("position").innerHTML = "0:00:00.00";
}

RecordingAssistant.prototype.eventSuccess = function(payload){
	if (payload.gst_message_type == 2) {
		$("error-messages").innerHTML = payload.message;
	}
	if (payload.gst_message_type == 4) {
		$("warning-messages").innerHTML = payload.message;
	}
	if (payload.time) {
		$("position").innerHTML = payload.time.substr(0,10);
	}
	if (payload.lastfilename) {
        lastRecording = payload.lastfilename;
    }
}

RecordingAssistant.prototype.eventFailure = function(response){
	$("error-messages").innerHTML = "Event subscription failed: " + response.errorText;
}

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
	this.cmdMenuModel.items[0].items[0].disabled = true; // record button
    this.controller.modelChanged(this.cmdMenuModel);
    this.cmdMenuModel.items[0].items[1].disabled = false; // stop button
    this.controller.modelChanged(this.cmdMenuModel);
    $("internal-messages").innerHTML = "Recording...<br>";
    // start time
};

RecordingAssistant.prototype.recordFailure = function(response) {
    currentRecording = false;
	this.cmdMenuModel.items[0].items[0].disabled = false; // record
    this.controller.modelChanged(this.cmdMenuModel);
    this.cmdMenuModel.items[0].items[1].disabled = true; // stop
    this.controller.modelChanged(this.cmdMenuModel);
    $("internal-messages").innerHTML = "Recording failed:<br>" + response.errorText;
};

RecordingAssistant.prototype.stop = function(event) {
		this.recordingStopping();
		this.controller.serviceRequest('luna://org.webosinternals.precorder', {
        	method: 'stop_record',
        	onSuccess: this.recordingStopped,
        	onFailure: this.stopFailure,
        	onError: this.stopFailure
    	});
};

RecordingAssistant.prototype.recordingStopping = function(){
	this.cmdMenuModel.items[0].items[1].disabled = true; // stop
	this.controller.modelChanged(this.cmdMenuModel);
	$("internal-messages").innerHTML = "Saving, please wait...<br>";
};

RecordingAssistant.prototype.recordingStopped = function(response) {
    currentRecording = false;
	this.cmdMenuModel.items[0].items[0].disabled = false; // record
	this.controller.modelChanged(this.cmdMenuModel);
	$("internal-messages").innerHTML = "Recording Stopped.<br>";
	if (lastRecording) {
		this.cmdMenuModel.items[1].items[1].disabled = false; // play
		this.controller.modelChanged(this.cmdMenuModel);
	}
};

RecordingAssistant.prototype.stopFailure = function(response) {
    currentRecording = false;  // Might as well, can't stop it now anyway
    this.cmdMenuModel.items[0].items[0].disabled = false; // record
	this.controller.modelChanged(this.cmdMenuModel);
    $("internal-messages").innerHTML = "Stop failed (WARNING, THIS SHOULD NEVER HAPPEN):<br>" + response.errorText;
};

RecordingAssistant.prototype.play = function(event) {
    p = {target: "file://" + lastRecording};
        
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'launch',
        parameters: {
            id: "com.palm.app.streamingmusicplayer",
            params: p
        }
    });
};

RecordingAssistant.prototype.deactivate = function(event) {
};

RecordingAssistant.prototype.cleanup = function(event) {
    //this.controller.stopListening('record', Mojo.Event.tap, this.record);
    //this.controller.stopListening('stop', Mojo.Event.tap, this.stop);
	//this.controller.stopListening('play', Mojo.Event.tap, this.play);
};
