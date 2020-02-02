import React from "react";
import { Link } from 'react-router-dom';

import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {takeOffer, closeOffer, getOffer, declineOffer} from "../../../../crud/tender/offer.crud";

import {getUserByToken} from "../../../../crud/auth.crud";

import  AlertListingComponent from '../components/AlertListingComponent';
import  NoticeListingComponent from '../components/NoticeListingComponent';

import { toAbsoluteUrl } from "../../../../../_metronic";
import Price from "../utilities/price";
import DateFormat from "../utilities/date.format";

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


        this.state = {
            offer: {id: null, notice: {id: null}, tender: {id: null}},
            declineOpen: false, declineReason: null, user:{},
            content: [], contentSelected: {}, contentEditOpen: false
        }

        ;
        this.offerId = this.props.location.search != null && this.props.location.search.split('id=').length == 2 ? this.props.location.search.split('id=')[1] : null;

        this.handleTakeOffer = this.handleTakeOffer.bind(this);
        this.handleCloseOffer = this.handleCloseOffer.bind(this);

        Promise.all([getOffer(this.offerId), getUserByToken()]).then(response => {
            this.setState({offer: response[0].data, user: response[1].data});
        });

        this.handleCloseDecline= this.handleCloseDecline.bind(this);


        this.handleContentAddSection = this.handleContentAddSection.bind(this);


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
               // this._render_offer_content()
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

    handleContentAddSection = () => {
        this.state.content.push({chapters: [{}]});
        this.setState({content: this.state.content});
    }


    _render_table_structure_component() {
        return (

            <>
            <div className="row contentTable">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <Button onClick={this.handleContentAddSection} style={{marginLeft: "10px"}} color="primary"
                            type="button">
                        Add Section
                    </Button>
                </div>
                <div className="col-md-12" style={{display: 'flex'}}>
                    <table>
                        <tr>

                            <th>Section</th>
                            <th>Chapter</th>
                            <th>Description</th>
                            <th>Files</th>
                        </tr>
                        { this.state.content.map((section, index1) => {
                            return (<>
                            {section.chapters.map((chapter, index2) => {
                                return (
                                    <tr>
                                        { index2 == 0 ? (<td rowSpan={section.chapters.length}>
                                            <div className="col-md-12" style={{display: "flex"}}>
                                                <div className="col-md-10" style={{}}>
                                                    {section.name}
                                                </div>
                                                <div className="col-md-2" style={{}}>
                                                    { index1 != 0 ?( <i className="fa fa-arrow-up"
                                                       onClick={() => { var index = this.state.content.indexOf(section); this.state.content[index] = this.state.content[index-1];  this.state.content[index-1] = section;  this.setState({content: this.state.content});}}></i>
                                                        ) :(<></>)
                                                    }
                                                    <i className="fa fa-edit"
                                                       onClick={() => {this.setState({contentSelected: section, contentEditOpen : true}); }}></i>
                                                    <i className="fa fa-trash"
                                                       onClick={() => this.setState({content: this.state.content.filter(s => s != section)})}></i>

                                                </div>
                                            </div>
                                        </td>) : (<></>)
                                        }

                                        <td>
                                            <div className="col-md-12" style={{display: "flex"}}>
                                                <div className="col-md-10" style={{}}>
                                                    {chapter.name}
                                                </div>
                                                <div className="col-md-2" style={{}}>
                                                    { index2 != 0 ?( <i className="fa fa-arrow-up"
                                                                        onClick={() => { var index = section.chapters.indexOf(chapter); section.chapters[index] = section.chapters[index-1];  section.chapters[index-1] = chapter;  this.setState({content: this.state.content});}}></i>
                                                    ) :(<></>)
                                                    }
                                                    <i className="fa fa-edit"
                                                       onClick={() => {this.setState({contentSelected: chapter, contentEditOpen : true}); }}></i>
                                                    { section.chapters.length > 1 ? (<i className="fa fa-trash"
                                                                                        onClick={() => {section.chapters = section.chapters.filter(c => c != chapter); this.setState({content: this.state.content});}}></i>) :
                                                        (<></>) }
                                                    {index2 == section.chapters.length - 1 ? (<i className="fa fa-plus"
                                                                                                 onClick={() => {section.chapters.push({}); this.setState({content: this.state.content});}}></i>) : (<></>)
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                        <td>

                                        </td>
                                        <td>

                                        </td>

                                    </tr>
                                )
                            })}
                            </>)
                        })
                        }
                    </table>
                </div>
            </div>
            { this.state.content == null || this.state.content.length == 0 ?
                <div className="noResults col-md-12" style={{display: 'flex'}}>
                    There are no results
                </div> : <></>}
            <Dialog
                open={this.state.contentEditOpen}
                onClose={() => this.setState({contentSelected: {}, contentEditOpen: false})}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Alert</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modify the name of the entry
                    </DialogContentText>
                    <TextField
                        color="red"
                        autoFocus
                        margin="dense"
                        id="name"
                        value={this.state.contentSelected.name}
                        onChange={(e) => {this.state.contentSelected.name = e.target.value; this.setState({contentSelected: this.state.contentSelected});}}
                        label="Name"
                        type="text"
                        fullWidth
                    />

                </DialogContent>
                <DialogActions>

                    <Button style={{background: 'green'}}
                            onClick={() => {this.setState({contentSelected: {}, contentEditOpen: false});}}
                            color="primary">
                        <i className="fa fa-save"> </i> Close
                    </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }

    _render_offer_content() {
        return (

            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="offerResult">
                        <CodeExample beforeCodeTitle="Content">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        {this._render_table_structure_component(this.state.offer.content)}
                                    </div>
                                    <div className="kt-section__content" style={{textAlign: 'center'}}>

                                        <Button style={{marginLeft: "10px"}} color="primary" type="button">Save Structure</Button>
                                        <Button style={{marginLeft: "10px"}} color="primary" type="button">Cancel</Button>

                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>
            </div>
            </>
        )
    }

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
                                        <span
                                            className="btn btn-label-brand btn-sm btn-bold btn-upper">
                                            <DateFormat value={offer.notice.publicationDate} />
                                        </span>
                                        </div>
                                    </div>

                                    <div className="kt-widget__item">
                                <span className="kt-widget__date">
                                    Start Date
                                </span>
                                        <div className="kt-widget__label">
                                        <span
                                            className="btn btn-label-danger btn-sm btn-bold btn-upper">{offer.startDate ? <DateFormat value={offer.startDate} /> : ''}</span>
                                        </div>
                                    </div>

                                    <div className="kt-widget__item flex-fill">
                                        <span className="kt-widget__subtitel">Status</span>
                                        <div className="kt-widget__progress d-flex  align-items-center">

                                    <span className="kt-widget__stat">
                                        {offer.state == 1 ? (<><span class="badge badge-success">Started</span>
                                        </>) : (<></>)}
                                        {offer.state == 2 ? (<><span class="badge badge-warning">In Supervision</span>
                                        </>) : (<></>)}
                                        {offer.state == 3 ? (<><span
                                            class="badge badge-success">Supervision Ended</span></>) : (<></>)}
                                        {offer.state == 10 ? (<><span
                                            class="badge badge-danger">Declined</span></>) : (<></>)}

                                    </span>
                                        </div>
                                    </div>
                                </div>

                        <span className="kt-widget__text">
                            <i> {offer.state == 10 ? (<><span
                                style={{color: "red"}}>Offer Declined: {offer.declineReason}</span></>) : (<></>)} </i>
                        </span>

                                <div className="kt-widget__content" style={{justifyContent: "space-between"}}>
                                    <div className="kt-widget__details">
                                        <span className="kt-widget__subtitle">Budget</span>
                                        <span
                                            className="kt-widget__value"> <span>RON</span> <Price value={offer.notice.estimatedValue} /> </span>
                                    </div>


                                    <div className="kt-widget__details">
                                        <span className="kt-widget__subtitle">Team</span>
                                        <div className="kt-media-group" style={{margin: "1px"}}>
                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i>
                                            <span>Tender:</span> &nbsp;&nbsp;&nbsp; {offer.tender.firstName} {offer.tender.lastName}
                                        </div>
                                        <div className="kt-media-group" style={{margin: "1px"}}>
                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i>
                                            <span>Supervisor:</span> {offer.supervisor ? (<> &nbsp;&nbsp;&nbsp; {offer.supervisor.firstName} {offer.supervisor.lastName} </>) : ''}
                                        </div>
                                        <div className="kt-media-group" style={{margin: "1px"}}>
                                            <i sicap-icon="ProcedureState" className="fa fa-cogs"></i>
                                            <span>Expert:</span> {offer.expert ? (<> &nbsp;&nbsp;&nbsp; {offer.expert.firstName} {offer.expert.lastName} </>) : ''}
                                        </div>
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