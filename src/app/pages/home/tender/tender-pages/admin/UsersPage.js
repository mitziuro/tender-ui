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


import {getUsers, deleteUser, saveUser, doImport, searchUsers} from "../../../../../crud/admin/users.crud";
import {addAssociation, deleteAssociationForUserId} from "../../../../../crud/tender/experts.association.crud";

import addNotification from "../../../../../widgets/NotificationWidget";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";


export default class UsersPage extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            adm: props.type,
            users: [], size: 10, page: 0, total: 0, name: null, type: null, association: null,
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

        this.getUsers();
    }

    getUsers = () => {

        let type = this.state.type;
        if(this.state.adm != null && type == null) {
            type = 3;
        }

        Promise.all([searchUsers(this.state.page, this.state.size, this.state.name, type, this.state.association == true ? this.state.adm : null, this.state.adm)]).then(response => {
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
        this.setState({importing: true});
        Promise.all([doImport()]).then(response => {
            this.setState({importing: false});
        });

    }

    handleAddAssociation = (user) => {

        Promise.all([addAssociation({type: this.state.adm == 'internal' ? 1 : 2, userId: user.id})]).then(response => {
            user.associated = true;
            this.setState({});
            addNotification("Success", "The association has been made", 'success');

        });

    }

    handleRemoveAssociation = (user) => {
        Promise.all([deleteAssociationForUserId(user.id)]).then(response => {
            user.associated = false;
            this.setState({});
            addNotification("Success", "The association has been deleted", 'success');

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


             <div style={{display: 'flex', marginBottom : '20px'}}>

                <div className="col-md-3" style={{position: 'relative', top: '12px'}}>
                   Type

                   { this.state.adm == null ?
                   <Select style={{width: '100%', position: 'relative'}}
                                           onChange={(e) => {
                                               this.state.type = e.target.value;
                                               this.setState({});
                                           }}
                                           inputProps={{
                       name: "type",
                       id: "type",
                       label: "type"
                   }}
                   >


                     <MenuItem value={-1} >Tender</MenuItem>
                     <MenuItem value={1}>Technical Expert</MenuItem>
                     <MenuItem value={2}>Public Acquisitions Expert</MenuItem>

                   </Select>
                   :

                    <Select style={{width: '100%', position: 'relative'}}
                                                              onChange={(e) => {
                                                                  this.state.type = e.target.value;
                                                                  this.setState({});
                                                              }}
                                                              inputProps={{
                                          name: "type",
                                          id: "type",
                                          label: "type"
                                      }}
                                      >

                                        <MenuItem value={1}>Technical Expert</MenuItem>
                                        <MenuItem value={2}>Public Acquisitions Expert</MenuItem>

                                      </Select>


                 }
                </div>

                <div className="col-md-3">
                     <TextField label="Login"
                              value={this.state.name}
                              onChange={(e) => { this.state.name = e.target.value; this.setState({});}}
                              margin="normal"/>
                </div>


                <div className="col-md-3" style={{position: 'relative', top: "20px"}}>
                     <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => {this.getUsers();}} color="primary">
                         Search
                     </Button>
                </div>



            </div>

            {this.state.adm != null ?
                <div>
                    <div>
                        <FormControlLabel control={
                                    <Checkbox
                              checked={this.state.association}
                              onChange={(e) => {this.state.association = e.target.checked; this.setState({}); this.getUsers()}}
                              value={this.state.association}
                              color="primary"
                                />
                          } label={'Display just ' +  this.state.adm + ' users'}/>

                    </div>
                    <div>

                    </div>
                </div>
             : ''
             }

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
                             {this.state.adm == null ?
                                <TableCell align="left">
                                    Roles
                                </TableCell>
                                : ''
                             }
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
                                            {user.type == -1 ? 'Tender' : user.type == 1 ? 'Technical Expert' : 'Public Acquisitions Expert'}
                                        </TableCell>
                                        {this.state.adm == null ?
                                            <TableCell align="left">
                                                {user.authorities.map(a => <span> {a} &nbsp; </span>)}
                                            </TableCell>
                                           : ''}
                                        <TableCell align="right">
                                           {this.state.adm == null ?
                                               <>
                                                    <a onClick={() => this.setState({onBeEdited: user, confirmEdit: true})}>
                                                        <i style={{color: 'blue'}} className="fa fa-edit fa-lg"  title="Edit"> </i>
                                                    </a>
                                                    &nbsp;
                                                    <a onClick={() => this.setState({onBeDeleted: user.email, confirmDelete: true})}>
                                                        <i style={{color: 'red'}} className="fa fa-trash fa-lg"  title="Delete"> </i>
                                                    </a>
                                                </>
                                            : ''}

                                            {this.state.adm != null  && !user.associated ?
                                                <>
                                                    <a onClick={() => this.handleAddAssociation(user)}>
                                                        <i style={{color: 'green'}} className="fa fa-plus"  title="Edit"> </i>
                                                    </a>
                                                </>
                                             : ''}

                                                    &nbsp;

                                             {this.state.adm != null && user.associated ?
                                                 <>
                                                     <a onClick={() => this.handleRemoveAssociation(user)}>
                                                         <i style={{color: 'red'}} className="fa fa-trash"  title="Delete"> </i>
                                                     </a>
                                                 </>
                                              : ''}

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
