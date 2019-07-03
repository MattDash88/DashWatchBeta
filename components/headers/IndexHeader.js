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
                    <title>Dash Watch Reports</title>
                    <meta property="og:title" content="Dash Watch - Reports" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="An overview of all Dash Watch reports and media items organized by month." />
                    <meta property="og:url" content="https://beta.dashwatch.org/" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content="https://beta.dashwatch.org/" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch - Reports" />
                    <meta name="twitter:description" content="An overview of all Dash Watch reports and media items organized by month." />
                    <meta name="twitter:image" content="http://files.dashwatch.org/website_previews/preview.png" />
                </Head>
            </div>
        )
    }
}