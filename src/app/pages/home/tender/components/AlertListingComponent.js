import React from "react";
import { Link } from 'react-router-dom';

import { Button } from "react-bootstrap";

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

    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";

import CodeExample from "../../../../partials/content/CodeExample";


import DeleteIcon from "@material-ui/icons/Delete";
import  NoticeListingComponent from '../components/NoticeListingComponent';


import {getMyAlerts, deleteAlerts, activateAlerts} from "../../../../crud/tender/alert.crud";


export default class AlertListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {alerts: [], confirm: false, selectedAlert: null};

        this.getAlerts = this.getAlerts.bind(this);
        this.markAlert = this.markAlert.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleSearch = this.handleSearch.bind(this);


        this.getAlerts();
    }


    markAlert = (id) => {
        let all = this.state.all;

        if (id === null) {
            let all = !this.state.all;
        }

        let elems = this.state.alerts.filter(a => id == null || a.id === id);
        elems.forEach(e =>  e.checked = id !== null ? (e.checked == null || e.checked === false ? true : false) : (all));
        this.setState({alerts: this.state.alerts, all: all});
    }

    handleAction = () => {

        if(this.state.toBeDeleted != null) {
            Promise.all([deleteAlerts(this.state.toBeDeleted)]).then(response => {
                this.getAlerts();
                this.setState({confirm: false});
            });
        }

        if(this.state.toBeActivated != null) {
            Promise.all([activateAlerts(this.state.toBeActivated)]).then(response => {
                this.getAlerts();
                this.setState({confirm: false});
            });
        }

        if(this.state.toBeDeactivated != null) {
            Promise.all([activateAlerts(this.state.toBeDeactivated)]).then(response => {
                this.getAlerts();
                this.setState({confirm: false});
            });
        }

        this.state.toBeDeleted = null;
        this.state.toBeActivated = null;
        this.state.toBeDeactivated = null;

    }

    getAlerts = () => {
        Promise.all([getMyAlerts()]).then(response => {
            this.setState({alerts: response[0].data});
        });
    }

    handleSearch = (alert) => {
        this.child.getNotices(alert ? alert : this.state.selectedAlert);
    }


    render() {
        return (
            <>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {
                            this.state.alerts.map((alert, index) => {

                                return (
                                    <TableRow key={alert.id} style={{background: alert.active ? '' : 'lightgray'}}>
                                        <TableCell component="th" scope="row">


                                            <b onClick={() => {this.setState({selectedAlert : alert}); setTimeout(this.handleSearch(alert), 0);}} style={{cursor: 'pointer', color: "#5867dd", textDecoration: "underline", fontSize:"15px"}}>
                                                {alert.alertName}
                                            </b>


                                            <div className="row" style={{position: "relative", top:"10px"}}>
                                                <div className="col-md-4">

                                                    <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Keywords: </span>
                                                    <strong className="ng-binding ng-scope">{alert.keywords}</strong>
                                                    <br/>

                                                    <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Type of notice: </span>
                                                    <strong className="ng-binding">
                                                        <b> {!alert.rfq && !alert.cn && !alert.scn && !alert.ccn && !alert.dccn ? 'All ' : ''} </b>
                                                        <b> {alert.rfq && alert.cn && alert.scn && alert.ccn && alert.dccn ? 'All' : ''} </b>
                                                        { !(alert.rfq && alert.cn && alert.scn && alert.ccn && alert.dccn) ?
                                                        <b>
                                                            {alert.rfq ? 'Call for tenders (RFQ) ' : ''}  {alert.cn ? 'Contract notice (CN) ' : ''}  {alert.scn ? 'Simplified contract notice (SCN) ' : ''}  {alert.ccn ? 'Concession notice (PC) ' : ''}  {alert.dccn ? 'Design Contest Notice (DC) ' : ''}
                                                        </b>
                                                            :
                                                            <></>
                                                        }
                                                    </strong>
                                                </div>
                                                <div className="col-md-4">

                                                    <i sicap-icon="ContractType" className="fa fa-balance-scale"></i>Contract Name:
                                                    <strong className="ng-binding">{alert.name}</strong>

                                                    <br/>

                                                    <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> Contracting Authority:
                                                    <strong className="ng-binding">{alert.contractingAuthority ? alert.contractingAuthority.name : ''}</strong>

                                                    <br/>

                                                    <div className="ng-scope">
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Business Field:
                                                        <strong className="ng-binding">{alert.businessField ? alert.businessField.nameEn : ''}</strong>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">

                                                    <i sicap-icon="ContractType" className="fa fa-balance-scale"></i>CPV:
                                                    <strong className="ng-binding">{alert.cpv ? alert.cpv.nameEn : ''}</strong>

                                                    <br/>

                                                    <i sicap-icon="CPVCode" className="fa fa-sitemap"></i> Location:
                                                    <strong className="ng-binding">{alert.nuts ? alert.nuts.name: ''}</strong>

                                                    <br/>

                                                    <div className="ng-scope">
                                                        <i sicap-icon="ContractingAuthority" className="fa fa-briefcase"></i> Estimated  Value:
                                                        <strong className="ng-binding">{alert.tevStart} - {alert.tevEnd}</strong>
                                                    </div>

                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <div style={{width: '70px', color: 'gray'}}>
                                                <a  style={{color: !alert.active ? '' : 'green'}} onClick={() => {if (alert.active) {this.setState({toBeDeactivated: alert.id, confirm: true});} else  {this.setState({toBeActivated: alert.id, confirm: true});}}}>
                                                    <i className={!alert.active ? 'fa fa-times fa-lg' : 'fa fa-check fa-lg'}  title={ !alert.active ? 'Activate' : 'Deactivate'}> </i>
                                                </a>
                                                &nbsp;
                                                <Link style={{color: 'gray'}}
                                                    to={`/tender/tender-pages/AlertsConfigurationPage?alert=${alert.id}`}>
                                                    <i className="fa fa-edit fa-lg" title="Edit"> </i>
                                                </Link>
                                                &nbsp;
                                                <a onClick={() => this.setState({toBeDeleted: alert.id, confirm: true})}>
                                                    <i className="fa fa-trash fa-lg"  title="Delete"> </i>
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                         
                                )
                            })}
                    </TableBody>
                </Table>
            </Paper>

            {
                (<div className="row" style={{height : this.state.selectedAlert != null ? '' : '0', visibility : this.state.selectedAlert != null ? '' : 'hidden',position: 'relative', top: '10px',left: '10px', width: '100%'}}>
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
            </div>)
            }

            <Dialog
                open={this.state.confirm}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Alert</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {this.state.toBeDeleted != null ? 'delete' : (this.state.toBeActivated  ? 'activate' : 'deactivate')} the alert ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({confirm: false})} color="primary">
                        Cancel
                    </Button>
                    <Button style={{background: 'green'}} onClick={() => this.handleAction()} color="primary">
                        <i className={this.state.toBeDeleted ? 'fa fa-trash' : (this.state.toBeActivated ? 'fa fa-check' : 'fa fa-times')}> </i> {this.state.toBeDeleted != null ? 'Delete' : (this.state.toBeActivated  ? 'Activate' : 'Deactivate')}
                    </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }
}