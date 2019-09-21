<%@ Page Language="C#" ContentType="application/vnd.ms-excel" %>
<% 
   string file = (Request["ExportName"]==null?"Export":Request["ExportName"]) + "." + (Request["ExportFormat"]==null?"xlsx":Request["ExportFormat"]);
   Response.AppendHeader("Content-Disposition","attachment; filename=\""+file+"\"");
   Response.AppendHeader("Cache-Control","max-age=1, must-revalidate");
   string data = Request["Data"]; if(data==null) data = "";
   if (data.IndexOf('>') >= 0 || data.IndexOf("&lt;") >= 0 || data == "") Response.Write(HttpUtility.HtmlDecode(data));
   else Response.BinaryWrite(Convert.FromBase64String(data));
%>