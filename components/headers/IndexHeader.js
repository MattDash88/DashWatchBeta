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
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="dashwatchbeta.org" />
                    <meta name="twitter:creator" content="@DashWatchTeam" />
                    <meta name="twitter:title" content="Dash Watch February Reports" />
                    <meta name="twitter:description" content="We recognize that Dash MNOs and community members have limited time to review all the reports and metrics available on the Dash Watch website and have created a page that clearly organizes and displays links to all of our current February 2019 reports, Financial Reviews and Video Interviews. " />
                    <meta name="twitter:image" content="https://dashwatchbeta.org/images/preview.png" />
                </Head>
            </div>
        )
    }
}