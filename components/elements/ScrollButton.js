import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import css
import "../css/style.css";

class ScrollButton extends React.Component {
    constructor() {
        super();

        this.state = {
            intervalId: 0
        };
    }

    scrollStep() {
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }

    scrollToTop() {
        let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
        this.setState({ intervalId: intervalId });
        trackEvent('Scrollbutton', 'Used scroll to top button')                 // Track Event on Google Analytics 
    }

    render() {
        return <button title='Back to top' className='scroll'
            onClick={() => { this.scrollToTop(); }}>
            <div className= "glyph"></div>
        </button>;
    }
}

export default ScrollButton