'use strict';

var React = require('react/addons');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;

var FormMixin = require('./FormMixin.js');

var PageErrors = React.createClass({

    mixins: [FormMixin],

    componentDidMount: function(){
        this._hideModalProgress();
    },

    componentDidUpdate: function(){
        this._hideModalProgress();
    },

    render: function(){
        var alert = null;
        if(this.props.errors && this.props.errors.length > 0){
            var alerts = [];
            for(var i = 0; i < this.props.errors.length; i++){
                var stringError = JSON.stringify(this.props.errors[i]);
                alerts.push(
                    <p key={'error' + i}><strong>{stringError}</strong></p>
                );
            }
            alert = (
                <Alert bsStyle="danger">{alerts}</Alert>
            );
        }
        return (
            <Grid fluent={true}>
                <Row style={{marginTop: '70px'}}>
                    <Col xs={6} xsOffset={3}>
                        {alert}
                    </Col>
                </Row>
            </Grid>
        );
    }

});

module.exports = PageErrors;
