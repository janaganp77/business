import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore,Timestamp} from  "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-firestore.min.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { collection, doc, getDoc , setDoc ,getDocs,query,where } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-firestore.min.js"; 
  const firebaseConfig = {
    apiKey: "AIzaSyCpFPM5A4vPvVwk33EWqIAdql64FwcECfQ",
    authDomain: "business-affiliate.firebaseapp.com",
    projectId: "business-affiliate",
    storageBucket: "business-affiliate.appspot.com",
    messagingSenderId: "895783987541",
    appId: "1:895783987541:web:df4f92c325417357d467dc",
    measurementId: "G-CHVDNE6W00"
  };
  var techy=[];
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function render(){
    const q = query(collection(db, "product"));
    const qs = await getDocs(q);
    if(qs.size==0){
      document.getElementById('productinfo').innerHTML="No Produts available";
    }else{
      var list=document.getElementById('productinfo');
      var pro=[];
      var temp="";
      qs.forEach((doc) => {
        var d=doc.data();
        if(d['open']=='1'){
          pro.push(d);
        }
      });
      let pos=0;
      let end=13;
      if(end>pos.length){
        end=pos.length+1;
      }
      pro=pro.slice(0,end);
      var tind=0;
      for(let i=pro.length-1;i>=0;i--){
        if(pos==0){
          temp+="<div class='row'>";
        }
        temp+="<div class='col-lg-4' style='padding:5px;'>";
        temp+='<div class="card" style="background:#e8e8e8;width: 100%;height:100%;"><img style="width:90%;padding:10px;padding-top:2vh;display:block;margin:auto;height:auto;max-height:550px;" src="'+pro[i]['image']+'" class="card-img-top" alt="'+pro[i]['name']+'"><div class="card-body"><h6 style="text-align:center;font-weight:600;font-size:x-large;" class="card-title">'+pro[i]['name']+'</h6><p style="background:white;border:1px solid black;padding:10px;text-align:left;line-spacing:20px;overflow:hidden;" class="card-text">'+pro[i]['description']+'</p><a target="_blank" href="'+pro[i]['link']+'" class="btn btn-warning" style="width:100%;text-align:center;">Buy</a></div></div></div>';
        pos=pos+1;
        if(pos==3){
          temp+="</div>";
          if(techy[tind]==undefined){
            temp+="Loading . . . ";
          }else{
            temp+=techy[tind];
          }
          pos=0;
          tind+=1;
        }
        end-=1;
        if(end==0){
          break;
        }
      }
      list.innerHTML=temp;
      var dis=list.getElementsByClassName('row');
      for(let j of dis){
        var cs=j.getElementsByClassName('card-text');
        let max=cs[0].clientHeight;
        for(let k of cs){
          if(max<k.clientHeight){
            max=k.clientHeight;
          }
        }
        for(let k of cs){
          k.style.height=max+"px";
        }
  
      }
      for(let j of dis){
        var cs=j.getElementsByTagName('img');
        let max=cs[0].clientHeight;
        for(let k of cs){
          if(max<k.clientHeight){
            max=k.clientHeight;
          }
        }
        for(let k of cs){
          var dif= max-k.clientHeight;
          let pad=dif/2;
          k.style.marginTop=pad+'px';
          k.style.marginBottom=pad+'px';
        }
  
      }
      for(let j of dis){
        var cs=j.getElementsByClassName('card-title');
        let max=cs[0].clientHeight;
        for(let k of cs){
          if(max<k.clientHeight){
            max=k.clientHeight;
          }
        }
        for(let k of cs){
          k.style.height=max+"px";
        }
  
      }
    }
    
  }
  async function inituser(){
    const q = query(collection(db, "images"));
    const qs = await getDocs(q);
    qs.forEach((doc)=>{
      if(doc.id=="banner"){
        let r=doc.data();
        document.getElementById("banner").src=r['link'];
      }
    })
    await render();
    tech();
    setTimeout(render,5000);
    setInterval(render,10000);
  }
  var ren=true;
  var islist=false;
  async function renderer(){
      if(ren==true){
        ren=false;
        render();
        await sleep(3000);
        if(islist==true){
          render();
          islist=false;
        }
        ren=true;
      }else{
        islist=true;
      }
    }
  async function tech(){
    const q = query(collection(db, "content"));
    const qs = await getDocs(q);
    var list=document.getElementById('productinfo');
    var dis=list.getElementsByClassName('row');
    var cont=[];
    qs.forEach((doc)=>{
      cont.push(doc.data());
    });
    for(let i=0;i<dis.length;i++){
      var val=Math.floor(Math.random()*cont.length);
      var card='<br><br><div class="card"><div class="card-header">Featured</div><div class="card-body"><h5 class="card-title">'+cont[val]['title']+'</h5><p class="card-text">'+cont[val]['description']+'</p></div></div><br><br>';
      cont.splice(val,1);
      techy.push(card);
    }
console.log(techy);

  }
  window.onresize=renderer;
  window.inituser=inituser;
  window.tech=tech;