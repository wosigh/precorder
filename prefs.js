// Copyright (c) 2009 Roy Sutton
// Preferences class for webOS
var prefs = {

    // defaults contains the names and default values, will be used if no saved prefs
    //  be careful not to use any values that would interfere with the object
    defaults: { audio: "AAC",
                video: "H.264/AVC",
                container: "mp4",
                stream: "both",
                flash: false,
                firstUse: true
    },

    initialize: function() {
        Object.extend(this, this.defaults);
    },
    load: function () {
        cookie = new Mojo.Model.Cookie("Preferences");

        var _prefs = cookie.get();

        if (_prefs && _prefs.version === Mojo.appInfo.version) {
            Object.extend(this, _prefs);
        }
    },
    save: function () {
        var values = {};
        var keys = Object.keys(this.defaults);
        
        values.version = Mojo.appInfo.version;
        for(var i = 0; i < keys.length; i++)
        {
            values[keys[i]] = this[keys[i]];
        }
        cookie = new Mojo.Model.Cookie("Preferences");
        cookie.put(values);
    }
};

prefs.initialize();