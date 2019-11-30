import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../../components/AlertListingComponent';
import  OfferListingComponent from '../../components/OfferListingComponent';
import  NoticeListingComponent from '../../components/NoticeListingComponent';


import './Offers.css';


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


export default class MyDeclinedOffersPage extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex', flexWrap : "wrap"}}>
                    <OfferListingComponent states={[10]} type="big" />
                </div>
            </div>
            </>
        )}
}