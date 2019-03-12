import React from 'react';

// Import css
import '../css/style.css';
import '../css/elections.css';

class HowTo extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <main className="tpHowToWrapper">
                <h1 className="tpHeader">Dash Trust Protector Elections 2019 How to Vote</h1>
                <p className="c5 c7"><span className="c4"></span></p>                
                <p>Masternode Vote from Dash Masternode Tool (DMT)</p>
                <p>Masternode Vote from Dash Core</p>
                <p>Masternode Vote from Dash Electrum</p>              
                <h2 className="tpHowToSubHeader">Masternode Vote from Dash Masternode Tool (DMT)</h2>
                *This assumes you already have a MN set up with DMT on the latest version. If you don&rsquo;t
                have it set up them downloadest the latest version of DMT here: <br></br>
                <a className="c2"
                        href="https://github.com/Bertrand256/dash-masternode-tool/releases/tag/v0.9.22" target="">https://github.com/Bertrand256/dash-masternode-tool/releases/tag/v0.9.22\</a><br></br>
                The instructions to set up a MN can be found here: <br></br>
                <a className="c2" href="https://github.com/Bertrand256/dash-masternode-tool" target="">https://github.com/Bertrand256/dash-masternode-tool</a>&nbsp;

                <ol start="1">
                    <li>Vote for as many candidates as you would like on the voting website: <a className="c2"
                            href="https://trustvote.dash.org" target="">https://trustvote.dash.org/</a> &nbsp;and click &ldquo;Done&rdquo;</li>
                    <li>In the Dash Masternode Tool click &ldquo;Sign Message for Current Masternode&rdquo;</li>
                </ol>
                <div className="c3"><img
                        alt="" src="https://dashwatchbeta.org/reports/html/Elections2019/images/image4.png"
                        width='563.00px' height='403.00px' title=""></img></div>
                <ol start="3">
                    <li >Take the message from the TrustVote website and input it into the DMT sign
                message screen.</li>
                </ol>
                <div className="c3"><img
                        alt="" src="https://dashwatchbeta.org/reports/html/Elections2019/images/image5.png"
                        width="555.63px" height="353.50px" title=""></img></div>
                <ol className="c1 lst-kix_uqmsags66m66-0" start="4">
                    <li className="c0"><span className="c4">Press &ldquo;sign&rdquo; in the DMT display.</span></li>
                    <li className="c0"><span className="c4">Copy the address (your MN address) and the signature into the corresponding
                areas in the trust voting website.</span></li>
                </ol>
                <div className="c3"><img
                        alt="" src="https://dashwatchbeta.org/reports/html/Elections2019/images/image2.png"
                        width="484.50px" height="322.22px" title=""></img></div>
                <ol className="c1 lst-kix_uqmsags66m66-0" start="6">
                    <li className="c0"><span className="c4">Click &ldquo;Submit Vote&rdquo; and you&rsquo;re done!</span></li>
                </ol>
                <p className="c5 c7"><span className="c4"></span></p>
                <p className="c5 c7"><span className="c6"></span></p>
                <p className="c5 c7"><span className="c6"></span></p>
                <h2 className="tpHowToSubHeader">Masternode Vote from Dash Core</h2>
                <p className="c3 c7"><span className="c4"></span></p>
                <ol className="c1 lst-kix_5kw4dxd68ljt-0 start" start="1">
                    <li className="c0"><span className="c4">Click File =&gt; &ldquo;Sign Message&rdquo;</span></li>
                    <li className="c0"><span className="c4">Enter your Masternode Dash address in the Dash address section of the Dash Core
                Signature window.</span></li>
                    <li className="c0"><span className="c4">Copy and paste the message from the trust protectors website into the message
                section of the Dash Core Signatures window.</span></li>
                </ol>
                <div className="c3"><img
                        alt="" src="https://dashwatchbeta.org/reports/html/Elections2019/images/image6.png"
                        width="624.00px" height="294.67px" title=""></img></div>
                <ol className="c1 lst-kix_5kw4dxd68ljt-0" start="4">
                    <li className="c0"><span className="c4">Click sign message in the Dash Core Signature Window</span></li>
                    <li className="c0"><span className="c4">Copy the address (your MN address) and the signature from the Dash Core Window
                into the corresponding areas in the trust voting website.</span></li>
                </ol>
                <div className="c3"><img
                        alt="" src="https://dashwatchbeta.org/reports/html/Elections2019/images/image7.png"
                        width="624.00px" height="290.67px" title=""></img></div>
                <ol className="c1 lst-kix_5kw4dxd68ljt-0" start="6">
                    <li className="c0"><span className="c4">Click &ldquo;Submit Vote&rdquo; and you&rsquo;re done!</span></li>
                </ol>
                <p className="c3 c7"><span className="c4"></span></p>
                <h2 className="tpHowToSubHeader">Masternode Vote from Dash Electrum</h2>
                <ol className="c1 lst-kix_cicpg746t90n-0 start" start="1">
                    <li className="c0"><span className="c4">In Dash Electrum, click on &ldquo;Tools&rdquo; =&gt; &ldquo;Sign/verify
                Message&rdquo;</span></li>
                    <li className="c0"><span className="c4">Enter your Masternode Dash address in the &ldquo;Address&rdquo; section and copy
                paste the vote message from the voting website into the Dash Electrum Sign/verify Message window</span>
                    </li>
                </ol>
                <div className="c3"><img
                        alt="" src="https://dashwatchbeta.org/reports/html/Elections2019/images/image1.png"
                        width="624.00px" height="238.67px" title=""></img></div>
                <ol className="c1 lst-kix_cicpg746t90n-0" start="3">
                    <li className="c0"><span className="c4">Click &ldquo;Sign&rdquo; in the Dash Electrum window</span></li>
                    <li className="c0"><span className="c4">Copy the address (your MN address) and the signature from the Dash Electrum
                Window into the corresponding areas in the trust voting website.</span></li>
                </ol>
                <div className="c3"><img
                        alt="" src="https://dashwatchbeta.org/reports/html/Elections2019/images/image3.png"
                        width="624.00px" height="222.67px" title=""></img></div>
                <ol className="c1 lst-kix_cicpg746t90n-0" start="5">
                    <li className="c0"><span className="c4">Click &ldquo;Submit Vote&rdquo; and you&rsquo;re done!</span></li>
                </ol>
                
            </main>
        )
    }
}

export default HowTo