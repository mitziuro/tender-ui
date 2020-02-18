import React from "react";
import Notice from "../../../../../partials/content/Notice";
import CodeExample from "../../../../../partials/content/CodeExample";
import { Button, Form, InputGroup, Col, Row } from "react-bootstrap";

import {getCpv, getContractingAuthority, getBusinessFields, getNuts, searchCpvs, searchContractingAuthorities} from "../../../../../crud/tender/search.notice.crud";

import {getAgg} from "../../../../../crud/tender/comparison.crud";


import {saveAlert, getAlert} from "../../../../../crud/tender/alert.crud";
import { getMap } from "../../../../../crud/tender/map";


import  QuantitativeRankingComponent from '../../components/comparison/QuantitativeRankingComponent';
import  ValueRankingComponent from '../../components/comparison/ValueRankingComponent';
import  ComparisonNoticeListingComponent from '../../components/comparison/ComparisonNoticeListingComponent';




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
        this.quantitativePage = null;
        this.valuePage = null;
        this.noticeWinnersListingPage = null;
        this.noticeParticipantsListingPage = null;

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

        if (this.props.location.search != null && this.props.location.search.split('?').length == 2) {
            this.state.nuts = [{
                id: this.props.location.search.split('?')[1].split('&')[2].split('=')[1],
                name: ''
            }];


        }

        Promise.all([getNuts()]).then(response => {
            this.nuts = response[0].data;
        });

        Promise.all([getMap()]).then(response => {
            this.setState({map: response[0].data});

            setTimeout(() => {$('#' + window.location.search.split('?')[1].split('&')[2].split('=')[1].replace('#', '')).attr('fill', 'indigo');}, 0);

            let self = this;
            $("path").each(function (index) {
                $(this).on("click", function (evt) {
                    let nut = {id: $(this).attr('id'), name: ''};
                    $(this).attr('fill', 'indigo');
                    let res = self.addNut(nut);
                    if (res == 0) {
                        self.removeNut(nut);
                        $(this).attr('fill', '#999999');
                    }

                });

                $(this).on("mousemove", function (evt) {


                    if (document.getElementById("best_" + $(this).attr('id')) == null) {
                        return;
                    }

                    let tooltip = document.getElementById("tooltip");
                    tooltip.innerHTML = document.getElementById("best_" + $(this).attr('id')).innerHTML;
                    tooltip.style.display = "block";
                    tooltip.style.left = evt.pageX - 250 + 'px';
                    tooltip.style.top = evt.pageY - 150 + 'px';
                });

                $(this).on("mouseout", function (evt) {
                    var tooltip = document.getElementById("tooltip");
                    tooltip.style.display = "none";
                });
            });
        });


        this.addNut = this.addNut.bind(this);
        this.removeNut = this.removeNut.bind(this);
        this.getAggs = this.getAggs.bind(this);


        this.setState({});
        this.getAggs();
        setTimeout(() => this.handleSearch(), 0);

    }


    handleSearch = () => {
        this.setState({});
        this.quantitativePage.handleSearch(this.state.cpvs[0], this.state.nuts);
        this.valuePage.handleSearch(this.state.cpvs[0], this.state.nuts);
        this.noticeWinnersListingPage.handleSearch(this.state.cpvs, this.state.cas);
        this.noticeParticipantsListingPage.handleSearch(this.state.cpvs, this.state.cas);

    }


    addNut = (nut) => {
        if (this.state.nuts.filter(n => n.id == nut.id).length > 0) {
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

    getAggs = () => {
        Promise.all([getAgg(this.state.cpvs[0].id)]).then(response => {
            this.setState({aggs : response[0].data});
        });
    }


    render() {

        return (
            <>
            <div id="tooltip" display="none" style={{position: "absolute", display: "none"}}></div>
            <div className="row">

                <div className="col-md-12" style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="offersResults">
                        <CodeExample beforeCodeTitle="Locations">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="entity_compare">

                                        {this.state.map ? (
                                            <div dangerouslySetInnerHTML={{__html: this.state.map}}></div>) : (<></>)}

                                    </div>
                                </div>

                                <div className="col-md-12"
                                     style={{display: 'none', position: 'relative', top: '0px', padding: '10px', minHeight: '40px'}}>
                                    {
                                        this.state.aggs ? Object.keys(this.state.aggs).map((d) => {
                                            return (
                                                <div>

                                                    <div id={'best_' + d}>
                                                            <table>
                                                                <th>Company Name | </th>
                                                                <th># bids won | </th>
                                                                <th># participations</th>

                                                                {
                                                                    this.state.aggs[d].length > 0 ? (
                                                                        this.state.aggs[d].map((e) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td> {e.name}  | </td>
                                                                                    <td style={{textAlign: 'right'}}> {e.data}  | </td>
                                                                                    <td style={{textAlign: 'right'}}> {e.extra}  | </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    ) : (<tr><td colspan="3" style={{textAlign: 'center'}}> <b> No Results </b> </td></tr>)
                                                                }
                                                            </table>
                                                    </div>
                                                </div>)
                                        }) : (<></>)
                                    }
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>

                <div className="row col-md-12" style={{display: 'flex'}}>
                    <div className="col-md-6">
                        <CodeExample beforeCodeTitle="Quantitative Ranking" >
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        <QuantitativeRankingComponent onRef={ref => (this.quantitativePage = ref)} />
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                    <div className="col-md-6">
                        <CodeExample beforeCodeTitle="Value Ranking">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        <ValueRankingComponent onRef={ref => (this.valuePage = ref)} />
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>


                <div className="row col-md-12">
                    <div class="col-md-12">
                        <CodeExample beforeCodeTitle="Winning Companies">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        <ComparisonNoticeListingComponent onRef={ref => (this.noticeWinnersListingPage = ref)} winners={true} />
                                    </div>
                                </div>
                            </div>
                        </CodeExample>
                    </div>
                </div>

                <div className="row col-md-12">
                    <div class="col-md-12">
                        <CodeExample beforeCodeTitle="Participating Companies">
                            <div className="kt-section">
                                <div className="col-md-12">
                                    <div className="kt-section__content">
                                        <ComparisonNoticeListingComponent onRef={ref => (this.noticeParticipantsListingPage = ref)} winners={false} />
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