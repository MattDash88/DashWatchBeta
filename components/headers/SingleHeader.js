import Head from 'next/head';

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
        const {
            proposal
        } = this.props
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