import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../../components/AlertListingComponent';
import  OfferListingComponent from '../../components/OfferListingComponent';
import  NoticeListingComponent from '../../components/NoticeListingComponent';


import './ChangePasswordPage.css';


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


export default class AlertsPage extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="alertsResults">
                        <CodeExample beforeCodeTitle="Change Password">
                            <div className="kt-section">
                                <div className="col-md-12" >
                                    <div className="kt-section__content">
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