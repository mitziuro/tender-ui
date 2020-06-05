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


import {getActivities, getActivitiesForOffer} from "../../../../crud/tender/activity.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import DateFormat from "../utilities/date.format";

export default class UserActivityListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {activities: [], page: 0, size: 20};


        this.getActivities();

    }

    getActivities = (page) => {

        Promise.all([getActivities(page != null ? page : this.state.page, this.state.size)]).then(response => {
            this.setState({activities: response[0].data, total: response[0].headers['x-total-count'], page: page != null ? page : this.state.page});
        });
    }

    handleChangePage = (page) => {
        this.getActivities(page);
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
                        {
                            this.state.activities.length == 0 ?

                             <div className="col-md-12">
                                 <div className="kt-portlet kt-portlet--height-fluid">
                                     <div className="kt-portlet__body kt-portlet__body--fit">
                                         <div className="kt-widget kt-widget--project-1">
                                             <div className="kt-widget__head">
                                                 <div className="kt-widget__label" style={{width: '100%'}}>
                                                     <div className="kt-widget__media" style={{width: '100%'}}>
                                                         <div style={{textAlign: 'center', position: 'relative', top: '22px'}}><i>No Results</i></div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div> :
                             <span></span>

                        }

                         {
                             this.state.activities.length > 0 ?
                            <div>
                                <Paper>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">
                                                    Date
                                                </TableCell>
                                                <TableCell align="left">
                                                    Activity Name
                                                </TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.state.activities.map((activity, index) => {

                                                    return  (
                                                        <TableRow>
                                                            <TableCell component="th" scope="row">
                                                               <DateFormat value={activity.date} withTime={true} />
                                                            </TableCell>
                                                            <TableCell align="left">
                                                               <div dangerouslySetInnerHTML={{__html: activity.html}}></div>
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
                            </div>

                            :
                             <span></span>

                        }
            </>
        )
    }
}
