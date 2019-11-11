const colors = ['blue', 'green', 'red', 'purple']

function buildChartDataset(dataset, chartName, colorId) {
    const chartDataset = {
        label: chartName,
        fill: false,
        borderColor: colors[colorId],
        data: dataset
    }
    return (chartDataset)
}

function buildChartOptions(chartLabel) {
    const chartDataset = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'month'
                },
                distribution: "series",
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
                scaleLabel: {
                    display: true,
                    labelString: chartLabel
                },
            }]
        }
    }
    return (chartDataset)
}

function createDropdownList(countryObject) {
    try {
        var dropdownList = []
        Object.values(countryObject).map((item) => {
            dropdownList.push({
                key: item.unique_id,
                value: item.country_code,
                flag: item.flag,
                text: item.country_name,
            })
        })
        return dropdownList
    } catch (e) {
        return {
            key: 'error',
            value: '',
            flag: '',
            text: 'Something went wrong',
        }
    }
}

export default { buildChartDataset, buildChartOptions, createDropdownList }