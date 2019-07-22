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
                    <title>Dash Watch Elections Section</title>
                    <meta property="og:title" content="Dash Watch - Elections" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="" />
                    <meta property="og:url" content="https://beta.dashwatch.org//elections" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content="https://beta.dashwatch.org/elections" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch - Elections" />
                    <meta name="twitter:description" content="" />
                    <meta name="twitter:image" content="http://files.dashwatch.org/website_previews/preview_elections.png" />
                </Head>
            </div>
        )
    }
}