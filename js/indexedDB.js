
var moodData = new Array();
/*
window.indexedDB = window.webkitIndexedDB;

// Handle the prefix of Chrome to IDBTransaction/IDBKeyRange.
if ('webkitIndexedDB' in window) {
  window.IDBTransaction = window.webkitIDBTransaction;
  window.IDBKeyRange = window.webkitIDBKeyRange;
}

indexedDB.db = null;
// Hook up the errors to the console so we could see it.
// In the future, we need to push these messages to the user.
indexedDB.onerror = function(e) {
  console.log(e);
};


indexedDB.open = function() {
	  var request = indexedDB.open("MoodiModoDB");

	  request.onsuccess = function(e) {
	    var v = "1.0 beta"; // yes! you can put strings in the version not just
							// numbers
	    moodiModoDB.indexedDB.db = e.target.result;
	    var db = moodiModoDB.indexedDB.db;
	    // We can only create Object stores in a setVersion transaction;
	    if (v!= db.version) {
	      var setVrequest = db.setVersion(v);

	      // onsuccess is the only place we can create Object Stores
	      setVrequest.onfailure = moodiModoDB.indexedDB.onerror;
	      setVrequest.onsuccess = function(e) {
	        if (db.objectStoreNames.contains("moodEntry")) {
	          db.deleteObjectStore("moodEntry");
	        }

	        var store = db.createObjectStore("moodEntry", {keyPath: "timestamp"});
	        var moodIndex = store.createIndex("moodId", "moodId");

	        // Testdata
	        store.put({moodId: 1, timestamp: new Date().getTime()});
	        store.put({moodId: 2, isbn: new Date().getTime() + 50});
	        store.put({moodId: 3, isbn: new Date().getTime() + 100});
	        
	        var transaction = e.target.result;
	        transaction.oncomplete = function() {
	        	moodiModoDB.indexedDB.getAllMoods();
	        }
	      };
	    } else {
	    	moodiModoDB.indexedDB.getAllMoods();
	    }
	  };

	  request.onfailure = moodiModoDB.indexedDB.onerror;
	};

indexedDB.addMood = function(moodId) {
	var db = moodiModoDB.indexedDB.db;
	var trans = db.transaction(['moodEntry'], 'readwrite');
	var store = trans.objectStore('moodEntry');

	var data = {
			"moodId": moodId, // todoText should be visible here
			"timestamp": new Date().getTime()
	};

	var request = store.put(data);

	request.onsuccess = function(e) {
		moodiModoDB.indexedDB.getAllTodoItems();
	};

	request.onerror = function(e) {
		console.log("Error Adding: ", e);
	};
};

function getAllMoods() {
	  // document.getElementById("ourList").innerHTML = "";

	  var i = 0;
	  var request = window.indexedDB.open("todos");
	  request.onsuccess = function(event) 
	  {
	    // Enumerate the entire object store.
	    var db = moodiModoDB.indexedDB.db;
	    var trans = db.transaction(["moodEntry"], 'readonly');
	    var request = trans.objectStore("moodEntry").openCursor();
	    // var ul = document.createElement("ul");
	    
	    request.onsuccess = function(event) 
	    {
	      // This hack is to allow our code to run with Firefox (older
			// versions than 6)
	      var cursor = request.result || event.result;

	      // If cursor is null then we've completed the enumeration - so
			// update the DOM
	      if (!cursor) 
	      {
	        // document.getElementById("ourList").appendChild(ul);
	        return;
	      }

	      moodData[i] = cursor;
	      i++;
	      // var li = document.createElement("div");
	      // li.textContent = "key: " + cursor.key + " => Todo text: " +
			// cursor.value.text;
	      // ul.appendChild(li);
	      cursor.continue();
	    }
	  }
	  
	  return moodData;
	}*/



var dbName = "MoodiModoDB";
//var dbVersion = 6;
var moodiModoDB = {};
var indexedDB = window.webkitIndexedDB;

