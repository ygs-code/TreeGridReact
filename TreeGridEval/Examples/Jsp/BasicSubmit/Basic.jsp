<%@page contentType="text/html"%><%@page pageEncoding="UTF-8"%><%
/*-----------------------------------------------------------------------------------------------------------------
Example of TreeGrid using synchronous (submit, non AJAX) communication with server
Example of simple table without tree
Uses HSQLDB database Database (.properties and .script) as data and XML file DBDef.xml as TreeGrid layout
Single file, without using TreeGridFramework.jsp
! Check if JAVA application has write access to ../Database.properties and ../Database.script files
! Don't forget to copy hsqldb.jar file to JAVA shared lib directory
------------------------------------------------------------------------------------------------------------------*/

//------------------------------------------------------------------------------------------------------------------
response.addHeader("Cache-Control","max-age=1, must-revalidate");

// --- Database connection ---
String Path = request.getServletPath().replaceAll("[^\\/\\\\]*$",""); // Relative path to script directory ending with "/"
java.sql.Connection Conn = null;
java.sql.Statement Cmd = null;
try {
	Class.forName("org.hsqldb.jdbcDriver").newInstance();
	Conn = java.sql.DriverManager.getConnection("jdbc:hsqldb:file:"+application.getRealPath(Path+"../Database"), "sa", "");
	Cmd = Conn.createStatement();
   } catch (Exception e) {
   out.print("<font color=red>! Failed to load HSQLDB JDBC driver.<br>You need to copy <b>hsqldb.jar</b> file to your shared lib directory and <b>restart</b> your http server.</font>");
   out.close();
   throw new Exception("");
   }

// --- Save data to database ---
try {
   String XML = request.getParameter("TGData"); if(XML==null) XML="";
   if(!XML.equals("")){
      if(XML.charAt(0)=='&'){
         XML = XML.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&amp;","&").replaceAll("&quot;","\"").replaceAll("&apos;","'");
         }
      org.w3c.dom.Document X = javax.xml.parsers.DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new org.xml.sax.InputSource(new java.io.StringReader(XML)));
      org.w3c.dom.NodeList Ch = X.getElementsByTagName("Changes");
      if(Ch.getLength()>0) Ch = Ch.item(0).getChildNodes();
      for(int i=0;i<Ch.getLength();i++){
         org.w3c.dom.Element I = (org.w3c.dom.Element) Ch.item(i);
         String id = I.getAttribute("id"); if(id.equals("")) continue; // Error
         if(I.getAttribute("Deleted").equals("1")){ // Deleting
	         Cmd.executeUpdate("DELETE FROM TableData WHERE ID="+id);  
            }
         else if(I.getAttribute("Added").equals("1")){ // Adding
            Cmd.executeUpdate("INSERT INTO TableData(ID,Project,Resource,Week,Hours) VALUES("
               + id + ","
               + "'" + I.getAttribute("Project").replaceAll("'","''") + "'," 
               + "'" + I.getAttribute("Resource").replaceAll("'","''") + "'," 
               + I.getAttribute("Week") + "," 
               + I.getAttribute("Hours") + ")");
            }
         else if(I.getAttribute("Changed").equals("1")){ // Updating
				StringBuffer SQL = new StringBuffer();
			 	org.w3c.dom.Node N;
				SQL.append("UPDATE TableData SET ");
				N = I.getAttributeNode("Project"); if(N!=null) SQL.append("Project='"+N.getNodeValue().replaceAll("'","''")+"',");
				N = I.getAttributeNode("Resource"); if(N!=null) SQL.append("Resource='"+N.getNodeValue().replaceAll("'","''")+"',");
				N = I.getAttributeNode("Week"); if(N!=null) SQL.append("Week="+N.getNodeValue()+",");
				N = I.getAttributeNode("Hours"); if(N!=null) SQL.append("Hours="+N.getNodeValue()+",");
            SQL.setLength(SQL.length()-1);  // Last comma away
            SQL.append(" WHERE ID="+id);
	         Cmd.executeUpdate(SQL.toString());
            }
         }
      }
   }
catch(Exception ex){
   out.print("Error in saving data !<br>");
   out.print(ex.getMessage());
   }



// --- Load data from database ---
StringBuffer S = new StringBuffer();
java.sql.ResultSet R = Cmd.executeQuery("SELECT * FROM TableData");
S.append("<Grid><Body><B>");
while(R.next()){
   S.append("<I id='" + R.getString(1) + "'"
            + " Project='" + R.getString(2).replaceAll("&", "&amp;").replaceAll("'", "&apos;").replaceAll("<", "&lt;") + "'"
            + " Resource='" + R.getString(3).replaceAll("&", "&amp;").replaceAll("'", "&apos;").replaceAll("<", "&lt;") + "'"
            + " Week='" + R.getString(4) + "'"
            + " Hours='" + R.getString(5) + "'"
            + "/>");
   }
