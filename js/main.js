
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

	/*console.log("in for");
	document.getElementById("historyList").innerHTML += "<li id='0' class='ui-li-has-multiline'><a href='settings_moodNotification.html'>" +
	"Ask for your mood <span class='ui-li-text-sub'>Every three hours</span> <div data-role='button' data-inline='true' data-icon='arrow-r' " +
	"data-style='circle' href='settings_moodNotification.html'></div></a></li>";*/
}

function addElementToHistory(mood, i)
{
	console.log("adding element: " + mood.timestamp);
	var moodName;
	var moodDate = parseInt(mood.timestamp*1000, 10);
	console.log("mooddate: " + moodDate);
	var date = new Date(moodDate);

	console.log("mooddate offset: " + date.getTimezoneOffset());
	var dateString = dateToDMYHMS(date);
	var moodName = new Array(5);
	moodName[0]="Suicidal";
	moodName[1]="Sad";
	moodName[2]="OK";
	moodName[3]="Happy";
	moodName[4]="Ecstatic";
	
	moodName = moodName[mood.mood];
	$('#historyList').append("<li id='" + i + "' class='ui-li-has-multiline'>" +
			moodName + "<span class='ui-li-text-sub'>" + dateString + "</span></div></li>");
	
	
//	document.getElementById("historyList").innerHTML += "<li id='" + i + "' class='ui-li-has-multiline'><a href='settings_moodNotification.html'>" +
//	moodName + "<span class='ui-li-text-sub'>" + dateString + "</span></div></a></li>";
	//" " + date.toLocaleTimeString() + 
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

	//TODO check if < 9, if so: add 0
	return dayName + ", " + date.toLocaleDateString() + " " + hour + ":" + minutes + ':' + seconds;
	
}
/*
function addElementToHistory(mood, i)
{
	var moodName;
	var moodDate = new Date();
	moodDate.setSeconds(mood.timestamp, 0);

	var dateString = dateToDMYHSM(moodDate);
	
	if(mood.mood == 0)
	{
		moodName = "Suicidal";
	}
	if(mood.mood == 1)
	{
		moodName = "Sad";
	}
	if(mood.mood == 2)
	{
		moodName = "OK";
	}
	if(mood.mood == 3)
	{
		moodName = "Happy";
	}
	if(mood.mood == 4)
	{
		moodName = "Ecstatic";
	}
	document.getElementById("historyList").innerHTML += "<li id='" + i + "' class='ui-li-has-multiline'><a href='settings_moodNotification.html'>" +
	moodName + "<span class='ui-li-text-sub'>" + dateString + "</span></div></a></li>";
}
 */
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
						tizen.application.getCurrentApplication().exit();
					}
					else 
					{
						parent.history.back();
					}
				}
		        else if (e.keyName === 'menu') 
		        {
		           console.log('in the menu yay');
		        }
			});
	console.log("init() called");
	
	tizen.alarm.removeAll();
	var alarms = tizen.alarm.getAll();
	console.log(alarms.length + " alarms present in the storage.");
	/*try
	{	
		console.log("app id: " + tizen.application.getCurrentApplication().appInfo.id);
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
	historyData = getMoodData();
	$("#historyList").empty();
	fillHistory();
	$('#historyList').listview('refresh');
});


//TODO fillHistory() on page init/beforeshow without losing css...
