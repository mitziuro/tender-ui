import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";

import {getCpv, getContractingAuthority, getBusinessFields, getNuts, searchCpvs, searchContractingAuthorities} from "../../../../../crud/tender/search.notice.crud";
import {saveAlert, getAlert} from "../../../../../crud/tender/alert.crud";
import  AlertListingComponent from '../../components/AlertListingComponent';
import  OfferListingComponent from '../../components/OfferListingComponent';
import  CompletedNoticeListingComponent from '../../components/CompletedNoticeListingComponent';
import  CompletedNoticeOffersListingComponent from '../../components/CompletedNoticeOffersListingComponent';
import  ExplainedOfferComponent from '../../components/ExplainedOfferComponent';


import './HistoryDashboardPage.css';


import Downshift from "downshift";
import {
    Popper,
    Paper,
    Chip,
    Typography,
    NoSsr
} from "@material-ui/core";

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


import PropTypes from "prop-types";
import deburr from "lodash/deburr";

export default class HistoryDashboardPage extends React.Component {


    constructor(props) {
        super(props);

        this.cpvs = [];
        this.cas = [];

        this.initialState = {

            selectedOffer: null,
            selectedDocument: null,

            canInput: null,
            canOfferInput: null,

            notAwardedOffers: true,
            awardedOffers: true,

            number: null,

            cas: [],
            cpvs: [],
            nuts: [],

            startDate: null,
            endDate: null,

            showSelectDocuments: false
        };

        this.state = this.initialState;

        if (this.props.location.search != null && this.props.location.search.split('?').length == 2) {
            this.state.cas = [{id: this.props.location.search.split('?')[1].split('&')[0].split('=')[1], name: ''}];
        }

        if (this.props.location.search != null && this.props.location.search.split('?').length == 2) {
            this.state.cpvs = [{
                id: this.props.location.search.split('?')[1].split('&')[1].split('=')[1],
                nameEn: ''
            }];
        }

        Promise.all([getNuts()]).then(response => {
            this.nuts = response[0].data;
        });


        if(this.state.cpvs[0]) {
            Promise.all([getCpv(this.state.cpvs[0].id), getContractingAuthority(this.state.cas[0].id)]).then(response => {
                this.setState({cpvs: [{id: response[0].data.id, nameEn: response[0].data.nameEn}]});
                this.setState({cas: [{id: response[1].data.id, name: response[1].data.name}]});
            });
        }


        this.addNut = this.addNut.bind(this);
        this.removeNut = this.removeNut.bind(this);

        this.applyOffer = this.applyOffer.bind(this);

        this.setState({});
        setTimeout(() => this.handleSearch(),0);


        /*************** LOCATION ******/
        this.renderInput = function (inputProps) {
            const { InputProps, classes, ref, ...other } = inputProps;

            return (
                <TextField

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
            );
        }

        this.renderSuggestion = function (suggestionProps) {
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
                    onClick={(e) => this.addNut(suggestion)}
                    style={{fontWeight: isSelected ? 500 : 400, background: "white", opacity: '100%'}}
                >
                    {suggestion.name}
                </MenuItem>
            );
        }


