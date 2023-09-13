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
  var updimgg="";
  var updv="";
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  async function addproduct(){
    document.getElementById('warnings').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var name=document.getElementById('pname');
    var link=document.getElementById('plink');
    var description=document.getElementById('pdescription');
    var image=document.getElementById('pimage');
    if(name.value==""||link.value==""||description.value==""||image.value==""){
      document.getElementById('warnings').innerHTML="Fill all fields";
      if(name.value==""){
        name.focus();
      }else if(link.value==""){
        link.focus();
      }else if(description.value==""){
        description.focus();
      }else if(image.value==""){
        image.focus();
      }
    }else{
      let image1=image.files[0];
      let image2=new FileReader();
      image2.readAsDataURL(image1);
      var dat="";
      image2.onload=function(){
        dat=image2.result;
      }
    var q=query(collection(db,"product"));
    var qs=await getDocs(q);
    var tour=await itourl(String(updimgg));
    await setDoc(doc(db,"product",String(new Date().getTime())),{
      "name":name.value,
      "link":link.value,
      "description":description.value,
      "image":itourl(String(dat)),
      "open":1,
      "id":String(new Date().getTime()),
      "ts":new Date().getTime()
    });
    document.getElementById('warnings').innerHTML="<span class='text-success'>Product added</span>";
    await sleep(1000);
    name.value="";
    link.value="";
    description.value="";
    image.value="";
    document.getElementById('warnings').innerHTML="";
    document.getElementById('productaddclose').click();
}
  }
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
    for(let i=pro.length-1;i>=0;i--){
      if(pos==0){
        temp+="<div class='row'>";
      }
      temp+="<div class='col-lg-4' style='padding:5px;'>";
      temp+='<div class="card" style="background:#e8e8e8;width: 100%;height:100%;"><img style="width:90%;padding:10px;padding-top:2vh;display:block;margin:auto;height:33vh;" src="'+pro[i]['image']+'" class="card-img-top" alt="'+pro[i]['name']+'"><div class="card-body"><h6 style="text-align:center;font-weight:600;font-size:x-large;" class="card-title">'+pro[i]['name']+'</h6><p style="background:white;border:1px solid black;padding:10px;text-align:left;overflow:hidden;" class="card-text">'+pro[i]['description']+'</p><a target="_blank" href="'+pro[i]['link']+'" class="btn btn-primary" style="width:30%;text-align:center;">Buy</a><a class="btn btn-danger" style="width:30%;text-align:center;margin:5%;" onclick="deletep('+pro[i]['id']+')">Delete</a><a class="btn btn-success" onclick="updatep('+pro[i]['id']+')" style="width:30%;text-align:center;">Edit</a></div></div></div>';
      pos+=1;
      if(pos==3){
        temp+="</div>"
        pos=0;
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
async function verify(){
  let valid=0;
  var email=window.sessionStorage.getItem("admin-flight-email");
  var name=window.sessionStorage.getItem("admin-flight-name");
  var users=collection(db,"admin");
    var q=query(users,where("email","==",email));
    var qs=await getDocs(q);
    qs.forEach((doc)=>{
      let d=doc.data();
      if(d['name']==name){
        valid = 1;
        return;
      }
    });
    if(valid==0){
      document.write("Found unauthorized access (or) Session Expired");
      await sleep(7000);
      window.sessionStorage.clear();
      window.location.replace('login.html');
    }

}
function initadmin(){
  verify();
  render();
  setInterval(render,100000);
  setInterval(verify,30000);
}
async function deletep(int){
  await setDoc(doc(db,"product",String(int)),{
    "open":0
  });
  render();
}
async function updatep(int){
  let d=await getDoc(doc(db,"product",String(int)));
  d=d.data();
  document.getElementById('pnamedet').value=d['name'];
  document.getElementById('plinkdet').value=d['link'];
  document.getElementById('pdescriptiondet').value=d['description'];
  document.getElementById('proimg').src=d['image'];
  document.getElementById('pimagedet').value="";
  document.getElementById('pvbtn').click();
  updimgg=d['image'];
  updv=String(int);
}
async function updateproduct(){
  let name=document.getElementById('pnamedet').value;
  let link=document.getElementById('plinkdet').value;
  let description=document.getElementById('pdescriptiondet').value;
  if(name==""||link==""||description==""){
    document.getElementById('warnings1').innerHTML="<br>Fill all fields";
    return;
  }
  var tour=await itourl(String(updimgg));
  console.log(tour);
  await setDoc(doc(db,"product",updv),{
    "name":name,
    "link":link,
    "description":description,
    "image":tour
  },{merge:true});
  document.getElementById('warnings1').innerHTML="<span class='text-success'><br>Product Updated</span>";
  await sleep(3000);
  render();
  document.getElementById('productviewclose').click();
  document.getElementById('warnings1').innerHTML="";
}
function imgchg(){
  let imgg=document.getElementById('pimagedet').files[0];
  let fr=new FileReader();
  fr.readAsDataURL(imgg);
  fr.onload=function (){
    document.getElementById('proimg').src=fr.result;
    updimgg=fr.result;
  }
}
function tourl(sou){
  let xhr=new XMLHttpRequest();
  xhr.open("POST","https://freeimage.host/api/1/upload");
  var data=new FormData();
  data.append('key','6d207e02198a847aa98d0a2a901485a5');
  data.append('source',String(sou));
  data.append('format','json');
  xhr.send(data);
  xhr.onload=function(){
    console.log(xhr.response);
  }
  return sou;
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
async function itourl(data){
try{
var b64=String(data).split(',')[1];
if(b64.length==1){
return data;
}
}
catch(e){
var b64=String(data);
return String(b64);
}
var xhr=new XMLHttpRequest();
xhr.open('post','https://api.imgbb.com/1/upload');
var fd=new FormData();
fd.append('key','4d6f023b8c8dd3664e1c25bfdb2eb482');
fd.append('image',b64);
xhr.send(fd);
while(true){
  await sleep(1000);
  if(xhr.readyState==4){
    var res=xhr.response;
    res=JSON.parse(res);
    return String(res['data']['url']);
  }
}
}
window.addproduct=addproduct;
window.initadmin=initadmin;
window.deletep=deletep;
window.updatep=updatep;
window.imgchg=imgchg;
window.updateproduct=updateproduct;
window.onresize=renderer;