# Project Capture Document for Inline Feedback
#### *Author: Levi Stum*
#### *Stakeholder(s): Joshua McKinney, Ben Wilson*
#### *Date: June 12, 2019*

---

## Background
We want to experiment creating an inline feedback for the students that will be subtle. It will simply have a thumbs up and thumbs down that the users can click on in Canvas and once they do it will create a feedback box for them to enter comments. This feedback will be sent to a qualtrics feedback.

---

## Recap (tl;dr)

Simplified feedback in the Canvas DOM for the students.

-----

# Requirements

#### Source of Inputs

User Input - The user will be able to click the feedback and interact with it and it will send data to qualtrics.

#### Definition of Inputs

User Input includes selecting a thumbs up or thumbs down and entering comments in a textbox/iframe.

---


#### Destination of Outputs

Student Data that will be sent to Qualtrics

#### Definition of Outputs

Student data includes:
- Feedback (thumbs up, thumbs down, feedback/comments)
- Page URL
- User ID (pulled from the ENV variable)
- Context Asset Id (pulled from the ENV variable)

---

#### General Requirements

Basic feedback needs to be injected into Canvas DOM.
When interacted with, needs to load iFrame for qualtrics to grab data.

---

#### User Interface Type

Interactive Feedback on Canvas page.

-----

# Communication Plan

### Timeline

<!-- Include Milestone List here with Deadlines and try to make each milestone a minimum viable product
- Milestone 1: Finish Design (3/19)
- Milestone 2: Build Core logic to search for words in syllabi (3/22)
- Milestone 3: Connect inputs to core logic and set up outputs (3/25)
- Milestone 4: Deliver the project (3/26)
This will probably be overkill for small projects -->

### Best Mode of Contact
In-person, email, slack, etc.

### Next Meeting
<!-- e.g. May 4th, 2019 -->

### Action Items
<!-- Recap Meeting -->

#### TechOps

#### Stakeholder
Peeps

-----

#### *Approved By:*
#### *Approval Date:*