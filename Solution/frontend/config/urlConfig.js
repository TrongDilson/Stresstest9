const HOST_PORT = 8080
const HOST_URL = "http://localhost:" + HOST_PORT
const CUSTOMER_SERVICE_URL = `${HOST_URL}/customer`
const CUSTOMER_SERVICE_URL_ALL_USERS = CUSTOMER_SERVICE_URL + "/all"
const CUSTOMER_SERVICE_URL_TOTAL_PAGES = CUSTOMER_SERVICE_URL + "/pagination/totalPage"

const CUSTOMER_SERVICE_URL_USERS_PAGE = 
    function (pageNumber, size, columnName = "id") {
        return CUSTOMER_SERVICE_URL
                + `/pagination/pageNumber/${pageNumber}`
                + `/size/${size}`
                + `/sort/${columnName}`
    };