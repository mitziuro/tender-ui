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


import {getNotifiationNotices} from "../../../../crud/tender/search.notice.crud";

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

        this.getNotices();
    }

    getNotices = () => {
        Promise.all([getNotifiationNotices(this.state.page, this.state.size)]).then(response => {
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
                                            {notice.publicationDate.split('T')[0]}
                                        </TableCell>
                                        <TableCell align="left">
                                            <b>
                                                <Link
                                                    to={`/tender/tender-pages/NoticePage?id=${notice.id}`}>
                                                    {notice.name}
                                                </Link>
                                            </b>
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