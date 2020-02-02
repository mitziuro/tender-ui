import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../../components/AlertListingComponent';
import  OfferListingComponent from '../../components/OfferListingComponent';
import  NoticeListingComponent from '../../components/NoticeListingComponent';
import LanguageSelector from "../../../../../partials/layout/LanguageSelector";

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

import { getUserByToken, saveUserByToken } from '../../../../../crud/auth.crud';

import './PersonalPage.css';


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


export default class AlertsPage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {user: {}, img:''};
        Promise.all([getUserByToken()]).then(response => {
            var md5 = require('md5');
            var user = response[0].data;
            this.setState({user: user, img: 'http://gravatar.com/avatar/' + md5(user.login)});
        });


        this.applyUserProp = this.applyUserProp.bind(this);
        this.save = this.save.bind(this);
    }

    save = () => {
        Promise.all([saveUserByToken(this.state.user)]).then(response => {
            setTimeout(()=> window.location.reload(), 400);
        });
    }


    applyUserProp = (name, v) => {
        this.state.user[name] = v;
        this.setState({user: this.state.user});
    }


    render() {
        return (
            <>
            <div className="kt-grid__item kt-grid__item--fluid kt-app__content">
                <div className="row">
                    <div className="col-xl-12">

                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">Personal Information <small>update your personal informaiton</small></h3>
                                </div>
                                <div className="kt-portlet__head-toolbar">
                                    <div className="kt-portlet__head-wrapper">
                                        <div className="dropdown dropdown-inline">

                                            <div className="dropdown-menu dropdown-menu-right">
                                                <ul className="kt-nav">
                                                    <li className="kt-nav__section kt-nav__section--first">
                                                        <span className="kt-nav__section-text">Export Tools</span>
                                                    </li>
                                                    <li className="kt-nav__item">
                                                        <a href="#" className="kt-nav__link">
                                                            <i className="kt-nav__link-icon la la-print"></i>
                                                            <span className="kt-nav__link-text">Print</span>
                                                        </a>
                                                    </li>
                                                    <li className="kt-nav__item">
                                                        <a href="#" className="kt-nav__link">
                                                            <i className="kt-nav__link-icon la la-copy"></i>
                                                            <span className="kt-nav__link-text">Copy</span>
                                                        </a>
                                                    </li>
                                                    <li className="kt-nav__item">
                                                        <a href="#" className="kt-nav__link">
                                                            <i className="kt-nav__link-icon la la-file-excel-o"></i>
                                                            <span className="kt-nav__link-text">Excel</span>
                                                        </a>
                                                    </li>
                                                    <li className="kt-nav__item">
                                                        <a href="#" className="kt-nav__link">
                                                            <i className="kt-nav__link-icon la la-file-text-o"></i>
                                                            <span className="kt-nav__link-text">CSV</span>
                                                        </a>
                                                    </li>
                                                    <li className="kt-nav__item">
                                                        <a href="#" className="kt-nav__link">
                                                            <i className="kt-nav__link-icon la la-file-pdf-o"></i>
                                                            <span className="kt-nav__link-text">PDF</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form className="kt-form kt-form--label-right">
                                <div className="kt-portlet__body">
                                    <div className="kt-section kt-section--first">
                                        <div className="kt-section__body">
                                            <div className="row">
                                                <label className="col-xl-3"></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <h3 className="kt-section__title kt-section__title-sm">User Info:</h3>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">Avatar</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <div className="kt-avatar kt-avatar--outline" id="kt_user_avatar">
                                                        <div className="kt-avatar__holder">
                                                            <img src={this.state.img} style={{width: "100%"}}/>
                                                        </div>
                                                        <a target="_blank" href="https://en.gravatar.com/">
                                                            <label className="kt-avatar__upload" data-toggle="kt-tooltip" title="" data-original-title="Change avatar">
                                                                <i className="fa fa-pen"></i>
                                                            </label>
                                                        </a>
                                                        <span className="kt-avatar__cancel" data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
                                                            <i className="fa fa-times"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">First Name</label>
                                                <InputGroup className="col-xl-3 col-lg-3"

                                                >
                                                    <FormControl
                                                        placeholder="First Name"
                                                        aria-label="First Name"
                                                        aria-describedby="basic-addon2"
                                                        value={this.state.user.firstName} onChange={(e) => this.applyUserProp('firstName' , e.target.value)}

                                                    />
                                                </InputGroup>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">Last Name</label>
                                                <InputGroup className="col-xl-3 col-lg-3" >
                                                    <FormControl
                                                        placeholder="Last Name"
                                                        aria-label="Last Name"
                                                        aria-describedby="basic-addon2"
                                                        value={this.state.user.lastName} onChange={(e) => this.applyUserProp('lastName' , e.target.value)}
                                                    />
                                                </InputGroup>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">Company Name</label>
                                                <InputGroup className="col-lg-9 col-xl-6 col-form-label" >
                                                    <FormControl
                                                        placeholder="Company" value={this.state.user.company}
                                                        aria-label="Company"
                                                        aria-describedby="basic-addon2" onChange={(e) => this.applyUserProp('company' , e.target.value)}
                                                    />
                                                </InputGroup>
                                            </div>

                                            <div className="row">
                                                <label className="col-xl-3"></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <h3 className="kt-section__title kt-section__title-sm">Contact Info:</h3>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">Contact Phone</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <InputGroup className="col-form-label" >
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text><i className="la la-phone"></i></InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            placeholder="Phone"
                                                            aria-label="Phone" value={this.state.user.phone}
                                                            aria-describedby="basic-addon2" onChange={(e) => this.applyUserProp('phone' , e.target.value)}
                                                        />
                                                    </InputGroup>
                                                    <span className="form-text text-muted">We'll never share your phone with anyone else.</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">Email Address</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <InputGroup className="col-form-label">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text><i className="la la-at"></i></InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            disabled="true"
                                                            value={this.state.user.email}
                                                            placeholder="Email"
                                                            aria-label="Email"
                                                            aria-describedby="basic-addon2" onChange={(e) => this.applyUserProp('email' , e.target.value)}
                                                        />
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <div className="form-group form-group-last row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">Company Site</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <InputGroup className="col-form-label" value={this.state.user.companySite}>
                                                        <FormControl
                                                            placeholder="Company"
                                                            aria-label="Company"
                                                            aria-describedby="basic-addon2" value={this.state.user.companySite}
                                                            onChange={(e) => this.applyUserProp('companySite' , e.target.value)}
                                                        />
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <div className="form-group form-group-last row">
                                                <label className="col-xl-3 col-lg-3 col-form-label">Language Selector</label>
                                                <div className="">
                                                    <select style={{position: "relative", top: "8px", left: "10px"}} value={this.state.user.langKey} onChange={(e) => this.applyUserProp('langKey' , e.target.value)}>
                                                        <option  value="ro">Romanian</option>
                                                        <option  value="en">English</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="kt-portlet__foot">
                                    <div className="kt-form__actions">
                                        <div className="row">
                                            <div className="col-lg-3 col-xl-3">
                                            </div>
                                            <div className="col-lg-9 col-xl-9">
                                                <button type="reset" className="btn btn-success" onClick={this.save}>Submit</button>&nbsp;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )}
}