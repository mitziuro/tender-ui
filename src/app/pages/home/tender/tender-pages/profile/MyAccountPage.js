import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../../components/AlertListingComponent';
import  OfferListingComponent from '../../components/OfferListingComponent';
import  NoticeListingComponent from '../../components/NoticeListingComponent';
import LanguageSelector from "../../../../../partials/layout/LanguageSelector";

import addNotification from "../../../../../widgets/NotificationWidget";

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
import { getUser, saveUser } from '../../../../../crud/tender/user.details.crud';

import './wizard.css';

import $ from 'jquery';
import 'jquery-ui-bundle';

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


export default class MyAccountPage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {s1: {}, s2:{}, s3: {},  img:'', active: 's1'};
        Promise.all([getUserByToken()]).then(response => {
            var md5 = require('md5');
            var user = response[0].data;
            this.setState({s1: user, img: 'http://gravatar.com/avatar/' + md5(user.login)});

            if(this.state.s1.id != null) {
                Promise.all([getUser(this.state.s1.id)]).then(response => {
                    let s2  = {
                        invFirstName : response[0].data.invFirstName,
                        invLastName : response[0].data.invLastName,
                        invPhone : response[0].data.invPhone,
                        invCnp : response[0].data.invCnp,
                        invAddress : response[0].data.invAddress,

                        invCompanyName : response[0].data.invCompanyName,
                        invVat : response[0].data.invVat,
                        invRegistrationNumber : response[0].data.invRegistrationNumber,
                        invBankName : response[0].data.invBankName,
                        invBankAccount : response[0].data.invBankAccount,
                        invCompanyAddress : response[0].data.invCompanyAddress,

                        invPaymentType: response[0].data.invPaymentType
                    };

                    let s3  = {
                        country: response[0].data.country,
                        county: response[0].data.county,
                        city: response[0].data.city,
                        address: response[0].data.address,
                        postalCode: response[0].data.postalCode
                    };

                    this.setState({s1: this.state.s1, s2: s2, s3: s3});
                    this.moveToPage(props);
                });
            } else {
                this.moveToPage(props);
            }

        });


        this.applyUserProp = this.applyUserProp.bind(this);
        this.save = this.save.bind(this);
        this.getRequiredFields = this.getRequiredFields.bind(this);
        this.getNextState = this.getNextState.bind(this);
        this.getPreviousState = this.getPreviousState.bind(this);
        this.makeAllDirty = this.makeAllDirty.bind(this);
        this.moveToState = this.moveToState.bind(this);
        this.moveToPage = this.moveToPage.bind(this);

    }


    moveToPage = (props) => {

        if(props.location.pathname.split('/')[props.location.pathname.split('/').length - 1] == 'MyInvoicePage'){
            this.moveToState('s2');
        } else if(props.location.pathname.split('/')[props.location.pathname.split('/').length - 1] == 'MyMailPage'){
            this.moveToState('s2');
            this.moveToState('s3');
        } else {
            //s1
        }

    }

    save = () => {

        let userDetails = {};

        userDetails.invFirstName = this.state.s2.invFirstName;
        userDetails.invLastName = this.state.s2.invLastName;
        userDetails.invPhone = this.state.s2.invPhone;
        userDetails.invCnp = this.state.s2.invCnp;
        userDetails.invAddress = this.state.s2.invAddress;

        userDetails.invCompanyName = this.state.s2.invCompanyName;
        userDetails.invVat = this.state.s2.invVat;
        userDetails.invRegistrationNumber = this.state.s2.invRegistrationNumber;
        userDetails.invBankName = this.state.s2.invBankName;
        userDetails.invBankAccount = this.state.s2.invBankAccount;
        userDetails.invCompanyAddress = this.state.s2.invCompanyAddress;

        userDetails.invPaymentType = this.state.s2.invPaymentType;

        userDetails.country = this.state.s3.country;
        userDetails.county = this.state.s3.county;
        userDetails.city = this.state.s3.city;
        userDetails.address = this.state.s3.address;
        userDetails.postalCode = this.state.s3.postalCode;

        userDetails.id = this.state.s1.id;


        Promise.all([saveUserByToken(this.state.s1), saveUser(userDetails)]).then(response => {
            setTimeout(()=> {
                this.setState({active: 's1'});
                addNotification("Success", "The data has been saved", 'success');
            }, 0);
        }).catch(() => {
            addNotification("Error", "The data could not be saved", 'danger');
        })
    }


    applyUserProp = (name, v, state) => {
        if(state == null) {
            state = 's1';
        }
        this.state[state][name] = v;
        this.setState({s1: this.state.s1, s2: this.state.s2, s3: this.state.s3});
    }

    getRequiredFields(state:string) {

        let activeState = (state != null ? state : this.state.active);


        if(activeState == 's1') {
            return  ["firstName", "lastName", "email", "phone", "company", "type"];
        }

        if(activeState == 's2') {
            return ['invFirstName', 'invLastName', 'invPhone', 'invCnp', 'invAddress', 'invCompanyName', 'invVat', 'invRegistrationNumber', 'invBankName', 'invBankAccount', 'invCompanyAddress', 'invPaymentType'];
        }

        if(activeState == 's3') {
            return ['country', 'county', 'city', 'address', 'postalCode'];
        }

        return [];

    }

    makeAllDirty(yes: boolean, state: string) {
        let activeState = (state != null ? state : this.state.active);

        this.getRequiredFields(activeState).map(f => f + 'Dirty').forEach(f => {this.state[f] = (yes == true ? true : null);});
        this.setState({});
    }

    getNextState() {
        this.makeAllDirty(false);
        if(this.state.active == 's1') {
            this.setState({active: 's2'});
        }

        if(this.state.active == 's2') {
            this.setState({active: 's3'});
        }

        if(this.state.active == 's3') {
            this.setState({active: 's4'});
            console.log($('#country'));
            $('#country_inline').html($('#country option:selected').text());
        }

        return 's1';
    }

    getPreviousState() {
        this.makeAllDirty(false);
        if(this.state.active == 's2') {
            this.setState({active: 's1'});
        }

        if(this.state.active == 's3') {
            this.setState({active: 's2'});
        }

        if(this.state.active == 's4') {
            this.setState({active: 's3'});
        }

        return 's1';
    }

    moveToState(state) {
        this.makeAllDirty(false);

        if(state == 's4') {
            if(this.valid('s3')) {
                this.setState({active: 's4'});
                return;
            }

            state = 's3';

        }

        if(state == 's3') {
            if(this.valid('s2')) {
                this.setState({active: 's3'});
                this.makeAllDirty(true, 's3');
                return;
            }

            state = 's2';

        }

        if(state == 's2') {
            if(this.valid('s1')) {
                this.setState({active: 's2'});
                this.makeAllDirty(true, 's2');
                return;
            }

            state = 's1';
        }

        if(state == 's1') {
            this.setState({active: 's1'});
            this.makeAllDirty(true, 's1');
            return;
        }

    }


    valid = (state: string) => {

        let activeState = (state != null ? state : this.state.active);
        let failed = this.getRequiredFields(activeState).filter(k => this.state[activeState][k] == null || this.state[activeState][k].length == 0).length;
        return failed == 0 ? true : false;
    }

    render() {
        return (
            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="alertsResults">
                        <CodeExample beforeCodeTitle="My Account">

                            <div className="kt-section">
                                <div className="col-md-12" >
                                    <div className="kt-section__content">
                                        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                                            <div className="kt-wizard-v4" id="kt_user_add_user" data-ktwizard-state="first">
                                                <div className="kt-wizard-v4__nav">
                                                    <div className="kt-wizard-v4__nav-items nav">
                                                        <a className="kt-wizard-v4__nav-item nav-item"  onClick={(e) => this.moveToState('s1')} href="#"  data-ktwizard-state={this.state.active == 's1' ? 'current' : 'pending'}>
                                                            <div className="kt-wizard-v4__nav-body">
                                                                <div className="kt-wizard-v4__nav-number">
                                                                    1
                                                                </div>
                                                                <div className="kt-wizard-v4__nav-label">
                                                                    <div className="kt-wizard-v4__nav-label-title">
                                                                        Profile
                                                                    </div>
                                                                    <div className="kt-wizard-v4__nav-label-desc">
                                                                       Personal Information
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="kt-wizard-v4__nav-item nav-item" href="#" onClick={(e) => this.moveToState('s2')} data-ktwizard-state={this.state.active == 's2' ? 'current' : 'pending'}>
                                                            <div className="kt-wizard-v4__nav-body">
                                                                <div className="kt-wizard-v4__nav-number">
                                                                    2
                                                                </div>
                                                                <div className="kt-wizard-v4__nav-label">
                                                                    <div className="kt-wizard-v4__nav-label-title">
                                                                        Invoicing
                                                                    </div>
                                                                    <div className="kt-wizard-v4__nav-label-desc">
                                                                        Invoicing Details
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="kt-wizard-v4__nav-item nav-item" href="#" onClick={(e) => this.moveToState('s3')} data-ktwizard-state={this.state.active == 's3' ? 'current' : 'pending'}>
                                                            <div className="kt-wizard-v4__nav-body">
                                                                <div className="kt-wizard-v4__nav-number">
                                                                    3
                                                                </div>
                                                                <div className="kt-wizard-v4__nav-label">
                                                                    <div className="kt-wizard-v4__nav-label-title">
                                                                        Mail
                                                                    </div>
                                                                    <div className="kt-wizard-v4__nav-label-desc">
                                                                       Mailing Address
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="kt-wizard-v4__nav-item nav-item" href="#" onClick={(e) => this.moveToState('s4')} data-ktwizard-state={this.state.active == 's4' ? 'current' : 'pending'}>
                                                            <div className="kt-wizard-v4__nav-body">
                                                                <div className="kt-wizard-v4__nav-number">
                                                                    4
                                                                </div>
                                                                <div className="kt-wizard-v4__nav-label">
                                                                    <div className="kt-wizard-v4__nav-label-title">
                                                                        Revision
                                                                    </div>
                                                                    <div className="kt-wizard-v4__nav-label-desc">
                                                                        Saving the data
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="kt-portlet">
                                                    <div className="kt-portlet__body kt-portlet__body--fit">
                                                        <div className="kt-grid">
                                                            <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v4__wrapper">
                                                                <form className="kt-form" id="kt_user_add_form" novalidate="novalidate">
                                                                    <div className="kt-wizard-v4__content" data-ktwizard-type="step-content" data-ktwizard-state={this.state.active == 's1' ? 'current' : 'pending'}>
                                                                        <div className="kt-heading kt-heading--md"></div>
                                                                        <div className="kt-section kt-section--first">
                                                                            <div className="kt-wizard-v4__form">
                                                                                <div className="row">
                                                                                    <div className="col-xl-12">
                                                                                        <div className="kt-section__body">


                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Foto</label>
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
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s1.firstName} onChange={(e) => this.applyUserProp('firstName' , e.target.value)}
                                                                                                        onBlur={(e) => this.setState({firstNameDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s1.firstName == null || this.state.s1.firstName.length == 0) && this.state.firstNameDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>
                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Last Name</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Last Name"
                                                                                                        aria-label="Last Name"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s1.lastName} onChange={(e) => this.applyUserProp('lastName' , e.target.value)}
                                                                                                        onBlur={(e) => this.setState({lastNameDirty : true})}

                                                                                                    />
                                                                                                    {(this.state.s1.lastName == null || this.state.s1.lastName.length == 0) && this.state.lastNameDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>
                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Company</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Company Name"
                                                                                                        aria-label="Company Name"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s1.company} onChange={(e) => this.applyUserProp('company' , e.target.value)}
                                                                                                        onBlur={(e) => this.setState({companyDirty : true})}

                                                                                                    />
                                                                                                    {(this.state.s1.company == null || this.state.s1.company.length == 0) && this.state.companyDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>
                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Phone</label>
                                                                                                <div className="col-lg-9 col-xl-6">
                                                                                                    <InputGroup className="col-form-label" >

                                                                                                        <FormControl
                                                                                                            style={{width: '100%'}}

                                                                                                            placeholder="Phone"
                                                                                                            aria-label="Phone" value={this.state.s1.phone}
                                                                                                            aria-describedby="basic-addon2" onChange={(e) => this.applyUserProp('phone' , e.target.value)}
                                                                                                            onBlur={(e) => this.setState({phoneDirty : true})}

                                                                                                        />
                                                                                                    </InputGroup>
                                                                                                    {(this.state.s1.phone == null || this.state.s1.phone.length == 0) && this.state.phoneDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}
                                                                                                </div>
                                                                                            </div>



                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Email</label>
                                                                                                <div className="col-lg-9 col-xl-6">
                                                                                                    <InputGroup className="col-form-label">
                                                                                                        <FormControl
                                                                                                            style={{width: '100%'}}

                                                                                                            value={this.state.s1.email}
                                                                                                            placeholder="Email"
                                                                                                            aria-label="Email"
                                                                                                            aria-describedby="basic-addon2" onChange={(e) => this.applyUserProp('email' , e.target.value)}
                                                                                                            onBlur={(e) => this.setState({emailDirty : true})}

                                                                                                        />
                                                                                                        {(this.state.s1.email == null || this.state.s1.email.length == 0) && this.state.emailDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                    </InputGroup>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="form-group form-group-last row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Profile Type</label>
                                                                                                <div className="">
                                                                                                    <select style={{position: "relative", top: "8px", left: "10px", width: '100%'}} value={this.state.s1.type} onChange={(e) => this.applyUserProp('type' , e.target.value)}    onBlur={(e) => this.setState({typeDirty : true})}

                                                                                                    >
                                                                                                        <option  value=""> Select </option>
                                                                                                        <option  value="1"> Bidder </option>
                                                                                                        <option  value="2"> Expert </option>
                                                                                                    </select>
                                                                                                    {(this.state.s1.type == null || this.state.s1.type == '') && this.state.typeDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </div>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="kt-wizard-v4__content" data-ktwizard-type="step-content" data-ktwizard-state={this.state.active == 's2' ? 'current' : 'pending'}>
                                                                        <div className="kt-section kt-section--first">
                                                                            <div className="kt-wizard-v4__form">
                                                                                <div className="row">
                                                                                    <div className="col-xl-12">
                                                                                        <div className="kt-section__body">

                                                                                            <div className="form-group row">
                                                                                                <div className="col-lg-9 col-xl-6">
                                                                                                    <h3 className="kt-section__title kt-section__title-md">Individual person</h3>
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
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invFirstName} onChange={(e) => this.applyUserProp('invFirstName' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invFirstNameDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s2.invFirstName == null || this.state.s2.invFirstName.length == 0) && this.state.invFirstNameDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>
                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Last Name</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Last Name"
                                                                                                        aria-label="Last Name"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invLastName} onChange={(e) => this.applyUserProp('invLastName' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invLastNameDirty : true})}

                                                                                                    />
                                                                                                    {(this.state.s2.invLastName == null || this.state.s2.invLastName.length == 0) && this.state.invLastNameDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Contact Phone</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Phone"
                                                                                                        aria-label="Contact Phone"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invPhone} onChange={(e) => this.applyUserProp('invPhone' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invPhoneDirty : true})}

                                                                                                    />
                                                                                                    {(this.state.s2.invPhone == null || this.state.s2.invPhone.length == 0) && this.state.invPhoneDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Personal Identification Number (CNP)</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="CNP"
                                                                                                        aria-label="CNP"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invCnp} onChange={(e) => this.applyUserProp('invCnp' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invCnpDirty : true})}

                                                                                                    />
                                                                                                    {(this.state.s2.invCnp == null || this.state.s2.invCnp.length == 0) && this.state.invCnpDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Invoicing address</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Address"
                                                                                                        aria-label="Address"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invAddress} onChange={(e) => this.applyUserProp('invAddress' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invAddressDirty : true})}

                                                                                                    />
                                                                                                    {(this.state.s2.invAddress == null || this.state.s2.invAddress.length == 0) && this.state.invAddressDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <div className="col-lg-9 col-xl-6">
                                                                                                    <h3 className="kt-section__title kt-section__title-md">Company</h3>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Company Name</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Company Name"
                                                                                                        aria-label="Company Name"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invCompanyName} onChange={(e) => this.applyUserProp('invCompanyName' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invCompanyNameDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s2.invCompanyName == null || this.state.s2.invCompanyName.length == 0) && this.state.invCompanyNameDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>


                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">VAT Code</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="VAT"
                                                                                                        aria-label="VAT Code"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invVat} onChange={(e) => this.applyUserProp('invVat' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invVatDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s2.invVat == null || this.state.s2.invVat.length == 0) && this.state.invVatDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Registration Number</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Registration Number"
                                                                                                        aria-label="Registration Number"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invRegistrationNumber} onChange={(e) => this.applyUserProp('invRegistrationNumber' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invRegistrationNumberDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s2.invRegistrationNumber == null || this.state.s2.invRegistrationNumber.length == 0) && this.state.invRegistrationNumberDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Bank Name</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Bank Name"
                                                                                                        aria-label="Bank Name"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invBankName} onChange={(e) => this.applyUserProp('invBankName' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invBankNameDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s2.invBankName == null || this.state.s2.invBankName.length == 0) && this.state.invBankNameDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Bank Account</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Bank Account"
                                                                                                        aria-label="Bank Account"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invBankAccount} onChange={(e) => this.applyUserProp('invBankAccount' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invBankAccountDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s2.invBankAccount == null || this.state.s2.invBankAccount.length == 0) && this.state.invBankAccountDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Company Address</label>
                                                                                                <InputGroup className="col-xl-3 col-lg-3"

                                                                                                >
                                                                                                    <FormControl
                                                                                                        placeholder="Company Address"
                                                                                                        aria-label="Company Address"
                                                                                                        aria-describedby="basic-addon2"
                                                                                                        style={{width: '100%'}}

                                                                                                        value={this.state.s2.invCompanyAddress} onChange={(e) => this.applyUserProp('invCompanyAddress' , e.target.value, 's2')}
                                                                                                        onBlur={(e) => this.setState({invCompanyAddressDirty : true})}


                                                                                                    />
                                                                                                    {(this.state.s2.invCompanyAddress == null || this.state.s2.invCompanyAddress.length == 0) && this.state.invCompanyAddressDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </InputGroup>
                                                                                            </div>

                                                                                            <div className="form-group form-group-last row">
                                                                                                <label className="col-xl-3 col-lg-3 col-form-label">Payment Type</label>
                                                                                                <div className="">
                                                                                                    <select style={{position: "relative", top: "8px", left: "10px", width: '100%'}} value={this.state.s2.invPaymentType} onChange={(e) => this.applyUserProp('invPaymentType' , e.target.value, 's2')}    onBlur={(e) => this.setState({invPaymentTypeDirty : true})}

                                                                                                    >
                                                                                                        <option value=""> Select </option>
                                                                                                        <option  value="1"> Credit / debit card </option>
                                                                                                        <option  value="2"> Bank Transfer </option>
                                                                                                        <option  value="3"> Payment Order </option>

                                                                                                    </select>
                                                                                                    {(this.state.s2.invPaymentType == null || this.state.s2.invPaymentType == '') && this.state.invPaymentTypeDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                                </div>
                                                                                            </div>


                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="kt-wizard-v4__content" data-ktwizard-type="step-content" data-ktwizard-state={this.state.active == 's3' ? 'current' : 'pending'}>
                                                                        <div className="kt-form__section kt-form__section--first">
                                                                            <div className="kt-wizard-v4__form">
                                                                                    <div className="row">
                                                                                        <div className="col-xl-12">
                                                                                            <div className="kt-section__body">
                                                                                <div className="form-group row">
                                                                                        <label className="col-xl-3 col-lg-3 col-form-label" >Country</label>
                                                                                        <div>
                                                                                        <select style={{position: "relative", top: "8px", left: "6px", width: '100%'}}  name="country" className="form-control"
                                                                                                value={this.state.s3.country} onChange={(e) => this.applyUserProp('country' , e.target.value, 's3')}    onBlur={(e) => this.setState({countryDirty : true})}>
                                                                                            <option value="">Select</option>
                                                                                            <option value="AF">Afghanistan</option>
                                                                                            <option value="AX">Åland Islands</option>
                                                                                            <option value="AL">Albania</option>
                                                                                            <option value="DZ">Algeria</option>
                                                                                            <option value="AS">American Samoa</option>
                                                                                            <option value="AD">Andorra</option>
                                                                                            <option value="AO">Angola</option>
                                                                                            <option value="AI">Anguilla</option>
                                                                                            <option value="AQ">Antarctica</option>
                                                                                            <option value="AG">Antigua and Barbuda</option>
                                                                                            <option value="AR">Argentina</option>
                                                                                            <option value="AM">Armenia</option>
                                                                                            <option value="AW">Aruba</option>
                                                                                            <option value="AU" selected="">Australia</option>
                                                                                            <option value="AT">Austria</option>
                                                                                            <option value="AZ">Azerbaijan</option>
                                                                                            <option value="BS">Bahamas</option>
                                                                                            <option value="BH">Bahrain</option>
                                                                                            <option value="BD">Bangladesh</option>
                                                                                            <option value="BB">Barbados</option>
                                                                                            <option value="BY">Belarus</option>
                                                                                            <option value="BE">Belgium</option>
                                                                                            <option value="BZ">Belize</option>
                                                                                            <option value="BJ">Benin</option>
                                                                                            <option value="BM">Bermuda</option>
                                                                                            <option value="BT">Bhutan</option>
                                                                                            <option value="BO">Bolivia, Plurinational State of</option>
                                                                                            <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                                                                            <option value="BA">Bosnia and Herzegovina</option>
                                                                                            <option value="BW">Botswana</option>
                                                                                            <option value="BV">Bouvet Island</option>
                                                                                            <option value="BR">Brazil</option>
                                                                                            <option value="IO">British Indian Ocean Territory</option>
                                                                                            <option value="BN">Brunei Darussalam</option>
                                                                                            <option value="BG">Bulgaria</option>
                                                                                            <option value="BF">Burkina Faso</option>
                                                                                            <option value="BI">Burundi</option>
                                                                                            <option value="KH">Cambodia</option>
                                                                                            <option value="CM">Cameroon</option>
                                                                                            <option value="CA">Canada</option>
                                                                                            <option value="CV">Cape Verde</option>
                                                                                            <option value="KY">Cayman Islands</option>
                                                                                            <option value="CF">Central African Republic</option>
                                                                                            <option value="TD">Chad</option>
                                                                                            <option value="CL">Chile</option>
                                                                                            <option value="CN">China</option>
                                                                                            <option value="CX">Christmas Island</option>
                                                                                            <option value="CC">Cocos (Keeling) Islands</option>
                                                                                            <option value="CO">Colombia</option>
                                                                                            <option value="KM">Comoros</option>
                                                                                            <option value="CG">Congo</option>
                                                                                            <option value="CD">Congo, the Democratic Republic of the</option>
                                                                                            <option value="CK">Cook Islands</option>
                                                                                            <option value="CR">Costa Rica</option>
                                                                                            <option value="CI">Côte d'Ivoire</option>
                                                                                            <option value="HR">Croatia</option>
                                                                                            <option value="CU">Cuba</option>
                                                                                            <option value="CW">Curaçao</option>
                                                                                            <option value="CY">Cyprus</option>
                                                                                            <option value="CZ">Czech Republic</option>
                                                                                            <option value="DK">Denmark</option>
                                                                                            <option value="DJ">Djibouti</option>
                                                                                            <option value="DM">Dominica</option>
                                                                                            <option value="DO">Dominican Republic</option>
                                                                                            <option value="EC">Ecuador</option>
                                                                                            <option value="EG">Egypt</option>
                                                                                            <option value="SV">El Salvador</option>
                                                                                            <option value="GQ">Equatorial Guinea</option>
                                                                                            <option value="ER">Eritrea</option>
                                                                                            <option value="EE">Estonia</option>
                                                                                            <option value="ET">Ethiopia</option>
                                                                                            <option value="FK">Falkland Islands (Malvinas)</option>
                                                                                            <option value="FO">Faroe Islands</option>
                                                                                            <option value="FJ">Fiji</option>
                                                                                            <option value="FI">Finland</option>
                                                                                            <option value="FR">France</option>
                                                                                            <option value="GF">French Guiana</option>
                                                                                            <option value="PF">French Polynesia</option>
                                                                                            <option value="TF">French Southern Territories</option>
                                                                                            <option value="GA">Gabon</option>
                                                                                            <option value="GM">Gambia</option>
                                                                                            <option value="GE">Georgia</option>
                                                                                            <option value="DE">Germany</option>
                                                                                            <option value="GH">Ghana</option>
                                                                                            <option value="GI">Gibraltar</option>
                                                                                            <option value="GR">Greece</option>
                                                                                            <option value="GL">Greenland</option>
                                                                                            <option value="GD">Grenada</option>
                                                                                            <option value="GP">Guadeloupe</option>
                                                                                            <option value="GU">Guam</option>
                                                                                            <option value="GT">Guatemala</option>
                                                                                            <option value="GG">Guernsey</option>
                                                                                            <option value="GN">Guinea</option>
                                                                                            <option value="GW">Guinea-Bissau</option>
                                                                                            <option value="GY">Guyana</option>
                                                                                            <option value="HT">Haiti</option>
                                                                                            <option value="HM">Heard Island and McDonald Islands</option>
                                                                                            <option value="VA">Holy See (Vatican City State)</option>
                                                                                            <option value="HN">Honduras</option>
                                                                                            <option value="HK">Hong Kong</option>
                                                                                            <option value="HU">Hungary</option>
                                                                                            <option value="IS">Iceland</option>
                                                                                            <option value="IN">India</option>
                                                                                            <option value="ID">Indonesia</option>
                                                                                            <option value="IR">Iran, Islamic Republic of</option>
                                                                                            <option value="IQ">Iraq</option>
                                                                                            <option value="IE">Ireland</option>
                                                                                            <option value="IM">Isle of Man</option>
                                                                                            <option value="IL">Israel</option>
                                                                                            <option value="IT">Italy</option>
                                                                                            <option value="JM">Jamaica</option>
                                                                                            <option value="JP">Japan</option>
                                                                                            <option value="JE">Jersey</option>
                                                                                            <option value="JO">Jordan</option>
                                                                                            <option value="KZ">Kazakhstan</option>
                                                                                            <option value="KE">Kenya</option>
                                                                                            <option value="KI">Kiribati</option>
                                                                                            <option value="KP">Korea, Democratic People's Republic of</option>
                                                                                            <option value="KR">Korea, Republic of</option>
                                                                                            <option value="KW">Kuwait</option>
                                                                                            <option value="KG">Kyrgyzstan</option>
                                                                                            <option value="LA">Lao People's Democratic Republic</option>
                                                                                            <option value="LV">Latvia</option>
                                                                                            <option value="LB">Lebanon</option>
                                                                                            <option value="LS">Lesotho</option>
                                                                                            <option value="LR">Liberia</option>
                                                                                            <option value="LY">Libya</option>
                                                                                            <option value="LI">Liechtenstein</option>
                                                                                            <option value="LT">Lithuania</option>
                                                                                            <option value="LU">Luxembourg</option>
                                                                                            <option value="MO">Macao</option>
                                                                                            <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                                                                                            <option value="MG">Madagascar</option>
                                                                                            <option value="MW">Malawi</option>
                                                                                            <option value="MY">Malaysia</option>
                                                                                            <option value="MV">Maldives</option>
                                                                                            <option value="ML">Mali</option>
                                                                                            <option value="MT">Malta</option>
                                                                                            <option value="MH">Marshall Islands</option>
                                                                                            <option value="MQ">Martinique</option>
                                                                                            <option value="MR">Mauritania</option>
                                                                                            <option value="MU">Mauritius</option>
                                                                                            <option value="YT">Mayotte</option>
                                                                                            <option value="MX">Mexico</option>
                                                                                            <option value="FM">Micronesia, Federated States of</option>
                                                                                            <option value="MD">Moldova, Republic of</option>
                                                                                            <option value="MC">Monaco</option>
                                                                                            <option value="MN">Mongolia</option>
                                                                                            <option value="ME">Montenegro</option>
                                                                                            <option value="MS">Montserrat</option>
                                                                                            <option value="MA">Morocco</option>
                                                                                            <option value="MZ">Mozambique</option>
                                                                                            <option value="MM">Myanmar</option>
                                                                                            <option value="NA">Namibia</option>
                                                                                            <option value="NR">Nauru</option>
                                                                                            <option value="NP">Nepal</option>
                                                                                            <option value="NL">Netherlands</option>
                                                                                            <option value="NC">New Caledonia</option>
                                                                                            <option value="NZ">New Zealand</option>
                                                                                            <option value="NI">Nicaragua</option>
                                                                                            <option value="NE">Niger</option>
                                                                                            <option value="NG">Nigeria</option>
                                                                                            <option value="NU">Niue</option>
                                                                                            <option value="NF">Norfolk Island</option>
                                                                                            <option value="MP">Northern Mariana Islands</option>
                                                                                            <option value="NO">Norway</option>
                                                                                            <option value="OM">Oman</option>
                                                                                            <option value="PK">Pakistan</option>
                                                                                            <option value="PW">Palau</option>
                                                                                            <option value="PS">Palestinian Territory, Occupied</option>
                                                                                            <option value="PA">Panama</option>
                                                                                            <option value="PG">Papua New Guinea</option>
                                                                                            <option value="PY">Paraguay</option>
                                                                                            <option value="PE">Peru</option>
                                                                                            <option value="PH">Philippines</option>
                                                                                            <option value="PN">Pitcairn</option>
                                                                                            <option value="PL">Poland</option>
                                                                                            <option value="PT">Portugal</option>
                                                                                            <option value="PR">Puerto Rico</option>
                                                                                            <option value="QA">Qatar</option>
                                                                                            <option value="RE">Réunion</option>
                                                                                            <option value="RO">Romania</option>
                                                                                            <option value="RU">Russian Federation</option>
                                                                                            <option value="RW">Rwanda</option>
                                                                                            <option value="BL">Saint Barthélemy</option>
                                                                                            <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                                                                                            <option value="KN">Saint Kitts and Nevis</option>
                                                                                            <option value="LC">Saint Lucia</option>
                                                                                            <option value="MF">Saint Martin (French part)</option>
                                                                                            <option value="PM">Saint Pierre and Miquelon</option>
                                                                                            <option value="VC">Saint Vincent and the Grenadines</option>
                                                                                            <option value="WS">Samoa</option>
                                                                                            <option value="SM">San Marino</option>
                                                                                            <option value="ST">Sao Tome and Principe</option>
                                                                                            <option value="SA">Saudi Arabia</option>
                                                                                            <option value="SN">Senegal</option>
                                                                                            <option value="RS">Serbia</option>
                                                                                            <option value="SC">Seychelles</option>
                                                                                            <option value="SL">Sierra Leone</option>
                                                                                            <option value="SG">Singapore</option>
                                                                                            <option value="SX">Sint Maarten (Dutch part)</option>
                                                                                            <option value="SK">Slovakia</option>
                                                                                            <option value="SI">Slovenia</option>
                                                                                            <option value="SB">Solomon Islands</option>
                                                                                            <option value="SO">Somalia</option>
                                                                                            <option value="ZA">South Africa</option>
                                                                                            <option value="GS">South Georgia and the South Sandwich Islands</option>
                                                                                            <option value="SS">South Sudan</option>
                                                                                            <option value="ES">Spain</option>
                                                                                            <option value="LK">Sri Lanka</option>
                                                                                            <option value="SD">Sudan</option>
                                                                                            <option value="SR">Suriname</option>
                                                                                            <option value="SJ">Svalbard and Jan Mayen</option>
                                                                                            <option value="SZ">Swaziland</option>
                                                                                            <option value="SE">Sweden</option>
                                                                                            <option value="CH">Switzerland</option>
                                                                                            <option value="SY">Syrian Arab Republic</option>
                                                                                            <option value="TW">Taiwan, Province of China</option>
                                                                                            <option value="TJ">Tajikistan</option>
                                                                                            <option value="TZ">Tanzania, United Republic of</option>
                                                                                            <option value="TH">Thailand</option>
                                                                                            <option value="TL">Timor-Leste</option>
                                                                                            <option value="TG">Togo</option>
                                                                                            <option value="TK">Tokelau</option>
                                                                                            <option value="TO">Tonga</option>
                                                                                            <option value="TT">Trinidad and Tobago</option>
                                                                                            <option value="TN">Tunisia</option>
                                                                                            <option value="TR">Turkey</option>
                                                                                            <option value="TM">Turkmenistan</option>
                                                                                            <option value="TC">Turks and Caicos Islands</option>
                                                                                            <option value="TV">Tuvalu</option>
                                                                                            <option value="UG">Uganda</option>
                                                                                            <option value="UA">Ukraine</option>
                                                                                            <option value="AE">United Arab Emirates</option>
                                                                                            <option value="GB">United Kingdom</option>
                                                                                            <option value="US">United States</option>
                                                                                            <option value="UM">United States Minor Outlying Islands</option>
                                                                                            <option value="UY">Uruguay</option>
                                                                                            <option value="UZ">Uzbekistan</option>
                                                                                            <option value="VU">Vanuatu</option>
                                                                                            <option value="VE">Venezuela, Bolivarian Republic of</option>
                                                                                            <option value="VN">Viet Nam</option>
                                                                                            <option value="VG">Virgin Islands, British</option>
                                                                                            <option value="VI">Virgin Islands, U.S.</option>
                                                                                            <option value="WF">Wallis and Futuna</option>
                                                                                            <option value="EH">Western Sahara</option>
                                                                                            <option value="YE">Yemen</option>
                                                                                            <option value="ZM">Zambia</option>
                                                                                            <option value="ZW">Zimbabwe</option>
                                                                                        </select>
                                                                                            {(this.state.s3.country == null || this.state.s3.country == '') && this.state.countryDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                        </div>
                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                </div>


                                                                                <div className="form-group row">
                                                                                    <label className="col-xl-3 col-lg-3 col-form-label">County</label>
                                                                                    <InputGroup className="col-xl-3 col-lg-3"

                                                                                    >
                                                                                        <FormControl
                                                                                            placeholder="County"
                                                                                            aria-label="County"
                                                                                            aria-describedby="basic-addon2"
                                                                                            style={{width: '100%'}}

                                                                                            value={this.state.s3.county} onChange={(e) => this.applyUserProp('county' , e.target.value, 's3')}
                                                                                            onBlur={(e) => this.setState({countyDirty : true})}


                                                                                        />
                                                                                        {(this.state.s3.county == null || this.state.s3.county.length == 0) && this.state.countyDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                    </InputGroup>
                                                                                </div>

                                                                                <div className="form-group row">
                                                                                    <label className="col-xl-3 col-lg-3 col-form-label">City</label>
                                                                                    <InputGroup className="col-xl-3 col-lg-3"

                                                                                    >
                                                                                        <FormControl
                                                                                            placeholder="City"
                                                                                            aria-label="City"
                                                                                            aria-describedby="basic-addon2"
                                                                                            style={{width: '100%'}}

                                                                                            value={this.state.s3.city} onChange={(e) => this.applyUserProp('city' , e.target.value, 's3')}
                                                                                            onBlur={(e) => this.setState({cityDirty : true})}


                                                                                        />
                                                                                        {(this.state.s3.city == null || this.state.s3.city.length == 0) && this.state.cityDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                    </InputGroup>
                                                                                </div>

                                                                                <div className="form-group row">
                                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Address</label>
                                                                                    <InputGroup className="col-xl-3 col-lg-3"

                                                                                    >
                                                                                        <FormControl
                                                                                            placeholder="Address"
                                                                                            aria-label="Address"
                                                                                            aria-describedby="basic-addon2"
                                                                                            style={{width: '100%'}}

                                                                                            value={this.state.s3.address} onChange={(e) => this.applyUserProp('address' , e.target.value, 's3')}
                                                                                            onBlur={(e) => this.setState({addressDirty : true})}


                                                                                        />
                                                                                        {(this.state.s3.address == null || this.state.s3.address.length == 0) && this.state.addressDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                    </InputGroup>
                                                                                </div>

                                                                                <div className="form-group row">
                                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Postal Code</label>
                                                                                    <InputGroup className="col-xl-3 col-lg-3"

                                                                                    >
                                                                                        <FormControl
                                                                                            placeholder="Postal Code"
                                                                                            aria-label="Postal Code"
                                                                                            aria-describedby="basic-addon2"
                                                                                            style={{width: '100%'}}

                                                                                            value={this.state.s3.postalCode} onChange={(e) => this.applyUserProp('postalCode' , e.target.value, 's3')}
                                                                                            onBlur={(e) => this.setState({postalCodeDirty : true})}


                                                                                        />
                                                                                        {(this.state.s3.postalCode == null || this.state.s3.postalCode.length == 0) && this.state.postalCodeDirty ? <p className="error_field MuiFormHelperText-root Mui-error">Required field</p> : <></>}

                                                                                    </InputGroup>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="kt-wizard-v4__content" data-ktwizard-type="step-content" data-ktwizard-state={this.state.active == 's4' ? 'current' : 'pending'}>
                                                                        <div className="form-group row">
                                                                            <div className="col-lg-9 col-xl-6">
                                                                                <h3 className="kt-section__title kt-section__title-md">Revision and Saving</h3>
                                                                            </div>
                                                                        </div>
                                                                        <div className="kt-form__section kt-form__section--first">
                                                                            <div className="kt-wizard-v4__review">
                                                                                <div className="kt-wizard-v4__review-item">
                                                                                    <div className="kt-wizard-v4__review-title">
                                                                                        My Profile
                                                                                    </div>
                                                                                    <div className="kt-wizard-v4__review-content">
                                                                                        {this.state.s1.firstName} {this.state.s1.lastName}
                                                                                        <br/> Phone: {this.state.s1.phone}
                                                                                        <br/> Email: {this.state.s1.email}
                                                                                        <br/> Company: {this.state.s1.company}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="kt-wizard-v4__review-item">
                                                                                    <div className="kt-wizard-v4__review-title">
                                                                                        Mailing Details
                                                                                    </div>
                                                                                    <div className="kt-wizard-v4__review-content">
                                                                                        {this.state.s3.address}
                                                                                        <br/> {this.state.s3.county}, {this.state.s3.city}, &nbsp;
                                                                                        <span id="country_inline"></span>
                                                                                        <select style={{position: "relative", display:'none'}} id="country" name="country" disabled="disabled"
                                                                                                value={this.state.s3.country}>
                                                                                            <option value="">Select</option>
                                                                                            <option value="AF">Afghanistan</option>
                                                                                            <option value="AX">Åland Islands</option>
                                                                                            <option value="AL">Albania</option>
                                                                                            <option value="DZ">Algeria</option>
                                                                                            <option value="AS">American Samoa</option>
                                                                                            <option value="AD">Andorra</option>
                                                                                            <option value="AO">Angola</option>
                                                                                            <option value="AI">Anguilla</option>
                                                                                            <option value="AQ">Antarctica</option>
                                                                                            <option value="AG">Antigua and Barbuda</option>
                                                                                            <option value="AR">Argentina</option>
                                                                                            <option value="AM">Armenia</option>
                                                                                            <option value="AW">Aruba</option>
                                                                                            <option value="AU" selected="">Australia</option>
                                                                                            <option value="AT">Austria</option>
                                                                                            <option value="AZ">Azerbaijan</option>
                                                                                            <option value="BS">Bahamas</option>
                                                                                            <option value="BH">Bahrain</option>
                                                                                            <option value="BD">Bangladesh</option>
                                                                                            <option value="BB">Barbados</option>
                                                                                            <option value="BY">Belarus</option>
                                                                                            <option value="BE">Belgium</option>
                                                                                            <option value="BZ">Belize</option>
                                                                                            <option value="BJ">Benin</option>
                                                                                            <option value="BM">Bermuda</option>
                                                                                            <option value="BT">Bhutan</option>
                                                                                            <option value="BO">Bolivia, Plurinational State of</option>
                                                                                            <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                                                                            <option value="BA">Bosnia and Herzegovina</option>
                                                                                            <option value="BW">Botswana</option>
                                                                                            <option value="BV">Bouvet Island</option>
                                                                                            <option value="BR">Brazil</option>
                                                                                            <option value="IO">British Indian Ocean Territory</option>
                                                                                            <option value="BN">Brunei Darussalam</option>
                                                                                            <option value="BG">Bulgaria</option>
                                                                                            <option value="BF">Burkina Faso</option>
                                                                                            <option value="BI">Burundi</option>
                                                                                            <option value="KH">Cambodia</option>
                                                                                            <option value="CM">Cameroon</option>
                                                                                            <option value="CA">Canada</option>
                                                                                            <option value="CV">Cape Verde</option>
                                                                                            <option value="KY">Cayman Islands</option>
                                                                                            <option value="CF">Central African Republic</option>
                                                                                            <option value="TD">Chad</option>
                                                                                            <option value="CL">Chile</option>
                                                                                            <option value="CN">China</option>
                                                                                            <option value="CX">Christmas Island</option>
                                                                                            <option value="CC">Cocos (Keeling) Islands</option>
                                                                                            <option value="CO">Colombia</option>
                                                                                            <option value="KM">Comoros</option>
                                                                                            <option value="CG">Congo</option>
                                                                                            <option value="CD">Congo, the Democratic Republic of the</option>
                                                                                            <option value="CK">Cook Islands</option>
                                                                                            <option value="CR">Costa Rica</option>
                                                                                            <option value="CI">Côte d'Ivoire</option>
                                                                                            <option value="HR">Croatia</option>
                                                                                            <option value="CU">Cuba</option>
                                                                                            <option value="CW">Curaçao</option>
                                                                                            <option value="CY">Cyprus</option>
                                                                                            <option value="CZ">Czech Republic</option>
                                                                                            <option value="DK">Denmark</option>
                                                                                            <option value="DJ">Djibouti</option>
                                                                                            <option value="DM">Dominica</option>
                                                                                            <option value="DO">Dominican Republic</option>
                                                                                            <option value="EC">Ecuador</option>
                                                                                            <option value="EG">Egypt</option>
                                                                                            <option value="SV">El Salvador</option>
                                                                                            <option value="GQ">Equatorial Guinea</option>
                                                                                            <option value="ER">Eritrea</option>
                                                                                            <option value="EE">Estonia</option>
                                                                                            <option value="ET">Ethiopia</option>
                                                                                            <option value="FK">Falkland Islands (Malvinas)</option>
                                                                                            <option value="FO">Faroe Islands</option>
                                                                                            <option value="FJ">Fiji</option>
                                                                                            <option value="FI">Finland</option>
                                                                                            <option value="FR">France</option>
                                                                                            <option value="GF">French Guiana</option>
                                                                                            <option value="PF">French Polynesia</option>
                                                                                            <option value="TF">French Southern Territories</option>
                                                                                            <option value="GA">Gabon</option>
                                                                                            <option value="GM">Gambia</option>
                                                                                            <option value="GE">Georgia</option>
                                                                                            <option value="DE">Germany</option>
                                                                                            <option value="GH">Ghana</option>
                                                                                            <option value="GI">Gibraltar</option>
                                                                                            <option value="GR">Greece</option>
                                                                                            <option value="GL">Greenland</option>
                                                                                            <option value="GD">Grenada</option>
                                                                                            <option value="GP">Guadeloupe</option>
                                                                                            <option value="GU">Guam</option>
                                                                                            <option value="GT">Guatemala</option>
                                                                                            <option value="GG">Guernsey</option>
                                                                                            <option value="GN">Guinea</option>
                                                                                            <option value="GW">Guinea-Bissau</option>
                                                                                            <option value="GY">Guyana</option>
                                                                                            <option value="HT">Haiti</option>
                                                                                            <option value="HM">Heard Island and McDonald Islands</option>
                                                                                            <option value="VA">Holy See (Vatican City State)</option>
                                                                                            <option value="HN">Honduras</option>
                                                                                            <option value="HK">Hong Kong</option>
                                                                                            <option value="HU">Hungary</option>
                                                                                            <option value="IS">Iceland</option>
                                                                                            <option value="IN">India</option>
                                                                                            <option value="ID">Indonesia</option>
                                                                                            <option value="IR">Iran, Islamic Republic of</option>
                                                                                            <option value="IQ">Iraq</option>
                                                                                            <option value="IE">Ireland</option>
                                                                                            <option value="IM">Isle of Man</option>
                                                                                            <option value="IL">Israel</option>
                                                                                            <option value="IT">Italy</option>
                                                                                            <option value="JM">Jamaica</option>
                                                                                            <option value="JP">Japan</option>
                                                                                            <option value="JE">Jersey</option>
                                                                                            <option value="JO">Jordan</option>
                                                                                            <option value="KZ">Kazakhstan</option>
                                                                                            <option value="KE">Kenya</option>
                                                                                            <option value="KI">Kiribati</option>
                                                                                            <option value="KP">Korea, Democratic People's Republic of</option>
                                                                                            <option value="KR">Korea, Republic of</option>
                                                                                            <option value="KW">Kuwait</option>
                                                                                            <option value="KG">Kyrgyzstan</option>
                                                                                            <option value="LA">Lao People's Democratic Republic</option>
                                                                                            <option value="LV">Latvia</option>
                                                                                            <option value="LB">Lebanon</option>
                                                                                            <option value="LS">Lesotho</option>
                                                                                            <option value="LR">Liberia</option>
                                                                                            <option value="LY">Libya</option>
                                                                                            <option value="LI">Liechtenstein</option>
                                                                                            <option value="LT">Lithuania</option>
                                                                                            <option value="LU">Luxembourg</option>
                                                                                            <option value="MO">Macao</option>
                                                                                            <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                                                                                            <option value="MG">Madagascar</option>
                                                                                            <option value="MW">Malawi</option>
                                                                                            <option value="MY">Malaysia</option>
                                                                                            <option value="MV">Maldives</option>
                                                                                            <option value="ML">Mali</option>
                                                                                            <option value="MT">Malta</option>
                                                                                            <option value="MH">Marshall Islands</option>
                                                                                            <option value="MQ">Martinique</option>
                                                                                            <option value="MR">Mauritania</option>
                                                                                            <option value="MU">Mauritius</option>
                                                                                            <option value="YT">Mayotte</option>
                                                                                            <option value="MX">Mexico</option>
                                                                                            <option value="FM">Micronesia, Federated States of</option>
                                                                                            <option value="MD">Moldova, Republic of</option>
                                                                                            <option value="MC">Monaco</option>
                                                                                            <option value="MN">Mongolia</option>
                                                                                            <option value="ME">Montenegro</option>
                                                                                            <option value="MS">Montserrat</option>
                                                                                            <option value="MA">Morocco</option>
                                                                                            <option value="MZ">Mozambique</option>
                                                                                            <option value="MM">Myanmar</option>
                                                                                            <option value="NA">Namibia</option>
                                                                                            <option value="NR">Nauru</option>
                                                                                            <option value="NP">Nepal</option>
                                                                                            <option value="NL">Netherlands</option>
                                                                                            <option value="NC">New Caledonia</option>
                                                                                            <option value="NZ">New Zealand</option>
                                                                                            <option value="NI">Nicaragua</option>
                                                                                            <option value="NE">Niger</option>
                                                                                            <option value="NG">Nigeria</option>
                                                                                            <option value="NU">Niue</option>
                                                                                            <option value="NF">Norfolk Island</option>
                                                                                            <option value="MP">Northern Mariana Islands</option>
                                                                                            <option value="NO">Norway</option>
                                                                                            <option value="OM">Oman</option>
                                                                                            <option value="PK">Pakistan</option>
                                                                                            <option value="PW">Palau</option>
                                                                                            <option value="PS">Palestinian Territory, Occupied</option>
                                                                                            <option value="PA">Panama</option>
                                                                                            <option value="PG">Papua New Guinea</option>
                                                                                            <option value="PY">Paraguay</option>
                                                                                            <option value="PE">Peru</option>
                                                                                            <option value="PH">Philippines</option>
                                                                                            <option value="PN">Pitcairn</option>
                                                                                            <option value="PL">Poland</option>
                                                                                            <option value="PT">Portugal</option>
                                                                                            <option value="PR">Puerto Rico</option>
                                                                                            <option value="QA">Qatar</option>
                                                                                            <option value="RE">Réunion</option>
                                                                                            <option value="RO">Romania</option>
                                                                                            <option value="RU">Russian Federation</option>
                                                                                            <option value="RW">Rwanda</option>
                                                                                            <option value="BL">Saint Barthélemy</option>
                                                                                            <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                                                                                            <option value="KN">Saint Kitts and Nevis</option>
                                                                                            <option value="LC">Saint Lucia</option>
                                                                                            <option value="MF">Saint Martin (French part)</option>
                                                                                            <option value="PM">Saint Pierre and Miquelon</option>
                                                                                            <option value="VC">Saint Vincent and the Grenadines</option>
                                                                                            <option value="WS">Samoa</option>
                                                                                            <option value="SM">San Marino</option>
                                                                                            <option value="ST">Sao Tome and Principe</option>
                                                                                            <option value="SA">Saudi Arabia</option>
                                                                                            <option value="SN">Senegal</option>
                                                                                            <option value="RS">Serbia</option>
                                                                                            <option value="SC">Seychelles</option>
                                                                                            <option value="SL">Sierra Leone</option>
                                                                                            <option value="SG">Singapore</option>
                                                                                            <option value="SX">Sint Maarten (Dutch part)</option>
                                                                                            <option value="SK">Slovakia</option>
                                                                                            <option value="SI">Slovenia</option>
                                                                                            <option value="SB">Solomon Islands</option>
                                                                                            <option value="SO">Somalia</option>
                                                                                            <option value="ZA">South Africa</option>
                                                                                            <option value="GS">South Georgia and the South Sandwich Islands</option>
                                                                                            <option value="SS">South Sudan</option>
                                                                                            <option value="ES">Spain</option>
                                                                                            <option value="LK">Sri Lanka</option>
                                                                                            <option value="SD">Sudan</option>
                                                                                            <option value="SR">Suriname</option>
                                                                                            <option value="SJ">Svalbard and Jan Mayen</option>
                                                                                            <option value="SZ">Swaziland</option>
                                                                                            <option value="SE">Sweden</option>
                                                                                            <option value="CH">Switzerland</option>
                                                                                            <option value="SY">Syrian Arab Republic</option>
                                                                                            <option value="TW">Taiwan, Province of China</option>
                                                                                            <option value="TJ">Tajikistan</option>
                                                                                            <option value="TZ">Tanzania, United Republic of</option>
                                                                                            <option value="TH">Thailand</option>
                                                                                            <option value="TL">Timor-Leste</option>
                                                                                            <option value="TG">Togo</option>
                                                                                            <option value="TK">Tokelau</option>
                                                                                            <option value="TO">Tonga</option>
                                                                                            <option value="TT">Trinidad and Tobago</option>
                                                                                            <option value="TN">Tunisia</option>
                                                                                            <option value="TR">Turkey</option>
                                                                                            <option value="TM">Turkmenistan</option>
                                                                                            <option value="TC">Turks and Caicos Islands</option>
                                                                                            <option value="TV">Tuvalu</option>
                                                                                            <option value="UG">Uganda</option>
                                                                                            <option value="UA">Ukraine</option>
                                                                                            <option value="AE">United Arab Emirates</option>
                                                                                            <option value="GB">United Kingdom</option>
                                                                                            <option value="US">United States</option>
                                                                                            <option value="UM">United States Minor Outlying Islands</option>
                                                                                            <option value="UY">Uruguay</option>
                                                                                            <option value="UZ">Uzbekistan</option>
                                                                                            <option value="VU">Vanuatu</option>
                                                                                            <option value="VE">Venezuela, Bolivarian Republic of</option>
                                                                                            <option value="VN">Viet Nam</option>
                                                                                            <option value="VG">Virgin Islands, British</option>
                                                                                            <option value="VI">Virgin Islands, U.S.</option>
                                                                                            <option value="WF">Wallis and Futuna</option>
                                                                                            <option value="EH">Western Sahara</option>
                                                                                            <option value="YE">Yemen</option>
                                                                                            <option value="ZM">Zambia</option>
                                                                                            <option value="ZW">Zimbabwe</option>
                                                                                        </select>
                                                                                        <br/> Zip Code: {this.state.s3.postalCode}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="kt-wizard-v4__review-item">
                                                                                    <div className="kt-wizard-v4__review-title">
                                                                                        Invoice Details (Individual Person)
                                                                                    </div>
                                                                                    <div className="kt-wizard-v4__review-content">
                                                                                        {this.state.s2.invFirstName} {this.state.s2.invLastName}
                                                                                        <br/> Phone: {this.state.s2.invPhone}
                                                                                        <br/> Address: {this.state.s2.invAddress}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="kt-wizard-v4__review-item">
                                                                                    <div className="kt-wizard-v4__review-title">
                                                                                        Invoice Details (Company)
                                                                                    </div>
                                                                                    <div className="kt-wizard-v4__review-content">
                                                                                        {this.state.s2.invCompanyName}
                                                                                        <br/> VAT Code: {this.state.s2.invVat}
                                                                                        <br/> Registration Number: {this.state.s2.invRegistrationNumber}
                                                                                        <br/> Bank Name: {this.state.s2.invBankName}
                                                                                        <br/> Bank Account: {this.state.s2.invBankAccount}
                                                                                        <br/> Address: {this.state.s2.invCompanyAddress}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="kt-wizard-v4__review-item">
                                                                                    <div className="kt-wizard-v4__review-title">
                                                                                        Payment Type
                                                                                    </div>
                                                                                    <div className="kt-wizard-v4__review-content">
                                                                                        {
                                                                                            this.state.s2.invPaymentType == 1 ? 'Credit / debit card' : this.state.s2.invPaymentType == 2 ? 'Bank Transfer' : 'Payment Order'
                                                                                         }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="kt-form__actions">

                                                                        {this.state.active != 's1' ? (

                                                                            <>
                                                                            <div className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                                onClick={(e) => {this.getPreviousState()}}

                                                                            >
                                                                               Back
                                                                            </button>
                                                                                </div></>) : (
                                                                            <></>
                                                                        )
                                                                        }

                                                                        {this.state.active == 's4' ? (
                                                                            <>
                                                                            <div className="btn btn-success btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                                onClick={(e) => {this.save()}}

                                                                            >
                                                                                Save
                                                                            </button>
                                                                                </div></>) : (
                                                                            <></>
                                                                        )
                                                                        }

                                                                        <div className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u" data-ktwizard-type="action-next">
                                                                            {this.state.active != 's4' ?
                                                                            this.valid() ? (
                                                                                <button
                                                                                        type="button"
                                                                                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                                        onClick={(e) => {this.getNextState()}}

                                                                                >
                                                                                    Next
                                                                                </button>) : (
                                                                                <button
                                                                                        type="button"
                                                                                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                                        onClick={(e) => {this.makeAllDirty(true)}}
                                                                                >
                                                                                    Next
                                                                                </button>
                                                                            ) : (<></>)
                                                                            }


                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>
            </div>
            </>
        )}
}