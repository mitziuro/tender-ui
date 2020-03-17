import React from "react";
import numeral from 'numeral';

export default class Price extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            value: this.props.value
        }

    }

    compute(value) {
        if (value == null) {
            return '';
        }


        let val = numeral(value).format('0.0,0')
            .replace(',', 'T').replace(',', 'T').replace(',', 'T').replace(',', 'T').replace(',', 'T').replace(',', 'T')
                .replace('.', ',').replace('T', '.').replace('T', '.')
                .replace('T', '.').replace('T', '.')
                .replace('T', '.').replace('T', '.');

        return val.split(',')[0];


    }

    render() {
        return (
            <>
                {this.state.value == null ? '' : this.compute(this.state.value)}
            </>
        )
    }
}