import React from "react";
import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../components/AlertListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';


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
    }


    render() {
        return (
            <>
                <div className="row">
                    <div className="col-md-12" style={{display: 'flex'}}>
                        <div className="col-md-6">
                            <div className="noticeResults">
                                <CodeExample beforeCodeTitle="Alert Results">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-section__content">
                                                <NoticeListingComponent />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="alertsResults">
                                <CodeExample beforeCodeTitle="My Alerts">
                                    <div className="kt-section">
                                        <div className="col-md-12" >
                                            <div className="kt-section__content">
                                                <AlertListingComponent />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>

                            <CodeExample beforeCodeTitle="My Offers">
                                <div className="kt-section">
                                    <div className="col-md-12"  className="offersResults">
                                        <div className="kt-separator kt-separator--dashed">
                                        </div>
                                    </div>
                                </div>
                            </CodeExample>
                        </div>
                    </div>
                </div>
            </>
    )}
}