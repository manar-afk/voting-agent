import { db } from "../firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";

/**
 * Handles the "Zero-Knowledge Welcome Screen" logic.
 * Branches to the correct module based on whether the user has voted before.
 * 
 * @param {string} userId - Anonymous session ID.
 * @param {boolean} hasVotedBefore - User's response.
 * @returns {object} The next step instruction.
 */
export async function handleWelcomeBranch(userId, hasVotedBefore) {
  try {
    const journeyStage = hasVotedBefore ? "Module_C_Booth" : "Module_A_Foundation";
    
    // Save to Firestore (assuming free tier is set up, fallback to local logic if it fails)
    if (db) {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        journeyStage,
        hasVotedBefore,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    if (hasVotedBefore) {
      return {
        stage: "Module_C_Booth",
        message: "Great! Since you're an experienced voter, would you like a quick timeline update for the upcoming 2026 elections, or skip straight to finding your polling booth?",
        options: ["Election Timeline", "Find Polling Booth", "Valid ID Checklist"]
      };
    } else {
      return {
        stage: "Module_A_Foundation",
        message: "Welcome to your first election! Don't worry, I'll guide you step-by-step. The first step is getting your name on the Electoral Roll (Voter List) using Form 6. Shall we check your age eligibility first?",
        options: ["Check Eligibility", "What is the Electoral Roll?"]
      };
    }
  } catch (error) {
    console.error("Error in handleWelcomeBranch:", error);
    // Fallback logic if Firestore fails
    return {
      stage: hasVotedBefore ? "Module_C_Booth" : "Module_A_Foundation",
      message: "Network issue detected, but let's continue! " + (hasVotedBefore ? "Since you've voted before, how can I help today?" : "As a first-time voter, let's start with getting you registered."),
      options: hasVotedBefore ? ["Find Polling Booth", "Valid ID Checklist"] : ["Check Eligibility", "What is Form 6?"]
    };
  }
}

/**
 * Calculates eligibility based on 4 ECI cutoff dates.
 * Cutoff dates: Jan 1st, April 1st, July 1st, Oct 1st.
 */
export function checkEligibility(dobDate) {
  const dob = new Date(dobDate);
  
  if (isNaN(dob.getTime())) {
    return { eligible: false, message: "That doesn't look like a valid date. Please provide your Date of Birth in a format like YYYY-MM-DD or DD Month YYYY." };
  }

  const today = new Date();
  
  // Calculate exact age today
  let ageToday = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    ageToday--;
  }

  if (ageToday >= 18) {
    return { eligible: true, message: `You are ${ageToday} years old and eligible to register to vote right now! You should use **Form 6** to get your name on the Electoral Roll. Would you like to know the difference between the Electoral Roll and Voter ID?`, options: ["Electoral Roll vs Voter ID", "How to fill Form 6"] };
  }

  // If not 18 yet, check against the next cutoff dates of the current year or next year
  const currentYear = today.getFullYear();
  const cutoffs = [
    new Date(currentYear, 0, 1),   // Jan 1
    new Date(currentYear, 3, 1),   // Apr 1
    new Date(currentYear, 6, 1),   // Jul 1
    new Date(currentYear, 9, 1),   // Oct 1
    new Date(currentYear + 1, 0, 1) // Jan 1 Next Year
  ];

  let nextCutoff = null;
  for (const cutoff of cutoffs) {
    if (cutoff > today) {
      nextCutoff = cutoff;
      break;
    }
  }

  // Calculate age at the next cutoff date
  let ageAtCutoff = nextCutoff.getFullYear() - dob.getFullYear();
  const mCutoff = nextCutoff.getMonth() - dob.getMonth();
  if (mCutoff < 0 || (mCutoff === 0 && nextCutoff.getDate() < dob.getDate())) {
    ageAtCutoff--;
  }

  if (ageAtCutoff >= 18) {
    const cutoffStr = nextCutoff.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    return { eligible: true, message: `Good news! While you are ${ageToday} today, you will turn 18 before the next ECI cutoff date (${cutoffStr}). You can submit an advance application using **Form 6** now!`, options: ["What is Form 6?", "Electoral Roll vs Voter ID"] };
  } else {
    return { eligible: false, message: `You are currently ${ageToday} years old. You must be 18 to vote. You won't be 18 by the next cutoff date, but keep an eye out as you approach your 18th birthday!`, options: ["Electoral Roll vs Voter ID"] };
  }
}

/**
 * Determines the correct ECI Form based on user intent.
 * @param {string} intent - new, correction, deletion
 */
export function findForm(intent) {
  const i = intent.toLowerCase();
  if (i.includes("new") || i.includes("register")) {
    return { form: "Form 6", description: "Use Form 6 for registering as a new voter." };
  } else if (i.includes("correct") || i.includes("shift") || i.includes("change")) {
    return { form: "Form 8", description: "Use Form 8 for correction of details or shifting of residence." };
  } else if (i.includes("delete") || i.includes("remove") || i.includes("objection")) {
    return { form: "Form 7", description: "Use Form 7 for deletion of a name from the Electoral Roll." };
  }
  return { form: "Unknown", description: "I couldn't identify the specific form. For new voters it is Form 6, for corrections Form 8, and for deletions Form 7." };
}
