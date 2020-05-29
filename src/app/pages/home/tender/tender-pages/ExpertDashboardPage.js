import React from "react";
import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../components/AlertListingComponent';
import  OfferListingComponent from '../components/OfferListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';


import './SupervisorDashboardPage.css';


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

import { getUserByToken, saveUserByToken } from '../../../../crud/auth.crud';


export default class ExpertDashboardPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

        Promise.all([getUserByToken()]).then(response => {
            this.setState({user: response[0].data});
        });

    }


    render() {
        return (
            <>

                {this.state.user && !this.state.user.approved ?
                    <div className="row" className="no_supervised">
                        <div>You are not approved by supervisor</div>
                    </div>

                :

                <div className="row">
                        <div className="col-md-6" style={{display: 'flex', flexDirection: 'column', minHeight: '300px'}}>
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="Bid offers">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed">
                                                <OfferListingComponent user={'expert'} states={[4]} />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>

                        </div>


                        <div className="col-md-6" style={{display: 'flex', flexDirection: 'column', minHeight: '300px'}}>

                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="Assigned to me">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed">
                                                <OfferListingComponent user={'expert'} states={[5]} />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>

                </div>

                }
            </>
    )}
}