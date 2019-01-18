import fetch from 'isomorphic-unfetch';
import shortid from 'shortid';
import React from 'react';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-132694074-1');

// Import pages
import Post from '../components/Post';
import SinglePost from '../components/Single';
import MonthPage from '../components/MonthPage';
import AboutPage from '../components/About';

// Import css
import "../components/css/style.css";

// Import other elements 
import ScrollButton from '../components/buttons/ScrollButton';  // Scroll to top button

var basepath = 'https://dashwatchbeta.org' 

// Airtable query requesting Proposal List data
const getPosts = () => {
  return (
      new Promise((resolve) => {
          fetch(`${basepath}/api/get/posts`)
          .then((res) => res.json()
            .then((res)=> {
              resolve(res.data)              
    }))
  })
)}

// Airtable query requesting data for the selected month, passed on to the month list page
const getMonthList = (month) => {
  return (
      new Promise((resolve) => {
          fetch(`${basepath}/api/get/monthlist/${month}`)
          .then((res) => res.json()
            .then((res)=> {
              resolve(res.data)              
    }))
  })
)}

// Airtable query requesting data for a Single Proposal passed on to the Single Proposal Page
const getSinglePost = (proposalID) => {
  return (
      new Promise((resolve) => {
          fetch(`${basepath}/api/p/${proposalID}`)
          .then((res) => res.json()
            .then((res)=> {
              resolve(res.data)              
    }))
  })
)}

// Airtable query requesting queried data, used by the filters and search function
const filterPost = (query) => {
  return (
      new Promise((resolve) => {
          fetch(`${basepath}/api/filter/${query}`)
          .then((res) => res.json()
            .then((res)=> {
              resolve(res.data)              
    }))
  })
)}

// Function for Google analytics
const trackPage = (page) => {
  ReactGA.pageview(page);
}
   
class Home extends React.Component {
  constructor() {
    super()

    this.state = {
      search: '',
      airtableData: [],             // All Proposal data
      displayData: [],              // Data filtered on querry
      monthListData: [],            // Data for report page
      singlePostData: [],           // Data of a single proposal
      showPage: 'month',            // State for the page that is shown, initial state directs to month list page
      showTab: '',                  // State that handles the initial tab on the Single Proposal page, the modal can direct the user directly to the funding and performance tabs
      monthListId: 'January 2019',  // State for the month shown on the Month list, initial state directs to the most recent month
      showInactivePosts: false,     // State of the inactive proposal filter, opted-out or concluded proposals are hidden by default to increase rendering performance
      singleProposalId: '',         // State for single proposal page, which proposal is shown 
    }

    // Binding functions in this class
    this.handleSubmit = this.handleSubmit.bind(this);       // Submit search query
    this.handleClick = this.handleClick.bind(this);         // Selection from navbar
    this.handleFilter = this.handleFilter.bind(this);       // Toggle filter of inactive proposals
    this.setSinglePage = this.setSinglePage.bind(this);     // Select a proposal page
    this.handleSelectMonth = this.handleSelectMonth.bind(this); // Select a month on month page
    this.handleBack = this.handleBack.bind(this);           // Handle back button from single proposal page 
    
  }

