import React from "react";
import { Link } from 'react-router-dom';

import CodeExample from "../../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";

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

    TextField,
    InputLabel,
    MenuItem,
    Select,

    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";


import {getUsers, deleteUser, saveUser, doImport} from "../../../../../crud/admin/users.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";


export default class UsersPage extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            users: [], size: 10, page: 0, total: 0,
            onBeDeleted: null, confirmDelete: false, importing: false,
            onBeEdited: {authorities: []}, confirmEdit: false

        };

        this.getUsers = this.getUsers.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);

        this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
        this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);

        this.handleImport = this.handleImport.bind(this);

        this.getUsers()
    }

    getUsers = () => {

        Promise.all([getUsers(this.state.page, this.state.size)]).then(response => {
            this.setState({users: response[0].data, total: response[0].headers['x-total-count'], page: this.state.page});
        });
    }

    handleDelete = () => {
        Promise.all([deleteUser(this.state.onBeDeleted)]).then(response => {
            this.getUsers();
        });
        this.setState({confirmDelete: false});
    }

    handleSave = () => {
        Promise.all([saveUser(this.state.onBeEdited)]).then(response => {
            this.getUsers();
        });
        this.setState({confirmEdit: false})
    }

    handleImport = () => {
        Promise.all([doImport()]).then(response => {
            this.setState({importing: true});
            setTimeout(() => this.setState({importing: false}), 60000)
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
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="alertsResults">
                        <CodeExample beforeCodeTitle="Users">
                            <div className="kt-section">
                                {this.state.importing ?
                                    <Button disabled style={{position: "relative",top: "-49px", left: "100px"}}
                                            onClick={() => {this.handleImport();}} color="primary">
                                        Importing...
                                    </Button> :
                                    <Button style={{position: "relative",top: "-49px", left: "100px"}}
                                            onClick={() => {this.handleImport();}} color="primary">
                                        Import
                                    </Button>
                                }
                                <div className="col-md-12" >
                                    <div className="kt-section__content">
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Username/Email
                            </TableCell>
                            <TableCell align="left">
                                First Name
                            </TableCell>
                            <TableCell align="left">
                                Last Value
                            </TableCell>
                            <TableCell align="left">
                                Roles
                            </TableCell>
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.users.map((user, index) => {

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell component="th" scope="row">
                                            {user.email}
                                        </TableCell>
                                        <TableCell align="left">
                                            {user.firstName}
                                        </TableCell>
                                        <TableCell align="left">
                                            {user.lastName}
                                        </TableCell>
                                        <TableCell align="left">
                                            {user.authorities.map(a => <span> {a} &nbsp; </span>)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <a onClick={() => this.setState({onBeEdited: user, confirmEdit: true})}>
                                                <i className="fa fa-edit fa-lg"  title="Edit"> </i>
                                            </a>
                                            &nbsp;
                                            <a onClick={() => this.setState({onBeDeleted: user.email, confirmDelete: true})}>
                                                <i className="fa fa-trash fa-lg"  title="Delete"> </i>
                                            </a>
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
                                        <Dialog
                                            open={this.state.confirmDelete}
                                            aria-labelledby="form-dialog-title">
                                            <DialogTitle id="form-dialog-title">Alert</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Are you sure you want to delete the selected user ?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({confirmDelete: false})} color="primary">
                                                    Cancel
                                                </Button>
                                                <Button style={{background: 'green'}} onClick={() => this.handleDelete()} color="primary">
                                                    <i className="fa fa-trash"> </i> Delete
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                        <Dialog
                                            open={this.state.confirmEdit}
                                            aria-labelledby="form-dialog-title">
                                            <DialogTitle id="form-dialog-title">Alert</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.onBeEdited.authorities.indexOf('ROLE_ADMIN') >= 0 }
                                                            onChange={ (e) => {

                                                                if(!e.target.checked)  {
                                                                    this.state.onBeEdited.authorities = this.state.onBeEdited.authorities.filter(a => a != 'ROLE_ADMIN');
                                                                } else {

                                                                  if(this.state.onBeEdited.authorities.indexOf('ROLE_ADMIN') < 0) {
                                                                    this.state.onBeEdited.authorities.push('ROLE_ADMIN');
                                                                  }
                                                                }

                                                                this.setState({onBeEdited : this.state.onBeEdited})
                                                                }
                                                             }
                                                            value={this.state.onBeEdited.authorities.indexOf('ROLE_ADMIN') >= 0 }

                                                            inputProps={{
                                                                  "aria-label": "primary checkbox"
                                                                }}
                                                        />
                                                        ROLE_ADMIN

                                                        <Checkbox
                                                            checked={this.state.onBeEdited.authorities.indexOf('ROLE_TENDER') >= 0 }
                                                            onChange={ (e) => {

                                                                if(!e.target.checked)  {
                                                                    this.state.onBeEdited.authorities = this.state.onBeEdited.authorities.filter(a => a != 'ROLE_TENDER');
                                                                } else {

                                                                  if(this.state.onBeEdited.authorities.indexOf('ROLE_TENDER') < 0) {
                                                                    this.state.onBeEdited.authorities.push('ROLE_TENDER');
                                                                  }
                                                                }

                                                                this.setState({onBeEdited : this.state.onBeEdited})
                                                                }
                                                             }

                                                            value={this.state.onBeEdited.authorities.indexOf('ROLE_TENDER') >= 0 }

                                                            inputProps={{
                                                                  "aria-label": "primary checkbox"
                                                                }}
                                                        />
                                                        ROLE_TENDER

                                                        <Checkbox
                                                            checked={this.state.onBeEdited.authorities.indexOf('ROLE_SUPERVISOR') >= 0 }
                                                            onChange={ (e) => {

                                                                if(!e.target.checked)  {
                                                                    this.state.onBeEdited.authorities = this.state.onBeEdited.authorities.filter(a => a != 'ROLE_SUPERVISOR');
                                                                } else {

                                                                  if(this.state.onBeEdited.authorities.indexOf('ROLE_SUPERVISOR') < 0) {
                                                                    this.state.onBeEdited.authorities.push('ROLE_SUPERVISOR');
                                                                  }
                                                                }

                                                                this.setState({onBeEdited : this.state.onBeEdited})
                                                                }
                                                             }
                                                            value={this.state.onBeEdited.authorities.indexOf('ROLE_SUPERVISOR') >= 0 }

                                                            inputProps={{
                                                                  "aria-label": "primary checkbox"
                                                                }}
                                                        />
                                                        ROLE_SUPERVISOR
                                                    </div>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => {this.setState({confirmEdit: false});this.getUsers();}} color="primary">
                                                    Cancel
                                                </Button>
                                                <Button style={{background: 'green'}} onClick={() => this.handleSave()} color="primary">
                                                    <i className="fa fa-trash"> </i> Save
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>
            </div>
            </>
        )
    }
}
