import React from 'react';

// Import css
import '../css/style.css';
import '../css/elections.css';

class Validation extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <main className="tpHowToWrapper">
            <h1 className="tpHeader">Validating Your Vote</h1>
                <p className="c5 c7"><span className="c6"></span></p>
                <p className="c5"><span>You can reach out anonymously to Dash Watch at </span><span className="c8"><a className="c2"
                    href="mailto:team@dashwatch.org">team@dashwatch.org</a></span><span>&nbsp;and provide us the message
                signature. We will validate your vote has been recorded by replying back with your vote message (aka the
            candidates you voted for).</span></p>
            </main>
        )
    }
}

export default Validation