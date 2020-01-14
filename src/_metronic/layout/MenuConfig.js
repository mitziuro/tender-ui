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
        title: "Profile",
        root: true,
        bullet: "dot",
        role: "ROLE_TENDER",
        translate: "MENU.PROFILE",
        icon: "flaticon2-architecture-and-city",
        submenu: [
          {
            title: "Personal Info",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_PAGE",
            page: "tender/tender-pages/PersonalPage"
          },
          {
            title: "My Account",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_ACCOUNT",
            page: "tender/tender-pages/MyAccountPage"
          },
          {
            title: "Change Password",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.CHANGE_PASSWORD",
            page: "tender/tender-pages/ChangePasswordPage"
          }
        ]
      },
      {
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
      },
      {
        title: "Alerts",
        root: true,
        alignment: "left",
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
            title: "My Notifications",
            icon: "flaticon2-expand",
            page: "builder",
            translate: "MENU.MY_NOTIFICATIONS",
            page: "tender/tender-pages/NoticesPage"
          }
        ]
      },
      {
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
      },
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
