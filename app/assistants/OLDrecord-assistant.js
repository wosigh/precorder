var filename = "testvideo";

function RecordAssistant() {
}

RecordAssistant.prototype.setup = function() {
    this.recordingStarted = this.recordingStarted.bind(this);
    this.recordFailure = this.recordFailure.bind(this);
    this.recordingStopped = this.recordingStopped.bind(this);
    this.stopFailure = this.stopFailure.bind(this);
    this.stop = this.stop.bindAsEventListener(this);
    
    this.controller.setupWidget("stop", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                this.stopModel = { 
                    buttonLabel : $L("Stop Recording"), 
                    disabled: true 
                }); 
    this.controller.listen('stop', Mojo.Event.tap, this.stop);
};

RecordAssistant.prototype.handleCommand = function(event) {
    if (event.type === Mojo.Event.back) {
        event.stop();
        event.stopPropagation();
        if(videoRecording) {
            this.controller.serviceRequest('palm://org.webosinternals.gstservice', {
                method: 'videoStop',
                onSuccess: this.recordingStopped,
                onFailure: this.stopFailure,
                onError: this.stopFailure
            });
            
        }
    }
};

RecordAssistant.prototype.activate = function(event) {
    this.recordingStarted();
    this.controller.serviceRequest('palm://org.webosinternals.gstservice', {
        method: 'videoRec',
        parameters: {
            audio: prefs.audio,
            video: prefs.video,
            container: prefs.container,
            stream: prefs.stream,
            brightness: prefs.LED,
            filename: filename
        },
        onFailure: this.recordFailure,
        onError: this.recordFailure
    });
};

RecordAssistant.prototype.recordingStarted = function(msg) {
    videoRecording = true;
    this.stopModel.disabled = false;
    this.controller.modelChanged(this.stopModel);
    $("messages").innerHTML += "Recording...<br>";
    // start time
};

RecordAssistant.prototype.recordFailure = function(response) {
    videoRecording = false;
    $("messages").innerHTML += "Recording failed:<br>" + response.errorText;
    // pop up error dialog then pop scene
};

RecordAssistant.prototype.stop = function(event) {
    this.controller.serviceRequest('palm://org.webosinternals.gstservice', {
        method: 'videoStop',
        onSuccess: this.recordingStopped,
        onFailure: this.stopFailure,
        onError: this.stopFailure
    });
};

RecordAssistant.prototype.recordingStopped = function(response) {
    videoRecording = false;
    Mojo.Controller.stageController.popScene(response.path);
};

RecordAssistant.prototype.stopFailure = function(response) {
    videoRecording = false;  // We'll be unlikely to stop it now anyhow
    $("messages").innerHTML += "Stop failed:<br>" + response.errorText;
    // pop up error dialog then pop scene
    Mojo.Controller.stageController.popScene();
};

RecordAssistant.prototype.deactivate = function(event) {
};

RecordAssistant.prototype.cleanup = function(event) {
    if(videoRecording) {
        this.controller.serviceRequest('palm://org.webosinternals.gstservice', {
            method: 'videoStop'
        });
    }
    this.controller.stopListening('stop', Mojo.Event.tap, this.stop);
};
