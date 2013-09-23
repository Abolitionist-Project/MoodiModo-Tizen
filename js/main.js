
//Mood Notification
var appControl = new tizen.ApplicationControl(
		"http://tizen.org/appcontrol/operation/report_mood",
		null);

var notificationDict = {
		content : "Click here to report your mood",
		iconPath : "images/image1.jpg",
		vibration : true,
		appControl : appControl,
};
var moodNotification = new tizen.StatusNotification("SIMPLE",
         "MoodiModo", notificationDict);
var historyData = new Array();

//--------------radiobuttons--------------//
var getCheckedValue = function(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
		{
			return radioObj.value;
		}	
		else
		{
			return "";
		}
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

function setCheckedValue(radioObj, newValue) {
	console.log("setCheckedValue() called");

	for(var i = 0; i < 5; i++) {
		console.log("in for loop : " + i);
		if(radioObj[i].value == newValue.toString()) {
			setMoodNotificationInterval(radioObj[i].value);
			$("#radio-" + i).prop("checked", true).checkboxradio("refresh");
			console.log("checkedRadio: " + radioObj[i].value);
			console.log("moodNotificationInterval: " + getMoodNotificationInterval());
			//localStorage.s
		}
		else 
		{
			$("#radio-" + i).prop("checked", false).checkboxradio("refresh");
		}
	}
	console.log("end");
}

//-------MoodNotification interval-------//
function getMoodNotificationInterval()
{
	if(localStorage.getItem("moodNotificationInterval") != null)
	{
		return localStorage.getItem("moodNotificationInterval");
	}
	else
	{
		localStorage.setItem("moodNotificationInterval", 2);
		return localStorage.getItem("moodNotificationInterval");
	}
}

function setMoodNotificationInterval(value)
{
	localStorage.setItem("moodNotificationInterval", value);
	setMoodAlarm();
}

$(document).delegate('#settings_moodNotification', 'pageshow', function() {
	console.log("settings moodnotifi pageshow called");
	setCheckedValue(document.forms['notificationOptionsForm'].elements['notificationOption'], getMoodNotificationInterval());
});

function fillHistory()
{
	//getMoodData();
	console.log("mooddata length: " + historyData.length);

	for(var i = 0; i < historyData.length; i++)
	{
		console.log("in for");
		addElementToHistory(historyData[i], i);
	}
}

function addElementToHistory(mood, i)
{
	console.log("adding element: " + mood.timestamp);
	var moodName;
	var moodDate = parseInt(mood.timestamp*1000, 10);
	console.log("mooddate: " + moodDate);
	var date = new Date(moodDate);

	console.log("found moodId: " + mood.moodId);
	var dateString = dateToDMYHMS(date);
	var moodName = new Array(5);
	moodName[0]="Suicidal";
	moodName[1]="Sad";
	moodName[2]="OK";
	moodName[3]="Happy";
	moodName[4]="Ecstatic";
	
	moodName = moodName[mood.moodId];
	$('#historyList').append("<li id='" + i + "' class='ui-li-has-multiline'><a href='mood_details.html' onclick='moodiModoDB.indexedDB.getTodoItem( " + mood.timestamp + ")'>" +
			moodName + "<span class='ui-li-text-sub'>" + dateString + "</span></div></a></li>");
}

function addElementToMoodDetails(moodId, name)
{
	var moodName = new Array(5);
	moodName[0]="Suicidal";
	moodName[1]="Sad";
	moodName[2]="OK";
	moodName[3]="Happy";
	moodName[4]="Ecstatic";
	
	var questionMoodRating = new Array(5);
	questionMoodRating[0]="Not at all";
	questionMoodRating[1]="A little bit";
	questionMoodRating[2]="Moderately";
	questionMoodRating[3]="Very";
	questionMoodRating[4]="Extremely";
	
	//console.log(name + " " + moodId);
	if(name == "moodId")
	{
		$('#moodDetails').append("<li id='Mood rating' class='ui-li-has-multiline'>Mood Rating<span class='ui-li-text-sub'>" + moodName[moodId] + "</span></div></li>");
	}
	else if(name == "accurateMood")
	{
		$('#moodDetails').append("<li id='Accurate mood' class='ui-li-has-multiline'>Accurate mood<span class='ui-li-text-sub'>" + moodId + "%</span></div></li>");
	}
	else
	{
		$('#moodDetails').append("<li id='" + name + "' class='ui-li-has-multiline'>" +
				capitalize(name) + "<span class='ui-li-text-sub'>" + questionMoodRating[moodId] + "</span></div></li>");
	}
}

function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}

function showMoodDetails(moodEntry)
{
	//TODO Get moodEntry from DB
	//TODO Loop through all columns and get values
	//TODO show values by adding them to the page like below\/\/

	var x;
	var text = "";
	for(x in moodEntry)
	{
		if(x != "timestamp" && moodEntry[x] != NaN && moodEntry[x] != "NaN" && moodEntry[x] != null && moodEntry[x] != "null" && moodEntry[x] != -1)
		{
			text=text+", " + x + ": " + moodEntry[x];
			addElementToMoodDetails(moodEntry[x], x);
		}
	}	
	console.log(text);
	//$('#moodDetails').append("<h2 id='pageHeader'> testest</h2>");

	//$.mobile.changePage("mood_details.html");
	

	//		moodName + "<span class='ui-li-text-sub'>" + dateString + "</span></div></a></li>");
}



