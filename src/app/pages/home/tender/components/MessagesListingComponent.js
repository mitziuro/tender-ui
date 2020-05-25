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


import {getMessages, saveMessage} from "../../../../crud/tender/message.crud";

import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import DateFormat from "../utilities/date.format";

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import addNotification from "../../../../widgets/NotificationWidget";

import './MessagesListingComponent.css';


import UserDisplay from "../utilities/user.display";

export default class MessagesListingComponent extends React.Component {

    constructor(props) {

        super(props);

       if(this.props['onRef']) {
          this.props['onRef'](this);
       }

        this.state = {messages: [], offer: this.props.offer, message: {message: ''}};

        Promise.all([getMessages(this.state.offer)]).then(response => {
            this.setState({messages: response[0].data});
        });

    }

    setTo = (id) => {
        this.state.message.to = id;
    }

    handleSave = () => {
        this.state.message.entityId = this.state.offer;


         Promise.all([saveMessage(this.state.message)]).then(rq => {
             addNotification("Success", "The message has been saved", 'success');
             Promise.all([getMessages(this.state.offer)]).then(response => {
                        let mess = response[0].data.sort((m1,m2) => m1.data > m2.date);
                        this.setState({messages: response[0].data, message: {message: ''}});
              });
         });
    }

    getReply = (ref) => {
        if(ref == null) {
            return null;
        }

        let reply  = this.state.messages.filter(m => m.id == ref);

        if(reply.length == 0) {
            return null;
        }

        return reply[0];
    }


    render() {
        return (
            <>

                  {
                     this.state.messages.length == 0 ?

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
                     this.state.messages.map((m, index) => {
                         return (
                            <div style={{marginBottom: '40px'}}>
                                <div style={{display: 'flex', fontWeight: 'bold', marginBottom: '10px'}}>
                                    <div style={{display: 'flex', marginRight: '20px'}}>
                                        <UserDisplay id={m.owner}/>
                                        <a href="#post">
                                            <i class="fa fa-envelope" onClick={() => {this.state.message.to = m.owner; this.setState({}); }} ></i>
                                        </a>

                                    </div>
                                    <div>
                                      {
                                        m.to ?
                                            <div style={{display: 'flex'}}>
                                                <div>
                                                    in reply to
                                                </div>
                                                <div style={{marginLeft: '20px'}}>
                                                    <UserDisplay id={m.to}/>
                                                </div>
                                            </div>
                                        :<span></span>
                                      }
                                    </div>
                                    <div>  on <DateFormat value={m.date} withTime={true}/> </div>
                                    <div>
                                        <a href="#post">
                                            <i style={{marginLeft: '20px'}} class="fa fa-arrow-right" onClick={() => {this.state.message.ref = m.id; this.state.message.to = m.owner; this.setState({}); }} ></i>
                                        </a>
                                    </div>
                                </div>
                                {
                                    m.ref != null && this.getReply(m.ref) != null  ?
                                        <div className="reply" style={{border: '1px solid black'}} dangerouslySetInnerHTML={{__html: this.getReply(m.ref).message}}></div>
                                         : <span></span>
                                }
                                <div dangerouslySetInnerHTML={{__html: m.message}}></div>

                            </div>
                         )
                     })
                 }

                  <a id="post"></a>
                  {
                    this.state.message.to ?
                        <div style={{display: 'flex'}}>
                            <div>
                                In reply to {this.state.message.ref ? ' a message of ' : ''}
                            </div>
                            <div>
                                <UserDisplay id={this.state.message.to}/>
                            </div>
                            <i class="fa fa-trash" onClick={() => {this.state.message.to = null; this.state.message.ref = null; this.setState({}); }} ></i>
                        </div>
                    :<span></span>
                  }
                  <CKEditor
                     editor={ ClassicEditor }
                     data={this.state.message.message}
                     onInit={ editor => {
                         // You can store the "editor" and use when it is needed.
                         console.log( 'Editor is ready to use!', editor );
                     } }
                     onChange={ ( event, editor ) => {
                         const data = editor.getData();
                         this.state.message.message = data;
                         console.log( { event, editor, data } );
                     } }
                     onBlur={ ( event, editor ) => {
                         console.log( 'Blur.', editor );
                     } }
                     onFocus={ ( event, editor ) => {
                         console.log( 'Focus.', editor );
                     } }
                 />

                 <Button style={{marginTop: "10px"}}  onClick={() => {this.handleSave(); this.setState({});}} color="primary">
                    Save
                 </Button>

            </>
        )
    }
}
