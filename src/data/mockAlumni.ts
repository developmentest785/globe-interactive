export interface Alumni {
  first: string;
  last: string;
  country?: string;
  address: string;
  title: string;
  company?: string;
  major: string;
  degree: string;
  linkedIn?: string;
  gradYear: string;
  imageUrl?: string;
  details?: string;
}

export const mockAlumni: Alumni[] = [
  {
    first: "Micheal",
    last: "Johnston",
    major: "Technology Leadership and Innovation",
    degree: "B.S. OLS",
    gradYear: "1991",
    address: "Elko New Market, MN",
    title: "Ex officio Board President",
    imageUrl: `people/images/michael-johnston.jpg`,
    details: `
 <p>Michael E. Johnston, DM, MBA, FACHE</p>
      <p>President, Southern Market</p>
      <p>Allina Health</p>
      <p>
        Michael Johnston is President Southern Market for the Allina Healthcare
        System. Michael’s varied career includes both health care and
        manufacturing to include running hospital networks specifically focused
        on leadership development and coaching.
      </p>
      <p >
        Michael has been instrumental in positioning previous healthcare
          systems as leaders in developing and implementing management
          systems for their hospital networks. Under Michael’s leadership,
          these hospitals have achieved consistent improvement in patient
          quality metrics and unit cost expense reduction. Michael is a frequent
          speaker on operations leadership and lean topics to include trends,
          issues, and success strategies. Michael has spoken at both industry
          and health care conferences in the U.S. and Europe for organizations
          such as the Lean Six-Sigma World Conference, ASQ World Conference,
          Center for Lean Education and Research, Catalysis, PLAN, APICS, Rural
          Health Care Conference, HVN, Rieter International Leadership
          Conference, BAMA and TEAM (Toyota Europe Automotive
          Manufacturers).
      </p>
      <p>Michael has a wife Sarah and three children Kirsten, Thomas, and
          Evie.</p>
      <p 
          >Michael has a Bachelor of Science Degree from Purdue University in
          Organizational Leadership and Supervision, his Master's in Business
          Administration from Thomas More College as well as his Doctor of
          Management in Organizational Leadership.
      </p>
`,
  },
  {
    first: "Kirti",
    last: "Chintalapudi",
    major: "Engineering Technology",
    degree: "B.S. IET, M.S. IET",
    gradYear: "2015",
    address: "Mountain View, CA",
    title: "Board President",
    imageUrl: `people/images/kirti-chintalapudi.jpg`,
    details: `
    <p>
      Kirti Chintalapudi is a Chief of Staff at Hofincons Group, a company that
      specializes in Enterprise Asset Management (EAM) and Maintenance &amp;
      Integrity Management. In her current role, Kirti is responsible for
      providing critical support to the CEO and managing high-priority projects
      to optimize operations and drive business growth.
    </p>
    <p>
      Prior to joining Hofincons Group, Kirti worked as a Program Manager at
      Western Digital and Apple, where she honed her skills in New Product
      Development and Cross-Functional Team Leadership. She has a Masters and
      Bachelor's Degree in Industrial Engineering Technology from Purdue
      University.
    </p>
    <p>
      In addition to corporate endeavors, Kirti serves as the Vice President of
      the Purdue Technology Alumni Board. Kirti is also a certified yoga
      instructor with a passion for wellness and mindfulness. Outside of work,
      she values spending quality time with her family including her French
      bulldog, Zuko.
    </p>
`,
  },
  {
    first: "Steve",
    last: "Wake",
    major: "Computer and Information Technology",
    degree: "B.S. CPT",
    gradYear: "1991",
    address: "Broomfield, CO",
    title: "Board Vice President",
  },
  {
    first: "Miki",
    last: "Ishikawa",
    major: "Computer Graphics Technology",
    degree: "B.S CGT",
    gradYear: "1997",
    address: "Buffalo Grove, IL",
    title: "Board Member",
  },
  {
    first: "Carlos",
    last: "Simpson",
    major: "Technology Leadership and Innovation",
    degree: "B.S. OLS",
    gradYear: "2016",
    address: "Indianapolis, IN",
    title: "Board Secretary",
  },
  {
    first: "Tomas",
    last: "Turriff-Ortega",
    major: "Engineering Technology",
    degree: "B.S. IET",
    gradYear: "2022",
    address: "Indianapolis, IN",
    title: "Board Member",
  },
  {
    first: "Leon A.",
    last: "Bogucki",
    major: "Mechanical Engineering Technology",
    degree: "B.S. MET",
    gradYear: "1997",
    address: "Rolling Prairie, IN",
    title: "Board Member",
    imageUrl: `people/images/leon-bogucki.jpg`,
    details: `<p>I graduated from Purdue in May 1997.</p>

      <p>I have a BS in Mechanical Engineering Technology.</p>

      <p>
        I also have an AS in Computer Integrated Manufacturing Technology and an
        AS in Mechanical Engineering Technology.
      </p>

      <p>I obtained all of these from Purdue University, West Lafayette, IN.</p>
      <p>
        My current job is a Product/Process Engineer for the plastic department
        at Jaeger-Unitek.
      </p>`,
  },
  {
    first: "Mark S",
    last: "LeMire",
    major: "Mechanical Engineering Technology",
    degree: "B.S. MET",
    gradYear: "1992",
    address: "Wausau, WI",
    title: "Board Member",
  },
  {
    first: "Laura",
    last: "Horsky",
    major: "Computer Information Technology",
    degree: "B.S. CIT",
    gradYear: "2001",
    address: "Charlotte, NC",
    title: "Board Member",
    imageUrl: `people/images/laura-horsky.jpg`,
    details: `
      <p>
        Laura Horsky (2001 CPT) is a Sr. Customer Solutions Manager and
        Principal CSM at Amazon Web Services. She leads a team of Customer
        Solutions Managers supporting Global Financial Services organizations to
        accelerate customer’s cloud journey to drive business value. Spanning
        Financial Services, Private, and Public sector, Laura’s career has
        focused on Infrastructure, Business Resiliency, Network Operations,
        Security, and Service Management. She holds a Master’s in IT Security
        from University of North Carolina at Charlotte. Laura resides in
        Charlotte, NC with her husband Kevin and two daughters Anna and Kelsey.
      </p>`,
  },
  {
    first: "Adela",
    last: "Creasy",
    major: "Engineering Technology",
    degree: "B.S. ET",
    gradYear: "2002",
    address: "Zionsville, IN",
    title: "Board Member",
  },
  {
    first: "Sean",
    last: "Eckhart",
    major: "Technology Leadership and Innovation",
    degree: "B.S. TLI",
    gradYear: "2007",
    address: "Franklin, TN",
    title: "Board Member",
  },
  {
    first: "Cooper Grant",
    last: "Burleson",
    major: "Aviation Technology, Aeronautic Engr Technology",
    degree: "B.S. AET, MSAAM ATT",
    gradYear: "2019, 2020",
    address: "Houston, TX",
    title: "Board Member",
    imageUrl: `people/images/cooper-burleson.jpg`,
    details: `
    <p>
      A Graduate of Purdue University’s College of Technology with a B.S. in
      Aeronautical Engineering Technology and an M.S. in Aerospace Management,
      Cooper’s field of expertise lies in mission operations and planning as
      well as and commercial platform operations and development.
    </p>

    <p>
      Cooper has previously worked in Washington D.C. at the Commercial
      Spaceflight Federation, where he oversaw the drafting of new-age
      commercial space policy pertaining to the commercialization of the
      International Space Station, as well as coordinated the launch of Moon
      Express’s TM MX-model Lunar Landers. In 2020, Cooper started work in
      Houston at NASA’s Mission Control at Johnson Space Center as a Lead
      Increment Engineer under the HSFTIC Contract overseeing the development
      and execution of NASA’s 65th ISS Increment.
    </p>
    <p>
      Most recently, Cooper has been promoted to the HSFTIC Program Integrator
      for NASA’s Commercial LEO Development Program (CLDP) which aims to
      cultivate new commercial opportunities (PAM), destinations (CDFF), and
      other NASA / Private Space work in Low-Earth Orbit as the ISS approaches
      its retirement in 2030. In this role, he oversees a team of 25+ NASA
      contractors in all Program Offices of the CLDP.
    </p>
`,
  },
  {
    first: "Adam",
    last: "Ashouri",
    major: "Construction Management Technology",
    degree: "B.S. CMT",
    gradYear: "2014",
    address: "Indianapolis, IN",
    title: "Board Member",
    imageUrl: `people/images/adam-ashouri.jpg`,
    details: `
    <p>
      The 16<sup>th</sup> person in his family to attend Purdue University, Adam
      Ashouri is a Boilermaker through-and-through. Graduating with a Bachelor
      of Science in Construction Management in 2014, Adam has worked in the
      Construction Industry for going on ten years. He is currently a Senior
      Project Manager at Meyer-Najem Construction, which serves commercial
      clients in the Indianapolis, Indiana area. His experience includes
      projects in the healthcare, advanced manufacturing, pharmaceutical, higher
      education, and K-12 market segments.
    </p>

    <p>
      Adam takes pride in tackling complex, mission-critical projects and
      delivering them safely, on time, and within budget. In addition to his
      professional duties, Adam has served other community organizations
      including Friends of Riley, the American Society for Healthcare
      Engineering, and the Indiana Society for Healthcare Engineering. He
      continued his studies in 2018, earning an MBA from Butler University in
      2020.
    </p>

    <p>
      Adam lives in Indianapolis, IN with his wife, Ashley. They both recently
      welcomed their first born, Cameron, to their family in May 2022. When Adam
      isn’t working, you’ll find him golfing, enjoying the outdoors, cooking
      something on his smoker, or rooting on the Boilermakers.
    </p>
    `,
  },
  {
    first: "Ibidayo",
    last: "Awosola",
    major: "Computer Information Technology",
    degree: "M.S. CIT",
    gradYear: "2019",
    address: "Indianapolis, IN",
    title: "Board Member",
  },
  {
    first: "Faizan",
    last: "Ali Siddiqi",
    major: "Computer Information Technology",
    degree: "B.S. CIT",
    gradYear: "2001",
    address: "Mississauga ON",
    title: "Board Member",
  },
  {
    first: "Daniel",
    last: "Gray",
    major: "Construction Management Technology",
    degree: "BS CMT",
    gradYear: "1997",
    address: "San Antonio, TX",
    title: "Board Member",
  },
  {
    first: "Aisha",
    last: "Washington",
    major: "Computer Information Tehcnology",
    degree: "B.S. CIT",
    gradYear: "1999",
    address: "Fortville, IN",
    title: "Board Member",
  },
  {
    first: "Janet",
    last: "York",
    major: "Computer Information Technology",
    degree: "M.S. CIT",
    gradYear: "2019",
    address: "Lafayette, IN",
    title: "Board Member",
  },
];
