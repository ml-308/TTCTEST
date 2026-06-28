//showmsg
function showMessage(msg, isError) {
  const box = document.getElementById('errormsg');
  if (box) {
    box.textContent = msg;
    box.style.display = 'block';
    box.style.color = isError ? 'red' : 'green';
  }
  const popup = document.createElement('div');
  popup.textContent = msg;
  popup.style = 'position:fixed; top:20px; left:50%; padding:10px 20px; border-radius:5px; z-index:9999; color:#fff; font-size:0.85rem; animation: fadeInOut 2s ease forwards;';
  popup.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
  
  // 注入动画关键帧（仅一次）
  if (!document.getElementById('showMsgAnimStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'showMsgAnimStyles';
    styleSheet.textContent = `
      @keyframes fadeInOut {
        0%   { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
        85%  { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

//Msg out
function msgout(input,inputmsg,judge,msg){
    if(judge==1){
        inputmsg.style.color="#1eff01";
        inputmsgmsg.style.display="block";
        inputmsgmsg.innerHTML=msg;
        input.style.borderColor="#1eff01";
    }
    if(judge==0){
        inputmsg.style.color="#ff0000";
        inputmsgmsg.style.display="block";
        inputmsgmsg.innerHTML=msg;
        input.style.borderColor="#ff0000";
    }
    if(judge==2){
        inputmsg.style.color="#ffd20a";
        inputmsgmsg.style.display="block";
        inputmsgmsg.innerHTML=msg;
        input.style.borderColor="#ffd20a";
    }
}

function validateEmail(value) {
  const email = value.trim();
  if (!email) {
    return '邮箱不能为空';
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return '邮箱格式不正确';
  }
  return '邮箱格式正确'; 
}

//btn
const registerbtn=document.getElementById('registerbtn');

//input
const email=document.getElementById('email');
const pass=document.getElementById('pass');
const password=document.getElementById('password');
const passwordconfirm=document.getElementById('passwordconfirm');

//MSG
const emailmsg=document.getElementById('emailMsg');
const passmsg=document.getElementById('passMsg');
const passwordmsg=document.getElementById('passwordMsg');
const passwordconfirmmsg=document.getElementById('passwordconfirmMsg');


//btn click
registerbtn.addEventListener("click",refisterbtnclick);

//input input
email.addEventListener("input",emailinput);
pass.addEventListener("input",passinput);
password.addEventListener("input",passwordinput);
passwordconfirm.addEventListener("input",passwordconfirminput);

let judge={
    email:0,
    pass:0,
    password:0,
    passwordconfirm:0
};

let input={
    email:'',
    password:'',
    passwordconfirm:'',
    key:'',
};


//function
function emailinput(){
    const email=email.value;
    const back=validateEmail(email);
    if(back!='邮箱格式正确'){
        judge.email=1;
        msgout(email,emailmsg,0,email+back);
        emailp(email);
    }
    else{
        judge.email=0;
        msgout(email,emailmsg,1,email+back);
    }

}

async function emailp(email1){
    const res=await fetch(`functions/api/KV.js?key=${email1}`);
    const data=await res.json();
    const re=await fetch(`functions/api/register-D1.js?email=${email1}`);
    const dat=await re.json();
    if(!re.ok){
        const dat=await re.json();
        msgout(email,emailmsg,0,email1+back+","+dat.message);
    }
    else{
        if(!res.ok){        
        const dat=await res.json();
        msgout(email,emailmsg,data.way,email1+back+","+dat.message);
    }
        else{
            msgout(email,emailmsg,1,email1+back+","+dat.message);
            input.key=data.value;
    }
}
}

function passinput(){
    const pass=pass.value;
    if(input.key==""){
        judge.pass=0;
        msgout(pass,passmsg,0,'您没有注册权限');
    }
    if(pass==judeg.key){
        judge.pass=1;
        msgout(pass,passmsg,1,'注册码正确');
    }
    else{
        judge.pass=0;
        msgout(pass,passmsg,0,'注册码错误');
    }
}

function passwordinput(){
    const pass=password.value;
    if(pass.length<6||pass.length>16){
        judge.pass=0;
        msgout(password,passwordmsg,0,'密码长度不能小于6位或大于16位');
    }
    else{
        judge.pass=1;
        msgout(password,passwordmsg,1,'密码长度正确');
        input.password=pass;
    }
}

function passwordconfirminput(){
    const pass=passwordconfirm.value;
    if(pass!=pass.value){
        judge.passwordconfirm=0;
        msgout(passwordconfirm,passwordconfirmmsg,0,'两次密码输入不一致');
    }
    else{
        judge.passwordconfirm=1;
        msgout(passwordconfirm,passwordconfirmmsg,1,'两次密码输入一致');
        input.passwordconfirm=pass;
    }
}

function refisterbtnclick(){
    emailinput();
    passinput();
    passwordinput();
    passwordconfirminput();
    if(judge.email!=1||judge.pass!=1||judge.password!=1||judge.passwordconfirm!=1){
        return;
    }
    const email=email.value;
    const password=password.value;
    writeD1(email,password);
}

async function writeD1(email,password){
    const res=await fetch(`functions/api/register-D1.js?email=${email}&password=${password}`);
    const data=await res.json();
    if(!res.ok){
        const dat=await res.json();
        showMessage(dat.message,1);
    }
    else{
        const dat=await res.json();
        showMessage(dat.message,0);
        window.location.href='index.html';
    }
}