// This code relies on cells being ordered in memory from the top left of the sheet.
// Anything else will break the logic in restOfRowEmpty when called without stopAt and,
// more importantly, in trim() (which will corrupt the data!)



// import { xlsxRead, csvWrite } from './xlsx-csv-convert';
import decoders from './GSS-decoders';


const {isGssCode, startsWithGssCode, whatIs} = decoders;

const splitterRegex = /^([a-zA-z]{1,2})(\d{1,})/;

const colNumber = (colLetters) => {
  let xNum = colLetters.charCodeAt(0)-64;
  if (xNum >= 32)
    xNum -= 32;
  if (colLetters.length==2) {
    xNum *= 26;
    let secondXNum = colLetters.charCodeAt(1)-64;
    if (secondXNum >= 32)
      secondXNum -= 32;
    xNum += secondXNum;
  }
  return xNum
}

// amount is optional  - single arg just increments
const incX = (cell, amount) => {
  let [success,x,y] = cell.match(splitterRegex);
  if (!success)
    return null;

  let xNum = colNumber(x);
  xNum += (amount || 1);

  if (xNum >702)
    throw new Error ("From "+cell+" - More than 702 columns? You mad?");
  // Don't throw if decrementing to/below zero - return null so we can use it in loops.
  if (xNum <1)
    return null;

  x = xNum>26? String.fromCharCode(64+Math.floor((xNum-1)/26))
   : '';
  x += String.fromCharCode(65+(xNum-1)%26);

  return x+y;
}

// amount is optional  - single arg just increments
const incY = (cell, amount) => {
  var [success,x,y] = cell.match(splitterRegex);
  if (!success)
    return null;

  y = parseInt(y);
  y += (amount || 1);
  return y >0 ? x+y
    : null;
}

// returns true or false. Previously returned null when given empty startCell.
const restOfRowEmpty = (sheet, startCell, stopAt) => {
  // two methods to check this.
  // If no stopAt provided, then just check if next cell in memory is same row.
  // If stopAt provided, check for existence of specific cells.
  if (!stopAt) {
    const cells = Object.keys(sheet);
    const idx = cells.indexOf(startCell);
    if (idx == -1) {
      // can't check the next in the list if startCell isn't in the list. See console.log
      stopAt = incX (startCell, 5)
      // console.log(`Empty cell ${startCell} passed for checking. I'll assume a stopAt value of ${stopAt}.`);
    } else {

      // if startCell last in sheet list then the rest of row must be empty.
      if (cells.length==idx+1)
        return true;
      const nextCell = cells[idx+1];
      // if next item matches row number, rest of row is not empty, if no match, it should be empty.
      return !(startCell.match(splitterRegex)[2] === nextCell.match(splitterRegex)[2])
    }
  }
    // allow stopAt to be an integer which will be added to startCell
    if (Number.isInteger(stopAt) && stopAt>0)
      stopAt = incX(startCell, stopAt);

  if (startCell.match(splitterRegex)[2] != stopAt.match(splitterRegex)[2])
    throw new Error (`Comparing ${startCell} and ${stopAt} but they are different rows.`)

  // Traverse along until startCell== topAt or until non-empty cell found
  while (startCell != stopAt) {
    if (sheet[startCell])
      return false;
  startCell= incX(startCell);
  }
  return true;
};


// Simply removes the columns and leaves an empty space.
// This avoids copying the entire dataset to a new sheet.
// It therefore mutates sheet.
// rows is an array of stringy numbers.
// Both rows and columns are optional.
// mergeRowHeaders operates with or without a merge function but,
// if provided, mergeFunction must mutate sheet.
const trimTheEasyWay = (sheet, rows, columns, mergeRowHeaders, mergeFunction) => {
  const killList = [];
  // console.log(Object.keys(sheet));
  let str =''
  Object.keys(sheet).forEach (key=>{str+=key});
  Object.keys(sheet).forEach (key => {
    if (key != '!range' && key != '!ref' && key !='!merges') {
      // console.log(key);
      let [success,x,y] = key.match(splitterRegex);
      if (rows.includes(y))
        killList.push (key)
      else
        if (columns.includes(x)) {
          killList.push (key);
          if (mergeRowHeaders && sheet[key]) {
            if (mergeFunction)
              mergeFunction (key)
            else {
              if (x='A') {
                if (!sheet[incX(key,2)])
                  sheet[incX(key,2)] = Object.assign ({},sheet[key])
                sheet[incX(key,2)].v = (sheet[key].v || '' ) + ( sheet[incX(key,2)].v || '') + (sheet[incX(key,2)].v || '')
              }
              if (x='B' && !sheet[incX(key,-1)] ) {
                if (!sheet[incX(key,1)])
                  sheet[incX(key,1)] = Object.assign ({},sheet[key])
                sheet[incX(key,1)].v = (sheet[key].v || '' ) + (sheet[incX(key,1)].v || '')
              }
            }
          }
        }
   }
  });

  killList.forEach (key => {
    delete (sheet[key]);
  });
}


const onsWithRowHierarchy = (sheet, trim) => {

  console.log(Object.keys(sheet).slice(0,300).join(' # '));
  console.log('accesing data example: ', sheet.D12);


  let current = 'A1';
  let dataStart = '';           // Best guess for top left data cell, see comment below
  let currentHeader = '';
  let headersStart = [];        // Array of: the first cell in a row which contains a header

  // Traverse downwards until you find a row with something in more than just the first cell.
  while (restOfRowEmpty(sheet, current))
    current = incY (current);
  // So long as this non-empty row is empty in this first cell,
  while (!sheet[current]) {
    currentHeader = current;
    // traverse to the right to the first non-empty '','',cell
    while (!sheet[currentHeader]){
      currentHeader = incX (currentHeader);
    }
    // and remember it.
    headersStart.push (currentHeader);
    // this is a while, not an if, since there may be more than one header row
    // so repeat for the next row if also it's first cell is empty.
    current = incY (current);
  }

  // assuming that the first header row we found contains some header in the first data column.
  dataStart = headersStart[0].match(splitterRegex)[1] + current.match(splitterRegex)[2];

  console.log ('I reckons the headers are:');'','',
  headersStart.forEach (header => {
    while (!restOfRowEmpty(sheet, header, 50)) {
      console.log(sheet[header].v);
      // console.log(header);
      header = incX (header);
      while (!sheet[header] && !restOfRowEmpty(sheet, header, 50))
        header = incX (header);
    }
    console.log('OK then');
  })
  console.log('and the data starts at cell ',dataStart);


  trimTheEasyWay (sheet, trim.rows, trim.cols, true)
  return sheet

};

export default { onsWithRowHierarchy, colNumber }
