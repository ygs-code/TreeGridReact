TreeGridLoaded ( // JSONP header, to be possible to load from xxx_Jsonp data source
   // Translations to other languages 
{
   // Brazilian Portuguese

   TextBR: [
      { Action:"Set", Row:'Barra de Ferramentas', WinLabelRight:'Rolagem da Janela', WinTip:'Desativar barras de rolagem da grade e usar barras de rolagem de página' },
      { Action:"Set", Row:'ID', Panel:'Painel', id:'ID', Index:'Índice' },
      { Action:"Set", Row:'Panel', Panel:'Painel' },
      { Action:"Set", Row:'Header', Index:'Índice' },
      { Action:"ReplaceText", Col:'Menu',
         Rows:'Linhas', Columns:'Colunas', Select:'Selecionar', Show:'Mostrar', Hide:'Esconder', Add:'Adicionar', Copy:'Copiar', Delete:'Apagar',
         Cells:'Células', Edit:'Editar', Clear:'Limpar', Format:'Formatar', Span:'Span', Border:'Borda', Style:'Estilo', Font:'Fonte', Color:'Cor', Shadow:'Sombra', Align:'Alinhamento', Direction:'Direção',
         header:'cabeçalho', panel:'painel', names:'nomes', toolbar:'barra de ferramentas', index:'índice', ids:'ids'
         },
      { Action:"Replace", Col:'MenuHead', Actions:'Ações' }
      ],
   Media: [
      { Language:'BR',
         Cfg: PrintPagePrefix="<;center class='%9' style='width:%7px'>Planilha de exemplo da página %3 até %6<;/center>", PrintPagePostfix:"<;center class='%9' style='width:%7px'>Página %1 horizontal de %4 , página %2 vertical de %5<;/center>"
         }
      ],


   // Czech

   TextCS: [
      { Action:"Set", Row:'Toolbar', WinLabelRight:'Posun okna', WinTip:'Neposunovat tabulku, ale celé okno' },
      { Action:"Set", Row:'ID', Panel:'Název', id:'ID' },
      { Action:"Set", Row:'Panel', Panel:'Panel'}, 
      { Action:"Set", Row:'Header', Index:'Index' },
      { Action:"ReplaceText", Col:'Menu',
         Rows:'Řádky', Columns:'Sloupce', Select:'Označit', Show:'Zobrazit', Hide:'Skrýt', Add:'Přidat', Copy:'Kopírovat', Delete:'Smazat',
         Cells:'Buňky', Edit:'Úpravy', Clear:'Vymazat', Format:'Formát', Span:'Sloučit', Border:'Okraje', Style:'Styl', Font:'Font', Color:'Barva', Shadow:'Stínování', Align:'Zarovnání', Direction:'Směr',
         header:'hlavičku', panel:'panel', names:'názvy', toolbar:'lištu', index:'index', ids:'id'
         },
      { Action:"Replace", Col:'MenuHead', Actions:'Akce' },
      ],
   Media: [
      { Language:'CS',
         Cfg: { PrintPagePrefix:"<center class='%9' style='width:%7px'>Příklad 'Sheet', stránka %3 z %6</center>", PrintPagePostfix:"<center class='%9' style='width:%7px'>Stránka %1 vodorovně z %4 , stránka %2 svisle z %5</center>" }
         }
      ],


   // Russian 

   TextRU: [
      { Action:"Set", Row:'Toolbar', WinLabelRight:'Прокрутка окна', WinTip:'Отключить полосы прокрутки сетки и использовать полосы прокрутки страницы' },
      { Action:"Set", Row:'ID', Panel:'Панель', id:'ИД' },
      { Action:"Set", Row:'Panel', Panel:'Панель' },
      { Action:"Set", Row:'Header', Index:'Индекс' },
      { Action:"ReplaceText", Col:'Menu',
         Rows:'Строки', Columns:'Столбцы', Select:'Выбрать', Show:'Показать', Hide:'Скрыть', Add:'Добавить', Copy:'Копировать', Delete:'Удалить',
         Cells:'Клетки', Edit:'Редактировать', Clear:'Очистить ', Format:'Формат', Span:'Объединить', Border:'Граница', Style:'Стиль', Font:'Шрифт', Color:'Цвэт', Shadow:'Тень', Align:'Выровнять', Direction:'Направление',
         header:'Колонтитул', panel:'Панель', names:'Названия', toolbar:'Панель инструментов', index:'Индекс', ids:'ид'
         },
      { Action:"Replace", Col:'MenuHead', Actions:'Операции' },
      ],
   Media: [
      { Language:'RU',
         Cfg: { PrintPagePrefix:"<center class='%9' style='width:%7px'>Пример печатной страницы листа %3 из %6</center>", PrintPagePostfix:"<center class='%9' style='width:%7px'>Страница %1 по горизонтали от %4, страница% 2 по вертикали от %5</center>" }
         }
      ],

   // Japanese 

   TextJP: [
      { Action:"Set", Row:'Toolbar', WinLabelRight:'ウィンドウ スクロール', WinTip:'グリッドのスクロール バーを無効にしてページのスクロール バーを使用します。' },
      { Action:"Set", Row:'ID', Panel:'パネル', id:'ID' },
      { Action:"Set", Row:'Panel', Panel:'パネル' },
      { Action:"Set", Row:'Header', Index:'インデックス' },
      { Action:"ReplaceText", Col:'Menu',
         Rows:'行', Columns:'列', Select:'選択', Show:'表示', Hide:'非表示', Add:'追加', Copy:'コピー', Delete:'削除',
         Cells:'セル', Edit:'編集', Clear:'クリア', Format:'書式', Span:'スパン', Border:'罫線', Style:'スタイル', Font:'フォント', Color:'色', Shadow:'影', Align:'配置', Direction:'方向',
         header:'ヘッダー', panel:'パネル', names:'名前', toolbar:'ツール バー', index:'索引', ids:'ID'
         },
      { Action:"Replace", Col:'MenuHead', Actions:'操作' },
      ],
   Media: [
      { Language:'JP',
         Cfg: { PrintPagePrefix:"<center class='%9' style='width:%7px'>%6 からのシート サンプル印刷ページ %3</center>", PrintPagePostfix:"<center class='%9' style='width:%7px'>%4 から水平方向にページ %1、%5 から垂直方向にページ %2</center>" }
         }
      ],


   // Persian 

   TextFA: [
      { Action:"Set", Row:'Toolbar', WinLabelRight:'اسكرول', WinTip:'غير فعال سازي اسكرول و فعال سازي اسكرول صفحه<br>در این حالت غیر فعال میشود چون راست به چپ نیازمند راست به چپ شدن کل صفحه میباشد' },
      { Action:"Set", Row:'ID', Panel:'پانل', id:'رديف' },
      { Action:"Set", Row:'Panel', Panel:'پانل' },
      { Action:"Set", Row:'Header', Index:'شاخص' },
      { Action:"ReplaceText", Col:'Menu',
         Rows:'رديف', Columns:'ستون', Select:'انتخاب', Show:'نمايش', Hide:'مخفي', Add:'ايجاد', Copy:'كپي', Delete:'حذف',
         Cells:'سلول', Edit:'ويرايش', Clear:'پاك', Format:'فرمت', Span:'جدا سازي', Border:'حاشيه', Style:'استايل', Font:'فونت', Color:'رنگ', Shadow:'سايه', Align:'تراز', Direction:'جهت',
         header:'عنوان', panel:'پانل', names:'نام', toolbar:'نوار ابزار', index:'شاخص', ids:'رديف'
         },
      { Action:"Replace", Col:'MenuHead', Actions:'عمليات' },
      ],
   Media: [
      { Language:'FA',
         Cfg: { PrintPagePostfix:"<center style='width:%7px'>صفحه %1 افقي از %4 , صفحه %2 عمودي  از %5</center>", PrintPagePrefix:"<center style='width:%7px'>صفحه %3 از %6</center>" },
         Rows: [
            { id:"Toolbar", WinCanEdit:"0" }
            ]
         }
      ],


   // Framework for translations, English to English 
   // To use it, rename the XX to your language code and add the language code also to the ...Def.xml to Languages Code and translate the texts !...! 
   // Optionally extend Media tag (with Language set to your language code) to change sizes of cells and columns if translated text have different widths 

   TextXX: [
      { Action:"Set", Row:'Toolbar', WinLabelRight:'!Window scroll!', WinTip:'!Disable grid scrollbars and use page scrollbars!' },
      { Action:"Set", Row:'ID', Panel:'!Panel!', id:'!ID!' },
      { Action:"Set", Row:'Panel', Panel:'!Panel!' },
      { Action:"Set", Row:'Header', Index:'!Index!' },
      { Action:"ReplaceText", Col:'Menu',
         Rows:'!Rows!', Columns:'!Columns!', Select:'!Select!', Show:'!Show!', Hide:'!Hide!', Add:'!Add!', Copy:'!Copy!', Delete:'!Delete!',
         Cells:'!Cells!' ,Edit:'!Edit!', Clear:'!Clear!', Format:'!Format!', Span:'!Span!', Border:'!Border!', Style:'!Style!', Font:'!Font!', Color:'!Color!', Shadow:'!Shadow!', Align:'!Align!', Direction:'!Direction!',
         header:'!header!', panel:'!panel!', names:'!names!', toolbar:'!toolbar!', index:'!index!', ids:'!ids!'
         },
      { Action:"Replace", Col:'MenuHead', Actions:'!Actions!' }
      ],
   Media: [
      { Language:'XX',
         Cfg: { PrintPagePrefix:"!<center class='%9' style='width:%7px'>Sheet example printed page %3 from %6</center>!", PrintPagePostfix:"!<center class='%9' style='width:%7px'>Page %1 horizontally from %4 , page %2 vertically from %5</center>!" }
         }
      ]
   }
);