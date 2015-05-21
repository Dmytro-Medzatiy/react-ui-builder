'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;


var OverlayButtons = React.createClass({

    componentDidMount: function(){

    },

    componentDidUpdate: function(){

    },

    render: function(){
        var buttons = [];
        for (var i = 0; i < this.props.buttons.length; i++) {
            var buttonClassName = 'btn btn-primary';
            if (this.props.buttons[i].btnClass) {
                buttonClassName += this.props.buttons[i].btnClass;
            }
            var onClick = (function (callback) {
                return function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (callback) {
                        callback(e);
                    }
                }
            }(this.props.buttons[i].onClick));
            var inners = [];
            if (this.props.buttons[i].icon) {
                inners.push(<span className={'fa fa-fw ' + this.props.buttons[i].icon}></span>);
            }
            if (this.props.buttons[i].label) {
                inners.push(<span>{this.props.buttons[i].label}</span>);
            }
            var className = 'btn btn-primary' + (this.props.buttons[i].btnClass ? ' ' + this.props.buttons[i].btnClass : '');
            buttons.push(
                <button type='button' style={{display: 'table-cell'}} className={className} onClick={onClick}>
                    {inners}
                </button>
            );
        }

        var overlayStyle = {
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': '10px',
            'height': '0px',
            'zIndex': 1035
        };

        return (
            <div style={{position: 'absolute', left: 0, top: '-2.1em', display: 'table', width: '100%', zIndex: 1051}}>
                <div className='btn-group btn-group-xs' style={{display: 'table-row', width: '100%', whiteSpace: 'nowrap'}}>
                    <button style={{display: 'table-cell'}} type='button' className='btn btn-warning' onClick={this._handleClose}>
                        <span className='fa fa-times fa-fw'></span>
                    </button>
                    {buttons}
                </div>
            </div>
        );
    },

    _handleClose: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.onClose(e);
    }

});

module.exports = OverlayButtons;
