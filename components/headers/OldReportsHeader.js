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
                </Head>
            </div>
        )
    }
}