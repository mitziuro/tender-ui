import React from "react";
import { Link } from 'react-router-dom';

import { Button } from "react-bootstrap";

import {getValue} from "../../../../../crud/tender/comparison.crud";
import Price from "../../utilities/price";

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


export default class ValueRankingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {nuts: [], results: []};

        if(this.props['onRef']) {
            this.props['onRef'](this);
        }

        this.handleSearch = this.handleSearch.bind(this);


    }

    handleSearch = (cpv, nuts) => {
        Promise.all([getValue(cpv.id, nuts)]).then(response => {
            this.setState({results: response[0].data});
        });
    }


    render() {
        return (
            <>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                Company Name
                            </TableCell>
                            <TableCell align="left">
                                Value Won (RON)
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { this.state.results && this.state.results.length > 0 ?
                            this.state.results.map((can, index) => {
                                return (<TableRow>
                                        <TableCell component="th" scope="row">
                                            {can.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Price value={can.data} />
                                        </TableCell>
                                    </TableRow>)


                        }) :
                            <>
                            <TableRow>
                                <TableCell colspan="2" style={{textAlign: 'center'}}>
                                   <b>  No Results </b>
                                </TableCell>
                            </TableRow>
                        </> }
                    </TableBody>

                </Table>

            </Paper>
            </>
        )
    }
}
