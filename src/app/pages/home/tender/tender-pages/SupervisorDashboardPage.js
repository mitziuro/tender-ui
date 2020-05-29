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


export default class SupervisorDashboardPage extends React.Component {



    constructor(props) {
        super(props);
    }


    render() {
        return (
            <>
                <div className="row">
                    <div className="col-md-12" style={{display: 'flex'}}>
                        <div className="col-md-6">
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="Open Offers">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed">
                                                <OfferListingComponent user={'supervisor'} states={[1]} />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>
                        <div className="col-md-6" style={{display: 'flex', flexDirection: 'column', minHeight: '300px'}}>
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="My Work">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed">
                                                <OfferListingComponent user={'supervisor'} states={[2]} />
                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>
                     </div>
                 </div>
                <div className="row">
                       <div className="col-md-12" style={{display: 'flex', flexDirection: 'column', minHeight: '300px'}}>
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="My Completed Offers">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="kt-separator kt-separator--dashed">
                                                <OfferListingComponent user={'supervisor'} states={[3,4,5,10,11]} />
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