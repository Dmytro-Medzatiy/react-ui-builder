'use strict';

var commons = require('../api/Common.js');

var ComponentOverlay = {
    options: function (datum) {
        if (arguments.length > 0 && datum) {
            this._options = datum;
            this.createWidget();
            //
        } else {
            return this._options;
        }
    },
    createWidget: function () {
        this.jElement().css({
            'position': 'absolute',
            'left': 0, top: 0,
            'width': '100%',
            'height': '1px',
            'z-index': 1035,
            'box-shadow': '0 0 3px 2px #ffffff',
            'border': '1px solid #428bca',
            'background-color': 'rgba(0, 194, 255, 0.10)'
        });
            //.addClass("umy-grid-basic-overlay umy-grid-basic-overlay-selected");
        //this._buttonGroup = $("<div style='position: absolute; table-layout: fixed; display: table; z-index: 1051; width: 500px';></div>");
        //var buttonGroupRow = $("<div class='umyproto-button-group' style='display: table-row; width: 100%; white-space: nowrap;'></div>")
        //    .appendTo(this._buttonGroup);

        this._buttonGroup = $('<div style="position: absolute; z-index: 1051;" class="umyproto-button-group"></div>');

        this._closeBtn = $("<button type='button' class='umyproto-button umyproto-button-small umyproto-button-danger'>" +
        "<span class='umyproto-icon-times'></span>" +
        "</button>").appendTo(this._buttonGroup);
        this._closeBtn.on("click.umyOverlay", (function (callback) {
            return function (e) {
                e.preventDefault();
                e.stopPropagation();
                callback(e);
            }
        }(this._options.onClose)));

        for (var i = 0; i < this._options.buttons.length; i++) {
            var item = $("<button type='button' class='umyproto-button umyproto-button-small umyproto-button-primary'></button>")
                .appendTo(this._buttonGroup);
            if (this._options.buttons[i].btnClass) {
                item.addClass(this._options.buttons[i].btnClass);
            }
            if(this._options.buttons[i].tooltip){
                item.attr({
                    'data-umyproto-tooltip': '{delay: 1500}',
                    'title': this._options.buttons[i].tooltip
                });
            }
            item.on("click.umyOverlay", (function (callback, _this) {
                return function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (callback) {
                        callback(e, _this);
                    }
                }
            }(this._options.buttons[i].onClick, this)));
            if (this._options.buttons[i].icon) {
                item.append("<span class='" + this._options.buttons[i].icon + "'></span>");
            }
            if (this._options.buttons[i].label) {
                item.append("<span>" + this._options.buttons[i].label + "</span>");
            }
            // clearing
            item = null;
        }
        var self = this;

        $(this._options.pageFrameWindow).on("resize.componentOverlay", function (e) {
            if (e.target != self.domElement()) {
                e.stopPropagation();
                self.refresh();
            }
        });

        $(this._options.pageFrameWindow).on("scroll.componentOverlay", function (e) {
            if (e.target != self.domElement()) {
                e.stopPropagation();
                self.refresh();
            }
        });
        return this;
    },
    destroy: function () {
        this.$domNode = null;
        window.clearTimeout(this._timeOutId);
        this._timeOutId = null;
        if(this.$highlightOverlay){
            this.$highlightOverlay.remove();
            this.$highlightOverlay = null;
        }
        if (this._buttonGroup) {
            this._closeBtn.off();
            this._closeBtn = null;
            this._buttonGroup.removeData();
            this._buttonGroup.remove();
            this._buttonGroup = null;

        }
        $(this._options.pageFrameWindow).off("resize.componentOverlay").off("scroll.componentOverlay");
        this._options = null;
        this.jElement().removeData();
        this.jElement().remove();
    },
    append: function (domNode) {
        this.$domNode = $(domNode);
//            umy.workspace.$toolbarOverlaySection.append(this._toolbarGroup);
//        umy.workspace._umyTreeviewPanel.$panelContent.append(this._toolbarGroup);
        this.jElement().appendTo(this.$domNode[0].ownerDocument.body);
        this._buttonGroup.appendTo(this.$domNode[0].ownerDocument.body);
        this.refresh();

        //this.highlightComponent();

        //$(this._component.sortableElement()[0].ownerDocument.body).animate({
        //    scrollTop: this.jElement().offset().top
        //}, 300);
//            $(this._component.sortableElement()[0].ownerDocument.body).scrollTop(this.jElement().offset().top);
        //
        this.startRefreshCycle(15);
        //var self = this;
        //var top = self.jElement().offset().top > 300 ? 700 : -1;
        //console.log("Overlay top: " + top);
        //var scrollTimeOutId = window.setTimeout(function(){
        //    if(top > 0){
        //        $(self._component.sortableElement()[0].ownerDocument.body).animate({
        //            scrollTop: top
        //        }, 300);
        //    }
        //    window.clearTimeout(scrollTimeOutId);
        //}, 500);
    },
    startRefreshCycle: function (count) {
        var self = this;
        this._autoRefreshCount = 1;
        var f = function () {
            if (self && self._autoRefreshCount && self._autoRefreshCount <= count) {
                self.refresh();
                self._timeOutId = setTimeout(f, 500);
                self._autoRefreshCount++;
            }
        };
        f();
    },
    highlightComponent: function () {
        if (commons.isVisible(this.$domNode) && !this.$highlightOverlay) {
            this.$highlightOverlay = $("<div></div>")
                .appendTo(this.$domNode);
            //
            var pos = this.$domNode.offset();
            // workaround for jQuery offset - it doesn't get margin values of the first relative element in the body
            var $bodyChildren = $(this.$domNode[0].ownerDocument.body).children().filter(function () {
                var position = $(this).css("position");
                return position != "fixed";
            });
            var firstElementMargin = 0;
            if ($bodyChildren.length > 0) {
                firstElementMargin = parseInt($bodyChildren.first().css("margin-top"));
            }
            this.$highlightOverlay.css({
                'position': 'absolute',
                'top': (pos.top - 2 - firstElementMargin) + 'px',
                'left': pos.left + 'px',
                'width': this.$domNode.outerWidth() + 'px',
                'height': this.$domNode.outerHeight() + 'px',
                'z-index': 1035,
                'box-shadow': '0 0 3px 2px #ffffff',
                'border': '1px solid #428bca',
                'background-color': 'rgba(0, 194, 255, 0.10)'
            });
            //this.$highlightOverlay.on('click', (function (callback) {
            //    return function (e) {
            //        e.preventDefault();
            //        e.stopPropagation();
            //        alert(callback);
            //        callback(e);
            //    }
            //}(this._options.onClose)));
            //var timeOutId = setTimeout(function () {
            //    $overlay.remove();
            //    $overlay = null;
            //    window.clearTimeout(timeOutId);
            //}, 500);
        }
    },
    refresh: function () {
        if (this.$domNode) {
            //console.log(this._component);
            //console.log(umy.commons.isVisible(this._component.sortableElement()));
            if (commons.isVisible(this.$domNode)) {
                var marginTop = parseInt(this.$domNode.css("margin-top"));
                var marginLeft = parseInt(this.$domNode.css("margin-left"));
                var height = this.$domNode.outerHeight();
                var width = this.$domNode.outerWidth();
                var pos = null;
                var clientWidth = this.$domNode[0].ownerDocument.body.clientWidth;
                // workaround for jQuery offset - it doesn't get margin values of the first relative element in the body
                var $bodyChildren = $(this.$domNode[0].ownerDocument.body).children().filter(function () {
                    var position = $(this).css("position");
                    return position != "fixed";
                });
                var firstElementMargin = 0;
                if ($bodyChildren.length > 0) {
                    firstElementMargin = parseInt($bodyChildren.first().css("margin-top"));
                }
                //
                pos = this.$domNode.offset();
                if (pos) {
                    // check if overlay has to be shown on the topmost component
                    if ((pos.top - 20) > 0) {
                        // overlay can be shown in normal mode
                        this.jElement().css({
                            "top": (pos.top - firstElementMargin) + "px",
                            "left": pos.left + "px"
                        });
                        if ((pos.left + 300) < clientWidth) {
                            this._buttonGroup.css({
                                "top": "auto",
                                "bottom": "calc(100% - " + (pos.top - 4 - firstElementMargin) + "px)",
                                "left": pos.left + "px",
                                "right": "auto"
                            });
                        } else {
                            this._buttonGroup.css({
                                "top": "auto",
                                "left": "auto",
                                "bottom": "calc(100% - " + (pos.top - 4 - firstElementMargin) + "px)",
                                "right": "calc(100% - " + (pos.left + width) + "px)"
                            });
                        }
                    } else {
                        // check the component's height, a less height allows to show overlay buttons under component
                        // instead of the top line of component
                        if (height > 60) {
                            // overlay should be placed under top line of component
                            this.jElement().css({
                                "top": (pos.top) + "px",
                                "left": pos.left + "px"
                            });
                            if ((pos.left + 300) < clientWidth) {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "top": (pos.top + 4 - firstElementMargin) + "px",
                                    "left": pos.left + "px",
                                    "right": "auto"
                                });
                            } else {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "left": "auto",
                                    "top": (pos.top + 4 - firstElementMargin) + "px",
                                    "right": "calc(100% - " + (pos.left + width) + "px)"
                                });
                            }
                        } else {
                            // overlay should be placed under bottom line of component
                            this.jElement().css({
                                "top": (pos.top) + "px",
                                "left": pos.left + "px"
                            });
                            if ((pos.left + 300) < clientWidth) {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "top": (pos.top + height + 4 - firstElementMargin) + "px",
                                    "left": pos.left + "px",
                                    "right": "auto"
                                });
                            } else {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "left": "auto",
                                    "top": (pos.top + height + 4 - firstElementMargin) + "px",
                                    "right": "calc(100% - " + (pos.left + width) + "px)"
                                });
                            }
                        }
                    }
                }
                this.jElement().css({
                    "width": width + "px",
                    "height": height + "px"
                });
            } else {
                this.jElement().hide();
                this._buttonGroup.hide();
            }
        }
    }
};

module.exports = ComponentOverlay;
