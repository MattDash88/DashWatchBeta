import React from 'react';
import { Line } from 'react-chartjs-2';

// Import css
import '../css/style.css';
import '../css/elections.css';

const buildContent = (voteMetrics, electionId) => {
    try {
        var electionMetrics = voteMetrics[electionId]                                  // Proposal that is active
        var chartDataset = []

        // Make an array with KPIs for the active proposal
        Object.values(electionMetrics).map((item) => 
        chartDataset.push({
                x: item.date,
                y: item.vote_participation,
            }),  
        )

        const chartData = {
            data: {                     // Data + styling for the chart
                datasets: [{
                    label: 'Percentage of Masternodes that voted',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#012060',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: chartDataset,    // participation data points
                }]
            },
            options: {      // Options for the chart, mainly styling of the axis
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            steps: 10,
                            max: Math.min(chartDataset[chartDataset.length - 1].y * 5, 100),       // Scale y-axis to dataset, or 100% as maximum
                            callback: function(tick) {                            
                                return Math.floor(tick).toString() + '%';
                            }
                        },
                    }]
                },                                
           }
        }

        const pageProps = {
            last_updated: electionMetrics[electionMetrics.length - 1].date,
            number_of_masternodes: electionMetrics[electionMetrics.length - 1].number_of_masternodes,
            valid_votes: electionMetrics[electionMetrics.length - 1].valid_votes,
        }

        
        return {
            chartData: chartData,
            pageProps: pageProps,
        }
    } catch (e) {
        const chartData = {
            data: {  // Data styling for the chart
                datasets: []
            },
            options: {}
        }

        const pageProps = {
            last_updated: 'N/A',
            number_of_masternodes: 'N/A',
            valid_votes: 'N/A',
        }

        return {
            chartData: chartData,
            pageProps: pageProps,
        }
    }
}

const chartFunction = (chartData, options, redrawState) => {
    try {
        var chartObject = 
            <div>
            <Line
                data={chartData}
                options={options}
                redraw={redrawState}
            />
            </div>
        
        return chartObject
    }
    catch (error) {
        var chartObject = 
            <div>
                Please select a valid dataset
            </div>
        
        return chartObject
    }
}

class VoteCharts extends React.Component {
    constructor() {
        super();
    }
    render() {
        const {     // Elements passed down to the component
            electionId,
            voteMetrics,
            redrawState,
        } = this.props

        const {
            chartData,
            pageProps,
        } = buildContent(voteMetrics, electionId)
        var chartObject = chartFunction(chartData.data, chartData.options, redrawState)

        return (
            <main>
                <section className="tpPageTopSection" value={electionId == "TPE2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 Dash TP Elections voting participation</h1>
                    <div className="tpText">The chart was updated once a day during the elections.</div>                
                </section>
                <section className="tpPageTopSection" value={electionId == "DIF2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 DIF Supervisor Elections voting participation</h1>
                    <p className="tpText">The chart is updated once a day during the elections.</p>
                </section>
                <div className="tpChartStatsDiv">
                <div className="tpChartStatsTitle">Last updated:</div><div className="tpChartStatsItem" title={pageProps.last_updated}>{pageProps.last_updated}</div><br></br>
                    <div className="tpChartStatsTitle">Number of eligible MNs:</div><div className="tpChartStatsItem" title={pageProps.number_of_masternodes}>{pageProps.number_of_masternodes}</div><br></br>
                    <div className="tpChartStatsTitle">Total valid votes cast:</div><div className="tpChartStatsItem" title={pageProps.valid_votes}>{pageProps.valid_votes}</div>
                </div>
                {chartObject}
            </main>
        )
    }
}

export default VoteCharts