'use strict';

var React = require('react/addons');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var ModalProgressTrigger = require('./ModalProgressTrigger.js');
var FormMixin = require('./FormMixin.js');

var ApplicationActions = require('../action/ApplicationActions.js');
var ProjectThumbnail = require('./ProjectThumbnail.js');

var FormStart = React.createClass({

    mixins: [FormMixin],

    componentDidMount: function(){
        this._hideModalProgress();
    },

    getDefaultProps: function () {
        return {
            errors: null
        };
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
        var projectThumbnails = [];
        if(this.props.projects && this.props.projects.length > 0){
            for(i = 0; i < this.props.projects.length; i += 2){
                projectThumbnails.push(
                    <Row>
                        <Col xs={12} md={6} sm={6} lg={6}>
                            <ProjectThumbnail key={'thumbNail' + i} {...this.props.projects[i]} />
                        </Col>
                        <Col xs={12} md={6} sm={6} lg={6}>
                            <ProjectThumbnail key={'thumbNail' + i} {...this.props.projects[i+1]} />
                        </Col>
                    </Row>
                );
            }
        }
        return (
            <Grid fluent={true} style={{marginTop: '70px'}}>
                <h3>Choose project you want to clone</h3>
                <hr></hr>
                {alert}
                {projectThumbnails}
            </Grid>
        );
    }

});

module.exports = FormStart;
