import React from "react";
import { Link } from 'react-router-dom';

import { Button } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic";


import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    Toolbar,
    Typography,
    Tooltip,
    IconButton,
    TableSortLabel,
    TablePagination,
    Switch,
    FormControlLabel,
    TableFooter
} from "@material-ui/core";


import {getOffersForTender, getOffersForSupervisor} from "../../../../crud/tender/offer.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import Price from "../utilities/price";
import DateFormat from "../utilities/date.format";

export default class OfferListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {offers: [], size: 10, page: 0, total: 0, user: props['user'], states: props['states'], type: props['type']};

        this.getOffers = this.getOffers.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);

        this.getOffers();
    }

    getOffers = (user, states) => {
        Promise.all([this.state.user == 'supervisor' ? getOffersForSupervisor(this.state.states, this.state.page, this.state.size) : getOffersForTender(this.state.states, this.state.page, this.state.size)]).then(response => {
            this.setState({offers: response[0].data, total: response[0].headers['x-total-count']});
        });
    }

    handleChangePage = (event, page) => {
        this.setState({page: page});
        this.getOffers();
    }

    render() {
        return this.state.offers.length == 0 ? (<><div className="col-md-12" style={{justifyContent: "center", textAlign: "center"}}><i>There are no results</i></div></>) : this.state.type == 'big' ? this._render_big() : this._render_small();
    }

    _render_big() {
        return (
            <>
            {
                this.state.offers.map((offer, index) => {
                    return (
                        <div className="col-xl-6">
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
                                        {offer.state == 10 ? (<><span class="badge badge-danger">Declined</span></>) : (<></>)}
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

                                        <div className="kt-widget__footer">
                                            <div className="kt-widget__wrapper">


                                                <div className="kt-widget__section">
                                                    <Link
                                                        to={`/tender/tender-pages/OfferPage?id=${offer.id}`}>
                                                            <button type="button" className="btn btn-brand btn-sm btn-upper btn-bold">Details</button>
                                                    </Link>
                                                    <Link
                                                        to={`/tender/tender-pages/NoticePage?id=${offer.notice.id}`}>
                                                        <button style={{marginLeft : "10px"}} type="button" className="btn btn-brand btn-sm btn-upper btn-bold">View Notice</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    )
                })
            }

            </>
        )
    }

    _render_small() {
        return (
            <>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Contract Name
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.offers.map((offer, index) => {

                                return (
                                    <TableRow key={offer.id}>
                                        <TableCell align="left">
                                            <b>
                                                <Link
                                                    to={`/tender/tender-pages/OfferPage?id=${offer.id}`}>
                                                    {offer.notice.name}
                                                </Link>
                                            </b>

                                            <div className="row" style={{position: "relative", top:"10px", left: "10px"}}>
                                                <div className="col-md-6">

                                                    <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> CPV: <strong className="ng-binding">{offer.notice.cpv ? offer.notice.cpv.nameEn : '-'}</strong><br/>

                                                    <div className="ng-scope">
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Contracting authority: <strong className="ng-binding">{offer.notice.contractingAuthority ? offer.notice.contractingAuthority.name : '-'}</strong>
                                                    </div>

                                                    <i sicap-icon="ContractDate" className="fa fa-calendar"></i> Receipt deadline:
                                                    <strong className="ng-binding ng-scope"> <DateFormat value={offer.notice.deadline} /> </strong>

                                                </div>
                                                <div className="col-md-6">

                                                    <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> Estimated Value:
                                                    <strong className="ng-binding"><Price value={offer.notice.estimatedValue} /> RON</strong><br/>

                                                    <div className="ng-scope">
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Status: &nbsp;
                                                        {offer.state == 1 ? (<><span class="badge badge-success">Started</span></>) : (<></>)}
                                                        {offer.state == 2 ? (<><span class="badge badge-warning">In Supervision</span></>) : (<></>)}
                                                        {offer.state == 3 ? (<><span class="badge badge-success">Supervision Ended</span></>) : (<></>)}
                                                        {offer.state == 10 ? (<><span class="badge badge-danger">Declined</span></>) : (<></>)}
                                                    </div>

                                                </div>
                                            </div>

                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[this.state.size]}
                                colSpan={3}
                                count={this.state.total}
                                rowsPerPage={this.state.size}
                                page={this.state.page}
                                SelectProps={{
                                     inputProps: { "aria-label": "Rows per page" },
                                     native: true
                                }}

                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={() => {}}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>

                </Table>
            </Paper>
            </>
        )
    }
}

function TablePaginationActions(props) {

    const { count, page, rowsPerPage, onChangePage } = props;

    function handleFirstPageButtonClick(event) {
        onChangePage(event, 0);
    }

    function handleBackButtonClick(event) {
        onChangePage(event, page - 1);
    }

    function handleNextButtonClick(event) {
        onChangePage(event, page + 1);
    }

    function handleLastPageButtonClick(event) {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }

    return (
        <div style={{width: '100%'}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="First Page"
            >
                 <FirstPageIcon />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="Previous Page"
            >
                    <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Next Page"
            >
                    <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Last Page"
            >
               <LastPageIcon />
            </IconButton>
        </div>
    );
}