<%@ Page Language="vb" ContentType="application/vnd.ms-excel" %>
<% 
   Dim file As String : file = Request("ExportName") : If file = Nothing Then file = "Export"
   Dim ext As String : ext = Request("ExportFormat") : If ext = Nothing Then ext = "xlsx"
   Response.AppendHeader("Cache-Control", "max-age=1, must-revalidate")
   Response.AppendHeader("Content-Disposition", "attachment; filename=""" + file + "." + ext + """")
   Dim data As String : data = Request("Data") : If data = Nothing Then data = ""
   If data.IndexOf(">") >= 0 Or data.IndexOf("&lt;") >= 0 Or data = "" Then
      Response.Write(HttpUtility.HtmlDecode(data))
   Else
      Response.BinaryWrite(Convert.FromBase64String(data))
   End If
%>