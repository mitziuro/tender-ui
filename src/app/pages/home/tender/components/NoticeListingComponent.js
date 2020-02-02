import React from "react";
import { Link } from 'react-router-dom';

import { Button } from "react-bootstrap";

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


import {getNotifiationNotices, searchNotices} from "../../../../crud/tender/search.notice.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import DocumentLink from "../utilities/document.link";
import Price from "../utilities/price";
import DateFormat from "../utilities/date.format";



export default class NoticeListingComponent extends React.Component {

    constructor(props) {

        super(props);

        this.expandable = props.expandable;


        this.state = {notices: [], size: this.expandable ? 5 : 10, page: 0, total: 0};

        this.getNotices = this.getNotices.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);

        this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
        this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);


        if(this.props['onRef']) {
            this.props['onRef'](this);
        } else {
            this.getNotices()
        }
    }

    getNotices = (alert, page) => {

        if(alert) {
            this.alert = alert;
            this.setState({page: 0});
        }

        Promise.all([this.alert == null ? getNotifiationNotices(this.state.page, this.state.size) : searchNotices(this.alert, page != null ? page : this.state.page, this.state.size)]).then(response => {
            this.setState({notices: response[0].data, total: response[0].headers['x-total-count'], page: page != null ? page : this.state.page});
        });
    }

    handleChangePage = (page) => {
        this.getNotices(null, page);
    }

    handleFirstPageButtonClick = () =>  {
        this.handleChangePage(0);
    }

    handleBackButtonClick = () =>  {
        this.handleChangePage(this.state.page - 1);
    }

    handleNextButtonClick = () =>  {
        this.handleChangePage(this.state.page + 1);
    }

    handleLastPageButtonClick = () =>  {
        this.handleChangePage(Math.max(0, Math.ceil(this.state.total / this.state.size) - 1));
    }

    render() {
        return (
            <>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                No. number <br/>
                                Pub. date
                            </TableCell>
                            <TableCell align="left">
                                Contract Name
                            </TableCell>
                            <TableCell align="left">
                                Estimated Value
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.notices.map((notice, index) => {

                                return (
                                    <TableRow key={notice.id}>
                                        <TableCell component="th" scope="row">
                                            {notice.number} <br/>
                                            <DateFormat value={notice.publicationDate} />
                                        </TableCell>
                                        <TableCell align="left" >
                                            <b style={{fontSize:"15px"}}>
                                                {(this.expandable && !notice.maximized) ? <i  onClick={(e) => {notice.maximized = !notice.maximized; this.setState({});}} class="fa fa-arrow-down">&nbsp;</i> : <></>}
                                                {(this.expandable && notice.maximized) ? <i onClick={(e) => {notice.maximized = !notice.maximized; this.setState({});}}  class="fa fa-arrow-up">&nbsp;</i> : <></>}
                                                <Link
                                                    to={`/tender/tender-pages/NoticePage?id=${notice.id}`}>
                                                    {notice.name}

                                                </Link>
                                                <DocumentLink noName={true} name={notice.name} noticeId={notice.noticeId} type={notice.type.toString()} />

                                            </b>

                                            <div className="row" style={{position: "relative", top:"10px", display : (!this.expandable || notice.maximized) ? '' : 'none'}}>
                                                <div className="col-md-6">

                                                    <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Procedure State:</span>
                                                    <strong className="ng-binding ng-scope">In progress</strong>
                                                    <br/>

                                                    <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Type of procurement:</span> <strong className="ng-binding">{notice.online ? 'ONLINE' : 'OFFLINE'}</strong>
                                                    <br/>

                                                    <i sicap-icon="ContractDate" className="fa fa-calendar"></i> Receipt deadline:
                                                    <strong className="ng-binding ng-scope"> <DateFormat value={notice.deadline} /> </strong>

                                                    <div className="ng-scope">
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Location: <strong className="ng-binding">{notice.nuts.name ? notice.nuts.name : '-'}</strong>
                                                    </div>

                                                </div>
                                                <div className="col-md-6">

                                                    <i sicap-icon="ContractType" className="fa fa-balance-scale"></i>Contract Assigment Type: <strong className="ng-binding">{notice.awardingManner ? notice.awardingManner.nameEn : ''}</strong><br/>

                                                    <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> CPV: <strong className="ng-binding">{notice.cpv ? notice.cpv.nameEn : '-'}</strong><br/>

                                                    <div className="ng-scope">
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Contracting authority: <strong className="ng-binding">{notice.contractingAuthority ? notice.contractingAuthority.name : '-'}</strong>
                                                    </div>
                                                </div>

                                            </div>
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{fontSize: "15px", fontStyle: "italic"}}>
                                            <Price value={notice.estimatedValue} /> RON
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <td colspan="3">
                                <div style={{width: '100%', textAlign: 'center'}}>
                                    <span>
                                        {(this.state.page * this.state.size) + 1} - {((this.state.page + 1)* this.state.size) > this.state.total ? this.state.total : ((this.state.page + 1)* this.state.size)}  of {this.state.total}
                                    </span>
                                    <IconButton
                                        onClick={this.handleFirstPageButtonClick}
                                        disabled={this.state.page == 0}
                                        aria-label="First Page"
                                    >
                                        <FirstPageIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={this.handleBackButtonClick}
                                        disabled={this.state.page == 0}
                                        aria-label="Previous Page"
                                    >
                                        <KeyboardArrowLeft />
                                    </IconButton>
                                    <IconButton
                                        onClick={this.handleNextButtonClick}
                                        disabled={this.state.page >= Math.ceil(this.state.total / this.state.size) - 1}
                                        aria-label="Next Page"
                                    >
                                        <KeyboardArrowRight />
                                    </IconButton>
                                    <IconButton
                                        onClick={this.handleLastPageButtonClick}
                                        disabled={this.state.page >= Math.ceil(this.state.total / this.state.size) - 1}
                                        aria-label="Last Page"
                                    >
                                        <LastPageIcon />
                                    </IconButton>
                                </div>
                            </td>
                        </TableRow>
                    </TableFooter>

                </Table>
            </Paper>
            </>
        )
    }
}
