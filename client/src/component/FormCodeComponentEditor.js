'use strict';

var React = require('react/addons');
var validator = require('validator');

var Repository = require('../api/Repository.js');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

var FormCodeComponentEditor = React.createClass({

    getInitialState: function(){
        return {
            includeChildren: true,
            includeAllReferences: false,
            includeFlux: false
        };
    },

    componentDidMount: function() {
        this._checkEditor();
    },

    componentDidUpdate: function(){
        this._checkEditor();
    },

    render: function(){

        var editorElement = null;
        var toolBarElement = null;
        if (this.props.isProjectComponent) {
            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={12}>
                        <table>
                            <tr>
                                <td>
                                    <div className="dropdown">
                                        <button className="btn btn-default btn-xs dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true">
                                            <span className="fa fa-gear fa-fw"></span>
                                            <span className="fa fa-caret-down fa-fw"></span>
                                        </button>
                                        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                                            <li role="presentation">
                                                <a role="menuitem" href="#" onClick={this.props.handleCreateComponentChildren}>
                                                    Merge children into source code
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td>
                                    <p style={{marginLeft: "1em"}}>
                                        <span>{this.props.sourceFilePath}</span>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </Col>
                </Row>
            );
            editorElement = <div ref='editorArea' style={this.props.editorStyle}></div>
        } else {
            var groupItems = [];
            var groups = Repository.getComponentsTreeGroups();
            if (groups && groups.length > 0) {
                for (var i = 0; i < groups.length; i++) {
                    if(groups[i] !== 'Html'){
                        groupItems.push(
                            <li key={i}>
                                <a href="#" onClick={this._handleGroupNameSelected} data-group={groups[i]}>
                                    <span>{groups[i]}</span>
                                </a>
                            </li>
                        );
                    }
                }
            }
            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={3} lg={9} md={8} sm={7}>
                    </Col>
                    <Col xs={9} lg={3} md={4} sm={5}>
                    </Col>
                </Row>
            );
            editorElement = (
                <div style={this.props.editorStyle}>
                    <div style={{height: '100%', width: '100%'}}>
                        <table style={{width: '100%'}}>
                            <tr>
                                <td style={{width: '10%'}}></td>
                                <td>
                                    <form>
                                        <div className={'form-group ' + this._validationStateGroupName()}>
                                            <label htmlFor='groupNameElement'>Group:</label>
                                            <div className="input-group input-group-sm">
                                                <input id='groupNameElement'
                                                       ref='groupNameInput'
                                                       type="text"
                                                       className="form-control"
                                                       placeholder='Group name'
                                                       value={this.state.componentGroup}
                                                       onChange={this._handleGroupNameChange}
                                                    />

                                                <div className="input-group-btn">
                                                    <button type="button"
                                                            className="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                        <span className="caret"></span>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                                        {groupItems}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'form-group ' + this._validationStateComponentName()}>
                                            <label htmlFor='componentNameElement'>Component:</label>
                                                <input id='componentNameElement'
                                                       ref='componentNameInput'
                                                       className="form-control input-sm"
                                                       type="text"
                                                       placeholder='Component name'
                                                       value={this.state.componentName}
                                                       onChange={this._handleComponentNameChange}
                                                    />
                                        </div>
                                        <Input
                                            type="checkbox"
                                            ref="includeChildrenCheckbox"
                                            checked={this.state.includeChildren}
                                            onChange={this._handleIncludeChildrenChange}
                                            label="Include children into component code" />
                                        <Input
                                            type="checkbox"
                                            ref="includeFluxCheckbox"
                                            checked={this.state.includeFlux}
                                            onChange={this._handleIncludeFluxChange}
                                            label="Include Reflux actions and store into component code" />
                                        {/*<Input
                                            type="checkbox"
                                            ref="includeAllReferencesCheckbox"
                                            checked={this.state.includeAllReferences}
                                            onChange={this._handleIncludeAllReferencesChange}
                                            label="Include all references of project components" />*/}
                                        <Button block={false}
                                                onClick={this.props.handleCreateComponent}><span>Create component</span></Button>
                                    </form>
                                </td>
                                <td style={{width: '10%'}}></td>
                            </tr>
                        </table>
                    </div>
                </div>
            );
        }
        return (
            <Grid style={this.props.style} fluent={true} >
                {toolBarElement}
                <Row>
                    <Col xs={12}>
                        {editorElement}
                    </Col>
                </Row>
            </Grid>
        );
    },

    getComponentSourceCodeOptions: function(){
        var options = {
            componentGroup: this.state.componentGroup,
            componentName: this.state.componentName,
            includeChildren: this.state.includeChildren,
            includeFlux: this.state.includeFlux
        };
        if(this.editor && this.props.isProjectComponent){
            options.sourceCode = this.editor.getSession().getValue();
        }
        return options;
    },

    _handleGroupNameChange: function(){
        var groupName = React.findDOMNode(this.refs.groupNameInput).value;
        var newState = {
            componentGroup: groupName
        };
        this.setState(newState);
    },

    _handleGroupNameSelected: function(e){
        e.preventDefault();
        e.stopPropagation();
        var newState = {
            componentGroup: e.currentTarget.attributes['data-group'].value
        };
        this.setState(newState);
    },

    _validationStateGroupName: function(){
        if(this.state.componentGroup
            && this.state.componentGroup.length > 0
            && validator.isAlphanumeric(this.state.componentGroup)){
            //
            return 'has-success';
        }
        return 'has-error';
    },

    _validationStateComponentName: function(){
        if(this.state.componentName
            && this.state.componentName.length > 0
            && validator.isAlphanumeric(this.state.componentName)){
            //
            return 'has-success';
        }
        return 'has-error';
    },

    _handleComponentNameChange: function(){
        var componentName = React.findDOMNode(this.refs.componentNameInput).value;
        var newState = {
            componentName: componentName
        };
        this.setState(newState);
    },

    _handleIncludeChildrenChange: function(){
        var newState = {
            includeChildren: this.refs.includeChildrenCheckbox.getChecked()
        };
        this.setState(newState);
    },

    _handleIncludeFluxChange: function(){
        var newState = {
            includeFlux: this.refs.includeFluxCheckbox.getChecked()
        };
        this.setState(newState);
    },

    _handleIncludeAllReferencesChange: function(){
        var newState = {
            includeAllReferences: this.refs.includeAllReferencesCheckbox.getChecked()
        };
        this.setState(newState);
    },

    _checkEditor: function(){
        if(!this.editor
            && this.props.isProjectComponent){
            //
            var domNode = React.findDOMNode(this.refs.editorArea);
            this.editor = ace.edit(domNode);
            this.editor.getSession().setMode("ace/mode/jsx");
            this.editor.getSession().setTabSize(4);

            //this.editor.setTheme("ace/theme/chrome");
        }
        if(this.props.sourceCode && this.props.isSourceCodeChanged){
            this.editor.getSession().setValue(this.props.sourceCode);
        }
    }

});

module.exports = FormCodeComponentEditor;
