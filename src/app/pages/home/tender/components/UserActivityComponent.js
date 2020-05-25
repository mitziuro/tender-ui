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
    TableFooter
} from "@material-ui/core";


import {getLastActivities, getActivitiesForOffer} from "../../../../crud/tender/activity.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import DateFormat from "../utilities/date.format";

export default class UserActivityComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {activities: [], offer: props.offer};

        Promise.all([this.state.offer == null ? getLastActivities() : getActivitiesForOffer(this.state.offer)]).then(response => {
            this.setState({activities: response[0].data});
        });

    }

    getActivity(activity) {
        if (activity.type == 1) return 'Password Reset';

        if (activity.type == 2) return 'An alert with the name "' + activity.entity1Data + '" has been created';
        if (activity.type == 3) return 'An alert with the name "' + activity.entity1Data + '" has been updated';

        if (activity.type == 4) return 'A procedure for "' + activity.entity1Data + '" has been created';
        if (activity.type == 5) return 'A procedure for "' + activity.entity1Data + '" has been declined';

        if (activity.type == 6) return 'A chapter has been assigned to you on  <a target="_blank" href="/tender/tender-pages/OfferPage?id=' + activity.entity1 + '">' +  activity.entity1Data + '</a>';
        return '';
    }


    render() {
        return (
            <>
            {
                this.state.activities.length == 0 ?

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
                 this.state.activities.length > 0 ?
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">
                                    Date
                                </TableCell>
                                <TableCell align="left">
                                    Activity Name
                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.activities.map((activity, index) => {

                                    return  (
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                               <DateFormat value={activity.date} withTime={true} />
                                            </TableCell>
                                            <TableCell align="left">
                                               <div dangerouslySetInnerHTML={{__html: this.getActivity(activity)}}></div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>

                    </Table>
                </Paper>

                :
                 <span></span>

            }
            </>
        )
    }
}
