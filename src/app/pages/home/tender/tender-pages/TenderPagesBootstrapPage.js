import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NoticeSearchPage from "./NoticeSearchPage";
import TenderDashboardPage from './TenderDashboardPage';
import NoticePage from './NoticePage';
import OfferPage from './OfferPage';


export default function TenderPagesBootstrapPage() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/tender/tender-pages"
        to="/tender/tender-pages/TenderDashboardPage"
      />

      <Route 
        path="/tender/tender-pages/NoticeSearchPage"
        component={NoticeSearchPage}
      />

            <Route
  path="/tender/tender-pages/TenderDashboardPage"
  component={TenderDashboardPage}
      />

        <Route
            path="/tender/tender-pages/NoticePage"
            component={NoticePage}
        />

        <Route
            path="/tender/tender-pages/OfferPage"
            component={OfferPage}
        />

    </Switch>
  );
}
