var updateTaskUIStatus = false; //false - collapsed; true - open
var toggleUpdateTaskUI = function() {
    //expands the update Task User Interface
    if(updateTaskUIStatus) {
        document.getElementById("update-task-container").style.display = "block";
    } else {
        document.getElementById("update-task-container").style.display = "none";
    }
    updateTaskUIStatus ^= 1;
}

var populateUpdateTaskUI = function(data) {
    updateHiddenInputDataHolder = document.getElementById("update-hidden-input-data-holder");
    updateHiddenInputDataHolder.setAttribute("taskId", data.id);
    updateHiddenInputDataHolder.setAttribute("taskContent", data.content);
    updateHiddenInputDataHolder.setAttribute("taskCreatedDate", data.date_created);
    var updateContentInput = document.getElementById("update-content");
    //also attach an event listener to updateContentInput such that whenever user changes the content 
    //updateHiddenInputDataHolder data is updated
    updateContentInput.addEventListener("change", function(event) {
        updateHiddenInputDataHolder.setAttribute("taskContent", event.target.value);
    })
    updateContentInput.value = data.content;
}



var updateTaskDoneButton = document.getElementById("update-task-done-button");
updateTaskDoneButton.addEventListener("click", function(event) {
    var updateSpinnerStatus = false //false- not showing; true- showing
    var toggleUpdateTextSpinner = function() {
        if(updateSpinnerStatus) {
            document.getElementById("update-spinner").style.display = "block";
        } else {
            document.getElementById("update-spinner").style.display = "none";
        }
    }
    updateTaskContent = document.getElementById("update-content").innerText;
    //TODO validate TaskContent 
    toggleUpdateTextSpinner();
    //get taskData from hiddenInputDataHolder
    var updateHiddenInputDataHolder = document.getElementById("update-hidden-input-data-holder");
    taskData = {
        id:updateHiddenInputDataHolder.getAttribute("taskId"),
        content:updateHiddenInputDataHolder.getAttribute("taskContent"),
        date_created:updateHiddenInputDataHolder.getAttribute("taskCreatedDate")
    }
    //send update information to server as through ajax
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", function(event) {
        //handle results of the ajax call here
        if(ajaxRequest.status == 200) {
            //collapse updateTaskUI
            toggleUpdateTaskUI();
            var trEntry = document.getElementById("tr-" + taskData.id);
            trEntry.classList.remove("table-active");
        }
    })
    console.log("Preparing to send data to server", taskData);
    ajaxRequest.open("POST", "/update");
    ajaxRequest.setRequestHeader("Content-type", "application/json");
    ajaxRequest.send(JSON.stringify(taskData));

})

updateButtons = document.getElementsByClassName("update-button");
for(var updateButton of updateButtons) {
    updateButton.addEventListener("click", function(event) {
        var taskData = {
            id:updateButton.id.split("-")[1]
        } //This is the data of the task whose content is to be updated
        var trEntry = document.getElementById("tr-" + event.target.id.split("-")[1])
        taskData["content"] = trEntry.children[0].textContent;
        taskData["date_created"] = trEntry.children[1].textContent;
        console.log(taskData);
        //open the update user interface
        updateTaskUIStatus = true;
        toggleUpdateTaskUI();
        populateUpdateTaskUI(taskData);
        //DONE dim text of row whose update button was pressed
        trEntry.classList.add("table-active");
        
    })   
}