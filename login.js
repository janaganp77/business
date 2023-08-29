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
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  async function admin_login(){
    document.getElementById('warnings').innerHTML="";
    document.getElementById('warnings').innerHTML="";
    var email=document.getElementById('email');
    var password=document.getElementById('password');
    var warn="";
    if(email.value==''||password.value==""){
      warn+="Fill out all Fields";
      if(email.value==""){
        email.focus();
      }else{
        password.focus();
      }
    }
    if(warn!=""){
      document.getElementById('warnings').innerHTML=warn;
      return;
    }
    if(await emailexistadmin(email.value)){
      var q= await getDoc(doc(db,'admin',email.value));
      var data=q.data();
      if(data['password']==password.value){
        document.getElementById('warnings').innerHTML="Login Success";
        document.getElementById('warnings').style.color='green';
        window.sessionStorage.setItem("admin-flight-name",data['name']);
        window.sessionStorage.setItem("admin-flight-email",data['email']);
        window.location.replace("admin.html");
      }else{
        document.getElementById('warnings').innerHTML="Invalid Credentials";
      }
    }else{
      document.getElementById('warnings').innerHTML="Admin Not Found";
    }
  }
  async function emailexistadmin(email){
    document.getElementById('warnings').innerHTML="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var users=collection(db,"admin");
    var q=query(users,where("email","==",email));
    var qs=await getDocs(q);
    while(qs==undefined){
      sleep(100);
    }
      if(qs.empty==true){
        return false;
      }
      return true;
  }
  window.admin_login=admin_login;