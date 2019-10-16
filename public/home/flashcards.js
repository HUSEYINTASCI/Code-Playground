


//User ip
var usrip;
// User city
var ucity;
// User Langitute
var lan;
// User Longitute
var lon;
// User question
var que;
//User Answer
var ans;
//For flash card user name
var owner;
//Uniqe id for creating flashcard
var id;
//User city
var userc;
// User name
var us;
//Classmate id
var classmateid;
//Flashcard question
var question;
//Flashcard Answer
var ansver;
//For Showing pools
const lspool = document.querySelector("#myflashcard");
//For Showing classmates
const userlist = document.querySelector("#userlist");
let uname; 
//for classmates flashcard
let own;
//Taking id
var lookid;
//Taking flashcard owner
var lookowner;

// Database connection
$(document).ready(function () {
    var firebaseConfig = {
      apiKey: "AIzaSyDEvybQhM7ZXpG9EgEPS7mp1VRVDyEx1dA",
      authDomain: "flashcard-5e3f1.firebaseapp.com",
      databaseURL: "https://flashcard-5e3f1.firebaseio.com",
      projectId: "flashcard-5e3f1",
      storageBucket: "",
      messagingSenderId: "638770178723",
      appId: "1:638770178723:web:06c3d146958e504c"
    };
  
    firebase.initializeApp(firebaseConfig);
  
    var uconnect = firebase.auth();
    var data = firebase.firestore();
  
  
   
    
    //-------------------------------------------------------------------------------------------------------
  
    //  Listed Pool
    //-------------------------------------------------------------------------------------------------------
    function listpool(doc) {
      let li = document.createElement("li");
      let queid = document.createElement("span");
      let owner = document.createElement("span");
      let flashque = document.createElement("span");
  
      li.setAttribute("id", doc.id);
      queid.textContent = doc.data().queid;
      owner.textContent = doc.data().owner;
      flashque.textContent=doc.data().que;
      li.appendChild(queid);
      li.appendChild(flashque);
      li.appendChild(owner);
      lspool.appendChild(li);
  
    }
    
    //---------------------------------------------------------------------------------------------------------------------------------
  
    // Show Pool function
    function shwpool() {
      data.collection("flashcardpool").orderBy("que").onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type == "added") {
            listpool(change.doc);
          } else if (change.type == "removed") {
            let li = lspool.querySelector("[id=" + change.doc.id + "]");
            lspool.removeChild(li);
          }
        });
      });
  
  
    }
    shwpool();
  
  //--------------------------------------------------------------------------------------------------------------------------------------
  });