import { Exp, Program, isProgram, isBoolExp, isNumExp, isVarRef, isPrimOp, isDefineExp, isProcExp, isIfExp, isAppExp ,AppExp,ProcExp} from "../imp/L2-ast";
import { map } from "ramda";
import { Result, makeOk, makeFailure, mapResult, bind, safe3, safe2 } from "../imp/result";

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l2ToJS = (exp: Exp | Program): Result<string> => 
isProgram(exp) ? programParser(exp) :
isBoolExp(exp) ? makeOk(exp.val ? "true" : "false") :
isNumExp(exp) ? makeOk(exp.val.toString()) :
isVarRef(exp) ? makeOk(exp.var) :
isPrimOp(exp) ? makeOk((exp.op === '='? '===': exp.op === 'not'? '!': exp.op === 'and'? '&&': exp.op === 'or'? '|': exp.op === 'eq?'? '===':  exp.op)) :
isDefineExp(exp) ? bind(l2ToJS(exp.val), (val: string) => makeOk(`const ${exp.var.var} = ${val}`)) :
isProcExp(exp) ? procParser(exp) :
isIfExp(exp) ? safe3((test: string, then: string, alt: string) => makeOk(`(${test} ? ${then} : ${alt})`))
                (l2ToJS(exp.test), l2ToJS(exp.then), l2ToJS(exp.alt)) :
isAppExp(exp) ?  appExpParser(exp):
makeFailure(`Unknown expression: ${exp}`);

const appExpParser = (exp: AppExp): Result<string> => 
//not
isPrimOp(exp.rator) && (exp.rator.op === 'not')? safe2((rator: string, rands: string[]) => makeOk(`(${rator}${rands[0]})`))(l2ToJS(exp.rator), mapResult(l2ToJS, exp.rands)):
//isboolean
isPrimOp(exp.rator) && (exp.rator.op === 'boolean?')? safe2((rator: string, rands: string[]) => makeOk(`(isBoolean(${rands[0]}))`))(l2ToJS(exp.rator), mapResult(l2ToJS, exp.rands)): 
//isNunber
isPrimOp(exp.rator) && (exp.rator.op === 'number?')? safe2((rator: string, rands: string[]) => makeOk(`(isNumber(${rands[0]}))`))(l2ToJS(exp.rator), mapResult(l2ToJS, exp.rands)): 
//regulat prim operator    
isPrimOp(exp.rator) ? safe2((rator: string, rands: string[]) => makeOk(`(${rands.join(' '+ rator +' ')})`)) (l2ToJS(exp.rator), mapResult(l2ToJS, exp.rands)):
//named function
safe2((rator: string, rands: string[]) => makeOk(`${rator}(${rands.join(",")})`))
                    (l2ToJS(exp.rator), mapResult(l2ToJS, exp.rands));

const programParser = (prog: Program): Result<string> =>
    (prog.exps.length === 1)? bind(l2ToJS(prog.exps[0]), (exp: string)=> makeOk(exp+';\n')):
    bind(mapResult(l2ToJS, prog.exps), (exps: string[]) => makeOk(exps.slice(0,-1).join(";\n")+';\n'+ `console.log(${exps.slice(-1)[0]});`));

const procParser = (proc: ProcExp): Result<string> => 
(proc.body.length === 1)? bind(l2ToJS(proc.body[0]), (exp: string)=> makeOk(`((${map(v => v.var, proc.args).join(",")}) => ${exp})`)):
bind(mapResult(l2ToJS, proc.body), (body: string[]) => makeOk(`((${map(v => v.var, proc.args).join(",")}) => {${body.slice(0,-1).join("; ")}; return ${body.slice(-1)[0]};})`))