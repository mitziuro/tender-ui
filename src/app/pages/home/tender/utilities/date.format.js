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

        let elements = value.split('T')[0].split('-');
        let ret =  elements[2] + '.' + elements[1] + '.' + elements[0];

        if(this.state.withTime) {
            ret = ret + ' ' + value.split('T')[1].split(':')[0] + ':' + value.split('T')[1].split(':')[1];
        }

        return ret;


    }

    render() {
        return (
            <>
                {this.state.value == null ? '' : this.compute(this.state.value)}
            </>
        )
    }
}