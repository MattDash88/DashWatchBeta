const getCountryList = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsCountryList`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

//  **********************
// Fetching functions for KPI explorer
//  **********************

// API query requesting Trust Protector Candidate List data
const getLabsListOfProjects = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/list/labsProjectsWithKpis`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

// API query requesting Trust Protector Candidate List data
const getLabsListOfKpis = (proposalHash) => {
    return (
        new Promise((resolve) => {
            fetch(`/api/list/ListOfKpis?hash=${proposalHash}`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

// API query requesting Trust Protector Candidate List data
const getLabsKpiDataset = (kpiID) => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsKpiData?kpi=${kpiID}`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

export default { 
    getCountryList,
    // Fetching functions for KPI Explorer
    getLabsListOfProjects,
    getLabsListOfKpis,
    getLabsKpiDataset,
 }