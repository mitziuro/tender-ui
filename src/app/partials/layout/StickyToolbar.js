/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default class StickyToolbar extends React.Component {
  render() {
    return (
      <>
        <ul className="kt-sticky-toolbar" style={{ marginTop: "30px" }}>
  
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip id="documentations-tooltip">Documentation</Tooltip>}
          >
            <li
              className="kt-sticky-toolbar__item kt-sticky-toolbar__item--warning"
              data-placement="left"
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://seap.ro"
              >
                <i className="flaticon2-telegram-logo" />
              </a>
            </li>
          </OverlayTrigger>
        </ul>
      </>
    );
  };
}
