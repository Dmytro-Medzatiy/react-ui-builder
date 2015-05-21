'use strict';

var _ = require('underscore');
var React = require('react');
var Modal = require('react-bootstrap').Modal;

var ModalProgress = React.createClass({

    getInitialState: function(){
        return {
            seconds: 0
        }
    },

    getDefaultProps: function () {
        return {
            onRequestHide: null,
            text: 'Loading...'
        };
    },

    componentDidMount: function(){
        this._waitASecond();
    },

    componentWillUnmount: function(){
        clearTimeout(this.timeoutProcessId);
    },

    _waitASecond: function(){
        this.timeoutProcessId = setTimeout(function(){
            this.setState({
                seconds: ++this.state.seconds
            });
            this._waitASecond();
        }.bind(this), 1000);

    },

    render: function(){
        var messageContent = [];
        if(this.props.message){
            messageContent.push(
                <h4 key='message'>{this.props.message}</h4>
            );
        } else if(this.props.messageArray){
            _.each(this.props.messageArray, function(item, index){
                messageContent.push(
                    <p key={'message' + index} >{item}</p>
                )
            });
        }
        return (
            <Modal {...this.props} title={false} animation={true} backdrop={false}>
                <div className="modal-body">
                    {messageContent}
                </div>
                <div className="modal-footer">
                    <p className='text-center'>{this.state.seconds + ' sec.'}</p>
                </div>
            </Modal>
        );
    }

});

module.exports = ModalProgress;