function dateToDMYHMS(date) {
	var weekday=new Array(7);
	weekday[0]="Sunday";
	weekday[1]="Monday";
	weekday[2]="Tuesday";
	weekday[3]="Wednesday";
	weekday[4]="Thursday";
	weekday[5]="Friday";
	weekday[6]="Saturday";
	
	function pad(n){return n<10 ? '0'+n : n}
	
	var dayName = weekday[date.getDay()];
	var hour = pad(date.getHours());
	var minutes = pad(date.getMinutes());
	var seconds = pad(date.getSeconds());

	return dayName + ", " + date.toLocaleDateString() + " " + hour + ":" + minutes + ':' + seconds;
	
}

function welcomeWizardCompleted() {

	//var timestamp = new Date().getTime() / 1000;
	//saveMood(localStorage.getItem("firstMood"));

	//console.log("first mood stored with timestamp: " + timestamp + " and moodId: " + localStorage.getItem("firstMood"));
	//localStorage.setItem("firstStartup", false);
	//localStorage.removeItem("firstMood");
}

function exitApplication() {
	tizen.application.getCurrentApplication().exit();
}

function saveMoodQuestions() {
	moodentry = new moodEntry(questionAnswers);
}

function finishMoodReporting(manually) {
	entry = new moodEntry(questionAnswers);
	moodiModoDB.indexedDB.addMood(entry);
	if(manually == "false" || manually == false) 
	{
		tizen.application.getCurrentApplication().exit();
	}
	else if(manually == "true" || manually == true) 
	{
		$.mobile.changePage("#home");
	}
	
	resetQuestionAnswers();
}
//------------------init------------------//

var init = function() {
	$('div[data-role="page"]:first .ui-btn-back').bind("click",
			function(event) {
				var currentApp = tizen.application.getCurrentApplication();
				currentApp.exit();
			});
	
	document.addEventListener('tizenhwkey', function(e) 
    {
    var activePage = $('.ui-page-active').attr('id');
		if (e.keyName === 'back') 
		{
			if(activePage === 'home')
			{
				console.log("home");
				tizen.application.getCurrentApplication().exit();
			}
			else 
			{
				console.log("here");
				$.mobile.back();
				//parent.history.back();
			}
		}
        else if (e.keyName === 'menu') 
        {
        	//TODO: open menu popup
        	/*if(activePage === 'home')
			{
        		$('#menuPopupHome').popup('open');
			}
        	else if(activePage === 'history')
			{
        		$('#menuPopupHistory').popup('open');
			}
        	else if(activePage === 'moodReport')
			{
        		$('#menuPopupReporting').popup('open');
			}*/
        }
	});
	console.log("init() called");
	
	tizen.alarm.removeAll();
	
	//var alarm = new tizen.AlarmRelative(0.3*tizen.alarm.PERIOD_MINUTE);
	//tizen.alarm.add(alarm, tizen.application.getCurrentApplication().appInfo.id, appControl);
	
	var alarms = tizen.alarm.getAll();
	console.log(alarms.length + " alarms present in the storage.");
	
	
	
	
	
	/*try
		tizen.notification.post(moodNotification);
		var alarms = tizen.alarm.getAll();
		
		console.log(alarms.length + " alarms present in the storage.");
	}
    catch (e)
    {
        console.log("Exception: " + e);
    }*/
	console.log("storage: " + getMoodNotificationInterval());
	console.log("moodNotificationInterval: " + getMoodNotificationInterval());	

};

/*$(document).bind("mobileinit", function(){
    $.mobile.autoInitialize = false;
  });

$(document).ready(function(){
	var firstStartup = localStorage.getItem("firstStartup");
	if(firstStartup===null || firstStartup=="true")
	{
		alert("first startup");
		$.mobile.changePage("welcome.html");
	}
	else
	{
		$.mobile.initializePage();
		alert("not first startup");
	}
});*/



//TODO: conditional init for welcome wizard
$(document).delegate('#home', 'pagebeforecreate', function() {
	var firstStartup = localStorage.getItem("firstStartup");
	if(firstStartup===null || firstStartup=="true")
	{
		//alert("first startup");
		$.mobile.changePage("welcome.html");
		
	}
	else
	{
		//alert("not first startup");
	}
});

$( "#historyList" ).listview({
	   create: function(event, ui) {  }
	});

$(document).bind('pageinit', init);

//----------------------------------------//
$(document).delegate('#history', 'pagecreate', function() {
	//historyData = getMoodData();
	//fillHistory();
});

$(document).delegate('#history', 'pageshow', function() {
	historyData = moodData;
	$("#historyList").empty();
	fillHistory();
	$('#historyList').listview('refresh');
});

$(document).delegate('#mood_details', 'pageshow', function() {

	$("#moodDetails").empty();
	showMoodDetails(detailedMood);
	$('#moodDetails').listview('refresh');
});