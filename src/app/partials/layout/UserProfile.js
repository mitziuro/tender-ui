/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { getUserByToken } from '../../crud/auth.crud';
import { toAbsoluteUrl } from "../../../_metronic";
import HeaderDropdownToggle from "../content/CustomDropdowns/HeaderDropdownToggle";

class UserProfile extends React.Component {


  constructor(props) {

    super(props);

    this.state = {user: props.user, img:''};
    Promise.all([getUserByToken()]).then(response => {
      var _user = response[0].data;

      this.setState({user: _user});

      var md5 = require('md5');
      this.setState({img: 'http://gravatar.com/avatar/' + md5(this.state.user.login)});

    });

  }


  render() {
    const { user, showHi, showAvatar, showBadge } = this.props;


    return (
      <Dropdown className="kt-header__topbar-item kt-header__topbar-item--user" drop="down" alignRight>
        <Dropdown.Toggle
          as={HeaderDropdownToggle}
          id="dropdown-toggle-user-profile"
        >
          <div className="kt-header__topbar-user">
            {showHi && (
              <span className="kt-header__topbar-welcome kt-hidden-mobile">
                Hi,
              </span>
            )}

            {showHi && (
              <span className="kt-header__topbar-username kt-hidden-mobile">
                {this.state.user.firstName} {this.state.user.lastName}
              </span>
            )}

            {showAvatar && <img alt="Pic" src={this.state.img} />}

            {showBadge && (
              <span className="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold">
                {/* TODO: Should get from currentUser */}
                John Doe
              </span>
            )}
          </div>
        </Dropdown.Toggle>

      </Dropdown>
    );
  }
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(UserProfile);
