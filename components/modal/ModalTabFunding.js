import React from 'react';

// Import css
import '../css/style.css';
import '../css/modal.css';
import '../css/status_styling.css';

class ModalTabFunding extends React.Component {
  constructor(props) {
    super(props);

    // Binding functions in this class
    this.showProposalPage = this.showProposalPage.bind(this);
  }
  
  showProposalPage(e) {
    e.preventDefault();
    this.props.handleProposalPage(e.currentTarget.id);
  }

  render() {
    const {   // Declare individual elements used in this class
      slug,
      payment_date,
      payments_received,
      funding_per_payment,
      funding_received_dash,
      funding_received_usd,
      escrow_agent,
    } = this.props.main_data

    const {   // Declare individual elements used in this class
      openTab,
    } = this.props

    return (
      <div className="modalTabContent" value={openTab == "TabFunding" ? "active" : "inactive"}>
        <div className="modalHeader">Proposal Funding Details:</div>
        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            First Date Paid:
            </div>
          <div className="tabPropertyItem" title={payment_date}>
          <span className="statusPropertyValue">{payment_date}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
        <div className="tabPropertyTitle">
          No. of Payments Received:
            </div>
        <div className="tabPropertyItem" title={payments_received}>
        <span className="statusPropertyValue">{payments_received}</span>
        </div>
        </div>

         <div className="tabPropertyDiv">
        <div className="tabPropertyTitle">
          Funding per Payment:
            </div>
        <div className="tabPropertyItem" title={funding_per_payment}>
        <span className="statusPropertyValue">{funding_per_payment} Dash</span>
        </div>
        </div>

         <div className="tabPropertyDiv">
        <div className="tabPropertyTitle">
          Funding Received (Dash):
            </div>
        <div className="tabPropertyItem" title={funding_received_dash}>
        <span className="statusPropertyValue">{funding_received_dash} Dash</span>
        </div>
        </div>

        <div className="tabPropertyDiv">
        <div className="tabPropertyTitle">
          Funding Received (USD):
            </div>
        <div className="tabPropertyItem" title={funding_received_usd}>
        <span className="statusPropertyValue">&#36;{funding_received_usd}</span>
        </div>
        </div>

        <div className="tabPropertyDiv">
        <div className="tabPropertyTitle">
          Escrow:
            </div>
        <div className="tabPropertyItem" title={escrow_agent}>
        <span className="statusPropertyValue">{escrow_agent}</span>
        </div>
        </div>

        <div className="modalTabLink">
            <div className="link" type="link" onClick={this.showProposalPage} id={slug}>SHOW MORE FUNDING AND EXPENSE DATA FROM REPORTS</div>
          </div>
      </div>
      )
  }
}
  
export default ModalTabFunding