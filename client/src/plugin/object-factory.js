'use strict';


function F() {
}
// Object.create support test, and fallback for browsers without it
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        F.prototype = o;
        return new F();
    };
}

var UMyObject = {
    _init: function (element, options) {
        this._element = element;
        this._$element = $(element);

//            this._$element.attr("id", this._$element.attr("id") || umy.commons.newId());
        this.options(options);
    },
    type: function () {
        return this._type;
    },
    options: function (datum) {
        if (arguments.length > 0) {
            this._options = datum;
            return this;
        } else {
            return this._options;
        }
    },
    domElement: function () {
        return this._element;
    },
    jElement: function () {
        return this._$element;
    },
    id: function (datum) {
        if (arguments.length > 0 && datum) {
            this._options.id = "" + datum;
            this.jElement().attr("id", datum);
            return this;
        } else {
            return this.jElement().attr("id");
        }
    },
    parent: function (parentObject) {
        if (arguments.length > 0) {
            this._parent = parentObject;
            return this._parent;
        } else {
            return this._parent;
        }
    }
};

module.exports = function (objectName, objectInstance) {

    var concretePrototype = $.extend({}, UMyObject, objectInstance);

    $.fn[objectName] = function (options) {
        var returnValue = this;
        if (this.length) {
            this.each(function () {
                var controller = $.data(this, objectName);
                //plugin is not instantiated. Create it (requires an object or null as arguments)
                if (!controller) {
                    if (typeof options === "object") {
                        //create an instance of our concrete plugin
                        //create an instance of our concrete plugin
                        var instance = Object.create(concretePrototype);
                        $.data(this, objectName, instance);
                        instance._init(this, options);
                        returnValue = instance;
                    } else {
                        throw new Error("Plugin jQuery." + objectName + " has not yet been instantiated.");
                    }
                } else if (typeof options === "string" && options === "destroy") {
                    $.removeData(this, objectName);
                } else {
                    returnValue = controller;
                }
            });
        }
        return returnValue;
    }

};



