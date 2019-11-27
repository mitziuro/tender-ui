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


export default class NoticeListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {notices: [], size: 10, page: 0, total: 0};

        this.getNotices = this.getNotices.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);

        if(this.props['onRef']) {
            this.props['onRef'](this);
        } else {
            this.getNotices()
        }
    }

    getNotices = (alert) => {

        if(alert) {
            this.alert = alert;
            this.setState({page: 0});
        }
        Promise.all([this.alert == null ? getNotifiationNotices(this.state.page, this.state.size) : searchNotices(this.alert, this.state.page, this.state.size)]).then(response => {
            this.setState({notices: response[0].data, total: response[0].headers['x-total-count']});
        });
    }

    handleChangePage = (event, page) => {
        this.setState({page: page});
        this.getNotices();
    }

    render() {
        return (
            <>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Notice number <br/>
                                Publication date
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
                                            {notice.publicationDate.split('T')[0].replace('-','.').replace('-','.')}
                                        </TableCell>
                                        <TableCell align="left">
                                            <b>
                                                <Link
                                                    to={`/tender/tender-pages/NoticePage?id=${notice.id}`}>
                                                    {notice.name}
                                                </Link>
                                            </b>

                                            <div className="row" style={{position: "relative", top:"10px"}}>
                                                <div className="col-md-4">

                                                    <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Procedure State:</span>
                                                    <strong className="ng-binding ng-scope">In progress</strong>
                                                    <br/>

                                                    <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Type of procurement:</span> <strong className="ng-binding">{notice.online ? 'ONLINE' : 'OFFLINE'}</strong>
                                                </div>
                                                <div className="col-md-4">

                                                    <i sicap-icon="ContractType" className="fa fa-balance-scale"></i>Contract Assigment Type: <strong className="ng-binding">{notice.awardingManner ? notice.awardingManner.nameEn : ''}</strong><br/>

                                                    <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> CPV: <strong className="ng-binding">{notice.cpv ? notice.cpv.nameEn : '-'}</strong><br/>

                                                    <div className="ng-scope">
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Contracting authority: <strong className="ng-binding">{notice.contractingAuthority ? notice.contractingAuthority.name : '-'}</strong>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">

                                                    <i sicap-icon="ContractDate" className="fa fa-calendar"></i> Receipt deadline:
                                                    <strong className="ng-binding ng-scope">{notice.deadline.split('T')[0].replace('-','.').replace('-','.')} </strong>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {notice.estimatedValue} RON
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