import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import * as auth from "../../store/ducks/auth.duck";
import { finishPassword } from "../../crud/auth.crud";
import addNotification from "../../widgets/NotificationWidget";

function NewPassword(props) {
    const { intl } = props;


    let keyParam = props.location.search.split('key=');
    if (!window.tooltip && keyParam.length <= 1) {
        addNotification("Error", "The key could not be found", 'danger');
        window.tooltip = true;
    }

    return (
        <div className="kt-login__body">
            <div className="kt-login__form">
                <div className="kt-login__title">
                    <h3>
                        <FormattedMessage id="AUTH.NEW.PASSWORD.TITLE"/>
                    </h3>
                </div>

                <Formik
                    initialValues={{
            password: "",
            confirmPassword: ""
          }}
                    validate={values => {
            const errors = {};

            if (!values.password) {
              errors.password = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (values.password.length < 4) {
              errors.password = "Passowrd must be grater that 4 characters";
            }

            if (!values.confirmPassword) {
              errors.confirmPassword = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            } else if (values.password !== values.confirmPassword) {
              errors.confirmPassword =
                "Password and Confirm Password didn't match.";
            }

            return errors;
          }}
                    onSubmit={(values, { setStatus, setSubmitting }) => {
            finishPassword(
              keyParam[1],
              values.password
            ).then(({ data: { accessToken } }) => {
                window.location = '/auth/login?password=reset';
              })
              .catch(() => {
                setSubmitting(false);
                addNotification("Error", "The key could not be found on the server", 'danger');
              });
          }}
                >
                    {({
                        values,
                        status,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                        }) => (
                        <form onSubmit={handleSubmit} noValidate autoComplete="off">
                            {status && (
                                <div role="alert" className="alert alert-danger">
                                    <div className="alert-text">{status}</div>
                                </div>
                            )}


                            <div className="form-group mb-0">
                                <TextField
                                    type="password"
                                    margin="normal"
                                    label="Password"
                                    className="kt-width-full"
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    helperText={touched.password && errors.password}
                                    error={Boolean(touched.password && errors.password)}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    type="password"
                                    margin="normal"
                                    label="Confirm Password"
                                    className="kt-width-full"
                                    name="confirmPassword"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                    error={Boolean(
                    touched.confirmPassword && errors.confirmPassword
                  )}
                                />
                            </div>

                            <div className="kt-login__actions">
                                <Link
                                    to="/auth/forgot-password"
                                    className="kt-link kt-login__link-forgot"
                                >
                                    <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON"/>
                                </Link>

                                <Link to="/auth">
                                    <button type="button"
                                            className="btn btn-secondary btn-elevate kt-login__btn-secondary">
                                        Back
                                    </button>
                                </Link>

                                <button
                                    disabled={isSubmitting}
                                    className="btn btn-primary btn-elevate kt-login__btn-primary"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default injectIntl(
    connect(
        null,
        auth.actions
    )(NewPassword)
);
