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


import {getLastActivities} from "../../../../crud/tender/activity.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import DateFormat from "../utilities/date.format";

export default class UserActivityComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {activities: []};

        Promise.all([getLastActivities()]).then(response => {
            this.setState({activities: response[0].data});
        });

    }

    getActivity(activity) {
        if (activity.type == 1) return 'Password Reset';

        if (activity.type == 2) return 'An alert with the name "' + activity.entity1Data + '" has been created';
        if (activity.type == 3) return 'An alert with the name "' + activity.entity1Data + '" has been updated';

        if (activity.type == 4) return 'A procedure for "' + activity.entity1Data + '" has been created';
        if (activity.type == 5) return 'A procedure for "' + activity.entity1Data + '" has been declined';

        return '';
    }


    render() {
        return (
            <>
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
                                            {this.getActivity(activity)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>

                </Table>
            </Paper>
            </>
        )
    }
}
