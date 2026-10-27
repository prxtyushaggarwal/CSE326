/* ========================================================
   CSE326 - Internet Programming | CA-2 Assessment
   Topic: Student Identity Card (ID) Replacement & Reissue System
   JavaScript Implementation:
   - Dynamic Checklist Simulator based on Reason
   - Reissue Fee Calculator (Standard vs Urgent)
   - Form Submission & Live Receipt Generator
   ======================================================== */

// Base reissue fee constants
const BASE_REISSUE_FEE = 200;
const URGENT_PROCESSING_SURCHARGE = 300;

/**
 * Function to handle reason change (Lost / Damaged / Defaced)
 * Dynamically adapts the document checklist simulator
 */
function handleReasonChange() {
    // Get the selected reason radio value
    const selectedReason = document.querySelector('input[name="reissueReason"]:checked').value;
    
    // Elements to update
    const reasonBadge = document.getElementById('reasonBadge');
    const checklistInstruction = document.getElementById('checklistInstruction');
    
    const itemPoliceReport = document.getElementById('itemPoliceReport');
    const chkPoliceReport = document.getElementById('chkPoliceReport');
    
    const itemOldCard = document.getElementById('itemOldCard');
    const chkOldCard = document.getElementById('chkOldCard');

    // Update the visual badge
    reasonBadge.textContent = "Reason: " + selectedReason;

    if (selectedReason === "Lost") {
        // Lost card requirements
        checklistInstruction.innerHTML = "For <strong>Lost</strong> ID cards, police lost report acknowledgment (DDR/FIR) is mandatory.";
        
        // Police report is enabled and required
        itemPoliceReport.classList.remove('disabled-item');
        chkPoliceReport.disabled = false;
        chkPoliceReport.required = true;

        // Old card is disabled and unrequired (since card is lost)
        itemOldCard.classList.add('disabled-item');
        chkOldCard.checked = false;
        chkOldCard.disabled = true;
        chkOldCard.required = false;

    } else {
        // Damaged or Defaced card requirements
        checklistInstruction.innerHTML = "For <strong>" + selectedReason + "</strong> ID cards, physical submission of the old card is mandatory.";
        
        // Old card submission is enabled and required
        itemOldCard.classList.remove('disabled-item');
        chkOldCard.disabled = false;
        chkOldCard.required = true;

        // Police report is not needed for damaged/defaced cards
        itemPoliceReport.classList.add('disabled-item');
        chkPoliceReport.checked = false;
        chkPoliceReport.disabled = true;
        chkPoliceReport.required = false;
    }
}

/**
 * Function to calculate total fee based on processing speed choice
 */
function calculateTotalFee() {
    const selectedPlan = document.querySelector('input[name="feePlan"]:checked').value;
    
    let baseFee = BASE_REISSUE_FEE;
    let urgentFee = 0;
    let totalFee = 0;

    if (selectedPlan === "urgent") {
        urgentFee = URGENT_PROCESSING_SURCHARGE;
        totalFee = baseFee + urgentFee;
    } else {
        urgentFee = 0;
        totalFee = baseFee;
    }

    // Display formatted amounts on the screen
    document.getElementById('baseFeeText').textContent = "₹" + baseFee;
    document.getElementById('urgentFeeText').textContent = "₹" + urgentFee;
    document.getElementById('totalFeeText').textContent = "₹" + totalFee;

    return totalFee;
}

/**
 * Function to handle form submission, perform validation, and generate slip
 */
function handleFormSubmit(event) {
    // Prevent the default browser form reload
    event.preventDefault();

    // 1. Read input values
    const fullName = document.getElementById('fullName').value.trim();
    const rollNo = document.getElementById('rollNo').value.trim();
    const bloodGroup = document.getElementById('bloodGroup').value;
    const branch = document.getElementById('branch').value;
    const selectedReason = document.querySelector('input[name="reissueReason"]:checked').value;
    const selectedPlan = document.querySelector('input[name="feePlan"]:checked').value;

    // 2. Validate mandatory documents based on selected reason
    const isIdProofChecked = document.getElementById('chkIdProof').checked;
    const isPoliceReportChecked = document.getElementById('chkPoliceReport').checked;
    const isOldCardChecked = document.getElementById('chkOldCard').checked;

    if (!isIdProofChecked) {
        alert("Please confirm the Student ID proof checkbox in the checklist.");
        return;
    }

    if (selectedReason === "Lost" && !isPoliceReportChecked) {
        alert("Police Lost Report acknowledgment is mandatory when reporting a Lost ID card.");
        return;
    }

    if ((selectedReason === "Damaged" || selectedReason === "Defaced") && !isOldCardChecked) {
        alert("Physical submission of the Old Damaged Card is mandatory for " + selectedReason + " ID card reissue.");
        return;
    }

    // 3. Compute final fee
    const finalFee = calculateTotalFee();
    const planName = (selectedPlan === "urgent") ? "Urgent 24-Hour Processing" : "Standard (7-10 Days)";

    // 4. Generate random application reference number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const appRefNo = "LPU-REISSUE-" + randomNum;

    // 5. Populate the acknowledgement slip
    document.getElementById('slipAppNo').textContent = appRefNo;
    document.getElementById('slipName').textContent = fullName;
    document.getElementById('slipRoll').textContent = rollNo;
    document.getElementById('slipBranch').textContent = branch;
    document.getElementById('slipBlood').textContent = bloodGroup;
    document.getElementById('slipReason').textContent = selectedReason;
    document.getElementById('slipPlan').textContent = planName;
    document.getElementById('slipFee').textContent = "₹" + finalFee;

    // Add current date and time
    const now = new Date();
    document.getElementById('slipTime').textContent = "Generated on: " + now.toLocaleString();

    // 6. Reveal the slip card
    const slipCard = document.getElementById('slipCard');
    slipCard.style.display = "block";

    // Scroll smoothly to the slip card
    slipCard.scrollIntoView({ behavior: 'smooth' });

    alert("Application submitted successfully! Your reference number is " + appRefNo);
}

/**
 * Function to reset form back to default state
 */
function resetAll() {
    document.getElementById('reissueForm').reset();
    handleReasonChange();
    calculateTotalFee();

    // Hide acknowledgment slip
    const slipCard = document.getElementById('slipCard');
    if (slipCard) {
        slipCard.style.display = "none";
    }
}

// Initialize default state when the webpage loads
window.onload = function() {
    handleReasonChange();
    calculateTotalFee();
};
