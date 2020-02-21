import {
    Table,
    Flag,
} from 'semantic-ui-react';

var monthsList = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
];

function createListDateString(dateString) {
    try {
        var year = dateString.slice(0, 4)
        var month = Number(dateString.slice(5, 7) - 1)
        var walletdateString = `${monthsList[month]} ${year}`
        return walletdateString
    } catch (e) {
        return 'Error'
    }
}

export default {
    createListDateString,
}