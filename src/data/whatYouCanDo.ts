export type ActionKind = 'short' | 'long';

export interface Action {
  kind: ActionKind;
  text: string;
  detail?: string;
}

export interface Audience {
  id: string;
  level: string;
  title: string;
  short: string;
  why: string;
  actions: Action[];
}

export const AUDIENCES: Audience[] = [
  {
    id: 'federal',
    level: 'Federal',
    title: 'Federal agencies',
    short: 'Federal',
    why: 'You set the floor. Rules at HHS, DOE, FERC, and HUD shape every state below.',
    actions: [
      { kind: 'short', text: 'Tie LIHEAP block grant performance to a no-shutoff-during-crisis-temperature standard.' },
      { kind: 'short', text: 'Direct DOE to publish quarterly shutoff data alongside utility reliability metrics.' },
      { kind: 'long',  text: 'Re-scope HHS guidance on energy insecurity.',
        detail: 'Treat disconnection as a health outcome, not a billing outcome — fund state Medicaid offices to flag and resolve shutoff risk for medically fragile households.' },
      { kind: 'short', text: 'Require any utility receiving federal infrastructure dollars to report shutoffs by census tract, monthly.' },
      { kind: 'long',  text: 'Make HUD\u2019s Utility Allowance methodology reflect real arrears.',
        detail: 'The current formula assumes households can pay their full bill. They can\u2019t. Update the math, then enforce.' },
      { kind: 'short', text: 'Open a federal study on the cost of a national shutoff moratorium during heat waves and cold snaps.' },
    ],
  },
  {
    id: 'puc',
    level: 'State \u00b7 Regulatory',
    title: 'Public utilities commissions',
    short: 'PUCs',
    why: 'You hold the pen on the rules utilities must follow. Most shutoff policy starts here.',
    actions: [
      { kind: 'short', text: 'Adopt year-round temperature-based shutoff protections — not just December–March.' },
      { kind: 'short', text: 'Require utilities to file standardized monthly shutoff data, broken out by ZIP code.' },
      { kind: 'long',  text: 'End shutoffs for households with a child under 2, an elder over 65, or a documented medical device.',
        detail: 'Several states already do this. The remaining holdouts can copy the rule verbatim.' },
      { kind: 'short', text: 'Cap reconnection fees and waive them when the cause was a billing dispute.' },
      { kind: 'short', text: 'Require an automatic deferred-payment plan offer before any disconnection notice is mailed.' },
      { kind: 'long',  text: 'Approve rate cases only when the utility has shown its arrears-management plan is working.',
        detail: 'Make the burden of proof the utility\u2019s, not the ratepayer\u2019s.' },
      { kind: 'short', text: 'Open a docket on "percentage-of-income" billing pilots.' },
    ],
  },
  {
    id: 'legislators',
    level: 'State \u00b7 Legislative',
    title: 'State legislators',
    short: 'Legislators',
    why: 'You write the statute the PUC has to follow. Strong floors and clear definitions live here.',
    actions: [
      { kind: 'long',  text: 'Pass a Shutoff Data Transparency Act.',
        detail: 'Define the data utilities must report, the cadence (monthly), and a public-facing dashboard the AG\u2019s office maintains. Without data, every other reform is guesswork.' },
      { kind: 'short', text: 'Codify a temperature-trigger moratorium so it can\u2019t be undone by the next PUC.' },
      { kind: 'short', text: 'Fund the state\u2019s arrearage-management program at full need, not symbolic levels.' },
      { kind: 'short', text: 'Bar utilities from charging late fees or interest on LIHEAP-eligible balances.' },
      { kind: 'long',  text: 'Create a statutory "right to reconnection" within 24 hours of payment or qualifying hardship.',
        detail: 'No more "wait until the truck rolls."' },
      { kind: 'short', text: 'Strengthen utility-customer-service standards with real penalties — not letters of concern.' },
    ],
  },
  {
    id: 'governors',
    level: 'State \u00b7 Executive',
    title: 'Governors',
    short: 'Governors',
    why: 'You convene. You declare. You appoint. The crisis posture of a state is yours to set.',
    actions: [
      { kind: 'short', text: 'Declare an energy-affordability state of emergency before the next heat wave or cold snap.' },
      { kind: 'long',  text: 'Direct your PUC commissioners to open a shutoff-protection rulemaking within 30 days.',
        detail: 'Appointments are leverage. Use them.' },
      { kind: 'short', text: 'Stand up an interagency Energy Insecurity Task Force — PUC, AG, social services, public health.' },
      { kind: 'short', text: 'Use executive authority to require state-regulated utilities to pause shutoffs above 90°F or below 32°F.' },
      { kind: 'long',  text: 'Match every federal LIHEAP dollar with a state supplement.',
        detail: 'Federal allocations have been flat for a decade. State match closes the gap and signals priority.' },
      { kind: 'short', text: 'Make energy insecurity a reportable indicator in your annual State of the State.' },
    ],
  },
  {
    id: 'state-agencies',
    level: 'State \u00b7 Agency',
    title: 'State agencies',
    short: 'State agencies',
    why: 'You administer the programs people actually touch. Friction here decides who keeps power on.',
    actions: [
      { kind: 'short', text: 'Make LIHEAP applications usable on a phone, in 10 minutes, in the household\u2019s language.' },
      { kind: 'short', text: 'Cross-enroll: if a household qualifies for SNAP or Medicaid, auto-screen them for energy assistance.' },
      { kind: 'long',  text: 'Build a real-time data exchange with utilities.',
        detail: 'When a household applies for assistance, the utility should see it the same day — not three weeks later when the shutoff has already happened.' },
      { kind: 'short', text: 'Train caseworkers to flag medical-device customers and route them to protected-status enrollment.' },
      { kind: 'short', text: 'Publish your queue: how many applications are pending, average wait time, by county.' },
      { kind: 'short', text: 'Spend down LIHEAP every year. Returning unused dollars to the federal government is a policy choice.' },
    ],
  },
  {
    id: 'local',
    level: 'Local',
    title: 'Local government',
    short: 'Local gov',
    why: 'You\u2019re closest to the door that doesn\u2019t open. Cities and counties can act fast, even when the state won\u2019t.',
    actions: [
      { kind: 'short', text: 'Use ARPA / general fund dollars to seed a local utility-arrears relief fund.' },
      { kind: 'long',  text: 'Open cooling and warming centers earlier and longer.',
        detail: 'Don\u2019t wait for the National Weather Service to issue an advisory — the household whose power was cut yesterday is already in crisis.' },
      { kind: 'short', text: 'Direct municipal utilities (where they exist) to adopt the strongest shutoff protections in the state.' },
      { kind: 'short', text: 'Pass a local ordinance requiring landlords to disclose utility-cost history before lease signing.' },
      { kind: 'short', text: 'Stand up a 311 path for shutoff complaints; track it; publish the dashboard.' },
      { kind: 'long',  text: 'Partner with libraries, schools, and community health centers as enrollment hubs.',
        detail: 'People trust the librarian. Meet them where they already are.' },
    ],
  },
  {
    id: 'community',
    level: 'Community',
    title: 'Community organizations',
    short: 'Community',
    why: 'You know the names, the streets, the stories. Policy lives or dies on whether the people most affected are in the room.',
    actions: [
      { kind: 'short', text: 'Show up at PUC hearings. Five minutes of public comment moves more than a hundred-page filing.' },
      { kind: 'long',  text: 'Document what you\u2019re seeing.',
        detail: 'A folder of intake notes from your members — dates, dollars, kids in the home — is the most persuasive testimony there is. Send it to legislators by name.' },
      { kind: 'short', text: 'Train members to tell their own story to media — reporters need the human side, not just the numbers.' },
      { kind: 'short', text: 'Form coalitions across cause lines: housing, climate, health, labor. Shutoffs sit at every intersection.' },
      { kind: 'long',  text: 'Help neighbors enroll.',
        detail: 'Door-knocks, church basements, school pickup lines. Federal dollars left on the table are dollars that didn\u2019t reach a kitchen table.' },
      { kind: 'short', text: 'Demand a seat at every utility rate case. Intervenor compensation exists — use it.' },
      { kind: 'short', text: 'Share this report. Forward it. Print it. Read it together.' },
    ],
  },
];
