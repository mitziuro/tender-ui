import React from "react";

export default class DocumentLink extends React.Component {

    constructor(props) {

        super(props);

        console.log(this.props);

        this.state = {
            name: this.props.name,
            noticeId: this.props.noticeId,
            type: this.props.type
        }

    }

    render() {
        return (
            <>
                {this.state.type == "12" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/rfq-invitation/v2/view/' + this.state.noticeId}>{this.state.name}</a> : ''}
                {this.state.type == "7" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/pc-notice/v2/view/' + this.state.noticeId}>{this.state.name}</a> : ''}
                {this.state.type == "2" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/c-notice/v2/view/' + this.state.noticeId}>{this.state.name}</a> : ''}
                {this.state.type == "6" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/dc-notice/v2/view/' + this.state.noticeId}>{this.state.name}</a> : ''}
                {this.state.type == "17" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/simplified-notice/v2/view/' + this.state.noticeId}>{this.state.name}</a> : ''}
                &nbsp;
                <i class="fa fa-external-link-alt"></i>
            </>
        )
    }
}