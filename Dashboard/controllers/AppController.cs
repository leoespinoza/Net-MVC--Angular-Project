using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dashboard.controllers
{
    public class AppController : Controller
    {
        // /App/Customers, /App/Orders .... return mock application pages foor dashboard project

        public ActionResult Customers()
        {
            return View();
        }


        public ActionResult Orders()
        {
            return View();
        }

        public ActionResult Stores()
        {
            return View();
        }

        public ActionResult Employees()
        {
            return View();
        }
    }
}
