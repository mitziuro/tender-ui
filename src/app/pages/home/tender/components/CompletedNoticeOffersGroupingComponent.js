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


import {searchProviders} from "../../../../crud/tender/provider.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import DocumentLink from "../utilities/document.link";


export default class CompletedNoticeListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {

            selectedDocument: null,
            cans: [],

            selectedEntity: null,
            noCa: props.noCa != null ? props.noCa : false,
            size: 10, page: 0, total: 0
        };

        this.getCans = this.getCans.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);

        this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
        this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);

        this.handleProviderClick = this.handleProviderClick.bind(this);


        if(this.props['onRef']) {
            this.props['onRef'](this);
        } else {
            this.getCans()
        }

        if(this.props['onSelected']) {
            this.onSelected = this.props['onSelected'];
        }
    }

    getCans = (searchObj, page) => {

        this.searchObj = searchObj;

        if(this.state.noCa) {
            searchObj.cas = [];
        }

        Promise.all([searchProviders(searchObj, page != null ? page : this.state.page, this.state.size)]).then(response => {
            this.setState({cans: response[0].data, total: response[0].headers['x-total-count'], page: page != null ? page : this.state.page});
        });
    }

    handleApplyDocument = (data) => {
        this.setState({selectedDocument: data});
    }

    handleProviderClick = (data) => {
        if(!this.state.selectedEntity) {
            this.setState({selectedEntity: data});
        } else {
            if(this.state.selectedEntity.id == data.id) {
                this.setState({selectedEntity: null});
                this.onSelected(null);
                return;
            } else {
                this.setState({selectedEntity: data});
            }
        }
        this.onSelected(data);
    }

    handleChangePage = (page) => {
        this.getCans(this.searchObj, page);
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

                            </TableCell>
                            <TableCell align="left">
                                Participant
                            </TableCell>
                            <TableCell align="left">
                               Win/Loss
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.cans.map((can, index) => {

                                return (

                                        <TableRow key={can.id} style={{backgroundColor: this.state.selectedEntity && this.state.selectedEntity.id == can.id ? 'lightgray' : ''}}
                                                  onClick={ (e) => this.handleProviderClick(can)}
                                        >
                                            <TableCell component="th" scope="row">

                                            </TableCell>
                                            <TableCell align="left">
                                                <b style={{fontSize:"15px"}}>
                                                    {can.name}
                                                </b>

                                                <div className="row" style={{position: "relative", top:"10px"}}>
                                                    <div className="col-md-6">

                                                        <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> TIN: <strong className="ng-binding">{can.tin}</strong><br/>
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> J Number: <strong className="ng-binding">{can.crc}</strong>

                                                    </div>

                                                </div>
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{fontSize: "15px", fontStyle: "italic"}}>
                                                {can.won} / {can.lost}
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
