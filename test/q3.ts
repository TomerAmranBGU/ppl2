import {isDefineExp, makeDefineExp, isCExp, makeBoolExp, makeIfExp,ForExp, AppExp, Exp, Program, ProcExp, CExp ,makeAppExp, makeProcExp, makeNumExp, isProgram, makeProgram, isForExp, isExp, isProcExp, makeForExp, isIfExp, isAppExp, isVarDecl, isVarRef, isPrimOp, isBoolExp, isNumExp} from "./L21-ast";
import { Result, makeOk, makeFailure,bind, mapResult, safe3, safe2 } from "../imp/result";



/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const for2app = (exp: ForExp): AppExp => 
    {
        let ProcArr :AppExp[] = [];
        for (let i:number = exp.start.val ; i<= exp.end.val; ++i){
            ProcArr.push(makeAppExp(makeProcExp([exp.var], [exp.body]), [makeNumExp(i)]))
        }
        return makeAppExp(makeProcExp([],ProcArr),[]);
        
    }

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/

export const L21ToL2 = (exp: Exp | Program): Result<Exp |Program> => 
    isProgram(exp)? 
        bind(mapResult(ExpConverstion,exp.exps), (exps: Exp[])=> makeOk(makeProgram(exps))):
        ExpConverstion(exp) 

const ExpConverstion = (exp:Exp): Result<Exp> => 
    isDefineExp(exp)? 
        bind(cExpConv(exp.val), (val:CExp)=> makeOk(makeDefineExp(exp.var, val))):
        cExpConv(exp)

const cExpConv = (exp:CExp): Result<CExp> => 
    isForExp(exp)? 
        (exp.start.val > exp.end.val)? makeFailure(`ForExp Failure: Start can't be greater than End`): 
        bind(cExpConv(exp.body), (body: CExp) => 
            makeOk(for2app(makeForExp(exp.var,exp.start,exp.end, body)))):
    isProcExp(exp)? 
        bind(mapResult(cExpConv,exp.body), (body: CExp[])=> 
            makeOk(makeProcExp(exp.args,body))):
    isIfExp(exp)? 
        safe3((test:CExp,then:CExp,alt:CExp)=> 
            makeOk(makeIfExp(test,then,alt)))(cExpConv(exp.test),cExpConv(exp.then),cExpConv(exp.alt)):
    isAppExp(exp)? 
        safe2((rator:CExp,rands:CExp[])=> 
            makeOk(makeAppExp(rator,rands)))(cExpConv(exp.rator),mapResult(cExpConv, exp.rands)):
    makeOk(exp)

    

