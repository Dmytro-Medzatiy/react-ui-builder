var _ = require('underscore');
var React = require('react/addons');

var components = require('<%= indexFilePath.replace(/\\/g, '/') %>');

var PageForDesk = React.createClass({

    getInitialState: function(){
        return null;
    },

    componentDidMount: function(){
        window.endpoint.Page = this;
        if(window.endpoint.onComponentDidMount){
            window.endpoint.onComponentDidMount();
        }
    },

    componentWillUnmount: function(){
        window.endpoint.Page = null;
        if(window.endpoint.onComponentWillUnmount){
            window.endpoint.onComponentWillUnmount();
        }
    },

    componentDidUpdate: function(prevProps, prevState){
        if(window.endpoint.onComponentDidUpdate){
            window.endpoint.onComponentDidUpdate();
        }
    },

    componentWillUpdate(nextProps, nextState){
        if(window.endpoint.onComponentWillUpdate){
            window.endpoint.onComponentWillUpdate();
        }
    },

    shouldComponentUpdate(nextProps, nextState){
        return true;
    },

    findDOMNodeInPage: function(component){
        return React.findDOMNode(component);
    },

    render: function(){
        var elementTree = !_.isEmpty(this.state) ?
            this._createElements(this.state) :
            (<h4 style={{textAlign: 'center'}}>There are runtime errors during rendering of the page. Please see console output. React doesn't handle runtime errors.</h4>);
        return (
            <div>
                {elementTree}
            </div>
        );
    },

    _createElements: function(model){

        var self = this;
        var elements = [];
        _.map(model.children, function(child, index){
            elements.push(self._createElement(child, index));
        });
        return elements;
    },

    _createElement: function(options, ref){

        var type = 'div';
        if(options.type){
            type = this._findComponent(components, options.type, 0);
            if(!type){
                type = options.type;
            } else if(!_.isObject(type)){
                console.error('Element type: ' + options.type + ' is not object. Please check your components-index.js file');
                type = 'div';
            }
        }

        var props = _.extend({}, options.props);
        props.key = ref;

        var self = this;
        if(_.isObject(type)){
            _.mapObject(type.propTypes, function(propType, propName){
                if(props[propName] && props[propName].type){
                    props[propName] = self._createElement(props[propName], 0);
                }
            });
        }

        var nestedElements = null;
        if(options.children && options.children.length > 0){
            var children = [];
            _.map(options.children, function(childOptions){
                children.push(self._createElement(childOptions, ++ref));
            });
            nestedElements = children;
        } else if(options.text) {
            nestedElements = options.text;
        }
        var result = null;
        try{
            result = React.createElement(type, props, nestedElements);
        } catch(e){
            console.error('Element type: ' + options.type + ' is not valid React Element. Please check your components-index.js file');
        }
        return result;
    },

    _findComponent: function(index, componentName, level){
        var result;
        if(index && _.isObject(index) && level <= 1){
            level++;
            _.mapObject(index, function(value, key){
                if(!result){
                    if(key === componentName){
                        result = value;
                    } else if(value && _.isObject(value)){
                        result = this._findComponent(value, componentName, level);
                    }
                }
            }, this);
        }
        return result;
    }

});

React.render(<PageForDesk/>, document.getElementById('umy-pageBody'));
