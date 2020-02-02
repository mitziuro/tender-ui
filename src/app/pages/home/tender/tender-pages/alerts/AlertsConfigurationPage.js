import React from "react";
import  NoticeSearchPage from '../../tender-pages/NoticeSearchPage';

export default class AlertsConfigurationPage extends React.Component {

    constructor(props) {
        super(props);

        if(this.props.location) {
            this.alertId = this.props.location.search != null && this.props.location.search.split('alert=').length == 2 ? this.props.location.search.split('alert=')[1] : null;
        }
    }


    render() {
        return (
            <>
                <NoticeSearchPage alertId={this.alertId} isAlert={true} />
            </>
        )}
}