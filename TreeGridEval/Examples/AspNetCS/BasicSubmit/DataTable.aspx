<%@ Page language="c#"%>
<!-----------------------------------------------------------------------------------------------------------------
Example of TreeGrid using synchronous (submit, non AJAX) communication with server
Example of simple table without tree
Uses DataTable for database communication
Uses new ASP.NET style scripting with event Page_Load
Uses MS Access database Database.mdb with table "TableData" as data and XML file DBDef.xml as TreeGrid layout
! Check if ASP.NET application has write access to Database.mdb file
------------------------------------------------------------------------------------------------------------------>
<html>
   <head>
      <script src="../../../Grid/GridE.js"> </script>
      <style>
         /* Examples shared styles */
         .ExampleHeader { font:normal 16px Arial; color:blue; }
         .ExampleHeader b { color:#800; }
         .ExampleHeader i { color:black; font-style:normal; font-weight:bold; }
         .ExampleHeader u { text-decoration:none; color:#0B0; font-weight:bold; padding:0px 2px 0px 2px; }
         .ExampleName { font:bold 30px Arial; padding:5px 0px 5px 0px; }
         .ExampleShort { font:italic 15px Arial; margin-bottom:10px; padding-top:5px; }
         .ExampleDesc { margin:0px 5px 10px 5px; padding:5px; border:1px solid #AAA; }
         .ExampleErr { margin:50px auto 10px auto; padding:5px; line-height:30px; border:1px solid black; color:red; width:800px; text-align:center; display:none; }
         .ExampleBorder { margin:0px 5px 5px 5px; clear:both; zoom:1; }
         .ExampleDesc ul { padding:0px 0px 0px 15px; margin:10px 0px 0px 0px; }
         .ExampleDesc li { padding-bottom:8px; line-height:18px; }
         .ExampleDesc h4 { display:inline; font:bold 15px Arial; line-height:20px; padding-left:6px; padding-right:6px; background:#87DAE5; border:1px solid #888; color:black; margin:0px; font-style:normal; }
         .ExampleDesc u { text-decoration:none; font-size:11px; }
         .ExampleForm input { margin:0px 0px 0px 5px; }
      </style>
   </head>
   <body>
      <center class="ExampleHeader"><script>document.write(location.href.replace(/(.*)(\/Examples\/|\/ExamplesGantt\/)([^\/]+)\/([^\/]+)\/([^\/]+)$/,"$2<b>$3</b>/<i>$4</i>/$5").replace(/([^<]|^)(\/|\.)/g,"$1<u>$2</u>"));</script></center>
      <center class="ExampleName">DataTable database access</center>
      <center class="ExampleShort">Creates grid data from and saves changes back to database using <b>&lt;form> submit</b> and .NET <b>DataTable</b> class and <b>DbDataAdapter</b> interface</center>
      <div class="ExampleDesc">
         <i>Source files:</i> <h4>DataTable.aspx</h4> (this html page and also server script that generates and processes XML data), <a href="DBDef.xml" target="_blank"><h4>DBDef.xml</h4></a> (static XML layout), 
         <h4>../Database.db</h4> (source SQL database, table <b>TableData</b>)
      </div>
      <div class="ExampleDesc">
         This example uses <h4>SQLite</h4> <b>../Database.db</b> file as source SQL database.</h4>
         You can switch to <h4>MS Access</h4> <b>MDB database</b> by setting <b>UseMDB</b> property to true in DataTable.aspx. <br />
         <u>
         The MDB database can be used only in <b>32bit</b> mode of IIS. 
         Also the ASP.NET service program must have <b>write</b> access to the Database.mdb file.<br />
         To permit 32bit application on 64bit IIS, go to IIS manager, display application pools list (usually in root under computer name).
         Choose DefaultAppPool (or the pool you use for the ASP.NET applications the TreeGrid examples are run on), select Advanced configuration and set Permit 32bit application to true.
         </u>
      </div>
      <div class="ExampleBorder">
         <div class="ExampleMain" style="width:100%;height:530px;">
         <bdo 
            Debug="check"
            Layout_Url="DBDef.xml" 
            Data_Tag="TGData" 
            Upload_Tag="TGData" Upload_Format="Internal"
            Export_Url="../Framework/Export.aspx"
            ></bdo>
         </div>
      </div>
      <form method="post" runat="server" class="ExampleForm">
         <input id="TGData" type="hidden" runat="server"/>
         <input type="submit" value="Submit changes to server"/>
      </form>

      <!-- Google Analytics code run once for trial -->
      <script>
         var TGTrial = document.cookie.match(/TGTrialCS\s*=\s*(\d+)/), TGIndex = 4096;
         if(!TGTrial||!(TGTrial[1]&TGIndex)) setTimeout(function(){
            var n = "RunTrialCSDataTableSubmit", d = (new Date((new Date).getTime()+31536000000)).toUTCString(); document.cookie = "TGTrialCS="+((TGTrial?TGTrial[1]:0)|TGIndex)+";expires="+d;
            var u = document.cookie.match(/TGTrialUsed\s*=\s*(\d+)/); u = u ? u[1]-0+1 : 1; if(u<=11) document.cookie = "TGTrialUsed="+u+";path=/;expires="+d;
            var s = "<div style='width:0px;height:0px;overflow:hidden;'><iframe src='http"+(document.location.protocol=="https"?"s":"")+"://www.treegrid.com/Stat/GA.html?productName="
                 +(u==1||u==3||u==5||u==10?"UsedTrial"+u:n)+"' onload='var T=this;setTimeout(function(){document.body.removeChild(T.parentNode.parentNode);},1000);'/></div>";
            var F = document.createElement("div"); F.innerHTML = s; document.body.appendChild(F);
            },100);
      </script>

   </body>
</html>
<script language="c#" runat="server">
// -------------------------------------------------------------------------------------------------------------------------------
   
void Page_Load(object sender, System.EventArgs e)
{

   // By default (false) it uses SQLite database (Database.db). You can switch to MS Access database (Database.mdb) by setting UseMDB = true 
   // The SQLite loads dynamically its DLL from TreeGrid distribution, it chooses 32bit or 64bit assembly
   // The MDB can be used only on 32bit IIS mode !!! The ASP.NET service program must have write access to the Database.mdb file !!!
   bool UseMDB = false;

   // --- Database initialization ---
   string Path = System.IO.Path.GetDirectoryName(Context.Request.PhysicalPath);
   System.Data.IDbConnection Conn = null;
   System.Data.Common.DbDataAdapter Sql = null;
   string SqlStr = "SELECT * FROM TableData";
   System.Reflection.Assembly SQLite = null; // Required only for SQLite database

   if (UseMDB) // For MS Acess database
   {
      Conn = new System.Data.OleDb.OleDbConnection("Data Source=\"" + Path + "\\..\\Database.mdb\";Mode=Share Deny None;Jet OLEDB:Global Partial Bulk Ops=2;Jet OLEDB:Registry Path=;Jet OLEDB:Database Locking Mode=1;Jet OLEDB:Engine Type=5;Provider=\"Microsoft.Jet.OLEDB.4.0\";Jet OLEDB:System database=;Jet OLEDB:SFP=False;persist security info=False;Extended Properties=;Jet OLEDB:Compact Without Replica Repair=False;Jet OLEDB:Encrypt Database=False;Jet OLEDB:Create System Database=False;Jet OLEDB:Don't Copy Locale on Compact=False;User ID=Admin;Jet OLEDB:Global Bulk Transactions=1");
      Sql = new System.Data.OleDb.OleDbDataAdapter(SqlStr, (System.Data.OleDb.OleDbConnection)Conn);
   }
   else // For SQLite database
   {
      SQLite = System.Reflection.Assembly.LoadFrom(Path + "\\..\\..\\..\\Server\\SQLite" + (IntPtr.Size == 4 ? "32" : "64") + "\\System.Data.SQLite.DLL");
      Conn = (System.Data.IDbConnection)Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteConnection"), "Data Source=" + Path + "\\..\\Database.db");
      Sql = (System.Data.Common.DbDataAdapter)Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteDataAdapter"), SqlStr, Conn); //*/
   }
   System.Data.DataTable D = new System.Data.DataTable();
   Sql.Fill(D);

   // --- Response initialization ---
   Response.ContentType = "text/html";
   Response.Charset = "utf-8";
   Response.AppendHeader("Cache-Control","max-age=1, must-revalidate");
   System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.CreateSpecificCulture("en-US");

   System.Xml.XmlDocument X = new System.Xml.XmlDocument();

   // --- Save data to database ---
   string XML = TGData.Value;
   if (XML != "" && XML != null)
   {

      X.LoadXml(HttpUtility.HtmlDecode(XML));
      System.Xml.XmlNodeList Ch = X.GetElementsByTagName("Changes");
      if (Ch.Count > 0) foreach (System.Xml.XmlElement I in Ch[0])
         {
            string id = I.GetAttribute("id");
            System.Data.DataRow R;
            if (I.GetAttribute("Added") == "1")
            {
               R = D.NewRow();
               R["ID"] = id;
               D.Rows.Add(R);
            }
            else R = D.Select("[ID]='" + id + "'")[0];

            if (I.GetAttribute("Deleted") == "1") R.Delete();
            else if (I.GetAttribute("Added") == "1" || I.GetAttribute("Changed") == "1")
            {
               if (I.HasAttribute("Project")) R["Project"] = I.GetAttribute("Project");
               if (I.HasAttribute("Resource")) R["Resource"] = I.GetAttribute("Resource");
               if (I.HasAttribute("Week")) R["Week"] = System.Double.Parse(I.GetAttribute("Week"));
               if (I.HasAttribute("Hours")) R["Hours"] = System.Double.Parse(I.GetAttribute("Hours"));
            }
         }
      if (UseMDB) new System.Data.OleDb.OleDbCommandBuilder((System.Data.OleDb.OleDbDataAdapter)Sql); // For MS Acess database
      else Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteCommandBuilder"), Sql); // For SQLite database

      Sql.Update(D);                     // Updates changed to database
      D.AcceptChanges();
      X.RemoveAll();
   }

   // --- Load data from database ---
   {
      System.Xml.XmlElement G, BB, B, I;
      G = X.CreateElement("Grid"); X.AppendChild(G);
      BB = X.CreateElement("Body"); G.AppendChild(BB);
      B = X.CreateElement("B"); BB.AppendChild(B);
      foreach (System.Data.DataRow R in D.Rows)
      {
         I = X.CreateElement("I");
         B.AppendChild(I);
         I.SetAttribute("id", R[0].ToString());
         I.SetAttribute("Project", R[1].ToString());
         I.SetAttribute("Resource", R[2].ToString());
         I.SetAttribute("Week", R[3].ToString());
         I.SetAttribute("Hours", R[4].ToString());
      }
      TGData.Value = X.InnerXml;
   }
}
// -------------------------------------------------------------------------------------------------------------------------------
</script>
