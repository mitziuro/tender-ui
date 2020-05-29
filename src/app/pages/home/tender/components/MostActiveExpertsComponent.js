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

import UserDisplay from "../utilities/user.display";

import {mostActiveUsers} from "../../../../crud/admin/users.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import DateFormat from "../utilities/date.format";

export default class MostActiveExpertsComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {experts: [], offer: props.offer};

        Promise.all([mostActiveUsers()]).then(response => {
            this.setState({experts: response[0].data});
        });

    }

    render() {
        return (
            <>
            {
                this.state.experts.length == 0 ?

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
                 this.state.experts.length > 0 ?
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">
                                    Expert
                                </TableCell>
                                <TableCell align="left">
                                    Chapters
                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.experts.map((user, index) => {

                                    return  (
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                               <UserDisplay id={user.id} />
                                            </TableCell>
                                            <TableCell align="left">
                                               {user.chapters}
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
