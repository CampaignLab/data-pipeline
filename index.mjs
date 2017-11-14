import doStuff from './xlsx-csv-convert';
import excelCSV from 'excelcsv';
import XLSX from 'xlsx';

const using='xlsx'

const fileIn ='../test.xls'
  , fileOut ='result.csv';

switch (using) {
  case 'xlsx' : {
    var workbook = XLSX.readFile(fileIn);

    break
  }

  case 'excelcsv' : {
    console.log("excelcsv seems to give 'Error: Corrupted zip : can't find end of central directory'");

    // const header  = ['id', 'email']
    //
    // // fileOut is optional.
    // var parser = new excelCSV( fileIn, fileOut );
    // var csv = parser
    //
    // // optional.
    // // .header( header )
    // // optional.
    // .row(function(worksheet, row) {
    //   // Transform data here or return false to skip the row.
    //   return row;
    // })
    // .init();
    break
  }

  case 'xlsx-csv-convert' : {

    var workbook = doStuff (fileIn, 'local');
    var { opts, Directory, SheetNames, Sheets } = workbook;

      console.log({ opts, Directory, SheetNames });
      console.log(Object.keys (Sheets['CT0790']).join(' # '));
      console.log('one bit: ',Sheets['CT0790'].D12.v);

    // workbook.keys= {
    // opts:
    //    { Date1904: false,
    //      CalcPrecision: true,
    //      RefreshAll: false,
    //      FullCalc: false,
    //      CalcMode: 1,
    //      CalcCount: 100,
    //      CalcIter: false,
    //      CalcDelta: 0.001,
    //      CalcSaveRecalc: true },
    //   Directory: [ 'CT0790 METADATA', 'CT0790' ],
    //   SheetNames: [ 'CT0790 METADATA', 'CT0790' ],
      // Sheets :
      // [ 'CT0790 METADATA' : {A1, A2, A3 ... },    //1st Sheet
      // 'CT0790' : {} ] ,                           //2nd Sheet
      // Preamble: { '!protect': false },
      // Strings:
      //  [ { t: 'Total: All households',
      //      raw: '<t>Total: All households</t>',
      //      r: 'Total: All households' },
      //    { t: 'Total: Household composition',
      //      raw: '<t>Total: Household composition</t>',
      //      r: 'Total: Household composition' },
      //    { t: 'Total', raw: '<t>Total</t>', r: 'Total' },
      //    { t: 'E92000001 England',
      //      raw: '<t>E92000001 England</t>',
      //      r: 'E92000001 England' },
      //    { t: 'E12000001 North East',
      //      raw: '<t>E12000001 North East</t>',
      //      r: 'E12000001 North East' },
      //    { t: 'E41000047 County Durham UA'
      //   },etc] ,
    //   SSF : {
    //
    //   },
    //   Metadata: { Country: [ 'US', 'GB' ] },
    //   Custprops: {},
    //   Props: {},
    //   CompObjP: undefined,
    //   FILENAME: '../test.xls'
    // }
    break
  }

  default : {
    console.log('no .xls/x parser package specificed to use. (So edit the constant in the code)');
  }
}