if ('webkitIndexedDB' in window) {
	// window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}

moodiModoDB.indexedDB = {};
moodiModoDB.indexedDB.db = null;

$(document).bind('pageinit', function() {
	//console.log("-- lets start the party --");
	moodiModoDB.indexedDB.open();
	$("#addItem").click(function() {
		addMood();
	});
});

moodiModoDB.indexedDB.onerror = function(e) {
	console.log(e);
};

moodiModoDB.indexedDB.open = function() 
{
	var request = indexedDB.open(dbName);
	
	request.onsuccess = function(e) 
	{
		//console.log ("success our DB: " + dbName + " is open and ready for work");
		var moodiModoDB = e.target.result;
		return e.target.result;
	};

	request.onupgradeneeded = function(e) 
	{
		var moodiModoDB = e.target.result;
		var db = moodiModoDB;
		//console.log ("Going to upgrade our DB from version: "+ e.oldVersion + " to " + e.newVersion);

		try 
		{
			if (db.objectStoreNames && db.objectStoreNames.contains("moodEntry")) 
			{
				db.deleteObjectStore("moodEntry");
			}
		}
		catch (err) 
		{
			console.log("got err in objectStoreNames:" + err);
		}
		var store = db.createObjectStore("moodEntry",{keyPath: "timestamp"});
		//var authorIndex = store.createIndex("moodId", "moodId");
		//console.log("-- onupgradeneeded store:"+ JSON.stringify(store));
	};
	
	request.onfailure = function(e) 
	{
		console.error("could not open our DB! Err:"+e);  
	};

	request.onerror = function(e) 
	{
		console.error("Well... How should I put it? We have some issues with our DB! Err:"+e);
	};
};

moodiModoDB.indexedDB.addMood = function(moodResult) {
	moodData.push(moodResult);
	var newMoodData = moodData[moodData.length-1];
	
	var request = indexedDB.open(dbName);
	
	request.onsuccess = function(e) {
		//console.log ("success our DB: " + dbName + " is open and ready for work");
		var db = e.target.result;
		
		//var db = moodiModoDB.indexedDB.db;
		var trans = db.transaction("moodEntry", "readwrite");
		var store = trans.objectStore("moodEntry");
		//var timestamp = new Date().getTime() / 1000;
		//console.log("timestamp: " + timestamp);
		var data = {
				"moodId": parseInt(moodResult.moodId, 10),
				"accurateMood": parseInt(moodResult.accurateMood, 10),
				"guilty": parseInt(moodResult.guilty, 10),
				"alert": parseInt(moodResult.alert, 10),
				"afraid": parseInt(moodResult.afraid, 10),
				"excited": parseInt(moodResult.excited, 10),
				"irritable": parseInt(moodResult.irritable, 10),
				"ashamed": parseInt(moodResult.ashamed, 10),
				"attentive": parseInt(moodResult.attentive, 10),
				"hostile": parseInt(moodResult.hostile, 10),
				"active": parseInt(moodResult.active, 10),
				"nervous": parseInt(moodResult.nervous, 10),
				"interested": parseInt(moodResult.interested, 10),
				"enthusiastic": parseInt(moodResult.enthusiastic, 10),
				"jittery": parseInt(moodResult.jittery, 10),
				"strong": parseInt(moodResult.strong, 10),
				"distressed": parseInt(moodResult.distressed, 10),
				"determined": parseInt(moodResult.determined, 10),
				"upset": parseInt(moodResult.upset, 10),
				"proud": parseInt(moodResult.proud, 10),
				"scared": parseInt(moodResult.scared, 10),
				"inspired": parseInt(moodResult.inspired, 10),
				"timestamp": parseInt(moodResult.timestamp, 10)
		};

		var request2 = store.put(data);
	
		request2.onsuccess = function(e) {
			moodiModoDB.indexedDB.getAllTodoItems();
		};
	
		request2.onerror = function(e) {
			console.error("Error Adding an item: ", e);
			moodData.pop(moodResult);
			//TODO: Show message to user
		};
	};
	request.onerror = function () {
	    console.log("Oopsie!");
	};
};

/*moodiModoDB.indexedDB.getTodoItem = function(timestamp) {
	//var todos = document.getElementById("todoItems");
	//todos.innerHTML = "";
	console.log("getting timestamp: " + timestamp);
	var request = indexedDB.open(dbName, dbVersion);
	
	request.onsuccess = function(e) {
		//console.log ("success our DB: " + dbName + " is open and ready for work");
		var db = e.target.result;
		//var db = moodiModoDB.indexedDB.db;
		var trans = db.transaction("moodEntry", "readonly");
		var store = trans.objectStore("moodEntry");
		
		var request2 = store.get(timestamp);
		request2.onerror = function(event) {
		  // Handle errors!
		};
		request2.onsuccess = function(e) {
			// Do something with the request.result!
			//alert("MoodId for timestamp is " + request.result.moodId);
			//localStorage.setItem("detailedMood", request.result);
			//showMoodDetails(request.result);
			var result = request2.result;
			console.log("request result detailed mood: " + result);
			detailedMood = result;
		};
	
		//var request = store.get(timestamp);
		//showMoodDetails(request);
	
		//request.onsuccess = function(e) {
	
		//	console.log("g: ", request.result);
		//	showMoodDetails(request.result);
		//};
	
		//request.onerror = moodiModoDB.indexedDB.onerror;
	}
	request.onerror = function () {
	    console.log("Oppsie!");
	}
};
*/

function renderTodo(i, row) {

    moodData[i] = row;
}

moodiModoDB.indexedDB.getAllTodoItems = function() {
	//var todos = document.getElementById("todoItems");
	//todos.innerHTML = "";

	var request = indexedDB.open(dbName);
	
	request.onsuccess = function(e) {
		//console.log ("success our DB: " + dbName + " is open and ready for work");
		var db = e.target.result;
		
		
		//var db = moodiModoDB.indexedDB.open();
		var trans = db.transaction("moodEntry", "readonly");
		var store = trans.objectStore("moodEntry");
	
		// Get everything in the store;
		var keyRange = IDBKeyRange.lowerBound(0);
		var cursorRequest = store.openCursor(keyRange);
	
		var i = 0;
		
		cursorRequest.onsuccess = function(e) {
			var result = e.result;
			if(!!result == false)
				return;
			
			moodData[i] = result;
			i++;
			result.continue();
		};
	
		cursorRequest.onerror = moodiModoDB.indexedDB.onerror;
	};
	request.onerror = function () {
	    console.log("Oopsie!");
	};
};


function initBarChartData()
{
	var sui=0;
	var sad=0;
	var ok=0;
	var hap=0;
	var ecs=0;
	
	var mood;
    var moodsNumber = moodData.length;
    for (i = 0; i < moodsNumber; i++) 
    {
       mood = moodData[i];
       if(mood.moodId == 0)
       {
    	   sui=sui+1;
       }
       else if(mood.moodId == 1)
       {
    	   sad=sad+1;
       }
       else if(mood.moodId == 2)
       {
    	   ok=ok+1;
       }
       else if(mood.moodId == 3)
       {
    	   hap=hap+1;
       }
       else if(mood.moodId == 4)
       {
    	   ecs=ecs+1;
       }
    }
    
    barChartData[0] = parseInt(sui, 10);
    barChartData[1] = parseInt(sad, 10);
    barChartData[2] = parseInt(ok, 10);
    barChartData[3] = parseInt(hap, 10);
    barChartData[4] = parseInt(ecs, 10);
}

function initLineChartData()
{
	var mood;
    var moodsNumber = moodData.length;
    for (i = 0; i < moodsNumber; i++) 
    {
       mood = moodData[i];
       if(mood.moodId == 0)
       {
    	   lineChartData[i] = 0;
       }
       else if(mood.moodId == 1)
       {
    	   lineChartData[i] = 1;
       }
       else if(mood.moodId == 2)
       {
    	   lineChartData[i] = 2;
       }
       else if(mood.moodId == 3)
       {
    	   lineChartData[i] = 3;
       }
       else if(mood.moodId == 4)
       {
    	   lineChartData[i] = 4;
       }
    }
}

function initMoodData()
{
	if(moodData.length == 0)
	{
		moodiModoDB.indexedDB.getAllTodoItems();
	}
	initLineChartData();
	initBarChartData();
}

function saveMood(moodId, manually)
{
	setMoodId(moodId);
	var moodEntry1 = new moodEntry(questionAnswers);
	moodiModoDB.indexedDB.addMood(moodEntry1);

	if(manually == "true" || manually == true)
	{
		parent.history.back();
	}
	else if(manually == "false" || manually == false)
	{
		tizen.application.getCurrentApplication().exit();
	}
}
