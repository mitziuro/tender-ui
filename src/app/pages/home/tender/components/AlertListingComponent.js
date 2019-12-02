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


import {getMyAlerts, deleteAlerts} from "../../../../crud/tender/alert.crud";


export default class AlertListingComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {alerts: [], confirm: false, selectedAlert: null};

        this.getAlerts = this.getAlerts.bind(this);
        this.markAlert = this.markAlert.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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

    handleDelete = () => {

        Promise.all([deleteAlerts(this.state.toBeDeleted)]).then(response => {
            this.getAlerts();
            this.setState({confirm: false});
        });
        ;
    }

    getAlerts = () => {
        Promise.all([getMyAlerts()]).then(response => {
            this.setState({alerts: response[0].data});
        });
    }

    handleSearch = () => {
        if(this.child) {
            this.child.getNotices(this.state.selectedAlert);
        }
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
                                    <TableRow key={alert.id}>
                                        <TableCell component="th" scope="row">
                                            <a onClick={() => {this.setState({selectedAlert : alert});this.handleSearch()}}>
                                                <b style={{fontSize:"15px"}}>
                                                    {alert.alertName}
                                                </b>
                                            </a>
                                            <div className="row" style={{position: "relative", top:"10px"}}>
                                                <div className="">
                                                    <i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Types:</span>
                                                    <b> {!alert.rfq && !alert.cn && !alert.scn && !alert.ccn && !alert.dccn ? 'All ' : ''} </b>
                                                    <b>
                                                        {alert.rfq ? 'Call for tenders (RFQ) ' : ''}  {alert.cn ? 'Contract notice (CN) ' : ''}  {alert.scn ? 'Simplified contract notice (SCN) ' : ''}  {alert.ccn ? 'Concession notice (PC) ' : ''}  {alert.dccn ? 'Design Contest Notice (DC) ' : ''}
                                                    </b>
                                                    {alert.name ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Name:</span> <b> {alert.name} </b> </>) : ''}
                                                    {alert.number ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Number:</span> <b> {alert.number} </b> </>) : ''}

                                                    {alert.pdStart ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Publication Start Date:</span> <b> {alert.pdStart.split('T')[0].replace('-','.').replace('-','.')} </b> </>) : ''}
                                                    {alert.pdEnd ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Publication End Date:</span> <b> {alert.pdEnd.split('T')[0].replace('-','.').replace('-','.')} </b> </>) : ''}

                                                    {alert.contractingAuthority ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Contracting Authority:</span> <b> {alert.contractingAuthority.name} </b> </>) : ''}

                                                    {alert.businessField ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Business Field:</span> <b> {alert.businessField.nameEn} </b> </>) : ''}

                                                    {alert.rdStart ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Receipt Start Date:</span> <b> {alert.rdStart.split('T')[0].replace('-','.').replace('-','.')} </b> </>) : ''}
                                                    {alert.rdEnd ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Receipt End Date:</span> <b> {alert.rdEnd.split('T')[0].replace('-','.').replace('-','.')} </b> </>) : ''}

                                                    {alert.cpv ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Business Field:</span> <b> {alert.cpv.nameEn} </b> </>) : ''}


                                                    {alert.tevStart ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Receipt Start Date:</span> <b> {alert.tevStart} </b> </>) : ''}
                                                    {alert.tevEnd ? (<><i sicap-icon="ProcedureState" className="fa fa-cogs"></i> <span>Receipt End Date:</span> <b> {alert.tevEnd} </b> </>) : ''}

                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link
                                                to={`/tender/tender-pages/NoticeSearchPage?alert=${alert.id}`}>
                                                <i className="fa fa-edit fa-lg" title="Edit"> </i>
                                            </Link>
                                            &nbsp;
                                            <a onClick={() => this.setState({toBeDeleted: alert.id, confirm: true})}>
                                                <i className="fa fa-trash fa-lg"  title="Delete"> </i>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </Paper>

            {
                (<div className="row" style={{display : this.child != null && this.state.selectedAlert != null ? '' : 'none',position: 'relative', top: '10px',left: '10px', width: '100%'}}>
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
                        Are you sure you want to delete the selected alerts ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({confirm: false})} color="primary">
                        Cancel
                    </Button>
                    <Button style={{background: 'green'}} onClick={() => this.handleDelete()} color="primary">
                        <i className="fa fa-trash"> </i> Delete
                    </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }
}