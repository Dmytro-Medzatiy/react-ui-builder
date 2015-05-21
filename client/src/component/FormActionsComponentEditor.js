'use strict';

var React = require('react');

var FormActionsComponentEditor = React.createClass({

    componentDidMount: function(){
        //
        if(!this.editor){
            this.editor = ace.edit(React.findDOMNode(this.refs.editorArea));
            this.editor.getSession().setMode("ace/mode/javascript");
            this.editor.$blockScrolling = Infinity;
        }
        this.editor.getSession().setValue(this.props.actionsSourceCode);
        this.editor.focus();
        //
    },

    componentWillUnmount: function(){
        if(this.editor){
            this.editor.destroy();
            this.editor = null;
        }
    },

    render: function(){
        var containerStyle={
            marginTop: '1em',
            width: '100%'
        };
        return (
            <div className='container-fluid' style={containerStyle}>
                <div className='row' style={{marginBottom: '3px'}}>
                    <div className='col-xs-2'>
                    </div>
                    <div className='col-xs-10'>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-12'>
                        <div ref='editorArea' style={{height: '400px', width: '100%'}}></div>
                    </div>
                </div>
            </div>
        );
    },

    getActionsScript: function(){
        return this.editor.getSession().getValue();
    }

});

module.exports = FormActionsComponentEditor;
