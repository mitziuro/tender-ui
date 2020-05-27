import React from "react";
import {Redirect} from "react-router-dom";

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../components/AlertListingComponent';
import  OfferListingComponent from '../components/OfferListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';
import  UserActivityComponent from '../components/UserActivityComponent';
import {getUserByToken} from "../../../../crud/auth.crud";


import './TenderDashboardPage.css';


import {
    Checkbox,
    FormControlLabel,
    TextField,
    InputLabel,
    MenuItem,
    Select,

    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";


export default class TenderDashboardPage extends React.Component {



    constructor(props) {
        super(props);

        Promise.all([getUserByToken()]).then(response => {
            this.setState({user: response[0].data});
        })
    }


    render() {
        return (

            <>

                { this.state && this.state.user ?
                       this.state.user.authorities.indexOf('ROLE_TENDER') < 0 ?
                       this.state.user.authorities.indexOf('ROLE_SUPERVISOR') >= 0 ? <Redirect to="/tender/tender-pages/SupervisorDashboardPage" /> :
                       <Redirect to="/tender/tender-pages/ExpertDashboardPage" /> : '' :
                 ''

                }

                <div className="row">

                    <div className="col-md-12" style={{display: 'flex'}}>
                        <div className="col-md-6">
                            <div className="noticeResults">
                                <CodeExample beforeCodeTitle="Latest Results">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-section__content">
                                                <NoticeListingComponent expandable={true} />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>

                        <div className="col-md-6" style={{minHeight: '400px'}}>
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="Recent Activity">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed">
                                                <UserActivityComponent />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12" style={{display: 'flex', height: '300px'}}>
                        <div className="col-md-6">
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="My Procedures">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed">
                                                <OfferListingComponent states={[1,2,3,4,5,10,11]} />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="Recently Active Experts">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed" style={{textAlign: 'center', paddingTop: '22px',minHeight: '123px'}}>
                                                <b>No Results</b>
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>

                    </div>
                </div>
            </>
    )}
}