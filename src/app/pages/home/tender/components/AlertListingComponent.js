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
    TableFooter,

    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";


import {getMyAlerts, deleteAlerts} from "../../../../crud/tender/alert.crud";


export default class AlertListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {alerts: [], confirm: false};

        this.getAlerts = this.getAlerts.bind(this);
        this.markAlert = this.markAlert.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.getAlerts();
    }


    markAlert = (id) => {
        let all = this.state.all;

        if (id === null) {
            let all = !this.state.all;
        }

        let elems = this.state.alerts.filter(a => id == null || a.id === id);
        elems.forEach(e =>  e.checked = id !== null ? (e.checked == null || e.checked === false ? true : false) : (all));
        this.setState({alerts: this.state.alerts, all: all});
    }

    handleDelete = () => {

        let toBeDeleted = this.state.alerts.filter(a => a.checked === true).map(a => a.id);
        if(toBeDeleted.length === 0) {
            return;
        }

        Promise.all([deleteAlerts(toBeDeleted)]).then(response => {
            this.getAlerts();
            this.setState({confirm: false});
        });
        ;
    }

    getAlerts = () => {
        Promise.all([getMyAlerts()]).then(response => {
            this.setState({alerts: response[0].data});
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
                                <Tooltip title="Delete">
                                    <IconButton aria-label="Delete">
                                        <DeleteIcon onClick={() => this.setState({confirm: true})} />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {
                            this.state.alerts.map((alert, index) => {

                                return (
                                    <TableRow key={alert.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={alert.checked == true}
                                                onChange={() => this.markAlert(alert.id)}
                                                inputProps={{
                                        "aria-labelledby": alert.id
                                      }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Link
                                                to={`/tender/tender-pages/NoticeSearchPage?alert=${alert.id}`}>{alert.alertName}</Link>
                                        </TableCell>
                                        <TableCell align="left">{alert.alertDescription}</TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </Paper>
            <Dialog
                open={this.state.confirm}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Alert</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the selected alerts ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({confirm: false})} color="primary">
                        Cancel
                    </Button>
                    <Button style={{background: 'green'}} onClick={() => this.handleDelete()} color="primary">
                        <i className="fa fa-trash"> </i> Delete
                    </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }
}