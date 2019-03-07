import Head from 'next/head';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

const trackPage = (page) => {
    ReactGA.pageview(page);
}

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
        const {
            proposal
        } = this.props
        trackPage(`/p/${proposal}`)
        return (
            <div>
                <Head>
                    <title>Dash Watch Page for {proposal}</title>
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="dashwatchbeta.org" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch Proposal Page" />
                    <meta name="twitter:description" content="" />
                </Head>
            </div>
        )
    }
}