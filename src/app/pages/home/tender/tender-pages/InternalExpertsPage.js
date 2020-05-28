import React from "react";
import { Link } from 'react-router-dom';

import UsersPage from "./admin/UsersPage";


export default class InternalExpertsPage extends React.Component {

    constructor(props) {

        super(props);
        this.state = { };

    }


    render() {
        return (
            <>
                <UsersPage type={'internal'} />
            </>
        )
    }
}
