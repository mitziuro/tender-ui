import React from "react";
import { Link } from 'react-router-dom';

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {takeOffer, closeOffer, getOffer} from "../../../../crud/tender/offer.crud";

import {getUserByToken} from "../../../../crud/auth.crud";

import  AlertListingComponent from '../components/AlertListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';

import { toAbsoluteUrl } from "../../../../../_metronic";


import './OfferPage.css';


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


export default class OfferPage extends React.Component {


    constructor(props) {
        super(props);


        this.state = {offer: {id: null, notice: {id: null}, tender: {id: null}}};
        this.offerId = this.props.location.search != null && this.props.location.search.split('id=').length == 2 ? this.props.location.search.split('id=')[1] : null;

        this.handleTakeOffer = this.handleTakeOffer.bind(this);
        this.handleCloseOffer = this.handleCloseOffer.bind(this);

        Promise.all([getOffer(this.offerId), getUserByToken()]).then(response => {
            this.setState({offer: response[0].data, user: response[1].data});
        });
    }

    handleTakeOffer = () => {
        Promise.all([takeOffer(this.offerId)]).then(response => {
            this.setState({offer: response[0].data});
        });
    }

    handleCloseOffer = () => {
        Promise.all([closeOffer(this.offerId)]).then(response => {
            this.setState({offer: response[0].data});
        });
    }


    render() {

        return  (
            <>
            {this.state.offer.id != null ? this._render_big(this.state.offer) : (<></>)}
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="offerResult">
                        <CodeExample beforeCodeTitle={this.state.offer.notice.name}>
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                    </div>
                                    <div className="kt-section__content" style={{textAlign: 'center'}}>
                                        {this.state.offer.state == 1 ?
                                            <Button onClick={this.handleTakeOffer} color="primary">
                                                Work on It
                                            </Button>
                                            : this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?
                                            <Button onClick={this.handleCloseOffer} color="primary">
                                                Close it
                                            </Button> :
                                            <div></div>
                                        }
                                        <Link
                                            to={`/tender/tender-pages/NoticePage?id=${this.state.offer.notice.id}`}>
                                            <Button style={{marginLeft: "10px"}}color="primary" type="button">View Notice</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>
            </div>
            </>
        )}

    _render_big(offer) {
        return (
            <>
                        <div className="col-md-12">
                            <div className="kt-portlet kt-portlet--height-fluid">
                                <div className="kt-portlet__body kt-portlet__body--fit">
                                    <div className="kt-widget kt-widget--project-1">
                                        <div className="kt-widget__head">
                                            <div className="kt-widget__label">
                                                <div className="kt-widget__media">
                                <span className="kt-media kt-media--lg kt-media--circle">
                                    <img src={toAbsoluteUrl("/media/logos/tender_logo.png")} alt="image"/>

                                </span>
                                                </div>
                                                <div className="kt-widget__info kt-margin-t-5">
                                                    <a className="kt-widget__title">
                                                        {offer.notice.contractingAuthority ? offer.notice.contractingAuthority.name : ''}
                                                    </a>
                                <span className="kt-widget__desc">
                                    {offer.notice.name ? offer.notice.name : ''}
                                </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-widget__body">
                                            <div className="kt-widget__stats">
                                                <div className="kt-widget__item">
                                <span className="kt-widget__date">
                                    Notice Date
                                </span>
                                                    <div className="kt-widget__label">
                                                        <span className="btn btn-label-brand btn-sm btn-bold btn-upper">{offer.notice.publicationDate.split('T')[0].replace('-','.').replace('-','.')}</span>
                                                    </div>
                                                </div>

                                                <div className="kt-widget__item">
                                <span className="kt-widget__date">
                                    Start Date
                                </span>
                                                    <div className="kt-widget__label">
                                                        <span className="btn btn-label-danger btn-sm btn-bold btn-upper">{offer.startDate ? offer.startDate.split('T')[0].replace('-','.').replace('-','.') : ''}</span>
                                                    </div>
                                                </div>

                                                <div className="kt-widget__item flex-fill">
                                                    <span className="kt-widget__subtitel">Status</span>
                                                    <div className="kt-widget__progress d-flex  align-items-center">

                                    <span className="kt-widget__stat">
                                        {offer.state == 1 ? (<><span class="badge badge-success">Started</span></>) : (<></>)}
                                        {offer.state == 2 ? (<><span class="badge badge-warning">In Supervision</span></>) : (<></>)}
                                        {offer.state == 3 ? (<><span class="badge badge-success">Supervision Ended</span></>) : (<></>)}

                                    </span>
                                                    </div>
                                                </div>
                                            </div>

                        <span className="kt-widget__text">
                            <i> TO DO Description </i>
                        </span>

                                            <div className="kt-widget__content" style={{justifyContent: "space-between"}}>
                                                <div className="kt-widget__details">
                                                    <span className="kt-widget__subtitle">Budget</span>
                                                    <span className="kt-widget__value"> <span>RON</span> {offer.notice.estimatedValue} </span>
                                                </div>


                                                <div className="kt-widget__details">
                                                    <span className="kt-widget__subtitle">Team</span>
                                                    <div className="kt-media-group" style={{margin: "1px"}}>
                                                        <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Tender:</span> &nbsp;&nbsp;&nbsp; {offer.tender.firstName} {offer.tender.lastName}
                                                    </div>
                                                    <div className="kt-media-group" style={{margin: "1px"}}>
                                                        <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Supervisor:</span> {offer.supervisor ?  (<> &nbsp;&nbsp;&nbsp; {offer.supervisor.firstName} {offer.supervisor.lastName} </>) : ''}
                                                    </div>
                                                    <div className="kt-media-group" style={{margin: "1px"}}>
                                                        <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Expert:</span> {offer.expert ?  (<> &nbsp;&nbsp;&nbsp; {offer.expert.firstName} {offer.expert.lastName} </>) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>

            </>
        )}
}