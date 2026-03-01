import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzWLQcRkTrCS29vQD7ElTMZtqqVqg0HYg",
  authDomain: "happypuppywebapp.firebaseapp.com",
  projectId: "happypuppywebapp",
  storageBucket: "happypuppywebapp.firebasestorage.app",
  messagingSenderId: "105754607335",
  appId: "1:105754607335:web:35b49c06c6a1d5ff43ac42",
  measurementId: "G-ZG6WSS9RKQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Create a variable to hold the live data for the modal
let liveRates = {};

// Helper function for Red Time Slots and Info Icons
function row(label, price, unit, timeSlot = "", type = "") {
  const timeHTML = timeSlot
    ? `<span style="color: var(--brand-red); font-size: 0.75rem; font-weight: bold; margin-left: 5px;">(${timeSlot})</span>`
    : "";
  const infoBtn = type
    ? `<span onclick="openInfoModal('${type}')" style="cursor:pointer; color:var(--brand-red); margin-left:8px; font-weight:bold;">ⓘ</span>`
    : "";

  return `
        <div class="price-row">
            <span class="service-name">${label}${timeHTML}${infoBtn}</span>
            <span class="service-price">R${price || 0} <span class="unit">(${unit})</span></span>
        </div>
    `;
}

// MODAL LOGIC - Handles all "i" icons
window.openInfoModal = (type) => {
  const modal = document.getElementById("policyModal");
  const title = modal.querySelector(".modal-title");
  const text = modal.querySelector(".modal-text");

  // Pull from liveRates instead of hard-coded numbers
  if (type === "inhouse") {
    title.innerText = "The In-House Advantage";
    text.innerHTML = `
      <p style="font-style: italic; margin-bottom: 15px;">"Your home is your pet’s ultimate safety net."</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.6; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>The Gold Standard:</b> Your home is the only place where every smell, sound, and corner is familiar. By choosing In-House care, we maintain that <b>Safe Haven</b>. 
      </p>

      <p style="text-align: left; font-size: 0.9rem; line-height: 1.6;">
        As your Kahu, we enter <b>their</b> world to ensure their routine is never broken. This is the most effective way to prevent stress because the environment remains constant, allowing them to feel secure in their own territory.
      </p>`;
  } else if (type === "hosting") {
    title.innerText = "The Hosting Sanctuary";
    text.innerHTML = `
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.6; border-left: 3px solid var(--brand-red); padding-left: 10px; margin-bottom: 15px;">
        <b>The Boutique Sanctuary:</b> Unlike crowded kennels or other boarding facilities that cause sensory overload, we follow a strict <b>One-Family Rule</b>. We only host one guest family at a time.
      </p>

      <p style="text-align: left; font-size: 0.9rem; line-height: 1.6;">
        This exclusive approach significantly reduces the risk of contagious illnesses like <b>Kennel Cough</b>. While some Kahus have their own pets, they are <b>fully vaccinated</b> and health-screened to ensure a safe, hygienic, and social home environment.
      </p>

      <div style="margin-top:15px; padding: 10px; background: #fff5f5; border-radius: 8px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold; text-align: center;">
        Individual Care & Health Protection
      </div>`;
 } else if (type === "inhouse_hourly") {
    const travelBase = liveRates["travel_base"] || 70;
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["inhouse_hourly"] || 70;
    
    // 🐾 Calculate the In-House Hourly Guardian Fee
    const perc = liveRates["perc_hourly"] || 15.4;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Hourly Sitting (Anxiety Support)";
    text.innerHTML = `
      <p>Perfect for when you need to pop out to the doctor or appointments. We stay with them in <b>your home</b> so they stay calm, happy, and safe.</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>The Kahu Mission:</b> Leaving a pet with anxiety alone is a health risk. We provide constant companionship to ensure they never suffer the physical toll of panic.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/In House Sitting.svg" alt="Hourly Sitting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.8;">
          <p style="margin: 0;">• <b>Billing:</b> Per hour or part thereof</p>
          <p style="margin: 0;">• <b>Rule:</b> Billed in full 1-hour blocks</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, stays are rounded up.
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base travel (R${travelBase}) + R${travelKm} per-km fee applies.
      </p>`;
    // IN-HOUSE DAY SITTING
  } else if (type === "inhouse_day") {
    const travelBase = liveRates["travel_base"] || 70;
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["inhouse_day"] || 300;
    
    // 🐾 Calculate the In-House Day Guardian Fee
    const perc = liveRates["perc_day"] || 26.6;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Day Sitting (Activity & Vitality)";
    text.innerHTML = `
      <p>Ideal for when you are away during the day but home in the evenings. Daytime is for energy and activity!</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>The Kahu Mission:</b> We focus on exercise and mental stimulation so your pet doesn't spend the day stressed. We ensure their day is full of life, not loneliness.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/In House Sitting.svg" alt="Day Sitting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.6; font-size: 0.9rem;">
          <p style="margin: 0;">• <b>Standard Hours:</b> 08:00 – 16:00</p>
          <p style="margin: 0;">• <b>Kahu Gift:</b> 1 Free Local Walk</p>
          <p style="margin: 0;">• <b>Overtime:</b> Billed at Hourly Rate</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, any time outside standard slots is rounded up.
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base travel (R${travelBase}) + R${travelKm}/km fee applies.
      </p>`;
    // IN-HOUSE NIGHT SITTING
  } else if (type === "inhouse_night") {
    const travelBase = liveRates["travel_base"] || 70;
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["inhouse_night"] || 300;
    
    // 🐾 Calculate the In-House Night Guardian Fee
    const perc = liveRates["perc_night"] || 27.3;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Night Sitting (Bonding & Security)";
    text.innerHTML = `
      <p>The hardest time for an animal to be alone is at night. We stay in <b>your home</b> so your pet feels calm, secure, and loved in their own environment.</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>The Kahu Mission:</b> Nighttime is for bonding and feeling safe. We provide a supervised presence to ensure they never have to face the dark alone.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/In House Sitting.svg" alt="Night Sitting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.6; font-size: 0.9rem;">
          <p style="margin: 0;">• <b>Standard Hours:</b> 17:00 – 07:00</p>
          <p style="margin: 0;">• <b>Focus:</b> Rest & Security</p>
          <p style="margin: 0;">• <b>Overtime:</b> Billed at Hourly Rate</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, time outside standard slots is rounded up.
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base travel (R${travelBase}) + R${travelKm}/km fee applies.
      </p>`;
    // PREMIUM 23H CARE
  } else if (type === "inhouse_premium") {
    const travelBase = liveRates["travel_base"] || 70;
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["inhouse_premium"] || 490;
    
    // 🐾 Calculate the In-House Premium Guardian Fee
    const perc = liveRates["perc_premium"] || 18.4;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Premium 23h Care (The KAHU Standard)";
    text.innerHTML = `
      <p style="font-style: italic; margin-bottom: 15px;">"A <b>Kahu</b> is a guardian, a caretaker, and a beloved protector."</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>Why 23h Care?</b> For pets with medical vulnerabilities or separation anxiety, <b>consistency is life-saving</b>. As their Kahu, our constant presence prevents the "spike" of panic, ensuring their nervous system remains calm.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/In House Sitting.svg" alt="Premium Sitting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.6; font-size: 0.9rem;">
          <p style="margin: 0;">• <b>Window:</b> 08:00 until 07:00 (Next Day)</p>
          <p style="margin: 0;">• <b>Kahu Gift:</b> 1 Free Local Walk</p>
          <p style="margin: 0;">• <b>The 1-Minute Rule:</b> Overtime kicks in at 1 minute.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, any time used outside the 23h block is rounded up.
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base travel (R${travelBase}) + R${travelKm}/km fee applies.
      </p>`;
    // HOURLY HOSTING
  } else if (type === "host_hourly") {
    // Pulling the travel rates for the conditional transport note
    const travelBase = liveRates["travel_base"] || 70;
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["host_hourly"] || 70;

    // 🐾 Calculate the Hourly Hosting Guardian Fee
    const perc = liveRates["perc_hourly"] || 15.4;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Hourly Hosting (Kahu Support)";
    text.innerHTML = `
      <p>Ideal for short errands or appointments where your pet cannot join you. This service is specifically designed for pets with <b>separation anxiety</b> who require constant companionship.</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>The Kahu Mission:</b> We believe stress is a <b>silent killer</b>. As your pet's Kahu (Guardian), we provide a safe, calm environment in our home to ensure they never suffer the physical toll of panic.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/At Sitter Hosting.svg" alt="Hourly Hosting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.8;">
          <p style="margin: 0;">• <b>Billing:</b> Per hour or part thereof</p>
          <p style="margin: 0;">• <b>Rule:</b> Billed in full 1-hour blocks</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, stays are rounded up.
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Travel fees (Base R${travelBase} + R${travelKm}/km) only apply if a Collection or Drop-off is required.
      </p>`;
    // DAY HOSTING
  } else if (type === "host_day") {
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["host_day"] || 330;

    // 🐾 Calculate the Day Hosting Guardian Fee
    const perc = liveRates["perc_day"] || 26.6;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Day Hosting (Kahu Supervision)";
    text.innerHTML = `
      <p>A 'home away from home' where your pet receives the <b>Kahu</b> standard of care—guardian-led supervision rather than just sitting.</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>The Kahu Mission:</b> We focus on daytime stimulation, play, and emotional well-being to prevent the physical toll of loneliness.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/At%20Sitter%20Hosting.svg" alt="Day Hosting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.6; font-size: 0.9rem;">
          <p style="margin: 0;">• <b>Standard Hours:</b> 08:00 – 16:00</p>
          <p style="margin: 0;">• <b>Kahu Gift:</b> 1 Free Local Walk</p>
          <p style="margin: 0;">• <b>Overtime:</b> Billed at Hourly Rate</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, any time outside standard slots is rounded up.
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Travel fees (R${travelKm}/km) only apply if collection or drop-off is required.
      </p>`;

    // NIGHT HOSTING
  } else if (type === "host_night") {
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["host_night"] || 240;

    // 🐾 Calculate the Night Guardian Fee
    const perc = liveRates["perc_night"] || 27.3;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Night Hosting (Kahu Bonding)";
    text.innerHTML = `
      <p>We provide a secure, loving environment for your pet's overnight stay, focusing on <b>deep bonding and security</b>.</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>The Kahu Mission:</b> Nighttime is often the hardest for anxious pets. As their Kahu, we monitor their sounds and breathing throughout the night, ensuring they feel safe and "at home" in our space until morning.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/At%20Sitter%20Hosting.svg" alt="Night Hosting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.6; font-size: 0.9rem;">
          <p style="margin: 0;">• <b>Standard Hours:</b> 17:00 – 07:00</p>
          <p style="margin: 0;">• <b>Focus:</b> Rest & Security</p>
          <p style="margin: 0;">• <b>Overtime:</b> Billed at Hourly Rate</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, time outside standard slots is rounded up (e.g., 1 min late = 1 hour overtime).
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Travel fees (R${travelKm}/km) only apply if collection or drop-off is required.
      </p>`;

    // PREMIUM 23H HOSTING
  } else if (type === "host_premium") {
    const travelKm = liveRates["travel_km"] || 7;
    const base = liveRates["host_premium"] || 540;

    // 🐾 Calculate the Premium Guardian Fee
    const perc = liveRates["perc_premium"] || 18.4;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Premium 23h Hosting (The Kahu Standard)";
    text.innerHTML = `
      <p style="font-style: italic; margin-bottom: 15px;">"A <b>Kahu</b> is a guardian, a caretaker, and a protector entrusted with someone precious."</p>
      
      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.5; border-left: 3px solid var(--brand-red); padding-left: 10px; margin: 15px 0;">
        <b>Why 23h Care?</b> For pets with medical vulnerabilities or separation anxiety, <b>consistency is life-saving</b>. As their Kahu, our constant presence in our home prevents the "spike" of panic that occurs when they feel abandoned.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/At%20Sitter%20Hosting.svg" alt="Premium Hosting" style="width: 45px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.6; font-size: 0.9rem;">
          <p style="margin: 0;">• <b>Window:</b> 08:00 until 07:00 (Next Day)</p>
          <p style="margin: 0;">• <b>Kahu Gift:</b> 1 Free Local Walk</p>
          <p style="margin: 0;">• <b>The 1-Minute Rule:</b> Overtime kicks in at 1 minute.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="text-align: left; font-size: 0.8rem; color: #666; font-style: italic;">
        To protect the Kahu's schedule, any time used outside the 23h block is rounded up.
      </p>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Travel fees (R${travelKm}/km) only apply if collection or drop-off is required.
      </p>`;
    // WALKING POLICY
  } else if (type === "walking_policy") {
    const localRate = liveRates.walk_local || 0;
    const beachRate = liveRates.walk_beach || 0;
    const travel = liveRates.travel_km || 0;

    title.innerText = "Dog Walking & Exercise";
    text.innerHTML = `
      <p>We provide private, high-quality exercise tailored to your dog's individual energy levels.</p>
      
      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red);">
        <p style="margin: 0; line-height: 1.8;">
          <span class="material-icons" style="font-size:18px; vertical-align:middle; color:var(--brand-red);">directions_walk</span> <b>Local Walk:</b> 15 - 45 min — <b>R${localRate} (each)</b><br>
          <span class="material-icons" style="font-size:18px; vertical-align:middle; color:var(--brand-red);">beach_access</span> <b>Beach Walk:</b> 30 - 60 min — <b>R${beachRate} (each)</b>
        </p>
      </div>

      <ul style="text-align: left; font-size: 0.85rem; list-style: none; padding: 0; line-height: 1.6; color: #333;">
          <li style="margin-bottom: 12px;">
            <span class="material-icons" style="font-size:16px; color:var(--brand-red); vertical-align:middle;">verified</span> 
            <b>Private Service:</b> We only walk 1 family at a time. This ensures maximum safety and allows us to focus entirely on your dogs without the distraction or conflict of strange animals.
          </li>
          <li style="margin-bottom: 12px;">
            <span class="material-icons" style="font-size:16px; color:var(--brand-red); vertical-align:middle;">pets</span> 
            <b>Individual Attention:</b> Rates are per dog because each pet has unique needs, temperaments, and health considerations. Managing multiple leashes and individual behaviors increases the workload and responsibility.
          </li>
          <li style="margin-bottom: 12px;">
            <span class="material-icons" style="font-size:16px; color:var(--brand-red); vertical-align:middle;">gpp_good</span> 
            <b>Safety First:</b> Walking multiple dogs increases the chance of incidents. Our structure ensures we have the capacity to address individual health or safety issues the moment they arise.
          </li>
      </ul>
      
      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base travel + R${travel} per-km fee applies per walk.
      </p>`;
  } else if (type === "meet") {
    title.innerText = "Meet & Greet Policy";
    text.innerHTML = `
      <p>The Meet & Greet is a professional consultation to ensure your Kahu and your pets are a perfect match.</p>
      
      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: flex-start;">
        
        <div style="min-width: 50px; margin-right: 15px; padding-top: 5px;">
          <img src="Resources/img/icon/Meet%20&%20Greet.svg" alt="Meet & Greet" style="width: 45px; height: auto; display: block;">
        </div>
        
        <p style="margin: 0; line-height: 1.8;">
          • <b>Consultation Fee:</b> <b>R${liveRates.meetAndGreetFee || 150}</b><br>
          • <b>Kahu Loyalty Gift:</b> <b>R${liveRates.meetAndGreetFee || 150} Credit</b>
        </p>
      </div>

      <p style="text-align: left; font-size: 0.85rem; color: #333; line-height: 1.6;">
        <b>How the Gift Works:</b> The Meet & Greet fee is payable upfront. Upon completion of your first booking, you will receive an <b>R${liveRates.meetAndGreetFee || 150} Gift Credit</b> to be used against your <b>second booking with the same KAHU.</b>
      </p>
      
      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Travel costs are mandatory and must be paid in full for the consultation to take place.
      </p>`;
  } else if (type === "checkin") {
    const base = liveRates["check-in-morning"] || 180;
    const travel = liveRates.travel_km || 7;

    // 🐾 Calculate the 75% Guardian Fee for Check-ins
    const perc = liveRates["perc_checkin"] || 75;
    const extraFee = Math.round(base * (perc / 100));

    title.innerText = "Pet Check-In Details";
    text.innerHTML = `
      <p>Check-ins are tailored to your pet's needs and usually last between 15 to 30 minutes.</p>
      
      <p style="text-align: left; line-height: 1.8; margin-bottom: 15px;">
        <span class="material-icons" style="font-size:16px; vertical-align:middle; color:var(--brand-red);">wb_twilight</span> <b>Morning:</b> 07:00 - 09:00 (Breakfast)<br>
        <span class="material-icons" style="font-size:16px; vertical-align:middle; color:var(--brand-red);">light_mode</span> <b>Afternoon:</b> 12:00 - 14:00 (Lunch)<br>
        <span class="material-icons" style="font-size:16px; vertical-align:middle; color:var(--brand-red);">location_city</span> <b>Evening:</b> 17:00 - 19:00 (Dinner)<br>
        <span class="material-icons" style="font-size:16px; vertical-align:middle; color:var(--brand-red);">bedtime</span> <b>Close:</b> 20:00 - 21:00 (Bedtime)
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: center;">
        <div style="min-width: 50px; margin-right: 15px;">
          <img src="Resources/img/icon/Pet%20Check%20in.svg" alt="Pet Check-In" style="width: 50px; height: auto; display: block;">
        </div>
        <div style="line-height: 1.8;">
          <p style="margin: 0;">• Check-In <b>once:</b> <b>R${base}</b></p>
          <p style="margin: 0;">• Check-In <b>twice:</b> <b>R${base * 2}</b></p>
          <p style="margin: 0;">• Check-In <b>thrice:</b> <b>R${base * 3}</b></p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
          <p style="margin: 0; font-size: 0.85rem; color: #333;">
            <b>Guardian Policy:</b> Rates include first 2 pets.<br>
            <span style="color: var(--brand-red); font-weight: bold;">+ R${extraFee} per additional pet.</span>
          </p>
        </div>
      </div>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base rate + R${travel} per-km travel fee applies per visit.
      </p>`;
  } else if (type === "property") {
    const houseRate = 160;
    const travel = liveRates.travel_km || 7;

    title.innerText = "House Check-In (Property Security)";
    text.innerHTML = `
      <p>This service is specifically for homes <b>without</b> animals, ensuring your property remains secure and looks lived-in while you are away.</p>
      
      <p style="text-align: left; line-height: 1.8; margin-bottom: 15px;">
        <span class="material-icons" style="font-size:18px; vertical-align:middle; color:var(--brand-red);">shield</span> <b>Morning:</b> Perimeter security check, mail collection, and opening curtains.<br>
        <span class="material-icons" style="font-size:18px; vertical-align:middle; color:var(--brand-red);">wb_incandescent</span> <b>Evening:</b> Rotating lights on/off, final lock-up, and evening security sweep.
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: center;">
        <div style="min-width: 50px; margin-right: 15px;">
          <img src="Resources/img/icon/House%20Check%20in.svg" alt="House Check-In" style="width: 45px; height: auto; display: block;">
        </div>
        <p style="margin: 0; line-height: 1.8;">
          • Morning House Check-In: <b>R${houseRate}</b><br>
          • Evening House Check-In: <b>R${houseRate}</b>
        </p>
      </div>

      <p>Our check-ins ensure that your property is monitored daily for peace of mind.</p>
      
      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base rate + R${travel} per-km travel fee applies per check-in.
      </p>`;
  } else if (type === "garden_policy") {
    const gardenRate = liveRates.garden_watering || 80;
    const travel = liveRates.travel_km || 7;

    title.innerText = "Garden Watering Check-In";
    text.innerHTML = `
      <p>We ensure your garden stays healthy and hydrated while you are away.</p>
      
      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: center;">
        <div style="min-width: 50px; margin-right: 15px;">
          <img src="Resources/img/icon/Watering%20Garden.svg" alt="Garden Watering" style="width: 45px; height: auto; display: block;">
        </div>
        <p style="margin: 0; line-height: 1.8;">
          • Garden Watering Check-In: <b>R${gardenRate}</b>
        </p>
      </div>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base rate + R${travel} per-km travel fee applies per check-in.
      </p>`;
  } else if (type === "taxi_desc") {
    title.innerText = "Pet Taxi & Logistics";
    text.innerHTML =
      "<p>Are you just too busy to get around to your pet's appointments? We handle the transport so you don't have to worry.</p>";
  } else if (type === "taxi") {
    title.innerText = "Pet Taxi Rates";
    text.innerHTML = `
      <p>Professional transport for your pet's important appointments and logistics.</p>
      
      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: center;">
        
        <div style="min-width: 50px; margin-right: 15px;">
          <img src="Resources/img/icon/Pet%20Taxi.svg" alt="Pet Taxi" style="width: 45px; height: auto; display: block;">
        </div>
        
        <p style="margin: 0; line-height: 1.8;">
          • Vet Check-In: <b>R${liveRates["vet-visit"] || 150}</b> (each)<br>
          • Grooming Check-In: <b>R${liveRates["grooming-appointment"] || 150}</b> (each)<br>
          • Airport Shuttle: <b>R${liveRates["airport-shuttle"] || 200}</b> (each)
        </p>
      </div>

      <p style="margin-top:15px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold;">
        Note: Base travel + R${liveRates.travel_km || 7} per-km fee applies per trip.
      </p>`;
  } else if (type === "travel") {
    title.innerText = "Travel Policy";
    text.innerHTML = `
      <p>To cover fuel and vehicle maintenance, Travel Costs apply to all services where travel is involved.</p>
      
      <div style="text-align: left; background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--brand-red); display: flex; align-items: center;">
        
        <div style="min-width: 50px; margin-right: 15px;">
          <img src="Resources/img/icon/Pet%20Taxi.svg" alt="Travel" style="width: 45px; height: auto; display: block;">
        </div>
        
        <p style="margin: 0; line-height: 1.8;">
          • <b>Base Rate:</b> R${liveRates.travel_base || 70} (each)<br>
          • <b>Per Km:</b> R${liveRates.travel_km || 7} (each)
        </p>
      </div>

      <p style="margin-top:15px; font-size: 0.85rem; color: #333;">
        Travel is calculated to ensure we can continue providing reliable, safe transport and professional check-ins for your pets.
      </p>`;
  } else if (type === "keys") {
    title.innerText = "Key Management";
    text.innerHTML = `
      <p style="margin-bottom: 15px;">This service is for clients who require us to collect keys before a sitting begins or drop them off after a booking ends.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 15px 0; display: flex; align-items: center; gap: 20px; border-left: 4px solid var(--brand-red);">
        <img src="Resources/img/icon/Key%20Management.svg" 
             style="width: 50px; height: 50px;" 
             alt="Key Management">
             
        <div style="text-align: left;">
          <p style="margin: 0; font-size: 1rem; font-weight: bold;">• Key Collection: R${liveRates["key-pickup"] || 0}</p>
          <p style="margin: 8px 0 0 0; font-size: 1rem; font-weight: bold;">• Key Return: R${liveRates["key-dropoff"] || 0}</p>
        </div>
      </div>

      <p style="font-size: 0.85rem; color: #555; line-height: 1.5;">
        Standard handovers usually happen during the <b>Meet & Greet</b> or at the start of a booking. Use this option if you need a separate trip for key logistics.
      </p>

      <p style="margin-top:20px; font-size: 0.8rem; color: var(--brand-red); font-weight: bold; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
        Note: Base travel + R7 per-km fee applies per trip.
      </p>`;
  }
  modal.style.display = "flex";
};

