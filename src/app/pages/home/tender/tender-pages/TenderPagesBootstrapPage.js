import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NoticeSearchPage from "./NoticeSearchPage";
import TenderDashboardPage from './TenderDashboardPage';
import SupervisorDashboardPage from './SupervisorDashboardPage';
import NoticePage from './NoticePage';
import OfferPage from './OfferPage';

import AlertsPage from './alerts/AlertsPage';
import NoticesPage from './alerts/NoticesPage';

import MyOpenOffersPage from './offers/MyOpenOffersPage'
import MyCompletedOffersPage from './offers/MyCompletedOffersPage'
import MyDeclinedOffersPage from './offers/MyDeclinedOffersPage'


import PersonalPage from './profile/PersonalPage';
import MyAccountPage from './profile/MyAccountPage';
import ChangePasswordPage from './profile/ChangePasswordPage';


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
                path="/tender/tender-pages/SupervisorDashboardPage"
                component={SupervisorDashboardPage}
            />

            <Route
                path="/tender/tender-pages/NoticePage"
                component={NoticePage}
            />

            <Route
                path="/tender/tender-pages/OfferPage"
                component={OfferPage}
            />

            <Route
                path="/tender/tender-pages/AlertsPage"
                component={AlertsPage}
            />

            <Route
                path="/tender/tender-pages/NoticesPage"
                component={NoticesPage}
            />

            <Route
                path="/tender/tender-pages/MyOpenOffersPage"
                component={MyOpenOffersPage}
            />

        <Route
            path="/tender/tender-pages/MyCompletedOffersPage"
            component={MyCompletedOffersPage}
        />

                <Route
                    path="/tender/tender-pages/MyDeclinedOffersPage"
                    component={MyDeclinedOffersPage}
                />

            <Route
                path="/tender/tender-pages/PersonalPage"
                component={PersonalPage}
            />


            <Route
                path="/tender/tender-pages/MyAccountPage"
                component={MyAccountPage}
            />


            <Route
                path="/tender/tender-pages/ChangePasswordPage"
                component={ChangePasswordPage}
            />
        </Switch>
    );
}
