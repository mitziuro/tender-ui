import React from "react";

export default class DocumentLink extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            name: this.props.name,
            noticeId: this.props.noticeId,
            type: this.props.type,
            noName: this.props.noName ? this.props.noName : false
        }

    }

    render() {
        return (
            <>
                {this.state.type == "12" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/rfq-invitation/v2/view/' + this.state.noticeId}>
                    {!this.state.noName ? this.state.name : ''}
                    &nbsp;
                    <i class="fa fa-external-link-alt"></i>
                </a> : ''}

                {this.state.type == "7" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/pc-notice/v2/view/' + this.state.noticeId}>
                    {!this.state.noName ? this.state.name : ''}
                    &nbsp;
                    <i class="fa fa-external-link-alt"></i>
                </a> : ''}

                {this.state.type == "2" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/c-notice/v2/view/' + this.state.noticeId}>
                    {!this.state.noName ? this.state.name : ''}
                    &nbsp;
                    <i class="fa fa-external-link-alt"></i>
                </a> : ''}

                {this.state.type == "6" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/dc-notice/v2/view/' + this.state.noticeId}>
                    {!this.state.noName ? this.state.name : ''}
                    &nbsp;
                    <i class="fa fa-external-link-alt"></i>
                </a> : ''}

                {this.state.type == "17" ? <a target="_blank" href={'https://sicap-prod.e-licitatie.ro/pub/notices/simplified-notice/v2/view/' + this.state.noticeId}>
                    {!this.state.noName ? this.state.name : ''}
                    &nbsp;
                    <i class="fa fa-external-link-alt"></i>
                </a> : ''}

            </>
        )
    }
}