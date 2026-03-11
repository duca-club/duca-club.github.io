import type { TeamMember } from "@components/ui/team-card";

export interface TeamDivision {
  name: string;
  description: string;
  members: TeamMember[];
}

export const executives: TeamMember[] = [
  {
    name: "Sham Polavarapu",
    role: "President",
    image: "/team/sham-polavarapu.png",
    linkedIn: "https://www.linkedin.com/in/p-shambhavi/",
    bio: "Built a 'dog' with arduino when she was 15 because her parents said no to pet.",
  },
  {
    name: "Aditya Kapoor",
    role: "Vice President",
    image: "/team/aditya-kapoor.png",
    linkedIn: "https://www.linkedin.com/in/adityakapoor23/",
    bio: "Can chug a full liter of vodka with a straight face.",
  },
  {
    name: "Ashley Mathew",
    role: "Secretary",
    image: "/team/ashley-mathew.png",
    linkedIn: "https://www.linkedin.com/in/ashleyymathew/",
    bio: "Chess enthusiast who loves CATS and all things tech.",
  },
  {
    name: "Kat Ho",
    role: "Treasurer",
    image: "/team/kat-ho.png",
    linkedIn: "https://www.linkedin.com/in/kat-ho/",
    bio: "Her biggest leap of faith was skydiving out fo a plane.",
  },
  {
    name: "Hirusha Adikari",
    role: "Asst. Secretary",
    image: "/team/hirusha-adikari.png",
    linkedIn: "https://www.linkedin.com/in/hirusha-adi/",
    bio: "A sleep deprived nerd. Jack of all trades, master of none.",
  },
  {
    name: "George Ferres",
    role: "Developer",
    image: "/team/george-ferres.png",
    linkedIn: "https://www.linkedin.com/in/georgeferres/",
    bio: "",
  },
  {
    name: "Pasindu Peramuna",
    role: "Developer",
    image: "/team/pasindu-peramuna.png",
    linkedIn: "https://www.linkedin.com/in/pasinduperamuna/",
    bio: "",
  },
  {
    name: "Paige Haines",
    role: "Relations",
    image: "/team/paige-haines.png",
    linkedIn: "https://www.linkedin.com/in/paigehai/",
    bio: "Hacked in-game currency into moshi monsters using cheat engine in 2009.",
  },
  {
    name: "Maple Fox",
    role: "Advisor",
    image: "/team/maple-fox.png",
    linkedIn: "https://www.linkedin.com/in/maplefox/",
    bio: "Full-time caffeinated nerd/dweeb/dork/dingus that likes lifting heavy things.",
  },
];

