import React from 'react';
import {
    Label,
    Form,
    Checkbox,
    Segment,
    Button,
    Divider,
    TextArea,
    Input,
    Dimmer,
    Header,
} from 'semantic-ui-react';
import axios from 'axios';
import copy from 'clipboard-copy';

import NavBar from "../components/elements/NavBar"

class Poll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            address: '',
            signature: '',
            payload: '',
            response_message: '',
        }

        // Bind functions used in class
        this.handleChange = this.handleChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onSignatureChange = this.onSignatureChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    handleChange = (e, { value }) => this.setState({
        value: value,
        payload: `dw2019_LamboVote-${value}`,
    })

    onAddressChange = event => {
        this.setState({ address: event.target.value.trim() });
    };

    onSignatureChange = event => {
        this.setState({ signature: event.target.value.trim() });
    };

    onFormSubmit = event => {
        event.preventDefault();
    };

    copyToClipboard = event => {
        copy(this.state.payload);
    };

    submitVote = async event => {
        const { payload, signature, address } = this.state;
        if (payload == "dw2019_LamboVote-No") {
            this.setState({
                response_message: 'Vote Rejected'
            })
        } else {
            // TODO: handle network errors / what if promise never returned?
            const response = await axios.post('/vote', {
                addr: address,
                msg: payload,
                sig: signature,
            })
            Promise.resolve(response).then((response) => {
                if (response.status == 200) {
                    this.setState({
                        response_message: 'Vote Accepted'
                    })
                } else {
                    this.setState({
                        response_message: 'Something went wrong'
                    })
                }
            })
        }
    };

    render() {
        return (
            <main>
                Would you support a treasury funding request to buy a Lambo for all Dash Watch Report Team members?
                <Form.Field>
                    <Checkbox
                        radio
                        label='Yes'
                        name='checkboxRadioGroup'
                        value='Absolutely'
                        checked={this.state.value === 'Absolutely'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        radio
                        label='Yes'
                        name='checkboxRadioGroup'
                        value='Totally'
                        checked={this.state.value === 'Totally'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        radio
                        label='No'
                        name='checkboxRadioGroup'
                        value='No'
                        checked={this.state.value === 'No'}
                        onChange={this.handleChange}
                    />
                </Form.Field>

                <Divider hidden />

                <Form>
                    <TextArea disabled value={this.state.payload} />
                </Form>
                <Button className="ui primary" onClick={this.copyToClipboard}>
                    Copy to Clipboard
                </Button>

                <Divider hidden />

                <Form onSubmit={this.onFormSubmit}>
                    <Input
                        fluid
                        placeholder="Masternode Voting Key Address"
                        value={this.state.address}
                        onChange={this.onAddressChange}
                    />
                    <Input
                        fluid
                        placeholder="Message Signature"
                        value={this.state.signature}
                        onChange={this.onSignatureChange}
                    />
                    <Button className="ui primary" onClick={this.submitVote}>
                        Submit Vote
                    </Button>
                </Form>
                {this.state.response_message}
            </main>
        )
    }
}

export default Poll