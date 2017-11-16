
import doStuff from './xlsx-csv-convert';
import decoders from './GSS-decoders';


const {isGssCode, startsWithGssCode, whatIs} = decoders;

const splitterRegex = /^([a-zA-z]{1,2})(\d{1,})/;

// amount is optional  - single arg just increments
const incX = (cell, amount) => {
  let [success,x,y] = cell.match(splitterRegex);
  if (!success)
    return null;
  let xNum = x.charCodeAt(0)-64;
  if (xNum >= 32)
    xNum -= 32;
  if (x.length==2) {
    xNum *= 26;
    let secondXNum = x.charCodeAt(1)-64;
    if (secondXNum >= 32)
      secondXNum -= 32;
    xNum += secondXNum;
  }

  xNum += (amount || 1);

  if (xNum >702)
    throw new Error ("More than 702 columns? You mad?");
  // Don't throw if decrementing to/below zero - return null so we can use it in loops.
  if (xNum <1)
    return null;

  x = xNum>26? String.fromCharCode(64+Math.floor(xNum/26))
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

const onsWithRowHierarchy = sheet => {

  console.log(Object.keys(sheet).slice(0,100).join(' # '));
  console.log('one bit: ', sheet.D12.v);

};

export default {onsWithRowHierarchy}
