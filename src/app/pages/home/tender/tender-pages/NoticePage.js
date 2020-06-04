import React from "react";
import { Link } from 'react-router-dom';
import { CircularProgress } from "@material-ui/core";

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getNotice, getNoticeContent, getNoticeDocuments, getNoticeDocumentContentURI, getNoticeDocumentOriginalContentURI} from "../../../../crud/tender/search.notice.crud";
import {getMyOfferForNotice, putMyOfferForNotice} from "../../../../crud/tender/offer.crud";

import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, Inject } from '@syncfusion/ej2-react-pdfviewer';
import FileIcon, { defaultStyles } from 'react-file-icon';

import  AlertListingComponent from '../components/AlertListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';

import DocumentLink from "../utilities/document.link";

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
        this.state = {notice: {name: null}, offer: {id: null}, documents:[], selectedFile: null};
        this.noticeId = this.props.location.search != null && this.props.location.search.split('id=').length == 2 ? this.props.location.search.split('id=')[1] : null;

        this.handleCreateOffer = this.handleCreateOffer.bind(this);
        this.handleGetNoticeDocumentContentURI = this.handleGetNoticeDocumentContentURI.bind(this);
        this.handleGetNoticeDocumentOriginalContentURI = this.handleGetNoticeDocumentOriginalContentURI.bind(this);


        Promise.all([getNotice(this.noticeId), getMyOfferForNotice(this.noticeId)]).then(response => {
            this.setState({notice: response[0].data, offer: response[1].data});

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

    handleGetNoticeDocumentOriginalContentURI = (id, filename) => {
        return getNoticeDocumentOriginalContentURI(id, filename);
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
                        {this.state.notice.id ? (<div style={{position: 'absolute', right: '46px', top: '14px', fontSize: '20px', zIndex: '9999999'}}>
                            <DocumentLink noName={true} name={this.state.notice.name} noticeId={this.state.notice.noticeId} type={this.state.notice.type.toString()} />
                        </div>) : (<></>)}
                        <CodeExample beforeCodeTitle={this.state.notice.name}>
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        { this.state.content == null ? (
                                            <> <div className="md-12" style={{display: "flex", marginBottom: "10px", justifyContent: "center"}}> <CircularProgress className="kt-splash-screen__spinner" /> </div> </>
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
                                                            <h4>Files: </h4>
                                                            <div className="c-df-notice__box">
                                                                <div className="u-displayfield s-row">

                                                                    {
                                                                        this.state.documents.filter(d => d.type === 1).map((d) => {

                                                                            return (
                                                                                <div style={{float: "left", marginBottom: '20px'}}>
                                                                                    {(d.fileName.toLowerCase().indexOf('.p7m') >= 0 || d.fileName.toLowerCase().indexOf('.p7s') >= 0) ? (
                                                                                        <span>
                                                                                            <a target="_blank" style={{marginLeft: '5px'}} href={this.handleGetNoticeDocumentOriginalContentURI(d.id, d.fileName.replace('.p7m', '').replace('.p7s', ''))}>
                                                                                                <FileIcon size="30" extension={d.fileName.split('.')[d.fileName.split('.').length-2]} {...defaultStyles.docx} />
                                                                                            </a>
                                                                                            <a target="_blank" style={{marginLeft: '5px'}} href={this.handleGetNoticeDocumentContentURI(d.id, d.fileName)} download={d.fileName} >
                                                                                               <FileIcon size="30" extension={d.fileName.split('.')[d.fileName.split('.').length-1]} {...defaultStyles.docx} />
                                                                                            </a>
                                                                                            <span> {d.fileName} </span>

                                                                                        </span>
                                                                                        ) : (
                                                                                        <span>

                                                                                            <a  target="_blank" style={{marginLeft: '5px'}}  href={this.handleGetNoticeDocumentContentURI(d.id, d.fileName)}>
                                                                                                <FileIcon size="30" extension={d.fileName.split('.')[d.fileName.split('.').length-1]} {...defaultStyles.docx} />
                                                                                                <span> {d.fileName} </span>
                                                                                            </a>

                                                                                        </span>
                                                                                    )
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

                                                <div className="widget-body " style={{minHeight: "50px"}}>

                                                    <div className="row ng-scope">
                                                        <div className="col-md-12">
                                                            <h4>DUAE Files: </h4>
                                                            <div className="c-df-notice__box">
                                                                <div className="u-displayfield s-row">

                                                                    { this.state.documents.filter(d => d.type === 2).length > 0 ?
                                                                        this.state.documents.filter(d => d.type === 2).map((d) => {

                                                                            return (
                                                                                <div style={{float: "left"}}>

                                                                                    <a target="_blank" href={this.handleGetNoticeDocumentContentURI(d.id, d.fileName)}>
                                                                                        <FileIcon size="30" extension={d.fileName.split('.')[d.fileName.split('.').length-1]} {...defaultStyles.docx} />
                                                                                        <span> {d.fileName} </span>
                                                                                    </a>
                                                                                </div>
                                                                            )
                                                                        }) : <></>
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
                                                to={`/tender/tender-pages/ComparisonDashboardPage?caId=${this.state.notice.contractingAuthority.id}&cpvId=${this.state.notice.cpv.id}&nuts=${this.state.notice.nuts.id}`}>
                                                <Button color="primary">
                                                    Contract Notice Analysis
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

/*
            { this.state.selectedFile != null && this.state.selectedFile.indexOf('.pdf') >= 0 ?
                <div>
                    <PdfViewerComponent id="container" documentPath={'http://84.232.182.107:8080/api/notice-external-documents/notice/content/14879/FisaDate_DF1085086.pdf'} serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"  style={{ 'height': '640px' }}>
                        <Inject services={[Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields]}/>
                    </PdfViewerComponent>
                </div>
                : ''
            }
*/

            </>
        )}
}