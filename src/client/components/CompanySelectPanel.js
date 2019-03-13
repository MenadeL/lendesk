import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import Select from 'react-select';
import CompanyApi from '../api/CompanyApi';
import { formatPrice } from '../utils/CommonFunctions';

//CSS IMPORTS
import '../css/CompanySelectPanel.css';

class CompanySelectPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            companiesRawList: null,
            companiesOpt: [],
            selectedCompany: null,
            selectedCompanyData: null,
            isLoading: true,
            notFound: false
        }

        this.populateCompanies();
    }

    assembleListOfOptions = (data) => {
        let arrOptions = [];

        data.map((company) => {
            arrOptions.push({
                value: company.symbol, 
                label: company.companyName
            });
        });

        arrOptions.sort((a, b) => a.label.localeCompare(b.label));

        return arrOptions;
    }

    populateCompanies = () => {
        const self = this;

        CompanyApi.getAllInFocus().then((data) => {
            this.setState({
                companiesRawList: data,
                companiesOpt: self.assembleListOfOptions(data),
                isLoading: false
            });
        });
    }

    onCompanyChange = (selectedCompany) => {
        this.setState({ 
            selectedCompany: selectedCompany,
            isLoading: true 
        });

        CompanyApi.getInfoBySymbol(selectedCompany.value).then((data) => {
            this.setState({ 
                selectedCompanyData: data,
                isLoading: false,
                notFound: false
            });
        });
    }

    onSymbolSearch = (text) => {
        if (text.length > 1) {
            this.setState({ isLoading: true, selectedCompanyData: null });

            CompanyApi.getInfoBySymbol(text).then((data) => {

                const selectedCompany = { value: data.symbol, label: data.companyName }
                
                this.setState(prevState => {
                    const listHasValue = prevState.companiesOpt.find((opt) => opt.value === data.symbol);

                    return {
                        companiesOpt: (!listHasValue) 
                            ? [...prevState.companiesOpt, selectedCompany].sort((a, b) => a.label.localeCompare(b.label))
                            : prevState.companiesOpt,
                    }
                });
            }).catch((error) => {
                this.setState({ 
                    selectedCompany: [],
                    notFound: true 
                });
            }).finally(() => {
                this.setState({ isLoading: false });
            });
        }
    }

    renderCompany = (selectedCompanyData) => {
        return (
            <Fragment>
                <div className="form-group">
                    <h6>Symbol</h6>
                    <p>{selectedCompanyData.symbol}</p>
                </div>
                <div className="form-group">
                    <h6>Current Stock Price</h6>
                    <p>{formatPrice(selectedCompanyData.price)}</p>
                </div>
                <div className="form-group">
                    <h6>Description</h6>
                    <p>{selectedCompanyData.description}</p>
                </div>
            </Fragment>
        );
    }

    render() {
        const {
            companiesList,
            companiesOpt,
            selectedCompany,
            selectedCompanyData,
            isLoading,
            notFound
        } = this.state;

        return (
            <form id="company-select-panel" className="custom-panel-1">
                <div className="form-group">
                    <h6>Select a company</h6>

                    <Select
                        value={selectedCompany}
                        onChange={this.onCompanyChange}
                        options={companiesOpt}
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onInputChange={this.onSymbolSearch}
                    />
                    <small className="text-muted">Or search by company symbol</small>
                </div>
                
                {!isLoading && selectedCompanyData && !notFound &&
                    this.renderCompany(selectedCompanyData) 
                }

                {notFound &&
                    <p className="alert alert-warning">Sorry, no company was found.</p>
                }
            </form>
        );
    }
}


CompanySelectPanel.propTypes = {};

export default CompanySelectPanel;