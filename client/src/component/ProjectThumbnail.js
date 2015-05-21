var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;

var ApplicationActions = require('../action/ApplicationActions.js');

var ProjectThumbnail = React.createClass({


    getDefaultProps: function() {
        return {
            projectName: 'Unknown',
            description: 'NONE',
            countDownload: 0
        };
    },

    render: function() {
        if(this.props.isEmpty){
            return (
                <Panel {...this.props} style={{height: '21em'}}>
                </Panel>
            );
        } else {
            var projectName = this.props.projectName;
            if(projectName && projectName.length > 50){
                projectName = projectName.substr(0, 50) + '...';
            }
            return (
                <Panel style={{height: '21.5em'}}>
                    <h4 style={{height: '1em', overflow: 'hidden'}}><span >{projectName}</span></h4>
                    <hr></hr>
                    <div style={{overflow: 'auto', height: '4em'}}>
                        <p><span>{this.props.description}</span></p>
                    </div>
                    <p style={{marginTop: '1em'}}>
                        <span>{this.props.countDownload}</span>
                        <small style={{ marginLeft: '0.5em' }} className={ 'text-muted'}>downloads</small>
                    </p>
                    <hr></hr>
                    <ButtonGroup>
                        <Button onClick={this._handleClone} bsStyle={ 'primary'}><span>Clone</span></Button>
                        <Button onClick={this._handlePreview}><span>Preview</span></Button>
                    </ButtonGroup>
                </Panel>
            );
        }
    },

    _handlePreview: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.previewProject(this.props.projectId);
    },

    _handleClone: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.startDownloadProject(this.props.projectId);
    }

});

module.exports = ProjectThumbnail;