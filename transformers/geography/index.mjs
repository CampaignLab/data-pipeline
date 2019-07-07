
import fs from 'fs';
import CsvReadableStream from 'csv-reader';
import webCharts from 'webcharts';
import XLSX from 'xlsx-style';
import { csvWrite } from '../js-xlsx/xlsx-csv-convert';

const windowsExcelEncodingCompatibility = false;
if (windowsExcelEncodingCompatibility)
  var AutoDetectDecoderStream = require('autodetect-decoder-stream');

const lookupCsvs = [
  './Ward_to_Local_Authority_District_December_2017_Lookup_in_the_United_Kingdom.csv',
  './Clean_output_Look_Up_File_Ward_Level.csv',
];

const inputStream = (windowsExcelEncodingCompatibility)?
  fs.createReadStream(lookupCsvs[0])
    .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' }))  // If failed to guess encoding, default to 1255
  : fs.createReadStream(lookupCsvs[0]) ;



inputStream
  .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
  .on('data', function (row) {
      console.log('A row arrived: ', row);
  }).on('end', function (data) {
      console.log('No more rows!');
  });



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
