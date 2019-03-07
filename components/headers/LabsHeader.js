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
        trackPage(`/labs`)
        return (
            <div>
                <Head>
                    <title>Dash Watch Charts and Visualizations</title>
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="dashwatchbeta.org" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch Labs" />
                    <meta name="twitter:description" content="Dash Watch Charts and Visualization." />
                    <meta name="twitter:image" content="https://dashwatchbeta.org/images/PreviewLabs.png" />
                </Head>
            </div>
        )
    }
}