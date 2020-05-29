import React from "react";
import { Link } from 'react-router-dom';

import CodeExample from "../../../../partials/content/CodeExample";
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


import {getUsers, deleteUser, saveUser, doImport, searchUsers, acceptUser, rejectUser} from "../../../../crud/admin/users.crud";

import addNotification from "../../../../widgets/NotificationWidget";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";


export default class UsersPage extends React.Component {

    constructor(props) {

        super(props);

        let accept = null;
        if(props.location.search.indexOf('approve=') > 0){
            accept = props.location.search.split('=')[1];
        }

        let reject = null;
        if(props.location.search.indexOf('reject=') > 0){
            reject = props.location.search.split('=')[1];
        }

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

        this.getUsers(accept, reject);
    }

    getUsers = (accept, reject) => {

        if(accept == null && reject == null) {
            Promise.all([getUsers(this.state.page, this.state.size, true)]).then(response => {
                this.setState({users: response[0].data, total: response[0].headers['x-total-count'], page: this.state.page});
            });

            return;
        }


        Promise.all([accept != null ? acceptUser(accept) : rejectUser(reject)]).then(response => {

            addNotification("Success", 'The expert has been ' + (accept ? 'accepted' : 'rejected'), 'success');

            Promise.all([getUsers(this.state.page, this.state.size, true)]).then(response => {
                this.setState({users: response[0].data, total: response[0].headers['x-total-count'], page: this.state.page});
            });
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
        this.setState({importing: true});
        Promise.all([doImport()]).then(response => {
            this.setState({importing: false});
        });

    }




    handleChangePage = (page) => {
        this.state.page = page;
        this.getUsers(null, page);
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
                                Last Name
                            </TableCell>

                            <TableCell align="left">
                                Type
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
                                    <TableRow key={user.id} style={{background: this.state.adm != null && user.associated ? 'lightgray' : ''}}>
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
                                            {user.type == -1 ? 'Tender' : user.type == 1 ? 'Technical Expert' : 'Public Acquisitions Expert'}
                                        </TableCell>

                                        <TableCell align="right">


                                             <Link
                                                to={`/tender/tender-pages/MyAccountPage?user=${user.id}`}>
                                                 <i style={{color: 'blue'}} className="fa fa-eye"  title="Edit"> </i>
                                            </Link>

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

                                                         <Checkbox
                                                            checked={this.state.onBeEdited.authorities.indexOf('ROLE_EXPERT') >= 0 }
                                                            onChange={ (e) => {

                                                                if(!e.target.checked)  {
                                                                    this.state.onBeEdited.authorities = this.state.onBeEdited.authorities.filter(a => a != 'ROLE_EXPERT');
                                                                } else {

                                                                  if(this.state.onBeEdited.authorities.indexOf('ROLE_EXPERT') < 0) {
                                                                    this.state.onBeEdited.authorities.push('ROLE_EXPERT');
                                                                  }
                                                                }

                                                                this.setState({onBeEdited : this.state.onBeEdited})
                                                                }
                                                             }
                                                            value={this.state.onBeEdited.authorities.indexOf('ROLE_EXPERT') >= 0 }

                                                            inputProps={{
                                                                  "aria-label": "primary checkbox"
                                                                }}
                                                        />
                                                        ROLE_EXPERT
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
