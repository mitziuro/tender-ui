import React from "react";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";
import store from '../../../app/store/store';

export default class MenuList extends React.Component {
  render() {
    const { currentUrl, menuConfig, layoutConfig } = this.props;


    return menuConfig.aside.items.map((child, index) => {

        var user = window.localStorage.getItem('_USER') != null ? JSON.parse(window.localStorage.getItem('_USER')) : null;

        var hasRole = function(item) {
            console.log(item.role);
            if(user) {
                console.log(user['authorities']);
            }

            console.log(user ? user['authorities'].indexOf(item.role) :'***');

            return item.role == null || (user != null && user['authorities'].indexOf(item.role) >=0);
        };

        return (
          <React.Fragment key={`menuList${index}`}>
            {child.section && hasRole(child) && <MenuSection item={child} />}
            {child.separator && <MenuItemSeparator item={child} />}
            {child.title && hasRole(child) && (
                <MenuItem
                    item={child}
                    currentUrl={currentUrl}
                    layoutConfig={layoutConfig}
                />
            )}
          </React.Fragment>
      );
    });
  }
}