onSnapshot(doc(db, "pricing", "globalRates"), (snap) => {
  if (!snap.exists()) return;
  const d = snap.data();
  liveRates = d; // Update our variable for the modal to use

  // PAGE 2: SITTING & HOSTING
  document.getElementById("in-house-list").innerHTML = `
    <div class="category-title" style="margin-bottom:15px; display: flex; align-items: center;">
      In-House Pet Sitting 
      <span class="material-icons kahu-info-btn" 
            onclick="openInfoModal('inhouse')" 
            style="margin-left: 12px; cursor: pointer; font-size: 20px;">
        info
      </span>
    </div>
    ${row("Hourly Sitting", d.inhouse_hourly, "First 2 Pets", "", "inhouse_hourly")}
    ${row("Day Sitting", d.inhouse_day, "First 2 Pets", "08h00 - 16h00", "inhouse_day")}
    ${row("Night Sitting", d.inhouse_night, "First 2 Pets", "17h00 - 07h00", "inhouse_night")}
    ${row("Premium 23h Care", d.inhouse_premium, "First 2 Pets", "08h00 - 07h00", "inhouse_premium")}
`;

  document.getElementById("hosting-list").innerHTML = `
    <div class="category-title" style="margin-bottom:15px; margin-top:20px; display: flex; align-items: center;">
      At-Sitter Hosting 
      <span class="material-icons kahu-info-btn" 
            onclick="openInfoModal('hosting')" 
            style="margin-left: 12px; cursor: pointer; font-size: 20px;">
        info
      </span>
    </div>
    ${row("Hourly Hosting", d.host_hourly, "First 2 Pets", "", "host_hourly")}
    ${row("Day Hosting", d.host_day, "First 2 Pets", "08h00 - 16h00", "host_day")}
    ${row("Night Hosting", d.host_night, "First 2 Pets", "17h00 - 07h00", "host_night")}
    ${row("Premium 23h Hosting", d.host_premium, "First 2 Pets", "08h00 - 07h00", "host_premium")}
`;

  // PAGE 3: INDIVIDUAL & HOUSE CARE
  document.getElementById("walking-list").innerHTML = `
        <div class="category-title" style="margin-bottom:15px;">
          Individual & House Care 
        </div>
        ${row("Dog Walking (Local)", d.walk_local, "Each", "15-45 min", "walking_policy")}
        ${row("Pet Check-In", d["check-in-morning"], "First 2 Pets", "15-30 min", "checkin")}
        ${row("House Check-In", d["house-sit-check-in-morning"], "Each", "Security Check", "property")}
        ${row("Garden Watering", d["house-sit-garden-watering"], "Each", "", "garden_policy")}
    `;
  document.getElementById("taxi-list").innerHTML = `
        <div class="category-title" style="margin-bottom:15px; margin-top:20px;">
          Pet Taxi & Logistics 
        </div>
        ${row("General Pet Taxi", d["pet-taxi"], "Base Rate", "Vet/Groom/Air", "taxi")}
        ${row("Travel Fee", d.travel_km, "Per km", "", "travel")}
        ${row("Meet & Greet", d.meetAndGreetFee, "Initial Consultation", "", "meet")}
        ${row("Key Management", d["key-pickup"], "Per Trip", "", "keys")}
    `;
});
