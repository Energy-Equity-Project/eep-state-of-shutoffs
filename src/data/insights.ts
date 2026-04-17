export interface Insight {
  number: number;
  headline: string;
  stat: string;
  frame: string;
  headlineHighlights: string[];
  statHighlights: string[];
}

export const insights: Insight[] = [
  {
    number: 1,
    headline: "The scale is worse than we thought",
    stat: "In 2024, utilities in the United States carried out nearly 15 million shutoffs \u2014 about 13.4 million electric and 1.5 million gas. That is one shutoff every 2.1 seconds, every day, all year.",
    frame: `For years the movement has cited \u201Cabout 7 million shutoffs a year.\u201D The new federal data doubles that. Whatever the old number told us, the real one tells us more loudly: this is not an edge case. This is a national practice. A country that shuts off power 15 million times a year does not have an affordability problem around the margins. It has a system that runs on cruelty.`,
    headlineHighlights: ["worse than we thought"],
    statHighlights: ["nearly 15 million shutoffs"],
  },
  {
    number: 2,
    headline: "The warnings outnumber the cutoffs by nearly ten to one",
    stat: "Utilities sent 115.6 million shutoff notices in 2024 \u2014 88.6M for electric, 27M for gas. That is roughly 6.6 electric notices and 17.8 gas notices for every shutoff actually performed.",
    frame: "Every notice is a household's weekend ruined, a phone call to a relative, a skipped prescription, a choice between dinner and a down payment. The industry will tell you most notices don't end in a shutoff \u2014 as if that is a defense. It isn't. It is an admission that the threat itself is the business model. Fifteen million cutoffs a year rest on top of a hundred million threats a year. The whole structure is built on fear.",
    headlineHighlights: ["nearly ten to one"],
    statHighlights: ["115.6 million shutoff notices"],
  },
  {
    number: 3,
    headline: "This is not a winter problem. It is a year-round problem.",
    stat: `Shutoffs were remarkably flat across the calendar. Every single month of 2024 saw more than 1 million combined shutoffs. October was the worst (1.62M). December was the \u201Clightest\u201D (1.02M) \u2014 still more than a million households lost power in the coldest month of the year.`,
    frame: "Seasonal moratoriums are sold to the public as if the problem is weather. It isn't. Utilities shut people off in January. They shut people off in July. They shut people off in October, when the heat is finally off and the heat bills haven't started, and it's the single worst month of the year. A protection that only covers the coldest or hottest weeks is not a protection \u2014 it is a calendar. The real protection is ending the practice.",
    headlineHighlights: ["year-round problem"],
    statHighlights: ["1 million combined shutoffs"],
  },
  {
    number: 4,
    headline: "Two states account for more than a third of all shutoffs",
    stat: "Texas alone carried out 3.23 million shutoffs in 2024 \u2014 22% of the national total. Florida added 2.21 million (15%). Together, two states produced 36% of every shutoff in America. The top five states produced nearly half.",
    frame: "Shutoffs are a national practice, but they are not evenly distributed. The geography of pain maps onto the geography of political choice: weak Public Utility Commissions, deregulated retail markets, no meaningful moratoriums, and utility companies that answer to shareholders before they answer to anyone in the house. This is not bad luck. It is a regulatory climate produced by decisions \u2014 and decisions can be unmade.",
    headlineHighlights: ["more than a third"],
    statHighlights: ["3.23 million shutoffs", "36% of every shutoff in America"],
  },
  {
    number: 5,
    headline: "In Oklahoma, almost one in three electric customers gets shut off in a year",
    stat: "Oklahoma's 2024 electric shutoff rate reached 30.4% of customers \u2014 the highest in the country. Texas followed at 23.6%, Florida at 20.6%, Alabama at 19.0%, Louisiana at 18.6%.",
    frame: "These are not extreme outliers. These are the normal numbers for a belt of states running from the Southwest through the Deep South. Nearly one in three Oklahomans on an electric account lost their electricity at some point last year. If a third of drivers had their license revoked every year, the country would call it a crisis. When it happens to families' electricity, we call it collections.",
    headlineHighlights: ["one in three"],
    statHighlights: ["30.4%"],
  },
  {
    number: 6,
    headline: `The \u201Cbest\u201D states still shut off tens of thousands`,
    stat: "The lowest electric shutoff rates in the country were in Wyoming (1.2%), Rhode Island (1.5%), Montana (1.8%), and Massachusetts (1.9%). Even so, Massachusetts alone performed over 50,000 electric shutoffs in 2024. New York \u2014 often cited as a progressive leader on utility policy \u2014 performed over 173,000.",
    frame: `We say this carefully: there is no \u201Cbest actor\u201D in shutoffs. There are only states that do it less. A 1% shutoff rate still means thousands of lives disrupted in a single year. Every \u201Cmodel state\u201D on this chart is still doing something we believe no state should do at all. Celebrating the low numbers is how the floor gets mistaken for the ceiling.`,
    headlineHighlights: ["tens of thousands"],
    statHighlights: ["50,000 electric shutoffs"],
  },
  {
    number: 7,
    headline: "Alabama's gas numbers show what deep inequity looks like",
    stat: "Alabama shut off gas to 10.05% of gas customers in 2024 \u2014 roughly double the next-highest state and more than 5x the national gas shutoff rate. Arkansas, Mississippi, Tennessee, and Oklahoma were not far behind, all above 5%.",
    frame: "This is what the system looks like where there is almost no regulatory pushback. Gas is heat. Gas is hot water. Gas is the stove that feeds the kids. A 10% annual cutoff rate on gas customers isn't affordability policy \u2014 it's a company collection department operating with the full force of a monopoly. The people on the other side of the shutoff valve are disproportionately Black, disproportionately poor, and disproportionately in the South. The pattern is not an accident.",
    headlineHighlights: ["deep inequity"],
    statHighlights: ["10.05% of gas customers"],
  },
  {
    number: 8,
    headline: "Texas shut off power 300,000 times in the two hottest months of the year",
    stat: "In July and August 2024 alone, Texas utilities carried out ~300,000 electric shutoffs. Florida added another ~350,000 in those same two months. Combined, that is over 10,000 households per day losing electricity during the deadliest heat of the summer, in two states that regularly see heat indexes above 105\u00B0F.",
    frame: `Heat kills more Americans every year than any other weather event. Shutting off air conditioning in a Texas August is not a billing action. It is a gamble with a human life \u2014 a gamble the utility makes on the customer's behalf, without their consent, while paying dividends out the other side of the building. The federal government values a statistical life at roughly $8 million. A 105\u00B0 apartment with no power has never once been \u201Ccost-effective.\u201D`,
    headlineHighlights: ["300,000 times"],
    statHighlights: ["~300,000 electric shutoffs"],
  },
  {
    number: 9,
    headline: "California shows that volume doesn't have to equal rate",
    stat: "California carried out 473,000 electric shutoffs in 2024 \u2014 the 5th-highest raw count in the country. But its shutoff rate was just 3.4%, a fraction of Oklahoma's or Texas's, despite California being bigger than either. It sits among the lower-rate states because its regulatory structure forces more friction into the process.",
    frame: "California isn't a hero here \u2014 half a million shutoffs is half a million shutoffs. But it is proof that volume and rate are policy choices, not physics. When a Public Utility Commission takes its job seriously, when moratoriums are real, when arrearage programs function, the rate moves. The abolitionist point stands: if it can be bent, it can be broken. And bending it isn't abolition. Breaking it is.",
    headlineHighlights: ["volume doesn't have to equal rate"],
    statHighlights: ["3.4%"],
  },
  {
    number: 10,
    headline: "Cost of universal affordability is already in the system",
    stat: "Stat: U.S. investor-owned utilities collect on the order of $50 billion per year in excess revenue over operating needs. Less than 2% of IOU shareholder dividends would forgive every customer arrearage in the country. Over 80% of the low-income energy safety net — roughly $10 billion per year — already flows to bill assistance as a recurring band-aid, rather than to deep retrofits and weatherization that would end the problem at its root.",
    frame: "So when a regulator tells you we can't afford to stop — remember this. The money is there. It is already in the system. It is sitting in dividends and in guaranteed 10% returns on equity and in executive compensation packages. It is already being spent, year after year, on a safety net that treats the symptom and ignores the disease. The question has never been whether America could afford to stop shutting people off. The question is whether we will decide to. That is the whole argument. It was always the whole argument.",
    headlineHighlights: ["already in the system"],
    statHighlights: ["Less than 2% of IOU shareholder dividends"],
  },
];
