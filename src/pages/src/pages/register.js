

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

//btn
const reigsterbtn=document.getElementById('registerbtn');

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

//func

