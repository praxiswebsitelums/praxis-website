/* =====================================================================
   PRAXIS TEAM PAGE — data

   Everything on team.html is driven from this file. Nothing about the
   Team page structure lives in data/site.js — this keeps Team fully
   independent from the rest of the site's content.

   HOW TO EDIT
   -----------
   - Change hero copy in `hero`.
   - Add/remove Executive Council members in `ec` (cards use the exact
     same visual language as the Home page EC section).
   - Each entry in `departments` renders as one full-width section.
     Directors and assistantDirectors are two separate arrays — they
     always render as two separate rows and never merge.
   - Set `showGroupPhoto: false` on a department to hide its group
     photo entirely (no empty space is left behind).
   - The single `backgroundImage` below is the one GB (General Body)
     photograph used behind the Hero and every odd department — do not
     add a second background image anywhere else.

   All names below marked "Name" / "Director Name" / "Assistant
   Director Name" and the five department names are obvious
   placeholders — swap in the real names, roles and photos when they
   are available. Nothing here is an invented real Praxis member.
   ===================================================================== */

window.PRAXIS_TEAM = {

  /* The one GB photograph the whole page is built around. */
  backgroundImage: "images/team/team-gb.jpg",

  hero: {
    eyebrow: "01 / OUR TEAM",
    title: "The people behind Praxis.",
    description: "Praxis is built by students who research, discuss, organize, question, and contribute. Meet the people who keep that work moving."
  },

  ec: [
    {
      name: "Zawar Hussain",
      role: "President",
      image: "images/team/president.jpg"
    },
    {
      name: "Maryam Zulfiqar",
      role: "General Secretary",
      image: "images/team/general-secretary.jpg"
    },
    {
      name: "Sameen Jahangir",
      role: "Treasurer",
      image: "images/team/treasurer.jpg"
    }
  ],

  /* Exactly five departments. Add or remove entries here and the
     section numbering + transparent/cream alternation update on
     their own — nothing else needs to change. */
  departments: [
    {
      id: "department-01",
      name: "HR & Logistics",
      showGroupPhoto: false,
      groupPhoto: "",
      directors: [
        { name: "Laiba Khalid", role: "Director", image: "images/team/laiba-khalid.jpg" },
        { name: "Samana Zainab", role: "Director", image: "images/team/samana-zainab.jpg" }
      ],
      assistantDirectors: [
        { name: "Ahmad Zeeshan", role: "Assistant Director", image: "images/team/ahmad-zeeshan.jpg" },
        { name: "Asjad Ul Haq", role: "Assistant Director", image: "images/team/placeholder-male.jpg" },
        { name: "Kashmala Safdar", role: "Assistant Director", image: "images/team/placeholder-female.jpg" }
      ]
    },
    {
      id: "department-02",
      name: "Media & Design",
      showGroupPhoto: false,
      groupPhoto: "",
      directors: [
        { name: "Malik Anas", role: "Director", image: "images/team/placeholder-male.jpg" },
        { name: "Wajiha Shahid", role: "Director", image: "images/team/wajiha-shahid.jpg" }
      ],
      assistantDirectors: [
        { name: "Saad Niazi", role: "Assistant Director", image: "images/team/placeholder-male.jpg" }
      ]
    },
    {
      id: "department-03",
      name: "Outreach & Finance",
      showGroupPhoto: false,
      groupPhoto: "",
      directors: [
        { name: "Mahi Rai", role: "Director", image: "images/team/mahi-rai.jpg" },
        { name: "Rahmdil", role: "Director", image: "images/team/placeholder-male.jpg" }
      ],
      assistantDirectors: [
        { name: "Ahmad Abbas", role: "Assistant Director", image: "images/team/placeholder-male.jpg" },
        { name: "Hannan Shakil", role: "Assistant Director", image: "images/team/placeholder-male.jpg" },
        { name: "Safi Ullah", role: "Assistant Director", image: "images/team/placeholder-male.jpg" }
      ]
    },
    {
      id: "department-04",
      name: "Research",
      showGroupPhoto: false,
      groupPhoto: "",
      directors: [
        { name: "Bazaid Afzal", role: "Director", image: "images/team/placeholder-male.jpg" }
      ],
      assistantDirectors: [
        { name: "Raza Haider", role: "Assistant Director", image: "images/team/placeholder-male.jpg" },
        { name: "Sania Ali", role: "Assistant Director", image: "images/team/sania-ali.jpg" }
      ]
    },
    {
      id: "department-05",
      name: "Writing & Publications",
      showGroupPhoto: false,
      groupPhoto: "",
      directors: [
        { name: "Alishba Arshad", role: "Director", image: "images/team/alishba-arshad.jpg" }
      ],
      assistantDirectors: [
        { name: "Danyal Ahmad", role: "Assistant Director", image: "images/team/placeholder-male.jpg" }
      ]
    }
  ]
};
