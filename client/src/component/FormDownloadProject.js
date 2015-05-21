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

var FormStart = React.createClass({

    mixins: [FormMixin],

    componentDidMount: function(){
        this._hideModalProgress();
    },

    getInitialState: function(){
        return {
            dirPath: this.props.dirPath
        }
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
        var panelTitle = (
            <h3>Create project in local directory</h3>
        );
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
                    <Col xs={10} md={8} sm={10} lg={6} xsOffset={1} mdOffset={2} smOffset={1} lgOffset={3}>
                        {alert}
                        <Panel header={panelTitle} bsStyle="primary">
                            <Input
                                label='Local directory path'
                                ref='dirPathInput'
                                type={ 'text'}
                                value={this.state.dirPath}
                                onChange={this._handleChangeDirPath}
                                placeholder={ 'Enter path value'}
                                />
                            <Button bsStyle='primary' onClick={this._handleCreateProject}>Submit</Button>
                            <Button bsStyle='default' onClick={this._handleCancel}>Cancel</Button>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    },

    _handleCreateProject: function(e){
        e.preventDefault();
        e.stopPropagation();
        var options = {};
        options.dirPath = this.refs.dirPathInput.getValue();
        ApplicationActions.downloadProject(options);
    },

    _handleCancel: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.goToGallery();

    },

    _handleChangeDirPath: function(e){
        this.setState({
            dirPath: this.refs.dirPathInput.getValue()
        });
    }

});

module.exports = FormStart;
