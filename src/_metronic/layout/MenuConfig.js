export default {
  header: {
    self: {},
    items: [

    ]
  },
  aside: {
    self: {},
    items: [
      { section: "Tender",  role: "ROLE_TENDER" },
      {
        title: "Search",
        root: true,
        bullet: "dot",
        role: "ROLE_TENDER",
        translate: "MENU.DASHBOARD",
        icon: "flaticon2-expand",
        page: "tender/tender-pages/TenderDashboardPage"
      },
      {
        title: "Search",
        root: true,
        bullet: "dot",
        role: "ROLE_TENDER",
        translate: "MENU.SEARCH",
        icon: "flaticon2-expand",
        page: "tender/tender-pages/NoticeSearchPage"
      },
      /*{
        title: "Search",
        root: true,
        bullet: "dot",
        role: "ROLE_TENDER",
        translate: "MENU.SEARCH",
        icon: "fa fa-search",
        submenu: [
          {
            title: "Search",
            root: true,
            bullet: "dot",
            role: "ROLE_TENDER",
            translate: "MENU.SEARCH",
            icon: "fa fa-search",
            page: "tender/tender-pages/NoticeSearchPage"
          },
          {
            title: "Contract Notice History",
            icon: "fa fa-search",
            role: "ROLE_TENDER",
            translate: "MENU.HISTORY",
            page: "tender/tender-pages/HistoryDashboardPage"
          },
          {
            title: "Contract Notice Analysis",
            icon: "fa fa-search",
            role: "ROLE_TENDER",
            translate: "MENU.NOTICE_ANALYSIS",
            page: "tender/tender-pages/ComparisonDashboardPage"
          }
        ]
      },*/
      {
        title: "Alerts",
        root: true,
        alignment: "left",
        icon: "flaticon2-expand",
        role: "ROLE_TENDER",
        toggle: "click",
        translate: "MENU.ALERTS",
        submenu: [

          {
            title: "My Alerts",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_ALERTS",
            page: "tender/tender-pages/AlertsPage"
          },
          {
            title: "Configuration",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.ALERTS_CONFIGURATION",
            page: "tender/tender-pages/AlertsConfigurationPage"
          }/*,
          {
            title: "My Notifications",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_NOTIFICATIONS",
            page: "tender/tender-pages/NoticesPage"
          }*/
        ]
      },
       {
              title: "Experts Management",
              root: true,
              bullet: "dot",
              role: "ROLE_TENDER",
              translate: "MENU.EXPERTS_MANAGEMENT",
              icon: "flaticon2-architecture-and-city",
              submenu: [
              {
                    title: "Internal Experts",
                    icon: "flaticon2-expand",
                    translate: "MENU.INTERNAL_EXPERTS",
                    role: "ROLE_TENDER",
                    page: "builder",
                    page: "tender/tender-pages/InternalExperts",
                  },
                  {
                    title: "External Experts",
                    icon: "flaticon2-expand",
                    page: "builder",
                    role: "ROLE_TENDER",
                    translate: "MENU.EXTERNAL_EXPERTS",
                    page: "tender/tender-pages/ExternalExperts",
                  },
              ]
      },

      {
        title: "Account Settings",
        root: true,
        bullet: "dot",
        role: "ROLE_TENDER",
        translate: "MENU.PROFILE",
        icon: "flaticon2-architecture-and-city",
        submenu: [
          {
            title: "My Account",
            bullet: "dot",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_ACCOUNT",
            submenu: [
              {
                title: "Personal Info",
                icon: "flaticon2-expand",
                page: "builder",
                translate: "MENU.MY_PAGE",
                page: "tender/tender-pages/MyAccountPage"
              },
              {
                title: "My Account",
                icon: "flaticon2-expand",
                page: "builder",
                translate: "MENU.INVOICE",
                page: "tender/tender-pages/MyInvoicePage"
              },
              {
                title: "Change Password",
                icon: "flaticon2-expand",
                page: "builder",
                translate: "MENU.MAIL",
                page: "tender/tender-pages/MyMailPage"
              }
            ]
         },
          {
            title: "Change Password",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.CHANGE_PASSWORD",
            page: "tender/tender-pages/ChangePasswordPage"
          },



        /*  {
            title: "Change Password",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.SERVICES",
            page: "tender/tender-pages/ChangePasswordPage"
          },
          {
            title: "Change Password",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.NOTIFICATIONS",
            page: "tender/tender-pages/ChangePasswordPage"
          }*/
        ]
      },

      {
        title: "Notifications",
        root: true,
        bullet: "dot",
        role: "ROLE_TENDER",
        translate: "MENU.NOTIFICATIONS",
        icon: "flaticon2-expand",
        page: "tender/tender-pages/NotificationsPage"
      },
      /*{
        title: "Procedures",
        root: true,
        alignment: "left",
        toggle: "click",
        role: "ROLE_TENDER",
        translate: "MENU.PROCEDURES",
        submenu: [
          {
            title: "My Procedures",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_OPEN_PROCEDURES",
            page: "tender/tender-pages/MyOpenOffersPage"
          },
          {
            title: "My Completed Procedures",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_COMPLETED_PROCEDURES",
            page: "tender/tender-pages/MyCompletedOffersPage"
          },
          {
            title: "My Declined Procedures",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_DECLINED_PROCEDURES",
            page: "tender/tender-pages/MyDeclinedOffersPage"
          }
        ]
      },*/
      { section: "Supervisor",
        role: "ROLE_SUPERVISOR"
      },
      {
        title: "Dashboard",
        root: true,
        role: "ROLE_SUPERVISOR",
        bullet: "dot",
        translate: "MENU.DASHBOARD",
        icon: "flaticon2-architecture-and-city",
        page: "tender/tender-pages/SupervisorDashboardPage",
      },
    {
        title: "Experts Management",
        root: true,
        role: "ROLE_SUPERVISOR",
        bullet: "dot",
       icon: "flaticon2-architecture-and-city",
        page: "tender/tender-pages/SupervisorAdminPage",
      },

      {
              title: "Account Settings",
              root: true,
              bullet: "dot",
              role: "ROLE_SUPERVISOR",
              translate: "MENU.PROFILE",
              icon: "flaticon2-architecture-and-city",
              submenu: [
                {
                  title: "My Account",
                  bullet: "dot",
                  icon: "flaticon2-expand",
                  page: "builder",
                  translate: "MENU.MY_ACCOUNT",
                  submenu: [
                    {
                      title: "Personal Info",
                      icon: "flaticon2-expand",
                      page: "builder",
                      translate: "MENU.MY_PAGE",
                      page: "tender/tender-pages/MyAccountPage"
                    },
                    {
                      title: "My Account",
                      icon: "flaticon2-expand",
                      page: "builder",
                      translate: "MENU.INVOICE",
                      page: "tender/tender-pages/MyInvoicePage"
                    },
                    {
                      title: "Change Password",
                      icon: "flaticon2-expand",
                      page: "builder",
                      translate: "MENU.MAIL",
                      page: "tender/tender-pages/MyMailPage"
                    }
                  ]
                },
            ]},
         {
            title: "Notifications",
            root: true,
            bullet: "dot",
            role: "ROLE_SUPERVISOR",
            translate: "MENU.NOTIFICATIONS",
            icon: "flaticon2-expand",
            page: "tender/tender-pages/NotificationsPage"
         },

       {section: "Expert",
              role: "ROLE_EXPERT"
        },
        {
          title: "Dashboard",
          root: true,
          role: "ROLE_EXPERT",
          bullet: "dot",
          translate: "MENU.DASHBOARD",
          icon: "flaticon2-architecture-and-city",
          page: "tender/tender-pages/ExpertDashboardPage",
        },
      {
        title: "Account Settings",
        root: true,
        bullet: "dot",
        role: "ROLE_EXPERT",
        translate: "MENU.PROFILE",
        icon: "flaticon2-architecture-and-city",
        submenu: [
          {
            title: "My Account",
            bullet: "dot",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_ACCOUNT",
            submenu: [
              {
                title: "Personal Info",
                icon: "flaticon2-expand",
                page: "builder",
                translate: "MENU.MY_PAGE",
                page: "tender/tender-pages/MyAccountPage"
              },
              {
                title: "My Account",
                icon: "flaticon2-expand",
                page: "builder",
                translate: "MENU.INVOICE",
                page: "tender/tender-pages/MyInvoicePage"
              },
              {
                title: "Change Password",
                icon: "flaticon2-expand",
                page: "builder",
                translate: "MENU.MAIL",
                page: "tender/tender-pages/MyMailPage"
              }
            ]
          },
      ]},
       {
          title: "Notifications",
          root: true,
          bullet: "dot",
          role: "ROLE_EXPERT",
          translate: "MENU.NOTIFICATIONS",
          icon: "flaticon2-expand",
          page: "tender/tender-pages/NotificationsPage"
        },

      { section: "Admin",
        role: "ROLE_ADMIN"
      },
      {
        title: "Dashboard",
        root: true,
        role: "ROLE_ADMIN",
        bullet: "dot",
        translate: "MENU.USERS",
        icon: "flaticon2-architecture-and-city",
        page: "tender/admin-pages/UsersPage",
      },
    ]
  }
};
