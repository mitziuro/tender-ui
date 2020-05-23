import React from "react";


export default class PercentageDisplay extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            value: this.props.value,
        }

    }

    render() {
        return (
            <>
                {
                    this.state.value  ?
                    <div style={{display: 'flex'}}>
                        {this.state.value}
                    </div> :
                    <span></span>
                }

            </>
        )
    }
}