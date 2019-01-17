import fetch from 'isomorphic-unfetch'
import SinglePost from '../components/Permalink'
import "../components/css/permalink.css";
import "../components/css/style.css";

class Single extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {
      main_data,
      kpi_data,
      financial_data,
      report_data,
    } = this.props

    return (
      // Simplified navbar code
      <main>
            <div className="permalinkMenu">
            <nav className="permalinkMenuContent">
            <li className="permalinkMenuImage"><img id="Logo" src="https://dashwatchbeta.org/Logo/logo_white20.png"></img></li>
            <li className="permalinkMenuItem"><a className="permalinkMenuItem" href="https://dashwatchbeta.org" target="https://dashwatchbeta.org">Home</a></li>
            </nav>
            </div>
        <section className="pagewrapper">  
        <SinglePost
              main_data={main_data}
              kpi_data={kpi_data}
              financial_data={financial_data}
              report_data={report_data}
        />
      </section></main>
    )
  }
}

Single.getInitialProps = async (context) => {
  const basePath = 'https://dashwatchbeta.org'
  const { slug } = context.query

  const res = await fetch(`${basePath}/api/p/${slug}`)
  const airtablePost = await res.json()

  return airtablePost.data ? airtablePost.data : {}
}

export default Single