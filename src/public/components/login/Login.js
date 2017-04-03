import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
 import { Router, browserHistory } from 'react-router';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import loginStyle from './loginStyle';
import userAction from '../userAction';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            open: false,
            email: '',
            password: '',
            errorMessage: '' };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.login = this.login.bind(this);
    }

    login() {
        const { email, password } = this.state;
        const user = { email: window.btoa(email), psw: window.btoa(password) };
        this.props.dispatch(userAction.login(user)).then((data) => {
            if(!!data.user) {
                browserHistory.push('/profile/me');
            } else {
                this.setState({ errorMessage: "Login failed" });
            }
        });
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
                {
                    !!this.props.raisedBtn ? 
                    <RaisedButton primary={ true } label="Log In" onTouchTap={ this.handleOpen } /> :
                    <FlatButton label="Log In" onTouchTap={ this.handleOpen } />
                }
                
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

                    <div style={ !!this.state.errorMessage? { color: "red" } : { display: "none" }} > 
                        { this.state.errorMessage } 
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
                        onTouchTap={ this.login }
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

function mapStateToLogin(state) {
    console.log(state);
    return {  };
}

export default connect(mapStateToLogin)(Login);
