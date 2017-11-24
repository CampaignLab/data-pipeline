// import { xlsxRead, csvWrite } from './xlsx-csv-convert';
import fileOperations from './xlsx-csv-convert';
import sheetParsers from './xlsx-sheet-parsers';
import trims from './dataset-specific-trims';

const { xlsxRead, csvWrite } = fileOperations;
const { onsWithRowHierarchy,  interpretAndTrim, maxes } = sheetParsers;

const fileIn ='../../../test.xls'
  , fileOut ='result.csv';

//  Didn't use excelcsv as it seems to give 'Error: Corrupted zip : can't find end of central directory'");

    var workbook = xlsxRead ('local',fileIn);
    var { opts, Directory, SheetNames, Sheets } = workbook;
    console.log({ opts, Directory, SheetNames });
    var {sheet, trim} = interpretAndTrim (Sheets['CT0790']);

    csvWrite (sheet, undefined, trim);

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
