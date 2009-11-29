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
                    {label: $L("AAC"), value: "AAC"},
                    {label: $L("AMRNB"), value: "AMRNB"},
                    {label: $L("MP3"), value: "MP3"}
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
                    {label: $L("MPEG-4"), value: "MPEG-4"},
                    {label: $L("H.263"), value: "H.263"},
                    {label: $L("H.264/AVC"), value: "H.264/AVC"}
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
                    {label: $L("mp4"), value: "mp4"},
                    {label: $L("3gp"), value: "3gp"}
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
                    {label: $L("Audio only"), value: "audio"},
                    {label: $L("Video only"), value: "video"},
                    {label: $L("Both"), value: "both"}
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

    this.controller.setupWidget("LED-options",
            {
                label: $L("Video Light"),
                labelPlacement: Mojo.Widget.labelPlacementLeft,
                choices: [
                    {label: $L("Off"), value: "off"},
                    {label: $L("Low"), value: "low"},
                    {label: $L("Medium"), value: "medium"},
                    {label: $L("High"), value: "high"}
                    ]
            },
            this.LEDModel = {
                value: prefs.LED,
                optionName: "LED",
                disabled: false
            }
        );

    Mojo.Event.listen(this.controller.get("LED-options"),
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
    Mojo.Event.stopListening(this.controller.get("audio-options"),
        Mojo.Event.propertyChange, this.optionChanged);
    Mojo.Event.stopListening(this.controller.get("video-options"),
        Mojo.Event.propertyChange, this.optionChanged);
    Mojo.Event.stopListening(this.controller.get("container-options"),
        Mojo.Event.propertyChange, this.optionChanged);
    Mojo.Event.stopListening(this.controller.get("stream-options"),
        Mojo.Event.propertyChange, this.optionChanged);
    Mojo.Event.stopListening(this.controller.get("LED-options"),
        Mojo.Event.propertyChange, this.optionChanged);
};
