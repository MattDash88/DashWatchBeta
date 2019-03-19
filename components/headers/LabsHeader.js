import Head from 'next/head';

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
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