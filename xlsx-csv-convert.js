
const webCharts = require ('webcharts');
const XLSX = require ('xlsx-style');

const doStuff = (filename, accessType) => {
  var workbook;
  accessType = accessType || 'local';

  console.log(__dirname);

  if (accessType=='local')
    workbook = XLSX.readFile('../test.xls');

  // /* Ajax using XMLHttpRequest */
  // if (accessType=='ajax') {
  //   var url = "test_files/formula_stress_test_ajax.xlsx";
  //   var oReq = new XMLHttpRequest();
  //
  //   oReq.open("GET", url, true);
  //   oReq.responseType = "arraybuffer";
  //
  //   oReq.onload = function(e) {
  //     var arraybuffer = oReq.response;
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

return workbook;

  /* DO SOMETHING WITH workbook HERE */
}

module.exports = doStuff
