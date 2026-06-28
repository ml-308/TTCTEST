function generate12DigitString() {
    const array = new Uint32Array(3);
    crypto.getRandomValues(array);
    let num = '';
    for (let i = 0; i < 3; i++) {
        num += String(array[i] % 10000).padStart(4, '0');
    }
    return num;
}

export async function onRequestGet({request,env}){
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    if(!email){
        return new Response(JSON.stringify({success:false,message:"邮箱参数缺失"}), {status: 400});
    }
    try{
        const {result}=await env.mlttcd.prepare(
            `SELECT * FROM USER WHERE email = ?`
        ).bind(email.trim()).all();
        if(result.length>0){
            return new Response(JSON.stringify({success:false,message:"邮箱已存在"}), {status: 400});
        }
        return new Response(JSON.stringify({success:true,message:"邮箱未被使用"}), {status: 200});
    }catch(error){
        return new Response(JSON.stringify({success:false,message:"服务器错误"}), {status: 500, body: error.message});
    }
}

export async function onRequestPost({request,env}){
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const password = url.searchParams.get('password');
    if(!email || !password){
        return new Response(JSON.stringify({success:false,message:"邮箱或密码参数缺失"}), {status: 400});
    }
    let id;
    let idExists = true;
    while (idExists) {
        id = generate12DigitString();
        const existingId = await env.mlttcd.prepare(
            'SELECT id FROM USER WHERE id = ?1'
        ).bind(id).first();
        idExists = !!existingId;
    }
    try{
        await env.mlttcd.prepare(
            `INSERT INTO USER(id,email,password,city,registertime) VALUES(?1,?2,?3,"-",?4)`
        ).bind(id.trim(),email.trim(), password.trim(), new Date().toISOString()).run();
        return new Response(JSON.stringify({success:true,message:"注册成功"}), {status: 200});
    }catch(error){
        return new Response(JSON.stringify({success:false,message:"服务器错误"}), {status: 500, body: error.message});
    }
}