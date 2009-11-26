function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
    this.record = this.record.bindAsEventListener(this);
    this.launch = this.launch.bindAsEventListener(this);
    
    this.controller.setupWidget("record", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                { 
                    buttonLabel : $L("Record New"), 
                    disabled: false 
                });
    this.controller.listen('record', Mojo.Event.tap, 
               this.record);

    this.controller.setupWidget("launch", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                { 
                    buttonLabel : $L("Launch Video Player"), 
                    disabled: false 
                }); 
    this.controller.listen('launch', Mojo.Event.tap, 
               this.launch);
};

MainAssistant.prototype.record = function(event) {
    Mojo.Controller.stageController.pushScene("record");
};

MainAssistant.prototype.launch = function(event) {  
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'launch',
        parameters: {
            id: "com.palm.app.videoplayer",
            params:{}
        }
    });
};

MainAssistant.prototype.activate = function(event) {
};

MainAssistant.prototype.deactivate = function(event) {
};

MainAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening('record', Mojo.Event.tap,
                                  this.record);
    this.controller.stopListening('launch', Mojo.Event.tap, 
               this.launch);
};
