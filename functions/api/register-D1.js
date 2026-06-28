import bcrypt from 'bcryptjs';

// 生成12位安全随机数字字符串
function generate12DigitString() {
  const array = new Uint32Array(3);
  crypto.getRandomValues(array);
  let num = '';
  for (let i = 0; i < 3; i++) {
    num += String(array[i] % 10000).padStart(4, '0');
  }
  return num;
}

// 检查邮箱是否已注册（GET 请求）
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ success: false, message: '邮箱参数缺失' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 注意：D1 返回的是 { results: [...] }
    const { results } = await env.mlttcd.prepare(
      'SELECT * FROM USER WHERE email = ?'
    ).bind(email.trim().toLowerCase()).all();

    if (results.length > 0) {
      return new Response(JSON.stringify({ success: false, message: '邮箱已存在' }), {
        status: 409,  // 冲突状态码更合适
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: '邮箱未被使用' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 注册新用户（POST 请求）
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return new Response(JSON.stringify({ success: false, message: '无效的请求数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, message: '邮箱和密码不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 邮箱格式校验（可选）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return new Response(JSON.stringify({ success: false, message: '邮箱格式不正确' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查邮箱是否已存在
    const { results } = await env.mlttcd.prepare(
      'SELECT id FROM USER WHERE email = ?'
    ).bind(email.trim().toLowerCase()).all();
    if (results.length > 0) {
      return new Response(JSON.stringify({ success: false, message: '该邮箱已注册' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成唯一用户 ID
    let id;
    let idExists = true;
    while (idExists) {
      id = generate12DigitString();
      const existingId = await env.mlttcd.prepare(
        'SELECT id FROM USER WHERE id = ?'
      ).bind(id).first();
      idExists = !!existingId;
    }

    // 密码哈希（加盐10轮）
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 插入新用户
    await env.mlttcd.prepare(
      `INSERT INTO USER (id, email, password, city, registertime)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(
      id,
      email.trim().toLowerCase(),
      hashedPassword,
      '-',               // 默认城市
      new Date().toISOString()
    ).run();

    return new Response(JSON.stringify({ success: true, message: '注册成功' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}