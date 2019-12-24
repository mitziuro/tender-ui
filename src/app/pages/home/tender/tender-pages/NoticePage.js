import React from "react";
import { Link } from 'react-router-dom';
import { CircularProgress } from "@material-ui/core";

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getNotice, getNoticeContent, getNoticeDocuments, getNoticeDocumentContentURI} from "../../../../crud/tender/search.notice.crud";
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
        this.state = {notice: {name: null}, offer: {id: null}, documents:[]};
        this.noticeId = this.props.location.search != null && this.props.location.search.split('id=').length == 2 ? this.props.location.search.split('id=')[1] : null;

        this.handleCreateOffer = this.handleCreateOffer.bind(this);
        this.handleGetNoticeDocumentContentURI = this.handleGetNoticeDocumentContentURI.bind(this);


        Promise.all([getNotice(this.noticeId), getMyOfferForNotice(this.noticeId)]).then(response => {
            this.setState({notice: response[0].data, offer: response[1].data});

            console.log(this.state.notice);

            Promise.all([getNoticeContent(this.state.notice.noticeId, this.state.notice.type, 'en')]).then(response => {

                if(response[0].data.contentEn == null) {
                    Promise.all([getNoticeContent(this.state.notice.noticeId, this.state.notice.type, 'en')]).then(response => {
                        this.setState({content: response[0].data.contentEn});
                    });
                } else {
                    this.setState({content: response[0].data.contentEn});
                }

            });

            Promise.all([getNoticeDocuments(this.state.notice.noticeId)]).then(response => {
                this.setState({documents: response[0].data});
            });





        });
    }

    handleGetNoticeDocumentContentURI = (id, filename) => {
        return getNoticeDocumentContentURI(id, filename);
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
                                        { this.state.content == null ? (
                                            <> <div classNAme="md-12" style={{display: "flex", marginBottom: "10px", justifyContent: "center"}}> <CircularProgress className="kt-splash-screen__spinner" /> </div> </>
                                        ) :
                                            (<div dangerouslySetInnerHTML={{__html: this.state.content}}></div>)}
                                    </div>
                                    {this.state.documents.length > 0 ?
                                        <div className="kt-section__content">
                                            <div id="section-1"
                                                 className="c-section widget u-section-filter ng-scope ng-isolate-scope">
                                                <div className="widget-header">
                                                    <div className="widget-buttons">
                                                        <a>
                                                            <div className="widget-caption ng-binding">
                                                                <i ng-hide="noIcon"
                                                                   className="fa fa-filter ng-hide"></i>
                                                            </div>
                                                            <i className="fa fa-chevron-up"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="widget-body " style={{minHeight: "50px"}}>

                                                    <div className="row ng-scope">
                                                        <div className="col-md-12">
                                                            <h4>PDF Files: </h4>
                                                            <div className="c-df-notice__box">
                                                                <div className="u-displayfield s-row">

                                                                    {
                                                                        this.state.documents.map((d) => {

                                                                            return (
                                                                                <div style={{float: "left"}}>
                                                                                    {d.fileName.indexOf('.pdf') >= 0 ? (
                                                                                        <a target="_blank" href={this.handleGetNoticeDocumentContentURI(d.id, d.fileName)}>
                                                                                        <i style={{color: "red"}} class="fa fa-file-pdf"> </i>
                                                                                        <span> {d.fileName} </span>
                                                                                    </a>) : ( <a target="_blank" href={this.handleGetNoticeDocumentContentURI(d.id, d.fileName)}>
                                                                                        <i style={{color: "red"}} class="fa fa-file"> </i>
                                                                                        <span> {d.fileName} </span>
                                                                                    </a>)
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div></div>
                                    }
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

                                        {this.state.notice.contractingAuthority ?
                                            ( <Link style={{position:'relative',left: '10px'}}
                                                to={`/tender/admin-pages/ComparisonDashboardPage?caId=${this.state.notice.contractingAuthority.id}&cpvId=${this.state.notice.cpv.id}`}>
                                                <Button color="primary">
                                                    Compare
                                                </Button>
                                            </Link>) :(<></>)
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