
const config = {
pollTimer: {
    cache: 2500,
    datasource: 2500,
    gc: 2500,
    process: 2500,
    memory: 2500,
    threads: 2500
  },
  csrf: {
    parameterName: '_csrf',
    headerName: 'X-XSRF-TOKEN'
  },
}

module.exports =  config;