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
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="https://dashwatchbeta.org" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch Trust Protector Elections Page" />
                    <meta name="twitter:description" content='' />
                </Head>
            </div>
        )
    }
}