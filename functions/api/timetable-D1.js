//Post
export async function onRequestPost({request,env}){
    const body = await request.json().catch(()=>null);
    if(!body){
        return new Response(JSON.stringify({error:"Invalid request body"}),{
            status:400,
            headers:{'Content-Type':"application/json"}
        });
    }
    const {id,city,way,start,end,special,time1,time2,etime,writetime,writer}=body;
if(!id||typeof id!=="string"||id.trim().length===0){
    return new Response(JSON.stringify({error:"error ID"}),{status:400});
}

if (!city || typeof city !== "string" || city.trim().length === 0) {
        return new Response(JSON.stringify({error: city}), {status: 400});
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
    if(!etime){
        return new Response(JSON.stringify({error: "error etime by undefined"}), {status: 400});
    }
    if(!typeof etime!=="string"){
        return new Response(JSON.stringify({error: "error etime by not string"}), {status: 400});
    }
        return new Response(JSON.stringify({error: "error etime"}), {status: 400});
    }
if (!writer || typeof writer !== "string" || writer.trim().length === 0) {
        return new Response(JSON.stringify({error: "error writer"}), {status: 400});
    }
if (!writetime || typeof writetime !== "string" || writetime.trim().length === 0) {
        return new Response(JSON.stringify({error: "error writetime"}), {status: 400});
    }

const specialvalue=special;
if (!special || typeof special !== "string" || special.trim().length === 0) {
        const specialvalue="无";
}

try{
    const result=await env.mlttcd.prepare(
        `INSERT INTO TIMETABLE (ID,CITY,WAY,START,END,SPECIAL,TIMEONE,TIMETWO,STARTTIME,WRITER,WRITETIME,PASSER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(id.trim(),city.trim(),way.trim(),start.trim(),end.trim(),specialvalue.trim(),time1.trim(),time2.trim(),etime.trim(),writer.trim(),writetime.trim(),"-")
     .run();

     return new Response(JSON.stringify({success:true,result: result.meta.last_row_id,message:"success"}),{status:201,headers:{'Content-Type':"application/json"}});
} catch (err) {
    return new Response(JSON.stringify({
        error: "D1 error",
        detail: err.message,   // ← 添加错误详情
        stack: err.stack
    }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
}
}

//Get
export async function onRequestGet({request,env}){
    const url=new URL(request.url);
    const city=url.searchParams.get("city");
    const way=url.searchParams.get("way");
    const id=url.searchParams.get("id");

    if (!city || typeof city !== "string" || city.trim().length === 0) {
        return new Response(JSON.stringify({error: "error city"}), {status: 400});
    }
    if (!way || typeof way !== "string" || way.trim().length === 0) {
        return new Response(JSON.stringify({error: "error way"}), {status: 400});
    }
    if(!id || typeof id !== "string" || id.trim().length === 0){
        return new Response(JSON.stringify({error: "error id"}), {status: 400});
    }
    if(id){
        console.log("ID");
        try{
            const result=await env.mlttcd.prepare(
                `SELECT * FROM TIMETABLE WHERE ID=?`
            ).bind(id.trim())
            .all();
            if(result.results.length===0){
                return new Response(JSON.stringify({
                    success:false,
                })),{status:404,headers:{'Content-Type':"application/json"}};
            }
            return new Response(JSON.stringify({success:true,result: result.results[0]}),{status:200,headers:{'Content-Type':"application/json"}});
        } catch (err) {
            return new Response(JSON.stringify({
                error: "D1 error",
                detail: err.message,   // ← 添加错误详情
                stack: err.stack
            }), {
                status: 504,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    if(city && way){
        console.log("city and way");
    try{
        const result=await env.mlttcd.prepare(
            `SELECT * FROM TIMETABLE WHERE CITY=? AND WAY=?`
        ).bind(city.trim(),way.trim())
        .all();
        if(result.results.length===0){
            return new Response(JSON.stringify({
                success:false,
            })),{status:404,headers:{'Content-Type':"application/json"}};
        }
        return new Response(JSON.stringify({success:true,result: result.result,message:"success"}),{status:200,headers:{'Content-Type':"application/json"}});
    } catch (err) {
        return new Response(JSON.stringify({
            error: "D1 error",
            detail: err.message,   // ← 添加错误详情
            stack: err.stack
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
    });
}
}
    return new Response(JSON.stringify({success:false,message:"error"}), {status: 400});
}
