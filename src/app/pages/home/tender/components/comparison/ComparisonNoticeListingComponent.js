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


import {searchCans} from "../../../../../crud/tender/can.offer.crud";

import DocumentLink from "../../utilities/document.link";
import Price from "../../utilities/price";
import DateFormat from "../../utilities/date.format";



import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";


export default class ComparisonNoticeListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {

            selectedEntity: null,
            cans: [],
            size: 10, page: 0, total: 0
        };

        this.handleSearch = this.handleSearch.bind(this);
        this._handleSearch = this._handleSearch.bind(this);

        this.handleChangePage = this.handleChangePage.bind(this);

        this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
        this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);


        this.searchObj = null;

        if(this.props['onRef']) {
            this.props['onRef'](this);
        }

        this.winners = false;
        if(this.props['winners']) {
            this.winners = this.props['winners'];
        }
    }


    handleSearch = (cpvs, cas) => {

        this.searchObj = {
            input : null,
            document : null,
            notAwardedOffers : this.winners ? false : true,
            awardedOffers : this.winners ? true : false,
            cas : cas.map(c => c.id),
            cpvs : cpvs.map(c => c.id),
            nuts : [],
            number : null,
            startDate : null,
            endDate : null
        };

        this._handleSearch(this.searchObj);
    }



    _handleSearch = (searchObj, page) => {

        this.searchObj = searchObj;

        Promise.all([searchCans(searchObj, page != null ? page : this.state.page, this.state.size)]).then(response => {
            this.setState({cans: response[0].data, total: response[0].headers['x-total-count'], page: page != null ? page : this.state.page});
        });
    }


    handleChangePage = (page) => {
        this._handleSearch(this.searchObj, page);
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
                                {
                                    this.winners ? 'Winning Company' : 'Participating Company'
                                }
                            </TableCell>
                            {
                                this.winners ? (
                                    <TableCell align="left">
                                        Assigned Value (RON)
                                    </TableCell>)
                                    : ''
                            }
                            <TableCell align="left">
                                Assignment notice number
                            </TableCell>
                            <TableCell align="left">
                                Notice Publication Date
                            </TableCell>
                            <TableCell align="left">
                                Location
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.cans != null && this.state.cans.length > 0 ? this.state.cans.map((can, index) => {

                                let mainProvider = {name: '', tin: '', crc: ''};

                                try {

                                    if(can.providers.length  == 0) {
                                        mainProvider = {name: '', tin: '', crc: ''};
                                    } else {
                                        let offerProvider = can.canOfferProviders.filter(q => q.main).length > 0 ? can.canOfferProviders.filter(q => q.main)[0] : can.canOfferProviders[0];

                                        if(offerProvider) {
                                            mainProvider = can.providers.filter(p => p.id == offerProvider.provider).length > 0 ? can.providers.filter(p => p.id == offerProvider.provider)[0] : can.providers[0];
                                        }
                                    }

                                } catch(ex) {}

                                return (
                                    <TableRow key={can.id}>
                                        <TableCell align="left">
                                            {mainProvider.name}
                                        </TableCell>
                                        {
                                            this.winners ? (
                                            <TableCell align="left">
                                                <Price value={can.can.value} />
                                            </TableCell>)
                                                : ''
                                        }
                                        <TableCell align="left">
                                            {can.can.number}
                                        </TableCell>
                                        <TableCell align="left">
                                            <DateFormat value={can.can.date} />
                                        </TableCell>
                                        <TableCell align="left">
                                            {can.can.nuts.name}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                                : ( <TableRow> <TableCell colspan={this.winners ? '5' : '4'} style={{textAlign:'center'}}> <b> No Results </b> </TableCell> </TableRow>)
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <td colspan={this.winners ? '5' : '4'}>
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
