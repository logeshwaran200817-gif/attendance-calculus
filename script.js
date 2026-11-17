const form = document.querySelector("#attendance-form");
const studentNameInput = document.querySelector("#student-name");
const departmentInput = document.querySelector("#department");
const workingDaysInput = document.querySelector("#working-days");
const daysAttendedInput = document.querySelector("#days-attended");
const message = document.querySelector("#form-message");
const result = document.querySelector("#result");
const percentageOutput = document.querySelector("#percentage");
const statusBadge = document.querySelector("#status-badge");
const progressTrack = document.querySelector(".progress-track");
const progressFill = document.querySelector("#progress-fill");
const resultNote = document.querySelector("#result-note");
const displayName = document.querySelector("#display-name");
const displayDepartment = document.querySelector("#display-department");
const feedbackButton = document.querySelector("#feedback-button");
const feedbackPanel = document.querySelector("#feedback-panel");
const feedbackText = document.querySelector("#feedback-text");
const sendFeedbackButton = document.querySelector("#send-feedback");

feedbackButton.addEventListener("click", () => {
  feedbackPanel.hidden = false;
  feedbackButton.hidden = true;
  feedbackText.focus();
});

sendFeedbackButton.addEventListener("click", () => {
  if (!feedbackText.value.trim()) {
    feedbackText.focus();
    return;
  }

  feedbackPanel.hidden = true;
  feedbackButton.hidden = true;
  message.textContent = "Thank you for your feedback.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";
  result.hidden = true;

  const studentName = studentNameInput.value.trim();
  const department = departmentInput.value.trim();
  const workingDays = Number(workingDaysInput.value);
  const daysAttended = Number(daysAttendedInput.value);

  if (!studentName) {
    showError("Enter the student name.", studentNameInput);
    return;
  }

  if (!department) {
    showError("Enter the department.", departmentInput);
    return;
  }

  displayName.textContent = studentName;
  displayDepartment.textContent = department;

  if (!Number.isInteger(workingDays) || workingDays < 1) {
    showError("Enter a whole number of working days greater than zero.", workingDaysInput);
    return;
  }

  if (!Number.isInteger(daysAttended) || daysAttended < 0) {
    showError("Enter a whole number of days attended (zero or more).", daysAttendedInput);
    return;
  }

  if (daysAttended > workingDays) {
    showError("Days attended cannot be greater than total working days.", daysAttendedInput);
    return;
  }

  const percentage = (daysAttended / workingDays) * 100;
  const missed = workingDays - daysAttended;
  const meetsTarget = percentage >= 75;

  percentageOutput.textContent = `${percentage.toFixed(1)}%`;
  document.querySelector("#attended-summary").textContent = daysAttended;
  document.querySelector("#missed-summary").textContent = missed;
  document.querySelector("#working-summary").textContent = workingDays;

  progressFill.style.width = `${percentage}%`;
  progressTrack.setAttribute("aria-valuenow", percentage.toFixed(1));

  statusBadge.textContent = meetsTarget ? "On track" : "Below 75%";
  statusBadge.classList.toggle("below", !meetsTarget);

  if (meetsTarget) {
    resultNote.textContent =
      "You meet the common 75% attendance benchmark. Check your school or college policy for its required minimum.";
  } else {
    const needed = Math.ceil((0.75 * workingDays - daysAttended) / 0.25);
    resultNote.textContent =
      `You are below the 75% benchmark. If no more days are missed, attend the next ${needed} working day${needed === 1 ? "" : "s"} to reach 75%.`;
  }

  result.hidden = false;
});

function showError(text, input) {
  message.textContent = text;
  input.focus();
}