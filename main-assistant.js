function MainAssistant() {
}

MainAssistant.prototype.setup = function() {
    this.controller.setupWidget("record", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                { 
                    buttonLabel : $L("Record New"), 
                    disabled: false 
                }); 
    this.controller.listen('record', Mojo.Event.tap, 
               this.record.bindAsEventListener(this));   

    this.controller.setupWidget("launch", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                { 
                    buttonLabel : $L("Launch"), 
                    disabled: true 
                }); 
    this.controller.listen('launch', Mojo.Event.tap, 
               this.launch.bindAsEventListener(this));   
};

MainAssistant.prototype.record = function(event) {
    Mojo.Controller.stageController.pushScene("record");
};

MainAssistant.prototype.launch = function(event) {  
};

MainAssistant.prototype.activate = function(event) {
};

MainAssistant.prototype.deactivate = function(event) {
};

MainAssistant.prototype.cleanup = function(event) {
};
