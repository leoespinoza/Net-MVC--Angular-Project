using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Dashboard
{
    public class RouteConfig
    {

        public static void RegisterRoutes(RouteCollection routes)
        {
            //routes.IgnoreRoute(""); 

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapPageRoute("HtmlRoute", "MyCustomUrl", "Path/To/Your/mypage.html");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Dashboard", action = "Index", id = UrlParameter.Optional }
            );
        }

    }
}