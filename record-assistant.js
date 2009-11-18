function RecordAssistant() {
}

RecordAssistant.prototype.setup = function() {
    this.recordingStarted = this.recordingStarted.bind(this);
    this.recordFailure = this.recordFailure.bind(this);
    this.recordingStopped = this.recordingStopped.bind(this);
    this.stopFailure = this.stopFailure.bind(this);
    
    this.controller.setupWidget("stop", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                this.stopModel = { 
                    buttonLabel : $L("Stop Recording"), 
                    disabled: true 
                }); 
    this.controller.listen('stop', Mojo.Event.tap, 
               this.stop.bindAsEventListener(this));   
};

RecordAssistant.prototype.activate = function(event) {
    this.controller.serviceRequest('palm://org.webosinternals.gstservice', {
        method: 'videoRec',
        parameters: {
            audio: prefs.audio,
            video: prefs.video,
            container: prefs.container,
            stream: prefs.stream,
            flash: prefs.flash,
            filename: filename
        },
        onSuccess: this.recordingStarted,
        onFailure: this.recordFailure,
        onError: this.recordFailure
    });
};

RecordAssistant.prototype.recordingStarted = function(msg) {
    this.stopModel.disabled = false;
    this.controller.modelChanged(this.stopModel);
    $("messages").innerHTML += "Recording...<br>" + msg.output;
    // start time
};

RecordAssistant.prototype.recordFailure = function(response) {
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

RecordAssistant.prototype.recordingStopped = function(event) {
    Mojo.Controller.stageController.popScene();
};

RecordAssistant.prototype.stopFailure = function(response) {
    $("messages").innerHTML += "Stop failed:<br>" + response.errorText;
    // pop up error dialog then pop scene
};

RecordAssistant.prototype.deactivate = function(event) {
};

RecordAssistant.prototype.cleanup = function(event) {
};
