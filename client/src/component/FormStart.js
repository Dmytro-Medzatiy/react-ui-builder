'use strict';

var React = require('react/addons');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Badge = ReactBootstrap.Badge;
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
            <h3>Choose what you want to do</h3>
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
        var recentProjectsPanel = null;
        if(this.props.recentProjectDirs && this.props.recentProjectDirs.length > 0){
            var dirPathLinks = [];
            for(i = 0; i < this.props.recentProjectDirs.length; i++){
                dirPathLinks.push(
                    <ListGroupItem key={'recentDirPath' + i} href='#' onClick={this._handleRecentSelected} data-dirpath={this.props.recentProjectDirs[i]} >
                        <span className='fa fa-fw fa-folder'></span><span>&nbsp;&nbsp;</span><span>{this.props.recentProjectDirs[i]}</span>
                    </ListGroupItem>
                );
            }
            recentProjectsPanel = (
                <Panel header={ <h4><span>Recent local projects</span></h4> }>
                    <ListGroup fill={true} style={{ height: '100px', overflow: 'auto' }}>
                        {dirPathLinks}
                    </ListGroup>
                </Panel>
            );
        }
        return (
            <Grid fluent={true}>
                <Row style={{marginTop: '70px'}}>
                    <Col xs={10} md={8} sm={10} lg={6} xsOffset={1} mdOffset={2} smOffset={1} lgOffset={3}>
                        {alert}
                        <Panel header={panelTitle} bsStyle="primary">
                            <Button bsStyle={ 'default'} block={true} onClick={this._handleBrowseProjects}>
                                <span>Browse published projects</span>
                            </Button>
                            <h3 className={ 'text-center'}><span >OR</span></h3>
                            <Input
                                ref='dirPathInput'
                                type={ 'text'}
                                placeholder={ 'Local project directory path'}
                                addonBefore={<span className='fa fa-folder-o'></span>}
                                buttonAfter={ <Button onClick={this._handleOpenProject} bsStyle={ 'default'}><span>Open</span></Button> }>
                            </Input>
                            {recentProjectsPanel}
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    },

    _handleRecentSelected: function(e){
        e.preventDefault();
        e.stopPropagation();
        var options = {
            dirPath: e.currentTarget.attributes['data-dirpath'].value
        };
        ApplicationActions.openLocalProject(options);
    },

    _handleOpenProject: function(e){
        e.preventDefault();
        e.stopPropagation();
        var options = {};
        options.dirPath = this.refs.dirPathInput.getValue();
        ApplicationActions.openLocalProject(options);
    },

    _handleBrowseProjects: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.goToGallery();

    }

});

module.exports = FormStart;
