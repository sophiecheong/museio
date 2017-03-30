import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import signUpStyle from './signUpStyle';

export default class Step2 extends Component {
	constructor(props) {
		super();

		this.state = {
			email: props.user.email,
			password: props.user.password,
			firstName: props.user.firstName,
			lastName: props.user.lastName,
			hrRate: props.user.hrRate,
			location: props.user.location,
			instruments: props.user.instruments
		};

		this.handleTextChange = this.handleTextChange.bind(this);
		this.renderInstruments = this.renderInstruments.bind(this);
		this.handleInstrChange = this.handleInstrChange.bind(this);
	}

	handleTextChange(evt) {
        var text = {};
        text[evt.target.id] = evt.target.value;
        this.setState(text);        
        this.props.updateUser(text);
    }

    handleInstrChange(evt) {
    	var text = {};
    	const key = evt.target.id.slice(0, evt.target.id.length -1);
    	const index = evt.target.id.slice(evt.target.id.length -1, evt.target.id.length);
        text[key] = evt.target.value;

        const instrument = Object.assign({}, this.state.instruments[index-1], text);
        const isCurrentEmpty = !instrument.instr.length && !instrument.cert.length && !instrument.qproof.length;
        var instruments = this.state.instruments;
        instruments[index-1] = instrument;

        if (index < 3 && !instruments[index]) {
        	instruments[index] = {
        		instr: '',
        		cert: '',
        		qproof: ''
        	};
        } else if (!!instruments[index] && isCurrentEmpty) {
        	instruments.splice(index, 1);
        }

        this.setState({ instruments });
        this.props.updateUser(instruments);
    }

    renderInstruments() {
    	const that = this;
    	var numInstrument = 0;
    	return(
    		<div style={ signUpStyle.profileItems.miniContainer }>
    			<Subheader style={{ padding: '0'}} >Instruments</Subheader>
    			{ this.state.instruments.map(function(instrument) {
    				numInstrument += 1;
    				return(
    					<div>
    						<TextField id={"instr" + numInstrument}
								style={ signUpStyle.profileItems.leftItem }
								floatingLabelText="Instrument"
								hintText="Enter your instrument"
								value={ instrument.instr }
								onChange={ that.handleInstrChange } />
							<TextField id={"cert" + numInstrument}
								style={ signUpStyle.profileItems.rightItem }
								floatingLabelText="Cert Level"
								hintText="Enter your cert level"
								value={ instrument.cert }
								onChange={ that.handleInstrChange } />
							<TextField id={"qproof" + numInstrument}
								style={ signUpStyle.profileItems.fullItem }
								floatingLabelText="Proof"
								hintText="Enter an url of your proof"
								value={ instrument.qproof }
								onChange={ that.handleInstrChange } />
							<Divider style={ signUpStyle.profileItems.divider } />
    					</div>
    				);
    			}) }
    		</div>
    	);
    }

	render() {
		return(
			<div style={ signUpStyle.contentContainer }>
				<Paper style={ signUpStyle.profileContainer } >
					<div style={ signUpStyle.profileItems.miniContainer } >
						<Subheader style={{ padding: '0'}} >Account Details</Subheader>
						<TextField id="email"
							style={ signUpStyle.profileItems.leftItem }
							floatingLabelText="Email"
							hintText="Enter your email"
							value={ this.state.email }
							onChange={ this.handleTextChange } />
						<TextField id="password" type="password"
							style={ signUpStyle.profileItems.rightItem }
							floatingLabelText="Password"
							hintText="Enter your password"
							value={ this.state.password }
							onChange={ this.handleTextChange } />
					</div>
					<div style={ signUpStyle.profileItems.miniContainer } >
						<Subheader style={{ padding: '0' }} >Profile Details</Subheader>
						<TextField id="firstName"
							style={ signUpStyle.profileItems.leftItem }
							floatingLabelText="First Name"
							hintText="Enter your first name"
							value={ this.state.firstName }
							onChange={ this.handleTextChange } />
						<TextField id="lastName"
							style={ signUpStyle.profileItems.rightItem }
							floatingLabelText="Last Name"
							hintText="Enter your last name"
							value={ this.state.lastName }
							onChange={ this.handleTextChange } />
						<br />
						<TextField id="hrRate" type="number" 
							disabled={2 == this.props.user.status}
							style={ signUpStyle.profileItems.leftItem }
							floatingLabelText="Hourly Rate"
							hintText="Enter how much you charge per hour"
							value={ this.state.hrRate }
							onChange={ this.handleTextChange } />
						<TextField id="location"
							style={ signUpStyle.profileItems.rightItem }
							floatingLabelText="Location"
							hintText="Enter your location"
							value={ this.state.location }
							onChange={ this.handleTextChange } />
					</div>

					{ (1 == this.props.user.status) && this.renderInstruments() }

				</Paper>
			</div>
		);
	}
}