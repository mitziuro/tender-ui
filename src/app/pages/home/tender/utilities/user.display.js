import React from "react";

import {getUserDisplay} from "../../../../crud/tender/user.details.crud";

export default class UserDisplay extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            id: this.props.id,
            user: null
        }

        if(this.state.id) {
            Promise.all([getUserDisplay(this.state.id)]).then(response => {
                this.setState({user: response[0].data});

                var md5 = require('md5');
                this.setState({img: 'http://gravatar.com/avatar/' + md5(this.state.user.login)});
            })
        }

    }

    render() {
        return (
            <>
                {
                    this.state.user  ?
                    <div style={{display: 'flex'}}>
                        <div>
                            <img style={{height: '30px'}} alt="Pic" src={this.state.img} />
                        </div>

                        <div>
                            <div> {this.state.user.firstName}  {this.state.user.lastName} </div>
                            <div>
                                <a href={ 'mailto:' + this.state.user.login}>
                                    {this.state.user.login}
                                </a>
                            </div>
                        </div>

                    </div> :
                    <span></span>
                }

            </>
        )
    }
}