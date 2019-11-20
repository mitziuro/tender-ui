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

        return (
            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="offerResult">
                        <CodeExample beforeCodeTitle={this.state.offer.notice.name}>
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        <h1> This is the content of the offer</h1>
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