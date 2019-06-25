/*eslint-env browser */
/* eslint no-console:0 */
/* global tinyMCE, tippy, $ */

const defaultBackgroundColor = "rgba(245, 245, 245)";

const positiveClickColor = "rgba(0, 255, 0, 0.6)";
const positiveHoverColor = "rgba(0, 255, 0, 0.2)";

const negativeClickColor = "rgba(255, 0, 0, 0.6)";
const negativeHoverColor = "rgba(255, 0, 0, 0.2)";

(function () {

    function loadFeedback() {
        // Create the div for the feedback to go in
        var newDiv = document.createElement("div");
        newDiv.setAttribute("id", "inlineFeedback");
        newDiv.style.textAlign = "center";

        // Thumbs Up Logic
        var thumbsUp = createButton("&#128077;&#xFE0E;");
        addMouseEvents(thumbsUp, positiveClickColor, positiveHoverColor, defaultBackgroundColor);
        addClickEvent(thumbsUp, newDiv, positiveClickColor, "Positive");

        // Thumbs Down Logic
        var thumbsDown = createButton("&#128078;&#xFE0E;");
        addMouseEvents(thumbsDown, negativeClickColor, negativeHoverColor, defaultBackgroundColor);
        addClickEvent(thumbsDown, newDiv, negativeClickColor, "Negative");

        // Sentence above feedback
        var feedbackSentence = document.createElement("h3");
        feedbackSentence.innerHTML = "<b>Tell us what you think!</b>";

        // Append elements to page
        newDiv.appendChild(feedbackSentence);
        newDiv.appendChild(thumbsDown);
        newDiv.appendChild(thumbsUp);

        /*
        Optional fading background
        newDiv.style.backgroundColor = "#add8e6";
        newDiv.style.transition = "background 0.5s linear";
        setTimeout(() => {
            newDiv.style.backgroundColor = "";
        }, 5000);
        */

        document.querySelector("#content").appendChild(newDiv);
    }

    function createSurvey(location, data) {
        var surveyFrame = document.createElement("iframe");
        var courseID = data.contextAssetID.replace("course_", "");
        var uniqueFormats = document.querySelectorAll("[data-survey]");

        // Checks for unique formatting styles in the document. If they exist append it to the URl as a query
        // This will be used to style the feedback (if our survey has 10 other questions it will be a popup)
        var url = "https://byui.az1.qualtrics.com/jfe/form/SV_9mJ5ihWFBSa6IMl";
        var queryString = `?initialFeedback=${data.feedback}&URL=${data.url}&userID=${data.userID}&courseID=${courseID}`;

        if (uniqueFormats) {
            uniqueFormats = Array.from(uniqueFormats).map(surveyElement => {
                return surveyElement.dataset.survey;
            })
            uniqueFormats = uniqueFormats.join('|');
            queryString += `&uniqueFormat=${uniqueFormats}`;
        } else {
            uniqueFormats = "";
        }
        
        surveyFrame.src = url + queryString;
        surveyFrame.width = "50%";
        surveyFrame.height = "400px";
        // surveyFrame.height = surveyFrame.contentWindow.document.body.scrollHeight;
        console.log(surveyFrame);
        surveyFrame.style.borderWidth = 0;
        location.appendChild(surveyFrame);

    }

    function createButton(html) {
        var button = document.createElement("button");
        button.innerHTML = html;
        button.style.border = "1px solid rgb(199, 205, 209)";
        button.style.color = "#2D3B45";
        button.style.borderRadius = "3px";
        button.style.padding = "15px";
        button.style.margin = "10px";
        button.style.fontSize = "2em";
        button.style.backgroundColor = defaultBackgroundColor;
        button.style.outline = "none";
        return button;
    }

    function addMouseEvents(obj, clickedColor, hoverColor, defaultColor) {
        obj.addEventListener("mouseover", (event) => {
            if (event.target.style.backgroundColor != clickedColor) {
                event.target.style.backgroundColor = hoverColor
            }
        });
        obj.addEventListener("mouseout", (event) => {
            if (event.target.style.backgroundColor != clickedColor) {
                event.target.style.backgroundColor = defaultColor
            }
        });
    }

    function addClickEvent(button, div, color, feedback) {
        var lineBreak = document.createElement("br");

        button.addEventListener("click", (event) => {
            event.target.style.backgroundColor = color
            var data = {
                feedback: feedback,
                url: window.location,
                userID: ENV.current_user.id,
                contextAssetID: ENV.context_asset_string
            };
            div.appendChild(lineBreak);
            createSurvey(div, data);
            // Loops through all the OTHER buttons and sets their dispay to "none"
            Array.from(document.querySelector("#inlineFeedback").querySelectorAll("button")).filter(b => b != button).map(b => b.style.display = "none");
        }, { once: true });

    }

    loadFeedback();

}
)();