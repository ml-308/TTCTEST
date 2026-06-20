export async function onRequestPost({request,env}){
    const body = await request.json().catch(()=>null);
    if(!body){
        return new Response(JSON.stringify({error:"Invalid request body"}),{
            status:400,
            headers:{'Content-Type':"application/json"}
        });
    }
    const {id,city,way,start,end,special,time1,time2,etime,writer}=body;
if(!id||typeof id!=="string"||id.trim().length===0){
    return new Response(JSON.stringify({error:"error ID"}),{status:400});
}

if (!city || typeof city !== "string" || city.trim().length === 0) {
        return new Response(JSON.stringify({error: "error city"}), {status: 400});
    }
if (!way || typeof way !== "string" || way.trim().length === 0) {
        return new Response(JSON.stringify({error: "error way"}), {status: 400});
    }
if (!start || typeof start !== "string" || start.trim().length === 0) {
        return new Response(JSON.stringify({error: "error start"}), {status: 400});
    }
if (!end || typeof end !== "string" || end.trim().length === 0) {
        return new Response(JSON.stringify({error: "error end"}), {status: 400});
    }
if (!time1 || typeof time1 !== "string" || time1.trim().length === 0) {
        return new Response(JSON.stringify({error: "error time1"}), {status: 400});
    }
if (!time2 || typeof time2 !== "string" || time2.trim().length === 0) {
        return new Response(JSON.stringify({error: "error time2"}), {status: 400});
    }
if (!etime || typeof etime !== "string" || etime.trim().length === 0) {
        return new Response(JSON.stringify({error: "error etime"}), {status: 400});
    }
if (!writer || typeof writer !== "string" || writer.trim().length === 0) {
        return new Response(JSON.stringify({error: "error writer"}), {status: 400});
    }
if (!special || typeof special !== "string" || special.trim().length === 0) {
        special="无";
}

try{
    const result=await env.mlttcd.prepare(
        `INSERT INTO TIMETABLE (ID,CITY,WAY,START,END,SPECIAL,TIMEONE,TIMETWO,STARTTIME,WRITER,WRITERTIME,PASSER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(id.trim(),city.trim(),way.trim(),start.trim(),end.trim(),special.trim(),time1.trim(),time2.trim(),etime.trim(),writer.trim(),"-")
     .run();

     return new Response(JSON.stringify({success:true,result: result.meta.last_row_id,message:"success"}),{status:201,headers:{'Content-Type':"application/json"}});
}catch(err){
    return new Response(JSON.stringify({error:"D1 error"}),{status:500});
}
}

