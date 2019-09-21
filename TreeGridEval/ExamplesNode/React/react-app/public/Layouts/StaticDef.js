/*
 * @Descripttion:
 * @version:
 * @Author:
 * @Date: 2019-05-14 09:54:22
 * @LastEditors:
 * @LastEditTime: 2019-08-26 17:17:45
 */
{
Cfg : {
   CfgId:"Static", //  Grid identification for saving configuration to cookies 用于将配置保存到cookie的网格标识
   PrintLoad:"1", PrintCols:"2", PrintLocation:"3", PrintPageBreaks:"1", PrintRows:"50", // Printing options, download all rows for printing 打印选项，下载用于打印的所有行
   Paging:'2', ChildPaging:'2', // Both paging set to server 两个分页都设置为server
   ChildPageLength:"20", // Server paging for child pages, splits children to given number of rows and loads them separately when they become visible due scroll 服务器为子页面分页，将子页面分割为给定的行数，并在由于滚动而变得可见时分别加载它们
   SaveSession:'1', // Stores IO Session to cookies to identify the client on server and access appropriate grid instance 将IO会话存储到cookie中，以便在服务器上标识客户机并访问适当的网格实例
   Prepared:'1', // DLL sends data prepared, so you can set this attribute to speed up loading  DLL发送准备好的数据，因此可以设置此属性来加速加载
   ShowDeleted:'0', // This example hides deleted row instead of coloring them red 这个例子隐藏了删除的行，而不是将它们涂成红色
   MaxHeight:'1', // Grid maximizes height of the main tag on page 网格最大化页面上主标记的高度
   LimitScroll:"23", MinBodyRows:"6",  // Responsive design, for small windows sets NoVScroll and NoHScroll 响应式设计，适用于小窗口集NoVScroll和NoHScroll
   Sort:'P,M', // To sort grid according to partner and Month for first time (when no configuration saved) 第一次根据合作伙伴和月份对网格进行排序(当没有保存配置时)
   MaxGroupLength:'0', // Suppresses dividing rows to more groups when grouping because it is controlled by MaxChildren of all rows 在分组时，禁止将行划分为多个组，因为它由所有行的MaxChildren控制
   Group:'P', // To group grid by partner for first time (when no configuration saved) 首次按合作伙伴对网格进行分组(当没有保存配置时)
   GroupRestoreSort:'1', // Restores sorting state after grouping that was before grouping 恢复分组后的排序状态
   GroupSortMain:'1', // When grouping always sorts according to main column ascending 分组时，总是根据主列升序进行排序
   Adding:'0' , // Suppress adding new rows when grid is not grouped 当网格未分组时，禁止添加新行
   FilterEmpty:'1', // When filtering, hides group rows that have all children hidden, see the Group row have set CanFilter:'2' 过滤时，隐藏具有所有子元素的组行，见组行已设置CanFilter:'2'
   IndexEnum:'1', // All enums are set by index 所有枚举都是按索引设置的
   NameCol:'P', // Row will be identifies by Partner name in messages (e.g. in deleting rows) 行将通过消息中的合作伙伴名称来标识(例如，在删除行时)
   ExportFormat:'XLS' // Predefined export format is XLS, because XLSX is not supported by the DLL 预定义的导出格式是XLS，因为DLL不支持XLSX
   },
Actions: {
   OnUngroup:'Grid.Adding=0;',  // Suppress adding new rows when grid is not grouped 当网格未分组时，禁止添加新行
   OnRightClickCell:'Grid.Component.showCustomMenu(Row,Col)' // Custom event handler, shows the calling method of the framework component; Shows some custom popup menu on right click to any cell 自定义事件处理程序，显示框架组件的调用方法;向任何单元格右键单击，显示一些自定义弹出菜单
   },
Lang: {
   MenuExport: { ExportFormats:'XLS,CSV' },   // Listed only XLS and CSV, because XLSX is not supported by the DLL 只列出了XLS和CSV，因为DLL不支持XLSX
   Alert: { ErrAdd:'Cannot add new partner here!' } // Changes text of adding error message 更改添加错误消息的文本
   },
Root: { AcceptDef:'' }, // By default (when no grouping is active) rows cannot be added or moved 默认情况下(当没有分组活动时)不能添加或移动行

Def: {
   // Base row settings,  AcceptDef='' means that no rows can be added or moved to children of the row 基本行设置AcceptDef= "意味着不能向该行的子行添加或移动任何行
   R: { AcceptDef:'', CanEdit:'0', OCanEdit:'1', ICanEdit:'1', ECanEdit:'1', CalcOrder:'G,D,F' },

   // Base group setting - for group row created when grouping 基本组设置-用于分组时创建的组行
   // It also inherits attributes from group row defined in Defaults.xml 它还从default .xml中定义的组行继承属性
   // CanFilter='2' means that this row will be hidden when it does not have any visible children when filtering, see Cfg FilterEmpty CanFilter='2'表示这一行在过滤时没有任何可见的子元素时将被隐藏，请参见Cfg FilterEmpty
   // Action suppresses adding new rows when grid is grouped by another column than Partner 当网格按合作伙伴以外的另一列分组时，Action禁止添加新行

   Group: {
      CanFilter:'2', Calculated:'1', CalcOrder:'O,I,E,G,D,F,B', OCanEdit:'0', ICanEdit:'0', ECanEdit:'0',
      OFormula:'sum()', IFormula:'sum()', EFormula:'sum()', GFormula:'sum()', DFormula:'sum()', FFormula:'sum()',
      OnGroup:'Grid.Adding=0;' },

   // Group row created when grouping by partner (set by GroupCol attribute) 按合作伙伴分组时创建的组行(由GroupCol属性设置)
   // GroupCols tells that this default row is used only when grid is grouped by Region, Country, State, Partner in that order GroupCols告诉我们，只有按区域、国家、州和合作伙伴的顺序对网格进行分组时，才使用此默认行
   // GroupMain tells to show grouped tree in Month column GroupMain告诉在Month列中显示分组树
   // This default is specific to this example and is used to edit all cells specific to Partner. 此默认值是特定于此示例的，用于编辑特定于Partner的所有单元格。
   // EditCols controls editing and bubbling changes to children. EditCols控制对子对象的编辑和冒泡更改。
   // This is the only row in this example that can be deleted, moved or added. 这是本例中惟一可以删除、移动或添加的行。
   // The children of this default are automatically created when this row added as new row (12 months). 当这一行添加为新行(12个月)时，将自动创建此默认值的子行。
   // ParentAcceptDef sets AcceptDef attribute of the parent row to let adding and moving this row ParentAcceptDef设置父行的AcceptDef属性，允许添加和移动这一行
   GroupPartner : {
      Def:'Group', GroupCol:'P', GroupCols:'|P|R,P|C,P|S,P|R,C,P|R,S,P|C,S,P|R,C,S,P', GroupMain:'M', GroupMainCaption:'Partner / Month',
      EditCols:'Main,R,C,S,X,N,A,B', CanDelete:'1', CanDrag:'1',
      OnGroup:'Grid.Adding=1;',
      P:'New partner', M:'New partner', MType:'Text', ParentAcceptDef:'GroupPartner', AcceptDef:'R',
      Items: [
         { M:'0' },
         { M:'1' },
         { M:'2' },
         { M:'3' },
         { M:'4' },
         { M:'5' },
         { M:'6' },
         { M:'7' },
         { M:'8' },
         { M:'9' },
         { M:'10' },
         { M:'11' }
         ]
      },

   // Group row created when grouping by Region or Country or State 按区域、国家或州分组时创建的组行
   // GroupCols tells that this default row is used only when grid is grouped by Region, Country, State, Partner in that order GroupCols告诉我们，只有按区域、国家、州和合作伙伴的顺序对网格进行分组时，才使用此默认行
   // EditCols and .CopyTo attributes controls editing and bubbling changes to children. EditCols和. copyto属性控制对子对象的编辑和冒泡更改。
   GroupLocPartner: {
      Def:'Group', GroupCol:'R,C,S', GroupCols:'|P|R,P|C,P|S,P|R,C,P|R,S,P|C,S,P|R,C,S,P|', GroupMain:'M', GroupMainCaption:'Location / Partner / Month',
      EditCols:'Main', RCopyTo:'Children,R', CCopyTo:'Children,C', SCopyTo:'Children,S',
      XVisible:'0', NVisible:'0', AVisible:'0', BVisible:'0'
      },

   // Group row created when grouping by Region or Country or State 按区域、国家或州分组时创建的组行
   // GroupCols tells that this default row is used only when grid is grouped by Region, Country, State (without Partner!) in that order GroupCols告诉我们，只有当网格按照区域、国家、州(没有合作伙伴!)的顺序分组时，才使用此默认行
   // GroupMain tells to show grouped tree in Partner column  告诉在合作伙伴列中显示分组树
   // This default inherits attributes from GroupLocPartner and just changes some. 这个默认值继承了GroupLocPartner的属性，只修改了一些。
   GroupLoc: {
      Def:'GroupLocPartner', GroupCol:'R,C,S', GroupCols:'|R|C|S|R,C|R,S|C,S|R,C,S', GroupMain:'P', GroupMainCaption:'Location / Partner',
      MVisible:'0'
      },

   // Group row created for all other conditions than fulfilled by previous group rows. 为以前的组行不能满足的所有其他条件创建的组行。
   // It does not provide editing capabilities 它不提供编辑功能
   // It is usual grouping row defined in applications 它通常是应用程序中定义的分组行
   GroupOther: {
      Def:'Group', GroupMain:'P',
      MVisible:'0', RVisible:'0', CVisible:'0', SVisible:'0',
      XVisible:'0', NVisible:'0', AVisible:'0', BVisible:'0'
      }
   },

LeftCols: [

   // Partner, main column for other groupings, width 130px, when grouped 200px 伙伴，其他分组的主列，当分组为200px时，宽度为130px
   // Shows value as tooltip  将值显示为工具提示
   // Is in one group with Month because of spanned fixed row - cannot be moved outside the group 由于跨行固定-无法移动到组外，因此与月同组
   { Name:'P', Width:'130', GroupWidth:'210', Type:'Text', ToolTip:'1', Group:'1' },

   // Month, main column for grouping by partner, width 80px, when grouped 200px 月，按合作伙伴分组的主列，宽度为80px，分组时为200px
   { Name:'M', Width:'80', GroupWidth:'210', Type:'Enum', Group:'1', Enum:'|01/2004|02/2004|03/2004|04/2004|05/2004|06/2004|07/2004|08/2004|09/2004|10/2004|11/2004|12/2004' }

   ],

Cols: [

   // Region 地区
   { Name:'R', Width:'180', Type:'Enum', Refresh:'C,S', Group:'1',
     Enum:'|Central & South Asia|East Asia & the Pacific|East Europe|Middle East & North Africa|North & Central America|South America|Sub-Saharan Africa|West Europe'
     },

   // Country 国家
   //  The 'C' column is related to 'R' column, it contains only countries from selected region “C”列与“R”列相关，它只包含所选区域的国家
   { Name:'C', Width:'130', Type:'Enum', Related:'R', Refresh:'S', Group:'1', IntFormat:'(unknown)',
     Enum0:"|ARMENIA|AZERBAIJAN|BANGLADESH|INDIA|KAZAKSTAN|PAKISTAN|SRI LANKA",
     Enum1:"|AUSTRALIA|BRUNEI|CHINA|HONG KONG|INDONESIA|JAPAN|KOREA, DPR|MALAYSIA|MONGOLIA|MYANMAR|NEW ZEALAND|PAPUA NEW GUINEA|PHILIPPINES|SINGAPORE|SOUTH KOREA|TAIWAN|THAILAND|VIETNAM",
     Enum2:"|ALBANIA|BELARUS|BULGARIA|CROATIA|CZECH REPUBLIC|ESTONIA|HUNGARY|LATVIA|LITHUANIA|MOLDOVA|POLAND|ROMANIA|RUSSIA|SERBIA-MONTENEGRO|SLOVAK REPUBLIC|SLOVENIA|UKRAINE",
     Enum3:"|ALGERIA|BAHRAIN|EGYPT|IRAN|IRAQ|ISRAEL|JORDAN|KUWAIT|LEBANON|LIBYA|MOROCCO|OMAN|QATAR|SAUDI ARABIA|SYRIA|TUNISIA|UAE|YEMEN",
     Enum4:"|BAHAMAS|CANADA|COSTA RICA|CUBA|DOMINICAN REPUBLIC|EL SALVADOR|GUATEMALA|HAITI|HONDURAS|JAMAICA|MEXICO|NICARAGUA|PANAMA|TRINIDAD & TOBAGO|UNITED STATES",
     Enum5:"|ARGENTINA|BOLIVIA|BRAZIL|CHILE|COLOMBIA|ECUADOR|GUYANA|PARAGUAY|PERU|SURINAME|URUGUAY|VENEZUELA",
     Enum6:"|ANGOLA|BOTSWANA|BURKINA FASO|CAMEROON|CONGO|CONGO DR|COTE D'IVOIRE|ETHIOPIA|GABON|GAMBIA|GHANA|GUINEA|GUINEA-BISSAU|KENYA|LIBERIA|MADAGASCAR|MALAWI|MALI|MOZAMBIQUE|NAMIBIA|NIGER|NIGERIA|SENEGAL|SIERRA LEONE|SOMALIA|SOUTH AFRICA|SUDAN|TANZANIA|TOGO|UGANDA|ZAMBIA|ZIMBABWE",
     Enum7:"|AUSTRIA|BELGIUM|CYPRUS|DENMARK|FINLAND|FRANCE|GERMANY|GREECE|ICELAND|IRELAND|ITALY|LUXEMBOURG|MALTA|NETHERLANDS|NORWAY|PORTUGAL|SPAIN|SWEDEN|SWITZERLAND|TURKEY|UNITED KINGDOM",
     },

   // State
   // The 'S' column is related to 'C' column, it contains only states from selected country “S”列与“C”列相关，它只包含所选国家的州
   // If the country is not divided to states, it is empty and read-only 如果国家没有被划分为多个州，那么它就是空的、只读的
   // This column has set GroupType:16 - when grouping by State, it does not create groups for empty states 这个列设置了GroupType:16—当按状态分组时，它不会为空状态创建组
   { Name:'S', Width:'70', Type:'Enum', Related:'R,C', Group:'1', GroupEmpty:'0', IntFormat:'(unknown)',
     Enum4_14:"|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming"
     },

   { Name:'X', Width:'95', Type:'Bool', Format:'||x' }, // Registered 注册
   { Name:'N', Width:'105', Type:'Date', Format:'d' }, // Since 因为
   { Name:'A', Width:'80', Type:'Enum', Enum:'|week|month|quarter|half year|year' }, // Calls per
   { Name:'B', Width:'70', Type:'Int' }, // Rabat

   { Name:'O', Width:'70', Type:'Int' }, // Orders
   { Name:'I', Width:'90', Type:'Float', Format:',0.00' }, // Income
   { Name:'E', Width:'90', Type:'Float', Format:',0.00' }, // Expenses
   { Name:'G', Width:'100', Type:'Float', Format:',0.00', Formula:'I-E' }, // Gross profit
   { Name:'D', Width:'80', Type:'Float', Format:',0.00', Formula:'G>0?B*G/100:0' }, // Discount
   ],

 RightCols: [
   { Name:'F', Width:'90', Type:'Float', Format:',0.00', Formula:'G-D' } // Profit
   ],

// Column captions 列标题
Header: {
      R:'Region1',
      C:'Country2',
      S:'State3',
      P:'Partner4',
      M:'Month5',
      X:'Registered6',
      N:'Since7',
      A:'Calls per8',
      O:'Orders9',
      I:'Income10',
      E:'Expenses11',
      G:'Gross profit12',
      B:'Rabat13',
      D:'Discount14',
      F:'Profit15'
   },
Head : [
   // Filter row - to let user choose filter, changes filtering of area enums by selection only过滤器行-让用户选择过滤器，改变过滤区域枚举仅通过选择
   {
      Kind:'Filter',
      CanEdit:'1',
      PCaseSensitive:'0',
      RFilterOff:'(all)',
      RCanEmpty:'1',
      RShowMenu:'0',
      CFilterOff:'(all)',
      CCanEmpty:'1',
      CShowMenu:'0',
      SFilterOff:'(all)',
      SCanEmpty:'1',
      SShowMenu:'0'
      }
   ],
Foot: [
   // Bottom row with the summary results 下面一行是总结结果
   {
         id:'$Results',
         CanDelete:'0',
         CanEdit:'0',
         Calculated:'1',
         Spanned:'1',
         P:'Total results',
         PSpan:'2',
         RVisible:'0',
         CVisible:'0',
         SVisible:'0',
         XVisible:'0',
         AVisible:'0',
         CalcOrder:'O,I,E,G,D,F,B',
         BType:'Float',
         BFormat:'0.00"%"',
         BFormula:'G?D/G*100:0',
         OFormula:'sum()',
         IFormula:'sum()',
         EFormula:'sum()',
         GFormula:'sum()',
         DFormula:'sum()',
         FFormula:'sum()',
         OCanEdit:'0',
         ICanEdit:'0',
         ECanEdit:'0'
      }
   ],
Solid: [

   // Group row - to let user choose or build grouping 组行——让用户选择或构建分组
   { Kind:'Group', Cells:'Caption,List,Custom', Space:'0', MenuName:'Views',
      Caption:'Choose&nbsp;view:', CaptionWidth:'80', CaptionType:'Html', CaptionCanEdit:'0',
      ListHtmlPrefix:'<b>', ListHtmlPostfix:'</b>', ListWidth:'120',
      List:'|None|Partner|Location,&nbsp;Partner|Location|Month',
      Cols:'||P|R,C,S,P|R,C,S|M',
      ListCustom:'Other'
      },

   // Bottom simple pagers 底部简单寻呼机
   {
      Space:'4',
      Cells:'Pager,Pages',
      MenuName:'Bottom pager',
      CanPrint:'0',
      PagerType:'Pager',
      PagesLeft:'10',
      PagesType:'Pages',
      PagesRelWidth:'1',
      PagesCount:'10',
      PagesStep:'5'
      }
   ],
Toolbar: {
         Cells05:'Win',
         WinType:"Bool",
         WinLabelRight:"Window scroll",
         WinCanEdit:"1",
         WinFormula:"Grid.NoVScroll?1:0",
         WinTip:"Disable grid scrollbars and use page scrollbars",
         WinCanPrint:"0",
         WinOnChange:"Grid.NoVScroll : Value; Grid.NoHScroll : Value; if(!Value) { Grid.MainTag.style.width:''; Grid.MainTag.style.height:'900px'; } Grid.SetMaxHeight(!Value); Grid.Update();"
   },
 // Right side pager
Pager: {
     Width:'160',
     MenuName:'Right pager'
    },
}