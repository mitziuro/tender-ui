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


import {searchCans} from "../../../../crud/tender/can.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";


export default class ExplainedOfferComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {cans: [], size: 10, page: 0, total: 0};

        if(this.props['onRef']) {
            this.props['onRef'](this);
        }

        this.handleApplyData= this.handleApplyData.bind(this);

    }

    handleApplyData = (data) => {
        this.setState({cans: data});;
    }


    render() {
        return (
            <>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                Name
                            </TableCell>
                            <TableCell align="left">
                                TIN
                            </TableCell>
                            <TableCell align="left">
                                J Number
                            </TableCell>
                            <TableCell align="left">
                                Quality
                            </TableCell>
                            <TableCell align="left">
                                Operator Type
                            </TableCell>
                            <TableCell align="left">
                                Representative
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { this.state.cans &&  this.state.cans.providers  ?
                            this.state.cans.providers.map((can, index) => {

                                return (
                                    <TableRow key={can.id} style={{backgroundColor: this.state.cans.canOfferProviders[index].main ? 'lightgray' : ''}}>
                                        <TableCell component="th" scope="row">
                                            {can.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {can.tin}
                                        </TableCell>
                                        <TableCell align="left">
                                            {can.crc}
                                        </TableCell>
                                        <TableCell align="left">
                                            {this.state.cans.canOfferProviders[index].percentage == 0 ? 'Supplier' : 'Subcontractor : ' + this.state.cans.canOfferProviders[index].percentage + '%'}
                                        </TableCell>
                                        <TableCell align="left">
                                            {this.state.cans.canOfferProviders[index].type == 1 ? 'Big' : this.state.cans.canOfferProviders[index].type == 2 ? 'Medium' : 'Small'}
                                        </TableCell>
                                        <TableCell align="left">
                                            {this.state.cans.canOfferProviders[index].representative}
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{fontSize: "15px", fontStyle: "italic"}}>

                                        </TableCell>
                                    </TableRow>
                                )
                            }) : ''
                        }
                    </TableBody>

                </Table>
            </Paper>
            </>
        )
    }
}
