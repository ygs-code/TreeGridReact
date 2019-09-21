<%@ Page language="vb" %>
<script language="vb" runat="server">
   ' -------------------------------------------------------------------------------------------------------------------------------
   ' Application that prints TreeGrid and exports it to PDF
   ' It uses Google Chrome Headless as command line tool
   ' -------------------------------------------------------------------------------------------------------------------------------
   Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)

      Try

         ' !!! Set here the path of your Google Chrome or Chromium executable !!!
         Dim Chrome As String = "C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe"
         If System.IO.File.Exists(Chrome) = False Then Response.Write("<h3>PDF export error!</h3>Please set correct path to your Chrome.exe in /ExamplesPDF/AspNetCS/ExportPdf.aspx<br><br>If you don't have it installed on your server, you can download Chrome from <a href='https://www.google.com/chrome/'>https://www.google.com/chrome/</a> or Chromium from <a href='http://www.chromium.org/getting-involved/download-chromium'>http://www.chromium.org/getting-involved/download-chromium</a><br><br>If you cannot install Chrome on your server, download and use our <a href='http://www.treegrid.com/Download#PDF'>ExportPDF package with third party converters</a>") : Return
         
         ' --- Initialization ---
         Dim TempPath As String = System.IO.Path.GetTempPath()   ' !!! Set temp directory here if the default temp is not accessible for ASP.NET to write !!!
         Dim Temp As String = ""
         While Temp = "" Or System.IO.Directory.Exists(Temp)
            Temp = TempPath + "TreeGrid" + (New Random()).Next().ToString()
         End While
         Try
            System.IO.Directory.CreateDirectory(Temp)
         Catch EE As Exception
            Response.Write("<h3>PDF export error!</h3>Cannot write to '" + Temp + "'. Please set correct path to temp directory where ASP.NET has write permissions in /ExamplesPDF/AspNetVB/ExportPdf.aspx")
            Return
         End Try
         Dim Url As String = Request.Url.ToString() : Url = Url.Substring(0, Url.LastIndexOf("/") + 1)

         ' --- Writes configuration received from client ---
         Dim Path As String = System.IO.Path.GetDirectoryName(Context.Request.PhysicalPath) + "\\"
         Dim Cfg As String = ""
         While Cfg = "" Or System.IO.File.Exists(Cfg)
            Cfg = "Temp" + (New Random()).Next().ToString() + ".xml"
         End While
         Try
            System.IO.File.WriteAllText(Path + Cfg, Request("Data"))
         Catch EE As Exception
            Response.Write("<h3>PDF export error!</h3>Cannot write to directory " + Path)
            Return
         End Try

         ' --- Runs the conversion ---
         Dim P As System.Diagnostics.Process = New System.Diagnostics.Process()
         P.StartInfo.UseShellExecute = False
         P.StartInfo.FileName = """" + Chrome + """"
         P.StartInfo.Arguments = "--headless --disable-gpu --user-data-dir=""" + Temp + """ --print-to-pdf=""" + Temp + "\Out.pdf"" """ + Url + Request("Source") + "?" + Url + Cfg + "&" + Request("PrintDPI") + "&" + Request("PrintPageWidth") + "&" + Request("PrintPageHeight") + "&" + Request("PrintMarginWidth") + "&" + Request("PrintMarginHeight") + "&" + Request("PDFFitPage") + """"
         ' Dim S As System.Security.SecureString = New System.Security.SecureString() : S.AppendChar("x") : S.AppendChar("x") : S.AppendChar("x") : P.StartInfo.UserName = "Administrator" : P.StartInfo.Password = S ' If required to run under specific account
         P.Start()
         Dim i As Integer
         For i = 0 To 240 ' Waits maximally two minutes, increase if exporting very large files
            If P.WaitForExit(500) Then Exit For
            If System.IO.File.Exists(Temp + "\\Out.pdf") Then  ' Checks if the file already exists, because Chrome sometimes creates successfully the file, but hangs after that
               Try
                  Dim F As System.IO.FileStream = System.IO.File.OpenWrite(Temp + "\\Out.pdf")
                  F.Close()
                  P.Kill()
                  P.WaitForExit(500) ' Waits to delete the temporary directory
                  P = Nothing
                  Exit For
               Catch EE As Exception
               End Try
            End If
         Next i
      
         If Not IsNothing(P) Then
            If Not P.HasExited Then P.Kill() : P.WaitForExit(500) : Response.Write("<h3>PDF export error!</h3>Timeout expired.<br>Command line: " + P.StartInfo.FileName + P.StartInfo.Arguments) : System.IO.Directory.Delete(Temp, True) : System.IO.File.Delete(Path + Cfg) : Return
            If P.ExitCode <> 0 Then Response.Write("<h3>PDF export error!</h3>Chrome failed with exit code " + P.ExitCode + "<br>Command line: " + P.StartInfo.FileName + P.StartInfo.Arguments) : System.IO.Directory.Delete(Temp, True) : System.IO.File.Delete(Path + Cfg) : Return
         End If
         
         Dim PdfBytes() As Byte : PdfBytes = System.IO.File.ReadAllBytes(Temp + "\Out.pdf")
         Try
            System.IO.File.Delete(Path + Cfg)       ' Deletes the temporary file with configuration and changes
            System.IO.Directory.Delete(Temp, True)  ' Deletes the whole temporary directory
         Catch EE As Exception
         End Try
         
         ' --- Response Write ---
         Response.ContentType = "application/pdf"
         Response.Charset = "utf-8"
         Response.AppendHeader("Cache-Control", "max-age=1, must-revalidate")
         Dim file As String : If Request("PDFName") Is Nothing Then : file = Request("File") + ".pdf" : Else : file = Request("PDFName") + "." + Request("PDFFormat") : End If
         Response.AppendHeader("Content-Disposition", "attachment; filename=""" + file + """")
         Response.BinaryWrite(PdfBytes)
   
      Catch Ex As Exception
         Response.Write(Ex.Message)
      End Try
   End Sub
   ' -------------------------------------------------------------------------------------------------------------------------------
</script>