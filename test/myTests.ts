import { expect } from 'chai';
import { parseL21, parseL21Exp, Exp, Program } from './L21-ast';
// import { L21ToL2 } from './q3';
// import { unparseL21 } from './L21-unparse';
import { Result, bind, isFailure, makeOk, isOk } from '../imp/result';
import { parse as p } from "../imp/parser";
import {for2app} from "./q3"
const util = require('util');
import { parse as parseSexp, isToken } from "../imp/parser";

// console.log ('parsing:   (L21 (for i 1 3 (* i i))) \n')
// console.log(util.inspect(parseL21('(L21 (for i 1 3 (* i i)))'), false, null, true))
console.log(parseSexp("(* 3 (+ 2 2))"));