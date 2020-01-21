import React from "react";
import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getCpvs, getContractingAuthorities, getBusinessFields} from "../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../crud/tender/alert.crud";
import { emphasize, makeStyles, useTheme } from "@material-ui/core/styles";

import  NoticeListingComponent from '../components/NoticeListingComponent';

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

import Downshift from "downshift";
import {
    Popper,
    Paper,
    Chip,
    Typography,
    NoSsr
} from "@material-ui/core";

import PropTypes from "prop-types";
import deburr from "lodash/deburr";

export default class NoticeSearchPage extends React.Component {

    constructor(props) {
        super(props);

        this.alertId = this.props.location.search != null && this.props.location.search.split('alert=').length == 2 ? this.props.location.search.split('alert=')[1] : null;

        this.cas = [];
        this.bfs = [];
        this.cpvs = [];


        Promise.all([getCpvs(), getContractingAuthorities(), getBusinessFields()]).then(response => {
            this.cpvs = response[0].data;
            this.cas = response[1].data;
            this.bfs = response[2].data;

            this.cpvs.forEach(c => {
                c.name = c.nameEn;
            });
            this.bfs.forEach(b => {
                b.name = b.nameEn;
            });

            this.setState({});

            if (this.alertId != null) {
                Promise.all([getAlert(this.alertId)]).then(response => {

                    var _alert = response[0].data;


                    if (_alert['contractingAuthority'] != null) {
                        _alert['contractingAuthority'] = _alert['contractingAuthority'].id;
                    }
                    if (_alert['businessField'] != null) {
                        _alert['businessField'] = _alert['businessField'].id;
                    }
                    if (_alert['cpv'] != null) {
                        _alert['cpv'] = _alert['cpv'].id;
                    }

                    if (_alert['pdStart'] != null) {
                        _alert['pdStart'] = _alert['pdStart'].split('T')[0];
                    }
                    if (_alert['pdEnd'] != null) {
                        _alert['pdEnd'] = _alert['pdEnd'].split('T')[0];
                    }

                    if (_alert['rdStart'] != null) {
                        _alert['rdStart'] = _alert['rdStart'].split('T')[0];
                    }
                    if (_alert['rdEnd'] != null) {
                        _alert['rdEnd'] = _alert['rdEnd'].split('T')[0];
                    }


                    this.setState(_alert);
                });
            }

        });


        this.initialState = {

            id: '',
            alertName: '',
            alertDescription: '',

            rfq: false,
            cn: false,
            scn: false,
            ccn: false,
            dccn: false,

            number: '',
            name: '',

            pdStart: '',
            pdEnd: '',

            rdStart: '',
            rdEnd: '',

            tevStart: '',
            tevEnd: '',

            contractingAuthority: '',
            businessField: '',
            cpv: '',

            alertOpen: false,
            showErrors: false
        };

        this.state = this.initialState;
        this.handleClear = this.handleClear.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.applySearchState = this.applySearchState.bind(this);

        this.handleOpenSaveAlert = this.handleOpenSaveAlert.bind(this);
        this.handleCloseSaveAlert = this.handleCloseSaveAlert.bind(this);
        this.handleSaveAlert = this.handleSaveAlert.bind(this);

        this.getSearchObject = this.getSearchObject.bind(this);

        this.alertOpen = false;

    }


    //const {alertOpen, setAlertOpen} = React.useState(false);


    handleOpenSaveAlert = () => {
        this.setState({alertOpen: true});
    }

    getSearchObject = () => {
        let objCopy = Object.assign({}, this.state);
        delete objCopy.alertOpen;
        Object.keys(objCopy).forEach(key => {
            if (objCopy[key] === '') {
                objCopy[key] = null;
            }
        });

        if (objCopy['contractingAuthority'] != null) {
            objCopy['contractingAuthority'] = {id: objCopy['contractingAuthority']};
        }
        if (objCopy['businessField'] != null) {
            objCopy['businessField'] = {id: objCopy['businessField']};
        }
        if (objCopy['cpv'] != null) {
            objCopy['cpv'] = {id: objCopy['cpv']};
        }

        return objCopy;
    }

    handleSaveAlert = () => {

        if (this.state.alertName == null || this.state.alertName.length === 0) {
            this.setState({showErrors: true});
            return;
        }

        var value = this.getSearchObject();

        saveAlert(value).then(response => {
            this.setState({id: response.data.id});
        });

        this.setState({showErrors: false});
        this.handleCloseSaveAlert();

    }

    handleCloseSaveAlert = () => {
        this.setState({alertOpen: false, showErrors: false});
    }


