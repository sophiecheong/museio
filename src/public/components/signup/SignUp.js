import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

import signUpStyle from './signUpStyle';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

export default class SignUp extends Component {
    constructor(props) {
        super();

        this.state = { 
            stepIndex: 0,
            userUpdated: 0
        };

        this.user = {
            email: '',
            status: '',
            password: '',
            firstName: '',
            lastName: '',
            mlocation: '',
            hrRate:'',
            instruments: [{
                instr: '',
                cert: '',
                qproof: ''
            }],
            profImage: ''
        };

        this.checkDisabled = this.checkDisabled.bind(this);
        this.setUser = this.setUser.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    checkDisabled() {
        const role = this.user.status;
        const instruments = this.user.instruments;
        const stepIndex = this.state.stepIndex;

        var isDisabled = false;
        var details = Object.assign({}, this.user);
        delete details.instruments;
        delete details.status;
        delete details.profImage;
        if(2 == role) delete details.hrRate;

        const hasEmptyFields = Object.values(details)
            .map(function(value) { return !!value })
            .indexOf(false) > -1;

        const isLegitInstru = instruments.map(function(i) {
            const allEmpty = !(!!i.instr.length || !!i.cert || !!i.qproof);
            const allFilled = (!!i.instr.length && !!i.cert && !!i.qproof);
            return (allFilled || (allEmpty && instruments.length > 1)); 
        }).indexOf(false) <= -1;

        if((0 == stepIndex && !role) ||
            (1 == stepIndex && (hasEmptyFields || (1 == role && !isLegitInstru))) ||
            (2 == stepIndex && !this.user.profImage.length))
            isDisabled = true;

        return isDisabled;
    }

    handleNext() {
        const { stepIndex } = this.state;
        this.setState({ stepIndex: stepIndex + 1 });
    }

    handlePrev() {
        const { stepIndex } = this.state;
        this.setState({ stepIndex: stepIndex - 1 });
    }

    handleTextChange(evt) {
        var text = {};
        text[evt.target.id] = evt.target.value;
        this.setState(text);
    }

    setUser(newUser) {
        this.user = Object.assign({}, this.user, newUser);
        this.setState({ userUpdated: this.state.userUpdated + 1 });
    }

    renderStepContent(stepIndex) {
        switch(stepIndex) {
            case 0:
                return (<Step1 updateUser={ this.setUser } role={ this.user.status } />);
            case 1: 
                return (<Step2 updateUser={ this.setUser } user={ this.user } />);
            case 2:
                return (<Step3 updateUser={ this.setUser } profImage={ this.user.profImage } />);
            case 3: 
                return (<Step4 />);
        }
    }

    render() {
        const { stepIndex } = this.state;
        const isDisabled = this.checkDisabled();

        return (
            <div>
                <Stepper activeStep={stepIndex} style={ signUpStyle.stepper } >
                    <Step>
                        <StepLabel>What are you?</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Who are you?</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel> Smile! </StepLabel>
                    </Step>
                    <Step>
                        <StepLabel> Done </StepLabel>
                    </Step>
                </Stepper>
                <div>
                    <div>
                        <div style={ signUpStyle.contentContainer } > 
                            { this.renderStepContent(stepIndex) } 
                        </div>
                        <div style={ stepIndex == 3? signUpStyle.hide : signUpStyle.btnContainer }>
                            <FlatButton
                                label="Back"
                                disabled={ stepIndex == 0 }
                                onTouchTap={ this.handlePrev }
                                style={{ marginRight: 12 }} />
                            <RaisedButton
                                label={stepIndex === 2 ? 'Finish' : 'Next'}
                                disabled={ isDisabled }
                                primary={true}
                                onTouchTap={ this.handleNext } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}