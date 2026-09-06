# **HOUSES IN THE WOVEN MAP SYSTEM**

**Technical Reference v1.6 | Role: The Analyst's Source**  
**Date:** 2026-09-05  
**Status:** Canonical Authority for House Landing Meanings  
**Migration Note (2026-09-05):** Final frontstage handles: **Identity · Money · Communication · Home · Play · Health · Relationships · Shared Resources · Belief · Work · Community · Unconscious**. The Hellenistic → psychological → modern column is an **evolution of emphasis**, not a replacement of meanings: houses became increasingly interiorized. **“Jungian / psychological”** here means the later psychological-astrology tradition (especially Howard Sasportas and Liz Greene), not house meanings invented or formally codified by Jung. Chamber names remain historical. Does not modify house geometry, capacity/stress definitions, or Math Brain calculations.

---

## **SECTION I: THE LOGIC OF THE SPLIT (NATAL VS. SYMBOLIC WEATHER)**

*The Woven Map strictly separates the Instrument (Blueprint) from the Force (Symbolic Weather).*

**1. The Natal View (The Blueprint)**

* **Function:** Describes **Capacity**.
* **Question:** "How is this room built?"
* **Definition:** The fixed architectural function of the house.

**2. The Symbolic Weather View (The Load)**

* **Function:** Describes **Stress**.
* **Question:** "What pressure is hitting this room right now?"
* **Definition:** The temporary atmospheric load (compression, expansion, maintenance) applied to the structure.

---

## **SECTION II: THE LAW OF LAYERED TRANSLATION**

*A house label is a handle, not a complete definition of the house.*

**Governing Law: KEEP THE ARCHITECTURE BACKSTAGE; KEEP THE EXPERIENCE FRONTSTAGE.**

Three questions, three layers:

1. **Traditional astrology asks:** *What part of life does this concern?*
2. **Psychological astrology adds:** *How does the psyche experience and organize that part of life?*
3. **The frontstage label asks:** *What ordinary word lets someone know where to click?*

**Money** does not claim the 2nd house is only money. **Play** does not claim the 5th is only play. **Belief** does not claim the 9th is only belief. The labels do not need to win an astrology seminar. They need to get someone into the right room without making them read the architectural plans first.

The live rendering path is:

**Wheel handle → one-sentence gloss → optional interpretive depth (including the evolution of emphasis)**

1. **MAP Metadata:** Stable identifiers are `house_01` through `house_12`, plus conventional house numbers (1st–12th). Visible English labels are localized content, never database keys. Branded chamber names are **not** live MAP metadata.
2. **VOICE Default (General Reader):** VOICE uses the frontstage handle plus its ordinary gloss. The user is never required to know a branded noun, a house number, or an ancestral name in order to understand the reading.
3. **Astrology-Aware Reader:** Ordinary meaning may be paired with the conventional house number (e.g., *"This is landing in the 8th house, Shared Resources: shared money, debt, inheritance, intimacy, dependency, and consequence."*).
4. **Woven Map / Technical Reader:** `/astro`, `/raw`, and `/doctrine` may expose house numbers, structural functions, ancestral/Hellenistic names, the evolution-of-emphasis column, and geometry. They do **not** teach chamber names as current architecture.
5. **Licensed Meaning Still Wins:** The domain meaning remains exact even when the handle is a familiar noun. House Eight is not cheerful voluntary sharing. House Two is not only cash. House Twelve is not medical unconsciousness.

**“Jungian / psychological” in this document** means the later psychological-astrology tradition influenced by Jung — especially Sasportas and Greene — which reframed houses from external areas of fate into domains through which the individual psyche perceives and experiences life. It does **not** mean Jung invented or formally codified these twelve handles.

**Historical vocabulary (do not resurrect as live MAP terms):**  
`chamber`, `chamber landing`, `ambient chamber`, `The Gate`, `The Store`, `The Path`, `The Root`, `The Forge`, `The Field`, `The Mirror`, `The Core`, `The Horizon`, `The Canopy`, `The Grove`, `The Shell`.

---

## **SECTION III: THE HOUSE ADDRESS TABLE (MASTER TABLE)**

**Live frontstage sequence:**

> **Identity · Money · Communication · Home · Play · Health · Relationships · Shared Resources · Belief · Work · Community · Unconscious**

