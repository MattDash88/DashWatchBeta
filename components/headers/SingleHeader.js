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
                </Head>
            </div>
        )
    }
}