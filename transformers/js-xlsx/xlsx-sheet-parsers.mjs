// This code relies on cells being ordered from the top left of the sheet.
// Anything else will break the logic in restOfRowEmpty when called without stopAt and,
// more importantly, in trim() (which will corrupt the data!)
// Ordering objects is NOT part of the JS spec, so this should be built more professionally eventually.


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

const colLetters = (colNumber) => {
  let x = colNumber>26? String.fromCharCode(64+Math.floor((colNumber-1)/26))
   : '';
  x += String.fromCharCode(65+(colNumber-1)%26);
  return x
}

// return {x,y} where x= highest column letter, y = highest row number (number)
const maxes = (sheet) => {
  const cells = Object.keys(sheet);
  let x='A';
  let y= 1;

  cells.forEach (cell => {
    const [success, col, row] = cell.match(splitterRegex) || [null];
    if (success) {
      if (colNumber(col) > colNumber(x))
        x=col;
      if (parseInt(row)>y)
        y=parseInt(row);
    }
  })
  return {x,y}
}

// amount is optional  - single arg just increments
// if cell==false, then return a function which will do the increment
const incX = (cell, amount) => {
  // create an incrementor function
  const closure = cell => {
    // perform the increment if we can and return the result
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

    x = colLetters(xNum);
    return x+y;
  }

  // apply the incrementor function to cell if we have cell, else return the incrementor function
  return cell?
    closure (cell)
    : closure
}

// amount is optional  - single arg just increments
// if cell==false, then return a function which will do the increment
const incY = (cell, amount) => {
  // create an incrementor function
  const closure = cell => {
    var [success,x,y] = cell.match(splitterRegex);
    if (!success)
      return null;

    y = parseInt(y);
    y += (amount || 1);
    return y >0 ? x+y
      : null;
  }

  // apply the incrementor function to cell if we have cell, else return the incrementor function
  return cell?
    closure (cell)
    : closure
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
      // if it startsWith('!'), it's the !range key - so we've finished the cells.
      return nextCell.startsWith('!') || !(startCell.match(splitterRegex)[2] === nextCell.match(splitterRegex)[2])
    }
  }
    // allow stopAt to be an integer which will be added to startCell
    if (Number.isInteger(stopAt) && stopAt>0)
      stopAt = incX(startCell, stopAt);

  if (startCell.match(splitterRegex)[2] != stopAt.match(splitterRegex)[2])
    throw new Error (`Comparing ${startCell} and ${stopAt} but they are different rows.`)

  // Traverse along until startCell== stopAt or until non-empty cell found
  while (startCell != stopAt) {
    if (sheet[startCell])
      return false;
  startCell= incX(startCell);
  }
  return true;
};

const canonical = key => {
  if (key===undefined)
    return null
  const [success, col, row] = key.match(splitterRegex) || [null];
  return success?
    (row<<10) + colNumber(col)                //NB cols max 702
    : null
}

const orderTopToBottomLeftToRight = keys =>
  keys.sort ((a,b) => canonical(a) - canonical(b)) ;


// WARNING: This is naughty JS!
// per spec, you CANNOT rely on an object ordering its keys, as objects are unordered.
// But I'm going to do it anyway and refactor 'one day'
// You can also use orderTopToBottomLeftToRight to create an ordered array of keys
// and work from that. But that might take some time!
const mergeInOrder = (sheet, mergeList) => {
  if (Object.keys(mergeList).length === 0)
    return sheet
  let sheetKeys = Object.keys (sheet);
  let newKeys = Object.keys (mergeList);
  newKeys = orderTopToBottomLeftToRight (newKeys);
  const merged = {};
  console.log('existing cells:', sheetKeys.length);
  console.log('new cells:', newKeys.length);
  for (const key in sheet)
    if (!newKeys.length)
      merged[key] = sheet[key]
    else {
      const sheetCanonical = canonical(key);
      for (let newCanonical = canonical(newKeys[0]);
        (newKeys[0] && newCanonical <= sheetCanonical);
        newCanonical = canonical(newKeys[0])) {
          if (newCanonical === sheetCanonical)
            console.log(`Overwriting sheet.${key}= '${sheet[key].v}' with mergeList.${key}= '${mergeList[key].v}' `);
          else
            console.log(`new mergeList.${newKeys[0]}= '${mergeList[newKeys[0]].v}' `);
          merged[newKeys[0]] = mergeList[newKeys[0]];
          newKeys.shift();
        }
      merged[key] = sheet[key];
    }
  newKeys.forEach (key=> {
    merged[key] = mergeList[key];
  })
  console.log(`${Object.keys(merged).length} cells after merge\n`);
  return merged
}


