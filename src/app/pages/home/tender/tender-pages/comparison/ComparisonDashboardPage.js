import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";

import {getCpv, getContractingAuthority, getBusinessFields, getNuts, searchCpvs, searchContractingAuthorities} from "../../../../../crud/tender/search.notice.crud";
import { getAgg } from "../../../../../crud/tender/provider.crud";

import {saveAlert, getAlert} from "../../../../../crud/tender/alert.crud";
import { getMap } from "../../../../../crud/tender/map";
import  AlertListingComponent from '../../components/AlertListingComponent';
import  OfferListingComponent from '../../components/OfferListingComponent';
import  CompletedNoticeListingComponent from '../../components/CompletedNoticeListingComponent';
import  CompletedNoticeOffersListingComponent from '../../components/CompletedNoticeOffersListingComponent';
import  CompletedNoticeOffersGroupingComponent from '../../components/CompletedNoticeOffersGroupingComponent';
import  ExplainedOfferComponent from '../../components/ExplainedOfferComponent';

import $ from 'jquery';
import 'jquery-ui-bundle';

import './ComparisonDashboardPage.css';


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

export default class ComparisonDashboardPage extends React.Component {


    constructor(props) {
        super(props);

        this.cpvs = [];
        this.cas = [];


        this.initialState = {

            selectedOffer: null,
            selectedDocument: null,

            canInput: null,
            canOfferInputCPV: null,
            canOfferInputCA: null,


            notAwardedOffers: true,
            awardedOffers: true,

            number: null,

            aggs: null,

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

        Promise.all([getMap()]).then(response => {
             this.setState({map: response[0].data});

            let self = this;
            $( "path" ).each(function(index) {
                $(this).on("click", function(evt){
                    let nut = {id: $(this).attr('id'), name: ''};
                    $(this).attr('fill', 'indigo');
                    let res = self.addNut(nut);
                    if(res == 0) {
                        self.removeNut(nut);
                        $(this).attr('fill', '#999999');
                    }

                });

                $(this).on("mousemove", function(evt){


                    if(document.getElementById("best_" + $(this).attr('id')) == null) {
                        return;
                    }

                    let tooltip = document.getElementById("tooltip");
                    tooltip.innerHTML = document.getElementById("best_" + $(this).attr('id')).innerHTML;
                    tooltip.style.display = "block";
                    tooltip.style.left = evt.pageX - 250 + 'px';
                    tooltip.style.top = evt.pageY - 150 + 'px';
                });

                $(this).on("mouseout", function(evt){
                    var tooltip = document.getElementById("tooltip");
                    tooltip.style.display = "none";
                });
            });
        });


        if(this.state.cpvs[0]) {
            Promise.all([getCpv(this.state.cpvs[0].id), getContractingAuthority(this.state.cas[0].id)]).then(response => {
                this.setState({cpvs: [{id: response[0].data.id, nameEn: response[0].data.nameEn}]});
                this.setState({cas: [{id: response[1].data.id, name: response[1].data.name}]});
            });
        }


        this.getAggs = this.getAggs.bind(this);
        this.addNut = this.addNut.bind(this);
        this.removeNut = this.removeNut.bind(this);

        this.applyOffer = this.applyOffer.bind(this);

        this.applyOfferCPV = this.applyOfferCPV.bind(this);
        this.applyOfferCA = this.applyOfferCA.bind(this);

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

        if(this.childOffersCPV) {
            this.childOffersCPV.getCans(this.getOfferSearchObject({input : this.state.canOfferInputCPV, selectedDocument: {number: null}}));
        }


        if(this.childOffersCA) {
            this.childOffersCA.getCans(this.getOfferSearchObject({input : this.state.canOfferInputCA, selectedDocument: {number: null}}));
        }

        if(this.childOffers) {
            this.childOffers.getCans(this.getOfferSearchObject({selectedDocument: {number: null}}));
        }

        if(this.childComponents) {
            this.childComponents.getCans(this.getOfferSearchObject());
        }

        this.getAggs(this.getOfferSearchObject());
        this.setState({});
    }

    getAggs = (data) => {
        Promise.all([getAgg(data)]).then(response => {
            this.setState({aggs : response[0].data});
        });
    }

    applyOffer = (data) => {
        this.setState({selectedOffer: data});
        this.extendedOffers.handleApplyData(data);
    }

    applyOfferCPV = (data) => {
        this.setState({selectedOfferCPVCA: data, selectedDocument: null});
        setTimeout(() => this.childOffers.getCans(this.getOfferSearchObject()), 0);
        // this.extendedOffers.handleApplyData(data);
    }

    applyOfferCA = (data) => {
        this.setState({selectedOfferCPVCA: data, selectedDocument: null});
        setTimeout(() => this.childOffers.getCans(this.getOfferSearchObject()), 0);

        //  this.extendedOffers.handleApplyData(data);
    }

    applyDocument = (data) => {
        this.setState({selectedDocument: data});
        this.childComponents.handleApplyDocument(data);
        setTimeout(() => this.childComponents.getCans(this.getOfferSearchObject()), 0);
    }


    addNut = (nut) => {
        if(this.state.nuts.filter(n => n.id == nut.id).length > 0) {
            return 0;
        }
        this.state.nuts.push(nut);
        this.setState({nuts: this.state.nuts});
        this.handleSearch();
        return 1;
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

    getOfferSearchObject = (i) => {
        return {
            input: i && i.input ? i.input : this.state.canOfferInput,

            document: i && i.selectedDocument != null ? i.selectedDocument.number : (this.state.selectedDocument ? this.state.selectedDocument.number : null),

            cas: this.state.cas.map( c => c.id),
            cpvs: this.state.cpvs.map( c => c.id),
            nuts: this.state.nuts.map( c => c.id),

            number: this.state.number,

            startDate: this.state.startDate,
            endDate: this.state.endDate,

            id: this.state.selectedOfferCPVCA != null ? this.state.selectedOfferCPVCA.id : null,

            aggregate: true
        }
    }

    render() {

        return (
            <>
            <div id="tooltip" display="none" style={{position: "absolute", display: "none"}}></div>
            <div className="row">

                    <div className="col-md-12" style={{display: 'flex', flexDirection: 'column'}}>
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

                                            {this.state.map ? (<div dangerouslySetInnerHTML={{__html: this.state.map}}></div>) : (<></>)}

                                        </div>
                                    </div>

                                    <div className="col-md-12" style={{display: 'none', position: 'relative', top: '0px', padding: '10px', minHeight: '40px'}}>
                                        {
                                            this.state.aggs ? Object.keys(this.state.aggs).map((d) => {
                                                return (
                                                    <div id={'best_' + d}>
                                                        <div>
                                                            {
                                                               (
                                                                    this.state.aggs[d].map((e) => {
                                                                        return (<div> {e.name} : {e.won} </div>)
                                                                    })
                                                                )
                                                            }
                                                        </div>
                                                    </div>)
                                            }) : (<></>)
                                        }
                                    </div>
                                </div>
                            </CodeExample>
                        </div>
                    </div>
                    <div className="col-md-12" style={{display: 'flex'}}>

                        <div className="col-md-6" style={{display: 'flex', flexDirection: 'column'}}>
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
                                                    <i className="fa fa-trash" onClick={(e) => this.removeCPV(d)}> </i>
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


                        <div className="col-md-6" style={{display: 'flex', flexDirection: 'column'}}>
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
                                                    <i className="fa fa-trash" onClick={(e) => this.removeCA(d)}> </i>
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


                <div className={this.state.cas.length > 0 ? 'col-md-6' : 'col-md-12'} style={{position: 'relative', top: '-60px'}}>
                    <div className="offersResults">
                        <TextField label="Filter (Name, TIN or J)"
                                   style={{width: '200px', position: 'relative', top: '50px', left: '200px', zIndex: '999'}}
                                   onChange={(e) => {this.setState({canOfferInputCPV: e.target.value});setTimeout(() => this.handleSearch(),0);}}
                                   margin="normal"/>
                        <CodeExample beforeCodeTitle="Offers (CPV)">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div>
                                        <CompletedNoticeOffersGroupingComponent  noCa={true}  onRef={ref => (this.childOffersCPV = ref)} onSelected={ref => (this.applyOfferCPV(ref))}/>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>

                <div className={this.state.cas.length > 0 ? 'col-md-6' : 'col-md-12'} style={{position: 'relative', top: '-60px', visibility: this.state.cas.length > 0 ? '' : 'hidden', height: this.state.cas.length > 0 ? '' : '0px'}}>
                    <div className="offersResults">
                        <TextField label="Filter (Name, TIN or J)"
                                   style={{width: '200px', position: 'relative', top: '50px', left: '200px', zIndex: '999'}}
                                   onChange={(e) => {this.setState({canOfferInputCA: e.target.value});setTimeout(() => this.handleSearch(),0);}}
                                   margin="normal"/>
                        <CodeExample beforeCodeTitle="Offers (CPV and CA)">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div>
                                        <CompletedNoticeOffersGroupingComponent onRef={ref => (this.childOffersCA = ref)} onSelected={ref => (this.applyOfferCA(ref))}/>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>

                <div className="col-md-12" style={{position: 'relative', top: '-60px', visibility : this.state.selectedOfferCPVCA ? '' : 'hidden', height: this.state.selectedOfferCPVCA ? '' : '0'}}>
                    <div className="offersResults">
                        <CodeExample beforeCodeTitle="All the Notices for the selected Provider">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div>
                                        <CompletedNoticeOffersListingComponent inverse={true} onRef={ref => (this.childOffers = ref)} onSelected={ref => ref ? this.applyDocument(ref.can) : null}/>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>

                <div className="col-md-12" style={{position: 'relative', top: '-60px', visibility : this.state.selectedDocument ? '' : 'hidden', height: this.state.selectedDocument ? '' : '0'}}>
                    <div className="offersResults">
                        <CodeExample beforeCodeTitle="Offers For the Above Notice">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div>
                                        <CompletedNoticeOffersListingComponent onRef={ref => (this.childComponents = ref)} onSelected={ref => (this.applyOffer(ref))}/>
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>

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