    handleClear = () => {
        this.setState(this.initialState);
    }

    handleSave = () => {
        this.handleOpenSaveAlert();
    }

    applySearchState = (s) => {
        this.setState(s);
    }

    handleSearch = () => {
        this.child.getNotices(this.getSearchObject());
        this.setState({});
    }

    render() {


        return (
            <>
            <div className="row">
                <div className="col-md-12" className="noticeSearch">
                    <Button style={{background: 'green', position: "absolute", right: "30px", top: "10px", zIndex:"999"}} color="green" onClick={this.handleSave}>
                        <i className="fa fa-save"> </i> Save
                    </Button>
                    <CodeExample beforeCodeTitle="Notice Search">
                        <div className="kt-section">
                            <div className="col-md-12" className="noticeSearchContainerCheckboxes">
                                <div className="kt-separator kt-separator--dashed">
                                </div>
                                <div className="col-md-2">
                                    <FormControlLabel control={
                                  <Checkbox
                                    checked={this.state.rfq}
                                    onChange={(e) => this.applySearchState({rfq: e.target.checked})}
                                    value={this.state.rfq}
                                    color="primary"
                                  />
                              } label="Call for tenders (RFQ)"/>
                                </div>
                                <div className="col-md-2">
                                    <FormControlLabel control={
                                    <Checkbox
                              checked={this.state.cn}
                              onChange={(e) => this.applySearchState({cn: e.target.checked})}
                              value={this.state.cn}
                              color="primary"
                                />
                          } label="Contract notice (CN)"/>
                                </div>

                                <div className="col-md-2">
                                    <FormControlLabel control={
                                <Checkbox
                                    checked={this.state.scn}
                                    onChange={(e) => this.applySearchState({scn: e.target.checked})}
                                    value={this.state.scn}
                                    color="primary"
                                        />
                          } label="Simplified contract notice (SCN)"/>
                                </div>

                                <div className="col-md-2">
                                    <FormControlLabel control={
                                <Checkbox
                            checked={this.state.ccn}
                            onChange={(e) => this.applySearchState({ccn: e.target.checked})}
                            value={this.state.ccn}
                            color="primary"
                                />
                    } label="Concession notice (PC)"/>
                                </div>

                                <div className="col-md-2">
                                    <FormControlLabel control={
                                <Checkbox
                            checked={this.state.dccn}
                            onChange={(e) => this.applySearchState({dccn: e.target.checked})}
                            value={this.state.dccn}
                            color="primary"
                                />
                    } label="Design Contest Notice (DC)"/>
                                </div>
                            </div>
                            <div className="noticeSearchContainerTexts">
                                <div className="col-md-3">
                                    <TextField label="Notice Number"
                                               value={this.state.number}
                                               onChange={(e) => this.applySearchState({number: e.target.value})}
                                               margin="normal"/>
                                </div>
                                <div className="col-md-3">
                                    <TextField label="Contract Name"
                                               value={this.state.name}
                                               onChange={(e) => this.applySearchState({name: e.target.value})}
                                               margin="normal"/>
                                </div>
                                <div className="col-md-6" style={{display: "flex", justifyContent: "center"}}>
                                    <div className="col-md-2">
                                        <TextField className="date" label="Publication Date Start" type="date"
                                                   value={this.state.pdStart}
                                                   onChange={(e) => this.applySearchState({pdStart: e.target.value})}
                                                   InputLabelProps={{shrink: true}}/>
                                    </div>
                                    <div className="col-md-2">
                                        <TextField className="date" label="Publication Date End" type="date"
                                                   value={this.state.pdEnd}
                                                   onChange={(e) => this.applySearchState({pdEnd: e.target.value})}
                                                   InputLabelProps={{shrink: true}}/>
                                    </div>
                                </div>
                            </div>


                            <div className="noticeSearchContainerTexts">
                                <div className="col-md-3">
                                    <InputLabel htmlFor="contracting-authority"
                                                style={{position: 'relative', top: '13px'}}>Contracting
                                        Authority</InputLabel>
                                    <Select style={{width: '100%', position: 'relative', top: '13px'}}
                                            value={this.state.contractingAuthority}
                                            onChange={(e) => this.applySearchState({contractingAuthority: e.target.value})}
                                            inputProps={{
                                    name: "contracting-authority",
                                    id: "contracting-authority"
                            }}
                                    >
                                        <MenuItem value="">
                                            <em></em>
                                        </MenuItem>
                                        {this.cas.map(e => (
                                            <MenuItem value={e.id}>{e.name}</MenuItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="col-md-3">
                                    <InputLabel htmlFor="businessField" style={{position: 'relative', top: '13px'}}>Business
                                        Field</InputLabel>
                                    <Select style={{width: '100%', position: 'relative', top: '13px'}}
                                            value={this.state.businessField}
                                            onChange={(e) => this.applySearchState({businessField: e.target.value})}
                                            inputProps={{
                                name: "business-field",
                                    id: "business-field"
                            }}
                                    >
                                        <MenuItem value="">
                                            <em></em>
                                        </MenuItem>
                                        {this.bfs.map(e => (
                                            <MenuItem value={e.id}>{e.name}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-md-6" style={{display: "flex", justifyContent: "center"}}>
                                    <div className="col-md-2">
                                        <TextField className="date" label="Receipt Deadline Start" type="date"
                                                   value={this.state.rdStart}
                                                   onChange={(e) => this.applySearchState({rdStart: e.target.value})}
                                                   InputLabelProps={{shrink: true}}/>
                                    </div>
                                    <div className="col-md-2">
                                        <TextField className="date" label="Receipt Deadline End" type="date"
                                                   value={this.state.rdEnd}
                                                   onChange={(e) => this.applySearchState({rdEnd: e.target.value})}
                                                   InputLabelProps={{shrink: true}}/>
                                    </div>
                                </div>
                            </div>

                            <div className="noticeSearchContainerTexts">
                                <div className="col-md-3">
                                    <InputLabel htmlFor="contracting-authority"
                                                style={{position: 'relative', top: '13px'}}>CPV</InputLabel>
                                    <Select style={{width: '100%', position: 'relative', top: '13px'}}
                                            value={this.state.cpv}
                                            onChange={(e) => this.applySearchState({cpv: e.target.value})}
                                            inputProps={{
                                name: "cpv",
                                    id: "cpv"
                            }}
                                    >
                                        <MenuItem value="">
                                            <em></em>
                                        </MenuItem>
                                        {this.cpvs.map(e => (
                                            <MenuItem value={e.id}>{e.name}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-md-3" ></div>
                                <div className="col-md-6" style={{display: "flex", justifyContent: "center"}}>
                                    <div className="col-md-2">
                                        <TextField label="Total Estimated Value From" className="date"
                                                   value={this.state.tevStart}
                                                   InputLabelProps={{shrink: true}}
                                                   onChange={(e) => this.applySearchState({tevStart: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <TextField label="Total Estimated Value To" className="date"
                                                   value={this.state.tevEnd}
                                                   InputLabelProps={{shrink: true}}
                                                   onChange={(e) => this.applySearchState({tevEnd: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="noticeSearchContainerButtons">
                                <div className="col-md-3">
                                    <Button color="primary" onClick={this.handleSearch}> <i
                                        className="fa fa-search"> </i> Search </Button>
                                    <Button color="secondary" style={{background: "gray"}} onClick={this.handleClear}> <i
                                        className="fa fa-trash"> </i> Clear </Button>

                                </div>
                            </div>

                        </div>
                    </CodeExample>
                </div>
            </div>
            <div className="row">
                <div class="col-md-12" className="noticeResults">
                    <CodeExample beforeCodeTitle="Search Results">
                        <div className="kt-section">
                            <div className="col-md-12">
                                <div className="kt-section__content">
                                    <NoticeListingComponent onRef={ref => (this.child = ref)} />
                                </div>
                            </div>
                        </div>
                    </CodeExample>
                </div>
            </div>

            <Dialog
                open={this.state.alertOpen}
                onClose={this.handleCloseSaveAlert}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Alert</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Save the search as an alert in order to receive an emai with the latest notices.
                    </DialogContentText>
                    <TextField
                        color="red"
                        autoFocus
                        margin="dense"
                        id="name"
                        value={this.state.alertName}
                        onChange={(e) => this.applySearchState({alertName: e.target.value})}
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <p style={{fontSize: "10px", position: 'absolute', left: '22px', float: 'left', display : this.state.showErrors == true && (this.state.alertName == null || this.state.alertName.length === 0) ? 'block' : 'none', color: 'red'}}>
                        The name must not be null
                    </p>
                </DialogContent>
                <DialogActions>

                    <Button onClick={this.handleCloseSaveAlert} color="primary">
                        Cancel
                    </Button>
                    <Button style={{background: 'green'}} onClick={this.handleSaveAlert} color="primary">
                        <i className="fa fa-save"> </i> Save
                    </Button>
                </DialogActions>
            </Dialog>
            </>
        );
    }


}

