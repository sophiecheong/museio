import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import ProfileImage from '../dummy/ProfileImage';
import editStyle from './editStyle';
import userAction from '../userAction';

class EditProfile extends Component {
	constructor(props) {
		super();

		this.state = {
			updatedProfile: 0
		};

		this.user = {};

        this.handleTextChange = this.handleTextChange.bind(this);
        this.initializeUser = this.initializeUser.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.resetUser = this.resetUser.bind(this);

        this.initializeUser(props.currentUser);
	}

	initializeUser(user) {
		this.user = Object.assign({}, user);
	}

	validateFields() {
		const role = this.user.status;
        var details = Object.assign({}, this.user);
        delete details.instruments;		// This field is not in this view
        delete details.status;		// Role does not need to be checked
        delete details.bio; 	// This field is optional
        if(2 == role) delete details.hrRate;	// Students do not have hourly rates

        const hasEmptyFields = Object.values(details)
            .map(function(value) { return !!value })
            .indexOf(false) > -1;

        return hasEmptyFields;
	}

	saveUser() {
		const { dispatch } = this.props;
        1 == this.user.status ? 
            dispatch(userAction.updateTeacher(this.user)) :
            dispatch(userAction.updateStudent(this.user));
        dispatch(userAction.receiveCurrentUser(this.user));
	}

	resetUser() {
		this.initializeUser(this.props.currentUser);
        this.setState({ updatedProfile: this.state.updatedProfile + 1 });		
	}

	handleTextChange(evt) {
        var text = {};
        text[evt.target.id] = evt.target.value;
        
        this.user = Object.assign({}, this.user, text);
        this.setState({ updatedProfile: this.state.updatedProfile + 1 });
    }

	render() {
		const canSave = this.validateFields();

		return(
			<div>
				<Paper style={ editStyle.paperContainer }>
					<Subheader> Edit Profile </Subheader>

					<ProfileImage profImage={ this.user.profImage } width="15%" />
					<TextField id="profImage" key="profImage"
                        value={ this.user.profImage }
                        floatingLabelText="Profile Image"
                        hintText="Enter a url to your profile image"
                        onChange={ this.handleTextChange }
                        style={ editStyle.editItems.profImage } />

                    <TextField id="firstName" key="firstName"
                        value={ this.user.firstName }
                        floatingLabelText="First Name"
                        disabled={ true }
                        style={ editStyle.editItems.leftHalf } />
                    <TextField id="lastName" key="lastName"
                        value={ this.user.lastName }
                        floatingLabelText="Last Name"
                        disabled={ true }
                        style={ editStyle.editItems.rightHalf } />

                    <TextField id="mLocation" key="mLocation"
                        value={ this.user.mLocation }
                        floatingLabelText="Location"
                        hintText="Enter your main location"
                        onChange={ this.handleTextChange }
                        style={ editStyle.editItems.leftHalf } />
                    <TextField id="hrRate" key="hrRate"
                        value={ this.user.hrRate }
                        type="number"
                        disabled={ 1 != this.user.status }
                        floatingLabelText="Hourly Rate"
                        hintText="Enter your hourly rate"
                        onChange={ this.handleTextChange }
                        style={ editStyle.editItems.rightHalf } />

                    <TextField id="bio" key="bio"
                        value={ this.user.bio }
                        floatingLabelText="Bio"
                        hintText="Enter your bio"
                        multiLine={ true }
                        rows={ 2 }
                        onChange={ this.handleTextChange }
                        style={ editStyle.editItems.fullItem } />
				</Paper>
				<div style={ editStyle.btnContainer }>
                    <FlatButton
                        label="Reset"
                        onTouchTap={ this.resetUser }
                        style={{ marginRight: 12 }} />
                    <RaisedButton
                        label="Save"
                        primary={ true }
                        disabled={ canSave }
                        onTouchTap={ this.saveUser } />
                </div>
			</div>
		);
	}
}

function mapStateToEdit(state) {
	console.log(state);
	const { currentUser } = state.userReducer;
	return { currentUser };
}

export default connect(mapStateToEdit)(EditProfile);