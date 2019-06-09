import Head from 'next/head';

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <Head>
                    <title>Dash Watch Elections Section</title>
                    <meta property="og:title" content="Dash Watch - Elections" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="" />
                    <meta property="og:url" content="https://dashwatchbeta.org/elections" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content="https://dashwatchbeta.org/elections" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch - Elections" />
                    <meta name="twitter:description" content="" />
                    <meta name="twitter:image" content="https://dashwatchbeta.org/images/preview_elections.png" />
                </Head>
            </div>
        )
    }
}