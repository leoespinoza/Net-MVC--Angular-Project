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
    public class DashboardController : Controller
    {
        #region Authentication and Authorization

        // Use these methods to simulate different users, by changing the username or admin privilege. In a real app, your authN/authZ system handles this.

        // Return current username. Since this is just a demo project that lacks authentication, a hard-coded username is returned.

        private String CurrentUsername(HttpRequestBase request)
        {
            String username = "john.smith";
            if (request != null && this.ControllerContext.HttpContext.Request.Cookies.AllKeys.Contains("dashboard-username"))
            {
                username = this.ControllerContext.HttpContext.Request.Cookies["dashboard-username"].Value;
            }
            return username;
        }

        // Return true if current user is an administrator. Since this is just a demo project that lacks authentication, a hard-coded role assignment is made.

        private bool CurrentUserIsAdmin(HttpRequestBase request)
        {
            switch (this.CurrentUsername(request))
            {
                case "john.smith":
                    return true;
                default:
                    return false;
            }
        }

        // Return array of roles for current user.

        private String[] CurrentUserRoles(HttpRequestBase request)
        {
            switch (this.CurrentUsername(request))
            {
                case "john.smith":
                    return new String[] { "Admin", "Manager", "Employee" };
                case "marcia.brady":
                    return new String[] { "Manager", "Employee" };
                case "stuart.downey":
                    return new String[] { "Sales", "Manager", "Employee" };
                default:
                    return new String[] { "Employee" };
            }
        }

        #endregion

        // /Dashboard .... return dashboard layout as JSON

        [HttpGet]
        public ActionResult Index()
        {
            return Redirect("/index.html");
        }

        // /Dashboard/GetUser .... returns username and admin privilege of cucrrent user.

        [HttpGet]
        public JsonResult GetUser()
        {
            // If ?user=<username> specified, set username and create cookie
            String username = null; // = Request.QueryString["user"];
            if (String.IsNullOrEmpty(username)) // if nothing specified in URL, ...
            {
                // ...Check for existing username cookie
                if (Request != null && Request.Cookies.AllKeys.Contains("dashboard-username"))
                {
                    username = Request.Cookies["dashboard-username"].Value;
                }
                else
                {
                    username = "john.smith";    // else default john.smith
                    HttpCookie cookie = new HttpCookie("dashboard-username");   // Set cookie
                    cookie.Value = username;
                    Response.Cookies.Add(cookie);
                }
            }
            else
            {
                HttpCookie cookie = new HttpCookie("dashboard-username");   // Set cookie
                cookie.Value = username;
                Response.Cookies.Add(cookie);
            }

            User user = new User()
            {
                Username = CurrentUsername(Request),
                Roles = CurrentUserRoles(Request),
                IsAdmin = CurrentUserIsAdmin(Request)
            };
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        // /Sigin/id : Sign in as a user

        [HttpGet]
        public ActionResult Signin()
        {
            //String username = id;

            // If ?user=<username> specified, set username and create cookie
            String username = Request.QueryString["user"];

            if (!String.IsNullOrEmpty(username)) // if username specified in URL, ...
            {
                HttpCookie cookie = new HttpCookie("dashboard-username");   // Set cookie
                cookie.Value = username;
                Response.Cookies.Add(cookie);
            }
            else
            {
                // ...Check for existing username cookie
                if (Request != null && this.ControllerContext.HttpContext.Request.Cookies.AllKeys.Contains("dashboard-username"))
                {
                    username = this.ControllerContext.HttpContext.Request.Cookies["dashboard-username"].Value;
                }
                else
                {
                    username = "john.smith";    // else default john.smith
                    HttpCookie cookie = new HttpCookie("dashboard-username");   // Set cookie
                    cookie.Value = username;
                }
            }
            return Redirect("/index.html?user=" + username);
        }

        
        // /Dashboard/GetDashboard .... return dashboard layout as JSON

        [HttpGet]
        public JsonResult GetDashboard()
        {
            return Json(LoadDashboard(), JsonRequestBehavior.AllowGet);
        }

        // LoadDashboard(tileIndex) .... loads entire dashboard (no tileIndex param) or one dashboard tile (tileIndex set to 1..n)

        [HttpGet]
        public Dashboard LoadDashboard(int tileIndex = -1)
        {
            int dashboardId = -1;

            String username = CurrentUsername(Request);

            Dashboard dashboard = new Dashboard()
            {
                DashboardName = "Home",
                Username = username,
                IsAdmin = CurrentUserIsAdmin(Request),
                Tiles = new List<Tile>(),
                Queries = new List<DashboardQuery>(),
                Roles = new List<String>(),
                IsDefault = false
            };

            dashboard.Roles.Add("Accounting");
            dashboard.Roles.Add("Admin");
            dashboard.Roles.Add("Employee");
            dashboard.Roles.Add("Executive");
            dashboard.Roles.Add("Manager");
            dashboard.Roles.Add("Marketing");
            dashboard.Roles.Add("Manufacturing");
            dashboard.Roles.Add("Sales");

            String roleList = "'" + String.Join(",", CurrentUserRoles(Request)).Replace(",", "','") + "'";

            try
            {
                using (SqlConnection conn = new SqlConnection(System.Configuration.ConfigurationManager.AppSettings["Database"]))
                {
                    conn.Open();

                    // Load queries.

                    DashboardQuery dashboardQuery = null;

                    String query = "SELECT * FROM DashboardQuery ORDER BY Name";

                    dashboard.Queries.Add(new DashboardQuery()
                        {
                            QueryName = "inline",
                            ValueType = "number",
                            Role = ""
                        });

                    bool addQuery = false;
                    String[] roles = CurrentUserRoles(Request);

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        using(SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while(reader.Read())
                            {
                                dashboardQuery = new DashboardQuery()
                                {
                                     QueryName = Convert.ToString(reader["Name"]),
                                     ValueType = Convert.ToString(reader["ValueType"]),
                                     Role = Convert.ToString(reader["Role"])
                                };

                                addQuery = true;
                                if (!String.IsNullOrEmpty(dashboardQuery.Role)) // don't add query if it requires a role the user doesn't have
                                {
                                    if (roles != null)
                                    {
                                        addQuery = false;
                                        foreach(String role in roles)
                                        {
                                            if (role==dashboardQuery.Role)
                                            {
                                                addQuery = true;
                                                break;
                                            }
                                        }
                                    }
                                }

                                if (addQuery)
                                {
                                    dashboard.Queries.Add(dashboardQuery);
                                }
                            }
                        }
                    }


                    // Load the dashboard.
                    // If the user has a saved dashboard, load that. Otherwise laod the default dashboard.

                    query = @"SELECT TOP 1 DashboardId FROM DashboardLayout 
                              WHERE DashboardName='Home' AND 
                            (Username=@Username OR Username IN (" + roleList + @") OR Username='default') 
                            ORDER BY [Priority] DESC";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.Parameters.AddWithValue("@Username", CurrentUsername(Request));
                        //cmd.Parameters.AddWithValue("@Roles", roleList);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                dashboardId = Convert.ToInt32(reader["DashboardId"]);
                            }
                        }
                    }

                    if (dashboardId != -1) // If found a dashboard...
                    {
                        // Load dashboard layout

                        query = @"SELECT prop.* FROM DashboardLayoutTile tile
                                  INNER JOIN DashboardLayoutTileProperty prop  
                                  ON tile.DashboardId=prop.DashboardId AND prop.Sequence=tile.Sequence
                                  WHERE tile.DashboardId=@DashboardId
                                  ORDER BY prop.Sequence,prop.PropertyName";

                        Tile tile = null;
                        int lastSeq = 0;
                        int seq = 0;
                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.CommandType = System.Data.CommandType.Text;
                            cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    seq = Convert.ToInt32(reader["Sequence"]);
                                    if (seq != lastSeq) // starting a new sequence (tile)
                                    {
                                        lastSeq = seq;
                                        if (tile != null)
                                        {
                                            dashboard.Tiles.Add(tile);
                                        }
                                        tile = new Tile()
                                        {
                                            Sequence = seq,
                                            Properties = new List<TileProperty>()
                                        };
                                    }

                                    tile.Properties.Add(new TileProperty(Convert.ToString(reader["PropertyName"]), Convert.ToString(reader["PropertyValue"])));
                                } // end while have tile property
                                dashboard.Tiles.Add(tile); // add final tile to tiles collection
                            }
                        }
                    }

                    // Get the data for each tile. If dataQuery is 'inline', tile already has data.

                    if (dashboard != null && dashboard.Tiles != null)
                    {
                        int index = 0;
                        foreach (Tile tile in dashboard.Tiles)
                        {
                            index++;
                            if (tile.Properties != null)
                            {
                                if (tileIndex == -1 || tileIndex == index)
                                {
                                    if (tile["dataSource"] != "inline")
                                    {
                                        LoadTileData(conn, tile, tile["dataSource"], username);
                                    }
                                }
                            }
                        }
                    }

                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("EXCEPTION: " + ex.Message);
            }

            return dashboard;
        }

        // /Dashboard/UpdateTileData/queryname .... run data source and return tile data.

        [HttpGet]
        public JsonResult UpdateTileData(String id)
        {
            Tile tile = new Tile();

            try
            {
                String username = CurrentUsername(Request);

                String queryName = id;
                using (SqlConnection conn = new SqlConnection(System.Configuration.ConfigurationManager.AppSettings["Database"]))
                {
                    conn.Open();
                    LoadTileData(conn, tile, queryName, username);
                    conn.Close();
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine("EXCEPTION: " + ex.Message);
            }
            return Json(tile, JsonRequestBehavior.AllowGet);
        }

        // /Dashboard/SaveDashboard (POST) tiles .... save updated dashboard for user. If dashboard.isDefault is true, saved the new default dashboard layout.

        [HttpPost]
        public void SaveDashboard(Dashboard dashboard)
        {
            try
            {
                int priority = dashboard.IsDefault ? 1 : 10;
                String username = dashboard.IsDefault ? "default" : CurrentUsername(Request);

                DeleteDashboard(dashboard.IsDefault);  // Delete prior saved dashboard (if any) for user.

                // Check whether an existing dashboard is saved for this user. If so, delete it.

                int dashboardId = -1;

                using (SqlConnection conn = new SqlConnection(System.Configuration.ConfigurationManager.AppSettings["Database"]))
                {
                    conn.Open();

                    // Add dashboard layout root record

                    String query = "INSERT INTO DashboardLayout (DashboardName, Username, Priority) VALUES (@DashboardName, @Username, @priority); SELECT SCOPE_IDENTITY();";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@DashboardName", "Home");
                        cmd.Parameters.AddWithValue("@Username", username);
                        cmd.Parameters.AddWithValue("@Priority", priority);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                dashboardId = Convert.ToInt32(reader[0]);
                            }
                        }
                    }

                    if (dashboardId!=-1) // If root record added and we have an id, proceed to add child records
                    {
                        // Add DashboardLayoutTile records.

                        int sequence = 1;
                        foreach (Tile tile in dashboard.Tiles)
                        {
                            query = "INSERT INTO DashboardLayoutTile (DashboardId, Sequence) VALUES (@DashboardId, @Sequence)";

                            using (SqlCommand cmd = new SqlCommand(query, conn))
                            {
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.ExecuteNonQuery();
                            }
                            sequence++;
                        } // next tile

                        // Add DashboardLayoutTileProperty records.

                        sequence = 1;
                        foreach (Tile tile in dashboard.Tiles)
                        {
                            query = "INSERT INTO DashboardLayoutTileProperty (DashboardId, Sequence, PropertyName, PropertyValue) VALUES (@DashboardId, @Sequence, @Name, @Value)";

                            using (SqlCommand cmd = new SqlCommand(query, conn))
                            {
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "color");
                                if (tile["color"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["color"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "height");
                                if (tile["height"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["height"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "width");
                                if (tile["width"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["width"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "type");
                                if (tile["type"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["type"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "title");
                                if (tile["title"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["title"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "dataSource");
                                if (tile["dataSource"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["dataSource"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "label");
                                if (tile["label"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["label"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "columns");
                                if (tile["columns"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["columns"]);
                                }
                                cmd.ExecuteNonQuery();

                                //cmd.Parameters.Clear();       // Don't store value - we compute it dynamically, and in some cases may be large in size.
                                //cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                //cmd.Parameters.AddWithValue("@Sequence", sequence);
                                //cmd.Parameters.AddWithValue("@Name", "value");
                                //if (tile["value"] == null)
                                //{
                                //    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                //}
                                //else
                                //{
                                //    cmd.Parameters.AddWithValue("@Value", tile["value"]);
                                //}
                                //cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "link");
                                if (tile["link"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["link"]);
                                }
                                cmd.ExecuteNonQuery();

                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                                cmd.Parameters.AddWithValue("@Sequence", sequence);
                                cmd.Parameters.AddWithValue("@Name", "role");
                                if (tile["role"] == null)
                                {
                                    cmd.Parameters.AddWithValue("@Value", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Value", tile["role"]);
                                }
                                cmd.ExecuteNonQuery();
                            }
                            sequence++;
                        } // next tile
                    }

                    conn.Close();
                } // end SqlConnection
            }
            catch(Exception ex)
            {
                Console.WriteLine("EXCEPTION: " + ex.Message);
            }
        }

        // DeleteDashboard : Delete user's saved custom dashboard. If isDefault is true, deletes the default dashboard.

        private void DeleteDashboard(bool isDefault)
        {
            try
            {
                String username = isDefault ? "default" : CurrentUsername(Request);

                // Check whether an existing dashboard is saved for this user. If so, delete it.

                int dashboardId = -1;

                using (SqlConnection conn = new SqlConnection(System.Configuration.ConfigurationManager.AppSettings["Database"]))
                {
                    conn.Open();

                    // Load the dashboard.
                    // If the user has a saved dashboard, load that. Otherwise laod the default dashboard.

                    String query = "SELECT TOP 1 DashboardId FROM DashboardLayout WHERE DashboardName='Home' AND Username=@Username";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.Parameters.AddWithValue("@Username", username);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                dashboardId = Convert.ToInt32(reader["DashboardId"]);
                            }
                        }
                    }

                    if (dashboardId != -1) // If found a dashboard...
                    {
                        // Delete dashboard layout tile property records

                        query = "DELETE DashboardLayoutTileProperty WHERE DashboardId=@DashboardId";

                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.CommandType = System.Data.CommandType.Text;
                            cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                            cmd.ExecuteNonQuery();
                        }

                        // Delete dashboard layout tile records

                        query = "DELETE DashboardLayoutTile WHERE DashboardId=@DashboardId";

                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.CommandType = System.Data.CommandType.Text;
                            cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                            cmd.ExecuteNonQuery();
                        }

                        // Delete dashboard layout record

                        query = "DELETE DashboardLayout WHERE DashboardId=@DashboardId";

                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.CommandType = System.Data.CommandType.Text;
                            cmd.Parameters.AddWithValue("@DashboardId", dashboardId);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    conn.Close();
                } // end SqlConnection
            }
            catch (Exception ex)
            {
                Console.WriteLine("EXCEPTION: " + ex.Message);
            }
        }

        // DashboardReset ... reset user to default dashboard (by deleting their saved custom dashboard).

        [HttpGet]
        public JsonResult DashboardReset()
        {
            try
            {
                DeleteDashboard(false);
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Console.WriteLine("EXCEPTION: " + ex.Message);
                return Json(false, JsonRequestBehavior.AllowGet);
            }
        }

        // Lookup and execute the query for a tile, and set its value.

        private void LoadTileData(SqlConnection conn, Tile tile, String queryName, String username)
        {
            String dataQuery = null;
            String valueType = null;
            String query = "SELECT Query,ValueType FROM DashboardQuery WHERE Name=@Name";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@Name", queryName);
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        dataQuery = Convert.ToString(reader["Query"]);
                        valueType = Convert.ToString(reader["ValueType"]);
                        //role = Convert.ToString(reader["Role"]);
                    }
                }
            }

            // If a data query was found, execute it.

            if (dataQuery != null)
            {
                try
                {
                    using (SqlCommand cmd = new SqlCommand(dataQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@username", username);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            switch(valueType)
                            {
                                // number: expect query to return just one numeric value, set into tile.value.
                                case "number":
                                    if (reader.Read())
                                    {
                                        tile["value"] = Convert.ToString(reader[0]);
                                    }
                                    break;
                                // number-array: expect query to return one bar name and one bar value per row.
                                //               sets tile.value to [ value-1, ... valueN ] array of numbers. sets tile.column to array of column names.
                                case "number-array":
                                    {
                                        String columnValue = "[";
                                        String value = "["; // [ (open outer array)
                                        int rows = 0;
                                        List<String> columns = new List<String>();
                                        List<String> types = new List<String>();
                                        // Read through the query results, and build up columns property and value proprty for bar/column tile.
                                        // Expected: two columns per row: <column-name> <value>
                                        while (reader.Read())
                                        {
                                            if (rows>0)
                                            {
                                                value = value + ",";
                                                columnValue = columnValue + ",";
                                            }
                                            columnValue = columnValue + "'" + Convert.ToString(reader[0]) + "'";    // Get the bar column
                                            value = value + Convert.ToString(reader[1]);                            // Get the bar value
                                            rows++;
                                        } // end while reader.Read()
                                        value = value + "]";
                                        columnValue = columnValue + "]";
                                        tile["columns"] = columnValue;
                                        tile["value"] = value;
                                    }
                                    break;
                                // kpi-set: query should return <numeric-value>, <label>, <low-label>, <1/3-label>, <2/3-label>, <high-label>
                                //          tile properties set: value, label, columns (4 values).
                                case "kpi-set":
                                    {
                                        String value = "";
                                        String labelValue = "";
                                        String columnValue = "[";
                                        if (reader.Read())
                                        {
                                            value = Convert.ToString(reader[0]);
                                            labelValue = Convert.ToString(reader[1]);
                                            columnValue = "[" + "'" + Convert.ToString(reader[2]) + "',";
                                            columnValue = columnValue + "'" + Convert.ToString(reader[3]) + "',";
                                            columnValue = columnValue + "'" + Convert.ToString(reader[4]) + "',";
                                            columnValue = columnValue + "'" + Convert.ToString(reader[5]) + "']";
                                            tile["value"] = value;
                                            tile["label"] = labelValue;
                                            tile["columns"] = columnValue;
                                        } // end while reader.Read()
                                    }
                                    break;
                                // table: query should returns rows of column values, which will coped into tile.value as [ [row-1-array], ... [row-N-array] ]
                                //        column names and types will be detected from the query results and set into tile.columns as [ [ col-1-name, col-1-type ], ... [col-N-name, col-N-type] ]
                                case "table":
                                    {
                                        String value = "["; // [ (open outer array)
                                        int rows = 0;
                                        List<String> columns = new List<String>();
                                        List<String> types = new List<String>();
                                        while (reader.Read())
                                        {
                                            if (rows==0)
                                            {
                                                // Load columns
                                                String columnValue = "[";
                                                for (int c = 0; c < reader.FieldCount; c++)
                                                {
                                                    columns.Add(reader.GetName(c));
                                                    types.Add(reader.GetDataTypeName(c));
                                                    if (c>0)
                                                    {
                                                        columnValue = columnValue + ",";
                                                    }
                                                    String type = "string";
                                                    switch(reader.GetDataTypeName(c))
                                                    {
                                                        case "int":
                                                        case "decimal":
                                                        case "float":
                                                            type = "number";
                                                            break;
                                                        case "bit":
                                                        case "boolean":
                                                            type = "boolean";
                                                            break;
                                                        case "date":
                                                        case "datetime":
                                                            type = "string";
                                                            break;
                                                        default:
                                                            type = "string";
                                                            break;
                                                    }
                                                    columnValue = columnValue + "['" + reader.GetName(c) + "','" + type + "']";
                                                }
                                                columnValue = columnValue + "]";
                                                tile["columns"] = columnValue;
                                            }
                                            else
                                            {
                                                value = value + ",";
                                            }
                                            value = value + "[";    // start inner array
                                            int colindex = 0;
                                            foreach (String column in columns)
                                            {
                                                if (colindex!=0)
                                                {
                                                    value = value + ",";
                                                }
                                                if (reader[column] == DBNull.Value)
                                                {
                                                    value = value + "null";
                                                }
                                                else
                                                {
                                                    switch (types[colindex])
                                                    {
                                                        case "date":
                                                            value = value + "'" + Convert.ToDateTime(reader[column]).ToString("MM-dd-yyyy") + "'";
                                                            break;
                                                        default:
                                                            value = value + "'" + Convert.ToString(reader[column]) + "'";
                                                            break;
                                                    }
                                                }
                                                colindex++;
                                            }
                                            value = value + "]";    // end inner array
                                            rows++;
                                        } // end while reader.Read()
                                        value = value + "]";    // end outer array
                                        tile["value"] = value;
                                    }
                                    break;
                                default:
                                    // set tile to have no data
                                    break;
                            }
                        }
                    }
                }
                catch (SqlException ex)
                {
                    String msg = ex.Message;
                    Console.WriteLine(msg);
                }
            }

        }

        // Return a property of a tile, such as color or dataSource.

        private String TileProperty(Tile tile, String propName)
        {
            String value = null;
            if (tile != null && tile.Properties != null)
            {
                foreach (TileProperty prop in tile.Properties)
                {
                    if (prop.PropertyName == propName)
                    {
                        value = prop.PropertyValue;
                        break;
                    }
                }
            }
            return value;
        }
    }

    #region Dashboard Layout Objects

    [Serializable]
    public class DashboardQuery
    {
        public String QueryName { get; set; }
        public String ValueType { get; set; }
        public String Role { get; set; }
    }

    [Serializable]
    public class Dashboard
    {
        public String DashboardName { get; set; }
        public String Username { get; set; }    // Current username
        public bool IsAdmin { get; set; }       // True if current user is an administrator
        public List<Tile> Tiles { get; set; }
        public List<String> Roles { get; set; }
        public List<DashboardQuery> Queries { get; set; }
        public bool IsDefault { get; set; }    // If true, on a save becomes the new default layout for all users.

        public Dashboard()
        {
            DashboardName = "Home";
            Tiles = new List<Tile>();
        }

        public Dashboard(String name)
        {
            DashboardName = name;
            Tiles = new List<Tile>();
        }
    }

    [Serializable]
    public class Tile
    {
        public int Sequence { get; set; }
        //public String Username { get; set; }
        public List<TileProperty> Properties { get; set; }

        public String this[String index]
        {
            get
            {
                if (this.Properties != null)
                {
                    foreach(TileProperty prop in this.Properties)
                    {
                        if (prop.PropertyName == index)
                        {
                            return prop.PropertyValue;
                        }
                    }
                }
                return null;
            }
            set
            {
                if (this.Properties== null)
                {
                    this.Properties = new List<TileProperty>();
                }
                foreach (TileProperty prop in this.Properties)
                {
                    if (prop.PropertyName == index)
                    {
                        prop.PropertyValue = value;
                        return;
                    }
                }
                this.Properties.Add(new TileProperty(index, value));
            }
        }

        public Tile() { }
    }

    [Serializable]
    public class TileProperty
    {
        public String PropertyName { get; set; }
        public String PropertyValue { get; set; }

        public TileProperty() { }

        public TileProperty(String name, String value = null) 
        {
            PropertyName = name;
            PropertyValue = value;
        }
    }

    [Serializable]
    public class User
    {
        public String Username { get; set; }
        public String[] Roles { get; set; }
        public bool IsAdmin{ get; set; }
    }

    #endregion
}
