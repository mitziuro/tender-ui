import React from "react";
import { Link } from 'react-router-dom';

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {takeOffer, getChaptersContent, saveChapters, getSectionURI, saveChaptersContent, getChaptersForOffer, closeOffer, getOffer, saveOffer, declineOffer, uploadTemplate, getTemplateURI, getStructuresSupervisor} from "../../../../crud/tender/offer.crud";
import {uploadFile, getFileURI, getFiles, deleteFile} from "../../../../crud/tender/files.crud";
import {getUserByToken} from "../../../../crud/auth.crud";
import {expertsInternal} from "../../../../crud/tender/user.details.crud";

import  AlertListingComponent from '../components/AlertListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';
import  MessagesListingComponent from '../components/MessagesListingComponent';
import  UserActivityComponent from '../components/UserActivityComponent';

import addNotification from "../../../../widgets/NotificationWidget";

import { toAbsoluteUrl } from "../../../../../_metronic";
import Price from "../utilities/price";
import DateFormat from "../utilities/date.format";

import UserDisplay from "../utilities/user.display";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import DocumentLink from "../utilities/document.link";

import Dropzone from 'react-dropzone';
import FileIcon, { defaultStyles } from 'react-file-icon';

import './OfferPage.css';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {

Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,

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

        this.state = {
            offer: {id: null, notice: {id: null}, tender: {id: null}, clarificationDeadline : null, contestationDeadline: null},
            declineOpen: false, declineReason: null, user:{}, structures: [],
            content: [], contentSelected: {}, contentEditOpen: false, internalExperts : [],
            chapters: [], chaptersData: {}, selectedSection : null, selectedContent: null,
            files: {},

            activeTab: 1
        };

        this.messagesComponent = null;
        this.offerId = this.props.location.search != null && this.props.location.search.split('id=').length == 2 ? this.props.location.search.split('id=')[1] : null;

        this.handleTakeOffer = this.handleTakeOffer.bind(this);
        this.handleCloseOffer = this.handleCloseOffer.bind(this);
        this.handleSaveOffer = this.handleSaveOffer.bind(this);
        this.getStructures = this.getStructures.bind(this);

        this.uuidv4 = this.uuidv4.bind(this);
        this.applyUuid = this.applyUuid.bind(this);
        this.deleteUuid = this.deleteUuid.bind(this);
        this.addUuid = this.addUuid.bind(this);
        this.editUuid = this.editUuid.bind(this);
        this.getExpertsInternal = this.getExpertsInternal.bind(this);
        this.handleCloseDecline = this.handleCloseDecline.bind(this);

        Promise.all([getOffer(this.offerId), getUserByToken()]).then(response => {

            if(response[0].data.chapters != null) {
                this.state.chapters = JSON.parse(response[0].data.chapters);
            } else {
                this.applyUuid(this.state.chapters);
            }

            this.setState({offer: response[0].data, user: response[1].data, chapters: this.state.chapters});
            this.doStuff();

        });


    }

    doStuff = () => {
            this.getStructures();
            this.getExpertsInternal();
            this.getChaptersData();
    }


    getFinalChapters = () => {

        let finalChapters = [];

        this.state.chapters.forEach(s => {
           s.chapters.forEach(c => {
                 c.chapters.forEach(sc => {
                        finalChapters.push(sc);
                 });
           });
        });

        return finalChapters;

    }

    isForExperts = () => {
        return this.getFinalChapters().filter( c => c.assignee == null).length == 0;
    }


    isForExpertsExternal = () => {
        return this.getFinalChapters().filter( c => c.type >= 0).length > 0;
    }

    getStructures = () => {

        if(!(this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id)) {
            return;
        }

        Promise.all([getStructuresSupervisor()]).then(response => {
            this.setState({structures: response[0].data});
        });

    }

    getChaptersData = () => {

        if(this.state.offer.state < 5) {
            return;
        }

        this.state.chaptersData = {};
        Promise.all([getChaptersForOffer(this.state.offer.id)]).then(response => {
             response[0].data.forEach(c => this.state.chaptersData[c.uuid] = c);
             this.setState({chaptersData : this.state.chaptersData});
        })
    }

    getExpertsInternal = () => {
        if(this.state.offer.state != 3 || this.state.offer.tender.id != this.state.user.id) {
            return;
        }

        Promise.all([expertsInternal()]).then(response => {
            this.setState({internalExperts: response[0].data});
        });
    }

    deleteUuid = (uuid: string, chapters) => {

        let ch = chapters.filter(c => c.id == uuid);
        if(ch.length > 0) {
            return chapters.filter(c => c.id != uuid);
        }  else {
            chapters.forEach(c => c.chapters = this.deleteUuid(uuid, c.chapters));
            return chapters
        }

    }

    addUuid = (uuid: string, chapters) => {

        if(uuid == null) {
            chapters.push({name: 'New Section', chapters: [], id: this.uuidv4()});
            return chapters;
        }

        let ch = chapters.filter(c => c.id == uuid);
        if(ch.length > 0) {
            ch[0].chapters.push({name: 'New Chapter', chapters: [], id: this.uuidv4()});
            return chapters;
        }  else {
            chapters.forEach(c => c.chapters = this.addUuid(uuid, c.chapters));
            return chapters;
        }

    }

    editUuid = (uuid: string) => {
        this.setState({selectedEditUuid: uuid});
    }


    applyUuid = (chapters) => {
        chapters.forEach(c => {
            c.id = this.uuidv4();
            this.applyUuid(c.chapters);
        });
    }

    handleSelect = (c) => {

        if(this.state.offer.state < 5) {
            return;
        }

        this.setState({selectedContent: {uuid: c.id, content: ''}});

        Promise.all([getChaptersContent(c.id)]).then(response => {
            this.setState({selectedContent: response[0].data});
        });

        this.setState({selectedSection: c});

    }

    uuidv4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    handleSaveOffer = (state) => {
        this.state.offer.chapters = JSON.stringify(this.state.chapters);
        Promise.all([saveOffer(this.offerId, this.state.offer, state)]).then(response => {
            response[0].data.saveTemplate = null;

            this.setState({offer: response[0].data});

            if(state) {
                addNotification("Success", "The offer has been saved and it went on the next stage", 'success');
            } else {
                addNotification("Success", "The offer has been saved", 'success');
            }

             this.doStuff();

        });
    }

    handleTakeOffer = () => {
        Promise.all([takeOffer(this.offerId)]).then(response => {
            this.setState({offer: response[0].data});

            addNotification("Success", "The offer has been take into work", 'success');
            this.getStructures();

        });
    }

    handleSaveProgress = () => {
         Promise.all([
            saveChapters(this.state.chaptersData[this.state.selectedContent.uuid]),
            saveChaptersContent(this.state.selectedContent)]).then(response => {
                  addNotification("Success", "The offer progress has been saved", 'success');
                  this.setState({});
            });

    }

    handleCloseOffer = () => {
        Promise.all([closeOffer(this.offerId)]).then(response => {
            this.setState({offer: response[0].data});
        });
    }

    handleCloseDecline = () => {
        this.state.offer.declineReason = this.state.declineReason;
        Promise.all([declineOffer(this.offerId, this.state.offer)]).then(response => {
            this.setState({offer: response[0].data});
            addNotification("Success", "The offer has been declined", 'warning');

        });
        this.setState({declineOpen: false, declineReason: null})
    }

    getDays = (date) => {
        if(!date) {
            return 100;
        }

        let days =  parseInt((new Date(date).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000));
        return days > 0 ? days : 0;
    }

    filterChapters = () => {

        if(this.state.offer.tender.id == this.state.user.id) {
             return this.state.chapters;
        }

        if(this.state.offer.supervisor && this.state.offer.supervisor.id == this.state.user.id) {
             return this.state.chapters;
        }

        //TODO
        return this.state.chapters;
    }


    render() {
     console.log(this.state.offer);

 console.log(this.state.chaptersData);

        return (
            <>
            {this.state.offer.id != null ? this._render_big(this.state.offer) : (<></>)}
            {
            }
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="offerResult">
                        <CodeExample beforeCodeTitle="Actions">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                    </div>
                                    <div className="kt-section__content" style={{textAlign: 'center'}}>
                                        {this.state.offer.state == 1 && this.state.user.authorities.indexOf('ROLE_SUPERVISOR') >= 0 ?
                                            <Button style={{marginLeft: "10px", background: 'green'}}  onClick={this.handleTakeOffer} color="primary">
                                                Work on It
                                            </Button>
                                            : <span></span>
                                        }
                                        { this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id
                                          || this.state.offer.state == 3 && this.state.offer.tender.id == this.state.user.id ?
                                            <Button style={{marginLeft: "10px"}}  onClick={() => this.handleSaveOffer()} color="primary"
                                                disabled={this.state.chapters == null || this.state.chapters.length == []}
                                            >
                                                Save Offer
                                            </Button>
                                            : <span></span>
                                        }

                                        { this.state.offer.state == 5 && this.state.selectedSection && this.state.selectedSection.assignee == this.state.user.id ?

                                            <Button style={{marginLeft: "10px"}}  onClick={() => this.handleSaveProgress()} color="primary"

                                            >
                                                Save Progress
                                            </Button>
                                            : <span></span>
                                        }

                                        { this.state.offer.state == 5 && this.state.offer.tender.id == this.state.user.id ?

                                            <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => this.handleSaveOffer(11)} color="primary"
                                                disabled={Object.keys(this.state.chaptersData).filter(k => this.state.chaptersData[k].percentage < 100).length > 0}
                                            >
                                               Close Offer
                                            </Button>
                                            : <span></span>
                                        }

                                        {
                                        this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?
                                            (this.state.offer.clarificationDeadline == null || this.state.offer.contestationDeadline  == null
                                            || this.state.offer.clarificationDeadline.length == 0 || this.state.offer.contestationDeadline.length == 0
                                            || this.state.chapters == null || this.state.chapters.length == [] ?
                                            <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => this.handleSaveOffer(3)} color="primary" disabled>
                                                Send it Back to Tender
                                            </Button>
                                            :
                                            <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => this.handleSaveOffer(3)} color="primary" >
                                                Send it Back to Tender
                                            </Button>)

                                            : <span></span>
                                        }

                                        {
                                        (this.state.offer.state == 3 && this.state.offer.tender.id == this.state.user.id)
                                         ||  (this.state.offer.state == 4 && this.state.offer.tender.id == this.state.user.id)
                                         ?
                                            (!this.isForExperts() ?
                                            <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => this.handleSaveOffer(5)} color="primary" disabled>
                                                Send it to Experts
                                            </Button>
                                            :
                                            <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => this.handleSaveOffer(5)} color="primary" >
                                                 Send it to Experts
                                            </Button>)

                                            : <span></span>
                                        }

                                        {
                                        this.state.offer.state == 3 && this.state.offer.tender.id == this.state.user.id ?
                                            (!this.isForExpertsExternal() ?
                                            <Button style={{marginLeft: "10px", background: 'green'}}  color="primary" disabled>
                                                Request Bid from Experts
                                            </Button>
                                            :
                                            <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => this.handleSaveOffer(4)} color="primary" >
                                                 Request Bid from Experts
                                            </Button>)

                                            : <span></span>
                                        }

                                        <Link
                                            to={`/tender/tender-pages/NoticePage?id=${this.state.offer.notice.id}`}>
                                            <Button style={{marginLeft: "10px"}} color="primary" type="button">View
                                                Notice</Button>
                                        </Link>

                                        {
                                            this.state.offer.state >= 5 ?


                                            <a style={{position: 'relative', left: '6px'}} target="_blank" href={getSectionURI(this.state.offer.id)}>
                                                <FileIcon size="30" extension={'pdf'} {...defaultStyles.docx} />
                                            </a>
                                            :
                                            <span></span>
                                         }

                                        {this.state.offer.state < 10  && this.state.offer.tender.id == this.state.user.id ?
                                            <Button style={{marginLeft: "10px", background: "red", border: "1px solid red"}} onClick={() => this.setState({declineOpen: true})} color="red">
                                                Decline
                                            </Button>
                                            :
                                            <span></span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>
            </div>
            <Dialog
                open={this.state.declineOpen}
                onClose={this.handleCloseDecline}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Alert</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Specify the reason for this decline
                    </DialogContentText>
                    <TextField
                        color="red"
                        autoFocus
                        margin="dense"
                        id="name"
                        value={this.state.declineReason}
                        onChange={(e) => this.setState({declineReason: e.target.value})}
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <p style={{fontSize: "10px", position: 'absolute', left: '22px', float: 'left', display : this.state.showErrors == true && (this.state.alertName == null || this.state.alertName.length === 0) ? 'block' : 'none', color: 'red'}}>
                        The name must not be null
                    </p>
                </DialogContent>
                <DialogActions>

                    <Button onClick={() => this.setState({declineOpen: false})} color="primary">
                        Cancel
                    </Button>
                    <Button style={{background: 'green'}} onClick={this.handleCloseDecline} color="primary">
                        <i className="fa fa-save"> </i> Decline
                    </Button>
                </DialogActions>
            </Dialog>
            </>

        )
    }

    _render_big(offer) {
        return (
            <>

            <div className="row">
                 <div className="col-md-12">
                    <div className="kt-portlet kt-portlet--height-fluid">
                        <div className="kt-portlet__body kt-portlet__body--fit">
                            <div style={{float:'right', display: 'flex', position: 'absolute', right: '20px'}}>
                                {
                                    this.getDays(this.state.offer.contestationDeadline) <=10 && this.state.offer.state < 10 ?
                                    <div style={{padding: '10px', marginRight: "20px", borderRadius: "0px 0px 10px 10px",
                                        background: this.getDays(this.state.offer.contestationDeadline) <= 5 ? 'red' : 'yellow',
                                        color: this.getDays(this.state.offer.contestationDeadline) <= 5 ? 'white' : 'black'
                                    }}>
                                        Days to contestation deadline: {this.getDays(this.state.offer.contestationDeadline)}
                                    </div>
                                    : <span></span>
                                }
                                {
                                    this.getDays(this.state.offer.clarificationDeadline) <=10 && this.state.offer.state < 10  ?
                                    <div style={{padding: '10px', marginRight: "20px", borderRadius: "0px 0px 10px 10px",
                                        background: this.getDays(this.state.offer.clarificationDeadline) <= 5 ? 'red' : 'yellow',
                                        color: this.getDays(this.state.offer.clarificationDeadline) <= 5 ? 'white' : 'black'
                                    }}>
                                        Days to clarification deadline: {this.getDays(this.state.offer.clarificationDeadline)}
                                    </div>
                                    : <span></span>
                                }
                            </div>
                            <div className="kt-widget kt-widget--project-1">
                                <div className="kt-widget__head">
                                    <div className="kt-widget__label">
                                        <div className="kt-widget__media offer_header">
                                             <TableRow key={offer.notice.id}>
                                                <TableCell component="th" scope="row">
                                                    {offer.notice.number} <br/>
                                                    <DateFormat value={offer.notice.publicationDate} />
                                                </TableCell>
                                                <TableCell align="left" >

                                                    <b style={{fontSize:"15px"}}>
                                                         <Link
                                                            to={`/tender/tender-pages/NoticePage?id=${offer.notice.id}`}>
                                                            {offer.notice.name}

                                                        </Link>
                                                        <DocumentLink noName={true} name={offer.notice.name} noticeId={offer.notice.noticeId} type={offer.notice.type.toString()} />

                                                    </b>

                                                    <div class="row" style={{position: "relative", top:"10px"}}>
                                                        <div className="col-md-4">

                                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i>  <span>Procedure State:</span>  &nbsp;
                                                            <strong className="ng-binding ng-scope">In progress</strong>
                                                            <br/>

                                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i>
                                                              <span>Type of procurement:</span>  &nbsp; <strong className="ng-binding">{offer.notice.online ? 'ONLINE' : 'OFFLINE'}</strong>
                                                            <br/>

                                                            <i sicap-icon="ContractDate" className="fa fa-calendar"></i> Receipt deadline:
                                                            <strong className="ng-binding ng-scope"> <DateFormat value={offer.notice.deadline} /> </strong>



                                                        </div>
                                                        <div className="col-md-4">

                                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i>  <span>Procedure State:</span>  &nbsp;
                                                            <strong className="ng-binding ng-scope">In progress</strong>
                                                            <br/>

                                                              <div className="ng-scope">
                                                                  <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Location: <strong className="ng-binding">{offer.notice.nuts.name ? offer.notice.nuts.name : '-'}</strong>
                                                              </div>

                                                        </div>
                                                        <div className="col-md-4">
                                                            <i sicap-icon="ContractType" className="fa fa-balance-scale"></i>  Contract Assigment Type:  &nbsp; <strong className="ng-binding">{offer.notice.awardingManner ? offer.notice.awardingManner.nameEn : ''}</strong><br/>

                                                            <i sicap-icon="CPVCode" className="fa fa-sitemap"></i>  CPV:  &nbsp; <strong className="ng-binding">{offer.notice.cpv ? offer.notice.cpv.nameEn : '-'}</strong><br/>

                                                            <div className="ng-scope">
                                                                <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i>  Contracting authority:  &nbsp; <strong className="ng-binding">{offer.notice.contractingAuthority ? offer.notice.contractingAuthority.name : '-'}</strong>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </TableCell>
                                                {
                                                    this.state.offer.state > 1 ?
                                                    <TableCell align="left" >

                                                            <div className="col-md-12">
                                                                <div>

                                                                     {
                                                                        this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?

                                                                             <TextField className="date" label="Clarification Deadline" type="date" required
                                                                                        value={this.state.offer.clarificationDeadline}
                                                                                        onChange={(e) => {this.state.offer.clarificationDeadline = e.target.value; this.setState({offer: offer})}}
                                                                                        InputLabelProps={{shrink: true}}/>
                                                                        :   <div>
                                                                                <i sicap-icon="ContractDate" className="fa fa-calendar"></i>  Clarification deadline:  &nbsp;
                                                                                     <strong className="ng-binding ng-scope">
                                                                                        <DateFormat value={this.state.offer.clarificationDeadline} />
                                                                                     </strong>
                                                                            </div>
                                                                     }
                                                                </div>

                                                                <div>
                                                                     {
                                                                      this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?

                                                                         <TextField className="date" label="Contestation Deadline" type="date" required
                                                                                    value={this.state.offer.contestationDeadline}
                                                                                    onChange={(e) => {this.state.offer.contestationDeadline = e.target.value; this.setState({offer: offer})}}
                                                                                    InputLabelProps={{shrink: true}}/>
                                                                       :   <div>
                                                                          <i sicap-icon="ContractDate" className="fa fa-calendar"></i> Contestation deadline:  &nbsp;
                                                                               <strong className="ng-binding ng-scope">
                                                                                  <DateFormat value={this.state.offer.contestationDeadline} />
                                                                               </strong>
                                                                      </div>

                                                                      }
                                                                </div>
                                                            </div>

                                                    </TableCell> : <TableCell align="left"></TableCell>
                                                }
                                                <TableCell component="th" scope="row" style={{fontSize: "15px", fontStyle: "italic"}}>
                                                    <Price value={offer.notice.estimatedValue} /> RON
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                    <div>
                                                        <span style={{position: 'relative', left: '29px'}} >
                                                            <i sicap-icon="ContractingAuthority" className="fa fa-user"></i>
                                                            &nbsp; Tender &nbsp;
                                                        </span>
                                                        <div style={{display: 'flex'}}>
                                                            <div>
                                                                <UserDisplay id={this.state.offer.tender.id} />
                                                            </div>
                                                            <div>
                                                                 <a href="#post">
                                                                    <i class="fa fa-envelope" onClick={() => {this.messagesComponent.setTo(this.state.offer.tender.id); this.setState({activeTab : 5}); }}></i>
                                                                 </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        this.state.offer.supervisor ?
                                                            <div>
                                                                <span style={{position: 'relative', left: '29px'}} >
                                                                    <i sicap-icon="ContractingAuthority" className="fa fa-user"></i>
                                                                    &nbsp; Supervisor &nbsp;
                                                                </span>
                                                                 <div style={{display: 'flex'}}>
                                                                    <div>
                                                                        <UserDisplay id={this.state.offer.supervisor.id} />
                                                                    </div>
                                                                    <div>
                                                                         <a href="#post">
                                                                            <i class="fa fa-envelope" onClick={() => {this.messagesComponent.setTo(this.state.offer.supervisor.id); this.setState({activeTab : 5}); }}></i>
                                                                         </a>
                                                                    </div>
                                                                </div>

                                                            </div> :
                                                            <span></span>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabs" style={{display: 'flex'}}>
                <div onClick={() => this.setState({activeTab: 2})} style={{background: this.state.activeTab == 2 ? 'white' : ''}} className="tab">Partnerships</div>
                <div onClick={() => this.setState({activeTab: 3})} style={{background: this.state.activeTab == 3 ? 'white' : ''}} className="tab">External attributions</div>
                <div onClick={() => this.setState({activeTab: 1})} style={{background: this.state.activeTab == 1 ? 'white' : ''}} className="tab">Offer Content</div>
                <div onClick={() => this.setState({activeTab: 4})} style={{background: this.state.activeTab == 4 ? 'white' : ''}} className="tab">Alerts</div>
                <div onClick={() => this.setState({activeTab: 5})} style={{background: this.state.activeTab == 5 ? 'white' : ''}} className="tab">Messages</div>
            </div>


            { (this.state.offer.state <= 1 && this.state.activeTab == 1) ||
                    (this.state.activeTab != 1 && this.state.activeTab != 5 && this.state.activeTab != 4) ?
                <div className="col-md-12">
                    <div className="kt-portlet kt-portlet--height-fluid">
                        <div className="kt-portlet__body kt-portlet__body--fit">
                            <div className="kt-widget kt-widget--project-1">
                                <div className="kt-widget__head">
                                    <div className="kt-widget__label" style={{width: '100%'}}>
                                        <div className="kt-widget__media" style={{width: '100%'}}>
                                            <div style={{textAlign: 'center', position: 'relative', top: '22px'}}><i>No Results</i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                : <span></span>
            }


            <div className="col-md-12" style={{display: this.state.activeTab == 5 ? '' : 'none'}}>
                <div className="kt-portlet kt-portlet--height-fluid">
                    <div className="kt-portlet__body kt-portlet__body--fit">
                        <div className="kt-widget kt-widget--project-1">
                            <div className="kt-widget__head">
                                <div className="kt-widget__label" style={{width: '100%'}}>
                                    <div className="kt-widget__media" style={{width: '100%'}}>
                                        <MessagesListingComponent onRef={ref => {this.messagesComponent = ref;}} offer={this.state.offer.id}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




              { (this.state.activeTab == 4) ?
                                 <div className="col-md-12">
                                     <div className="kt-portlet kt-portlet--height-fluid">
                                         <div className="kt-portlet__body kt-portlet__body--fit">
                                             <div className="kt-widget kt-widget--project-1">
                                                 <div className="kt-widget__head">
                                                     <div className="kt-widget__label" style={{width: '100%'}}>
                                                         <div className="kt-widget__media" style={{width: '100%'}}>
                                                             <UserActivityComponent offer={this.state.offer.id}/>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>

                                 : <span></span>
                  }

            { this.state.offer.state > 1  && this.state.activeTab == 1 ?

            <div className="col-md-12">
                <div className="kt-portlet kt-portlet--height-fluid">
                    <div className="kt-portlet__body kt-portlet__body--fit">
                        <div className="kt-widget kt-widget--project-1">
                            <div className="kt-widget__head">
                                <div className="kt-widget__label" style={{width: '100%'}}>
                                    <div className="kt-widget__media" style={{width: '100%'}}>

                                        {
                                            this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?

                                                <>
                                                <i style={{marginLeft: '20px', cursor: 'pointer',fontSize: '24px',color: "green", float: "right"}} class="fa fa-plus-circle" onClick={() => this.setState({chapters: this.addUuid(null, this.state.chapters)})}></i>


                                                    <div style={{float: 'right'}}>
                                                        <Select style={{width: '100%', position: 'relative'}}
                                                                                onChange={(e) => {
                                                                                    this.state.chapters = JSON.parse(this.state.structures.filter(s => s.id == e.target.value)[0].content);
                                                                                    this.applyUuid(this.state.chapters);
                                                                                    this.setState({chapters: this.state.chapters});
                                                                                }}
                                                                                inputProps={{
                                                            name: "structures",
                                                            id: "structures"
                                                        }}
                                                        >

                                                           {
                                                                this.state.structures.map(e => (
                                                                    <MenuItem value={e.id}>{e.name}</MenuItem>
                                                                    )
                                                                )

                                                            }
                                                        </Select>

                                                    </div>
                                                 </>


                                            : <div></div>
                                        }

                                        {
                                            this.filterChapters().map((chapter, index) => {
                                               return (
                                                  <div style={{marginTop: '40px'}}>
                                                     {

                                                            this.state.selectedEditUuid  == null || this.state.selectedEditUuid != chapter.id ?
                                                            (<h1 style={{float: "left"}} >{chapter.name}</h1>) :
                                                            <div style={{float: "left"}}>
                                                                <TextField label="Name"
                                                                      value={chapter.name}
                                                                      onChange={(e) => { chapter.name = e.target.value; this.setState({});}}
                                                                      onBlur={(e) => {  this.editUuid(null); this.setState({});}}
                                                                      margin="normal"/>
                                                            </div>

                                                     }
                                                     {
                                                        this.state.offer.state >= 5 ?


                                                        <a style={{position: 'relative', left: '6px', top: '6px'}} target="_blank" href={getSectionURI(this.state.offer.id, chapter.id)}>
                                                            <FileIcon size="25" extension={'pdf'} {...defaultStyles.docx} />
                                                        </a>
                                                        :
                                                        <span></span>
                                                     }
                                                     {
                                                        this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?
                                                             <div style={{float: "left", fontSize:'24px'}}>
                                                                <i style={{cursor: 'pointer',marginLeft: '10px', color: "blue"}} class="fa fa-edit" onClick={() => {this.editUuid(chapter.id); this.setState({});}}></i>
                                                                <i style={{cursor: 'pointer',marginLeft: '10px', color: "red"}} class="fa fa-trash" onClick={() => this.setState({chapters: this.deleteUuid(chapter.id, this.state.chapters)})}></i>
                                                                <i style={{cursor: 'pointer',marginLeft: '10px',color: "green"}} class="fa fa-plus" onClick={() => this.setState({chapters: this.addUuid(chapter.id, this.state.chapters)})}></i>
                                                             </div>

                                                        : <div></div>
                                                     }
                                                       <br/><br/><br/>

                                                       {
                                                           chapter.chapters.map((ch, index) => {
                                                                return (
                                                                    <div style={{marginLeft: '20px'}} >
                                                                         {

                                                                                this.state.selectedEditUuid  == null || this.state.selectedEditUuid != ch.id ?
                                                                                (<h3 style={{float: "left"}} >{ch.name}</h3>) :
                                                                                 <div style={{float: "left"}}>
                                                                                    <TextField label="Name"
                                                                                      value={ch.name}
                                                                                      onChange={(e) => { ch.name = e.target.value; this.setState({});}}
                                                                                      onBlur={(e) => {  this.editUuid(null); this.setState({});}}
                                                                                      margin="normal"/>
                                                                                 </div>


                                                                         }
                                                                        {
                                                                            this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?
                                                                                <div style={{float: "left", fontSize:'16px', position:'relative', top: '19px'}}>
                                                                                    <i style={{cursor: 'pointer', marginLeft: '10px', color: "blue"}} class="fa fa-edit" onClick={() => {this.editUuid(ch.id); this.setState({});}}></i>
                                                                                    <i style={{cursor: 'pointer',marginLeft: '10px', color: "red"}} class="fa fa-trash" onClick={() => this.setState({chapters: this.deleteUuid(ch.id, this.state.chapters)})}></i>
                                                                                    <i style={{cursor: 'pointer',marginLeft: '10px',color: "green"}} class="fa fa-plus" onClick={() => this.setState({chapters: this.addUuid(ch.id, this.state.chapters)})}></i>
                                                                                 </div>
                                                                            : <div></div>
                                                                        }
                                                                         <br/><br/><br/>

                                                                            <div style={{marginLeft: '40px'}}>
                                                                                <Table >
                                                                                    <TableHead>
                                                                                        <TableRow>
                                                                                            <TableCell>
                                                                                               Subchapter
                                                                                            </TableCell>
                                                                                            <TableCell align="left">
                                                                                                Template File
                                                                                            </TableCell>
                                                                                            <TableCell align="left">
                                                                                                Uploaded File
                                                                                            </TableCell>
                                                                                            <TableCell align="left">
                                                                                                Expert Type
                                                                                            </TableCell>
                                                                                            <TableCell align="left">
                                                                                                Expert Name
                                                                                            </TableCell>
                                                                                            <TableCell align="left">
                                                                                                Status
                                                                                            </TableCell>
                                                                                            {
                                                                                            this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?
                                                                                                 <TableCell align="left">
                                                                                                    Actions
                                                                                                </TableCell>
                                                                                                :<div></div>

                                                                                            }
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                        {
                                                                                            ch.chapters.map((c, index) => {

                                                                                                if(!this.state.files[c.id]) {
                                                                                                    Promise.all([getFiles(this.state.offer.id, c.id)]).then(response => {

                                                                                                        this.state.files[c.id] = response[0].data;
                                                                                                        this.setState({});
                                                                                                    });
                                                                                                }

                                                                                        return (

                                                                                                    <TableRow key={c.id} onClick={() => this.handleSelect(c)} style={{background: this.state.selectedSection && this.state.selectedSection.id == c.id ? 'lightgray' : ''}}>
                                                                                                        <TableCell component="th" scope="row">
                                                                                                           {

                                                                                                                   this.state.selectedEditUuid  == null || this.state.selectedEditUuid != c.id ?
                                                                                                                   (<span style={{float: "left"}} >{c.name}</span>) :
                                                                                                                    <div style={{float: "left"}}>
                                                                                                                       <TextField label="Name"
                                                                                                                         value={c.name}
                                                                                                                         onChange={(e) => { c.name = e.target.value; this.setState({});}}
                                                                                                                         onBlur={(e) => {  this.editUuid(null); this.setState({});}}
                                                                                                                         margin="normal"/>
                                                                                                                    </div>


                                                                                                            }
                                                                                                        </TableCell>
                                                                                                        <TableCell align="left" >
                                                                                                             {
                                                                                                             this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?

                                                                                                                    <Dropzone onDrop={acceptedFiles => {

                                                                                                                                acceptedFiles.forEach(f => {
                                                                                                                                    var formData = new FormData();
                                                                                                                                    formData.append("file", f);
                                                                                                                                    Promise.all([uploadTemplate(formData)]).then(response => {
                                                                                                                                        if(c.files == null) {
                                                                                                                                            c.files = [];
                                                                                                                                        }
                                                                                                                                        c.files.push({fileId: response[0].data, fileName: f.name});
                                                                                                                                        this.setState({});
                                                                                                                                    });
                                                                                                                                });


                                                                                                                          }}>
                                                                                                                      {({getRootProps, getInputProps}) => (
                                                                                                                        <section>
                                                                                                                          <div {...getRootProps()}>
                                                                                                                            <input {...getInputProps()} />
                                                                                                                            <p style={{color: 'gray'}}><i>Drag 'n' drop some files here, or click to select files</i></p>
                                                                                                                          </div>
                                                                                                                          {
                                                                                                                            c.files != null ?
                                                                                                                            c.files.map((f, index) => {
                                                                                                                                return (
                                                                                                                                <>
                                                                                                                                    <a style={{marginRight: '20px'}}  target="_blank" href={getTemplateURI(f.fileId, f.fileName)}>
                                                                                                                                        <FileIcon size="25" extension={f.fileName.split('.')[f.fileName.split('.').length-1]} {...defaultStyles.docx} /> {f.fileName}
                                                                                                                                    </a>
                                                                                                                                    <i onClick={() => {c.files = c.files.filter(e => e.fileId != f.fileId); this.setState({});}} class="fa fa-trash" style={{color:'red', cursor: 'pointer', marginLeft: '5px'}}></i>
                                                                                                                                </>
                                                                                                                                );
                                                                                                                            }) : <></>

                                                                                                                          }

                                                                                                                        </section>
                                                                                                                      )}
                                                                                                                    </Dropzone>
                                                                                                                    : <div>
                                                                                                                            {
                                                                                                                            c.files != null ?
                                                                                                                            c.files.map((f, index) => {
                                                                                                                                return (
                                                                                                                                <>
                                                                                                                                    <a style={{marginRight: '20px'}} target="_blank" href={getTemplateURI(f.fileId, f.fileName)}>
                                                                                                                                        <FileIcon size="25" extension={f.fileName.split('.')[f.fileName.split('.').length-1]} {...defaultStyles.docx} /> {f.fileName}
                                                                                                                                    </a>
                                                                                                                                </>
                                                                                                                                );
                                                                                                                            }) : <></>

                                                                                                                          }
                                                                                                                    </div>
                                                                                                              }
                                                                                                        </TableCell>
                                                                                                        <TableCell align="left" >
                                                {
                                                                                                             this.state.selectedSection && this.state.offer.state == 5 && this.state.selectedSection.assignee == this.state.user.id ?

                                                                                                                    <Dropzone onDrop={acceptedFiles => {

                                                                                                                                acceptedFiles.forEach(f => {
                                                                                                                                    var formData = new FormData();
                                                                                                                                    formData.append("file", f);
                                                                                                                                    Promise.all([uploadFile(this.state.offer.id, c.id, formData)]).then(response => {
                                                                                                                                        if(this.state.files[c.id] == null) {
                                                                                                                                            this.state.files[c.id] = [];
                                                                                                                                        }
                                                                                                                                        this.state.files[c.id].push(f.name);
                                                                                                                                        this.setState({});
                                                                                                                                    });
                                                                                                                                });


                                                                                                                          }}>
                                                                                                                      {({getRootProps, getInputProps}) => (
                                                                                                                        <section>
                                                                                                                          <div {...getRootProps()}>
                                                                                                                            <input {...getInputProps()} />
                                                                                                                            <p style={{color: 'black'}}><i>Drag 'n' drop some files here, or click to select files</i></p>
                                                                                                                          </div>
                                                                                                                          {
                                                                                                                            this.state.files[c.id] != null ?
                                                                                                                            this.state.files[c.id].map((f, index) => {
                                                                                                                                return (
                                                                                                                                <>
                                                                                                                                    <a  style={{marginRight: '20px'}} target="_blank" href={getFileURI(this.state.offer.id, c.id, f)}>
                                                                                                                                        <FileIcon size="25" extension={f.split('.')[f.split('.').length-1]} {...defaultStyles.docx} /> {f}
                                                                                                                                    </a>
                                                                                                                                    <i onClick={() => {deleteFile(this.state.offer.id, c.id, f); this.state.files[c.id] = this.state.files[c.id].filter(e => e != f); this.setState({});}} class="fa fa-trash" style={{color:'red', cursor: 'pointer', marginLeft: '5px'}}></i>
                                                                                                                                </>
                                                                                                                                );
                                                                                                                            }) : <></>

                                                                                                                          }

                                                                                                                        </section>
                                                                                                                      )}
                                                                                                                    </Dropzone>
                                                                                                                    : <div>
                                                                                                                            {
                                                                                                                            this.state.files[c.id] != null ?
                                                                                                                            this.state.files[c.id].map((f, index) => {
                                                                                                                                return (
                                                                                                                                <>
                                                                                                                                    <a style={{marginRight: '20px'}} target="_blank" href={getFileURI(this.state.offer.id, c.id, f)}>
                                                                                                                                        <FileIcon size="25" extension={f.split('.')[f.split('.').length-1]} {...defaultStyles.docx} /> {f}
                                                                                                                                    </a>
                                                                                                                                </>
                                                                                                                                );
                                                                                                                            }) : <></>

                                                                                                                          }
                                                                                                                    </div>
                                                                                                              }
                                                                                                        </TableCell>
                                                                                                        <TableCell align="left" >
                                                                                                            {
                                                                                                               this.state.offer.state == 3 && this.state.offer.tender.id == this.state.user.id ?
                                                                                                                   <div>
                                                                                                                        <Select style={{minWidth: '50px', width: '100%', position: 'relative'}}
                                                                                                                                                value={c.type}
                                                                                                                                                onChange={(e) => {
                                                                                                                                                  c.type = e.target.value;
                                                                                                                                                  c.assignee = null;
                                                                                                                                                  this.setState({});
                                                                                                                                                }}
                                                                                                                                                inputProps={{
                                                                                                                            name: "user-type",
                                                                                                                            id: "user-type"
                                                                                                                        }}
                                                                                                                        >

                                                                                                                                <MenuItem value="-1">
                                                                                                                                    <em>Internal</em>
                                                                                                                                </MenuItem>
                                                                                                                                <MenuItem value="1">
                                                                                                                                    <em>Technical Expert</em>
                                                                                                                                </MenuItem>
                                                                                                                                <MenuItem value="2">
                                                                                                                                    <em>Public Acquisitions Expert</em>
                                                                                                                                </MenuItem>

                                                                                                                        </Select>


                                                                                                                   </div>
                                                                                                               : <div>
                                                                                                                    {
                                                                                                                        c.type == -1 ? 'Internal' : ''
                                                                                                                    }
                                                                                                                </div>
                                                                                                            }
                                                                                                        </TableCell>

                                                                                                        <TableCell align="left" >
                                                                                                            {
                                                                                                               this.state.offer.state == 3 && this.state.offer.tender.id == this.state.user.id  && c.type == -1 ?
                                                                                                                   <div>
                                                                                                                        <Select style={{minWidth: '100px', width: '100%', position: 'relative'}}
                                                                                                                                                value={c.assignee}
                                                                                                                                                onChange={(e) => {
                                                                                                                                                  c.assignee = e.target.value;
                                                                                                                                                  this.setState({});
                                                                                                                                                }}
                                                                                                                                                inputProps={{
                                                                                                                            name: "user-type",
                                                                                                                            id: "user-type"
                                                                                                                        }}
                                                                                                                        >

                                                                                                                                {
                                                                                                                                    this.state.internalExperts.map(e => (
                                                                                                                                            <MenuItem value={e.id}>{e.firstName} {e.lastName} &lt; {e.login} &gt;</MenuItem>
                                                                                                                                        )
                                                                                                                                    )

                                                                                                                                }

                                                                                                                        </Select>
                                                                                                                   </div>
                                                                                                               : <div>
                                                                                                                {
                                                                                                                   c.assignee ?

                                                                                                                     <div style={{display: 'flex'}}>
                                                                                                                        <div>
                                                                                                                            <UserDisplay id={c.assignee} />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                             <a href="#post">
                                                                                                                                <i class="fa fa-envelope" onClick={() => {this.messagesComponent.setTo(c.assignee); this.setState({activeTab : 5}); }}></i>
                                                                                                                             </a>
                                                                                                                        </div>
                                                                                                                    </div>



                                                                                                                    : ''
                                                                                                                }
                                                                                                                </div>
                                                                                                            }
                                                                                                        </TableCell>
                                                                                                        <TableCell align="left" >
                                                                                                            { this.state.chaptersData[c.id] != null ? <div style={{height: '31px', width: '37px'}}> <CircularProgressbar styles={buildStyles({textSize: '32px'})} value={this.state.chaptersData[c.id].percentage} text={this.state.chaptersData[c.id].percentage + '%'} /> </div>   : ''}

                                                                                                        </TableCell>

                                                                                                        {
                                                                                                            this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?
                                                                                                                <TableCell>
                                                                                                                    <div style={{float: "left", fontSize:'14px', position:'relative'}}>
                                                                                                                        <i style={{cursor: 'pointer', marginLeft: '10px', color: "blue"}} class="fa fa-edit" onClick={() => {this.editUuid(c.id); this.setState({});}}></i>
                                                                                                                        <i style={{cursor: 'pointer',marginLeft: '10px', color: "red"}} class="fa fa-trash" onClick={() => this.setState({chapters: this.deleteUuid(c.id, this.state.chapters)})}></i>
                                                                                                                     </div>
                                                                                                                </TableCell>
                                                                                                            : <div></div>
                                                                                                        }
                                                                                                     </TableRow>


                                                                                        )})

                                                                                    }
                                                                                </Table>
                                                                          </div>
                                                                    </div>
                                                                    )
                                                            })
                                                        }
                                                  </div>
                                               )
                                            })
                                        }

                                         {
                                            this.state.offer.state == 2 && this.state.offer.supervisor.id == this.state.user.id ?
                                                <div className="col-md-12" style={{marginTop: '30px'}}>
                                                                    <FormControlLabel control={
                                                                        <Checkbox
                                                                  checked={this.state.offer.saveTemplate}
                                                                  onChange={(e) => {this.state.offer.saveTemplate = e.target.checked; this.setState({offer: this.state.offer});}}
                                                                  value={this.state.offer.saveTemplate}
                                                                  color="primary"
                                                                    />
                                                              } label="Make this responsability matrix template"/>

                                                              {
                                                                  this.state.offer.saveTemplate ?

                                                                      <TextField label="Responsability matrix name"
                                                                         value={this.state.offer.name}
                                                                         onChange={(e) => {this.state.offer.name  = e.target.value;this.setState({offer: this.state.offer});}}
                                                                         margin="normal"/>
                                                                  : <div></div>
                                                              }
                                                    </div>
                                            : <div></div>
                                        }

                                        {
                                            this.state.selectedSection ?
                                                this.state.offer.state == 5 && this.state.selectedSection.assignee == this.state.user.id ?

                                                <div>
                                                    <div className="Editor">

                                                        <div style={{display: 'flex'}}>
                                                            <h2>{this.state.selectedSection.name}</h2>

                                                            <div>
                                                                <span style={{position: 'relative', top: '20px', left: '10px'}}> Progress &nbsp; </span>
                                                                <Select style={{width: '80px', position: 'relative', top: '20px', left: '10px'}}
                                                                                    value={this.state.chaptersData[this.state.selectedContent.uuid].percentage}
                                                                                    onChange={(e) => {
                                                                                       this.state.chaptersData[this.state.selectedContent.uuid].percentage = e.target.value;
                                                                                       this.setState({chaptersData: this.state.chaptersData});
                                                                                    }}
                                                                                    inputProps={{
                                                                name: "progress",
                                                                id: "progress"
                                                                }}
                                                                >

                                                                   {
                                                                        Array.from(Array(11).keys()).map(e => (
                                                                            <MenuItem value={e*10}>{e*10}</MenuItem>
                                                                            )
                                                                        )

                                                                    }
                                                                </Select>

                                                                <span style={{position: 'relative', top: '20px', left: '10px'}}> &nbsp; % </span>
                                                             </div>
                                                         </div>

                                                        <CKEditor
                                                            editor={ ClassicEditor }
                                                            data={this.state.selectedContent.content}
                                                            onInit={ editor => {
                                                                // You can store the "editor" and use when it is needed.
                                                                console.log( 'Editor is ready to use!', editor );
                                                            } }
                                                            onChange={ ( event, editor ) => {
                                                                const data = editor.getData();
                                                                this.state.selectedContent.content = data;
                                                                console.log( { event, editor, data } );
                                                            } }
                                                            onBlur={ ( event, editor ) => {
                                                                console.log( 'Blur.', editor );
                                                            } }
                                                            onFocus={ ( event, editor ) => {
                                                                console.log( 'Focus.', editor );
                                                            } }
                                                        />
                                                    </div>
                                                </div> :
                                                <div>
                                                    <div className="Editor">
                                                    <h2>{this.state.selectedSection.name}</h2>
                                                    <CKEditor disabled="true"
                                                        editor={ ClassicEditor }
                                                        data={this.state.selectedContent.content}
                                                        onInit={ editor => {
                                                            // You can store the "editor" and use when it is needed.
                                                            console.log( 'Editor is ready to use!', editor );
                                                        } }
                                                        onChange={ ( event, editor ) => {
                                                            const data = editor.getData();
                                                            console.log( { event, editor, data } );
                                                        } }
                                                        onBlur={ ( event, editor ) => {
                                                            console.log( 'Blur.', editor );
                                                        } }
                                                        onFocus={ ( event, editor ) => {
                                                            console.log( 'Focus.', editor );
                                                        } }
                                                    />
                                                  </div>
                                                 </div>

                                             : <span></span>
                                        }

                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                 </div>
            </div> : <div></div>
            }

            </>
        )
    }
}