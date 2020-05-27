import React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Registration from "./Registration";
import NewPassword from "./NewPassword";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import { Helmet } from "react-helmet";
import { toAbsoluteUrl } from "../../../_metronic";
import "../../../_metronic/_assets/sass/pages/login/login-1.scss";

export default function AuthPage() {

  return (
    <>
      {/* https://github.com/nfl/react-helmet */}
      <Helmet>
        {/* <link
            type="text/css"
            rel="stylesheet"
            href={toAbsoluteUrl(
                "/assets/css/demo1/style.bundle.css"
            )}
        />
        <link
          type="text/css"
          rel="stylesheet"
          href={toAbsoluteUrl(
            "/assets/css/demo1/pages/login/login-1.css"
          )}
        /> */}
      </Helmet>

      <div className="kt-grid kt-grid--ver kt-grid--root">
        <div
          id="kt_login"
          className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1"
        >
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div
              className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
              style={{
                background: 'purple'
              }}
            >
              <div className="kt-grid__item">
                <Link to="/" className="kt-login__logo">
                  <img
                    alt="Logo"
                    src={toAbsoluteUrl("/media/logos/tender_logo.png")}
                  />
                </Link>
              </div>
              <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                <div id="expert_type" className="kt-grid__item kt-grid__item--middle" style={{display: 'none'}}>
                    <a onClick={() => {document.getElementById('normal_logo').style.display = ''}}>
                        <h1 className="kt-login__title">Are you an Expert ? </h1>
                    </a>
                </div>
                <div id="normal_logo" className="kt-grid__item kt-grid__item--middle">
                  <h3 className="kt-login__title">Welcome to tEnDeR!</h3>
                  <h4 className="kt-login__subtitle">
                    The ultimate SEAP extension.
                  </h4>
                </div>
              </div>
              <div className="kt-grid__item">
                <div className="kt-login__info">
                  <div className="kt-login__copyright">
                    &copy; 2019 Tender
                  </div>
                </div>
              </div>
            </div>

            <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
              <Switch>
                <Redirect from="/auth" exact={true} to="/auth/login" />

                <Route path="/auth/login" component={Login} />
                <Route path="/auth/registration" component={Registration} />
                <Route path="/auth/new-password" component={NewPassword} />
                <Route
                  path="/auth/forgot-password"
                  component={ForgotPassword}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
