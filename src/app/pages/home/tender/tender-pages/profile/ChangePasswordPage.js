import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";

import  { changePassword } from '../../../../../crud/auth.crud';
import  AlertListingComponent from '../../components/AlertListingComponent';
import  OfferListingComponent from '../../components/OfferListingComponent';
import  NoticeListingComponent from '../../components/NoticeListingComponent';

import addNotification from "../../../../../widgets/NotificationWidget";

import './ChangePasswordPage.css';

import {
    Button,
    InputGroup,
    FormControl,
    DropdownButton,
    Dropdown,
    Form,
    Col,
    Row
} from "react-bootstrap";


import {
    Checkbox,
    FormControlLabel,
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


export default class ChangePasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {password: null, newPassword: null, newPasswordConfirm: null};

    }

    valid() {
        return this.state.password != null && this.state.newPassword != null && this.state.newPasswordConfirm && (this.state.newPassword == this.state.newPasswordConfirm);
    }

    savePassword() {

        this.isSubmitting =  true;
        Promise.all([changePassword(this.state.password, this.state.newPassword)]).then(response => {
            addNotification("Password saved", "The password has been changed", 'success');
            this.isSubmitting =  false;
            })
        .catch(() => {
            addNotification("Error", "The password could not be saved", 'danger');
            this.isSubmitting =  false;
        });
    }

    render() {
        return (
            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="alertsResults">
                        <CodeExample beforeCodeTitle="Change Password">
                            <div className="kt-section">
                                <div className="col-md-12" >

                                    <form className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <div className="kt-section kt-section--first">
                                                <div className="kt-section__body">

                                                    <div className="kt-section__content" style={{paddingTop: '10px'}}>



                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"></label>
                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                >
                                                                    <FormControl
                                                                        placeholder="Password"
                                                                        aria-label=""
                                                                        aria-describedby="basic-addon2"
                                                                        type="password"
                                                                        style={{width: '100%'}}
                                                                        value={this.state.password} onChange={(e) => this.setState({password : e.target.value})}
                                                                        onBlur={(e) => this.setState({passwordDirty : true})}

                                                                    />
                                                                    {(this.state.password == null || this.state.password.length == 0) && this.state.passwordDirty ? <p class="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                </InputGroup>

                                                            </div>

                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"></label>
                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                >
                                                                    <FormControl
                                                                        placeholder="New Password"
                                                                        aria-label=""
                                                                        type="password"
                                                                        aria-describedby="basic-addon2"
                                                                        style={{width: '100%'}}

                                                                        value={this.state.newPassword} onChange={(e) => this.setState({newPassword : e.target.value})}
                                                                        onBlur={(e) => this.setState({newPasswordDirty : true})}

                                                                    />
                                                                    {(this.state.newPassword == null || this.state.newPassword.length == 0) && this.state.newPasswordDirty ? <p class="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}
                                                                    {this.state.newPassword != null && this.state.newPassword.length < 4  && this.state.newPasswordDirty ? <p class="error_field MuiFormHelperText-root Mui-error">The password must have at least 4 characters</p> : <></>}
                                                                </InputGroup>
                                                            </div>

                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"></label>
                                                                <InputGroup className="col-xl-3 col-lg-3" >
                                                                    <FormControl
                                                                        placeholder="Confirm New Password"
                                                                        aria-label=""
                                                                        type="password"
                                                                        aria-describedby="basic-addon2"
                                                                        style={{width: '100%'}}

                                                                        value={this.state.newPasswordConfirm} onChange={(e) => this.setState({newPasswordConfirm : e.target.value})}
                                                                        onBlur={(e) => this.setState({newPasswordConfirmDirty : true})}

                                                                    />
                                                                    {(this.state.newPasswordConfirm == null || this.state.newPasswordConfirm.length == 0) && this.state.newPasswordConfirmDirty ? <p class="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}
                                                                    {(this.state.newPasswordConfirm != null && this.state.newPasswordConfirm.length > 0) && this.state.newPasswordConfirm != this.state.newPassword && this.state.newPasswordConfirmDirty ? <p class="error_field MuiFormHelperText-root Mui-error">The two passwords don't match</p> : <></>}

                                                                </InputGroup>
                                                            </div>

                                                            <div className="col-xl-6 col-lg-6"  style={{display: 'flex'}}>

                                                                <div className="col-xl-6 col-lg-6" >
                                                                </div>

                                                                <div className="col-xl-6 col-lg-6" style={{textAlign: 'center'}} >

                                                                    <button disabled={!this.valid() || this.isSubmitting}
                                                                            type="button"
                                                                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                            onClick={(e) => this.savePassword()}
                                                                    >
                                                                        Submit
                                                                    </button>

                                                                </div>
                                                            </div>

                                                    </div>
                                                 </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>
            </div>
            </>
        )}
}