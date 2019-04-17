import Head from 'next/head';

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <Head>
                    <title>Dash Watch Reports</title>
                    <meta property="og:title" content="Dash Watch - Reports" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="An overview of all Dash Watch reports and media items organized by month." />
                    <meta property="og:url" content="https://dashwatchbeta.org/" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content="https://dashwatchbeta.org" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch - Reports" />
                    <meta name="twitter:description" content="An overview of all Dash Watch reports and media items organized by month." />
                    <meta name="twitter:image" content="https://dashwatchbeta.org/images/preview.png" />
                </Head>
            </div>
        )
    }
}