<%@ Page language="vb" debug="true"%>
<!-----------------------------------------------------------------------------------------------------------------
Example of TreeGrid using synchronous (submit, non AJAX) communication with server
Example of simple table without tree
Uses OleDbDataReader and OleDbCommand for database communication
Uses new ASP.NET style scripting with event Page_Load
Uses MS Access database Database.mdb and table "TableData" as data and XML file DBDef.xml as TreeGrid layout
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
      <center class="ExampleName">DbCommand database access</center>
      <center class="ExampleShort">Creates grid data from and saves changes back to database using <b>&lt;form> submit</b> and .NET <b>IDbCommand</b> and <b>IDataReader</b> interfaces</center>
      <div class="ExampleDesc">
         <i>Source files:</i> <h4>DbCommand.aspx</h4> (this html page and also server script that generates and processes XML data), <a href="DBDef.xml" target="_blank"><h4>DBDef.xml</h4></a> (static XML layout), 
         <h4>../Database.db</h4> (source SQL database, table <b>TableData</b>)
      </div>
      <div class="ExampleDesc">
         This example uses <h4>SQLite</h4> <b>../Database.db</b> file as source SQL database.</h4>
         You can switch to <h4>MS Access</h4> <b>MDB database</b> by setting <b>UseMDB</b> property to true in DbCommand.aspx. <br />
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
         var TGTrial = document.cookie.match(/TGTrialVB\s*=\s*(\d+)/), TGIndex = 8192;
         if(!TGTrial||!(TGTrial[1]&TGIndex)) setTimeout(function(){
            var n = "RunTrialVBDbCommandSubmit", d = (new Date((new Date).getTime()+31536000000)).toUTCString(); document.cookie = "TGTrialVB="+((TGTrial?TGTrial[1]:0)|TGIndex)+";expires="+d;
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
      
      If UseMDB Then ' For MS Acess database
         Conn = New System.Data.OleDb.OleDbConnection("Data Source=""" + Path + "\\..\\Database.mdb"";Provider=""Microsoft.Jet.OLEDB.4.0"";Mode=Share Deny None;Jet OLEDB:Global Partial Bulk Ops=2;Jet OLEDB:Registry Path=;Jet OLEDB:Database Locking Mode=1;Jet OLEDB:Engine Type=5;Jet OLEDB:System database=;Jet OLEDB:SFP=False;persist security info=False;Extended Properties=;Jet OLEDB:Compact Without Replica Repair=False;Jet OLEDB:Encrypt Database=False;Jet OLEDB:Create System Database=False;Jet OLEDB:Don't Copy Locale on Compact=False;User ID=Admin;Jet OLEDB:Global Bulk Transactions=1")
      Else ' For SQLite database
         Dim SQLite As System.Reflection.Assembly = Nothing ' Required only for SQLite database
         Dim bits As String = "32" : If IntPtr.Size <> 4 Then bits = "64"
         SQLite = System.Reflection.Assembly.LoadFrom(Path + "\\..\\..\\..\\Server\\SQLite" + bits + "\\System.Data.SQLite.DLL")
         Conn = Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteConnection"), "Data Source=" + Path + "\\..\\Database.db")
      End If
      Conn.Open()
      Dim Cmd As System.Data.IDbCommand = Conn.CreateCommand()

      ' --- Save data to database ---
      Dim XML As String = TGData.Value
      If XML <> "" And XML <> Nothing Then
   
         Dim X As System.Xml.XmlDocument = New System.Xml.XmlDocument()
         X.LoadXml(HttpUtility.HtmlDecode(XML))
         Dim Ch As System.Xml.XmlNodeList = X.GetElementsByTagName("Changes")
         If (Ch.Count > 0) Then
            For Each I As System.Xml.XmlElement In Ch(0)
               Dim SQL As String = ""
               Dim id As String = I.GetAttribute("id")
         
               If I.GetAttribute("Deleted") = "1" Then
                  SQL = "DELETE FROM TableData WHERE ID=" + id

               ElseIf I.GetAttribute("Added") = "1" Then
                  SQL = "INSERT INTO TableData(ID,Project,Resource,Week,Hours) VALUES(" _
                     + id + "," _
                     + "'" + I.GetAttribute("Project").Replace("'", "''") + "'," _
                     + "'" + I.GetAttribute("Resource").Replace("'", "''") + "'," _
                     + I.GetAttribute("Week") + "," _
                     + I.GetAttribute("Hours") + ")"
               
               ElseIf I.GetAttribute("Changed") = "1" Then
                  SQL = "UPDATE TableData SET "
                  For Each A As System.Xml.XmlAttribute In I.Attributes
                     If A.Name = "Project" Or A.Name = "Resource" Then
                        SQL += A.Name + " = '" + A.Value.Replace("'", "''") + "',"
                     ElseIf A.Name = "Week" Or A.Name = "Hours" Then
                        SQL += A.Name + " = " + A.Value + ","
                     End If
                  Next A
                  SQL = SQL.TrimEnd(",".ToCharArray()) 'Last comma away
                  SQL = SQL + " WHERE ID=" + id
               End If
               
               Cmd.CommandText = SQL
               Cmd.ExecuteNonQuery()
            Next I
         End If
      End If
      
      ' --- Load data from database ---

      Cmd.CommandText = "SELECT * FROM TableData"
      Dim R As System.Data.IDataReader = Cmd.ExecuteReader()
      Dim S As String
      S = "<Grid><Body><B>"
      Do While R.Read()
         S = S + "<I id='" + R(0).ToString() + "'" _
            + " Project='" + R(1).ToString().Replace("&", "&amp;").Replace("'", "&apos;").Replace("<", "&lt;") + "'" _
            + " Resource='" + R(2).ToString().Replace("&", "&amp;").Replace("'", "&apos;").Replace("<", "&lt;") + "'" _
            + " Week='" + R(3).ToString() + "'" _
            + " Hours='" + R(4).ToString() + "'" _
            + "/>"
      Loop
      S = S + "</B></Body></Grid>"
      TGData.Value = S
      R.Close()
      Conn.Close()
   End Sub
   ' -------------------------------------------------------------------------------------------------------------------------------
</script>
