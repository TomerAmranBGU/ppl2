import {isDefineExp, makeDefineExp, isCExp, makeBoolExp, makeIfExp,ForExp, AppExp, Exp, Program, ProcExp, CExp ,makeAppExp, makeProcExp, makeNumExp, isProgram, makeProgram, isForExp, isExp, isProcExp, makeForExp, isIfExp, isAppExp, isVarDecl, isVarRef, isPrimOp, isBoolExp, isNumExp} from "./L21-ast";
import { Result, makeOk, makeFailure,bind, mapResult, safe3, safe2 } from "../imp/result";



/*
Purpose: convert For exprestion to Application exprestion. The return appExp should be equvalente to the given for.
Signature: for2app(exp) => app
Type: [ForExp->AppExp]
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
Purpose: given L21 Program or Exprestion L21TOL2 translate it to equvalent Program or Exprestion in L2
            the returned value is in encapulated in Resulte, in case of corecte Exp/Program in L21 return value will ne an OK<Exp|Program>
            in case of incorrect program in L21 the returend value will be Failure
Signature: (exp)=> Res
Type: [ (Exp | Program) ->  Result<Exp |Program>]
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

    

