﻿var Ht_rptType = "";
var Ht_rptId = ""; 
var ExeclName = "";
var MsrReport_loadmsring = "0"; 

//保存模板
function HtmnuFileSave_click() {
    $.post("/Report/HtmnuFileSave", {
        RptId: Ht_rptId,
        rptType:Ht_rptType,
        random: Math.random()
    }, function (result, status) {
        if (status == "success") {
            alert("保存成功");
        }
    }); 
}  

//打印预览
function HtmnuFilePrintPreview_click() {
    var sheetCount = spread.sheets.length; //总表页数
    var selectWorksheetsPageID = spread.getActiveSheetIndex();//当前活动表页
    if (sheetCount > 1) {
        selectWorksheetsPageID = confirm("当前表页有多页，点击确定预览当前页，点击取消预览全部页") ? selectWorksheetsPageID : -1;
    }
    if (MsrReport_loadmsring == 1) {
        $.messager.alert("提示", "数据正在加载中!!", "info"); return;
    } 
    MsrReport_loadmsring = 1;
    $.post("/Report/DownloadPdf", {
        sheetsPageID: selectWorksheetsPageID,
        Ex_Name: ExeclName,
        RptId: Ht_rptId, 
        random: Math.random()
    }, function (result, status) {
        if (status == "success") {
            MsrReport_loadmsring = 0;
            window.open(result);
        }
        else {
            MsrReport_loadmsring = 0;
            alert("请稍后预览");
        }
    });
}
//模板-打印预览
function HtmnuFilePrintPreview_MB() {
    if (MsrReport_loadmsring == 1) {
        $.messager.alert("提示", "数据正在加载中!!", "info"); return;
    }
    MsrReport_loadmsring = 1;
    $.post("/Report/DownloadPdf", {
        sheetsPageID: selectWorksheetsPageID,
        Ex_Name: "",
        RptId: Ht_rptId,
        random: Math.random()
    }, function (result, status) {
        if (status == "success") {
            MsrReport_loadmsring = 0;
            window.open(result);
        }
        else {
            MsrReport_loadmsring = 0;
            alert("请稍后预览");
        }
    });
}

//导入Excel文件
function HtmnuFileImportExcel_click() {
    return $("#ReportTemplat_execlCheck").click();
}
function HtmnuFileImportExcel_click1(input) {
    var oFReader = new FileReader(); 
    var fd = new FormData();
    fd.append("fileToUpload", document.getElementById('ReportTemplat_execlCheck').files[0]); //这是获取上传的文件
    $.ajax({
        url: "/Report/mnuFileImportExcel?RptId=" + Ht_rptId + "&r=" + Math.random(),
        type: "POST",
        data: fd,
        processData: false,  // 不处理数据
        contentType: false,   // 不设置内容类型
        success: function (result, status) {
            document.getElementById('ReportTemplat_execlCheck').value = '';            
            if (status == "success") {
                var _tempJson = JSON.parse(result);
                selectWorksheetsPageID = 0;
                var fileType = ""; //指定mime
                var myFile = createFile(_tempJson.Data, fileType);
                excelIo.open(myFile, function (json) {
                    var workbookObj = json;
                    spread.fromJSON(workbookObj);
                }, function (e) {

                });
            } else $.messager.alert("提示", "数据加载失败", "info");
           
        }
    }); 
}
//导出Excel文件
function HtFileExportExcel_click() {
    if (ExeclName != '') window.open('/upload/cache/' + ExeclName);
    else {
        $.post("/Report/DownloadFileExportExcel", {
            sheetsPageID: selectWorksheetsPageID,
            RptId:Ht_rptId,
            random: Math.random()
        }, function (result, status) {
            if (status == "success") {
                window.open(result);
            }
        }); 
    }
}
//导出Excel文件
function HtFileExportExcelx_click() {
    if (ExeclName != '') {
        $.post("/Report/DownloadFileExportExcelx", {
            filenamex: ExeclName,
            random: Math.random()
        }, function (result, status) {
            if (status == "success") window.open(result);
        });
    }
    else {
        alert("导出excel失败");
    }
}

//导出Excel文件
function HtFileExportExcelMb_click() {
    $.post("/Report/DownloadFileExportExcel", {
        sheetsPageID: selectWorksheetsPageID,
        RptId: Ht_rptId,
        random: Math.random()
    }, function (result, status) {
        if (status == "success") {
            window.open(result);
        }
    });
}

function createFile(urlData, fileType) {
    var bytes = window.atob(urlData),
         n = bytes.length,
         u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bytes.charCodeAt(n);
    }
    return new Blob([u8arr], { type: fileType });
}

