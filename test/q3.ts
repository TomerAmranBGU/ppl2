import {isDefineExp, makeDefineExp, isCExp, makeBoolExp, makeIfExp,ForExp, AppExp, Exp, Program, ProcExp, CExp ,makeAppExp, makeProcExp, makeNumExp, isProgram, makeProgram, isForExp, isExp, isProcExp, makeForExp, isIfExp, isAppExp, isVarDecl, isVarRef, isPrimOp, isBoolExp, isNumExp} from "./L21-ast";
import { Result, makeOk } from "../imp/result";



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
export const L21ToL2 = (exp: Exp | Program): Result<Exp | Program> =>
    makeOk(
        isProgram(exp)? makeProgram(exp.exps.map(ExpConvertion)) :
        ExpConvertion(exp)
        )

const ExpConvertion = (exp: Exp): Exp => 
        isDefineExp(exp)? exp:
        isCExp(exp)? cExpConv(exp):
        makeBoolExp(true);//junk
 
    

const cExpConv = (exp: CExp): CExp =>
    isForExp(exp)? for2app(makeForExp(exp.var,exp.start,exp.end,cExpConv(exp.body))):
    isProcExp(exp)? makeProcExp(exp.args, exp.body.map(cExpConv)):
    isIfExp(exp)? makeIfExp(cExpConv(exp.test),cExpConv(exp.then),cExpConv(exp.alt)):
    isAppExp(exp)? makeAppExp(cExpConv(exp.rator), exp.rands.map(cExpConv)):
    exp
    // isVarDecl(exp) ? exp:
    // isVarRef(exp) ? exp:
    // isPrimOp(exp) ? exp:
    // isBoolExp(exp)? exp:
    // isNumExp(exp) ? exp:
    
    