        this.getSuggestions = function (value, { showEmpty = false } = {}) {
            const inputValue = deburr(value.trim()).toLowerCase();
            const inputLength = inputValue.length;
            let count = 0;

            return inputLength === 0 && !showEmpty
                ? []
                : this.nuts.filter(suggestion => {
                const keep =
                    count < 100 &&
                    suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
        }
        /*************** LOCATION ******/

        /*************** CPV  ******/
        this.renderCPVInput = function (inputProps) {
            const { InputProps, classes, ref, ...other } = inputProps;

            return (
                <TextField
                    onChange={(e) => this.populateCPVS(e.target.value)}
                    value={this.state.cpvValue}
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
                    onClick={(e) => this.addCPV(suggestion)}
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
        /*************** CPV ******/

        /*************** CA  ******/
        this.renderCAInput = function (inputProps) {
            const { InputProps, classes, ref, ...other } = inputProps;

            return (
                <TextField
                    onChange={(e) => this.populateCAS(e.target.value)}
                    value={this.state.caValue}
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
                    onClick={(e) => this.addCA(suggestion)}
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
        /*************** CA ******/
    }


    handleSearch = () => {

        if(this.childCan) {
            this.childCan.getCans(this.getCanSearchObject());
        }

        if(this.childOffers) {
            this.childOffers.getCans(this.getOfferSearchObject());
        }

        this.setState({});
    }

    applyOffer = (data) => {
        this.setState({selectedOffer: data});
        this.extendedOffers.handleApplyData(data);
    }

    applyDocument = (data) => {
        this.setState({selectedDocument: data});
        this.childOffers.handleApplyDocument(data);
        setTimeout(() => this.childOffers.getCans(this.getOfferSearchObject()), 0);
    }


    addNut = (nut) => {
        if(this.state.nuts.filter(n => n.id == nut.id).length > 0) {
            return;
        }
        this.state.nuts.push(nut);
        this.setState({nuts: this.state.nuts});
        this.handleSearch();
    }

    removeNut = (nut) => {
        this.state.nuts = this.state.nuts.filter(n => n.id != nut.id);
        this.setState({nuts: this.state.nuts});
        this.handleSearch();
    }

    addCPV = (cpv) => {
        if(this.state.cpvs.filter(n => n.id == cpv.id).length > 0) {
            return;
        }
        this.state.cpvs.push(cpv);
        this.setState({cpvs: this.state.cpvs});
        this.handleSearch();
    }

    removeCPV = (cpv) => {
        this.state.cpvs = this.state.cpvs.filter(n => n.id != cpv.id);
        this.setState({cpvs: this.state.cpvs});
        this.handleSearch();
    }

    addCA = (ca) => {
        if(this.state.cas.filter(n => n.id == ca.id).length > 0) {
            return;
        }
        this.state.cas.push(ca);
        this.setState({cas: this.state.cas});
        this.handleSearch();
    }

    removeCA = (ca) => {
        this.state.cas = this.state.cas.filter(n => n.id != ca.id);
        this.setState({cas: this.state.cas});
        this.handleSearch();
    }


    getCanSearchObject = () => {
        return {
            input: this.state.canInput,

            cas: this.state.cas.map( c => c.id),
            cpvs: this.state.cpvs.map( c => c.id),
            nuts: this.state.nuts.map( c => c.id),


            startDate: this.state.startDate,
            endDate: this.state.endDate
        }
    }

    getOfferSearchObject = () => {
        return {
            input: this.state.canOfferInput,

            document: this.state.selectedDocument ? this.state.selectedDocument.number : null,
            notAwardedOffers: this.state.notAwardedOffers,
            awardedOffers: this.state.awardedOffers,

            cas: this.state.cas.map( c => c.id),
            cpvs: this.state.cpvs.map( c => c.id),
            nuts: this.state.nuts.map( c => c.id),

            number: this.state.number,

            startDate: this.state.startDate,
            endDate: this.state.endDate
        }
    }

    render() {
        return (
            <>
            <div className="row">
                <div className="col-md-12" style={{display: 'flex'}}>
                    <div className="col-md-12" style={{display: 'flex'}}>
                        <div className="col-md-4" style={{display: 'flex', flexDirection: 'column'}}>
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="CPV">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="entity_compare">

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
                                                            placeholder: "Search for a CPV"
                                                        });

                                                        return (
                                                            <div>
                                                                {this.renderCPVInput({
                                                                    fullWidth: true,
                                                                    classes: {},
                                                                    label: "CPVS",
                                                                    InputLabelProps: getLabelProps({ shrink: true }),
                                                                    InputProps: { onBlur, onFocus },
                                                                    inputProps
                                                                })}

                                                                <div {...getMenuProps()}>
                                                                    {true ? (
                                                                        <Paper square style={{position: "absolute", background: "white", padding: "10px", zIndex: "999999", maxHeight: '250px', overflow: 'auto' }}>
                                                                            {this.getCPVSuggestions(inputValue).map(
                                                                                (suggestion, index) =>
                                                                                    this.renderCPVSuggestion({
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

                                                <div className="col-md-12" style={{position: 'relative', top: '0px', minHeight: '40px', lineHeight: '25px'}}>
                                                    {
                                                        this.state.cpvs.map((d) => {

                                                            return (
                                                                <span style={{ paddingRight: '20px', paddingBottom: '5px'}}>
                                            {(
                                                <span className="arrow_box" style={{top: '10px', left: '10px'}}> {d.nameEn.substr(0, 50)}  {d.nameEn.length > 50 ? '...' : ''} &nbsp;
                                                    <i class="fa fa-trash" onClick={(e) => this.removeCPV(d)}> </i>
                                                </span>)}
                                        </span>
                                                            )
                                                        })
                                                    }
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>
                        <div className="col-md-4" style={{display: 'flex', flexDirection: 'column'}}>
                            <div className="offersResults">
                                <div style={{display: "flex", justifyContent: "center", float: 'right', top: '10px', left: '200px', position: 'absolute', zIndex: '9999'}}>
                                    <div className="col-md-6">
                                        <TextField className="date" label="Start Date" type="date"
                                                   value={this.state.startDate}
                                                   onChange={(e) => {this.setState({startDate: e.target.value});setTimeout(() => this.handleSearch(),0);}}
                                                   InputLabelProps={{shrink: true}}/>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField className="date" label="End Date" type="date"
                                                   value={this.state.endDate}
                                                   onChange={(e) => {this.setState({endDate: e.target.value});setTimeout(() => this.handleSearch(),0);}}
                                                   InputLabelProps={{shrink: true}}/>
                                    </div>
                                </div>
                                <CodeExample beforeCodeTitle="Locations">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="entity_compare">

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
                                                            placeholder: "Search for a region"
                                                        });

                                                        return (
                                                            <div>
                                                                {this.renderInput({
                                                                    fullWidth: true,
                                                                    classes: {},
                                                                    label: "Regions",
                                                                    InputLabelProps: getLabelProps({ shrink: true }),
                                                                    InputProps: { onBlur, onFocus },
                                                                    inputProps
                                                                })}

                                                                <div {...getMenuProps()}>
                                                                    {isOpen ? (
                                                                        <Paper square style={{position: "absolute", background: "white", padding: "10px", zIndex: "999999", maxHeight: '250px', overflow: 'auto' }}>
                                                                            {this.getSuggestions(inputValue).map(
                                                                                (suggestion, index) =>
                                                                                    this.renderSuggestion({
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
                                        </div>

                                        <div className="col-md-12" style={{position: 'relative', top: '0px', padding: '10px', minHeight: '40px'}}>
                                            {
                                                this.state.nuts.map((d) => {

                                                    return (
                                                        <span style={{ paddingRight: '20px', paddingBottom: '5px'}}>
                                            {(
                                                <span className="arrow_box" style={{top: '10px', left: '10px'}}> {d.name} &nbsp;
                                                    <i class="fa fa-trash" onClick={(e) => this.removeNut(d)}> </i>
                                                </span>)}
                                        </span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>


                        <div className="col-md-4" style={{display: 'flex', flexDirection: 'column'}}>
                            <div className="offersResults">
                                <CodeExample beforeCodeTitle="Contracting Authority">
                                    <div className="kt-section">
                                        <div className="col-md-12">
                                            <div className="entity_compare">


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
                                                            placeholder: "Search for a Contracting Authority"
                                                        });

                                                        return (
                                                            <div>
                                                                {this.renderCAInput({
                                                                    fullWidth: true,
                                                                    classes: {},
                                                                    label: "Contracting Authorities",
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

                                                <div className="col-md-12" style={{position: 'relative', top: '0px', minHeight: '40px', lineHeight: '25px'}}>
                                                    {
                                                        this.state.cas.map((d) => {

                                                            return (
                                                                <span style={{ paddingRight: '20px', paddingBottom: '5px'}}>
                                            {(
                                                <span className="arrow_box" style={{top: '10px', left: '10px'}}> {d.name.substr(0, 50)}  {d.name.length > 50 ? '...' : ''} &nbsp;
                                                    <i class="fa fa-trash" onClick={(e) => this.removeCA(d)}> </i>
                                                </span>)}
                                        </span>
                                                            )
                                                        })
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </CodeExample>
                            </div>
                        </div>
                    </div>

                </div>
                { this.state.showSelectDocuments ? <div className="col-md-12" style={{position: 'relative', top: '-60px'}}>
                    <div className="offersResults">
                        <TextField label="Filter (Name or number)"
                                   style={{width: '200px', position: 'relative', top: '50px', left: '250px', zIndex: '999'}}
                                   onChange={(e) => {this.setState({canInput: e.target.value});setTimeout(() => this.handleSearch(),0);}}
                                   margin="normal"/>
                        <CodeExample beforeCodeTitle="Awarded Contracts">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div>

                                        { this.state.selectedDocument ?
                                            (<span className="arrow_box" style={{position: 'absolute', right: '71px', top: '-39px'}}>
                                                <i> {this.state.selectedDocument.number}  &nbsp; {'(' + this.state.selectedDocument.noticeNumber + ')'} </i>
                                                &nbsp;
                                                <i class="fa fa-trash" onClick={() => this.setState({selectedDocument : null})}> </i>
                                            </span>) :
                                            (<></>)
                                        }


                                        <i onClick={() => {this.setState({showSelectDocuments : false}); setTimeout(() => this.handleSearch(),0);}} className="fa fa-fast-backward" style={{position: 'absolute', right: '16px', top: '-40px', 'font-size': '21px', cursor: 'pointer'}}></i>
                                        <CompletedNoticeListingComponent onRef={ref => (this.childCan = ref)} onSelected={ref => (this.applyDocument(ref))}/>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div> : <></> }
                { !this.state.showSelectDocuments ? <div className="col-md-12" style={{position: 'relative', top: '-60px'}}>
                    <div className="offersResults">
                        <TextField label="Filter (Name, TIN or J)"
                                   style={{width: '200px', position: 'relative', top: '50px', left: '100px', zIndex: '999'}}
                                   onChange={(e) => {this.setState({canOfferInput: e.target.value});setTimeout(() => this.handleSearch(),0);}}
                                   margin="normal"/>
                        <FormControlLabel control={
                                <Checkbox
                                    checked={this.state.awardedOffers}
                                       onChange={(e) => {this.setState({awardedOffers: e.target.checked});setTimeout(() => this.handleSearch(),0);}}
                                    value={this.state.awardedOffers}
                                    color="primary"
                                        />
                          } label="Awarded Offers"   style={{width: '200px', position: 'relative', top: '83px', left: '150px', zIndex: '999'}}/>
                        <FormControlLabel control={
                                <Checkbox
                                   checked={this.state.notAwardedOffers}
                                    onChange={(e) => {this.setState({notAwardedOffers: e.target.checked});setTimeout(() => this.handleSearch(),0);}}
                                    value={this.state.notAwardedOffers}
                                    color="primary"
                                        />
                          } label="Not Awarded Offers"   style={{width: '200px', position: 'relative', top: '83px', left: '150px', zIndex: '999'}}/>
                        <CodeExample beforeCodeTitle="Offers">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div>
                                        { this.state.selectedDocument ?
                                            (<span className="arrow_box" style={{position: 'absolute', right: '71px', top: '-39px'}}>
                                                <i> {this.state.selectedDocument.number}  &nbsp; {'(' + this.state.selectedDocument.noticeNumber + ')'} </i>
                                                &nbsp;
                                                <i class="fa fa-trash" onClick={() => this.setState({selectedDocument : null})}> </i>
                                            </span>) :
                                            (<></>)
                                        }

                                        <i onClick={() => {this.setState({showSelectDocuments : true}); setTimeout(() => this.handleSearch(),0);}} className="fa fa-fast-forward" style={{position: 'absolute', right: '16px', top: '-40px', 'font-size': '21px', cursor: 'pointer'}}></i>
                                        <CompletedNoticeOffersListingComponent onRef={ref => (this.childOffers = ref)} onSelected={ref => (this.applyOffer(ref))}/>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div> : <></> }

                <div className="col-md-12" style={{visibility: (this.state.selectedOffer != null ? '' : 'hidden'), position: 'relative', top: '-45px'}}>
                    <div className="offersResults">
                        <CodeExample beforeCodeTitle="Offer Summary">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div>
                                        <ExplainedOfferComponent onRef={ref => (this.extendedOffers = ref)}  />
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