import React from "react";
import { Link } from 'react-router-dom';

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getNotice} from "../../../../crud/tender/search.notice.crud";
import {getMyOfferForNotice, putMyOfferForNotice} from "../../../../crud/tender/offer.crud";


import  AlertListingComponent from '../components/AlertListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';


import './NoticePage.css';


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


export default class NoticePage extends React.Component {



    constructor(props) {
        super(props);
        this.state = {notice: {name: null}, offer: {id: null}};
        this.noticeId = this.props.location.search != null && this.props.location.search.split('id=').length == 2 ? this.props.location.search.split('id=')[1] : null;

        this.handleCreateOffer = this.handleCreateOffer.bind(this);

        Promise.all([getNotice(this.noticeId), getMyOfferForNotice(this.noticeId)]).then(response => {
            this.setState({notice: response[0].data, offer: response[1].data});
        });
    }

    handleCreateOffer = () => {
        Promise.all([putMyOfferForNotice(this.noticeId)]).then(response => {
            this.setState({offer: response[0].data});
        });
    }


    render() {
        return (
            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="noticeResult">
                        <CodeExample beforeCodeTitle={this.state.notice.name}>
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        Notice Content {this.state.notice.name}
                                    </div>
                                    <div className="kt-section__content" style={{textAlign: 'center'}}>
                                        {this.state.offer.id == null ?
                                            <Button onClick={this.handleCreateOffer} color="primary">
                                                Participate
                                            </Button>
                                            :
                                            <Link
                                                to={`/tender/tender-pages/OfferPage?id=${this.state.offer.id}`}>
                                                <Button color="primary">
                                                    View
                                                </Button>
                                            </Link>
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