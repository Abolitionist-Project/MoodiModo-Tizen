/**
 * DBManager class for storing and retrieving data from, and managing, the shopping list application's database.
 */
var self = this;
var moodData = new Array();

self.createMoodsStatement = "CREATE TABLE IF NOT EXISTS moods (timestamp TEXT PRIMARY KEY NOT NULL UNIQUE, mood INTEGER)";

self.insertMoodStatement = "INSERT OR REPLACE INTO moods VALUES (?,?)";

self.selectSingleMoodStatement = "SELECT * FROM moods WHERE timestamp = ?";
self.selectCountSingleMoodStatement = "SELECT COUNT(*) AS totalcount FROM moods WHERE mood = ?";
self.selectAllMoodDataStatement = "SELECT * FROM moods";

self.orderMoodsDesc = " ORDER BY timestamp DESC";
self.orderMoodsAsc = " ORDER BY timestamp ASC";

self.onError = function(tx, error) {
    console.log("[ERR] DBmanager: "+error.message);
};

self.onSuccess = function(tx, result) {
};

self.createTables = function() {
    self.db.transaction(function(tx) {
        tx.executeSql(self.createMoodsStatement, [], self.onSuccess, self.onError);
    });
};

self.insertMood = function(timestamp, mood) {
    self.db.transaction(function(tx) {
         tx.executeSql(self.insertMoodStatement, [timestamp, mood], self.onSuccess, self.onError);
    });
};

self.selectAllMoodData = function(callback) {
    self.db.transaction(function(tx) {
         tx.executeSql(
             self.selectAllMoodDataStatement,
             [],
             function(tx, result) {
                 var dataset = result.rows;
                 callback(dataset);
             },
             self.onError);
    });
};

self.selectSingleMood = function(timestamp, callback) {
    self.db.transaction(function(tx) {
        tx.executeSql(
            self.selectSingleMoodStatement,
            [timestamp],
            function(tx, result) {
                var dataset = result.rows;
                callback(dataset);
            },
            self.onError);
   });
};

self.selectCountSingleMood = function(mood, callback) {
    self.db.transaction(function(tx) {
        tx.executeSql(
            self.selectCountSingleMoodStatement,
            [mood],
            function(tx, result) {
                var dataset = result.rows;
                callback(dataset);
            },
            self.onError);
   });
};

self.db = openDatabase("MoodiModoDB", "0.1", "MoodiModo Database", 2 * 1024 * 1024);
self.createTables();
console.log("database opened");

/*function fillDatabase()
{
	console.log("tables created");
	self.insertMood("1338585185539", 4);
	self.insertMood("1338564915539", 2);
	self.insertMood("1338564998539", 3);
	self.insertMood("1338564998539", 3);
	self.insertMood("1338865424539", 3);
	self.insertMood("1923966654539", 3);
	self.insertMood("1396564998539", 1);
}*/

/*self.selectSingleMood("1338564998539", function(callback)
{
	var book;
    var booksNumber = callback.length;
    for (i = 0; i < booksNumber; i++) 
    {
       book = callback.item(i);
       alert("timestamp: " + book.timestamp + ", mood: " + book.mood);
    }
});

self.selectCountSingleMood(3, function(callback)
{
	var book;
    var booksNumber = callback.length;
    for (i = 0; i < booksNumber; i++) 
    {
       book = callback.item(i);
       console.log("single selected mood count mood 3: " + book.totalcount);
    }
});
*/

function getMoodData()
{
	self.selectAllMoodData(function(callback)
	{
		var book;
	    var booksNumber = callback.length;
	    for (i = 0; i < booksNumber; i++) 
	    {
	       book = callback.item(i);
	       moodData[i] = book;
	    }
	});
	return moodData;
}

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
       if(mood.mood == 0)
       {
    	   sui=sui+1;
       }
       else if(mood.mood == 1)
       {
    	   sad=sad+1;
       }
       else if(mood.mood == 2)
       {
    	   ok=ok+1;
       }
       else if(mood.mood == 3)
       {
    	   hap=hap+1;
       }
       else if(mood.mood == 4)
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
       if(mood.mood == 0)
       {
    	   lineChartData[i] = 0;
       }
       else if(mood.mood == 1)
       {
    	   lineChartData[i] = 1;
       }
       else if(mood.mood == 2)
       {
    	   lineChartData[i] = 2;
       }
       else if(mood.mood == 3)
       {
    	   lineChartData[i] = 3;
       }
       else if(mood.mood == 4)
       {
    	   lineChartData[i] = 4;
       }
    }
}


/*function setBarChartData()
{
	self.selectAllMoodData(function(callback)
	{
		//Put all moods in data array
		//Create 2 seperate functions: getBarChartData & getLineChartData
		var sui=0;
		var sad=0;
		var ok=0;
		var hap=0;
		var ecs=0;
		
		var book;
	    var booksNumber = callback.length;
	    for (i = 0; i < booksNumber; i++) 
	    {
	       book = callback.item(i);
	       if(book.mood == 0)
	       {
	    	   sui=sui+1;
	    	   console.log("count mood 0: " + sui);
	       }
	       else if(book.mood == 1)
	       {
	    	   sad=sad+1;
	    	   console.log("count mood 1: " + sad);
	       }
	       else if(book.mood == 2)
	       {
	    	   ok=ok+1;
	    	   console.log("count mood 2: " + ok);
	       }
	       else if(book.mood == 3)
	       {
	    	   hap=hap+1;
	    	   console.log("count mood 3: " + hap);
	       }
	       else if(book.mood == 4)
	       {
	    	   ecs=ecs+1;
	    	   console.log("count mood 4: " + ecs);
	       }
	    }
	    
	    var chartData = [];
	    chartData[0] = parseInt(sui, 10);
	    chartData[1] = parseInt(sad, 10);
	    chartData[2] = parseInt(ok, 10);
	    chartData[3] = parseInt(hap, 10);
	    chartData[4] = parseInt(ecs, 10);
		return chartData;
		console.log("barChartData DB: " + data[3]);
	});
}*/

function saveMood(mood, manually)
{
	
	if(manually == "true" || manually == true)
	{
		var timestamp = new Date().getTime() / 1000;
		self.insertMood(timestamp, mood);
		console.log("new mood stored with timestamp: " + timestamp + " and moodId: " + mood);
		alert("Your reported mood has been saved.");
		parent.history.back();
	}
	else if(manually == "false" || manually == false)
	{
		var timestamp = new Date().getTime() / 1000;
		self.insertMood(timestamp, mood);
		console.log("new mood stored with timestamp: " + timestamp + " and moodId: " + mood);
		tizen.application.getCurrentApplication().exit();
	}	
	else
	{
		localStorage.setItem("firstMood", mood);
		console.log("first mood welcome wizard with moodId: " + mood);
	}
}

/*function saveMood(mood)
{
	var timestamp = Math.round(new Date().getTime() / 1000);
	self.insertMood(timestamp, mood);
	console.log("new mood stored with timestamp: " + timestamp + " and moodId: " + mood);
	tizen.application.getCurrentApplication().exit();
}*/

$(document).delegate('#home', 'pagebeforeshow', function() {
	console.log("db manager pagebeforeshow");
	getMoodData();
	console.log("db manager moods obtained from db");
});
