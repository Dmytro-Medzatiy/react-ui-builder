var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;


var ProxyInput = React.createClass({
    
    getInitialState: function(){
        return {
            urlValue: this.props.urlValue
        }    
    },

    getUrlValue: function(){
        return this.refs.inputElement.getValue();
    },
    
    _handleClearUrlValue: function(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            urlValue: ''
        })
    },
    
    _handleChangeUrlValue: function(e){
        this.setState({
            urlValue: this.refs.inputElement.getValue()
        })
    },

    render: function() {
        return (
            <Input 
                ref='inputElement'
                value={this.state.urlValue}
                type={ 'text'} 
                label={ this.props.label} 
                placeholder={ 'Enter value'} 
                addonBefore={ 'URL:'} 
                onChange={this._handleChangeUrlValue}
                buttonAfter={ <Button 
                                onClick={this._handleClearUrlValue}
                                bsStyle={ 'default'}>
                                <span className={ 'fa fa-times'}></span>
                              </Button> 
                }>
            </Input>
        );
    }

});

module.exports = ProxyInput;