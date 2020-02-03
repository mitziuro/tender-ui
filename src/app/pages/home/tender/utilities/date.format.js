import React from "react";
import numeral from 'numeral';

export default class DateFormat extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            value: this.props.value,
            withTime : this.props.withTime
        }

    }

    compute(value) {

        if (value == null) {
            return '';
        }

        let d = new Date(value);
        let datestring = this.applyPrefix(d.getDate())  + "." + this.applyPrefix(d.getMonth()+1) + "." + d.getFullYear();

        if(this.state.withTime) {
            datestring = datestring + " " + this.applyPrefix(d.getHours()) + ":" + this.applyPrefix(d.getMinutes());
        }

        return datestring;

    }

    applyPrefix(x:string) {
        return (x + '').length === 1 ? ('0' + x) : ('' + x);
    }

    render() {
        return (
            <>
                {this.state.value == null ? '' : this.compute(this.state.value)}
            </>
        )
    }
}