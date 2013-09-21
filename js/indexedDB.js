
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
			"timeStamp": new Date().getTime()
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
var dbVersion = 4;
var moodiModoDB = {};
var indexedDB = window.webkitIndexedDB

if ('webkitIndexedDB' in window) {
	// window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}

moodiModoDB.indexedDB = {};
moodiModoDB.indexedDB.db = null;

$(document).bind('pageinit', function() {
	console.log("-- lets start the party --");
	moodiModoDB.indexedDB.open();
	$("#addItem").click(function() {
		addMood();
	});
});

moodiModoDB.indexedDB.onerror = function(e) {
	console.log(e);
};

moodiModoDB.indexedDB.open = function() {
	var request = indexedDB.open(dbName, dbVersion);

	request.onsuccess = function(e) {
		console.log ("success our DB: " + dbName + " is open and ready for work");
		moodiModoDB.indexedDB.db = e.target.result;
		moodiModoDB.indexedDB.getAllTodoItems();
	}

	request.onupgradeneeded = function(e) {
		moodiModoDB.indexedDB.db = e.target.result;
		var db = moodiModoDB.indexedDB.db;
		console.log ("Going to upgrade our DB from version: "+ e.oldVersion + " to " + e.newVersion);

		try {
			if (db.objectStoreNames && db.objectStoreNames.contains("moodEntry")) {
				db.deleteObjectStore("moodEntry");
			}
		}
		catch (err) {
			console.log("got err in objectStoreNames:" + err);
		}
		var store = db.createObjectStore("moodEntry",{keyPath: "timestamp"});
		//var authorIndex = store.createIndex("moodId", "moodId");
		console.log("-- onupgradeneeded store:"+ JSON.stringify(store));
	}
	
	request.onfailure = function(e) {
		console.error("could not open our DB! Err:"+e);  
	}

	request.onerror = function(e) {
		console.error("Well... How should I put it? We have some issues with our DB! Err:"+e);
	}
};

moodiModoDB.indexedDB.addMood = function(moodResult) {
	var db = moodiModoDB.indexedDB.db;
	var trans = moodiModoDB.indexedDB.db.transaction("moodEntry", "readwrite");
	var store = trans.objectStore("moodEntry");

	var data = {
			"timestamp": new Date().getTime() / 1000,
			"moodId": moodResult
	};

	var request = store.put(data);

	request.onsuccess = function(e) {
		moodiModoDB.indexedDB.getAllTodoItems();
	};

	request.onerror = function(e) {
		console.error("Error Adding an item: ", e);
	};
};

function renderTodo(i, row) {

    moodData[i] = row;
    // And lets create the new il item with its markup
    $("#todoItems").trigger('create'); 
  }

moodiModoDB.indexedDB.deleteTodo = function(id) {
	var db = moodiModoDB.indexedDB.db;
	var trans = db.transaction("moodEntry", "readwrite");
	var store = trans.objectStore("moodEntry");

	var request = store.delete(id);

	request.onsuccess = function(e) {
		moodiModoDB.indexedDB.getAllTodoItems();
	};

	request.onerror = function(e) {
		console.error("Error deleteing: ", e);
	};j
};

moodiModoDB.indexedDB.getAllTodoItems = function() {
	//var todos = document.getElementById("todoItems");
	//todos.innerHTML = "";

	var db = moodiModoDB.indexedDB.db;
	var trans = db.transaction("moodEntry", "readonly");
	var store = trans.objectStore("moodEntry");

	// Get everything in the store;
	var keyRange = IDBKeyRange.lowerBound(0);
	var cursorRequest = store.openCursor(keyRange);

	var i = 0;
	
	cursorRequest.onsuccess = function(e) {
		var result = e.target.result;
		if(!!result == false)
			return;

		renderTodo(i, result.value);
		i++;
		result.continue();
	};

	cursorRequest.onerror = moodiModoDB.indexedDB.onerror;
};

function getBarChartData()
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

function getLineChartData()
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

function saveMood(moodId, manually)
{
	if(manually == "true" || manually == true)
	{
		moodiModoDB.indexedDB.addMood(moodId);
		//console.log("new mood stored with timestamp: " + timestamp + " and moodId: " + moodId);
		//alert("Your reported mood has been saved.");
		parent.history.back();
	}
	else if(manually == "false" || manually == false)
	{
		moodiModoDB.indexedDB.addMood(moodId);
		//console.log("new mood stored with timestamp: " + timestamp + " and moodId: " + mood);
		tizen.application.getCurrentApplication().exit();
	}
	else
	{
		moodiModoDB.indexedDB.addMood(moodId);
		localStorage.setItem("firstStartup", false);
	}
}
