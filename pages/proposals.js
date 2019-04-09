import fetch from 'isomorphic-unfetch';
import React from 'react';

// Analytics
import {trackPage, trackEvent} from '../components/functions/analytics';

// Import pages
import Post from '../components/Post';

// Import css
import '../components/css/style.css';
import '../components/css/status_styling.css';

// Import other elements 
import Header from '../components/headers/ProposalsHeader';
import NavBar from "../components/elements/NavBar"
import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button

var basepath = 'https://dashwatchbeta.org'

// Airtable query requesting Proposal List data
const getPosts = () => {
    return (
        new Promise((resolve) => {
            fetch(`${basepath}/api/get/posts`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res.data)
                    }))
        })
    )
}

// Airtable query requesting queried data, used by the filters and search function
const filterPost = (query) => {
    return (
        new Promise((resolve) => {
            fetch(`${basepath}/api/filter/${query}`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res.data)
                    }))
        })
    )
}

class Home extends React.Component {
    static async getInitialProps(ctx) {
        const props = {
            search: typeof ctx.query.search == "undefined" ? "" : ctx.query.search,
            toggleInactive: typeof ctx.query.toggleInactive == Boolean ? ctx.query.toggleInactive : true,
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props)
        this.state = {
            search: props.search,
            airtableData: [],             // All Proposal data
            displayData: [],              // Data filtered on querry
            showTab: '',                  // State that handles the initial tab on the Single Proposal page, the modal can direct the user directly to the funding and performance tabs
            showInactivePosts: props.toggleInactive,     // State of the inactive proposal filter, opted-out or concluded proposals are hidden by default to increase rendering performance
            url: '/proposals',
            as: props.as,
        }
        // Binding functions in this class
        this.handleFilter = this.handleFilter.bind(this);       // Toggle filter of inactive proposals   
    }

    // Function that initiates the "single proposal page" if selected
    handleFilter(event) {
        event.preventDefault();
        this.setState({ 
            showInactivePosts: !this.state.showInactivePosts,
            as: `/proposals?search=${this.state.search}&toggleInactive=${!this.state.showInactivePosts}`,
        })
        
        // Pushing created State to history because state updates in React are too slow              
        // history.pushState(this.state, '', this.state.as)   // Push State to history
        trackEvent('Proposals Page', 'Toggled Active Filter')                 // Track Event on Google Analytics
    }

    componentDidMount() {
        // To handle calls from history (forward and back buttons)
        onpopstate = event => {
            if (event.state) {                
                this.setState(event.state)
            }             
        }       

        trackPage(`/proposals`) // Track Pageview in Analytics

        // Set Promises for Promise.all
        const query = `search=${this.state.search.toLowerCase()}&show_inactive=${this.state.showInactivePosts}`
        var getPostsPromise = Promise.resolve(getPosts());
        var filterPostsPromise = Promise.resolve(filterPost(query));
            
        // Promise to get the initial "airtableData" and filtered records  
        Promise.all([getPostsPromise, filterPostsPromise]).then(data => {
            this.setState({
                airtableData: data[0],
                displayData: data[1],
            })        
        }).then(history.replaceState(this.state, '', this.state.as))
    }

    componentDidUpdate(prevProps, prevState) {
        // Update "Proposal list" data for search and filters
        if (prevState.search !== this.state.search || prevState.showInactivePosts !== this.state.showInactivePosts) {

            // Set Promises for Promise.all
            const query = `search=${this.state.search.toLowerCase()}&show_inactive=${this.state.showInactivePosts}`
            var getPostsPromise = Promise.resolve(getPosts());
            var filterPostsPromise = Promise.resolve(filterPost(query));

            Promise.all([getPostsPromise, filterPostsPromise]).then(data => {
                this.setState({
                    airtableData: data[0],
                    displayData: data[1],
                })
            })//.then(history.replaceState(this.state, '', this.state.as))
        }
    }

    

    render() {
        const { // Declare data arrays used in class
            airtableData,
            displayData,
        } = this.state

        // Showing search message
        if (this.state.search !== "") {
            var searchFilterMessage = (
                <div>
                    <p className="headerText">Results for search: <b>{this.state.search}</b><br></br>
                        Currently showing <b>{displayData.length}</b> of <b>{airtableData.length}</b> proposals
                    </p>
                </div> 
            )
        } else {
            var searchFilterMessage = (
                <div>
                    <p className="headerText">
                        Currently showing <b>{displayData.length}</b> of <b>{airtableData.length}</b> proposals
                    </p>
                </div> 
            )
        }

        return (
            <main>
                <Header></Header>
                <NavBar
                    showPage="proposals"
                    searchQuery={this.state.search}
                />
                <section className="pagewrapper">
                    <h1 className="listHeader">List of Dash funded proposals</h1>
                    <div className="headerLeftDiv">
                        <label className="container">
                            <input type="checkbox" checked={this.state.showInactivePosts} onChange={this.handleFilter} />
                            <span className="checkmark"></span><p>Show inactive proposals</p>
                        </label>
                    </div>
                    <div className="headerRightDiv">
                        {searchFilterMessage}                   
                    </div>
                    
                    <ProposalList
                        // Arrays containing the data
                        airtableData={airtableData}      // All data, currently only used to check if data retrieval has been successful
                        displayData={displayData}        // Data for the "Proposal List" page after filters         

                        // Elements for functions
                        showTab={this.state.showTab}        // Direct to tab on single page from modal
                        toggleFilter={this.handleFilter}    // Handle toggle of inactive proposal filter
                        //goBack={this.handleBack}            // Handle going back to previous page from singlepage
                        search={this.state.search}          // To show what the results are for
                        showInactivePosts={this.state.showInactivePosts}
                    />
                </section>
                <ScrollButton scrollStepInPx="500" delayInMs="16.66" />
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
    }
  
    // Pass on single proposal click to Home
    handleProposalPage(slug, openTab) {
      this.props.setSinglePage(slug, openTab)
    }
  
    // Pass on back button click to Home 
    handleBack() {
      this.props.goBack()
    }

    render() {
      const {
        // Arrays with data
        airtableData,   // All proposal data
        displayData,    // Data for the "Proposal List" page, dataset after filters
  
        // Elements for functions
        showTab,        // Element for initial tab to show on "single proposal page"
        search,         // Used to display query at top
  
            // Elements for Analytics
            singleProposalId,
        } = this.props

        if (airtableData.length == 0 && displayData.length == 0) {
            // Still loading Airtable data
            return (
                <section>
                    Loading&hellip;
                </section>
            )
        } else if (displayData.length == 0) {
            return (
                <section>
                    <p>No proposals found</p>
                </section>
            )
        } else {
            // Loaded
            return (
                <section>
                    {displayData.map((post) =>
                        <Post
                            key={post.main_data.id}
                            // Elements for Main Post
                            main_data={post.main_data}
                            report_data={post.report_data}

                            // For handling functions
                            showTab={showTab}
                            getProposalID={this.handleProposalPage}
                        />
                    )}
                </section>
            )
        }
    }
  }
  
  export default Home