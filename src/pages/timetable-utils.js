//输入补全
export function Complete(value,word){
    const a=value.indexOf(word);
    if(a<0){
        value=value+word;
    }
    return value;
}

//时间格式判断
export function timejudge(time){
    if(timec[i]>=2400||timec[i]<0||timec[i].length!=4||isNaN(timec[i])||timec[i]%100>=60||timec[i].length!=4||isNaN(timec[i])||timec[i]%100>=60){
        return flase;
    }
    return true;
}

//时间格式转换
export function timeformat(time){
    function strtime(time){
    time=time.replaceAll('\n'," ");
    let timec=time.split(' ');
    time="";
    timec.sort();
    let n=0;
    for(let i=0;i<timec.length;i++){
        let naw=timec[i];
        let next="0000";
        if(i<=timec.length-2){
            next=timec[i+1];
        }
        if(naw==" "||naw==""){
            continue;
        }
        time+=naw.slice(0,2)+':'+naw.slice(2,4)+"\t";
        n+=1;
        if(n==5){
            time+="\n";
            n=0;
        }
    }

    return time;

}
}

//执行时间检查
export function ex_timejudege(etime){
    let timec = time.split('.');
    if(timec[0].length!=4){
        timec[0]="20"+timec[0];
    }

    if(timec.length!=3||timec[0]<=0||timec[0].length!=4||timec[1]>12||timec[1]<1||timec[2]>31||timec[2]<1||timec[1].length>2||timec[2].length>2){
        return false;
    }
    return true;
}