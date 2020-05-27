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
    TextField,

    MenuItem,
    Select
} from "@material-ui/core";


import {getPartners} from "../../../../crud/tender/user.details.crud";
import {getPartnersForOffer, savePartner, deletePartnerByEntry} from "../../../../crud/tender/partner.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import UserDisplay from "../utilities/user.display";
import addNotification from "../../../../widgets/NotificationWidget";

export default class PartenersComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {users: [], offer: props.offer, cn: null, cui: null, partners: [], readonly: true};

       this.handleSearch();
       this.handleGetPartners();

    }

    handleSearch = () => {
        Promise.all([getPartners({companyName: this.state.cn, cui : this.state.cui})]).then(response => {
            this.setState({users: response[0].data});
        });
    }

    handleGetPartners = () => {
        Promise.all([getPartnersForOffer(this.state.offer)]).then(response => {
             this.setState({partners: response[0].data});
         });
    }

    deletePartnerByEntry = (partner) => {

        Promise.all([deletePartnerByEntry(partner.id)]).then(response => {
             this.handleGetPartners();
             addNotification("Success", "The partner has been deleted", 'success');

        });

    }

    handleSave = (u) => {

        Promise.all([savePartner({
            offerId: this.state.offer,
            	type: u.type,
            	userId: u.id,
            	companyName: u.invCompanyName,
            	cui: u.invRegistrationNumber,
            	companyAddress: u.invCompanyAddress
        })]).then(response => {
             this.handleGetPartners();
             addNotification("Success", "The partner has been added", 'success');

        });

    }

    render() {
        return (
            <>


             {
                            this.state.partners.length == 0 ?

                             <div className="col-md-12">
                                 <div className="kt-portlet kt-portlet--height-fluid">
                                     <div className="kt-portlet__body kt-portlet__body--fit">
                                         <div className="kt-widget kt-widget--project-1">
                                             <div className="kt-widget__head">
                                                 <div className="kt-widget__label" style={{width: '100%'}}>
                                                     <div className="kt-widget__media" style={{width: '100%'}}>
                                                         <div style={{textAlign: 'center', position: 'relative', top: '22px'}}><i>No Results</i></div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div> :
                             <span></span>

                        }

                         {
                             this.state.partners.length > 0 ?
                             <div className="col-md-12">
                                                  <div className="kt-portlet kt-portlet--height-fluid">
                                                      <div className="kt-portlet__body kt-portlet__body--fit">
                                                          <div className="kt-widget kt-widget--project-1">
                                                              <div className="kt-widget__head">
                                                                  <div className="kt-widget__label" style={{width: '100%'}}>
                                                                      <div className="kt-widget__media" style={{width: '100%'}}>



                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>

                                            <TableCell align="left">
                                                Company Name
                                            </TableCell>
                                            <TableCell align="left">
                                                CUI
                                            </TableCell>
                                            <TableCell align="left">
                                                Representative
                                            </TableCell>
                                            <TableCell align="left">
                                                Address
                                            </TableCell>
                                            <TableCell align="left">
                                               Type
                                            </TableCell>
                                            {!this.state.readonly ?
                                                <TableCell align="left">
                                                   Action
                                                </TableCell>
                                            : '' }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.partners.map((partner, index) => {

                                                return  (
                                                    <TableRow>
                                                        <TableCell align="left">
                                                            {partner.companyName}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {partner.cui}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                           <UserDisplay id={partner.userId} />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {partner.companyAddress}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {partner.type == 1 ?
                                                                'Associate' :
                                                                partner.type == 2 ?
                                                                'SubContractor' :
                                                                'Third Party'
                                                            }



                                                        </TableCell>
                                                        {!this.state.readonly ?
                                                            <TableCell align="left">
                                                                 <i style={{cursor: 'pointer',marginLeft: '10px', color: "red"}} class="fa fa-trash" onClick={() => this.deletePartnerByEntry(partner)}></i>
                                                            </TableCell>
                                                          : ''}
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>

                                </Table>
                            </Paper>

                                                    </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                            :
                             <span></span>
             }



            {
                this.state.users.length == 0 && !this.state.readonly ?

                 <div className="col-md-12">
                     <div className="kt-portlet kt-portlet--height-fluid">
                         <div className="kt-portlet__body kt-portlet__body--fit">
                             <div className="kt-widget kt-widget--project-1">
                                 <div className="kt-widget__head">
                                     <div className="kt-widget__label" style={{width: '100%'}}>
                                         <div className="kt-widget__media" style={{width: '100%'}}>
                                             <div style={{textAlign: 'center', position: 'relative', top: '22px'}}><i>No Results</i></div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div> :
                 <span></span>

            }

             {
                 this.state.users.length > 0 && !this.state.readonly ?
                 <div className="col-md-12">
                                      <div className="kt-portlet kt-portlet--height-fluid">
                                          <div className="kt-portlet__body kt-portlet__body--fit">
                                              <div className="kt-widget kt-widget--project-1">
                                                  <div className="kt-widget__head">
                                                      <div className="kt-widget__label" style={{width: '100%'}}>
                                                          <div className="kt-widget__media" style={{width: '100%'}}>


                <div style={{display: 'flex', marginBottom : '20px'}}>

                    <div className="col-md-3">
                        <TextField label="Company Name"
                                  value={this.state.cn}
                                  onChange={(e) => { this.state.cn = e.target.value; this.setState({});}}
                                  margin="normal"/>
                    </div>

                    <div className="col-md-3">
                         <TextField label="CUI"
                                  value={this.state.cui}
                                  onChange={(e) => { this.state.cui = e.target.value; this.setState({});}}
                                  margin="normal"/>
                    </div>

                    <div className="col-md-3" style={{position: 'relative', top: "10px"}}>
                         <Button style={{marginLeft: "10px", background: 'green'}}  onClick={() => {this.handleSearch();}} color="primary">
                             Search
                         </Button>
                    </div>


                </div>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>

                                <TableCell align="left">
                                    Company Name
                                </TableCell>
                                <TableCell align="left">
                                    CUI
                                </TableCell>
                                <TableCell align="left">
                                    Representative
                                </TableCell>
                                <TableCell align="left">
                                    Address
                                </TableCell>

                                {!this.state.readonly ?
                                    <>
                                        <TableCell align="left">
                                           Type
                                        </TableCell>
                                        <TableCell align="left">
                                           Action
                                        </TableCell>
                                    </>
                                  : ''}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.users.map((user, index) => {

                                    return  (
                                        <TableRow>
                                            <TableCell align="left">
                                                {user.invCompanyName}
                                            </TableCell>
                                            <TableCell align="left">
                                                {user.invRegistrationNumber}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                               <UserDisplay id={user.id} />
                                            </TableCell>
                                            <TableCell align="left">
                                                {user.invCompanyAddress}
                                            </TableCell>

                                            {!this.state.readonly ?
                                                <>
                                                    <TableCell align="left">
                                                        <Select style={{width: '100%', position: 'relative'}}
                                                                                onChange={(e) => {
                                                                                    user.type = e.target.value;
                                                                                    this.setState({});
                                                                                }}
                                                                                inputProps={{
                                                            name: "parteners",
                                                            id: "partners"
                                                        }}
                                                        >

                                                          <MenuItem value={1}>Associate</MenuItem>
                                                          <MenuItem value={2}>SubContractor</MenuItem>
                                                          <MenuItem value={3}>Third Party</MenuItem>

                                                        </Select>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                           { user.type != null ?
                                                                <i style={{marginLeft: '20px', cursor: 'pointer',fontSize: '24px',color: "green", float: "right"}} class="fa fa-plus-circle" onClick={() => this.handleSave(user)}></i>
                                                            :
                                                            <i style={{marginLeft: '20px', cursor: 'pointer',fontSize: '24px',color: "lightgreen", float: "right"}} class="fa fa-plus-circle"></i>
                                                            }
                                                    </TableCell>
                                                 </>
                                              : ''}
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>

                    </Table>
                </Paper>

                                        </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                :
                 <span></span>

            }
            </>
        )
    }
}
