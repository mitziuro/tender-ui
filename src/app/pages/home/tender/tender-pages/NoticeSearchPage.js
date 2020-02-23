import React from "react";
import Notice from "../../../../partials/content/Notice";
import CodeExample from "../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";
import './NoticeSearchPage.css';

import {getCpvs, getContractingAuthorities, getBusinessFields, getNuts} from "../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../crud/tender/alert.crud";
import { emphasize, makeStyles, useTheme } from "@material-ui/core/styles";

import {searchCpvs, searchContractingAuthorities} from "../../../../crud/tender/search.notice.crud";

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

        if(this.props.location) {
            this.alertId = this.props.location.search != null && this.props.location.search.split('alert=').length == 2 ? this.props.location.search.split('alert=')[1] : null;
        }

        if(this.props.alertId) {
            this.alertId = this.props.alertId;
        }

        this.isAlert = this.props.isAlert;

        this.cas = [];
        this.bfs = [];
        this.cpvs = [];
        this.nuts = [];


        Promise.all([getBusinessFields(), getNuts()]).then(response => {
            this.bfs = response[0].data;
            this.nuts = response[1].data.sort((a, b) => a.name > b.name ? 1 : -1);

            this.bfs.forEach(b => {
                b.name = b.nameEn;
            });

            this.setState({});

            if (this.alertId != null) {
                Promise.all([getAlert(this.alertId)]).then(response => {

                    var _alert = response[0].data;

                    if (_alert['contractingAuthority'] != null) {
                        this.setState({selectedCA : _alert['contractingAuthority']});
                        _alert['contractingAuthority'] = _alert['contractingAuthority'].id;
                    }

                    if (_alert['businessField'] != null) {
                        _alert['businessField'] = _alert['businessField'].id;
                    }

                    if (_alert['cpv'] != null) {
                        this.setState({selectedCPV : _alert['cpv']});
                        _alert['cpv'] = _alert['cpv'].id;
                    }

                    if (_alert['nuts'] != null) {
                        _alert['nuts'] = _alert['nuts'].id;
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
            keywords: '',

            rfq: true,
            cn: true,
            scn: true,
            ccn: true,
            dccn: true,

            number: '',
            name: '',

            pdStart: '',
            pdEnd: '',

            rdStart: '',
            rdEnd: '',
            nuts: '',

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

        //console.log(React.useState(false));

        this.alertOpen = false;

        this.cpvs = [];
        this.cas = [];

        this.resetCPV = function(suggestion) {
            if(!suggestion) { this.setState({selectedCPV: {nameEn : ''}});}
            setTimeout(() => this.setState({selectedCPV: suggestion}), 0);
        }

        this.resetCA = function(suggestion) {
            if(!suggestion) {this.setState({selectedCA: {name : ''}});}
            setTimeout(() => this.setState({selectedCA: suggestion}), 0);
        }


        /*************** CPV  ******/
        this.renderCPVInput = function (inputProps) {
            const { InputProps, classes, ref, ...other } = inputProps;

            return (
                <>
                    <TextField
                        onChange={(e) => this.populateCPVS(e.target.value)}
                        InputProps={{
            inputRef: ref,
            classes: {
              root: classes.inputRoot,
              input: classes.inputInput
            },
            ...InputProps
          }}
                        {...other}
                    />

                {this.state.selectedCPV ?
                    <i className="fa fa-times-circle" onClick={() => this.resetCPV()} style={{float: 'right', top: '-19px', position: 'relative', right: '10px', cursor: 'pointer'}}></i>
                :
                   <></>}
                </>
            );
        }

        this.renderCPVSuggestion = function (suggestionProps) {
            const {
                suggestion,
                index,
                itemProps,
                highlightedIndex,
                selectedItem
                } = suggestionProps;
            const isHighlighted = highlightedIndex === index;
            const isSelected = (selectedItem || "").indexOf(suggestion.name) > -1;

            return (
                <MenuItem
                    {...itemProps}
                    key={`suggestion1${suggestion.id}`}
                    selected={isHighlighted}
                    component="div"
                    onClick={(e) => {
                        this.resetCPV(suggestion);
                        this.applySearchState({selectedCPV: suggestion});
                        }}
                    style={{fontWeight: isSelected ? 500 : 400, background: "white", opacity: '100%'}}
                >
                    {suggestion.nameEn}
                </MenuItem>
            );
        }


        this.getCPVSuggestions = function (value, { showEmpty = false } = {}) {
            const inputValue = deburr(value.trim()).toLowerCase();
            const inputLength = inputValue.length;
            let count = 0;

            return inputLength === 0 && !showEmpty
                ? []
                : this.cpvs.filter(suggestion => {
                const keep =
                    count < 9999 &&
                    suggestion.nameEn.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
        }

        this.populateCPVS = (token) => {

            if (!token || token.length < 3 ) {
                return;
            }

            Promise.all([searchCpvs(token)]).then(response => {
                this.cpvs = response[0].data;
                this.setState({cpvValue:  token + ''});
            });

        }



        this.removeCPV = (cpv) => {
            this.setState({selectedCPV: null});
        }

        /*************** CPV ******/

        /*************** CA  ******/
        this.renderCAInput = function (inputProps) {
            const { InputProps, classes, ref, ...other } = inputProps;

            return (
                <>
                    <TextField
                        onChange={(e) => this.populateCAS(e.target.value)}
                        InputProps={{
            inputRef: ref,
            classes: {
              root: classes.inputRoot,
              input: classes.inputInput
            },
            ...InputProps
          }}
                        {...other}
                    />
                {this.state.selectedCA ?
                    <i className="fa fa-times-circle" onClick={() => this.resetCA()}  style={{float: 'right', top: '-19px', position: 'relative', right: '10px', cursor: 'pointer'}}></i>
                    :
                    <></>}
                </>
            );
        }

        this.renderCASuggestion = function (suggestionProps) {
            const {
                suggestion,
                index,
                itemProps,
                highlightedIndex,
                selectedItem
                } = suggestionProps;
            const isHighlighted = highlightedIndex === index;
            const isSelected = (selectedItem || "").indexOf(suggestion.name) > -1;

            return (
                <MenuItem
                    {...itemProps}
                    key={`suggestion1${suggestion.id}`}
                    selected={isHighlighted}
                    component="div"
                    onClick={(e) => {
                        this.resetCA(suggestion);
                        this.applySearchState({selectedCA: suggestion});
                        }}
                    style={{fontWeight: isSelected ? 500 : 400, background: "white", opacity: '100%'}}
                >
                    {suggestion.name}
                </MenuItem>
            );
        }


        this.getCASuggestions = function (value, { showEmpty = false } = {}) {
            const inputValue = deburr(value.trim()).toLowerCase();
            const inputLength = inputValue.length;
            let count = 0;

            return inputLength === 0 && !showEmpty
                ? []
                : this.cas.filter(suggestion => {
                const keep =
                    count < 9999 &&
                    suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
        }

        this.populateCAS = (token) => {

            if (!token || token.length < 3 ) {
                return;
            }

            Promise.all([searchContractingAuthorities(token)]).then(response => {
                this.cas = response[0].data;
                this.setState({caValue:  token + ''});
            });
        }

        this.removeCA = (ca) => {
            this.setState({selectedCA: null});
        }
        /*************** CA ******/

    }



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

        if (objCopy['selectedCA'] != null) {
            objCopy['contractingAuthority'] = {id: objCopy['selectedCA']['id']};
        }
        if (objCopy['businessField'] != null) {
            objCopy['businessField'] = {id: objCopy['businessField']};
        }
        if (objCopy['nuts'] != null) {
            objCopy['nuts'] = {id: objCopy['nuts']};
        }
        if (objCopy['selectedCPV'] != null) {
            objCopy['cpv'] = {id: objCopy['selectedCPV']['id']};
        }

        delete objCopy.selectedCPV;
        delete objCopy.cpvValue;

        delete objCopy.selectedCA;
        delete objCopy.caValue;

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
        this.resetCPV();
        this.resetCA();
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
                    <CodeExample beforeCodeTitle="Notice Search">
                        <div className="kt-section">
                            <div className="col-md-12" style={{display: 'flex'}}>
                            <div className="col-md-2">
                            <div className="col-md-12" className="noticeSearchContainerCheckboxes" style={{display: 'block'}}>
                                <div className="kt-separator kt-separator--dashed">
                                </div>
                                <div className="col-md-12">
                                    <FormControlLabel control={
                                  <Checkbox
                                    checked={this.state.rfq}
                                    onChange={(e) => this.applySearchState({rfq: e.target.checked})}
                                    value={this.state.rfq}
                                    color="primary"
                                  />
                              } label="Call for tenders (RFQ)"/>
                                </div>
                                <div className="col-md-12">
                                    <FormControlLabel control={
                                    <Checkbox
                              checked={this.state.cn}
                              onChange={(e) => this.applySearchState({cn: e.target.checked})}
                              value={this.state.cn}
                              color="primary"
                                />
                          } label="Contract notice (CN)"/>
                                </div>

                                <div className="col-md-12">
                                    <FormControlLabel control={
                                <Checkbox
                                    checked={this.state.scn}
                                    onChange={(e) => this.applySearchState({scn: e.target.checked})}
                                    value={this.state.scn}
                                    color="primary"
                                        />
                          } label="Simplified contract notice (SCN)"/>
                                </div>

                                <div className="col-md-12">
                                    <FormControlLabel control={
                                <Checkbox
                            checked={this.state.ccn}
                            onChange={(e) => this.applySearchState({ccn: e.target.checked})}
                            value={this.state.ccn}
                            color="primary"
                                />
                    } label="Concession notice (PC)"/>
                                </div>

                                <div className="col-md-12">
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
                            </div>
                                <div className="col-md-10">
                                    <div className="noticeSearchContainerTexts">
                                        <div className="col-md-6">
                                            <TextField label="Keywords"
                                                       value={this.state.keywords}
                                                       onChange={(e) => this.applySearchState({keywords: e.target.value})}
                                                       margin="normal"/>
                                        </div>
                                        <div className="col-md-6">
                                            <InputLabel htmlFor="nutsField" style={{position: 'relative', top: '13px'}}>Location</InputLabel>
                                            <Select style={{width: '100%', position: 'relative', top: '13px'}}
                                                    value={this.state.nuts}
                                                    onChange={(e) => this.applySearchState({nuts: e.target.value})}
                                                    inputProps={{
                                name: "nuts-field",
                                    id: "nuts-field"
                            }}
                                            >
                                                <MenuItem value="">
                                                    <em></em>
                                                </MenuItem>
                                                {this.nuts.map(e => (
                                                    e.id == this.state.nuts ?
                                                        <MenuItem value={e.id}>{e.name}</MenuItem>
                                                        :
                                                        <MenuItem value={e.id}>{e.name}</MenuItem>
                                                ))}
                                            </Select>
                                            {this.state.nuts ?
                                                <i className="fa fa-times-circle" onClick={() => this.setState({nuts: null})} style={{float: 'right', top: '-9px', position: 'relative', right: '20px', cursor: 'pointer'}}></i>
                                                :
                                                <></>}
                                        </div>
                                      </div>
                                    <div className="noticeSearchContainerTexts" style={{height: '90px'}}>
                                        <div className="col-md-6" style={{position: 'relative', top: '15px'}}>
                                            <Downshift id="downshift-simple">
                                                {({
                                                    getInputProps,
                                                    getItemProps,
                                                    getLabelProps,
                                                    getMenuProps,
                                                    highlightedIndex,
                                                    inputValue,
                                                    isOpen,
                                                    selectedItem
                                                    }) => {
                                                    const { onBlur, onFocus, ...inputProps } = getInputProps({
                                                        placeholder: "Search for a Contracting Authority",
                                                        value: this.state.selectedCA ? this.state.selectedCA.name : null

                                                    });

                                                    return (
                                                        <div>
                                                            {this.renderCAInput({
                                                                fullWidth: true,
                                                                classes: {},
                                                                label: "Contracting Authority",
                                                                InputLabelProps: getLabelProps({ shrink: true }),
                                                                InputProps: { onBlur, onFocus },
                                                                inputProps
                                                            })}

                                                            <div {...getMenuProps()}>
                                                                {isOpen ? (
                                                                    <Paper square style={{position: "absolute", background: "white", padding: "10px", zIndex: "999999", maxHeight: '250px', overflow: 'auto' }}>
                                                                        {this.getCASuggestions(inputValue).map(
                                                                            (suggestion, index) =>
                                                                                this.renderCASuggestion({
                                                                                    suggestion,
                                                                                    index,
                                                                                    itemProps: getItemProps({
                                                                                        item: suggestion.label
                                                                                    }),
                                                                                    highlightedIndex,
                                                                                    selectedItem
                                                                                })
                                                                        )}
                                                                    </Paper>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            </Downshift>
                                        </div>

                                        {!this.isAlert ? <div className="col-md-6">
                                            <TextField label="Notice Number"
                                                       value={this.state.number}
                                                       onChange={(e) => this.applySearchState({number: e.target.value})}
                                                       margin="normal"/>
                                        </div> : <></> }
                                    </div>


                                    <div className="noticeSearchContainerTexts" style={{height: '90px'}}>
                                        <div className="col-md-6" style={{position: 'relative', top: '-20px'}}>
                                            <Downshift id="downshift-simple">
                                                {({
                                                    getInputProps,
                                                    getItemProps,
                                                    getLabelProps,
                                                    getMenuProps,
                                                    highlightedIndex,
                                                    inputValue,
                                                    isOpen,
                                                    selectedItem
                                                    }) => {
                                                    const { onBlur, onFocus, ...inputProps } = getInputProps({
                                                        placeholder: "Search for a CPV",
                                                        value: this.state.selectedCPV ? this.state.selectedCPV.nameEn : null

                                                });

                                                    return (
                                                        <div>
                                                            {this.renderCPVInput({
                                                                fullWidth: true,
                                                                classes: {},
                                                                label: "CPV",
                                                                InputLabelProps: getLabelProps({ shrink: true }),
                                                                InputProps: { onBlur, onFocus },
                                                                inputProps
                                                            })}

                                                            <div {...getMenuProps()}>
                                                                {isOpen ? (
                                                                    <Paper square style={{position: "absolute", background: "white", padding: "10px", zIndex: "999999", maxHeight: '250px', overflow: 'auto' }}>
                                                                        {this.getCPVSuggestions(inputValue).map(
                                                                            (suggestion, index) =>
                                                                                this.renderCPVSuggestion({
                                                                                    suggestion,
                                                                                    index,
                                                                                    itemProps: getItemProps({
                                                                                        item: suggestion.nameEn
                                                                                    }),
                                                                                    highlightedIndex,
                                                                                    selectedItem
                                                                                })
                                                                        )}
                                                                    </Paper>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            </Downshift>
                                        </div>
                                        <div className="col-md-6" style={{display: "flex", justifyContent: "space-around", position: 'relative', top: this.isAlert ? '-91px' : '-37px'}}>
                                            <div className="col-md-3">
                                                <TextField label="Total Estimated Value From" className="date"
                                                           value={this.state.tevStart}
                                                           InputLabelProps={{shrink: true}}
                                                           onChange={(e) => this.applySearchState({tevStart: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <TextField label="Total Estimated Value To" className="date"
                                                           value={this.state.tevEnd}
                                                           InputLabelProps={{shrink: true}}
                                                           onChange={(e) => this.applySearchState({tevEnd: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="noticeSearchContainerTexts" style={{position: 'relative', top: '-43px'}}>
                                        <div className="col-md-6">
                                            <InputLabel htmlFor="businessField" style={{position: 'relative'}}>Business
                                                Field</InputLabel>
                                            <Select style={{width: '100%', position: 'relative'}}
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
                                            {this.state.businessField ?
                                                <i className="fa fa-times-circle" onClick={() => this.setState({businessField: null})} style={{float: 'right', top: '-22px', position: 'relative', right: '20px', cursor: 'pointer'}}></i>
                                                :
                                                <></>}
                                        </div>
                                        {!this.isAlert ? <div className="col-md-6" style={{display: "flex", justifyContent: "space-around", position: 'relative', top: '-16px'}}>
                                            <div className="col-md-3">
                                                <TextField className="date" label="Publication Date Start" type="date"
                                                           value={this.state.pdStart}
                                                           onChange={(e) => this.applySearchState({pdStart: e.target.value})}
                                                           InputLabelProps={{shrink: true}}/>
                                            </div>
                                            <div className="col-md-3">
                                                <TextField className="date" label="Publication Date End" type="date"
                                                           value={this.state.pdEnd}
                                                           onChange={(e) => this.applySearchState({pdEnd: e.target.value})}
                                                           InputLabelProps={{shrink: true}}/>
                                            </div>
                                        </div> : <></>}
                                    </div>

                                <div className="noticeSearchContainerTexts" style={{position: 'relative', top: '-43px'}}>

                                    <div className="col-md-6">
                                        <TextField label="Contract Name"
                                                   value={this.state.name}
                                                   onChange={(e) => this.applySearchState({name: e.target.value})}
                                                   margin="normal"/>
                                    </div>
                                    {!this.isAlert ? <div className="col-md-6" style={{display: "flex", justifyContent: "space-around", position: 'relative', top: '-2px'}}>
                                        <div className="col-md-3">
                                            <TextField className="date" label="Receipt Deadline Start" type="date"
                                                       value={this.state.rdStart}
                                                       onChange={(e) => this.applySearchState({rdStart: e.target.value})}
                                                       InputLabelProps={{shrink: true}}/>
                                        </div>
                                        <div className="col-md-3">
                                            <TextField className="date" label="Receipt Deadline End" type="date"
                                                       value={this.state.rdEnd}
                                                       onChange={(e) => this.applySearchState({rdEnd: e.target.value})}
                                                       InputLabelProps={{shrink: true}}/>
                                        </div>
                                    </div> : <></>}
                                </div>

</div>
                                </div>

                            <div className="noticeSearchContainerButtons" >
                                <div>
                                    <Button color="primary" onClick={this.handleSearch}> <i
                                        className="fa fa-search"> </i> Search </Button>
                                    <Button color="secondary" style={{background: "gray"}} onClick={this.handleClear}> <i
                                        className="fa fa-trash"> </i> Clear Filters</Button>
                                    {this.isAlert ? <Button style={{background: 'green'}} color="green" onClick={this.handleSave}>
                                        <i className="fa fa-save"> </i> Save Alert
                                    </Button> : <></>}
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

