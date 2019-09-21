<%@ Page language="c#"%>
<script language="c#" runat="server">
// -------------------------------------------------------------------------------------------------------------------------------
// Application that prints TreeGrid and exports it to PDF
// It uses Google Chrome Headless as command line tool
// -------------------------------------------------------------------------------------------------------------------------------
void Page_Load(object sender, System.EventArgs e) 
{
try 
{
   // !!! Set here the path of your Google Chrome or Chromium executable !!!
   string Chrome = @"C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe";
   if (!System.IO.File.Exists(Chrome)) { Response.Write("<h3>PDF export error!</h3>Please set correct path to your Chrome.exe in /ExamplesPDF/AspNetCS/ExportPdf.aspx<br><br>If you don't have it installed on your server, you can download Chrome from <a href='https://www.google.com/chrome/'>https://www.google.com/chrome/</a> or Chromium from <a href='http://www.chromium.org/getting-involved/download-chromium'>http://www.chromium.org/getting-involved/download-chromium</a><br><br>If you cannot install Chrome on your server, download and use our <a href='http://www.treegrid.com/Download#PDF'>ExportPDF package with third party converters</a>"); return; }

   // --- Initialization ---
   string TempPath = System.IO.Path.GetTempPath();   // !!! Set temp directory here if the default temp is not accessible for ASP.NET to write !!!
   string Temp = null; while (Temp == null || System.IO.Directory.Exists(Temp)) Temp = TempPath + "TreeGrid" + (new Random()).Next().ToString();
   try { System.IO.Directory.CreateDirectory(Temp); }
   catch (Exception E) { Response.Write("<h3>PDF export error!</h3>Cannot write to '" + Temp + "'. Please set correct path to temp directory where ASP.NET has write permissions in /ExamplesPDF/AspNetCS/ExportPdf.aspx"); return; }
   string Url = Request.Url.ToString(); Url = Url.Substring(0,Url.LastIndexOf('/')+1);
   
   // --- Writes configuration received from client ---
   string Path = System.IO.Path.GetDirectoryName(Context.Request.PhysicalPath) + "\\"; 
   string Cfg = null; while (Cfg == null || System.IO.File.Exists(Path + Cfg)) Cfg = "Temp_" + (new Random()).Next().ToString() + ".xml";
   try { System.IO.File.WriteAllText(Path + Cfg, Request["Data"]); }
   catch (Exception E) { Response.Write("<h3>PDF export error!</h3>Cannot write to directory " + Path); System.IO.Directory.Delete(Temp, true); return; }

   // --- Runs the conversion ---
   System.Diagnostics.Process P = new System.Diagnostics.Process();
   P.StartInfo.UseShellExecute = false;
   P.StartInfo.FileName = "\""+Chrome+"\"";
   P.StartInfo.Arguments = "--headless --disable-gpu --user-data-dir=\""+Temp+"\" --print-to-pdf=\""+Temp+"\\Out.pdf\" \""+Url+Request["Source"]+"?"+Url+Cfg+"&"+Request["PrintDPI"]+"&"+Request["PrintPageWidth"]+"&"+Request["PrintPageHeight"]+"&"+Request["PrintMarginWidth"]+"&"+Request["PrintMarginHeight"]+"&"+Request["PDFFitPage"]+"\"";
   //System.Security.SecureString S = new System.Security.SecureString(); S.AppendChar('x'); S.AppendChar('x'); S.AppendChar('x'); P.StartInfo.UserName = "Administrator"; P.StartInfo.Password = S; // If required to run under specific account
   P.Start();
   for(int i=0;i<240;i++){ // Waits maximally two minutes, increase if exporting very large files
      if(P.WaitForExit(500)) break;
      if(System.IO.File.Exists(Temp+"\\Out.pdf")){ // Checks if the file already exists, because Chrome sometimes creates successfully the file, but hangs after that
         try {
            System.IO.FileStream F = System.IO.File.OpenWrite(Temp + "\\Out.pdf");
            F.Close();
            P.Kill();
            P.WaitForExit(500); // Waits to delete the temporary directory
            P = null;
            break;
            }
         catch (Exception E) { }
         }
      }
   if (P != null && !P.HasExited) { P.Kill(); P.WaitForExit(500); Response.Write("<h3>PDF export error!</h3>Timeout expired.<br>Command line: " + P.StartInfo.FileName + P.StartInfo.Arguments); System.IO.Directory.Delete(Temp, true); System.IO.File.Delete(Path + Cfg); return; }
   if (P != null && P.ExitCode != 0) { Response.Write("<h3>PDF export error!</h3>Chrome failed with exit code " + P.ExitCode + "<br>Command line: " + P.StartInfo.FileName + P.StartInfo.Arguments); System.IO.Directory.Delete(Temp, true); System.IO.File.Delete(Path + Cfg); return; }
   byte[] PdfBytes = System.IO.File.ReadAllBytes(Temp+"\\Out.pdf");
   try {
      System.IO.File.Delete(Path + Cfg);       // Deletes the temporary file with configuration and changes
      System.IO.Directory.Delete(Temp, true);  // Deletes the whole temporary directory
      }
   catch(Exception E){  }

   // --- Response Write ---
   Response.ContentType = "application/pdf";
   Response.Charset = "utf-8";
   Response.AppendHeader("Cache-Control", "max-age=1, must-revalidate");
   Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + (Request["PDFName"] != null ? Request["PDFName"] + "." + Request["PDFFormat"] : Request["File"] + ".pdf") + "\"");
   Response.BinaryWrite(PdfBytes);
   
} catch(Exception E)
{
   Response.Write(E.Message);
}
}
// -------------------------------------------------------------------------------------------------------------------------------
</script>