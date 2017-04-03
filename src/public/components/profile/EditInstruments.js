import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import editStyle from './editStyle';

class EditInstruments extends Component {
	constructor(props) {
		super();

		this.state = {
			updated: 0
		};

		this.instruments = [];

		this.setInstruments = this.setInstruments.bind(this);
		this.addNewInstrument = this.addNewInstrument.bind(this);
		this.handleInstrChange = this.handleInstrChange.bind(this);
		this.saveInstruments = this.saveInstruments.bind(this);
		this.resetInstruments = this.resetInstruments.bind(this);
		this.verifyInstruments = this.verifyInstruments.bind(this);

        this.setInstruments(props.currentUser);
	}

	setInstruments(user) {
		this.instruments = JSON.parse(JSON.stringify(user.instruments));
		if ( !!user.id ) this.instruments = this.addNewInstrument(this.instruments);
	}

	addNewInstrument(instruments) {
		const index = instruments.length;
		if (index < 3) {
			instruments[index] = {
        		instr: '',
        		cert: '',
        		qproof: ''
        	};
        }

		return instruments;
	}

	saveInstruments() {
		const { dispatch } = this.props;
		const user = Object.assign({}, this.user, this.instruments);
        1 == this.user.status ? 
            dispatch(userAction.updateTeacher(user)) :
            dispatch(userAction.updateStudent(user));
        dispatch(userAction.receiveCurrentUser(user));
	}

	resetInstruments() {
		this.setInstruments(this.props.currentUser);
        this.setState({ updated: this.state.updated + 1 });
	}

	verifyInstruments() {
		const instruments = this.instruments;
		const isLegitInstru = instruments.map(function(i) {
            const allEmpty = !(!!i.instr.length || !!i.cert || !!i.qproof);
            const allFilled = (!!i.instr.length && !!i.cert && !!i.qproof);
            return (allFilled || (allEmpty && instruments.length > 1)); 
        }).indexOf(false) <= -1;

		return isLegitInstru;
	}

	handleInstrChange(evt) {
    	var text = {};
    	const key = evt.target.id.slice(0, evt.target.id.length -1);
    	const index = evt.target.id.slice(evt.target.id.length -1, evt.target.id.length);
        text[key] = evt.target.value;

        const instrument = Object.assign({}, this.instruments[index-1], text);
        const isCurrentEmpty = !instrument.instr.length && !instrument.cert.length && !instrument.qproof.length;
        var instruments = JSON.parse(JSON.stringify(this.instruments));
        instruments[index-1] = instrument;

        if (index < 3 && !instruments[index]) instruments = this.addNewInstrument(instruments);
        else if (!!instruments[index] && isCurrentEmpty) instruments.splice(index, 1);
        
        this.setInstruments({ instruments });
        this.setState({ updated: this.state.updated + 1 });
    }

	render() {
		const that = this;
		const canSave = this.verifyInstruments();
    	var numInstrument = 0;

		return(
			<div>
				<Paper style={ editStyle.paperContainer }>
					<Subheader> Instruments </Subheader>
					{ this.instruments.map(function(instrument) {
	    				numInstrument += 1;
	    				return(
	    					<div key={ "instrument-" + numInstrument } >
	    						<TextField id={"instr" + numInstrument}
									style={ editStyle.editItems.leftHalf }
									floatingLabelText="Instrument"
									hintText="Enter your instrument"
									value={ instrument.instr }
									onChange={ that.handleInstrChange } />
								<TextField id={"cert" + numInstrument}
									style={ editStyle.editItems.rightHalf }
									floatingLabelText="Cert Level"
									hintText="Enter your cert level"
									value={ instrument.cert }
									onChange={ that.handleInstrChange } />
								<TextField id={"qproof" + numInstrument}
									style={ editStyle.editItems.fullItem }
									floatingLabelText="Proof"
									hintText="Enter an url of your proof"
									value={ instrument.qproof }
									onChange={ that.handleInstrChange } />
								<Divider style={ editStyle.editItems.divider } />
	    					</div>
	    				);
    				}) }
				</Paper>
				<div style={ editStyle.btnContainer }>
                    <FlatButton
                        label="Reset"
                        onTouchTap={ this.resetInstruments }
                        style={{ marginRight: 12 }} />
                    <RaisedButton
                        label="Save"
                        primary={ true }
                        disabled={ !canSave }
                        onTouchTap={ this.saveInstruments } />
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

export default connect(mapStateToEdit)(EditInstruments);