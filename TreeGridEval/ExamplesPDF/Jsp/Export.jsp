<!-- !!! File required only for exporting in IE9 and older !!! -->

<%@page contentType="application/vnd.ms-excel"%><%@page pageEncoding="UTF-8"%><%
request.setCharacterEncoding("utf-8");
String name = request.getParameter("ExportName"); if(name==null || name.equals("")) name="Export";
String ext = request.getParameter("ExportFormat"); if(ext==null || ext.equals("")) ext="xlsx"; 
response.addHeader("Content-Disposition","attachment; filename=\""+name+"."+ext+"\"");
response.addHeader("Cache-Control","max-age=1, must-revalidate");
String XML = request.getParameter("Data"); if(XML==null) XML = "";
if(XML.length()>0&&XML.charAt(0)=='&') XML = XML.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&amp;","&").replaceAll("&quot;","\"").replaceAll("&apos;","'");
if(XML.indexOf("<")>=0) out.print(XML);
else {
   java.io.BufferedOutputStream O = new java.io.BufferedOutputStream(response.getOutputStream());
   O.write(javax.xml.bind.DatatypeConverter.parseBase64Binary(XML)); O.flush(); O.close();
   }

%>