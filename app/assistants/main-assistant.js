function MainAssistant(){
}

MainAssistant.prototype.setup = function() {
	
	// viewMenuModel is a global defined in stage-assistant.js
	this.controller.setupWidget(Mojo.Menu.viewMenu, {spacerHeight: 0, menuClass:"no-fade"}, viewMenuModel);

    this.record = this.record.bindAsEventListener(this);
    this.stop   = this.stop.bindAsEventListener(this);
    
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
			   
	this.controller.setupWidget("stop", 
                { 
                    disabledProperty: 'enabled' 
                }, 
                { 
                    buttonLabel : $L("Record New"), 
                    disabled: true 
                });
    this.controller.listen('stop', Mojo.Event.tap, 
               this.record);

    /*this.controller.setupWidget("launch", 
                { 
                    disabledProperty: 'disabled' 
                }, 
                this.launchModel = { 
                    buttonLabel : $L("Launch Video Player"), 
                    disabled: false 
                }); 
    this.controller.listen('launch', Mojo.Event.tap, 
               this.launch);*/
};

MainAssistant.prototype.launch = function(event) {
    var p = {};
    
    if(this.lastVideo)
        p = {target: "file:///media/internal/video/" + this.lastVideo};
        
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'launch',
        parameters: {
            id: "com.palm.app.videoplayer",
            params: p
        }
    });
};

MainAssistant.prototype.activate = function(lastFilename) {
    if(lastFilename)
    {
        this.lastVideo = lastFilename;
        this.launchModel.buttonLabel = $L("Launch Last Video");
        this.controller.modelChanged(this.launchModel);
    }
};

MainAssistant.prototype.deactivate = function(event) {
};

MainAssistant.prototype.cleanup = function(event) {
    this.controller.stopListening('record', Mojo.Event.tap,
                                  this.record);
    this.controller.stopListening('stop', Mojo.Event.tap, 
               this.launch);
};