| ID | House | Frontstage Handle | Meaning (gloss) | Ancestral Name (Depth) | Natal Function (Blueprint / Capacity) | Symbolic Weather Function (Load / Pressure) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **house_01** | **1st** | **Identity** | Selfhood, appearance, presence, vitality, instinctive approach to life. | **The Helm** (*Horoskopos*) | **The Interface.** Where the chart steers itself. The filter that decides structural integrity and defense. | **Vitality Check.** Pressure on the hull. Tests the integrity of the vessel against external impact. |
| **house_02** | **2nd** | **Money** | Personal resources, possessions, security, values, self-worth. | **Gate of Hades** (*Hades*) | **Fuel Tank.** Not just wealth, but dependence and fragility. What sustains the life but can be taken away. | **Resource Load.** Pressure on capacity. Answers: "Do we have the fuel to sustain operations?" |
| **house_03** | **3rd** | **Communication** | Speech, learning, siblings, local environment, everyday exchange. | **The Goddess** (*Dea*) | **Local Router.** Daily ritual and sacred repetition. Immediate data and short-range traffic. | **Signal Jam.** High volume of local inputs. Pressure on the nervous system or daily logistics. |
| **house_04** | **4th** | **Home** | Family, roots, private life, belonging, emotional foundations. | **The Subterraneous** (*Hypogeion*) | **The Anchor.** The place where things sink or settle. The foundation where the system cools down. | **Displacement.** Pressure on the foundation or lineage. |
| **house_05** | **5th** | **Play** | Creativity, romance, pleasure, self-expression, children. | **Good Fortune** (*Agathe Tyche*) | **The Generator.** Joyful outpouring. Surplus energy converted into creation, risk, or offspring. | **Output Load.** High demand for creative expenditure. |
| **house_06** | **6th** | **Health** | Daily routines, work habits, service, maintenance, body care. | **Bad Fortune** (*Kake Tyche*) | **Maintenance.** Strain and obligation. The engine room where labor drains the system. | **System Grind.** Duty, repair work, or health load. Treat as a **domain**, not a verdict. |
| **house_07** | **7th** | **Relationships** | Partnership, commitment, close one-to-one bonds, contracts. | **The Setting Place** (*Dysis*) | **The Coupling.** Where the self disappears into reflection. | **Misalignment.** Pressure coming from the other. Tests the bond or contract. |
| **house_08** | **8th** | **Shared Resources** | Shared money, debt, inheritance, intimacy, dependency, power, consequence. | **The Idle Place** (*Epikatōphlion*) | **Fusion.** Debt, inheritance, and limits. Where separate codes merge or die. | **Compression.** Vulnerability, merging, loss, and transformation through deep involvement. |
| **house_09** | **9th** | **Belief** | Worldview, philosophy, religion, higher learning, travel, meaning. | **The God** (*Theos*) | **Navigation.** Long-distance bearings and philosophy. | **Perspective Shift.** Pressure on worldviews, travel, law, or publishing. |
| **house_10** | **10th** | **Work** | Career, public role, ambition, reputation, responsibility. | **Midheaven** (*Mesouranima*) | **The Roof / Display.** The visible summit. The structure seen by the public. | **Visibility Load.** Pressure to perform, lead, or be accountable. |
| **house_11** | **11th** | **Community** | Friends, groups, networks, collective goals, future aspirations. | **Good Spirit** (*Agathos Daimon*) | **The Grid.** Support from the wider network, friends, and the collective weave. | **Static.** Pressure from networks, alliances, or future hopes. |
| **house_12** | **12th** | **Unconscious** | Inner life, hidden patterns, solitude, dreams, retreat, what operates out of sight. | **Bad Spirit** (*Kakos Daimon*) | **Recovery / Sleep.** The place of undoing. Where the system goes offline. | **Background Load.** Fatigue, isolation, or the return of old patterns. |

