// 26 Aug :
// TODO - D12, D13 and D347 are ending up blanked :(
// TODO - end of document after last merge is getting cut off




import fs from 'fs';
import webCharts from 'webcharts';
import XLSX from 'xlsx-style';
// (It's a fork of SheetJS)

// const meter = require("stream-meter");

import sheetParsers from './xlsx-sheet-parsers';

const { colNumber, colLetters, maxes } = sheetParsers;

const fileInDefault ='../test.xls'
  , fileOutDefault ='result.csv';


const xlsxRead = (accessType, fileIn = fileInDefault) => {
  var workbook;
  accessType = accessType || 'local';

  // incompatible with .mjs :(
  // console.log(__dirname);

  // /* Ajax using XMLHttpRequest */
  // if (accessType=='ajax') {
  //   var url = "test_files/formula_stress_test_ajax.xlsx";
  //   var oReq = new XMLHttpRequest();
  //
  //   oReq.open("GET", url, true);
  //   oReq.responseType = "arraybuffer";
  //
  //   oReq.onload = function(e) {
  //     var arraybuffer = oReq.response;module.exports
  //
  //     /* convert data to binary string */
  //     var data = new Uint8Array(arraybuffer);
  //     var arr = new Array();
  //     for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //     var bstr = arr.join("");
  //
  //     workbook = XLSX.read(bstr, {type:"binary"});
  //   }
  //
  //   oReq.send();
  // }


  if (accessType=='local')
    workbook = XLSX.readFile(fileIn);

  return workbook;
}


//currently to suppress file output, set fileOut to null (leaving fileOut undefined will use default)
const csvWrite = ( workbook, fileOut = fileOutDefault, ignores = {cols:[], rows:[]}) => {
  const delimiter=',';
  const newLine='\r\n';
  let fd;
  let lineCount=0;

  if (fileOut){
    // module xlsx will have XLSX.stream, module xlsx-style will not
    // console.log(Object.keys (XLSX));

    console.log(`Using output file: ${fileOut}`);
    let max = maxes(workbook);

    let rowOfCols = Array.from (Array(colNumber(max.x)+1).keys())
    rowOfCols.shift();
    rowOfCols= rowOfCols
      .map (colLetters)
      .filter (col => !ignores.cols.includes(col)) ;

    fd = fs.openSync (fileOut, 'w');
    console.log(`Opened ${fileOut} for synchronous write.`);


    for (let row=1; (row <= max.y); row++) {
      if (!ignores.rows.includes(''+row)) {
        lineCount ++ ;
        let line= rowOfCols
          .map (col => col+row)
          .map (key => workbook[key] ? ''+workbook[key].v : '')
          .map (value => value.includes(',')? `"${value}"` : value)
          .join (delimiter) ;
        fs.writeSync (fd, line+newLine);
      }
    }
    fs.closeSync (fd);
    console.log(`Closed ${fileOut} after ${lineCount} records.`);


    // } //reinstate me




    // // more bullshit errors - doesn;t seem to behave to spec.
    // var csvOutput = XLSX.utils.sheet_to_csv (workbook);
    // XLSX.writeFile(csvOutput, fileOut);

    // var m1 = meter();
    // var m2 = meter();
    // var ccsvWritehunkCount = 0;
    // var stream = XLSX.stream
    //   // .pipe (m1)
    //   .to_csv(workbook)
    //   .pipe (m2)
    //   // .pipe ((done,chunk) => {
    //   //   if (chunk) chunkCount++;
    //   //   this.push(chunk);
    //   // })
    //   .pipe(fs.createWriteStream(fileOut))
    //   .close (console.log(`Got close event after ${m1.bytes} bytes & ${m2.bytes} bytes.` ))
    // // .to_csv seems not to emit anything. Plus streams not supported in xlsx-style. Abandoning...


    }

}

export default { xlsxRead, csvWrite }