  // Function that handles the submission of the search Form
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      search: event.target[0].value,
      showPage: 'all'
    });    
  }

  // Function to handles page selection from Navbar
  handleClick(event) {
    event.preventDefault();
    this.setState({
      query: '',
      singleProposalId: '',
      showPage: event.currentTarget.id,
    }); 
  }

  // Function that initiates the single page if selected
  setSinglePage(newVal, openTab) {
    this.setState({      
      //showPage: 'single',
      singleProposalId: newVal,
      showTab: openTab,     
    })
  }

  // Function that handles the back button from the "single proposal page"
  handleBack() {
    this.setState({      
      showPage: 'all',      // For now the back button will always return to the proposal list page
      singleProposalId: '', 
    })
  }

  // Function for the month selection on "the month list page"
  handleSelectMonth(monthId) {
    this.setState({
      monthListId: monthId
    })
  }

  // Function that initiates the "single proposal page" if selected
  handleFilter() {
    this.setState({showInactivePosts: !this.state.showInactivePosts})    
  }

  componentDidMount() { 
    // Promise to get the initial "month list" records 
    Promise.resolve(getMonthList(this.state.monthListId)).then(data => { 
      this.setState({ monthListData: data })
    }) 
    
    // Promise to get all proposal records   
    Promise.resolve(getPosts()).then(data => { 
      this.setState({ airtableData: data })      
    })       
    
    // Promise to get initial filtered records     
    const query = `search=${this.state.search.toLowerCase()}&show_inactive=${this.state.showInactivePosts}` 
    Promise.resolve(filterPost(query)).then(data => {
      this.setState({ displayData: data })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // Update "Proposal list" data for search and filters
    if (prevState.search !== this.state.search || prevState.showInactivePosts !== this.state.showInactivePosts) {
      const query = `search=${this.state.search.toLowerCase()}&show_inactive=${this.state.showInactivePosts}`
      Promise.resolve(filterPost(query)).then(data => {
        this.setState({
          displayData: data,
        })
      })
    }

    // Retrieve data for chosen proposal for "single proposal page"
    if (prevState.singleProposalId !== this.state.singleProposalId) {
      Promise.resolve(getSinglePost(this.state.singleProposalId)).then(data => {
        this.setState({
          singlePostData: data,
          showPage: 'single',
        })
      })
    }

    // Update "month list" data if another month is selected
    if (prevState.monthListId !== this.state.monthListId) {
      Promise.resolve(getMonthList(this.state.monthListId)).then(data => {
        this.setState({
          monthListData: data,
        })
      })
    }
  }

  render() {
    const { // Declare data arrays used in class
        airtableData,
        displayData,
        monthListData,
      } = this.state

    return (
      // Navbar code
      <main>
        <div className="menu">
          <nav className="menuContent">
            <li className="menuItem"><img id="Logo" src="https://dashwatchbeta.org/Logo/logo_white20.png"></img></li>
            <li className="menuItem"><a title="Report List" id="month" value={this.state.showPage == "month" ? "Active" : "Inactive"} onClick={this.handleClick}>Reports</a></li>
            <li className="menuItem"><a title="All Proposals" id="all" value={this.state.showPage == "all" ? "Active" : "Inactive"}onClick={this.handleClick}>Proposals View</a></li>
            <form className="searchForm" onSubmit={this.handleSubmit}>
              <input className="searchField"
                placeholder="Search proposal ID or proposer"
                value={this.state.value}
                ref={(input) => this.textInput = input}
              />
            </form>
            <li className="menuItem"><a title="About" id="about" value={this.state.showPage == "about" ? "Active" : "Inactive"}onClick={this.handleClick} onClick={this.handleClick}>About</a></li>
          </nav>
        </div>
        <section className="pagewrapper">
          <ProposalList
            // Arrays containing the data
            airtableData={airtableData}      // All data, currently only used to check if data retrieval has been successful
            displayData={displayData}        // Data for the "Proposal List" page after filters
            monthListData={monthListData}    // Data for the month list page
            singlePostData={this.state.singlePostData}  // Data for a single proposal page           

            // Elements for functions
            showPage={this.state.showPage}      // State that determines which page is shown (month, single, proposal list or about)
            setSinglePage={this.setSinglePage}  // Handle directing to the single page of selected proposal
            showTab={this.state.showTab}        // Direct to tab on single page from modal
            getMonthId={this.handleSelectMonth} // Handle selecting a different month on Month Page
            monthId={this.state.monthListId}
            toggleFilter={this.handleFilter}    // Handle toggle of inactive proposal filter
            goBack={this.handleBack}            // Handle going back to previous page from singlepage
            search={this.state.search}          // To show what the results are for
            showInactivePosts={this.state.showInactivePosts} 

            // Elements for Analytics
            singleProposalId = {this.state.singleProposalId}
            />
        </section>
      </main>
    )
  }
}

class ProposalList extends React.Component {
  constructor(props) {
    super(props);    

    // Binding functions used in this class
    this.handleProposalPage = this.handleProposalPage.bind(this); // Pass on single proposal click to Home
    this.handleBack = this.handleBack.bind(this);                 // Pass on back button click to Home 
    this.handleSelectMonth = this.handleSelectMonth.bind(this);   // Pass on selected month on "month list" to Home
    this.handleChangeChk = this.handleChangeChk.bind(this);       // Pass on filter toggle to Home
  }

  // Pass on single proposal click to Home
  handleProposalPage(slug, openTab) {
    this.props.setSinglePage(slug, openTab)
  }

  // Pass on back button click to Home 
  handleBack() {
    this.props.goBack()
  } 

  // Pass on selected month on "month list" to Home
  handleSelectMonth(monthId) {
    this.props.getMonthId(monthId) 
  }

  // Pass on filter toggle to Home
  handleChangeChk() {
    this.props.toggleFilter() 
  }

    render() {
    const { 
      // Arrays with data
      airtableData,   // All proposal data
      displayData,    // Data for the "Proposal List" page, dataset after filters
      monthListData,  // Data for the "month list" page
      singlePostData, // Data for a single proposal page 

      // Elements for functions
      showPage,       // Element that determines which page is shown (month, single, proposal list or about)
      showTab,        // Element for initial tab to show on "single proposal page"
      monthId,        // Id of the current retrieved month, passed on to month list page
      search,         // Used to display query at top

      // Elements for Analytics
      singleProposalId,
    } = this.props

    
    
      if (showPage == 'all') {  // Code for rendering All proposal Page
        trackPage('/proposalList')   // Send page view to analytics
        if (!Array.isArray(airtableData) && !Array.isArray(displayData)) {
          // Still loading Airtable data
          return (
            <p>Loading&hellip;</p>
          )
        } else if (!Array.isArray(displayData)) { 
          return (
            <p>No proposals found</p>
          )
        } else {
          // Loaded
          return (
            <section>
              <h1 className="listHeader">List of Dash funded proposals</h1>
              <div className="headerLeftDiv">
              <label className="container">
                <input type="checkbox" checked={this.props.showInactivePosts} onChange={this.handleChangeChk}/>
                <span className="checkmark"></span><p>Show inactive proposals</p>
              </label>
              </div>
              <div className="headerRightDiv">
              <div><p className="headerText">Currently showing <b>{displayData.length}</b> of <b>{airtableData.length}</b> proposals</p></div>
              
              </div>
              
              {displayData.map((post) =>
                <Post
                  key={shortid.generate()}
                  // Elements for Main Post
                  main_data={post.main_data}
                  report_data={post.report_data}

                  // For handling functions
                  showTab={showTab}
                  getProposalID={this.handleProposalPage}
                />
              )}
              <ScrollButton scrollStepInPx="500" delayInMs="16.66"/>  
            </section>
          )
        }
      } // End of All Page if
      else if (showPage == 'single') {  // Code for rendering single proposal Page
        trackPage(`/p/${singleProposalId}`)   // Send page view to analytics
        return (
          <SinglePost
            key={shortid.generate()}
            main_data={singlePostData.main_data}
            kpi_data={singlePostData.kpi_data}
            financial_data={singlePostData.financial_data}
            report_data={singlePostData.report_data}

            // Elements for handling functions
            showTab={showTab}   // Code to show the correct tab when the singlepage is accessed from the modal
            getBack={this.handleBack}
            toggleFilter={this.handleChangeChk}
          />
        )
      } // End of Single page if
      else if (showPage == 'month') { // Code for rendering month list Page
        trackPage('/monthList')   // Send page view to analytics
        if (!Array.isArray(monthListData) || !monthListData.length) {
          // Still loading Airtable data
          return (
            <p>Loading&hellip;</p>
          )
        } else {
          return (
            <main>
              <MonthPage
                monthListData={monthListData}      // Elements for the Month report list
                monthId={monthId}

                // For handling functions
                getProposalID={this.handleProposalPage}
                getMonthId={this.handleSelectMonth}
              />
              <ScrollButton scrollStepInPx="125" delayInMs="16.66"/>
            </main>
          )
        }
      } // End of month list page if 
      else if (showPage == 'about') { // Code for rendering About Page
        trackPage('/about')   // Send page view to analytics
        return (
          <main>
            <AboutPage></AboutPage>
          </main>
        )
      } // End of About Page if    
  }
}

export default Home