'use strict';

var React = require('react');
var ApplicationStore = require('../store/ApplicationStore.js');
var ModalProgressTrigger = require('./ModalProgressTrigger.js');
var ModalVariantsTrigger = require('./ModalVariantsTrigger.js');
var ModalProjectSettingsTrigger = require('./ModalProjectSettingsTrigger.js');
//var FormSignIn = require('./FormSignIn.js');
//var FormSignUp = require('./FormSignUp.js');
//var FormUserProfile = require('./FormUserProfile.js');
//var FormCreateProject = require('./FormCreateProject.js');
var FormStart = require('./FormStart.js');
var FormBrowseGallery = require('./FormBrowseGallery.js');
var FormDownloadProject = require('./FormDownloadProject.js');
var DeskGallery = require('./DeskGallery.js');

var PageErrors = require('./PageErrors.js');
var Desk = require('./Desk.js');
var ApplicationActions = require('../action/ApplicationActions.js');
var FormMixin = require('./FormMixin.js');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Nav = ReactBootstrap.Nav;
var CollapsibleNav = ReactBootstrap.CollapsibleNav;
var Navbar = ReactBootstrap.Navbar;
var NavItem = ReactBootstrap.NavItem;

/**
 *
 */
var Application = React.createClass({

    mixins: [FormMixin],

    getInitialState: function(){
        return ApplicationStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this._hideModalProgress();
        this.unsubscribe = ApplicationStore.listen(this.onModelChange);
    },

    componentDidUpdate: function(){
        this._hideModalProgress();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(){
        //
        var linkToHome = null;
        if(this.state.stage !== 'start'){
            linkToHome = (
                <NavItem href="#" onClick={this._handleGoHome}>
                    Back to home
                </NavItem>
            );
        }
        var navBar = (
            <Navbar
                brand={
                    <div><a href='http://umyproto.com'>UMyProto</a>
                    <span style={{marginLeft: '1em'}}>React UI Builder</span>
                    <span className='text-muted' ref='brandTitle' style={{marginLeft: '1em'}}>{'(' + this.state.packageVersion + ')'}</span>
                    </div>
                }
                staticTop={true}
                fixedTop={true} toggleNavKey={0}>
                <CollapsibleNav eventKey={0}>
                    <Nav navbar right={true}>
                        {linkToHome}
                        <NavItem href="https://groups.google.com/forum/#!forum/react-ui-builder" target="_blank">
                            <span className="fa fa-comments-o fa-fw"></span>Forum / Help
                        </NavItem>
                        <NavItem href="mailto:umyprotoservice@gmail.com?subject=React UI Builder question">
                            <span className='fa fa-envelope-o fa-fw'></span>Write to us
                        </NavItem>
                    </Nav>
                </CollapsibleNav>
            </Navbar>
        );
        //
        var content = null;
        if(this.state.stage === 'start'){
            content = (
                <FormStart
                    errors={this.state.errors}
                    recentProjectDirs={this.state.builderConfig.recentProjectDirs}/>
            );
        } else if(this.state.stage === 'gallery'){
            content = (
                <FormBrowseGallery
                    errors={this.state.errors}
                    projects={this.state.projects}/>
            );
        } else if(this.state.stage === 'previewProject'){
            navBar = null;
            content = (
                <DeskGallery
                    projectId={this.state.previewProjectId}
                    src={this.state.previewHtml}
                    projectModel={this.state.previewProjectModel}/>
            );
        } else if(this.state.stage === 'downloadProjectForm'){
            content = (
                <FormDownloadProject
                    dirPath={this.state.downloadProjectDirPath}
                    errors={this.state.errors} />
            );
        } else if(this.state.stage === 'deskPage'){
            navBar = null;
            content = (
                <Desk/>
            );
        } else if(this.state.stage === 'errors'){
            content = (
                <PageErrors errors={this.state.errors}/>
            );
        } else {
            content = (<h3>Unknown application stage.</h3>);
        }

        return (
            <div>
                {navBar}
                {content}
                <ModalProgressTrigger/>
                <ModalVariantsTrigger/>
                <ModalProjectSettingsTrigger/>
            </div>
        );
    },

    _handleGoHome: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.goToStartPage();
    }

});

module.exports = Application;