function initSpread(spread) {
    var spreadNS = GC.Spread.Sheets;   
    spreadNS.AutoResize = true;

    spread.bind(spreadNS.Events.EditEnded, function (e, args) {
        var selectWorksheetsPageID = spread.getActiveSheetIndex(); //当前活动表页
        $.post("/Report/ChangeStyle_data", {
            sheetsPageID: selectWorksheetsPageID,
            Ex_Name: ExeclName,
            RptId: Ht_rptId,
            Content: args.editingText,
            Startcol: args.col,
            Startrow: args.row,
            random: Math.random()
        }, function (result, status) {
            if (result == "success") {

            }
        });
    });
    spread.bind(spreadNS.Events.ColumnWidthChanged, function (e, args) {
        var selectWorksheetsPageID = spread.getActiveSheetIndex(); //当前活动表页
        var sheet = spread.getActiveSheet(); 
        for (var i = 0; i < args.colList.length; i++) { 
            var selectcol = args.colList[i];
            var selectcolwidth = sheet.getColumnWidth(selectcol); 
            $.post("/Report/UpdateExeclResize_data", {
                sheetsPageID: selectWorksheetsPageID,
                Ex_Name: ExeclName,
                RptId: Ht_rptId,
                width: selectcolwidth,
                styleType: "Column",
                col: selectcol,
                random: Math.random()
            }, function (result, status) {
                if (result == "success") {

                }
            });
        }
    });
    spread.bind(spreadNS.Events.RowHeightChanged, function (e, args) {
        var sheet = spread.getActiveSheet();
        var selectWorksheetsPageID = spread.getActiveSheetIndex(); //当前活动表页
        for (var i = 0; i < args.rowList.length; i++) {
            var selectrow = args.rowList[i];
            var selectRowHeight =  sheet.getRowHeight(selectrow); 
            $.post("/Report/UpdateExeclResize_data", {
                sheetsPageID: selectWorksheetsPageID,
                Ex_Name: ExeclName,
                RptId: Ht_rptId,
                width: selectRowHeight,
                styleType: "Row",
                col: selectrow,
                random: Math.random()
            }, function (result, status) {
                if (result == "success") {
                }
            });
        }
    }); 

//    spread.bind(spreadNS.Events.ActiveSheetChanged, function (e, args) {
//        $("#showSpreadEvents").val(
//                'SpreadEvent: ' + GC.Spread.Sheets.Events.ActiveSheetChanged + ' event called' + '\n' +
//                'oldSheetName: ' + args.oldSheet.name() + '\n' +
//                'newSheetName: ' + args.newSheet.name()
//            )
//    });
//    spread.bind(spreadNS.Events.CellClick, function (e, args) {
//        var sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
//        $("#showSpreadEvents").val(
//                'SpreadEvent: ' + GC.Spread.Sheets.Events.CellClick + ' event called' + '\n' +
//                'sheetArea: ' + sheetArea + '\n' +
//                'row: ' + args.row + '\n' +
//                'col: ' + args.col
//            )
//    });

//    spread.bind(spreadNS.Events.SelectionChanging, function (e, args) {
//        var selection = args.newSelections.pop();
//        var sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
//        $("#showSpreadEvents").val(
//                'SpreadEvent: ' + GC.Spread.Sheets.Events.SelectionChanging + ' event called' + '\n' +
//                'sheetArea: ' + sheetArea + '\n' +
//                'row: ' + selection.row + '\n' +
//                'column: ' + selection.col + '\n' +
//                'rowCount: ' + selection.rowCount + '\n' +
//                'colCount: ' + selection.colCount
//            )
//    });
//    spread.bind(spreadNS.Events.SelectionChanged, function (e, args) {
//        var selection = args.newSelections.pop();
//        if (selection.rowCount > 1 && selection.colCount > 1) {
//            var sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
//            $("#showSpreadEvents").val(
//                'SpreadEvent: ' + GC.Spread.Sheets.Events.SelectionChanged + ' event called' + '\n' +
//                'sheetArea: ' + sheetArea + '\n' +
//                'row: ' + selection.row + '\n' +
//                'column: ' + selection.col + '\n' +
//                'rowCount: ' + selection.rowCount + '\n' +
//                'colCount: ' + selection.colCount
//            )
//        } 
//    });
//    spread.bind(spreadNS.Events.EditStarting, function (e, args) {
//        $("#showSpreadEvents").val(
//                'SpreadEvent: ' + GC.Spread.Sheets.Events.EditStarting + ' event called' + '\n' +
//                'row: ' + args.row + '\n' +
//                'column: ' + args.col
//            )
//    });
   
};