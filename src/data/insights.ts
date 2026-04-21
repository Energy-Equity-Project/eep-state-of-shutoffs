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
    number: 0,
    headline: "Illuminating america’s hidden hardship",
    stat: "Dr. Diana Hernandez, often admired as the “mother of energy justice”, has called energy insecurity America’s Hidden Hardship. The number of states reporting shutoffs by any utility plummeted from a high of 40 in 2021 to just 21 by 2024. The vast majority of the country’s 700 cooperative and 2,000 municipal utilities have never been required to disclose shutoffs. As utilities plunged millions of households into darkness, public awareness of the problem was similarly kept in the shadows. The EIA’s first comprehensive survey of shutoffs by all utilities turns the tide on secrecy, collecting data from electric and gas utilities serving 95% of Americans. This data is a hidden gem, helping us to reveal the depth of harm from what was once America’s Hidden Hardship.",
    frame: "",
    headlineHighlights: [],
    statHighlights: []
  },
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
    headline: "The warnings outnumber the shutoffs more than ten to one",
    stat: "Utilities sent 122 million shutoff notices in 2024 \u2014 95M for electric, 27M for gas.",
    frame: "Every notice is a series of frantic calls to human service agencies that are too often out of assistance funds, a skipped prescription, a series of sleepless nights and heart palpitations. The choice between a cold dinner and the energy to cook and refrigerate. Explaining to the children the choice to sweat or shiver through the night to keep a roof overhead. The unseen hustle for a payday loan that demands a 25% cut of hard-earned wages.\nUtilities and those who regulate them will tell you most notices don't end in a shutoff — as if that is a defense. It isn't. It is an admission that the threat itself is the business model. Utilities use shutoffs to rake in hundreds of millions in late fees, deposits, and reconnection fees. Fifteen million shutoffs a year rest on top of one hundred twenty two million threats a year. The whole structure, built on fear, has dire consequences.",
    headlineHighlights: ["more than than ten to one"],
    statHighlights: ["122 million shutoff notices"],
  },
  {
    number: 3,
    headline: "This is not a winter problem. It is a year-round problem.",
    stat: `Shutoffs were remarkably flat across the calendar. Every single month of 2024 saw more than 1 million combined shutoffs. October was the worst (1.63M). December was the \u201Clightest\u201D (1.02M)/`,
    frame: "Seasonal moratoriums are sold to the public as if the problem is weather. It isn't. Utilities shut people off in January. They shut people off in July. They shut people off in October. With extreme weather on the rise around the country, a protection that only covers the coldest or hottest weeks is a sieve and people will always fall through the cracks, with potentially life-threatening consequences. The only dependable protection is ending shutoffs.",
    headlineHighlights: ["year-round problem"],
    statHighlights: ["1 million combined shutoffs"],
  },
  {
    number: 4,
    headline: "The South is ground zero for shutoffs",
    stat: "Texas alone executed 3.23 million shutoffs in 2024 — 22% of the national total. Florida added 2.21 million (15%). Together, these two sunny states executed 36% of the shutoffs in America. The top five states alone (which adds Tennessee #3, Oklahoma #4, and Georgia, #5) executed 7.29 million shutoffs – nearly half.",
    frame: "Shutoffs are a national practice, but they are not evenly distributed. The geography of pain maps onto the geography of fraught energy policies and regulation: weak Public Utility Commissions, deregulated retail markets, no transparent reporting, and the most profitable utility companies. The concentration of shutoffs in southern states is not a coincidence. It is the product of unmitigated utility power, their financial stranglehold over legislators, governors and elected PUC commissioners. Their disregard for customers can be reversed; decisions can be unmade.",
    headlineHighlights: [],
    statHighlights: ["3.23 million shutoffs", "36% of every shutoff in America"],
  },
  {
    number: 5,
    headline: "In Oklahoma, one in three accounts are shut off each year",
    stat: "Oklahoma's 2024 combined shutoff rate reached 33.2% of customers — the highest in the country. Texas followed at 25.2%, Alabama at 22.3%, Florida at 20.9%, Louisiana at 20.8%",
    frame: "These are not extreme outliers. These are the normal numbers for a belt of states running from the southern Plains through the Deep South. Nearly one in three Oklahomans with a utility account lost their electricity or gas at some point last year. If a third of drivers had their license revoked every year, the country would call it a crisis. When it happens to families' electricity, we call it business as usual.",
    headlineHighlights: ["one in three"],
    statHighlights: ["30.4%"],
  },
  {
    number: 6,
    headline: `The \u201Cbest\u201D states still shut off tens of thousands`,
    stat: "The lowest electric shutoff rates in the country were in Wyoming (1.9%), Montana (2.6%), Rhode Island (2.6%), and Massachusetts (2.7%). Even so, Massachusetts alone executed over 72,000 shutoffs in 2024. New York — often cited as a progressive leader on utility policy — allowed more than 267,000 shutoffs.",
    frame: `There is no “best actor” in shutoffs - there are only states that do it less. A 1% shutoff rate still means tens of thousands of lives routinely disrupted and endangered. Every “model” or “high performing” state is still doing something we believe no state should do at all. Celebrating relatively low numbers is how the floor gets mistaken for the ceiling.`,
    headlineHighlights: ["tens of thousands"],
    statHighlights: ["72,000 shutoffs", "more than 267,000 shutoffs"],
  },
  {
    number: 7,
    headline: "Alabama's gas numbers show what deep inequity looks like",
    stat: "Alabama shut off gas to 10.05% of gas customers in 2024 about 5x the national gas shutoff rate (2.23%). Arkansas, Mississippi, Tennessee, and Oklahoma all have gas shutoff rates above 5%. In Southeast Alabama, the Dothan municipal utility holds a shameful national distinction as the only utility (that we know of) to exceed one shutoff per household (104% rate) over a 12-month period",
    frame: "This is what the system looks like where there is almost no effective regulation. Gas is heat. Gas is hot water. Gas fuels the stove that feeds the kids. The people on the other side of the shutoff valve are disproportionately Black, disproportionately poor, and disproportionately in the South. The pattern is not an accident.",
    headlineHighlights: ["deep inequity"],
    statHighlights: ["10.05% of gas customers", "5x the national gas shutoff rate"],
  },
  {
    number: 8,
    headline: "Texas and Florida shut off power 650k times in the two hottest months of the year",
    stat: "In July and August 2024 alone, Texas utilities carried out ~300,000 electric shutoffs. Florida added another ~350,000 in those same two months. Combined, that is over 10,000 households per day losing electricity during the deadliest heat of the summer, in two states that regularly see heat indexes above 105°F. In Houston, low temperatures never dipped below 80°F from August 5-24. Florida has no shutoff protections for any level of extreme heat.",
    frame: `Heat kills more Americans every year than any other weather event. Shutting off air conditioning along the gulf in August is not a billing action. It is a gamble with a human life — a gamble the utility makes without the customer’s consent, all to ensure an uninterrupted flow of dividends to an air-conditioned building on Wall Street. The federal government values a statistical life at roughly $13 million. For whom is a 105° apartment with no power “cost-effective”?`,
    headlineHighlights: ["650k times"],
    statHighlights: ["~300,000 electric shutoffs", "~350,000"],
  },/*
  {
    number: 9,
    headline: "California shows that volume doesn't have to equal rate",
    stat: "California carried out 473,000 electric shutoffs in 2024 \u2014 the 5th-highest raw count in the country. But its shutoff rate was just 3.4%, a fraction of Oklahoma's or Texas's, despite California being bigger than either. It sits among the lower-rate states because its regulatory structure forces more friction into the process.",
    frame: "California isn't a hero here \u2014 half a million shutoffs is half a million shutoffs. But it is proof that volume and rate are policy choices, not physics. When a Public Utility Commission takes its job seriously, when moratoriums are real, when arrearage programs function, the rate moves. The abolitionist point stands: if it can be bent, it can be broken. And bending it isn't abolition. Breaking it is.",
    headlineHighlights: ["volume doesn't have to equal rate"],
    statHighlights: ["3.4%"],
  }, */
  {
    number: 9,
    headline: "The wealth to ensure universal affordability is already in the system",
    stat: "U.S. investor-owned utilities collect on the order of $50 billion per year in excess revenue over operating needs. Less than 2% of IOU shareholder dividends would forgive every customer arrearage in the country. As with many economic questions before Americans, it's a question of a more equitable distribution and political will, not whether the richest country in history can actually afford it.",
    frame: "When someone tells you we can't afford to stop shutoffs — remember this: the money is in the system. It is sitting in dividends and guaranteed 10% returns on equity and executive compensation packages that can top $50 million. The people’s money is subsidizing data centers and multi-billion dollar companies, and paying for a safety net that treats the symptom and ignores the disease. The question has never been whether America could afford to stop shutting people off. The question is whether we will decide to. ",
    headlineHighlights: ["already in the system"],
    statHighlights: ["Less than 2% of IOU shareholder dividends"],
  },
  {
    number: 10,
    headline: "The data must end the death trap of shutoffs now, not be complicit in it.",
    stat: "When new DNA evidence exonerates someone wrongfully convicted, we do not allow a prison to devise a multi-year plan for their release. They are entitled to immediate emancipation. Similarly, the EIA’s irrefutable data about the national scale of shutoffs must not be used to justify additional studies, pilot programs, or a swiss cheese of shutoff protections. There is a place for engaging the most impacted communities in designing programs that structurally mitigate unaffordable bills and deliver climate resilience. But questions about how best to foster a just and affordable energy system belong after freedom from shutoffs has been firmly established.",
    frame: "When new DNA evidence exonerates someone wrongfully convicted, we do not allow a prison to devise a multi-year plan for their release. They are entitled to immediate emancipation. Similarly, the EIA’s irrefutable data about the national scale of shutoffs must not be used to justify additional studies, pilot programs, or a swiss cheese of shutoff protections. There is a place for engaging the most impacted communities in designing programs that structurally mitigate unaffordable bills and deliver climate resilience. But questions about how best to foster a just and affordable energy system belong after freedom from shutoffs has been firmly established.",
    headlineHighlights: ["end the death trap of shutoffs now"],
    statHighlights: [],
  }
];
