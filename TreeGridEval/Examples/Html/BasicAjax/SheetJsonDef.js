TreeGridLoaded ({ // JSONP header, to be possible to load from xxx_Jsonp data source
Cfg: { id:"Sheet", SuppressCfg:"1", Sorting:"0",// Suppresses configuration and sorting 
   SuppressMessage:"3",                         // Suppresses all messages, including page messages 
   AutoIdPrefix:"",                             // Prefix for automatically generated row id, here set empty instead of AR 
   LimitScroll:"23", MinBodyRows:"6",           // Responsive design, for small windows sets NoVScroll and NoHScroll 
   ImportAction:"3",                            // Pertmits opening xlsx files by open dialog and by dragging file to grid
   Language:"EN",                               // Presets English language and shows the Languages combo
   PrintVarHeight:"2",                          // Calculates height of not rendered rows
   PrintPagePrefix:"<center class='%9' style='width:%7px'>Sheet example printed page %3 from %6</center>", // Sample page header for printing
   PrintPagePostfix:"<center class='%9' style='width:%7px'>Page %1 horizontally from %4 , page %2 vertically from %5</center>", // Sample page footer for printing

   // Automatic column and row pages    
   Paging:"2", AutoPages:"1", PageLength:"10", MaxPages:"3", RemoveUnusedFixed:"0", RemoveAutoPages:"1",  // Defines automatic row pages 
   
   ColPaging:"2", AutoColPages:"1", ColPageLength:"10", ColPageMin:"0", MaxColPages:"3", ColPagingFixed:"0", RemoveAutoColPages:"1",  // Defines automatic column pages 

   // Defines row and column indexes 
   RowIndex:"Index", RowIndexType:"6",  // Creates number RowIndex with all variable rows except deleted 
   ColIndex:"Header", ColIndexType:"6", ColIndexChars:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",  // Creates letter ColIndex with all variable columns except deleted  

   // Permits manipulation 
   ColAdding:"1",  // Permits adding new columns. Adding and copying rows and copying columns is permitted by default 
   ColDeleting:"1",  // Permits deleting columns. Deleting rows is permitted by default 
   SelectingCols:"1",  // Permits selecting the whole columns. Selecting rows is permitted by default 
   SelectAllType:"31",  // Makes the SelectAll button on panels a switch; it is changed also when the row/column is selected/unselected; the added rows/columns are automatically selected if it is on 

   // Cell popup menu to manipulate rows and columns 
   Menu: { Head:'Actions',Items:[
         {Name:'Rows',Caption:1},
         {Name:'Select',Menu:1,Items:'|SelectRow|DeselectRow|SelectFocusedRows@2|DeselectFocusedRows@2|-|SelectAll|DeselectAll|InvertAll'},
         {Name:'Show',Menu:1,Items:'|ShowRowAbove|ShowRowBelow|ShowRows|ShowAllRows|-|ShowHeader|ShowPanelRow|ShowNames|ShowToolbar'},
         {Name:'Hide',Menu:1,Items:'|HideRow|HideRows@2|HideSelectedRows@2|-|HideHeader|HidePanelRow|HideNames|HideToolbar'},
         {Name:'Add',Menu:1,Items:'|AddRow|AddRows@2|AddSelected@2'},
         {Name:'Copy',Menu:1,Items:'|CopyRow|CopyRows|CopySelected'},
         {Name:'Delete',Menu:1,Items:'|DeleteRow|UndeleteRow|DeleteRows|UndeleteRows|DeleteSelected|UndeleteSelected|-|RemoveRow|RemoveRows|RemoveSelected'},
         {Name:'-'},
         {Name:'Columns',Caption:1},
         {Name:'Select',Menu:1,Items:'|SelectCol|DeselectCol|SelectFocusedCols@2|DeselectFocusedCols@2|-|SelectAllCols|DeselectAllCols'},
         {Name:'Show',Menu:1,Items:'|ShowColLeft|ShowColRight|ShowCols|ShowAllCols|-|ShowIndex|ShowPanel|ShowIds'},
         {Name:'Hide',Menu:1,Items:'|HideCol|HideCols@2|HideSelectedCols@2|-|HideIndex|HidePanel|HideIds'},
         {Name:'Add',Menu:1,Items:'|AddCol|AddCols@2|AddSelectedCols@2'},
         {Name:'Copy',Menu:1,Items:'|CopyCol|CopyCols|CopySelectedCols'},
         {Name:'Delete',Menu:1,Items:'|DeleteCol|UndeleteCol|DeleteCols|UndeleteCols|DeleteSelectedCols|UndeleteSelectedCols|-|RemoveCol|RemoveCols|RemoveSelectedCols'},
         {Name:'-'},
         {Name:'Cells',Caption:1},
         {Name:'Edit',Menu:1,Items:'|SetEditable|SetReadOnly|SetPreview|ClearEditable|-|SetEditableSelected|SetReadOnlySelected|SetPreviewSelected|ClearEditableSelected|-|SetEditableRow|SetReadOnlyRow|SetPreviewRow|ClearEditableRow|-|SetEditableCol|SetReadOnlyCol|SetPreviewCol|ClearEditableCol'},
         {Name:'Clear',Menu:1,Items:'|ClearCell|ClearValue|ClearStyle|-|ClearSelectedCells|ClearSelectedValues|ClearSelectedStyles'},
         {Name:'Format',Menu:1,Items:'|ChooseFormat|ChooseFormatSelected|SetFormat|SetFormatSelected'},
         {Name:'Span',Menu:1,Items:'|SplitCell|SplitSelected|SpanSelected'},
         {Name:'Border',Menu:1,Items:'|SetBorder|SetSelectedBorders|ClearBorder|ClearSelectedBorders|-|ChooseBorderStyle|ChooseBorderEdge|ChooseBorderColor|-|ChooseSelectedBordersStyle|ChooseSelectedBordersEdge|ChooseSelectedBordersColor'},
         {Name:'Style',Menu:1,Items:'|BoldOn|BoldOff|BoldOnSelected|BoldOffSelected|-|ItalicOn|ItalicOff|ItalicOnSelected|ItalicOffSelected|-|UnderlineOn|UnderlineOff|UnderlineOnSelected|UnderlineOffSelected|-|StrikeOn|StrikeOff|StrikeOnSelected|StrikeOffSelected|-|OverlineOn|OverlineOff|OverlineOnSelected|OverlineOffSelected|-|SmallCapsOn|SmallCapsOff|SmallCapsOnSelected|SmallCapsOffSelected|-|NoTextStyle|NoTextStyleSelected'},
         {Name:'Font',Menu:1,Items:'|SetTextFont|NoTextFont|ChooseTextFont|-|SetTextFontSelected|NoTextFontSelected|ChooseTextFontSelected|-|SetTextSize|NoTextSize|ChooseTextSize|-|SetTextSizeSelected|NoTextSizeSelected|ChooseTextSizeSelected'},
         {Name:'Color',Menu:1,Items:'|SetTextColor|NoTextColor|ChooseTextColor|-|SetTextColorSelected|NoTextColorSelected|ChooseTextColorSelected|-|SetColor|NoColor|ChooseColor|-|SetColorSelected|NoColorSelected|ChooseColorSelected'},
         {Name:'Shadow',Menu:1,Items:'|SetTextShadow|NoTextShadow|ChooseTextShadow|-|SetTextShadowSelected|NoTextShadowSelected|ChooseTextShadowSelected|-|SetTextShadowColor|NoTextShadowColor|ChooseTextShadowColor|-|SetTextShadowColorSelected|NoTextShadowColorSelected|ChooseTextShadowColorSelected'},
         {Name:'Align',Menu:1,Items:'|AlignLeft|AlignRight|AlignCenter|NoAlign|-|AlignLeftSelected|AlignRightSelected|AlignCenterSelected|NoAlignSelected|-|VAlignTop|VAlignBottom|VAlignMiddle|NoVAlign|-|VAlignTopSelected|VAlignBottomSelected|VAlignMiddleSelected|NoVAlignSelected'},
         {Name:'Direction',Menu:1,Items:'|RotateLeft|RotateRight|NoRotate|-|RotateLeftSelected|RotateRightSelected|NoRotateSelected|-|WrapOn|WrapOff|NoWrap|-|WrapOnSelected|WrapOffSelected|NoWrapSelected'}
      ]},











   ShowMenuSingle:"1",  // shows menu also with single option instead of doing it immediately 
   HideMenuUnused:"1",  // Hide unused child items, disable parent items with no child items 


   // Formula editing 
   FormulaEditing:"1",           // Permits formula editing; Uploads the formula in the cell value, not in EFormula attribute 
   FormulaChanges:"0",           // Does not mark values calculated by formula as Changed 
   FormulaType:"0",              // Does not calculate deleted, filtered and hidden rows and columns 
   DragEdit:"2",                 // Permits dragging during editing to choose cell ranges in formula 
   FormulaRelative:"1",          // Cell references can be absolute or relative. Cell references in formulas in data xml in/out are in standard notation 
   FormulaLocal:"0",             // Formula names in xml in/out are not localized English format 
   FormulaResults:"31",          // Cells with error formulas are marked red and error message is shown; the formula results are checked against cell restrictions; the null and NaN results are not permitted  
   FormulaCircular:"6",          // Circular cell references in formulas are restricted with error message 
   EditErrorsMessageTime:"1000", // How long the formula and edit error message will be shown 
   FormulaAddParenthesis:"1",    // Tries to adds ')' to the end of formula when editing resulted to incorrect formula 



   // Other settings often set in the sheets 
   Undo:"79",                    // Permits undoing all actions, including scroll 
   EnterMode:"1",                // Enter moves cursor down 
   FocusRect:"31",               // Permits focusing cell range, shows the corner, hides focused cursor for the whole row, shows relative color for focused cell, permits move and copy the focused range by dragging. 
   SelectingCells:"3",           // Permits selecting cells and row/columns independently 
   SelectingFocus:"1",           // Automatically selects the focused cells and clears all other selected cells on focus change 
   AutoFillType:"31",            // Permits auto filling numbers and strings, also from one cell, shrinking range clears the rest 






   // Dynamic format 
   DynamicFormat:"2",  // Permits changing cell type and format dynamically and also sets the type and format dynamically according to the cell value 
   AutoCalendar:"1",  // Does not show date button for Date type, but shows calendar when editing date cell 

   // Dynamic style 
   DynamicStyle:"1",  // Permits to set and change the style attributes for individual cells 

   // Settings for cell span, borders and mass changes 
   EditAttrs:",EFormula,Type,Format,EditFormat,CanEdit,Span,RowSpan,BorderTop,BorderRight,BorderBottom,BorderLeft,Wrap,Align,VAlign,Rotate,Color,TextColor,TextStyle,TextSize,TextFont,TextShadow,TextShadowColor",  // What will be affected by mass change like clear or move focus; the first empty item means value 
   DynamicSpan:"2",  // Permits dynamic spanning and splitting spanned cells 
   DynamicBorder:"1",  // Permits dynamic change of cell borders, only for variable rows and middle columns 
   SpannedBorder:"3",  // Update border in spanned cells to better displayed 
   BorderType:"0",  // Set borders only in visible, not deleted cells 
   SelectHidden:"0",  // Select only visible, not deleted cells 
   MoveFocusType:"11",  // Ignore span in cells when moving focused range by dragging 

   // Settings for copying and pasting cells via clipboard 
   CopyCols:"0",  // Copy only focused cells 
   ExcludeClear:"1",  // CtrlX clears the copied cells 
   PasteCols:"5",  // Pastes to focused cell range or to focused and next columns
   PasteFocused:"11"  // Pastes to focused cell range or to focused and next rows 
   }, // Cfg

DefCols: { // Default width and other settings of all column
   Auto: { Width:"90", CanPrint:"3", CanExport:"2", VarHeight:"1", FormulaSuggest:"6" }                       // FormulaSuggest generates suggest list of all available formula functions to use in formula editing 
   },

// The fixed rows and column - panels, indexes and ids 
Head: [
   { Kind:"Header", id:"Header", Index:"Index", Align:"Center", idVisible:"0", CanHide:"1", CanExport:"0", MenuName:"Column indexes (top)" } ,  // Centers all cells in header 
   { Kind:"Panel", id:"Panel", Panel:"Panel", PanelType:"Text", idVisible:"0",  // Adds panel for columns 
      Index:"ColSelectAll,ColDeleteAll,ColCopyAll",  // Defines group column actions for the left index panel 
      OnClickPanelColDelete:"ShowMenu OR ShowNoMenu", PanelColDeleteMenu:"|ShowColLeft|ShowColRight|HideCol|-|DeleteCol|UndeleteCol|-|RemoveCol",  // Defines menu for the column delete button 
      OnClickPanelColDeleteAll:"ShowMenu OR ShowNoMenu", PanelColDeleteAllMenu:"|ShowColsF|ShowAllCols|HideColsF|HideSelectedColsF|-|DeleteColsF|UndeleteColsF|DeleteSelectedColsF|UndeleteSelectedColsF|-|RemoveColsF|RemoveSelectedColsF" }  // Defines menu for the column delete all button 
   ],

// Bottom fixed row - ids
Foot: [
   { id:"ID", Index:" ", PanelType:"Text", Panel:"Name", ShowColNames:"1", CanFocus:"0", CanExport:"0", MenuName:"Column names (bottom)" }  // Informational bottom row with column names 
   ],

// Left fixed columns - index and panel
LeftCols: [
   { Name:"Index", Def:"Index", Width:"60", Resizing:"1", NoUpload:"1", CanExport:"0", MenuName:"Row indexes (left)" }, // Defines with of the Index column and lets resizing rows by it 
   { Name:"Panel", Type:"Panel", Copy:"1", Move:"1", // Places the panel right side to Index and shows add/copy and move buttons on it 
      OnClickPanelDelete:"ShowMenu OR ShowNoMenu", PanelDeleteMenu:"|ShowRowAbove|ShowRowBelow|HideRow|-|DeleteRow|UndeleteRow|-|RemoveRow",  // Defines menu for the row delete button 
      OnClickPanelDeleteAll:"ShowMenu OR ShowNoMenu", PanelDeleteAllMenu:"|ShowRowsF|ShowAllRows|HideRowsF|HideSelectedRowsF|-|DeleteRowsF|UndeleteRowsF|DeleteSelectedF|UndeleteSelectedF|-|RemoveRowsF|RemoveSelectedF" }  // Defines menu for the row delete all button 
   ],

// Right fixed columns - ids
RightCols: [
    { Name:"id", Width:"50", CanFocus:"0", CanSelect:"0", CanDelete:"0", MenuName:"Row ids (right)", CanExport:"0", Align:"Center" }  // Informational right column with row ids 
   ],

// Bottom toolbars
Solid: [

   // Main toolbar 
   {  id:"Toolbar", Cells05:"Win",
      WinType:"Bool", WinLabelRight:"Window scroll", WinCanEdit:"1", WinFormula:"Grid.NoVScroll?1:0", WinTip:"Disable grid scrollbars and use page scrollbars", WinCanPrint:"0",  // Adds cell Window Scroll
      WinOnChange:"Grid.NoVScroll = Value; Grid.NoHScroll = Value; if(!Value) { Grid.MainTag.style.width='100%'; Grid.MainTag.style.height='500px'; } ChangeLayout(Grid,Value); Grid.Update();",

      CanHide:"1",  // Permits showing and hiding bottom toolbar from popup menu 
      Space:"0" },    // Moves the toolbar to top 

   // Two smaller ones 
   { id:"Toolbar1", Kind:"Toolbar1", Mirror:"Toolbar", Cells40Sheet:"", Visible:"0", CanHide:"0" },
   { id:"Toolbar2", Kind:"Toolbar2", Mirror:"Toolbar", Cells05:"", Cells20Data:"", Cells30Manipulate:"", Cells60Cfg:"", Cells70Styles:"", Visible:"0", CanHide:"0" }

   ], // Solid

Media: [
   // Splits the toolbar for smaller displays 
   {  MaxWidth:"1650", 
      Rows: [
         { id:"Toolbar", Visible:"0", CanHide:"0" },
         { id:"Toolbar1", Visible:"1", CanHide:"1" },
         { id:"Toolbar2", Visible:"1", CanHide:"1" }
         ]
      },

   // Updates the custom colors of bottom row with column names and right column with row ids for various styles
   { Style:"TB", 
      Rows: [
         { id:"ID", Color:"#292C33" }
         ],
         Cols:[
            { Name:"id", Color:"#292C33"}
         ]
      },
   { Style:"TW",
      Rows: [
         { id:"ID", Color:"#F4F4F4", PanelColor:"#F4F4F4", idColor:"#F4F4F4" }
         ],
      Cols: [
         { Name:"id", Color:"#F4F4F4" }
         ]
      },
   { Style:"TM",
      Rows: [
         { id:"ID", Color:"#2196F3", TextColor:"White", IndexColor:"#2196F3", PanelColor:"#2196F3", PanelTextColor:"White", idColor:"#2196F3" }
         ],
      Cols: [
         { Name:"id", Color:"#2196F3", TextColor:"White" }
         ]
      }
   ],

//  Translations of example control texts to other languages
Languages: [
   { Code:'-EN', Layout_Jsonp:'SheetJsonLang.js' }
   ],

Pager: { Visible:"0" },             // Hides the side pager that is shown for paging by default 

// Custom item names for cell popup menu to manipulate rows and columns
Lang: {
   MenuCell: {
      ShowHeader:"Show header", HideHeader:"Hide header",
      ShowPanelRow:"Show panel", HidePanelRow:"Hide panel",
      ShowNames:"Show names", HideNames:"Hide names",
      ShowToolbar:"Show toolbar", HideToolbar:"Hide toolbar",
      ShowIndex:"Show index", HideIndex:"Hide index",
      ShowPanel:"Show panel", HidePanel:"Hide panel",
      ShowIds:"Show ids", HideIds:"Hide ids"
      },
   MenuColumns: { 
      ColsCaption:"Print headers"   // Renames the Choose columns caption, because there is only one column and one row 
      }
   }, // Lang

Actions: { 
   OnRightClick:"ShowPopupMenu OR ShowNoMenu",  // Shows the popup menu for any right click to the grid 
   OnDragHeader:"ChooseColsReplaceAll OR ColMoveSelected OR ColMove", OnCtrlDragHeader:"ChooseColsInsert OR ColCopySelected OR ColCopy",  // Dragging header during formula edit will choose the columns to the range 
   OnDel:"ClearSelectedCellsF OR ClearCellF"   // Clears the selected cells 
   },

// Print menu
MenuPrint: { HideUnused:"2", Items:"ColsCaption,Cols,Head,Foot,OptionsCaption,Options,SizeCaption,Size" },  // Hides all columns and rows from print menu, because they are always exported 

// Export menu
MenuExport: { HideUnused:"2" }  // Hides all columns and rows from export menu, because they are always exported 

}) // End of JSONP header