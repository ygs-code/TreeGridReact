<%@page%><%@page trimDirectiveWhitespaces="true"%>
<%! public void rmdir(java.io.File dir){ java.io.File[] F = dir.listFiles(); for(java.io.File f : F){ if (f.isDirectory()) rmdir(f); else f.delete(); } dir.delete(); } // Deletes the directory with subdirectories %>
<%
// -------------------------------------------------------------------------------------------------------------------------------
// Application that prints TreeGrid and exports it to PDF
// It uses Google Chrome Headless as command line tool
// -------------------------------------------------------------------------------------------------------------------------------
try 
{
   // !!! Set here the path of your Google Chrome or Chromium executable !!!
   String ChromeWin = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe";
   String ChromeLinux = "google-chrome";
   String ChromeMac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
   String sys = java.lang.System.getProperty("os.name").toLowerCase();
   String Chrome = sys.indexOf("win")>=0 ? ChromeWin : (sys.indexOf("mac")>=0 ? ChromeMac : ChromeLinux);
   String Error = "set correct path to your Chrome executable in /ExamplesPDF/Jsp/ExportPdf.jsp<br><br>If you don't have it installed on your server, you can download Chrome from <a href='https://www.google.com/chrome/'>https://www.google.com/chrome/</a> or Chromium from <a href='http://www.chromium.org/getting-involved/download-chromium'>http://www.chromium.org/getting-involved/download-chromium</a><br><br>If you cannot install Chrome on your server, download and use our <a href='http://www.treegrid.com/Download#PDF'>ExportPDF package with third party converters</a>";
   if((sys.indexOf("win")>=0||sys.indexOf("mac")>=0)&&!(new java.io.File(Chrome).isFile())){ out.print("<h3>PDF export error!</h3>Please "+Error); return; }

   // --- Initialization ---
   String TempPath = System.getProperty("java.io.tmpdir");           // !!! Set temp directory here if the default temp is not accessible for JAVA to write !!!
   String Temp = null; while(Temp==null||new java.io.File(Temp).isFile()) Temp = TempPath+"/TreeGrid"+(new java.util.Random()).nextInt();
   if(!(new java.io.File(Temp).mkdir())){ out.print("<h3>PDF export error!</h3>Cannot write to '"+Temp+"'. Please set correct path to temp directory where JAVA has write permissions in /ExamplesPDF/Jsp/ExportPdf.jsp"); return; }
   String Url = (request.getRequestURL()+"").replaceAll("[^\\/\\\\]*$","");

   // --- Writes configuration received from client ---
   String Path = application.getRealPath(request.getServletPath().replaceAll("[^\\/\\\\]*$",""));
   String Cfg = null; while(Cfg==null||new java.io.File(Path+Cfg).isFile()) Cfg = "Temp_"+Math.abs((new java.util.Random()).nextInt())+".xml";
   try { java.io.FileWriter W = new java.io.FileWriter(Path+Cfg); W.write(request.getParameter("Data")); W.close(); } 
   catch(Exception E) { out.print("<h3>PDF export error!</h3>Cannot write to directory "+Path); rmdir(new java.io.File(Temp)); return; }

   // --- Runs the conversion ---
   String Arg = "--headless --disable-gpu --user-data-dir=\""+Temp+"\" --print-to-pdf=\""+Temp+"/Out.pdf\" \""+Url+request.getParameter("Source")+"?"+Url+Cfg+"&"+request.getParameter("PrintDPI")+"&"+request.getParameter("PrintPageWidth")+"&"+request.getParameter("PrintPageHeight")+"&"+request.getParameter("PrintMarginWidth")+"&"+request.getParameter("PrintMarginHeight")+"&"+request.getParameter("PDFFitPage")+"\"";
   java.lang.Process P = java.lang.Runtime.getRuntime().exec("\""+Chrome+"\" "+Arg);

   for(int i=0;i<240;i++){ // Waits maximally two minutes, increase if exporting very large files
      //if(P.waitFor((long)500,java.util.concurrent.TimeUnit.MILLISECONDS)) break; // JAVA 8
      java.lang.Thread.sleep(500); try { P.exitValue(); break; } catch (Exception E) { } // JAVA 7
      if(new java.io.File(Temp+"/Out.pdf").isFile()){ // Checks if the file already exists, because Chrome sometimes creates successfully the file, but hangs after that
         try {
            java.io.FileWriter F = new java.io.FileWriter(Temp+"/Out.pdf",true);
            F.close();
            P.destroy();
            P.waitFor();
            P = null;
            break;
            }
         catch (Exception E) { }
         }
      }
   try { if(P!=null && P.exitValue()!=0) { out.print("<h3>PDF export error!</h3>Chrome failed with exit code: "+P.exitValue()+"<br>You need to "+Error); rmdir(new java.io.File(Temp)); new java.io.File(Path+Cfg).delete(); return; } }
   catch (Exception E) { P.destroy(); P.waitFor(); out.print("<h3>PDF export error!</h3>Timeout expired.<br>Command line: " + Chrome + Arg); rmdir(new java.io.File(Temp)); new java.io.File(Path+Cfg).delete(); return; }
   java.io.FileInputStream R = new  java.io.FileInputStream(Temp+"/Out.pdf");
   int cnt = R.available();
   byte Pdf[] = new byte[cnt];
   R.read(Pdf);
   R.close();
   rmdir(new java.io.File(Temp));          // Deletes the whole temporary directory
   new java.io.File(Path+Cfg).delete();    // Deletes the configuration xml

   // --- Response Write ---
   response.addHeader("Content-Type","application/pdf");
   String name = request.getParameter("PDFName"); name = name==null || name.equals("") ? request.getParameter("File")+".pdf" : name+"."+request.getParameter("PDFFormat");
   response.addHeader("Content-Disposition","attachment; filename=\""+name+"\"");
   response.addHeader("Cache-Control","max-age=1, must-revalidate");
   java.io.OutputStream X = response.getOutputStream();
   X.write(Pdf);
   X.flush();
   X.close();
   
} catch(Exception E)
{
   out.print(E.getMessage());
}
//------------------------------------------------------------------------------------------------------------------
%>