S.append("</B></Body></Grid>");
R.close();
String Str = S.toString().replaceAll("\\&","&amp;").replaceAll("\\\"","&quot;");
//------------------------------------------------------------------------------------------------------------------
%><html>
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
         .ExampleDesc .Link { text-decoration:underline; color:blue; cursor:pointer; }
         .ExampleForm input { margin:0px 0px 0px 5px; }
      </style>
   </head>
   <body>
      <center class="ExampleHeader"><script>document.write(location.href.replace(/(.*)(\/Examples\/|\/ExamplesGantt\/)([^\/]+)\/([^\/]+)\/([^\/]+)$/,"$2<b>$3</b>/<i>$4</i>/$5").replace(/([^<]|^)(\/|\.)/g,"$1<u>$2</u>"));</script></center>
      <center class="ExampleName">Basic SQL database access</center>
      <center class="ExampleShort">Creates grid data from and saves changes back to database using <b>form submit</b></center>
      <div class="ExampleErr">
         <script> if(location.protocol=="file:") document.write("<style>.ExampleDesc, .ExampleBorder {display:none;} .ExampleErr { display:block; } </style>"); </script>
         Do <b>not</b> run this file locally!<br />Run it from your local or remote web http server where is installed JAVA JRE.<br>
      </div>
      <div class="ExampleDesc">
         <i>Source files:</i> <h4>Basic.jsp</h4> (this html page and also server script that generates and processes XML data), <a href="DBDef.xml" target="_blank"><h4>DBDef.xml</h4></a> (static XML layout), 
         <h4>../Database.*</h4> (source SQL database, table <b>TableData</b>)
      </div>
      <div class="ExampleDesc">
         <h4 style="background:#FCC;">You have to copy file <b style="color:red;">hsqldb.jar</b> to your JRE shared lib directory and <b style="color:red;">restart</b> your http server</h4><br />
         <h4 style="background:#FCC;">The JSP service program must have <b style="color:red;">write</b> access to all files <b style="color:red;">database.*</b></h4><br />
         The <h4>hsqldb.jar</b> is JDBC driver for <a href='http://www.hsqldb.org'><h4>HSQLDB database</h4></a> and is located in TreeGrid distribution in <b>/Server/Jsp/</b> directory.
         <u>The shared lib directory is usually <b><i>jre_install_path</i>/lib/ext</b> and also e.g. in Tomcat is usually <b><i>tomcat_install_path</i>/shared/lib</b>.</u><br>
         You can use any other SQL database instead of HSQLDB (e.g. <h4>Oracle</h4>, <h4>MS SQL server</h4>, <h4>MySQL</h4> ,...), just assign different connection to java.sql.Connection Conn in the Basic.jsp. 
         You can run the ../<b>MySqlUTF8.sql</b> script to create the "TreeGridTest" sample database on your SQL server.
      </div>
      <div class="ExampleBorder">
         <div class="ExampleMain" style="width:100%;height:530px;">
            <bdo 
                Layout_Url='DBDef.xml' 
                Data_Tag='TGData' 
                Upload_Tag='TGData' Upload_Format='Internal'
                Export_Url="../Framework/Export.jsp"
                ></bdo>
         </div>
      </div>
      <form method="post" class="ExampleForm">
         <input id="TGData" name="TGData" type="hidden" value="<%=Str%>">
         <input type="submit" value="Submit changes to server"/>
      </form>

      <!-- Google Analytics code run once for trial -->
      <script>
         var TGTrial = document.cookie.match(/TGTrialJSP\s*=\s*(\d+)/), TGIndex = 128;
         if(!TGTrial||!(TGTrial[1]&TGIndex)) setTimeout(function(){
            var n = "RunTrialJSPBasicSubmit", d = (new Date((new Date).getTime()+31536000000)).toUTCString(); document.cookie = "TGTrialJSP="+((TGTrial?TGTrial[1]:0)|TGIndex)+";expires="+d;
            var u = document.cookie.match(/TGTrialUsed\s*=\s*(\d+)/); u = u ? u[1]-0+1 : 1; if(u<=11) document.cookie = "TGTrialUsed="+u+";path=/;expires="+d;
            var s = "<div style='width:0px;height:0px;overflow:hidden;'><iframe src='http"+(document.location.protocol=="https"?"s":"")+"://www.treegrid.com/Stat/GA.html?productName="
                 +(u==1||u==3||u==5||u==10?"UsedTrial"+u:n)+"' onload='var T=this;setTimeout(function(){document.body.removeChild(T.parentNode.parentNode);},1000);'/></div>";
            var F = document.createElement("div"); F.innerHTML = s; document.body.appendChild(F);
            },100);
      </script>

   </body>
</html>
