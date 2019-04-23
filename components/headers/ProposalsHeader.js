import Head from 'next/head';

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <Head>
                    <title>Dash Watch Proposals List</title>
                    <meta property="og:title" content="Dash Watch - List of Proposals" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="View and search all Dash Treasury proposals." />
                    <meta property="og:url" content="https://dashwatchbeta.org/proposals" />
                    <meta name="twitter:card" content="summary"/>
                    <meta name="twitter:url" content="https://dashwatchbeta.org/proposals" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch - List of Proposals" />
                    <meta name="twitter:description" content="View and search all Dash Treasury proposals." />
                </Head>
            </div>
        )
    }
}