import ReactGA from 'react-ga';
const getGAKey =  'UA-132694074-1'
ReactGA.initialize(getGAKey);

const trackPage = function page(page) { // Function to track page views
    ReactGA.pageview(page);
  }
  
  const trackEvent = function event(category, event) { // Function to track user interaction with page
    ReactGA.event({
      category: category,
      action: event,
    });
  }

export { getGAKey,  trackPage, trackEvent }