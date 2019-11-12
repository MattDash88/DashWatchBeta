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

export default { getCountryList }