const compoundHeader = (sheet, keys, separator) => {
  const headerParts = [];
  keys.forEach (key => {
    if (sheet[key] && sheet[key].v)
      headerParts.push (sheet[key].v)
  })
  return headerParts.join(separator)
}


// Simply removes the columns and leaves an empty space.
// This was avoid copying the entire dataset to a new sheet (though copying still needed to not mutate input).
// rows is an array of stringy numbers.
// Both rows and columns are optional.
// mergeRowHeaders operates with or without a merge function but,
// if provided, mergeFunction currently must mutate sheet and therefore make createKillAndMergeListFromTrim impure.
const trimTheEasyWay = (sheet, trim, mergeRowHeaders, mergeFunction) => {
  const { killList, mergeList }  = createKillAndMergeListFromTrim (sheet, trim, mergeRowHeaders, mergeFunction);
  killList.forEach (key => {
    delete (sheet[key]);
  });

  return mergeInOrder (sheet, mergeList);
}

// Non-mutating part of trimTheEasyWay. Returns { killList, mergeList }  to be dealt with as appropriate.
// killList is an array, mergeList is an object
// if provided, mergeFunction currently must to mutate sheet.
const createKillAndMergeListFromTrim = (sheet, trim, mergeRowHeaders, mergeFunction) => {
  const killList = [];
  const mergeList = {};
  // console.log(Object.keys(sheet));
  Object.keys(sheet).forEach (key => {
    if (key != '!range' && key != '!ref' && key !='!merges') {
      // console.log(key);
      let [success,x,y] = key.match(splitterRegex);
      if (trim.rows.includes(y))
        killList.push (key)
      else
        if (trim.cols.includes(x)) {
          killList.push (key);
          if (mergeRowHeaders && sheet[key]) {
            if (mergeFunction)
              mergeFunction (mergeList, key)
            else {
              // default merge function- Assume rows A&B merged into C
              // do not overwrite C if it somehow exists already
              // but if no C, then add a C to mergeList and populate with join of A and/or B's and/or C's contents
              if (x==='A')
                if (!mergeList[incX(key,2)]) {
                  mergeList[incX(key,2)] = Object.assign (
                    {}, sheet[key], {v: compoundHeader (sheet, [key, incX(key,1), incX(key,2)])} )
                }
              if (x==='B' && !sheet[incX(key,-1)] )
                if (!mergeList[incX(key,1)]) {
                  mergeList[incX(key,1)] = Object.assign (
                    {}, sheet[key], {v: compoundHeader (sheet, [key, incX(key,1)])} )
                }
            }
          }
        }
   }
  });
  return { killList, mergeList }
}


