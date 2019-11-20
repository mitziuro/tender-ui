import React from "react";
import { useSelector } from "react-redux";
import { addLocaleData, IntlProvider } from "react-intl";

import * as en from "react-intl/locale-data/en";
import * as ro from "react-intl/locale-data/ro";

import enMessages from "./messages/en";
import roMessages from "./messages/ro";

const allMessages = {
  en: enMessages,
  ro: roMessages
};

addLocaleData([...en, ...ro]);

export default function I18nProvider({ children }) {
  const locale = useSelector(({ i18n }) => i18n.lang);
  const messages = allMessages[locale];

  return (
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
  );
}
