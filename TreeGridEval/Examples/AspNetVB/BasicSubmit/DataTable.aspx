<%@ Page language="vb"%>
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
      <form id="Form1" method="post" runat="server" class="ExampleForm">
         <input id="TGData" type="hidden" runat="server"/>
         <input type="submit" value="Submit changes to server"/>
      </form>

      <!-- Google Analytics code run once for trial -->
      <script>
         var TGTrial = document.cookie.match(/TGTrialVB\s*=\s*(\d+)/), TGIndex = 4096;
         if(!TGTrial||!(TGTrial[1]&TGIndex)) setTimeout(function(){
            var n = "RunTrialVBDataTableSubmit", d = (new Date((new Date).getTime()+31536000000)).toUTCString(); document.cookie = "TGTrialVB="+((TGTrial?TGTrial[1]:0)|TGIndex)+";expires="+d;
            var u = document.cookie.match(/TGTrialUsed\s*=\s*(\d+)/); u = u ? u[1]-0+1 : 1; if(u<=11) document.cookie = "TGTrialUsed="+u+";path=/;expires="+d;
            var s = "<div style='width:0px;height:0px;overflow:hidden;'><iframe src='http"+(document.location.protocol=="https"?"s":"")+"://www.treegrid.com/Stat/GA.html?productName="
                 +(u==1||u==3||u==5||u==10?"UsedTrial"+u:n)+"' onload='var T=this;setTimeout(function(){document.body.removeChild(T.parentNode.parentNode);},1000);'/></div>";
            var F = document.createElement("div"); F.innerHTML = s; document.body.appendChild(F);
            },100);
      </script>

   </body>
</html>
<script language="vb" runat="server">
   ' -------------------------------------------------------------------------------------------------------------------------------
   Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)
      
      ' By default (false) it uses SQLite database (Database.db). You can switch to MS Access database (Database.mdb) by setting UseMDB = true 
      ' The SQLite loads dynamically its DLL from TreeGrid distribution, it chooses 32bit or 64bit assembly
      ' The MDB can be used only on 32bit IIS mode !!! The ASP.NET service program must have write access to the Database.mdb file !!!
      Dim UseMDB As Boolean = False
      
      ' --- Response initialization ---
      Response.ContentType = "text/html"
      Response.Charset = "utf-8"
      Response.AppendHeader("Cache-Control", "max-age=1, must-revalidate")
      System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.CreateSpecificCulture("en-US")
      
      ' --- Database initialization ---
      Dim Path As String = System.IO.Path.GetDirectoryName(Context.Request.PhysicalPath)
      Dim Conn As System.Data.IDbConnection = Nothing
      Dim Sql As System.Data.Common.DbDataAdapter = Nothing
      Dim SqlStr As String = "SELECT * FROM TableData"
      Dim SQLite As System.Reflection.Assembly = Nothing ' Required only for SQLite database
      
      If UseMDB Then ' For MS Acess database
         Conn = New System.Data.OleDb.OleDbConnection("Data Source=""" + Path + "\\..\\Database.mdb"";Provider=""Microsoft.Jet.OLEDB.4.0"";Mode=Share Deny None;Jet OLEDB:Global Partial Bulk Ops=2;Jet OLEDB:Registry Path=;Jet OLEDB:Database Locking Mode=1;Jet OLEDB:Engine Type=5;Jet OLEDB:System database=;Jet OLEDB:SFP=False;persist security info=False;Extended Properties=;Jet OLEDB:Compact Without Replica Repair=False;Jet OLEDB:Encrypt Database=False;Jet OLEDB:Create System Database=False;Jet OLEDB:Don't Copy Locale on Compact=False;User ID=Admin;Jet OLEDB:Global Bulk Transactions=1")
         Sql = New System.Data.OleDb.OleDbDataAdapter(SqlStr, CType(Conn, System.Data.OleDb.OleDbConnection))
      Else ' For SQLite database
         Dim bits As String = "32" : If IntPtr.Size <> 4 Then bits = "64"
         SQLite = System.Reflection.Assembly.LoadFrom(Path + "\\..\\..\\..\\Server\\SQLite" + bits + "\\System.Data.SQLite.DLL")
         Conn = Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteConnection"), "Data Source=" + Path + "\\..\\Database.db")
         Sql = Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteDataAdapter"), SqlStr, Conn)
      End If
      
      Dim D As System.Data.DataTable = New System.Data.DataTable()
      Sql.Fill(D)

      Dim X As System.Xml.XmlDocument = New System.Xml.XmlDocument()

      ' --- Save data to database ---
      Dim XML As String = TGData.Value
      If XML <> "" And XML <> Nothing Then
         X.LoadXml(HttpUtility.HtmlDecode(XML))
         Dim Ch As System.Xml.XmlNodeList = X.GetElementsByTagName("Changes")
         If Ch.Count > 0 Then
            For Each I As System.Xml.XmlElement In Ch(0)
               Dim id As String = I.GetAttribute("id")
               Dim R As System.Data.DataRow
               If I.GetAttribute("Added") = "1" Then
                  R = D.NewRow()
                  R("ID") = id
                  D.Rows.Add(R)
               Else
                  R = D.Select("[ID]='" + id + "'")(0)
               End If

               If I.GetAttribute("Deleted") = "1" Then
                  R.Delete()

               ElseIf I.GetAttribute("Added") = "1" Or I.GetAttribute("Changed") = "1" Then
                  If I.HasAttribute("Project") Then R("Project") = I.GetAttribute("Project")
                  If I.HasAttribute("Resource") Then R("Resource") = I.GetAttribute("Resource")
                  If I.HasAttribute("Week") Then R("Week") = System.Double.Parse(I.GetAttribute("Week"))
                  If I.HasAttribute("Hours") Then R("Hours") = System.Double.Parse(I.GetAttribute("Hours"))
               End If
            Next I
         End If
         If UseMDB Then
            Dim Bld As System.Data.OleDb.OleDbCommandBuilder = New System.Data.OleDb.OleDbCommandBuilder(Sql)  ' For MS Acess database
         Else
            Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteCommandBuilder"), Sql) ' For SQLite database
         End If
         Sql.Update(D)                    ' Updates changed to database
         D.AcceptChanges()
         X.RemoveAll()
      End If

      ' --- Load data from database ---
      Dim G, BB, B, F As System.Xml.XmlElement
      G = X.CreateElement("Grid") : X.AppendChild(G)
      BB = X.CreateElement("Body") : G.AppendChild(BB)
      B = X.CreateElement("B") : BB.AppendChild(B)
      For Each R As System.Data.DataRow In D.Rows
         F = X.CreateElement("I")
         B.AppendChild(F)
         F.SetAttribute("id", R(0).ToString())
         F.SetAttribute("Project", R(1).ToString())
         F.SetAttribute("Resource", R(2).ToString())
         F.SetAttribute("Week", R(3).ToString())
         F.SetAttribute("Hours", R(4).ToString())
      Next R
      TGData.Value = X.InnerXml
   End Sub
   ' -------------------------------------------------------------------------------------------------------------------------------
</script>