export const divisions: TeamDivision[] = [
  {
    name: "Development Division",
    description:
      "We make cool software for the club! Whether you're new to coding or already building things, we'll work together, learn together, and create useful tools for everyone.",
    members: [
      { name: "George Ferres", role: "Team Lead", image: "/team/george-ferres.png", linkedIn: "https://www.linkedin.com/in/georgeferres/" },
      { name: "Hirusha Adikari", role: "Team Lead", image: "/team/hirusha-adikari.png", linkedIn: "https://www.linkedin.com/in/hirusha-adi/" },
      { name: "Pasindu Peramuna", role: "Team Lead", image: "/team/pasindu-peramuna.png", linkedIn: "https://www.linkedin.com/in/pasinduperamuna/" },
      { name: "Lia McCracken", role: "Team Member", image: "/team/lia-mccracken.png", linkedIn: "https://www.linkedin.com/in/lia-mccracken-8b19053b2/" },
      { name: "Ryan Lee", role: "Team Member", image: "/team/ryan-lee.png", linkedIn: "https://www.linkedin.com/in/ryan-lee-cs/" },
      { name: "Lily Ha", role: "Team Member", image: "/team/lily-ha.png", linkedIn: "https://www.linkedin.com/in/lilyquynhha/" },
      { name: "Bang Mach", role: "Team Member", image: "/team/bang-mach.png", linkedIn: "https://www.linkedin.com/in/bang-mach-dieu/" },
      { name: "Alex Wu", role: "Team Member", image: "/team/alex-wu.png", linkedIn: "https://www.linkedin.com/in/alex-wu-21b06a20a/" },
      { name: "Raaid Rushdy", role: "Team Member", image: "/team/raaid-rushdy.png", linkedIn: "https://www.linkedin.com/in/raaidrushdy/" },
      { name: "Shounak Bhalerao", role: "Team Member", image: "/team/shounak-bhalerao.png", linkedIn: "https://www.linkedin.com/in/shounak-bhalerao/" },
    ],
  },
  {
    name: "Penetration Testing Division",
    description:
      "We explore ethical hacking in a safe, friendly space! Together, we learn how attackers think - and how to stop them - through fun, guided activities.",
    members: [
      { name: "Kat Ho", role: "Team Lead", image: "/team/kat-ho.png", linkedIn: "https://www.linkedin.com/in/kat-ho/" },
      { name: "Sagar Nayar", role: "Team Member", image: "/team/sagar-nayar.png", linkedIn: "https://www.linkedin.com/in/sagar-nayar-399b62249/" },
      { name: "Dipen Thaker", role: "Team Member", image: "/team/dipen-thaker.png", linkedIn: "https://www.linkedin.com/in/dipenthaker/" },
    ],
  },
  {
    name: "Networking Division",
    description:
      "We dig into how the internet actually works! Through fun, hands-on activities, we learn how devices connect, talk, and stay secure - together!",
    members: [
      { name: "Paige Haines", role: "Team Lead", image: "/team/paige-haines.png", linkedIn: "https://www.linkedin.com/in/paigehai/" },
      { name: "Nokutendaishe Masuku", role: "Team Member", image: "/team/nokutendaishe-masuku.png", linkedIn: "https://www.linkedin.com/in/nokutendaishe-masuku-1228b429a/" },
      { name: "Pratigya Pal", role: "Team Member", image: "/team/pratigya-pal.png", linkedIn: "https://www.linkedin.com/in/pratigya-pal/" },
      { name: "Navya Midha", role: "Team Member", image: "/team/navya-midha.png", linkedIn: "https://www.linkedin.com/in/navya-midha-8711a11b5/" },
    ],
  },
  {
    name: "Cyber Essentials Division",
    description:
      "We introduce everyone to the basics of cybersecurity in a super friendly, beginner-friendly way - perfect for easing into the tech world without feeling overwhelmed!",
    members: [
      { name: "Aarnav Singh", role: "Team Lead", image: "https://ui-avatars.com/api/?name=Aarnav+Singh", linkedIn: "#" },
      { name: "Anika G.", role: "Team Member", image: "/team/anika-g.png", linkedIn: "https://www.linkedin.com/in/anastasiyaagguenov/" },
      { name: "Corina Pascoe", role: "Team Member", image: "https://ui-avatars.com/api/?name=Cornia+Pascoe", linkedIn: "https://www.linkedin.com/in/corina-p-940b11338/" },
      { name: "Meetkumar Patel", role: "Team Member", image: "https://ui-avatars.com/api/?name=Meetkumar+Patel", linkedIn: "#" },
      { name: "Shweta", role: "Team Member", image: "/team/shweta.png", linkedIn: "https://www.linkedin.com/in/shweta-a1ba1036a/" },
    ],
  },
  {
    name: "Capture The Flag Division",
    description:
      "We're all about solving fun cybersecurity puzzles together! We learn heaps, celebrate progress, and help each other crack challenges in a relaxed, supportive environment.",
    members: [
      { name: "Long Do", role: "Team Lead", image: "/team/long-do.png", linkedIn: "https://www.linkedin.com/in/r1ce0mellete/" },
      { name: "Azelma Aghakishiyeva", role: "Team Member", image: "/team/azelma-aghakishiyeva.png", linkedIn: "https://www.linkedin.com/in/azelma-aghakishiyeva-081053278/" },
      { name: "Marco", role: "Team Member", image: "https://ui-avatars.com/api/?name=Marco", linkedIn: "#" },
      { name: "Jasmin Smallu", role: "Team Member", image: "/team/jasmin-smallu.png", linkedIn: "https://www.linkedin.com/in/jasmin-smallu-5b0852268/" },
    ],
  },
  {
    name: "Remote Events Division",
    description:
      "We make sure everyone can join in the fun from anywhere! We host online workshops, games, streams, and events so no one ever feels left out.",
    members: [
      { name: "George Ferres", role: "Team Lead", image: "/team/george-ferres.png", linkedIn: "https://www.linkedin.com/in/georgeferres/" },
      { name: "Bang Mach", role: "Team Member", image: "/team/bang-mach.png", linkedIn: "https://www.linkedin.com/in/bang-mach-dieu/" },
    ],
  },
  {
    name: "Advertising Division",
    description:
      "We're the team that makes everything look fun and exciting! We spread the word about our events, projects, and wins so everyone feels welcome and included.",
    members: [
      { name: "Ashley Mathew", role: "Team Lead", image: "/team/ashley-mathew.png", linkedIn: "https://www.linkedin.com/in/ashleyymathew/" },
      { name: "Rebecca Joseph", role: "Team Member", image: "/team/rebecca-joseph.png", linkedIn: "https://www.linkedin.com/in/rebecca-deepak-joseph/" },
      { name: "Mauro Sunda", role: "Team Member", image: "/team/mauro-sunda.png", linkedIn: "https://www.linkedin.com/in/mauro-sunda-29aa02263/" },
    ],
  },
];
