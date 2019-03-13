import axios from 'axios';

const companyTemplateBase = axios.create({
    baseURL: 'https://api.iextrading.com/1.0',
    timeout: 20000,
    headers: { 'content-type': 'application/json' }
});

class CompanyApi {
    static getAllInFocus = () => companyTemplateBase
        .get('/stock/market/list/infocus') ///market/list API was not working
        .then(response => response.data);

    static getDataBySymbol = symbol => companyTemplateBase
        .get(`/stock/${symbol}/company`)
        .then(response => response.data);

    static getPriceBySymbol = symbol => companyTemplateBase
        .get(`/stock/${symbol}/price`)
        .then(response => response.data);

    static getInfoBySymbol = symbol => axios
        .all([this.getDataBySymbol(symbol), this.getPriceBySymbol(symbol)])
        .then((response) => {
            const data = Object.assign(response[0], {price: response[1]});
            return data;
        });
}

export default CompanyApi;