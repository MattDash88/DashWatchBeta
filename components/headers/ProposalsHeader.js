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
                </Head>
            </div>
        )
    }
}