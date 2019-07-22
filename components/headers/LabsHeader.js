import Head from 'next/head';

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel="shortcut icon" type="image/x-icon" href="/static/icons/favicon.ico" />
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                    <title>Dash Watch Charts and Visualizations</title>
                    <meta property="og:title" content="Dash Watch - Charts and Visualizations" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="Explore performance metrics of Dash and Dash related projects." />
                    <meta property="og:url" content="https://beta.dashwatch.org/labs" />
                    <meta name="twitter:card" content="summary"/>
                    <meta name="twitter:url" content="https://beta.dashwatch.org/labs" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch - Charts and Visualizations" />
                    <meta name="twitter:description" content="Explore performance metrics of Dash and Dash related projects." />
                </Head>
            </div>
        )
    }
}