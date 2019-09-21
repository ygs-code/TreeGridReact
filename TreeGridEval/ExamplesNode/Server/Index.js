var port = 8000, host = "127.0.0.1"; // The NodeJS server will run on this server and port. If you change it, you have to change it also in all examples that communicates with this server

// -----------------------------------------------------------------------------------------------------------------------------
// Support function, logs given error and returns in JSON
function err(e){ 
console.log("!"+e);
return "{IO:{Result:\"-1\",Message:\""+e.replace(/"/g,"'")+"\"}}";
}
// -----------------------------------------------------------------------------------------------------------------------------
// Support function, ends and logs given error
function enderr(e,res){ 
console.log("!"+e.replace(/<br\s*\/?>/,"\n").replace(/<\/?\w+\s*\/?>/g,""));
res.writeHead(200, {"Content-Type":"text/html; charset=utf-8","Access-Control-Allow-Origin":"*"});
res.end(e);
}
// -----------------------------------------------------------------------------------------------------------------------------
// Loads data from given SQLite database table
function get(table,param,req,res){
var sql = require('better-sqlite3'), db = new sql('./SQLite.db'); // It uses SQLite3 database engine on database in file SQLite.sb
try { var rows = db.prepare("SELECT * FROM "+table).all(); } // Selects the whole table and calls the process function with the results
catch(e){ res.end(err("SQL select error: "+e.message)); return; } 
console.log("Running SQL select in table '"+table+"'"); // Debug print of SQL statement
var O = { IO:{ Result:"0" }, Body:[rows] }; // O is JSON data object response to TreeGrid

// --- Changes database idcol to output id attribute ---
var idcol = param.idcol?param.idcol:"id";
if(idcol!="id"){ 
   for(var i=0;i<rows.length;i++){ var r = rows[i]; r.id = r[idcol]; delete r[idcol]; }
   }

// --- Changes database defcol to output Def attribute ---
if(param.defcol && param.defcol!="Def"){ 
   for(var i=0;i<rows.length;i++){ var r = rows[i]; r.Def = r[defcol]; delete r[defcol]; }
   }

// --- Sorts rows by position column ---
// @@@ Not implemented nextcol/prevcol yet
if(param.poscol){
   var p = param.poscol; rows.sort(function(a,b){ return a[p]<b[p] ? -1 : a[p] > b[p] ? 1 : 0; });
   for(var i=0;i<rows.length;i++) delete rows[i][p];
   }

// --- Nests rows to tree if provided parentcol ---
// The parentcol contains an id of the parent row or is empty for root rows. The row children are in parent row Items array
var head = [], foot = [];
if(param.parentcol){ 
   for(var i=0,R={};i<rows.length;i++) R[rows[i].id] = rows[i];
   for(var i=0;i<rows.length;i++) {
      var r = rows[i], p = r[param.parentcol];
      if(p&&R[p]) { // The parent is some row
         if(!R[p].Items) R[p].Items = [];
         R[p].Items.push(r); rows.splice(i--,1);
         }
      else if(p&&p==param.headid) { // The parent is Head section
         if(!O.Head) O.Head = [];
         O.Head.push(r); rows.splice(i--,1);
         }
      else if(p&&p==param.footid) { // The parent is Foot section 
         if(!O.Foot) O.Foot = [];
         O.Foot.push(r); rows.splice(i--,1);
         }
      // else; // It is body root row
      delete r[param.parentcol];
      }
   }
   
// --- Writes the TreeGrid data to response ---
res.end(JSON.stringify(O));
}
// -----------------------------------------------------------------------------------------------------------------------------
// Saves changes in req Data to given  SQLite database table
function set(table,param,req,res){
var qstr = require('querystring'), body = ""; 
req.on('data',function(data){ body += data.toString(); });
req.on('end', function(){
   var D = qstr.parse(body).Data; if(!D) { res.end(err("Empty request")); return; }
   D = JSON.parse(D); if(!D || !D.Changes) { res.end(err("Request without Changes")); return; }
   var idcol = param.idcol?param.idcol:"id";  // idcol is always set, default to "id"
   var C = D.Changes, S = [];     // C contains array of Changes, S is array of SQL statements
   var O = { IO:{ Result:"0" } }; // O is JSON data object for response to TreeGrid

   // --- Builds the SQL commands ---
   var Added = []; // array of added ids, for param.autoid
   for(var i=0;i<C.length;i++){
      var c = C[i], s = "";       // c is one change, s is one SQL statements;

      // --- Deletes row ---
      if(c.Deleted) s += "DELETE FROM "+table+" WHERE "+idcol+"=" + (c.id-0||c.id=="0"? c.id : "'"+c.id.replace(/'/g,"''")+"'");

      else {

         // --- Row position ---
         if(c.Added||c.Moved){
            if(param.parentcol) c[param.parentcol] = c.Parent;
            if(param.parentcol!="Parent") delete c.Parent;
            // @@@ Not implemented nextcol/prevcol/poscol yet
            if(param.nextcol) c[param.nextcol] = c.Next;
            if(param.nextcol!="Next") delete c.Next;
            if(param.prevcol) c[param.prevcol] = c.Prev;
            if(param.prevcol!="Prev") delete c.Prev;
            }

         // --- Inserts new row with all attributes ---
         if(c.Added){
            delete c.Added; delete c.Changed; delete c.Moved; 
            if(param.defcol) c[param.defcol] = c.Def;
            if(param.defcol!="Def") delete c.Def;
            delete c.Next; delete c.Prev;
            Added[i] = c.id;
            if(param.autoid) delete c.id; // If set autoid, does not save the row id to database, because it is generated by database. It will send the changed id back to TreeGrid in NewId attribute
            else if(idcol!="id") { c[idcol] = c.id; delete c.id; }
            s += "INSERT INTO "+table+"("+Object.keys(c).join(",")+") VALUES(";
            for(var a in c){ var v = c[a]; s += (v-0||v=="0" ? v : "'"+v.replace(/'/g,"''")+"'") + ","; }
            s = s.slice(0,-1)+")";
            }

         // --- Updates existing row with all given attributes ---
         else if(c.Changed||c.Moved){
            var id = c.id; delete c.id; delete c.Changed; delete c.Moved;
            s += "UPDATE "+table+" SET ";
            for(var a in c){ var v = c[a]; s += a + "=" + (v-0||v=="0" ? v : "'"+v.replace(/'/g,"''")+"'") + ","; }
            s = s.slice(0,-1) + " WHERE "+idcol+"=" + (id-0||id=="0"? id : "'"+id.replace(/'/g,"''")+"'") ;
            }
         }
      S.push(s);
      }
   
   // --- Runs the SQL commands in database ---
   try { 
      var sql = require('better-sqlite3'), db = new sql('./SQLite.db'); // It uses SQLite3 database engine on database in file SQLite.sb
      for(var i=0;i<S.length;i++){ // Runs the commands one by one, because SQLite cannot run more commands at once
         console.log("Running SQL command in table '"+table+"': "+S[i]); // Debug print of SQL statement
         var I = db.prepare(S[i]).run();
         if(Added[i] && Added[i]!=I.lastInsertRowid){ // Id of added row changed in database
            if(!O.Changes) O.Changes = [];
            O.Changes.push({id:Added[i],NewId:I.lastInsertRowid}); // Sets the changed id to the response
            }
         }
      }
   catch(e){ res.end(err("SQL command error: "+e.message)); return; }
   res.end(JSON.stringify(O));
   });
}
// -----------------------------------------------------------------------------------------------------------------------------
// Reads and returns given file url
function getfile(file,param,req,res){
var fs = require('fs');
try { var data = fs.readFileSync(__dirname+'/'+file,'utf8'); }
catch(e){ res.end(err("File "+file+" read error: "+e.message)); return; } 
console.log("Reading file "+file);
res.end(data);
}
// -----------------------------------------------------------------------------------------------------------------------------
// Writes request Data to given file url
function setfile(file,param,req,res){
console.log("setfile");
var qstr = require('querystring'), body = ""; 
req.on('data',function(data){ body += data.toString(); });
req.on('end', function(){
   var D = qstr.parse(body).Data; if(!D) { res.end(err("Empty request")); return; }
   var O = { IO:{ Result:"0" } }; // O is JSON data object for response to TreeGrid
   var fs = require('fs');
   try { fs.writeFileSync(__dirname+'/'+file,D,'utf8'); }
   catch(e){ res.end(err("File "+file+" write error: "+e.message)); return; } 
   console.log("Writing file "+file);
   res.end(JSON.stringify(O));
   });
}
// -----------------------------------------------------------------------------------------------------------------------------
// Generates PDF according to the param
function getpdf(param,req,res){
console.log("getpdf");
var qstr = require('querystring'), body = ""; 
req.on('data',function(data){ body += data.toString(); });
req.on('end', function(){
   var D = qstr.parse(body); if(!D) { enderr("Empty request"); return; }
   var fs = require('fs');
   var url = "http://"+host+":"+port+"/", dir = __dirname+"/";
   var cfg = null; while(!cfg||fs.existsSync(dir+cfg)) cfg = "TempCfg"+Math.round(Math.random()*1e10)+".xml";
   try { fs.writeFileSync(dir+cfg,D.Data,'utf8'); }
   catch(e){ enderr("File '<b>"+dir+cfg+"<b>' write error: "+e.message,res); return; }
   var out = null; while(!out||fs.existsSync(dir+out)) out = "TempOut"+Math.round(Math.random()*1e10)+".pdf";
   var html = url+"ExportPDF.html?"+(param.layout?"["+param.layout+"]":"")+"&"+(param.data?"["+param.data+"]":"")+"&"+cfg+"&"+D.PrintDPI+"&"+D.PrintPageWidth+"&"+D.PrintPageHeight+"&"+D.PrintMarginWidth+"&"+D.PrintMarginHeight+"&"+D.PDFFitPage;
   console.log(html);
   var pp = require('puppeteer');
   var pagesizes = ["Auto","Letter","Legal","Ledger","A0","A1","A2","A3","A4","A5","A6","A7","A8","A9","B0","B1","B2","B3","B4","B5"];
   console.log("starting Chrome");
   function error(e){ enderr("PDF export failed with error:"+e,res); }
   pp.launch().then(function(browser){
      console.log("Chrome started");
      browser.newPage().then(function(page){
         page.goto(html,{waitUntil: 'networkidle0'}).then(function(){
            console.log("creating PDF");
            page.pdf({path:dir+out,printBackground:true,preferCSSPageSize:true}).then(function(){
               console.log("closing Chrome");
               browser.close().then(function(){
                  try { fs.unlinkSync(dir+cfg); } catch(e){ console.log("cannot delete file: "+dir+cfg+" with error: "+e.message); }
                  if(!fs.existsSync(out)) { enderr("Chrome failed to create the PDF output",res); return; }
                  console.log("PDF export created");
                  try { var pdf = fs.readFileSync(dir+out); }
                  catch(e){ enderr("File "+dir+out+" read error: "+e.message); return; } 
                  res.writeHead(200, {"Content-Type":"application/pdf","Content-Disposition": "attachment; filename=\"" + (D.PDFName ? D.PDFName+"."+D.PDFFormat : D.File+".pdf") + "\"","Access-Control-Allow-Origin":"*"}); // Sets response header to UTF8 text and allows requests from other domains / ports
                  res.end(pdf);
                  try { fs.unlinkSync(dir+out); } catch(e){ console.log("cannot delete file: "+dir+out+" with error: "+e.message); }
                  console.log("PDF export finished");
                  },error);
               },error);
            },error);
         },error)
      },error)
   });
}
// -----------------------------------------------------------------------------------------------------------------------------
// Simple rewriting the cmd url from path
function rewrite(cmd,path,req,res) {
var ext = cmd.replace(/[\?\#].*/,"").match(/\.\w+$/gi)[0].toLowerCase().slice(1);
var type = {htm:"text/html",html:"text/html",css:"text/css",js:"text/javascript",svg:"image/svg+xml",gif:"image/gif",png:"image/png",jpeg:"image/jpeg",jpg:"image/jpg",ico:"image/x-icon"}[ext];
if(!type) type = "text/plain";
if(type.indexOf("text")>=0) type += "; charset=utf-8";
res.writeHead(200, {"Content-Type":type,"Access-Control-Allow-Origin":"*"});
var fs = require('fs'), file = __dirname+path+cmd.replace(/[\?\#].*/,"");
try { 
   res.end(fs.readFileSync(file)); 
   //console.log("serving file:"+file); 
   }
catch(e){ enderr("File "+file+" read error: "+e.message,res); } 
}
// -----------------------------------------------------------------------------------------------------------------------------
// Main listening function
function run(req, res) {
try {
   var U = require("url").parse(req.url), cmd = U.pathname.slice(1), query = require('querystring').parse(U.query);
   res.writeHead(200, {"Content-Type":"text/plain; charset=utf-8","Access-Control-Allow-Origin":"*"}); // Sets response header to UTF8 text and allows requests from other domains / ports
   if(cmd=="get") get(query.table,query,req,res);          // Calls get method for read from db
   else if(cmd=="set") set(query.table,query,req,res);     // Calls set method for save to db
   else if(cmd=="getfile") getfile(query.file,query,req,res);  // Calls get method for read from static file
   else if(cmd=="setfile") setfile(query.file,query,req,res);  // Calls set method for save to static file
   else if(cmd=="getpdf") getpdf(query,req,res);  // Calls getpdf method to generate pdf from data or db or file
   else if(cmd.search(/^Grid(Src)?/i)>=0) rewrite(cmd,"/../../",req,res); // Serves (rewrites) Grid/* directory from ../../Grid/*
   else if(cmd.search(/\.\w{1,5}($|\?|\#)/i)>=0) rewrite(cmd,"/",req,res); // Serves files with extension without change
   else { // Unknown method - writes error + help
      var s = "Node.js server for TreeGrid examples.\nAccepts these methods:\n\n";
      s += "get (http://"+host+":"+port+"/get?table=REQUIRED&idcol=id&parentcol=&defcol=) - Returns data from given table in JSON format.\n"
      s += "set (http://"+host+":"+port+"/set?table=REQUIRED&idcol=id&parentcol=&defcol=&autoid=) with changes in JSON in POST Data attribute - Saves posted changes to given table.\n"
      s += "Parameter idcol can be set to the primary key column name, if the primary key column in table is not named 'id'\n";
      s += "Parameter parentcol should be set to column name where row Parent attribute is stored, the Parent contains the id of the parent row\n";
      s += "Parameter defcol should be set to column name where row Def attribute is saved, if the rows can have different Def\n";
      s += "Parameter autoid should be set to 1 if the table generates the record ids automatically\n";
      s += "\n";
      s += "getfile (http://"+host+":"+port+"/getfile?file=REQUIRED) - Returns data from given file without any modifications.\n"
      s += "setfile (http://"+host+":"+port+"/setfile?file=REQUIRED) - Saves posted data (in POST Data attribute) to given file without any modifications.\n"
      s += "\n";
      s += "getpdf (http://"+host+":"+port+"/getpdf?layout=url&data=url) - Converts TreeGrid data in POST Data to PDF.\n"
      s += "Parameters layout and data can be set to url where to load TreeGrid layout and data\n";
      res.end("Unknown function:"+(cmd?cmd:"???")+"\n\n"+s);
      }
   }
catch(e){ res.end(err("Exception: "+e.message)); return; }
}
// -----------------------------------------------------------------------------------------------------------------------------
// Starts NodeJS server on given url and part and listens to requests
require('http').createServer(run).listen(port,host,null,function(){ console.log("The server running at http://"+host+":"+port+"/"); });

// Or the same using Node Express (install it by running "npm install express")
//var express = require('express'), app = express();
//app.get('/',run);
//app.listen(port,function(){ console.log("The server running at http://"+host+":"+port+"/"); });
// -----------------------------------------------------------------------------------------------------------------------------