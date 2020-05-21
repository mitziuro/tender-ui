import React from "react";
import { Link } from 'react-router-dom';

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {takeOffer, closeOffer, getOffer, declineOffer, uploadTemplate, getTemplateURI} from "../../../../crud/tender/offer.crud";

import {getUserByToken} from "../../../../crud/auth.crud";

import  AlertListingComponent from '../components/AlertListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';

import { toAbsoluteUrl } from "../../../../../_metronic";
import Price from "../utilities/price";
import DateFormat from "../utilities/date.format";

import DocumentLink from "../utilities/document.link";

import Dropzone from 'react-dropzone';
import FileIcon, { defaultStyles } from 'react-file-icon';

import './OfferPage.css';

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
            declineOpen: false, declineReason: null, user:{},
            content: [], contentSelected: {}, contentEditOpen: false,

            chapters: [
                {name: 'Section 1',  chapters: [
                    {name: 'Section 2.1',  chapters: [{name: 'Section 2.1',  chapters: []}]}
                ]},

                {name: 'Section 2',  chapters: [{name: 'Section 1.2',  chapters: [
                {name: 'Section 2.1',  chapters: []}]}]}
            ]
        }

        ;
        this.offerId = this.props.location.search != null && this.props.location.search.split('id=').length == 2 ? this.props.location.search.split('id=')[1] : null;

        this.handleTakeOffer = this.handleTakeOffer.bind(this);
        this.handleCloseOffer = this.handleCloseOffer.bind(this);
        this.uuidv4 = this.uuidv4.bind(this);
        this.applyUuid = this.applyUuid.bind(this);
        this.deleteUuid = this.deleteUuid.bind(this);
        this.addUuid = this.addUuid.bind(this);
        this.editUuid = this.editUuid.bind(this);

        Promise.all([getOffer(this.offerId), getUserByToken()]).then(response => {
            this.setState({offer: response[0].data, user: response[1].data});
        });

        this.handleCloseDecline= this.handleCloseDecline.bind(this);


        this.applyUuid(this.state.chapters);


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

    uuidv4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
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

    handleCloseDecline = () => {
        this.state.offer.declineReason = this.state.declineReason;
        Promise.all([declineOffer(this.offerId, this.state.offer)]).then(response => {
            this.setState({offer: response[0].data});
        });
        this.setState({declineOpen: false, declineReason: null})
    }


    render() {

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
                                            <Button style={{marginLeft: "10px"}} color="primary" type="button">View
                                                Notice</Button>
                                        </Link>
                                        {this.state.offer.state < 3 && this.state.offer.tender.id == this.state.user.id ?
                                            <Button style={{marginLeft: "10px", background: "red", border: "1px solid red"}} onClick={() => this.setState({declineOpen: true})} color="red">
                                                Decline
                                            </Button>
                                            :
                                            <div></div>
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
                            <div className="kt-widget kt-widget--project-1">
                                <div className="kt-widget__head">
                                    <div className="kt-widget__label">
                                        <div className="kt-widget__media">
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

                                                    <div className="row" style={{position: "relative", top:"10px"}}>
                                                        <div className="col-md-3">

                                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Procedure State:</span>
                                                            <strong className="ng-binding ng-scope">In progress</strong>
                                                            <br/>

                                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Type of procurement:</span> <strong className="ng-binding">{offer.notice.online ? 'ONLINE' : 'OFFLINE'}</strong>
                                                            <br/>

                                                            <i sicap-icon="ContractDate" className="fa fa-calendar"></i> Receipt deadline:
                                                            <strong className="ng-binding ng-scope"> <DateFormat value={offer.notice.deadline} /> </strong>

                                                            <div className="ng-scope">
                                                                <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Location: <strong className="ng-binding">{offer.notice.nuts.name ? offer.notice.nuts.name : '-'}</strong>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-3">

                                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Procedure State:</span>
                                                            <strong className="ng-binding ng-scope">In progress</strong>
                                                            <br/>

                                                        </div>
                                                        <div>
                                                            <i sicap-icon="ContractType" className="fa fa-balance-scale"></i>Contract Assigment Type: <strong className="ng-binding">{offer.notice.awardingManner ? offer.notice.awardingManner.nameEn : ''}</strong><br/>

                                                            <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> CPV: <strong className="ng-binding">{offer.notice.cpv ? offer.notice.cpv.nameEn : '-'}</strong><br/>

                                                            <div className="ng-scope">
                                                                <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Contracting authority: <strong className="ng-binding">{offer.notice.contractingAuthority ? offer.notice.contractingAuthority.name : '-'}</strong>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </TableCell>
                                                <TableCell align="left" >

                                                        <div className="col-md-3">
                                                            <div>
                                                                 <TextField className="date" label="Clarification Deadline" type="date"
                                                                            value={this.state.offer.clarificationDeadline}
                                                                            onChange={(e) => {this.state.offer.clarificationDeadline = e.target.value; this.setState({offer: offer})}}
                                                                            InputLabelProps={{shrink: true}}/>
                                                            </div>

                                                            <div>
                                                                 <TextField className="date" label="Contestation Deadline" type="date"
                                                                            value={this.state.offer.contestationDeadline}
                                                                            onChange={(e) => {this.state.offer.contestationDeadline = e.target.value; this.setState({offer: offer})}}
                                                                            InputLabelProps={{shrink: true}}/>
                                                            </div>
                                                        </div>

                                                </TableCell>
                                                <TableCell component="th" scope="row" style={{fontSize: "15px", fontStyle: "italic"}}>
                                                    <Price value={offer.notice.estimatedValue} /> RON
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

            <div className="col-md-12">
                <div className="kt-portlet kt-portlet--height-fluid">
                    <div className="kt-portlet__body kt-portlet__body--fit">
                        <div className="kt-widget kt-widget--project-1">
                            <div className="kt-widget__head">
                                <div className="kt-widget__label">
                                    <div className="kt-widget__media">

                                        {
                                            this.state.chapters.map((chapter, index) => {
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
                                                     <div style={{float: "left", fontSize:'24px'}}>
                                                        <i style={{cursor: 'pointer',marginLeft: '10px', color: "blue"}} class="fa fa-edit" onClick={() => {this.editUuid(chapter.id); this.setState({});}}></i>
                                                        <i style={{cursor: 'pointer',marginLeft: '10px', color: "red"}} class="fa fa-trash" onClick={() => this.setState({chapters: this.deleteUuid(chapter.id, this.state.chapters)})}></i>
                                                        <i style={{cursor: 'pointer',marginLeft: '10px',color: "green"}} class="fa fa-plus" onClick={() => this.setState({chapters: this.addUuid(chapter.id, this.state.chapters)})}></i>
                                                     </div>
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
                                                                        <div style={{float: "left", fontSize:'16px', position:'relative', top: '19px'}}>
                                                                            <i style={{cursor: 'pointer', marginLeft: '10px', color: "blue"}} class="fa fa-edit" onClick={() => {this.editUuid(ch.id); this.setState({});}}></i>
                                                                            <i style={{cursor: 'pointer',marginLeft: '10px', color: "red"}} class="fa fa-trash" onClick={() => this.setState({chapters: this.deleteUuid(ch.id, this.state.chapters)})}></i>
                                                                            <i style={{cursor: 'pointer',marginLeft: '10px',color: "green"}} class="fa fa-plus" onClick={() => this.setState({chapters: this.addUuid(ch.id, this.state.chapters)})}></i>
                                                                         </div>
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
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                        {
                                                                                            ch.chapters.map((c, index) => {
                                                                                        return (



                                                                                                    <TableRow>
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
                                                                                                                            <a target="_blank" href={getTemplateURI(f.fileId, f.fileName)}>
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
                                                                                                        </TableCell>
                                                                                                        <TableCell align="left" ></TableCell>
                                                                                                        <TableCell align="left" ></TableCell>
                                                                                                        <TableCell align="left" ></TableCell>
                                                                                                        <TableCell align="left" ></TableCell>

                                                                                                        <TableCell>
                                                                                                            <div style={{float: "left", fontSize:'14px', position:'relative'}}>
                                                                                                                <i style={{cursor: 'pointer', marginLeft: '10px', color: "blue"}} class="fa fa-edit" onClick={() => {this.editUuid(c.id); this.setState({});}}></i>
                                                                                                                <i style={{cursor: 'pointer',marginLeft: '10px', color: "red"}} class="fa fa-trash" onClick={() => this.setState({chapters: this.deleteUuid(c.id, this.state.chapters)})}></i>
                                                                                                             </div>
                                                                                                        </TableCell>
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

                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                 </div>
            </div>

            </>
        )
    }
}