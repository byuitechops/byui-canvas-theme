/*eslint-env browser */
/* eslint no-console:0 */
/* global tinyMCE, tippy, $ */

(function () {

    function loadFeedback() {
        // Create the div for the feedback to go in
        var newDiv = document.createElement("div");
        newDiv.setAttribute("id", "inlineFeedback");
        newDiv.style.textAlign = "center";

        var thumbsUp = document.createElement("button");
        thumbsUp.innerHTML = "&#128077;&#xFE0E;";
        newDiv.appendChild(thumbsUp);

        var thumbsDown = document.createElement("button");
        thumbsDown.innerHTML = "&#128078;&#xFE0E;";
        newDiv.appendChild(thumbsDown);

        var lineBreak = document.createElement("br");

        var data = {};

        ratingButtons = newDiv.querySelectorAll("button");

        ratingButtons.forEach((b) => {
            b.style.border = "1px solid rgb(199, 205, 209)";
            b.style.color = "#2D3B45";
            b.style.borderRadius = "3px";
            b.style.padding = "15px";
            b.style.margin = "10px";
            b.style.fontSize = "2em";
            b.style.backgroundColor = "rgb(245, 245, 245)";
            b.style.outline = "none";
        });

        // Thumbs Up Logic
        thumbsUp.addEventListener("mouseover", (event) => {
            if (event.target.style.backgroundColor != "rgba(0, 255, 0, 0.6)") {
                event.target.style.backgroundColor = "rgba(0, 255, 0, 0.2)"
            }
        });
        thumbsUp.addEventListener("mouseout", (event) => {
            if (event.target.style.backgroundColor != "rgba(0, 255, 0, 0.6)") {
                event.target.style.backgroundColor = "rgba(245, 245, 245)"
            }
        });
        thumbsUp.addEventListener("click", (event) => {
            if (event.target.style.backgroundColor === "rgba(0, 255, 0, 0.6)") {
                event.target.style.backgroundColor = "rgba(0, 255, 0, 0.2)"
            } else event.target.style.backgroundColor = "rgba(0, 255, 0, 0.6)"
            data.feedback = "Positive";
            data.url = window.location;
            data.userID = ENV.current_user.id;
            data.contextAssetID = ENV.context_asset_string;
            newDiv.appendChild(lineBreak);
            createSurvey(newDiv, data);
            thumbsDown.style.display = "none";
        }, { once: true });

        // Thumbs Down Logic
        thumbsDown.addEventListener("mouseover", (event) => {
            if (event.target.style.backgroundColor != "rgba(255, 0, 0, 0.6)") {
                event.target.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
            }
        });
        thumbsDown.addEventListener("mouseout", (event) => {
            if (event.target.style.backgroundColor != "rgba(255, 0, 0, 0.6)") {
                event.target.style.backgroundColor = "rgba(245, 245, 245)"
            }
        });
        thumbsDown.addEventListener("click", (event) => {
            if (event.target.style.backgroundColor === "rgba(255, 0, 0, 0.6)") {
                event.target.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
            } else event.target.style.backgroundColor = "rgba(255, 0, 0, 0.6)"
            data.feedback = "Negative";
            data.url = window.location;
            data.userID = ENV.current_user.id;
            data.contextAssetID = ENV.context_asset_string;
            newDiv.appendChild(lineBreak);
            createSurvey(newDiv, data);
            thumbsUp.style.display = "none";
        }, { once: true });

        document.querySelector("#content").appendChild(newDiv);
    }

    function createSurvey(location, data) {
        var surveyFrame = document.createElement("iframe");
        var courseID = data.contextAssetID.replace("course_", "");
        var queryString = `?initialFeedback=${data.feedback}&url=${data.url}&userID=${data.userID}&courseID=${courseID}`
        surveyFrame.src = "https://byui.az1.qualtrics.com/jfe/form/SV_9mJ5ihWFBSa6IMl" + queryString;
        surveyFrame.width = "50%";
        surveyFrame.height = "400px";
        surveyFrame.style.borderWidth = 0;
        location.appendChild(surveyFrame);
    }

    loadFeedback();

}
)();