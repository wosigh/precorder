function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function() {
    try {
    this.optionChanged = this.optionChanged.bindAsEventListener(this);
    
    this.controller.setupWidget("audio-options",
            {
                label: $L("Audio format"),
                labelPlacement: Mojo.Widget.labelPlacementLeft,
                choices: [
                    {label: "AAC", value: "AAC"},
                    {label: "AMRNB", value: "AMRNB"},
                    {label: "MP3", value: "MP3"}
                    ]
            },
            this.audioModel = {
                value: prefs.audio,
                optionName: "audio",
                disabled: false
            }
        );
    
    Mojo.Event.listen(this.controller.get("audio-options"),
                      Mojo.Event.propertyChange, this.optionChanged);

    this.controller.setupWidget("video-options",
            {
                label: $L("Video format"),
                labelPlacement: Mojo.Widget.labelPlacementLeft,
                choices: [
                    {label: "MPEG-4", value: "MPEG-4"},
                    {label: "H.263", value: "H.263"},
                    {label: "H.264/AVC", value: "H.264/AVC"}
                    ]
            },
            this.videoModel = {
                value: prefs.video,
                optionName: "video",
                disabled: false
            }
        );

    Mojo.Event.listen(this.controller.get("video-options"),
                      Mojo.Event.propertyChange, this.optionChanged);

    this.controller.setupWidget("container-options",
            {
                label: $L("Container"),
                labelPlacement: Mojo.Widget.labelPlacementLeft,
                choices: [
                    {label: "MP4", value: "MP4"},
                    {label: "3GP", value: "3GP"}
                    ]
            },
            this.containerModel = {
                value: prefs.container,
                optionName: "container",
                disabled: false
            }
        );

    Mojo.Event.listen(this.controller.get("container-options"),
                      Mojo.Event.propertyChange, this.optionChanged);

    this.controller.setupWidget("stream-options",
            {
                label: $L("Media source"),
                labelPlacement: Mojo.Widget.labelPlacementLeft,
                choices: [
                    {label: "Audio only", value: "audio"},
                    {label: "Video only", value: "video"},
                    {label: "Both", value: "both"}
                    ]
            },
            this.streamModel = {
                value: prefs.stream,
                optionName: "stream",
                disabled: false
            }
        );

    Mojo.Event.listen(this.controller.get("stream-options"),
                      Mojo.Event.propertyChange, this.optionChanged);

    this.controller.setupWidget('flash-toggle',
                                {},
                                this.flashModel = {
                                    value: prefs.flash,
                                    optionName: "flash",
                                    disabled: false
                                });
    
    Mojo.Event.listen(this.controller.get('flash-toggle'),
                      Mojo.Event.propertyChange, this.optionChanged);

    } catch(err) { Mojo.Log.error("err: %j", err); }
};

PreferencesAssistant.prototype.optionChanged = function(event) {
    prefs[event.model.optionName] = event.model.value;
    prefs.save();
};

PreferencesAssistant.prototype.activate = function(event) {
};

PreferencesAssistant.prototype.deactivate = function(event) {
};

PreferencesAssistant.prototype.cleanup = function(event) {
};