**Avoid saying (frontstage default):** branded chamber sentences ("Pressure lands at the Gate / in the Store / in the Core"). Do not use **Self** for house 1 (collision with Jung's technical Self). Do not treat **Health** as a moral verdict. Do not assume **Home** is safe. Do not reduce the water houses (4, 8, 12) to a simplistic “unconscious” slogan — Greene's caution. **Unconscious** on house 12 is a deliberate psychological handle, not the historical definition of the house.

### Evolution of Emphasis

Meanings were not simply replaced. They became increasingly interiorized.

| House | Handle | Hellenistic / traditional | Psychological (Sasportas / Greene tradition) | Modern topical |
| ---: | :--- | :--- | :--- | :--- |
| **1** | **Identity** | Body, life, character, circumstances of the native. | Formation and expression of the individual self; how one meets existence. | Identity, appearance, personality, first impressions. |
| **2** | **Money** | Livelihood, possessions, movable wealth, material support. | What gives a sense of substance, value, and personal security. | Money, income, possessions, values, self-worth. |
| **3** | **Communication** | Siblings, relatives, short journeys, messages; Moon's joy. | Development of perception, thought, and the immediate mental environment. | Communication, learning, siblings, neighborhood, everyday movement. |
| **4** | **Home** | Parents/ancestry, land, property, origins, the end of matters. | Psychic roots, family conditioning, the internal foundation from which personality grows. | Home, family, roots, private life, belonging. |
| **5** | **Play** | Children, fertility, pleasure, love affairs, enjoyment; Venus's joy. | Spontaneous self-expression, creativity, the urge to produce something uniquely one's own. | Creativity, dating, pleasure, hobbies, children, fun. |
| **6** | **Health** | Illness, injury, servants/subordinates, burdens, labor. | Competence, order, discrimination, a workable relationship with body and daily life. | Health, routines, work habits, service, pets, upkeep. |
| **7** | **Relationships** | Spouse, marriage, contracts, alliances, open opponents. | Encounter with the Other; projection, partnership, qualities experienced through another person. | Relationships, marriage, business partnerships, one-to-one dynamics. |
| **8** | **Shared Resources** | Death, inheritance, other people's property, resources connected with partners. | Vulnerability, dependency, merging, loss, power, transformation through deep involvement. | Shared finances, debt, taxes, inheritance, intimacy, psychological transformation. |
| **9** | **Belief** | Religion, divination, dreams, pilgrimage, long journeys. | Enlargement of consciousness; the search for an encompassing philosophy or worldview. | Beliefs, higher education, philosophy, spirituality, publishing, long-distance travel. |
| **10** | **Work** | Actions, profession, rank, authority, reputation, public standing. | Developing an effective public identity and realizing capacities in the world. | Career, achievement, reputation, ambitions, visible role. |
| **11** | **Community** | Friends, benefactors, hopes, good fortune; Jupiter's joy. | Locating oneself within something larger; possibilities beyond the isolated ego. | Friendships, communities, networks, groups, aspirations. |
| **12** | **Unconscious** | Enemies, confinement, affliction, isolation, things working against the native. | Weakening of ordinary ego boundaries; hidden psychic material; relation to the collective/transpersonal psyche. | Subconscious patterns, retreat, solitude, institutions, spirituality, self-undoing. |

### Ambient Houses

An **ambient house** has no natal planetary engine producing constant internal noise. Its signal floor is low, making it responsive to external transit pressure.

Do not call an ambient house "empty." Say:

> *"This area is ambient: quieter by default, but responsive when external pressure enters."*

### Depth Restorations for the Difficult Houses

Do not demand that the handle do the paragraph's job.

| Layer | house_02 Money | house_08 Shared Resources | house_12 Unconscious |
| :--- | :--- | :--- | :--- |
| **Handle** | **Money** | **Shared Resources** | **Unconscious** |
| **Immediate gloss** | Personal resources, possessions, security, values, self-worth. | Shared money, debt, inheritance, intimacy, dependency, power, consequence. | Inner life, hidden patterns, solitude, dreams, retreat, what operates out of sight. |
| **Deep dive** | Livelihood, movable wealth, substance, fragility of what can be taken away. | Death/inheritance tradition; vulnerability, merging, loss, transformation. Do not flatten to “unconscious.” | Historical confinement and hidden opposition; psychological hidden material. The handle is a later psychological choice, not the Hellenistic definition. |

---

## **SECTION IV: WHY THE LABEL IS A HANDLE, NOT A DEFINITION**

*The frontstage word gets the user through the door. The evolution column and the gloss restore the room.*

| House | Handle | What the handle cannot carry (restore immediately) |
| :--- | :--- | :--- |
| **1st** | **Identity** | Body, vitality, first impressions, instinctive approach. Avoid **Self** (Jung's technical Self is the larger psychic totality). |
| **2nd** | **Money** | Values, self-worth, security, inner substance. The handle is cash-legible; the house is not only cash. |
| **3rd** | **Communication** | Siblings, local travel, neighborhood, everyday movement. |
| **4th** | **Home** | Ancestry, land, psychic roots, the end of matters. Do not assume home is safe or happy. |
| **5th** | **Play** | Children, romance, creativity, risk. The handle is not juvenile; the house is generative. |
| **6th** | **Health** | Labor, service, subordinates, daily competence. Categorical, not moral. |
| **7th** | **Relationships** | Contracts, open opponents, projection onto the Other. Broader than romance. |
| **8th** | **Shared Resources** | Death tradition, power, merging, loss. Not cheerful sharing. Not a water-house “unconscious” slogan. |
| **9th** | **Belief** | Travel, law, publishing, enlargement of consciousness. Not only ideology. |
| **10th** | **Work** | Rank, reputation, public identity, lives not organized around a job. |
| **11th** | **Community** | Benefactors, hopes, locating the self in something larger. Distinct from one-to-one Relationships. |
| **12th** | **Unconscious** | Enemies, confinement, institutions, self-undoing. Pair with the gloss so it is not read as physical unconsciousness. |

---

## **SECTION V: THE ENGINEERING DIAGNOSTIC (READING SYMBOLIC WEATHER)**

*In The Woven Map, you do not predict events. You diagnose Structural Load and translate it into testable ordinary experience.*

**1. The Protocol**

* **Identify the Engine (Transit Planet):** What kind of force is applying pressure? (e.g., Saturn = Compression; Mars = Friction).
* **Identify the House:** Where is this pressure landing? Use `house_10` / 10th / **Work**, not a chamber name.
* **Translate to Plain English:** Map the licensed mechanism to ordinary life through the handle and its gloss.

**2. The Synthesis Comparison**

* *Standard Horoscope Approach:* "Saturn in the 10th House means trouble at work."
* *Retired Branded Voice:* "High Compression Load on your Canopy chamber."
* *Raven Clean Frontstage Voice:* "Saturn is putting heavy compression on Work: your public role, visible responsibilities, and what you are known for. You are being asked to carry a higher standard of consequence without cutting corners."

**3. Critical Note on Location Basis**

* **The Rule:** The "Event Horizon" (Symbolic Weather) changes based on where you stand.
* **Implication:** A storm hitting Money (`house_02`) in New York might rotate to hit Identity (`house_01`) in London. Accurate location data is required to calculate where the pressure lands.
* **Integrity Gate:** If location basis is missing when house calculations are required, the system must trigger `PROVENANCE_INTEGRITY_FAILURE.LOCATION_BASIS_MISSING` and block symbolic house claims rather than guessing or generalizing.

---

## **SECTION VI: ANGLES, HOUSE SYSTEMS, AND THE TWO SENSES OF “JUNGIAN”**

Keep these two uses of “Jungian” distinct.

**A. Jung himself (house-system practice).**  
Jung did not express a strong dogmatic preference for a mathematical house system. In practice he defaulted to **Campanus** (documented in family charts by Gret Baumann-Jung; prime-vertical / spatial division) and **Placidus** (the Central European table standard; used in the 1952 synchronicity marriage experiment). He privileged the **four angles** and **planetary aspects** over the exact boundary between intermediate houses. The twelve-house circle was a mandala of the psyche, not a computational dispute. He did **not** invent or formally codify the twelve frontstage handles.

**B. Jungian / psychological astrology (house meanings).**  
The later tradition influenced by Jung — especially Sasportas and Greene — reframed houses from external areas of fate into domains through which the psyche perceives and experiences life. That is the “psychological” column in Section III. It is an evolution of emphasis, not a claim that Jung wrote those meanings.

**Frontstage consequence**

* Name the life-domain handle and the force. Do not open by arguing Campanus versus Placidus versus Whole Sign.
* When an angle is the landing, say so in ordinary language: Identity (ASC), Relationships (DSC), Home (IC), Work (MC).
* Exact cusp hair-splitting stays backstage unless `/raw` or `/doctrine` is requested and the sealed system depends on it.
* Live calculation continues to use the house system already specified by MAP provenance. This section does not change sealed house math.
