import React, { Component } from 'react';
import { Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import loginStyle from './loginStyle';

export default class Login extends Component {
    constructor(props) {
        super();

        this.state = { 
            open: false,
            email: '',
            password: '' };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleOpen () {
        this.setState({open: true});
    };

    handleClose () {
        this.setState({open: false});
    };

    handleTextChange(evt) {
        var text = {};
        text[evt.target.id] = evt.target.value;
        this.setState(text);
    }

    render() {
        const FacebookImage = <img src='../../images/facebook-icon.svg' 
                                    style={ loginStyle.icon } />
        const GoogleImage = <img src='../../images/GoogleImage.png' 
                                    style={ loginStyle.icon } />

        return (
            <span style={{ margin: '0 5px'}}>
                <FlatButton label="Log In" onTouchTap={ this.handleOpen } />
                <Dialog modal={ false }
                        contentStyle={{width: '35%'}}
                        open={ this.state.open }
                        onRequestClose={ this.handleClose } >

                    <RaisedButton label="Log In with Facebook" 
                                backgroundColor="#3B5998"
                                labelColor="#fff"
                                style={ loginStyle.overall }
                                buttonStyle={ loginStyle.button }
                                icon={ FacebookImage }/>

                    <RaisedButton label="Log In with Google" 
                                style={ loginStyle.overall }
                                buttonStyle={ loginStyle.button }
                                icon={ GoogleImage }/>

                    <div style={{ clear: 'both', textAlign: 'center' }}>
                        <Divider style={ loginStyle.dividerLeft } /> 
                        Or
                        <Divider style={ loginStyle.dividerRight } />
                    </div>

                    <TextField id="email" key="email"
                        value={ this.state.email }
                        floatingLabelText="Email"
                        hintText="Enter Email here"
                        style={{ width: '100%'}}
                        onChange={ this.handleTextChange } />

                    <TextField id="password" key="password"
                        value={ this.state.password }
                        floatingLabelText="Password"
                        hintText="Enter Password here"
                        style={{ width: '100%'}}
                        type="password"
                        onChange={ this.handleTextChange } />

                    <RaisedButton label="Log In" 
                                style={ loginStyle.overall }
                                primary={ true }
                                buttonStyle={ loginStyle.button } />

                    <Divider />
                    <div style={{ clear: 'both', padding: '10px 0', lineHeight: '40px' }}>
                        Dont have an account?
                        <Link to="/register" style={{float: 'right'}}>
                            <FlatButton label="Sign up" />
                        </Link>
                    </div>

                </Dialog>
            </span>
        );
    }
}