// interpret a sheet of the form used by Office of National Statistics, where geographical row headers
// occupy multiple columns hierarchically, eg A12: England, B13: North West, C14: Runcorn, C15: Warrington, B16: North East, C17: Gateshead, etc...
const interpretOnsWithRowHierarchy = (sheet) => {
  let current = 'A1';
  let dataStart = '';           // Best guess for top left data cell, see comment below
  let currentHeader = '';
  let max = maxes(sheet);
  const headersStart = [];        // Array of: the first cell in a row which contains a header
  var colHeaders = [];
  var rowHeaders = [];
  var rowHeadersCol ;
  const toTrim = {rows: [], cols: []};
  const meta = {sourcing: [], terms: []};

  // Traverse downwards until you find a row with something in more than just the first cell.
  while (restOfRowEmpty(sheet, current)) {
    if (sheet[current])
      meta.sourcing.push (current);
    current = incY (current);
  }
  // So long as this more-than-one-column row is empty in this first cell,
  while (!sheet[current]) {
    currentHeader = current;
    // Assume that the last row of headers is appropriate to define which columns to trim
    toTrim.cols = [];
    // traverse to the right to the first non-empty '','',cell
    while (!sheet[currentHeader]){
      toTrim.cols.push(currentHeader)
      currentHeader = incX (currentHeader);
    }
    // and remember it.
    headersStart.push (currentHeader);
    // this is a while, not an if, since there may be more than one header row
    // so repeat for the next row if also it's first cell is empty.
    current = incY (current);
    rowHeaders = [toTrim.cols.pop()];
  }

  // assuming that the first header row we found contains some header in the first data column.
  dataStart = headersStart[0].match(splitterRegex)[1] + current.match(splitterRegex)[2];

  // console.log ('I reckons the column headers are:');'','',
  headersStart.forEach (header => {
    let rowOfHeaders = [];
    while (!restOfRowEmpty(sheet, header, 50)) {
      // console.log(sheet[header].v);
      // console.log(header);
      rowOfHeaders.push (header);
      header = incX (header);
      while (!sheet[header] && !restOfRowEmpty(sheet, header, 50))
        header = incX (header);
    }
    colHeaders.push(rowOfHeaders);
    console.log('OK then');
  })
  console.log('and the data starts at cell ',dataStart);

  currentHeader = rowHeaders[0]
  // current should never have moved right from column A.
  // current = 'A' + current.match(splitterRegex)[2];
  // loop until we reach the bottom
  while (0+current.match(splitterRegex)[2] <= 0+(max.y)) {
    // while we're in a completely empty row but haven't reached the bottom, move down
    while (!sheet[current] && restOfRowEmpty(sheet, current) && 0+current.match(splitterRegex)[2] < 0+(maxes.y)) {
      current = incY (current);
      currentHeader = incY (currentHeader);
    }
    while (!restOfRowEmpty(sheet, current)) {
      meta.terms = [];
      current = incY (current);
      currentHeader = incY (currentHeader);
      rowHeaders.push (currentHeader);
    }
    if (sheet[current])
      meta.terms.push (current);
    current = incY (current);
    currentHeader = incY (currentHeader);
  }
  toTrim.rows = toTrim.rows.concat(meta.sourcing, meta.terms);
  toTrim.rows = toTrim.rows.map (cellName => cellName.match(splitterRegex)[2]);
  toTrim.cols = toTrim.cols.map (cellName => cellName.match(splitterRegex)[1]);
  meta.sourcing = meta.sourcing.map (cellName => sheet[cellName].v);
  meta.terms = meta.terms.map (cellName => sheet[cellName].v);


  rowHeaders = rowHeaders.filter (cellName => sheet[cellName] && sheet[cellName].v != '');

  return {
    trim: toTrim,
    meta,
    colHeaders,
    rowHeaders,
    mergeColumn : currentHeader.match(splitterRegex)[1]
  };
};


const interpretAndTrim = (sheet, trim) => {
  let suggested = interpretOnsWithRowHierarchy (sheet);
  let rows = suggested.rowHeaders
    .slice(0,3)
    .concat(null,suggested.rowHeaders.slice(-1))
    .map (cellName => cellName !== null? sheet[cellName].v : '...')
    .join (';  ');
  let cols = suggested.colHeaders.map (rowOfColHeaders =>
    rowOfColHeaders
    .slice(0,2)
    .concat(null,rowOfColHeaders.slice(-1)))
    .reduce((acc, val) => [...acc, ...val])
    .map (cellName => cellName !== null? `"${sheet[cellName].v}"` : '...')
    .join ('; ');
  console.log(`Will trim and merge based on the assumption that the main column of row headers is: ${rows}`);
  console.log(`and the rows of column headers are: ${cols}`);
  console.log(`So that rows ${suggested.trim.rows} and columns ${suggested.trim.cols}
    are to be trimmed, with columns merged into column ${suggested.mergeColumn}.`);
  sheet = trimTheEasyWay (sheet, trim, true);
  return sheet

};

export default { interpretOnsWithRowHierarchy, interpretAndTrim, colNumber, colLetters, maxes}
