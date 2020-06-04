import React from "react";
import { Link } from 'react-router-dom';

import CodeExample from "../../../../partials/content/CodeExample";

import  UserActivityListingComponent from '../components/UserActivityListingComponent';

export default class NotificationsPage extends React.Component {

    constructor(props) {

        super(props);
        this.state = { };

    }


    render() {
        return (
            <>
             <div className="row">
                   <div className="col-md-12" style={{display: 'flex', flexDirection: 'column', minHeight: '300px'}}>
                        <div>
                            <CodeExample beforeCodeTitle="Notifications">
                                <div className="kt-section">
                                    <div className="col-md-12">
                                        <div>
                                            <UserActivityListingComponent />
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
