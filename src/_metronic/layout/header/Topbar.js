import React from "react";
import SearchDropdown from "../../../app/partials/layout/SearchDropdown";
import UserNotifications from "../../../app/partials/layout/UserNotifications";
import MyCart from "../../../app/partials/layout/MyCart";
import QuickActionsPanel from "../../../app/partials/layout/QuickActionsPanel";
import QuickPanelToggler from "./QuickPanelToggle";
import LanguageSelector from "../../../app/partials/layout/LanguageSelector";
import UserProfile from "../../../app/partials/layout/UserProfile";
import { toAbsoluteUrl } from "../../utils/utils";
import { getUserByToken } from '../../../app/crud/auth.crud';

export default class Topbar extends React.Component {

    constructor(props) {

        super(props);

        this.state = {user: {}};
        Promise.all([getUserByToken()]).then(response => {
            var _user = response[0].data;

            this.setState({user: _user});

            var lastUser = window.localStorage.getItem('_USER') != null ? JSON.parse(window.localStorage.getItem('_USER')) : null;
            if(lastUser && JSON.stringify(lastUser) != JSON.stringify(_user)) {
                window.localStorage.setItem('_USER', JSON.stringify(_user));
                window.location.reload();
            }

        });

    }

  render() {
    return (
      <div className="kt-header__topbar">
        <SearchDropdown useSVG="true" />

        <LanguageSelector user={this.state.user} iconType="" />

        <UserProfile user={this.state.user} showAvatar={true} showHi={true} showBadge={false} />

      </div>
    );
  }
}
