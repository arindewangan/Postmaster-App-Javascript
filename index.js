console.log("Welcome to PostMaster");

// Utility Functions:
//1. Utility function to get DOM element from string
function getElementfromString(string) {
    let div = document.createElement("div");
    div.innerHTML = string;
    return div.firstElementChild;
}

// Hide the parameters box initially
let parametersBox = document.getElementById("parametersBox");
parametersBox.style.display = 'none';

// If the user clicks on params box, hide the json box and show the params box
let paramsRadio = document.getElementById("paramsRadio");
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = 'none';
    document.getElementById('parametersBox').style.display = 'block';
});

// If the user clicks on json box, hide the params box and show the json box
let jsonRadio = document.getElementById("jsonRadio");
jsonRadio.addEventListener('click', () => {
    document.getElementById('parametersBox').style.display = 'none';
    document.getElementById('requestJsonBox').style.display = 'block';

});

// Initialize no of paramseters
let addedParamCount = 0;
// If the user clicks on plus button add more parameters
let addParam = document.getElementById("addParam");
addParam.addEventListener("click", () => {
    let params = document.getElementById("params");
    let string = `<div class="row my-2">
                    <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamCount + 2}</label>
                    <div class="col">
                        <input type="text" class="form-control" id="parameterKey${addedParamCount + 2}" placeholder="Enter Parameter ${addedParamCount + 2} Key">
                    </div>
                    <div class="col">
                        <input type="text" class="form-control" id="parameterValue${addedParamCount + 2}" placeholder="Enter Parameter ${addedParamCount + 2} Value">
                    </div>
                    <button class="col-sm-1 btn btn-danger deleteParam">-</button>
                </div>`

    // Convert the element to DOM node
    let paramElement = getElementfromString(string);
    params.appendChild(paramElement);
    // Add an event listener to remove the parameter on clicking - button
    let deleteParam = document.getElementsByClassName("deleteParam");
    for (item of deleteParam) {
        item.addEventListener("click", (e) => {
            e.target.parentElement.remove();
        })
    }
    addedParamCount++;
});

// If the user clicks on submit button 
let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
    // Show Please wait in the response box
    document.getElementById('responsePrism').innerHTML = "Please wait.. Fetching response...";
    // Fetch all the values user has entered
    let url = document.getElementById("url").value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;
    console.log(url, requestType, contentType);
    // If user has used params option instead of json, collect all the parameters in an object
    if (contentType == 'params') {
        data = {};
        for (let i = 0; i < addedParamCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
            }
        }
        data = JSON.stringify(data);
    } else {
        data = document.getElementById('requestJsonText').value;
    }
    console.log(data);

    if (requestType == 'GET') {
        fetch(url, {
                method: "GET"
            })
            .then(response => response.text())
            .then((text) => {
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            })
    } else {
        fetch(url, {
                method: "POST",
                body: data,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.text())
            .then((text) => {
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            });
    }
    // If the request type is POST , then invoke fetch api to create a post request
});